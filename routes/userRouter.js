import express from 'express';
import { createUser, getUser, getAllUsers , loginUser, deleteUser, updateUser } from '../controllers/userController';


const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.post('/login', loginUser);
router.delete('/delete/:id', deleteUser);
router.put('/update', updateUser);


export default router;
