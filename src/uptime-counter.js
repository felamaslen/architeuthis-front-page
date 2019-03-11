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

function getClockStatus(uptime, now, lastUpdateTime) {
    const uptimeNow = uptime + now - lastUpdateTime;
    const allTime = now - INSTALL_TIME;

    const clockUptime = getBinaryClock(uptimeNow);
    const clockAllTime = getBinaryClock(allTime);

    return clockUptime.map((on, index) => ({
        on,
        half: clockAllTime[index]
    }));
}

function uptimeFormat(uptime) {
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

        }, { text: [], remaining: uptime })
        .text
        .join(', ');

    return `Up ${timeString}`;
}

export default function UptimeCounter() {
    const getNow = useCallback(() => Math.floor(Date.now() / 1000));
    const [now, setNow] = useState(getNow());

    const [uptime, setUptime] = useState(globalConfig.uptime || 0);

    const [lastUpdateTime, setLastUpdateTime] = useState(now);

    const timer = useRef(null);

    const setTimer = useCallback(() => {
        setNow(getNow());

        timer.current = setTimeout(setTimer, TIMER_RESOLUTION);
    });

    useEffect(() => {
        setTimer();

        return () => clearTimeout(timer.current);
    }, []);

    const synchronise = useCallback(async () => {
        try {
            const { data: { uptime: uptimeSeconds } } = await axios.get('uptime');

            const newNow = getNow();

            setUptime(uptimeSeconds);

            setLastUpdateTime(newNow);

        } catch (err) {
            console.error('Error getting uptime', err);
        }
    });

    useEffect(() => {
        if (!(uptime && now - lastUpdateTime <= TIME_BETWEEN_SYNC)) {
            synchronise();
        }

    }, [uptime]);

    const digits = getClockStatus(uptime, now, lastUpdateTime)
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

