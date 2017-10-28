const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const logger = require('./logger');

const config = require('./config');

const APCACCESS_CACHE_FILE = path.join(__dirname, './.apcaccess.cache');

const TIMEOUT_COMMAND = 5000;

function processUPSValues({ data, ...rest }) {
    const propsRaw = data.split('\n')
        .map(line => line.match(/^([^\s]+).*?:\s*([^\s].*?)\s*$/))
        .filter(match => match && match.length > 1)
        .map(match => [match[1], match[2]])
        .reduce((obj, [key, prop]) => ({ ...obj, [key]: prop }), {});

    const props = [
        {
            key: 'date',
            rawKey: 'DATE',
            proc: value => new Date(value).getTime()
        },
        {
            key: 'model',
            rawKey: 'MODEL',
            proc: value => value
        },
        {
            key: 'load',
            rawKey: 'LOADPCT',
            proc: value => {
                const match = value.match(/^([0-9]+)/);

                const loadPct = +(match[1]);
                const loadWatts = loadPct * config.common.constants.upsCapacity / 100;

                return `${loadPct.toFixed(1)}% (${loadWatts.toFixed(1)}W)`;
            }
        },
        {
            key: 'charge',
            rawKey: 'BCHARGE',
            proc: value => `${(+value.match(/^([0-9]+)/)[1]).toFixed(0)}%`
        },
        {
            key: 'backupTime',
            rawKey: 'TIMELEFT',
            proc: value => `${(+value.match(/^([^\s]+)/)[1]).toFixed(0)} min`
        },
        {
            key: 'transfers',
            rawKey: 'NUMXFERS',
            proc: value => Math.round(+value)
        },
        {
            key: 'lastPowerFailure',
            rawKey: 'XONBATT',
            proc: value => new Date(value).getTime()
        },
        {
            key: 'timeOnBattery',
            rawKey: 'CUMONBATT',
            proc: value => value
        }
    ]
        .reduce((obj, { key, rawKey, proc }) => {
            try {
                const value = proc(propsRaw[rawKey]);

                obj[key] = value === null
                    ? '<not found>'
                    : value;
            }
            catch (err) {
                obj[key] = '<not found>';
            }

            return obj;

        }, {});

    return { props, ...rest };
}

function getUPSCacheExists() {
    return new Promise((resolve, reject) => {
        fs.open(APCACCESS_CACHE_FILE, 'r', err => {
            if (err) {
                logger('info', 'Couldn\'t access UPS cache file:', err);

                return resolve(false);
            }

            return fs.stat(APCACCESS_CACHE_FILE, (statErr, stats) => {
                if (statErr) {
                    logger('error', 'Couldn\'t stat UPS cache file', statErr);

                    return reject(statErr);
                }

                const mtime = +stats.mtime;

                const cacheNotStale = false; // Date.now() - mtime < config.common.constants.apcaccessCacheMaxAge;

                return resolve(cacheNotStale);
            });
        });
    });
}

function runUPSStatusCommand() {
    return new Promise((resolve, reject) => {
        let output = '';

        const args = (process.env.UPS_COMMAND || 'apcaccess').split(' ');

        logger('info', 'runUPSStatusCommand', ...args);

        const command = args.shift();

        const apc = spawn(command, args);

        const timeout = setTimeout(() => {
            logger('error', 'UPS command timed out');

            reject(new Error('Timeout on apcaccess'));
        }, TIMEOUT_COMMAND);

        apc.stdout.on('data', data => {
            logger('info', 'UPS command output:', data);

            output += data;
        });

        const rejectWithError = err => {
            logger('error', 'Error running UPS command', err);

            clearTimeout(timeout);

            reject(err);
        };

        apc.on('error', rejectWithError);
        apc.stderr.on('data', rejectWithError);

        apc.on('close', () => {
            clearTimeout(timeout);

            resolve(output);
        });
    });
}

function getUPSStatusRaw() {
    return new Promise(async (resolve, reject) => {
        const upsCacheExists = await getUPSCacheExists();

        if (upsCacheExists) {
            logger('info', 'Trying to get UPS data from cache');

            return fs.readFile(APCACCESS_CACHE_FILE, 'utf8', (err, data) => {
                if (err) {
                    logger('error', 'Error reading UPS cache file', err);

                    return reject(err);
                }

                return resolve({ fromCache: true, data });
            });
        }

        if (process.env.ONLY_CACHE === 'true') {
            logger('info', 'ONLY_CACHE set; not getting new UPS data');

            return resolve({ onlyCacheFail: true, data: '' });
        }

        try {
            const data = await runUPSStatusCommand();

            return fs.writeFile(APCACCESS_CACHE_FILE, data, err => {
                if (err) {
                    logger('error', 'Error writing to UPS cache file', err);

                    return reject(err);
                }

                return resolve({ fromCache: false, data });
            });
        }
        catch (err) {
            return reject(err);
        }
    });
}

function getUPSStatus() {
    return new Promise(async (resolve, reject) => {
        try {
            const rawStatus = await getUPSStatusRaw();

            const status = processUPSValues(rawStatus);

            return resolve(status);
        }
        catch (err) {
            return reject(err);
        }
    });
}

module.exports = { getUPSStatus };

