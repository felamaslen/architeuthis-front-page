const { services, logos } = require('../services.json');

module.exports = () => ({
    __DEV__: process.env.NODE_ENV === 'development',
    __PROD__: process.env.NODE_ENV === 'production',
    __WDS__: process.env.NODE_ENV === 'development' && process.env.SKIP_CLIENT !== 'true',
    port: Number(process.env.PORT) || 3000,
    common: {
        serverHostname: process.env.SERVER_HOSTNAME || 'example.com',
        services,
        logos,
    },
    app: {
        timeoutCommand: 5000
    }
});

