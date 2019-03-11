const winston = require('winston');

function getLogLevel(config) {
    if (process.env.LOG_LEVEL) {
        return process.env.LOG_LEVEL;
    }

    if (config.__DEV__) {
        return 'debug';
    }
    if (config.__PROD__) {
        return 'info';
    }

    return 'verbose';
}

function getLogger(config) {
    const logger = winston.createLogger({
        level: getLogLevel(config),
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize(),
                    winston.format.splat(),
                    winston.format.printf(({ timestamp: time, level, message, meta }) => {
                        let metaString = '';
                        if (meta) {
                            metaString = JSON.stringify(meta);
                        }

                        return `[${time}] ${level}: ${message} ${metaString}`;
                    })
                )
            })
        ]
    });

    logger.stream = {
        write: message => {
            logger.info(message.substring(0, message.length - 1));
        }
    };

    return logger;
}

module.exports = {
    getLogger
};

