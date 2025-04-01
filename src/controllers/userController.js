import factory from './handlerFactory.js';
import { createCRUDControllers } from '../utils/createCRUD.js';

// CRUD operations
const userController = createCRUDControllers(factory, 'users');

export default userController;
