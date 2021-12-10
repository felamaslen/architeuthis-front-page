import getUnixTime from 'date-fns/getUnixTime';
import humanizeDuration from 'humanize-duration';
import pluralize from 'pluralize';
import { useEffect, useMemo, useRef, useState } from 'react';

import * as Styled from './UptimeCounter.styles';
import type { ClockStatusDigit } from './UptimeCounter.types';

const installTime = Number(process.env.NEXT_PUBLIC_INSTALLATION_TIME);

const timeBetweenSync = 30000;
const clockDigits = 30;

function useSynchronisedUptime(initialUptime: number): {
    uptime: number;
    now: number;
} {
    const [uptime, setUptime] = useState<number>(initialUptime);
    const [now, setNow] = useState<number>(getUnixTime(new Date()));
    const syncTimer = useRef<number>(0);
    const clockTimer = useRef<number>(0);

    useEffect(() => {
        clockTimer.current = window.setInterval(() => {
            setUptime((last) => last + 1);
            setNow(getUnixTime(new Date()));
        }, 1000);

        return (): void => {
            clearInterval(clockTimer.current);
        };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const requestNewUptime = async (): Promise<void> => {
            try {
                const res = await fetch('/api/uptime', {
                    signal: controller.signal,
                });
                const json = (await res.json()) as { uptime: number };
                setUptime(json.uptime);
            } catch (err) {
                console.warn('Error fetching uptime', err);
            }
        };

        syncTimer.current = window.setInterval(requestNewUptime, timeBetweenSync);

        return (): void => {
            controller.abort();
            clearInterval(syncTimer.current);
        };
    }, []);

    return { uptime, now };
}

function getBinaryClock(seconds: number): number[] {
    return Array(clockDigits)
        .fill(0)
        .reduce<{
            remainder: number;
            digits: number[];
        }>(
            ({ remainder, digits }) => {
                const digitStatus = remainder % 2;
                return { remainder: Math.floor(remainder / 2), digits: [digitStatus, ...digits] };
            },
            { remainder: seconds, digits: [] },
        ).digits;
}

function getClockStatus(uptime: number, now: number): ClockStatusDigit[] {
    const allTime = now - installTime;

    const clockUptime = getBinaryClock(uptime);
    const clockAllTime = getBinaryClock(allTime);

    return clockUptime.map<ClockStatusDigit>((value, index) => ({
        isOn: !!value,
        isHalf: !!clockAllTime[index],
    }));
}

type Props = {
    initialUptime: number;
};

const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: 'shortEn',
    languages: {
        shortEn: {
            y: (v) => pluralize('year', v),
            d: (v) => pluralize('day', v),
            h: (v) => pluralize('hour', v),
            m: (v) => pluralize('min', v),
            s: (v) => pluralize('sec', v),
        },
    },
});

export const UptimeCounter: React.FC<Props> = ({ initialUptime }) => {
    const { uptime, now } = useSynchronisedUptime(initialUptime);
    const clockStatus = useMemo<ClockStatusDigit[]>(
        () => getClockStatus(uptime, now),
        [uptime, now],
    );

    return (
        <div>
            <Styled.UptimeCounter>
                {clockStatus.map((digit, index) => (
                    <Styled.ClockDigit key={`digit-${index}`} {...digit} />
                ))}
            </Styled.UptimeCounter>
            <Styled.UptimeString>
                Up{' '}
                {shortEnglishHumanizer(uptime * 1000, {
                    units: ['y', 'd', 'h', 'm', 's'],
                })}
            </Styled.UptimeString>
        </div>
    );
};
