const { services, logos } = require('../services.json');

module.exports = {
    common: {
        title: process.env.TITLE || 'Untitled Server',
        serverHostname: process.env.SERVER_HOSTNAME || 'example.com',
        services,
        logos,
        constants: {
            powerUsage: Number(process.env.POWER_USAGE || 0),
            costKwh: Number(process.env.COST_KWH || 0),
            upsCapacity: Number(process.env.UPS_CAPACITY || 0),
            installTime: Number(process.env.INSTALLATION_TIME || 0),
            apcaccessCacheMaxAge: 300000,
            tempsCacheMaxAge: 2000
        }
    },
    app: {
        timeoutCommand: 5000
    }
};

