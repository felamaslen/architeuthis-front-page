const winston = require('winston');

const logger = (...args) => {
    if (process.env.QUIET === 'true') {
        return;
    }

    winston.log(...args);
}

module.exports = logger;

