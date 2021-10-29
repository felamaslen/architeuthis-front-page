import winston from 'winston';

function getLogLevel() {
    if (process.env.LOG_LEVEL) {
        return process.env.LOG_LEVEL;
    }
    if (process.env.NODE_ENV === 'development') {
        return 'debug';
    }
    if (process.env.NODE_ENV === 'production') {
        return 'info';
    }
    return 'verbose';
}

const logger = winston.createLogger({
    level: getLogLevel(),
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
                }),
            ),
        }),
    ],
});

Object.defineProperty(logger.stream, 'write', (message: string): void => {
    logger.info(message.substring(0, message.length - 1));
});

export { logger };
