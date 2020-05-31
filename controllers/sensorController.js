import Sensor from '../models/sensor';

export const createSensor = (req, res) => {
  Sensor.create(req.body, (errSensor, doc) => {
    if (errSensor) {
      res.status(400).json({
        Status: false,
        Error: errSensor,
      });
    }

    else {
      console.log(doc);

      const sensorInfo = {
        deviceId: doc.deviceId,
        name: doc.name,
        type: doc.type,
        id: doc._id,
      };

      res.status(200).json({
        Status: true,
        UserObject: sensorInfo,
      });
    }
  });
};

export const getSensor = (req, res) => {
  const sensorId = req.params.id;
  Sensor.findOne({ _id: sensorId }).select('_id deviceId name owner type').exec((err, doc) => {
    if (err) {
      res.status(404).send({ error: err });
    }
    res.status(200).json(doc);
  });
  return null;
};

export const getAllSensors = (req, res) => {
  Sensor.find().select('_id deviceId name owner type').exec((err, doc) => {
    if (err) {
      return res.status(404).send({ error: err });
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
    return res.status(200).json(doc);
  });
  return null;
};

export const updateSensor = async (req, res) => {
  Sensor.updateOne({ _id: req.body.id }, req.body, (upErr) => {
    if (upErr) {
      return res.status(404).send({ error: upErr });
    }
    return res.status(200).json({ message: 'sensor updated!' });
  });
};
