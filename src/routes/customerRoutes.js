import express from 'express';
import authController from './../controllers/authController.js';
import customerController from './../controllers/cutomerController.js';
import { createCRUDRoutes } from '../utils/createCRUD.js';

const router = express.Router();

router.use(authController.protect);

// CRUD routes
createCRUDRoutes(router, customerController);

export default router;
