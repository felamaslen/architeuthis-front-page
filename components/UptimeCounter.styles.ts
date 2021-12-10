import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { rem, rgba } from 'polished';

import { colors } from '../styles/variables';
import type { ClockStatusDigit } from './UptimeCounter.types';

export const UptimeCounter = styled.div`
    display: flex;
    margin: ${rem(16)} 0;
`;

export const ClockDigit = styled.span<ClockStatusDigit>`
    display: inline-block;
    position: relative;
    flex-grow: 1;
    flex-basis: 1em;
    height: ${rem(8)};
    margin: ${rem(1)};
    width: ${rem(8)};

    &::before,
    &::after {
        display: block;
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    &::before {
        z-index: 3;
        ${({ isHalf }) =>
            isHalf
                ? css`
                      background: ${rgba(colors.on, 0.3)};
                  `
                : undefined};
    }
    &::after {
        z-index: 2;
        background: rgb(41, 42, 43);
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);

        ${({ isOn }) =>
            isOn
                ? css`
                      background: ${colors.on};
                      box-shadow: 0 3px 6px ${rgba(0, 0, 0, 0.8)};
                  `
                : undefined};
    }

    @media screen and (min-width: 420px) {
        height: ${rem(12)};
        width: ${rem(12)};
    }

    @media screen and (min-width: 800px) {
        height: ${rem(24)};
        width: ${rem(24)};
    }
`;

export const UptimeString = styled.div`
    margin: ${rem(16)} 0;
`;
