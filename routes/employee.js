import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js'
import { addEmployees, upload, getEmployee, getEmployeeById, updateEmployee, fetchEmployeeByDepId } from '../controllers/employeeController.js';
const router = express.Router();

router.post('/add', authMiddleware, upload.single('image'), addEmployees)
router.get('/', authMiddleware, getEmployee);
router.get('/:id', authMiddleware, getEmployeeById);
router.put('/edit/:id', authMiddleware, updateEmployee);
router.get('/department/:id', authMiddleware,fetchEmployeeByDepId )


export default router;