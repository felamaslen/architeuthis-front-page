import getConfig from 'next/config';

type Props = {
    clientHostname: string;
};

const { publicRuntimeConfig } = getConfig();

export const Header: React.FC<Props> = ({ clientHostname }) => (
    <header>
        <h1>{publicRuntimeConfig.NEXT_PUBLIC_TITLE}</h1>
        <h2>{publicRuntimeConfig.NEXT_PUBLIC_SERVER_HOSTNAME}</h2>
        <h5>Viewed from {clientHostname}</h5>
    </header>
);
