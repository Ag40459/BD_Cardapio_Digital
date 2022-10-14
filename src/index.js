require('dotenv').config();
const express = require('express');
const route = require('../src/router/route');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(route);
app.listen(port);