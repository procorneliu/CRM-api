import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import catchAsync from './../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import BaseModel from '../models/baseModel.js';
import User from '../models/userModel.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  // Use only https in production
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Storing token in cookies
  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // check if requested information for signup is there
  if (!name || !email || !password) return next(new AppError('Incorrect format of name, email or password!', 400));

  // creating new user
  const user = await User.registerUser(name, email, password);

  // Remove password from response
  user.password = undefined;
  // generating jwt token from user id and sending
  createSendToken(user, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if body include email and password
  if (!email || !password) return next(new AppError('Please provide an email and password', 400));

  // 2. check if user with these data exist
  const user = await User.checkIfUserExists(email);

  const isPasswordCorrect = user && (await User.checkPassword(password, user.password));

  if (!isPasswordCorrect) return next(new AppError('Incorrect email or password! Please try again.', 401));

  // Remove password from response
  user.password = undefined;

  // 3. sending jwt token for successful login
  createSendToken(user, 200, res);
});

// Checking if users are logged in
const protect = catchAsync(async (req, res, next) => {
  // 1. Checking if token exists
  let token;
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
    token = authorizationHeader.split(' ')[1];
  }

  if (!token) {
    next(new AppError('You are not logged in! Please log in and try again.', 401));
  }

  // 2. Token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await new BaseModel('users').findOne(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exists.', 401));
  }

  // 4. Check if user changed password after token was issued
  if (User.passwordChangedAfter(currentUser.passwordchangedat, decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', 401));
  }
  // put user in next requests after this middleware
  req.user = currentUser;

  next();
});

// Grant route access only for users that have permission
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You don't have permission to perform this action!", 403));
    }
    next();
  };
};

export default { signup, login, protect, restrictTo };
