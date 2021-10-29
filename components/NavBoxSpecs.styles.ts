import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { rem, rgb } from 'polished';

import { specImages } from './NavBoxSpecs.images';
import { Specs } from './NavBoxSpecs.types';

export const Spec = styled.li`
    &:not(:last-child) {
        border-bottom: 1px solid ${rgb(192, 192, 192)};
    }
    &:hover {
        background: ${rgb(248, 248, 248)};
    }
`;

export const SpecsPreview = styled.div<{
    isHidden?: boolean;
    spec: Specs | null;
}>`
    margin: ${rem(8)} 0;
    width: ${rem(340)};
    height: ${rem(160)};
    transition: opacity 0.1s linear;

    ${({ isHidden = false }) =>
        isHidden
            ? css`
                  opacity: 0;
              `
            : undefined};

    ${({ spec }) =>
        spec
            ? css`
                  background-image: url(${specImages[spec].x1});
                  background-size: 340px 160px;
                  @media (min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
                      background-image: url(${specImages[spec].x2});
                  }
              `
            : undefined}
`;
