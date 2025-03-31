import express from 'express';
import morgan from 'morgan';

import userRouter from './src/routes/userRoutes.js';
// import customerRouter from './src/routes/customerRoutes.js';
// import saleRouter from './src/routes/saleRoutes.js';
// import interationRouter from './src/routes/interationRoutes.js';
// import reminderRouter from './src/routes/reminderRoutes.js';

import AppError from './src/utils/appError.js';
import globalErrorHandler from './src/controllers/errorController.js';

const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Defining routes
app.use('/users', userRouter);
// app.use('/customers', customerRouter);
// app.use('/sales', saleRouter);
// app.use('/interations', interationRouter);
// app.use('/reminders', reminderRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
