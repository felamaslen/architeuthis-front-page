import React, { useState, useCallback } from 'react';
import classNames from 'classnames';

import NavBox from './nav-box';

import { LINKS } from 'constants/links';

export default function Nav() {
    return (
        <div className="navbar-outer">
            <NavBox selectedLink={selectedLink} hidden={hidden} />
        </div>
    );
}
