import React from 'react';

export default () => <div className="nav-box-services">
    <h3>Services</h3>
    <ul className="nav-dropdown">
        <li>
            {'Gateway '}
            <em>{'(DHCP via SH3, ISP: Virgin Media)'}</em>
        </li>
        <li>
            {'Router '}
            <em>{'(IPv4 and IPv6)'}</em>
        </li>
        <li>
            {'Firewall '}
            <em>{'(iptables)'}</em>
        </li>
        <li>
            {'DNS server '}
            <em>{'(bind9)'}</em>
        </li>
        <li>{'File storage '}<em>{'(zfs)'}</em></li>
        <li>{'Dokku container host'}</li>
        <li>{'Media streaming '}<em>{'(Plex)'}</em></li>
    </ul>
</div>;

