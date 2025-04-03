import express from 'express';
import authController from '../controllers/authController.js';
import interactionController from '../controllers/interactionController.js';
import factory from '../controllers/handlerFactory.js';
import { createCRUDRoutes } from '../utils/createCRUD.js';

const router = express.Router();

// Requiring authorization
router.use(authController.protect);

// Creating new INTERACTION document requires user_id
// Provide automatically logged in user_id if no ID provided in body
router.use(factory.autoAssignUserID);

// CRUD routes
createCRUDRoutes(router, interactionController);

export default router;
