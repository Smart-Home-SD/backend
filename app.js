import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';

require('dotenv').config();
// const jwt = require('jsonwebtoken');


const app = express();

app.use(
  urlencoded({
    extended: false,
  }),
);
app.use(json());

app.use(
  cors({
    credentials: true,
    methods: 'POST, GET, PUT, DELETE, PATCH, HEAD, OPTIONS',
    origin: true,
  }),
);

app.get('/', (req, res) => {
  res.sendStatus(418);
});

export default app;
