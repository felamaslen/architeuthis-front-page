if (process.env.NODE_ENV === 'development') {
    require('dotenv').config(); // eslint-disable-line global-require
}

const app = require('./app');

app.run();

