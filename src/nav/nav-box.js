import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import NavBoxSpecs from './nav-box-specs';
import NavBoxServices from './nav-box-services';
import NavBoxUPS from './nav-box-ups';

export default class NavBox extends Component {
    static propTypes = {
        selected: PropTypes.string,
        hidden: PropTypes.bool
    };
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
    render() {
        const { selected, hidden } = this.props;

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

