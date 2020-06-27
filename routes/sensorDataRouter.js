import express from 'express';
import {
  getLastSensorData, getSensorHistory
} from '../controllers/sensorDataController';


const router = express.Router();

router.get('/last/:id', getLastSensorData);
router.get('/history/:id', getSensorHistory);

export default router;
