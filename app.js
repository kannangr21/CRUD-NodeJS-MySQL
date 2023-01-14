const express = require('express');
const { server } = require('./config');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({message: "Up and running"})
});

app.listen(server.port);

app.use('/person', require('./person'));