import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { rem } from 'polished';

export const NavBox = styled.div<{
    isHidden?: boolean;
}>`
    background: rgba(255, 255, 255, 0.86);
    border-radius: 0.1em 0.1em 0.3em 0.3em;
    box-shadow: 0 3px 14px rgba(190, 90, 0, 0.5);
    color: black;
    display: flex;
    left: 50%;
    overflow: hidden;
    min-width: ${rem(300)};
    position: absolute;
    top: ${rem(38)};
    transform: scaleY(1) translateX(-50%);
    transform-origin: top;
    transition: transform 0.2s cubic-bezier(0, 1, 0.5, 1);
    z-index: 10;

    ${({ isHidden = false }) =>
        isHidden
            ? css`
                  transform: scaleY(0);
              `
            : undefined};

    ul {
        margin-top: 0;
        padding: 0;
        list-style: none;
    }
`;

export const Box = styled.div`
    width: 100%;
`;

export const Inner = styled.div`
    width: 100%;
    position: relative;
    z-index: inherit;
`;
