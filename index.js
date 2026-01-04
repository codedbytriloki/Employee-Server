import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js'
import connectToDatabase from './db/db.js';
import employeeRouter from './routes/employee.js';
import salaryRouter from './routes/salary.js';
import leaveRouter from './routes/leave.js';
import settingRouter from './routes/setting.js';
import dashboardRouter from './routes/dashboard.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Configure CORS - more flexible approach
app.use(cors({
  origin: function (origin, callback) {
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://employee-frontend-five-lemon.vercel.app',
      'https://employee-frontend-git-main-trilokis-projects.vercel.app'
    ];
    
    // Allow requests with no origin or matching origin
    if (!origin || allowedOrigins.some(allowed => origin && origin.includes(allowed.replace('https://', '').replace('http://', '')))) {
      callback(null, true);
    } else if (origin && origin.includes('vercel.app')) {
      // Allow any vercel.app domain
      callback(null, true);
    } else {
      callback(null, true); // Allow all for debugging
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.static('public/uploads'))
app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/setting', settingRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/public', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;