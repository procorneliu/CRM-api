import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import BaseModel from '../models/baseModel.js';

// Automatically insert logged in users ID into body if absent
const autoAssignUserID = (req, res, next) => {
  !req.body.user_id && (req.body.user_id = req.user.id);

  next();
};

// ALL CRUD OPERATIONS USING POSTGRESQL
// 1. Getting all data from table
const getAll = (tableName) =>
  catchAsync(async (req, res, next) => {
    // requesting data
    const allDocuments = await new BaseModel(tableName).findAll();

    // checking if data exists
    if (!allDocuments) {
      return next(new AppError('No documents found.', 404));
    }

    // sending response
    res.status(200).json({
      status: 'success',
      results: allDocuments.length,
      data: {
        allDocuments,
      },
    });
  });

// 2. Getting data from table by ID
const getOne = (tableName) =>
  catchAsync(async (req, res, next) => {
    // getting ID from URL
    const docID = req.params.id;

    // requesting data
    const doc = await new BaseModel(tableName).findOne(docID);
    // checking if data exists
    if (!doc) {
      return next(new AppError('No documents with this ID.', 404));
    }

    // sending response
    res.status(200).json({
      status: 'success',
      data: {
        ...doc,
      },
    });
  });

// 3. Inserting data in table
const createOne = (tableName) =>
  catchAsync(async (req, res, next) => {
    // Check if body is not empty
    if (!req.body) return next(new AppError('Please provide full information for creating a new document!', 404));

    // Creating new document
    const newDocument = await new BaseModel(tableName).create({ ...req.body });
    // checking created document
    if (!newDocument)
      return next(new AppError('Something went wrong when creating new document. Please try again.', 404));

    // sending response
    res.status(201).json({
      status: 'success',
      data: {
        newDocument,
      },
    });
  });

// 4. Updating data from table
const updateOne = (tableName) =>
  catchAsync(async (req, res, next) => {
    // getting ID from URL;
    const { id } = req.params;

    // 1. Check if users exists
    const doc = await new BaseModel(tableName).findOne(id);
    if (!doc) return next(new AppError('Document not found.', 404));

    // 2. Update all indicated fields
    const updatedDocument = await new BaseModel(tableName).update(id, req.body);

    // send response
    res.status(200).json({
      status: 'success',
      data: {
        updatedDocument,
      },
    });
  });

//5.  Deleting data from table
const deleteOne = (tableName) =>
  catchAsync(async (req, res, next) => {
    // getting ID from URL;
    const { id } = req.params;

    // 1. Check if user exists
    const doc = await new BaseModel(tableName).findOne(id);
    if (!doc) return next(new AppError('Document not found.', 404));

    // 2. Delete user
    await new BaseModel(tableName).delete(id);

    // send response
    res.status(204).json({
      status: 'success',
      data: {},
    });
  });

export default { getAll, getOne, createOne, updateOne, deleteOne, autoAssignUserID };
