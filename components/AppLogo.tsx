import styled from '@emotion/styled';
import { rem } from 'polished';

import { squid } from './AppLogo.images';

const LogoOuter = styled.div`
    background-image: url(${squid.x1});
    background-size: 450px 267px;
    @media (min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        background-image: url(${squid.x2});
    }

    height: ${rem(267)};
    width: ${rem(450)};
`;

export const AppLogo: React.FC = () => {
    return <LogoOuter />;
};
