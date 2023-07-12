const repairsController = require('../controllers/repairs.controller');

// middlewares
const validationMiddleware = require('../middlewares/validations.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const repairMiddleware = require('../middlewares/repair.middleware');

const { Router } = require('express');
const router = Router();

router.use(authMiddleware.protect);

// routes
router
  .route('/')
  .get(authMiddleware.restrictTo('employee'), repairsController.findRepairs)
  .post(
    validationMiddleware.createRepairValidation,
    repairsController.createRepair
  );

router
  .use(authMiddleware.restrictTo('employee'))
  .use('/:id', repairMiddleware.validRepair)
  .route('/:id')
  .get(repairsController.findRepair)
  .patch(repairsController.updateRepair)
  .delete(repairsController.deleteRepair);

module.exports = router;
