// Defining a custom error class for handling error in more structured way
export default class AppError extends Error {
  constructor(message, statusCode) {
    // Set message property into error
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // by default are this error are operational errors
    this.isOperational = true;

    // capture stack trace of error to see where error occured in code
    Error.captureStackTrace(this, this.constructor);
  }
}
