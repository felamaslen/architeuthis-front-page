import dns from 'dns';
import fse from 'fs-extra';
import type { IncomingMessage } from 'http';
import path from 'path';

import type { NextPage, NextPageContext } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { AppLogo, ContainerOuter, Footer, Header, Nav } from '../components';
import { UptimeCounter } from '../components/UptimeCounter';
import { logger } from '../shared/logger';
import { getSystemUptime } from '../shared/uptime';

const { publicRuntimeConfig } = getConfig();

type Props = {
    clientHostname: string;
    services: Parameters<typeof Footer>[0]['services'];
    logos: Parameters<typeof Footer>[0]['logos'];
    uptime: number;
};

const Home: NextPage<Props> = ({ clientHostname, logos, services, uptime }) => (
    <>
        <Head>
            <title>{publicRuntimeConfig.NEXT_PUBLIC_TITLE}</title>
        </Head>
        <ContainerOuter>
            <Nav />
            <Header clientHostname={clientHostname} />
            <UptimeCounter initialUptime={uptime} />
            <AppLogo />
            <Footer logos={logos} services={services} />
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

    const servicesJsonString = await fse.readFile(
        path.resolve(__dirname, '../../../shared/services.json'),
        'utf8',
    );
    const { logos, services } = JSON.parse(servicesJsonString) as {
        services: Props['services'];
        logos: Props['logos'];
    };

    return { props: { clientHostname, logos, services, uptime } };
}

export default Home;
