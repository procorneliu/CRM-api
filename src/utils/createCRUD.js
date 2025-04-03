// Make router to use CRUD operations
export const createCRUDRoutes = (router, controller) => {
  router.route('/').get(controller.getAll).post(controller.createOne);
  router.route('/:id').get(controller.getOne).patch(controller.updateOne).delete(controller.deleteOne);

  return router;
};

// Creating CRUD operations for specific controller
export const createCRUDControllers = (factory, tableName) => {
  const getAll = factory.getAll(tableName);
  const getOne = factory.getOne(tableName);
  const createOne = factory.createOne(tableName);
  const updateOne = factory.updateOne(tableName);
  const deleteOne = factory.deleteOne(tableName);

  return { getAll, getOne, createOne, updateOne, deleteOne };
};
