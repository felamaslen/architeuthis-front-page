import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import NavBoxSpecs from './nav-box-specs';
import NavBoxServices from './nav-box-services';
import NavBoxUPS from './nav-box-ups';

import { LINK_SPECS, LINK_SERVICES, LINK_UPS } from 'constants/links';

const BOX_COMPONENTS = {
    [LINK_SPECS]: NavBoxSpecs,
    [LINK_SERVICES]: NavBoxServices,
    [LINK_UPS]: NavBoxUPS
};

function BoxComponent({ selectedLink }) {
    const Component = BOX_COMPONENTS[selectedLink];

    return (
        <Component />
    );
}

BoxComponent.propTypes = {
    selectedLink: PropTypes.string.isRequired
};

export default function NavBox({ selectedLink, hidden }) {
    const className = classNames('nav-box-outer', { hidden });

    return (
        <div className={className}>
            <div className="nav-box">
                <div className="inner">
                    {selectedLink && <BoxComponent selectedLink={selectedLink} />}
                </div>
            </div>
        </div>
    );
}

NavBox.propTypes = {
    selectedLink: PropTypes.string,
    hidden: PropTypes.bool
};

