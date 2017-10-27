const { services, logos } = require('../services.json');

module.exports = {
    title: process.env.TITLE || 'Untitled Server',
    serverHostname: process.env.SERVER_HOSTNAME || 'example.com',
    services,
    logos,
    powerUsage: Number(process.env.POWER_USAGE || 0)
};

