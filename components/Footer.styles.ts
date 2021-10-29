import styled from '@emotion/styled';
import { rem, rgba } from 'polished';
import { sizes } from '../styles/variables';

export const Footer = styled.footer`
    display: flex;
    flex-flow: column;
    align-items: center;
`;

export const LogosServices = styled.ul`
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    margin: ${rem(24)} 0 0 0;
    padding: 0;
`;

export const LogoService = styled.li`
    margin: ${rem(3)} ${rem(8)};
    text-align: center;
    border-radius: ${rem(5)};
    box-shadow: 0 ${rem(5)} ${rem(6)} ${rgba(0, 0, 0, 0.3)};

    &:nth-child(1) {
        background-image: linear-gradient(
            rgba(255, 130, 157, 0.28) 0%,
            rgba(255, 64, 100, 0.3) 100%
        );
    }
    &:nth-child(2) {
        background-image: linear-gradient(
            rgba(210, 210, 34, 0.28) 0%,
            rgba(245, 230, 107, 0.3) 100%
        );
    }
    &:nth-child(3) {
        background-image: linear-gradient(
            rgba(86, 255, 157, 0.28) 0%,
            rgba(87, 230, 100, 0.3) 100%
        );
    }
    &:nth-child(4) {
        background-image: linear-gradient(rgba(35, 130, 255, 0.28) 0%, rgba(10, 64, 230, 0.3) 100%);
    }
    &:nth-child(5) {
        background-image: linear-gradient(
            rgba(120, 130, 255, 0.28) 0%,
            rgba(90, 64, 230, 0.3) 100%
        );
    }

    a {
        align-items: center;
        display: flex;
        justify-content: center;
        padding: ${rem(8)};
    }
`;

export const LogosBrands = styled(LogosServices)`
    margin: ${rem(16)} 0;
`;

export const LogoBrand = styled.li`
    margin: 0 ${rem(5)};
    height: ${rem(sizes.brand)};
    border-radius: ${rem(3)};
    overflow: hidden;

    a {
        align-items: center;
        display: flex;
        height: inherit;
        justify-content: center;
        text-indent: -9999px;
    }
`;
