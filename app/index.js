const express = require('express');
const path = require('path');
const dns = require('dns');

const { version } = require('../package.json');

const config = require('./config');

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

function run() {
    const app = express();

    app.set('views', path.join(__dirname, '../src/templates'));
    app.set('view engine', 'ejs');

    app.get('/', async (req, res) => {
        const clientIp = await getClientHostname(req);

        res.render('index', {
            version,
            clientIp,
            ...config
        });
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

