import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import catchAsync from './../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/userModel.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // check if requested information for signup is there
  if (!name || !email || !password) return next(new AppError('Incorrect format of name, email or password!', 400));

  // creating new user
  const user = await User.registerUser(name, email, password);

  // generating jwt token from user id
  const token = signToken(user.id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        name,
        email,
      },
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if body include email and password
  if (!email || !password) return next(new AppError('Please provide an email and password', 400));

  // 2. check if user with these data exist
  const user = await User.checkIfUserExists(email);

  const isPasswordCorrect = user && (await User.checkPassword(password, user.password));

  if (!isPasswordCorrect) return next(new AppError('Incorrect email or password! Please try again.', 401));

  // 3. sending jwt token for successful login
  const token = signToken(user.id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

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
  const currentUser = await User.getUser(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exists.', 401));
  }

  // 4. Check if user changed password after token was issued
  // ...

  // put user in next requests after this middleware
  req.user = currentUser;

  next();
});

export default { signup, login, protect };
