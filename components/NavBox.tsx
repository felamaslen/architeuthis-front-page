import { Links } from '../shared/links';
import * as Styled from './NavBox.styles';
import { NavBoxServices } from './NavBoxServices';
import { NavBoxSpecs } from './NavBoxSpecs';
import { NavBoxUPS } from './NavBoxUPS';

export type Props = {
    selectedLink: Links | null;
    hidden: boolean;
};

const BoxComponents: Record<Links, React.FC> = {
    [Links.Specs]: NavBoxSpecs,
    [Links.Services]: NavBoxServices,
    [Links.UPS]: NavBoxUPS
};

export const BoxComponent: React.FC<{
    selectedLink: NonNullable<Props['selectedLink']>;
}> = ({ selectedLink }) => {
    const Component = BoxComponents[selectedLink];
    return <Component />;
};

export const NavBox: React.FC<Props> = ({ selectedLink, hidden }) => {
    return (
        <Styled.NavBox isHidden={hidden}>
            <Styled.Box>
                <Styled.Inner>
                    {!!selectedLink && <BoxComponent selectedLink={selectedLink} />}
                </Styled.Inner>
            </Styled.Box>
        </Styled.NavBox>
    );
};
