import factory from '../controllers/handlerFactory.js';

// CRUD operations
const getAll = factory.getAll('sales');
const getOne = factory.getOne('sales');
const createOne = factory.createOne('sales');
const updateOne = factory.updateOne('sales');
const deleteOne = factory.deleteOne('sales');

export default { getAll, getOne, createOne, updateOne, deleteOne };
