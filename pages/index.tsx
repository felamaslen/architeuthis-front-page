import dns from 'dns';
import type { IncomingMessage } from 'http';
import type { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import { ContainerOuter, Header, Nav } from '../components';
import { AppLogo } from '../components/AppLogo';
import { UptimeCounter } from '../components/UptimeCounter';
import { logger } from '../shared/logger';
import { getSystemUptime } from '../shared/uptime';

type Props = {
    clientHostname: string;
    uptime: number;
};

const Home: NextPage<Props> = ({ clientHostname, uptime }) => (
    <>
        <Head>
            <title>{process.env.NEXT_PUBLIC_TITLE}</title>
        </Head>
        <ContainerOuter>
            <Nav />
            <Header clientHostname={clientHostname} />
            <UptimeCounter initialUptime={uptime} />
            <AppLogo />
        </ContainerOuter>
    </>
);

async function getClientHostname(req: IncomingMessage | undefined): Promise<string> {
    const clientIps = req?.headers['x-real-ip'] ?? req?.socket.remoteAddress;
    const clientIp = Array.isArray(clientIps) ? clientIps[0] : clientIps;

    if (!clientIp) {
        return '<unknown>';
    }

    return new Promise<string>((resolve) => {
        dns.reverse(clientIp, (err, hostnames) => {
            if (err) {
                logger.warn('DNS reverse lookup failed for %s', clientIp);
                logger.verbose('DNS error: %s', err.message);
                resolve(clientIp);
            } else {
                resolve(hostnames[0] ?? clientIp);
            }
        });
    });
}

export async function getServerSideProps(ctx: NextPageContext): Promise<{ props: Props }> {
    const clientHostname = await getClientHostname(ctx.req);
    const uptime = getSystemUptime();
    return { props: { clientHostname, uptime } };
}

export default Home;
