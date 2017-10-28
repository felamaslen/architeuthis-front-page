const express = require('express');
const path = require('path');
const dns = require('dns');
const os = require('os');

const { version } = require('../package.json');

const { common } = require('./config');

const { getUPSStatus } = require('./ups');

function getClientHostname(req) {
    const clientIpRaw = req.headers['X-Forwarded-For'] || req.ip;

    return new Promise(resolve => {
        dns.reverse(clientIpRaw, (err, hostnames) => {
            if (err) {
                return resolve(clientIpRaw);
            }

            return resolve(hostnames[0]);
        });
    });
}

const getUptime = () => os.uptime();

function run() {
    const app = express();

    app.set('views', path.join(__dirname, '../src/templates'));
    app.set('view engine', 'ejs');

    app.get('/uptime', (req, res) => {
        const uptime = getUptime();

        res.json({ uptime });
    });

    app.get('/ups-status', async (req, res) => {
        try {
            const upsStatus = await getUPSStatus();

            res.json({ upsStatus });
        }
        catch (err) {
            console.log('Error getting UPS status:', err);

            res.status(500)
                .json({ status: 'Error getting UPS status' });
        }
    });

    app.get('/', async (req, res) => {
        const clientIp = await getClientHostname(req);

        const uptime = getUptime();

        let ups = {};
        try {
            ups = await getUPSStatus();
        }
        finally {
            res.render('index', {
                version,
                clientIp,
                uptime,
                ups,
                ...common
            });
        }
    });

    const getFavicon = (req, res) => res.sendFile(path.join(__dirname, '../assets/favicon.jpg'));

    app.get('/favicon.ico', getFavicon);
    app.get('/favicon.jpg', getFavicon);

    app.use(express.static(path.join(__dirname, '../assets')));

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log('Server listening on port', port);
    });
}

module.exports = {
    run
};

