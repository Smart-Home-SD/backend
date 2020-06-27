const mongoose = require('mongoose');

const SensorData = mongoose.model('SensorData',
  new mongoose.Schema({
    id: Number,
    timestamp: Number,
    active: Number,
    temperature: Number,
  }),
  'sensorData');

module.exports = SensorData;
