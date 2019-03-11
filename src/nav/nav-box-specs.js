import React, { Component } from 'react';
import classNames from 'classnames';

export default class NavBoxSpecs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: -1,
            hidden: true
        };
    }
    render() {
        const specs = [
            'CPU: Intel Celeron G1850 2.90GHz',
            'RAM: Kingston 8GB ECC DDR3',
            'HDD: WD Red 2TB (x2)',
            'SSD: Kingston 120GB',
            'PSU: 250W FlexATX PSU',
            'Case: CFI A7879 Mini-ITX',
            'Motherboard: ASRock E3C2224D2I'
        ];

        const specsList = specs.map((spec, key) => {
            const onActivate = () => this.setState({ selected: key, hidden: false });
            const onDeactivate = () => this.setState({ hidden: true });

            return <li className="spec" onMouseOver={onActivate} onMouseOut={onDeactivate}>{spec}</li>;
        });

        const specsPreviewClass = classNames({
            [`specs-preview spec-${this.state.selected}`]: true,
            hidden: this.state.hidden
        });

        return <div className="nav-box-specs">
            <h3>Specs</h3>
            <ul className="nav-dropdown">
                {specsList}
            </ul>
            <div className={specsPreviewClass} />
        </div>;
    }
}

