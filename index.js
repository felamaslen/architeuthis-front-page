const express = require('express');

const app = express();

app.use((req, res) => {
    res.status(502)
        .send('<h1>Architeuthis Front page</h1><p>tbc</p>');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server listening');
});

