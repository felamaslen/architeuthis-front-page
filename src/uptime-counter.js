/* global globalConfig:false */
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import axios from 'axios';

const TIMER_RESOLUTION = 250;
const TIME_BETWEEN_SYNC = 10000;
const CLOCK_DIGITS = 30;

const INSTALL_TIME = globalConfig.installTime || 0;

const getBinaryClock = seconds => new Array(CLOCK_DIGITS)
    .fill(0)
    .reduce(({ remaining, digits }) => {
        const digitStatus = remaining % 2;

        return {
            remaining: (remaining - digitStatus) / 2,
            digits: [...digits, digitStatus]
        };
    }, { remaining: seconds, digits: [] })
    .digits
    .reverse();

function getClockStatus(uptime, now) {
    const uptimeSeconds = Math.floor(uptime / 1000);
    const allTimeSeconds = Math.floor(now / 1000) - INSTALL_TIME;

    const clockUptime = getBinaryClock(uptimeSeconds);
    const clockAllTime = getBinaryClock(allTimeSeconds);

    return clockUptime.map((on, index) => ({
        on,
        half: clockAllTime[index]
    }));
}

function uptimeFormat(timeMS) {
    const seconds = Math.floor(timeMS / 1000);

    const abbrev = [
        ['day', 86400],
        ['hour', 3600],
        ['min', 60],
        ['sec', 1]
    ];

    const timeString = abbrev
        .reduce(({ text, remaining }, [str, secs]) => {
            const numOfThisCategory = Math.floor(remaining / secs);

            if (numOfThisCategory) {
                const plural = numOfThisCategory === 1
                    ? str
                    : `${str}s`;

                text.push(`${numOfThisCategory} ${plural}`);
            }

            return { text, remaining: remaining % secs };

        }, { text: [], remaining: seconds })
        .text
        .join(', ');

    return `Up ${timeString}`;
}

export default function UptimeCounter() {
    const [uptime, setUptime] = useState(globalConfig
        ? globalConfig.uptime * 1000
        : 0
    );

    const now = useMemo(() => Date.now(), [uptime]);

    const [lastUpdateTime, setLastUpdateTime] = useState(now);
    const [lastServerUpdateTime, setLastServerUpdateTime] = useState(uptime
        ? now
        : 0
    );

    const timer = useRef(null);

    const setTimer = useCallback(() => {
        const timeDiff = Date.now() - lastUpdateTime;

        setUptime(uptime + timeDiff);

        timer.current = setTimeout(setTimer, TIMER_RESOLUTION);
    });

    useEffect(() => {
        setTimer();

        return () => clearTimeout(timer.current);
    }, []);

    const synchronise = useCallback(async () => {
        try {
            const { data: { uptime: uptimeSeconds } } = await axios.get('uptime');

            setUptime(Number(uptimeSeconds) * 1000);

            setLastUpdateTime(now);
            setLastServerUpdateTime(now);

        } catch (err) {
            console.error('Error getting uptime', err);
        }
    });

    useEffect(() => {
        if (!(uptime && now - lastServerUpdateTime <= TIME_BETWEEN_SYNC)) {
            synchronise();
        }

    }, [uptime]);

    const digits = getClockStatus(uptime, now)
        .map(({ on, half }, index) => {
            const classes = classNames({
                'clock-digit': true,
                half,
                on
            });

            return <span key={`digit-${index}`} className={classes} />;
        });

    return (
        <div className="uptime-outer">
            <div className="uptime-counter">{digits}</div>
            <div className="uptime-string">{uptimeFormat(uptime)}</div>
        </div>
    );
}

