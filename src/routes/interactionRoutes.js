import express from 'express';
import authController from '../controllers/authController.js';
import interactionController from '../controllers/interactionController.js';
import { createCRUDRoutes } from '../utils/createCRUD.js';

const router = express.Router();

router.use(authController.protect);

// CRUD routes
createCRUDRoutes(router, interactionController);

export default router;
