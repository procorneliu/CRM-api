import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import BaseModel from '../models/baseModel.js';

// Getting all data from PostgreSQL table
const getAll = (tableName) =>
  catchAsync(async (req, res, next) => {
    const allDocuments = await new BaseModel(tableName).findAll();

    if (!allDocuments) {
      return next(new AppError('No documents found.', 404));
    }

    res.status(200).json({
      status: 'success',
      results: allDocuments.length,
      data: {
        allDocuments,
      },
    });
  });

// Getting one row of data based on provided ID from specified table
const getOne = (tableName) =>
  catchAsync(async (req, res, next) => {
    const docID = req.params.id;

    const doc = await new BaseModel(tableName).findOne(docID);
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
const createOne = (tableName) =>
  catchAsync(async (req, res, next) => {
    // If there is no provided information
    if (!req.body) return next(new AppError('Please provide full information for creating a new document!', 404));

    // automatic use logged in user id when needed for this tables and id is not provided
    if (tableName === 'interactions' || (tableName === 'reminders' && !req.body.user_id)) {
      req.body.user_id = req.user.id;
    }

    // Creating user
    const newDocument = await new BaseModel(tableName).create({ ...req.body });
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
const updateOne = (tableName) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // 1. Check if users exists
    const doc = await new BaseModel(tableName).findOne(id);
    if (!doc) return next(new AppError('Document not found.', 404));

    // 2. Update all indicated fields
    const updatedDocument = await new BaseModel(tableName).update(id, req.body);

    res.status(200).json({
      status: 'success',
      data: {
        updatedDocument,
      },
    });
  });

// Deleting one row of data in PostgeSQL table
const deleteOne = (tableName) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // 1. Check if user exists
    const doc = await new BaseModel(tableName).findOne(id);
    if (!doc) return next(new AppError('Document not found.', 404));

    // 2. Delete user
    await new BaseModel(tableName).delete(id);

    res.status(204).json({
      status: 'success',
      data: {},
    });
  });

export default { getAll, getOne, createOne, updateOne, deleteOne };
