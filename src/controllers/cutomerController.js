import factory from './handlerFactory.js';
import { createCRUDControllers } from '../utils/createCRUD.js';

// CRUD operations
const customerController = createCRUDControllers(factory, 'customers');

export default customerController;
