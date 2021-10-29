type Props = {
    clientHostname: string;
};

export const Header: React.FC<Props> = ({ clientHostname }) => (
    <header>
        <h5>Viewed from {clientHostname}</h5>
    </header>
);
