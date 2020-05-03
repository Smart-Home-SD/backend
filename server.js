import app from './app';

const mongoose = require('./config/config');

const port = process.env.PORT || 6969;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
