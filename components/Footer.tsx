import Image from 'next/image';
import { sizes } from '../styles/variables';

import * as Styled from './Footer.styles';

type Props = {
    services: {
        link: string;
        'title-short': string;
        title: string;
        description: string;
    }[];
    logos: {
        link: string;
        title: string;
        width?: number;
    }[];
};

export const Footer: React.FC<Props> = ({ logos, services }) => (
    <Styled.Footer>
        <Styled.LogosServices>
            {services.map(({ link, 'title-short': titleShort, title, description }) => (
                <Styled.LogoService key={titleShort}>
                    <a href={link} title={description}>
                        <Image
                            alt={title}
                            src={`/icons/services/${titleShort}@2x.png`}
                            height={sizes.service}
                            width={sizes.service}
                        />
                    </a>
                </Styled.LogoService>
            ))}
        </Styled.LogosServices>
        <Styled.LogosBrands>
            {logos.map(({ link, title, width }) => (
                <Styled.LogoBrand key={title}>
                    <a href={link} rel="nofollow noreferrer" target="_blank">
                        <Image
                            alt={title}
                            src={`/icons/brands/${title}@2x.png`}
                            height={sizes.brand}
                            width={width ?? sizes.brand}
                        />
                    </a>
                </Styled.LogoBrand>
            ))}
        </Styled.LogosBrands>
    </Styled.Footer>
);
