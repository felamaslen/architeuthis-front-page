import { css } from '@emotion/react';

import { colors } from './variables';

export const globalStyles = css`
    body {
        background: ${colors.background};
        color: ${colors.primary};
        font-family: arial, helvetica, sans-serif;
        ${
            undefined /*
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell,
        Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    */
        }
        margin: 0;
        overflow-x: hidden;
        padding: 0;
        text-align: center;
    }

    header,
    footer {
    }

    a:link {
        cursor: pointer;
    }
`;
