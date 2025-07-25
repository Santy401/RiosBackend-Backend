import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import sequelize from './config/database.js'; 

import authController from './controllers/authController.js';
import errorHandler from './middleware/errorMiddleware.js';
import areaRoutes from './routes/areaRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();

sequelize.authenticate()
  .then(() => {
    console.log('🟢 Conexión con PostgreSQL exitosa!');
  })
  .catch(err => {
    console.error('🔴 Error al conectar con PostgreSQL:', err);
  });

app.use(helmet());
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://task-rios.vercel.app',
  'https://54.173.189.136.sslip.io'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(xss());

const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api', limiter);

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/areas', areaRoutes);
app.use('/login', authController.login);
app.use('/auth/register', authController.register);
app.use('/companies', companyRoutes);

app.use(errorHandler);

export default app;
