import User from '../models/userModel.js';
import factory from './handlerFactory.js';

// CRUD operations
const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);
const createUser = factory.createOne(User);
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

export default { getAllUsers, getUser, createUser, updateUser, deleteUser };
