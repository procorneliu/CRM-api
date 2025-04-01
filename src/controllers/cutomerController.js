import factory from './handlerFactory.js';

// CRUD operations
const getAll = factory.getAll('customers');
const getOne = factory.getOne('customers');
const createOne = factory.createOne('customers');
const updateOne = factory.updateOne('customers');
const deleteOne = factory.deleteOne('customers');

export default { getAll, getOne, createOne, updateOne, deleteOne };
