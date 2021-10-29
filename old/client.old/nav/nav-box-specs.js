import React, { useState, useCallback } from 'react';
import classNames from 'classnames';

const SPECS = [
    'CPU: Intel Celeron G1850 2.90GHz',
    'RAM: Kingston 8GB ECC DDR3',
    'HDD: WD Red 2TB (x2)',
    'SSD: Kingston 120GB',
    'PSU: 250W FlexATX PSU',
    'Case: CFI A7879 Mini-ITX',
    'Motherboard: ASRock E3C2224D2I'
];

export default function NavBoxSpecs() {
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [hidden, setHidden] = useState(true);

    const specsPreviewClass = classNames('specs-preview', `spec-${selectedIndex}`, {
        hidden
    });

    const makeOnActivate = useCallback(index => () => {
        setSelectedIndex(index);
        setHidden(false);
    });

    const onDeactivate = useCallback(() => setHidden(true));

    return (
        <div className="nav-box-specs">
            <h3>Specs</h3>
            <ul className="nav-dropdown">
                {SPECS.map((spec, index) => (
                    <li key={spec}
                        className="spec"
                        onMouseOver={makeOnActivate(index)}
                        onMouseOut={onDeactivate}>

                        {spec}
                    </li>
                ))}
            </ul>
            <div className={specsPreviewClass} />
        </div>
    );
}

