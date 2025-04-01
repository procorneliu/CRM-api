import factory from '../controllers/handlerFactory.js';
import { createCRUDControllers } from '../utils/createCRUD.js';

// CRUD operations
const salesController = createCRUDControllers(factory, 'sales');

export default salesController;
