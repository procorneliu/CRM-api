import factory from './handlerFactory.js';
import { createCRUDControllers } from '../utils/createCRUD.js';

// CRUD operations
const reminderController = createCRUDControllers(factory, 'reminders');

export default reminderController;
