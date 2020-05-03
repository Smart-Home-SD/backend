const mongoose = require('mongoose');

const dbURL = 'mongodb://localhost:27017/smartHome';

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

module.exports = mongoose.connection;
