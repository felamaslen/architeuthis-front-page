import styled from '@emotion/styled';
import { rem, rgb } from 'polished';

import { NavDropdown } from './NavDropdown';

const Deprecated = styled.div`
    color: ${rgb(90, 90, 90)};
    font-style: italic;

    h5 {
        margin: 0 0 ${rem(8)} 0;
    }
`;

export const NavBoxServices: React.FC = () => (
    <div>
        <h3>Services</h3>
        <NavDropdown>
            <li>
                File storage <em>(zfs)</em>
            </li>
            <li>Kubernetes cluster</li>
            <li>
                Media streaming <em>(plex)</em>
            </li>
        </NavDropdown>
        <Deprecated>
            <h5>Deprecated:</h5>
            <NavDropdown>
                <li>DNS server (bind9)</li>
                <li>Firewall (iptables)</li>
                <li>Router (IPv4 and IPv6)</li>
                <li>Gateway (DHCP via SH3; ISP: Virgin Media)</li>
                <li>Mail server</li>
                <li>Dokku container host</li>
            </NavDropdown>
        </Deprecated>
    </div>
);
