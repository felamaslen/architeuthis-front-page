import { useState } from 'react';
import { Links } from '../shared/links';
import * as Styled from './Nav.styles';
import { NavBox } from './NavBox';

export const Nav: React.FC = () => {
    const [selectedLink, setSelectedLink] = useState<Links | null>(null);
    const [hidden, setHidden] = useState<boolean>(true);

    return (
        <Styled.Nav>
            <Styled.NavbarOuter>
                <div>
                    <Styled.NavLinks>
                        {Object.values(Links).map((link) => (
                            <Styled.NavLink
                                key={link}
                                onMouseDown={(): void => {
                                    setSelectedLink(link);
                                    setHidden(!hidden && selectedLink === link);
                                }}
                                isUPS={link === Links.UPS}
                                isSelected={selectedLink === link && !hidden}
                            >
                                <a>{link}</a>
                            </Styled.NavLink>
                        ))}
                    </Styled.NavLinks>
                </div>
                <NavBox selectedLink={selectedLink} hidden={hidden} />
            </Styled.NavbarOuter>
        </Styled.Nav>
    );
};
