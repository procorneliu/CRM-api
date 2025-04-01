import express from 'express';
import authController from './../controllers/authController.js';
import reminderController from './../controllers/reminderController.js';
import createCRUDRoutes from '../utils/createCRUDRoutes.js';

const router = express.Router();

router.use(authController.protect);

// CRUD routes
createCRUDRoutes(router, reminderController);

export default router;
