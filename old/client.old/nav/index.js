import React, { useState, useCallback } from 'react';
import classNames from 'classnames';

import NavBox from './nav-box';

import { LINKS } from 'constants/links';

export default function Nav() {
    const [selectedLink, setSelectedLink] = useState(null);
    const [hidden, setHidden] = useState(true);

    const makeOnActivate = useCallback(link => () => {
        setSelectedLink(link);
        setHidden(Boolean(!hidden && selectedLink === link));

    }, [selectedLink, hidden]);

    return (
        <div className="navbar-outer">
            <div className="nav-links-outer">
                <ul className="nav-links">
                    {LINKS.map(link => {
                        const className = classNames('nav-link', `nav-link-${link}`, {
                            selected: selectedLink === link && !hidden
                        });

                        return (
                            <li key={link}
                                className={className}
                                onMouseDown={makeOnActivate(link)}
                            >
                                <a>{link}</a>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <NavBox selectedLink={selectedLink} hidden={hidden} />
        </div>
    );
}

