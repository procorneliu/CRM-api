import factory from './handlerFactory.js';

// CRUD operations
const getAll = factory.getAll('interactions');
const getOne = factory.getOne('interactions');
const createOne = factory.createOne('interactions');
const updateOne = factory.updateOne('interactions');
const deleteOne = factory.deleteOne('interactions');

export default { getAll, getOne, createOne, updateOne, deleteOne };
