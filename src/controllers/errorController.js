const sendErrorDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProducion = (err, res) => {
  // Checking if error is operational or from programming mistakes
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log error to console
    console.error('ERROR 💥💥:', err);

    // send generic message
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong!',
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Send more details about error when app is in development
  if (process.env.NODE_ENV === 'development') {
    sendErrorDevelopment(err, res);
  }
  // Send less information about error when app is in production
  else if (process.env.NODE_ENV === 'production') {
    sendErrorProducion(err, res);
  }
};
