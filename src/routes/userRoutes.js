import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';
import { createCRUDRoutes } from '../utils/createCRUD.js';

const router = express.Router();

// Authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Requiring authorization
// All user routes are resticted to ADMIN
router.use(authController.protect, authController.restrictTo('admin'));

// CRUD routes
createCRUDRoutes(router, userController);

export default router;
