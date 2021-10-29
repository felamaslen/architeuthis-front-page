const express = require('express');
const path = require('path');
const dns = require('dns');
const os = require('os');

if (process.env.DNS_SERVERS) {
    dns.setServers([process.env.DNS_SERVERS]);
}

const { version } = require('../package.json');

const getConfig = require('./config');
const { getLogger } = require('./logger');

function getClientHostname(logger, req) {
    const clientIpRaw = req.headers['x-forwarded-for'] || req.ip;

    return new Promise((resolve) => {
        dns.reverse(clientIpRaw, (err, hostnames) => {
            if (err) {
                logger.warn('DNS reverse lookup failed for %s', clientIpRaw);
                logger.verbose('DNS error: %s', err.message);

                return resolve(clientIpRaw);
            }

            return resolve(hostnames[0]);
        });
    });
}

const getUptime = () => os.uptime();

function setupClient(app) {
    app.use(express.static(path.resolve(__dirname, '../../client/static')));
}

function run() {
    const config = getConfig();
    const logger = getLogger(config);

    const app = express();

    app.get('/health', (_, res) => {
        res.send('ok');
    });

    app.get('/uptime', (_, res) => {
        const uptime = getUptime();

        res.json({ uptime });
    });

    app.get('/ups-status', async (_, res) => {
        try {
            const upsStatus = await getUPSStatus(config, logger);

            res.json({ upsStatus });
        } catch (err) {
            logger.error('Error getting UPS status: %s', err.message);

            res.status(500).json({ status: 'Error getting UPS status' });
        }
    });

    app.get('/', async (req, res) => {
        const clientIp = await getClientHostname(logger, req);

        const uptime = getUptime();

        let ups = {};
        try {
            ups = await getUPSStatus(config, logger);
        } catch {
            logger.warn('Rendering empty UPS info');
        } finally {
            res.render('index', {
                __WDS__: config.__WDS__,
                version,
                clientIp,
                uptime,
                ups,
                ...config.common
            });
        }
    });

    const getFavicon = (_, res) =>
        res.sendFile(path.resolve(__dirname, '../src/images/favicon.jpg'));

    app.get('/favicon.ico', getFavicon);
    app.get('/favicon.jpg', getFavicon);

    setupClient(app);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        logger.info('Server listening on port %s', port);
    });
}

module.exports = {
    run
};
