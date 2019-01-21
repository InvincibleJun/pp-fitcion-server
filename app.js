const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

global.mdb = require('./model/index');

app.use(require('./routes/index'));

app.listen(5050);
