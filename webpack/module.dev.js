const moduleConfig = require('./module.common');

module.exports = {
    ...moduleConfig,
    loaders: moduleConfig.loaders.map(loader => {
        if (loader.test.toString() === '/\\.scss$/' && !(loader.enforce && loader.enforce === 'pre')) {
            return {
                ...loader,
                loaders: `style-loader!${loader.loaders}`
            };
        }

        return loader;
    })
};

