import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addLeave, getLeaveById, getLeave, getLeaveDetail, updateStatus } from '../controllers/leaveController.js';

const router = express.Router();

router.get('/', authMiddleware, getLeave)
router.post('/add', authMiddleware, addLeave)
router.put('/update/:id', authMiddleware, updateStatus)
router.get('/details/:id', authMiddleware, getLeaveDetail)
router.get('/:id', authMiddleware, getLeaveById)


export default router;
