import factory from './handlerFactory.js';
import { createCRUDControllers } from '../utils/createCRUD.js';

// CRUD operations
const interactionController = createCRUDControllers(factory, 'interactions');

export default interactionController;
