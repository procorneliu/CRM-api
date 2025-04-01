import express from 'express';
import userController from '../controllers/userController.js';
import authController from '../controllers/authController.js';
import createCRUDRoutes from '../utils/createCRUDRoutes.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

// CRUD routes
createCRUDRoutes(router, userController);

export default router;
