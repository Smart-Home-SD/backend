import express from 'express';
import { createUser, getUser, getAllUsers , loginUser, deleteUser, updateUser } from '../controllers/userController';
// const sensorController = require('../controllers/sensorController');


const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.post('/login', loginUser);
router.delete('/delete/:id', deleteUser);
router.put('/update', updateUser);

// router.get('/me', createUser);
// router.get('/users/logoutall', createUser);
// router.get('/users/logout', createUser);

export default router;
