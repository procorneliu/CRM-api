import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Getting all data from PostgreSQL table
const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const allDocuments = await Model.getAllUsers();

    res.status(200).json({
      status: 'success',
      results: allDocuments.length,
      data: {
        allDocuments,
      },
    });
  });

// Getting one row of data based on provided ID from specified table
const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const docID = req.params.id;

    const doc = await Model.getUser(docID);
    if (!doc) {
      return next(new AppError('No documents with this ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        ...doc,
      },
    });
  });

// Creating one row of data in PostgeSQL table
const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // 1. Checking if all requested information is provided
    if (!name || !email || !password || !role)
      return next(new AppError('Please provide full information for creating a new document!', 404));

    // 2. Creating user
    const newDocument = await Model.createUser(name, email, password, role);
    if (!newDocument)
      return next(new AppError('Something went wrong when creating new document. Please try again.', 404));

    res.status(201).json({
      status: 'success',
      data: {
        newDocument,
      },
    });
  });

// Updating data about one row in PostgeSQL table
const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // 1. Check if users exists
    const doc = await Model.getUser(id);
    if (!doc) return next(new AppError('Document not found.', 404));

    // 2. Update all indicated fields
    const updatedDocument = await Model.updateUser(id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        updatedDocument,
      },
    });
  });

// Deleting one row of data in PostgeSQL table
const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // 1. Check if user exists
    const doc = await Model.getUser(id);
    if (!doc) return next(new AppError('Document not found.', 404));

    // 2. Delete user
    await Model.deleteUser(id);

    res.status(204).json({
      status: 'success',
      data: {},
    });
  });

export default { getAll, getOne, createOne, updateOne, deleteOne };
