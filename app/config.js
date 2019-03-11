const { services, logos } = require('../services.json');

module.exports = () => ({
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production',
    __WDS__: process.env.NODE_ENV === 'development' && process.env.SKIP_CLIENT !== 'true',
    port: Number(process.env.PORT) || 3000,
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
});

