import { useState } from 'react';
import { LINKS, LINK_UPS } from '../shared/links';
import * as Styled from './Nav.styles';

export const Nav: React.FC = () => {
    const [selectedLink, setSelectedLink] = useState<string | null>(null);
    const [hidden, setHidden] = useState<boolean>(true);

    return (
        <Styled.Nav>
            <Styled.NavbarOuter>
                <div>
                    <Styled.NavLinks>
                        {LINKS.map((link) => (
                            <Styled.NavLink
                                key={link}
                                onMouseDown={(): void => {
                                    setSelectedLink(link);
                                    setHidden(!hidden && selectedLink === link);
                                }}
                                isUPS={link === LINK_UPS}
                                isSelected={selectedLink === link && !hidden}
                            >
                                <a>{link}</a>
                            </Styled.NavLink>
                        ))}
                    </Styled.NavLinks>
                </div>
                {/*
                <NavBox selectedLink={selectedLink} hidden={hidden} />
                  */}
            </Styled.NavbarOuter>
        </Styled.Nav>
    );
};
