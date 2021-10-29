import { useState } from 'react';

import * as Styled from './NavBoxSpecs.styles';
import { Specs } from './NavBoxSpecs.types';
import { NavDropdown } from './NavDropdown';

export const NavBoxSpecs: React.FC = () => {
    const [selectedSpec, setSelectedSpec] = useState<Specs | null>(null);
    const [hidden, setHidden] = useState<boolean>(true);

    return (
        <div>
            <h3>Specs</h3>
            <NavDropdown>
                {Object.entries(Specs).map(([key, spec]) => (
                    <Styled.Spec
                        key={key}
                        onMouseOver={(): void => {
                            setSelectedSpec(spec);
                            setHidden(false);
                        }}
                        onMouseOut={(): void => setHidden(true)}
                    >
                        {spec}
                    </Styled.Spec>
                ))}
            </NavDropdown>
            <Styled.SpecsPreview isHidden={hidden} spec={selectedSpec} />
        </div>
    );
};
