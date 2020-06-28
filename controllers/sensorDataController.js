import Sensor from '../models/sensorData';

export const getLastSensorData = (req, res) => {
  const sensorId = req.params.id;
  Sensor.findOne({ id: sensorId }).select('id timestamp active temperature').sort({ timestamp: -1 }).exec((err, doc) => {
    if (err) {
      return res.status(404).send({ error: err });
    }
    if (doc == null) {
      return res.status(404).json({ message: 'sensor data not found' });
    }
    return res.status(200).json(doc);
  });
  return null;
};

async function generateJsonHistory(doc) {
  const end = Date.now();
  const start = end - 86400000;
  const step = 3600000;
  const jsonData = [];

  // console.log(start);
  // console.log(end);
  // console.log(doc.length);

  for (let i = 0; i <= 24; i += 1) {
    const stepStart = start + (step * i);
    const stepEnd = stepStart + step;
    const datas = [];

    doc.forEach((obj) => {
      if (obj.timestamp <= stepEnd && obj.timestamp >= stepStart) datas.push(obj);
    });

    // console.log(datas.length);

    const sum = datas.reduce((a, b) => a + b.temperature, 0);
    const avg = sum / datas.length;

    // console.log(sum);
    // console.log(avg);

    jsonData.push({ time: stepEnd, average: avg });
  }

  return jsonData;
}

export const getSensorHistory = async (req, res) => {
  const sensorId = req.params.id;
  const end = Date.now();
  const start = end - 86400000;
  Sensor.find({ id: sensorId, timestamp: { $gte: start, $lte: end } }).select('id timestamp active temperature').sort({ timestamp: -1 }).exec(async (err, doc) => {
    if (err) {
      return res.status(404).send({ error: err });
    }
    if (doc.length === 0) {
      return res.status(404).json({ message: 'no sensor data found' });
    }
    return res.status(200).json({ array: await generateJsonHistory(doc) });
  });
  return null;
};
