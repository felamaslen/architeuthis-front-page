type Props = {
    clientHostname: string;
};

export const Header: React.FC<Props> = ({ clientHostname }) => (
    <header>
        <h2>{process.env.NEXT_PUBLIC_SERVER_HOSTNAME}</h2>
        <h5>Viewed from {clientHostname}</h5>
    </header>
);
