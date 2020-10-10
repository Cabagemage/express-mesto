const express = require('express');

const app = express();
const path = require('path');
const router = require('./routes/index.js');

const PORT = 3000;

app.listen(PORT, () => console.log('SERVER IS RUNNING'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);
