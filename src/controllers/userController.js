import factory from './handlerFactory.js';

// CRUD operations
const getAll = factory.getAll('users');
const getOne = factory.getOne('users');
const createOne = factory.createOne('users');
const updateOne = factory.updateOne('users');
const deleteOne = factory.deleteOne('users');

export default { getAll, getOne, createOne, updateOne, deleteOne };
