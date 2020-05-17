import express from 'express';
import { createUser, getUser, loginUser } from '../controllers/userController';
// const sensorController = require('../controllers/sensorController');


const router = express.Router();

router.get('/', getUser);
router.get('/:id', getUser);
router.post('/', createUser);
router.post('/login', loginUser);
// router.get('/me', createUser);
// router.get('/users/logoutall', createUser);
// router.get('/users/logout', createUser);

export default router;
