import axios from 'axios';

import { Component, h } from 'preact';

const TIMER_RESOLUTION = 50;
const TIME_BETWEEN_SYNC = 10000;

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
        return <div className="uptime-counter">
            <span>{'Uptime ms:'}</span>
            <span>{this.state.uptimeMS}</span>
            <span>{'Hours:'}</span>
            <span>{Math.round(this.state.uptimeMS / 1000 / 3600 * 100) / 100}</span>
        </div>;
    }
}

