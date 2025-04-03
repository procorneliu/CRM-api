import express from 'express';
import authController from './../controllers/authController.js';
import saleController from './../controllers/saleController.js';
import { createCRUDRoutes } from '../utils/createCRUD.js';

const router = express.Router();

// Requiring authorization
router.use(authController.protect);

// CRUD routes
createCRUDRoutes(router, saleController);

export default router;
