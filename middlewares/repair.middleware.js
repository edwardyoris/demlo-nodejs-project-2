const Repair = require('../models/repairs.model');
const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validRepair = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const repair = await Repair.findOne({
    where: {
      id,
      status: 'Pendiente',
    },
    include: [
      {
        model: Users,
        attributes: ['id', 'name', 'email', 'role'],
      },
    ],
  });

  if (!repair) {
    const completedRepair = await Repair.findOne({
      where: {
        id,
        status: 'Completado',
      },
    });

    if (completedRepair) {
      return res.status(404).json({
        status: 'error',
        message: `Reparacion con ID:${id} no se puede cancelar porque ya se ha completado! 😏`,
      });
    }

    return next(new AppError(`Repacion con ID:${id} no encontrado 🔎`, 404));
  }

  req.user = repair.user;
  req.repair = repair;
  next();
});
