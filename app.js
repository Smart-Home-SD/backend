import express from 'express';
import {
  urlencoded,
  json,
} from 'body-parser';
import cors from 'cors';
import userRouter from './routes/userRouter';
import sensorRouter from './routes/sensorRouter';

require('./config/config');// Db config
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

app.use('/users', userRouter);
app.use('/sensors', sensorRouter);

app.get('/', (req, res) => {
  res.sendStatus(418);
});

app.get('/whoami', (req, res) => {
  res.send({
    purpouseInLife: 'Be an API for IoT applications for the distributed Systems class',
  });
});

export default app;
