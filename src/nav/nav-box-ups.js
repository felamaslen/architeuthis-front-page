import { h, Component } from 'preact';
import dateFormat from 'dateformat';

const ups = JSON.parse(globalConfig.ups).props;

export default () => <div className="nav-box-ups">
    <h3>UPS</h3>
    <ul className="nav-dropdown">
        <li>{'Date: '}{dateFormat(ups.date, 'HH:MM yyyy-mm-dd')}</li>
        <li>{'Model: '}{ups.model}</li>
        <li>{'Load: '}{ups.load}</li>
        <li>{'Charge: '}{ups.charge}</li>
        <li>{'Backup time: '}{ups.backupTime}</li>
        <li>{'Transfers: '}{ups.transfers}</li>
        <li>{'Last power failure: '}{dateFormat(ups.lastPowerFailure, 'dddd, mmmm yyyy HH:MM:ss')}</li>
        <li>{'Time on battery: '}{ups.timeOnBattery}</li>
    </ul>
</div>;

