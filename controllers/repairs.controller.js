const Repair = require('../models/repairs.model');
const Users = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');

exports.findRepairs = catchAsync(async (req, res, next) => {
  const repairs = await Repair.findAll({
    where: { status: ['pending', 'completed'] },
    attributes: {
      exclude: ['status'],
    },
    include: [
      {
        model: Users,
      },
    ],
  });

  res.status(200).json({
    status: 'De Lujo 🐸',
    results: repairs.length,
    repairs,
  });
});

exports.createRepair = catchAsync(async (req, res, next) => {
  const { date, motorsNumber, description } = req.body;
  const { id } = req.sessionUser;

  const repair = await Repair.create({
    date,
    motorsNumber: motorsNumber.toLowerCase(),
    description,
    userId: id,
  });

  res.status(201).json({
    status: 'De Lujo 🐸',
    message: 'Reparación de moto creada con éxito',
    repair,
  });
});

exports.findRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  return res.status(200).json({
    status: 'De Lujo 🐸',
    message: 'Reparacion encontrada ',
    repair,
  });
});

exports.updateRepair = catchAsync(async (req, res, next) => {
  const { repair, user } = req;

  const updatedRepair = await repair.update({ status: 'completed' });

  res.status(200).json({
    status: 'De Lujo 🐸',
    message: 'Repacacion Actualizada',
    repair: updatedRepair,
    user,
  });
});

exports.deleteRepair = catchAsync(async (req, res, next) => {
  const { repair } = req;

  await repair.update({ status: 'cancelled' });

  res.status(200).json({
    status: 'De Lujo 🐸',
    message: `Reparacion con ID:${repair.id} ha sido borrado`,
  });
});
