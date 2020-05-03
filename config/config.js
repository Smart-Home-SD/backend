const mongoose = require('mongoose');

const dbURL = 'mongodb://localhost:27017/smartHome';

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

module.exports = mongoose.connection;