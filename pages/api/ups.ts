import path from 'path';
import fse from 'fs-extra';
import type { NextApiRequest, NextApiResponse } from 'next';

import { config } from '../../shared/config';
import { logger } from '../../shared/logger';
import { spawn } from 'child_process';
import { initialUPS, UPS } from '../../shared/ups';

const APCACCESS_CACHE_FILE = path.join(__dirname, '../../.apcaccess.cache');

type UPSStatusRaw = {
    fromCache: boolean;
    data: string;
};

function processUPSValues({ data }: UPSStatusRaw): UPS {
    const propsRaw = data
        .split('\n')
        .map((line) => line.match(/^([^\s]+).*?:\s*([^\s].*?)\s*$/))
        .filter((match): match is RegExpMatchArray => !!match && match.length > 1)
        .map(([, prop, value]) => [prop, value])
        .reduce<Record<string, string>>((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    type RawProcessor<K extends keyof UPS> = {
        key: K;
        rawKey: string;
        proc?: (value: string) => UPS[K];
    };

    const processDate: RawProcessor<'date'> = {
        key: 'date',
        rawKey: 'DATE',
        proc: (value) => new Date(value),
    };
    const processModel: RawProcessor<'model'> = {
        key: 'model',
        rawKey: 'MODEL',
    };
    const processLoad: RawProcessor<'load'> = {
        key: 'load',
        rawKey: 'LOADPCT',
        proc: (value) => {
            const match = value.match(/^([0-9]+)/);
            if (!match) {
                return null;
            }
            const [, loadPercent] = match;

            const loadWatts = (Number(loadPercent) * config.upsCapacity) / 100;

            return `${Number(loadPercent).toFixed(1)}% (${loadWatts.toFixed(1)}W)`;
        },
    };
    const processCharge: RawProcessor<'charge'> = {
        key: 'charge',
        rawKey: 'BCHARGE',
        proc: (value) => {
            const match = value.match(/^([0-9]+)/);
            if (!match) {
                return null;
            }
            return `${Number(match[1]).toFixed(0)}%`;
        },
    };
    const processBackupTime: RawProcessor<'backupTimeSeconds'> = {
        key: 'backupTimeSeconds',
        rawKey: 'TIMELEFT',
        proc: (value) => {
            const match = value.match(/^([^\s]+)/);
            if (!match) {
                return null;
            }
            return Number(match[1]) * 60;
        },
    };
    const processTransfers: RawProcessor<'transfers'> = {
        key: 'transfers',
        rawKey: 'NUMXFERS',
        proc: (value) => Math.round(Number(value)),
    };
    const processLastPowerFailure: RawProcessor<'lastPowerFailure'> = {
        key: 'lastPowerFailure',
        rawKey: 'XONBATT',
        proc: (value) => new Date(value),
    };
    const processTimeOnBattery: RawProcessor<'timeOnBatterySeconds'> = {
        key: 'timeOnBatterySeconds',
        rawKey: 'TONBATT',
        proc: (value) => {
            const match = value.match(/^(.*) Seconds$/);
            if (!match) {
                return null;
            }
            return Number(match[1]);
        },
    };

    return [
        processDate,
        processModel,
        processLoad,
        processCharge,
        processBackupTime,
        processTransfers,
        processLastPowerFailure,
        processTimeOnBattery,
    ].reduce<UPS>((obj, { key, rawKey, proc }) => {
        try {
            const value = proc?.(propsRaw[rawKey]) ?? propsRaw[rawKey];
            return { ...obj, [key]: value };
        } catch {
            return { ...obj, [key]: null };
        }
    }, initialUPS);
}

async function getUPSCacheExists(): Promise<boolean> {
    const cacheFileExists = await fse.pathExists(APCACCESS_CACHE_FILE);
    if (!cacheFileExists) {
        return false;
    }
    try {
        const { mtime } = await fse.stat(APCACCESS_CACHE_FILE);

        const cacheNotStale = Date.now() - Number(mtime) < config.apcaccessCacheMaxAge;

        return cacheNotStale;
    } catch (err) {
        logger.error('Error reading APC cache file: %s', (err as Error).message);
        throw err;
    }
}

function runUPSStatusCommand(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => {
            logger.error('UPS command timed out');
            reject(new Error('Timeout running UPS command'));
        }, config.upsCommandTimeoutMs);

        const rejectWithError = (err: Error) => {
            logger.error('Error running UPS command: %s', err);

            clearTimeout(timeout);
            reject(new Error('Error running UPS command'));
        };

        let output = '';
        const [command, ...args] = config.upsCommand.split(' ');

        try {
            const apc = spawn(command, args);

            apc.stdout.on('data', (data) => {
                output += data;
            });

            apc.on('error', rejectWithError);

            apc.on('close', () => {
                clearTimeout(timeout);
                resolve(output);
            });
        } catch (err) {
            rejectWithError(err as Error);
        }
    });
}

async function getUPSStatusRaw(): Promise<UPSStatusRaw> {
    const upsCacheExists = await getUPSCacheExists();
    if (upsCacheExists) {
        const cachedData = await fse.readFile(APCACCESS_CACHE_FILE, 'utf8');
        return { fromCache: true, data: cachedData };
    }

    const freshData = await runUPSStatusCommand();
    try {
        await fse.writeFile(APCACCESS_CACHE_FILE, freshData);
    } catch (err) {
        logger.error('Error writing to UPS cache file: %s', (err as Error).message);
        throw new Error('Error writing cache');
    }

    return { fromCache: false, data: freshData };
}

async function getUPSStatus(): Promise<UPS> {
    const rawStatus = await getUPSStatusRaw();
    logger.debug('Got UPS status %s', rawStatus.fromCache ? 'from cache' : 'fresh');
    const status = processUPSValues(rawStatus);
    return status;
}

export default async function handler(
    _: NextApiRequest,
    res: NextApiResponse<UPS | { error: string }>,
): Promise<void> {
    try {
        const upsStatus = await getUPSStatus();
        res.status(200).json(upsStatus);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
}
