import Sensor from '../models/sensor';

export const createSensor = (req, res) => {
  Sensor.create(req.body, (errSensor, doc) => {
    if (errSensor) {
      res.status(400).json({
        Status: false,
        Error: errSensor,
      });
    } else {
      console.log(doc);

      const sensorInfo = {
        deviceId: doc.deviceId,
        name: doc.name,
        type: doc.type,
        id: doc._id,
      };

      res.status(200).json({
        Status: true,
        SensorObject: sensorInfo,
      });
    }
  });
};

export const getSensor = (req, res) => {
  const sensorId = req.params.id;
  Sensor.findOne({ _id: sensorId }).select('_id deviceId name owner type').exec((err, doc) => {
    if (err) {
      return res.status(404).send({ error: err });
    }
    if (doc == null) {
      return res.status(404).json({ message: 'sensor not found' });
    }
    return res.status(200).json(doc);
  });
  return null;
};

export const getAllSensors = (req, res) => {
  Sensor.find().select('_id deviceId name owner type').exec((err, doc) => {
    if (err) {
      return res.status(404).send({ error: err });
    }
    if (doc.length === 0) {
      return res.status(404).json({ message: 'no sensor found' });
    }
    return res.status(200).json(doc);
  });
  return null;
};

export const deleteSensor = (req, res) => {
  const sensorId = req.params.id;
  Sensor.deleteOne({ _id: sensorId }, (err, doc) => {
    if (err) {
      return res.status(404).send({ error: err });
    }
    if (doc.deletedCount === 0) {
      return res.status(404).json({ message: 'sensor not found' });
    }
    return res.status(200).json({ message: 'sensor deleted!' });
  });
  return null;
};

export const updateSensor = async (req, res) => {
  Sensor.updateOne({ _id: req.body.id }, req.body, (upErr, doc) => {
    if (upErr) {
      return res.status(404).send({ error: upErr });
    }
    if (doc == null) {
      return res.status(404).json({ message: 'sensor not found' });
    }
    return res.status(200).json({ message: 'sensor updated!' });
  });
};
