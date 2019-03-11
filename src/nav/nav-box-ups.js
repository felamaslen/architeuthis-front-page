import { h, Component } from 'preact';
import dateFormat from 'dateformat';

export default () => {
    let { props } = JSON.parse(globalConfig.ups);

    if (!(props && props.date)) {
        props = {
            date: null,
            model: null,
            load: null,
            charge: null,
            backupTime: null,
            transfers: null,
            lastPowerFailure: null,
            timeOnBattery: null
        };
    }

    return <div className="nav-box-ups">
        <h3>UPS</h3>
        <ul className="nav-dropdown">
            <li>{'Date: '}{dateFormat(props.date, 'HH:MM yyyy-mm-dd')}</li>
            <li>{'Model: '}{props.model}</li>
            <li>{'Load: '}{props.load}</li>
            <li>{'Charge: '}{props.charge}</li>
            <li>{'Backup time: '}{props.backupTime}</li>
            <li>{'Transfers: '}{props.transfers}</li>
            <li>
                {'Last power failure: '}
                {props.lastPowerFailure &&
                        dateFormat(props.lastPowerFailure, 'dddd, mmmm dd yyyy HH:MM:ss') ||
                        'N/A'
                }
            </li>
            <li>{'Time on battery: '}{props.timeOnBattery}</li>
        </ul>
    </div>;
}

