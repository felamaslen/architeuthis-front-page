import styled from '@emotion/styled';
import { rem } from 'polished';

export const NavDropdown = styled.ul`
    display: flex;
    margin-bottom: ${rem(16)};
    flex-flow: column;

    li {
        padding: 0.3em 0;
        transition: background 0.3s ease;
    }
`;
