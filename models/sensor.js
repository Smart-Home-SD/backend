const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    require: true,
    unique: true,
  },
  name: {
    type: String,
  },
  ownerId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['TEMP', 'LIGHT', 'PRES'],
  },
});

const Sensor = mongoose.model('Sensor', sensorSchema);

module.exports = Sensor;
