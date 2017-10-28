import { Component, h } from 'preact';
import classNames from 'classnames';
import axios from 'axios';

const TIMER_RESOLUTION = 50;
const TIME_BETWEEN_SYNC = 10000;
const CLOCK_DIGITS = 30;

function getClockStatus(timeMS) {
    const seconds = Math.floor(timeMS / 1000);

    return new Array(CLOCK_DIGITS).fill(0)
        .reduce(({ remaining, digits }, digit, index) => {
            const digitStatus = remaining % 2;

            return {
                remaining: (remaining - digitStatus) / 2,
                digits: [...digits, digitStatus]
            };

        }, { remaining: seconds, digits: [] })
        .digits
        .reverse();
}

export default class UptimeCounter extends Component {
    constructor(props) {
        super(props);

        const now = Date.now();

        this.state = {
            uptimeMS: globalConfig
                ? globalConfig.uptime * 1000
                : 0,
            lastUpdateTime: now,
            lastServerUpdateTime: now
        };

        this.timer = null;
    }
    updateUptime(uptimeMS, fromServer = false) {
        clearTimeout(this.timer);

        const lastUpdateTime = Date.now();

        let lastServerUpdateTime = this.state.lastServerUpdateTime;
        if (fromServer) {
            lastServerUpdateTime = lastUpdateTime;
        }

        this.setState({
            uptimeMS,
            lastUpdateTime,
            lastServerUpdateTime
        });

        this.timer = setTimeout(() => this.setTimer(), TIMER_RESOLUTION);
    }
    async synchronise() {
        try {
            const response = await axios.get('uptime')
            const uptime = Number(response.data.uptime) * 1000;

            this.updateUptime(uptime, true);
        }
        catch (err) {
            console.error('Error getting uptime', err);
        }
    }
    setTimer() {
        const now = Date.now();

        if (now - this.state.lastServerUpdateTime > TIME_BETWEEN_SYNC) {
            this.synchronise();
        }

        const timeDiff = now - this.state.lastUpdateTime;

        this.updateUptime(this.state.uptimeMS + timeDiff);
    }
    componentDidMount() {
        if (this.state.uptimeMS) {
            this.setTimer();
        }
        else {
            this.synchronise();
        }
    }
    render() {
        const digits = getClockStatus(this.state.uptimeMS)
            .map(on => {
                const classes = classNames({
                    'clock-digit': true,
                    on
                });

                return <span className={classes} />;
            });

        return <div className="uptime-counter">{digits}</div>;
    }
}

