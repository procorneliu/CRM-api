import factory from './handlerFactory.js';

// CRUD operations
const getAll = factory.getAll('reminders');
const getOne = factory.getOne('reminders');
const createOne = factory.createOne('reminders');
const updateOne = factory.updateOne('reminders');
const deleteOne = factory.deleteOne('reminders');

export default { getAll, getOne, createOne, updateOne, deleteOne };
