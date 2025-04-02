import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';

import userRouter from './src/routes/userRoutes.js';
import customerRouter from './src/routes/customerRoutes.js';
import saleRouter from './src/routes/saleRoutes.js';
import interationRouter from './src/routes/interactionRoutes.js';
import reminderRouter from './src/routes/reminderRoutes.js';

import AppError from './src/utils/appError.js';
import globalErrorHandler from './src/controllers/errorController.js';

const app = express();

// Set security HTTP headers
app.use(helmet());

// Limit request from same IP
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in a hour!',
});
app.use('/api', limiter);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization againt XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Defining routes
app.use('/api/users', userRouter);
app.use('/api/customers', customerRouter);
app.use('/api/sales', saleRouter);
app.use('/api/interactions', interationRouter);
app.use('/api/reminders', reminderRouter);

// Handle all undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
