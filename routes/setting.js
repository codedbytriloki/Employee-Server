import express from 'express';
import authMiddlewer from '../middleware/authMiddleware.js';
import { changePassword } from '../controllers/settingController.js';

const router = express.Router();

router.put('/change-password', authMiddlewer, changePassword)

export default router;