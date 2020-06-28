const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  deviceId: {
    type: Number,
    require: true,
    unique: true,
  },
  name: {
    type: String,
  },
  owner: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['TEMP', 'LIGHT', 'PRES'],
  },
});

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
