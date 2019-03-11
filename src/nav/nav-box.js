import React, { Component } from 'react';
import classNames from 'classnames';

import NavBoxSpecs from './nav-box-specs';
import NavBoxServices from './nav-box-services';
import NavBoxUPS from './nav-box-ups';

export default class NavBox extends Component {
    getInnerComponent(index) {
        if (index === 'specs') {
            return <NavBoxSpecs />;
        }
        if (index === 'services') {
            return <NavBoxServices />;
        }
        if (index === 'ups') {
            return <NavBoxUPS />;
        }

        return null;
    }
    render({ selected, hidden }) {
        const className = classNames({
            'nav-box-outer': true,
            hidden
        });

        return <div className={className}>
            <div className="nav-box">
                <div className="inner">
                    {this.getInnerComponent(selected)}
                </div>
            </div>
        </div>;
    }
}

