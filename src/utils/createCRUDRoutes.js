const createCRUDRoutes = (router, controller) => {
  router.route('/').get(controller.getAll).post(controller.createOne);
  router.route('/:id').get(controller.getOne).patch(controller.updateOne).delete(controller.deleteOne);

  return router;
};

export default createCRUDRoutes;
