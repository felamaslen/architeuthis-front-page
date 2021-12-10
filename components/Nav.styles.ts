import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { rem, rgb } from 'polished';

export const Nav = styled.nav`
    border-bottom: 1px solid ${rgb(157, 157, 157)};
    display: flex;
    justify-content: center;
    user-select: none;
    width: 100%;
`;

export const NavbarOuter = styled.div`
    position: relative;
    height: ${rem(38)};
`;

export const NavLinks = styled.ul`
    display: flex;
    height: 100%;
    justify-content: space-between;
    list-style: none;
    margin: 0;
    min-width: 200px;
    padding: 0;
    width: 100%;
`;

export const NavLink = styled.li<{
    isSelected?: boolean;
    isUPS?: boolean;
}>`
    cursor: pointer;
    display: block;
    height: ${rem(38)};
    text-transform: capitalize;

    ${({ isUPS = false }) =>
        isUPS
            ? css`
                  text-transform: uppercase;
              `
            : undefined};

    &:hover {
        background: ${rgb(51, 51, 51)};
        color: ${rgb(239, 239, 239)};
    }
    &:active {
        background: ${rgb(236, 236, 236)};
        color: ${rgb(34, 34, 34)};
    }

    a {
        display: block;
        padding: 0 ${rem(8)};
        line-height: ${rem(36)};
    }

    ${({ isSelected = false }) =>
        isSelected
            ? css`
                  a {
                      border-bottom: 3px solid ${rgb(255, 153, 26)};
                  }
              `
            : undefined};
`;
