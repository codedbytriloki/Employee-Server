import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { addDepartment, deleteDepartment, editDepartment, getDepartemntById, getDepartment } from '../controllers/departmentController.js';

const router = express.Router();

router.post('/add', authMiddleware, addDepartment);
router.get('/', authMiddleware, getDepartment);
router.get('/:id', authMiddleware, getDepartemntById);
router.put('/edit/:id', authMiddleware, editDepartment)
router.delete('/delete/:id', authMiddleware, deleteDepartment)

export default router;