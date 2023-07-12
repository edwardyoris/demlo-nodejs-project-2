const User = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');

exports.findAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: 'available' },
    attributes: {
      exclude: ['status', 'password'],
    },
  });

  res.status(200).json({
    results: users.length,
    status: 'De Lujo 🐸',
    users,
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (existingUser) {
    return res.status(404).json({
      status: 'error',
      message: `Ya hay un usuario creado en la base de datos con el correo: ${email}`,
    });
  }

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    message: 'Usuario creado correctamente',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'available',
    },
  });

  if (!user) {
    return next(new AppError(`Usuario con email:${email} no ha sido encontrado`, 404));
  }

  // password validation with bcrypt
  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError(`Email o contraseña incorrecta`, 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'De Lujo 🐸',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.findOneUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  return res.status(200).json({
    status: 'De Lujo 🐸',
    message: 'Usuario encontrado',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });

  res.status(200).json({
    status: 'De Lujo 🐸',
    message: `El usuario con ID:${user.id} ha sido actualizado`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: 'disabled' });

  res.status(200).json({
    status: 'De Lujo 🐸',
    message: `El Usuario con ID:${user.id} ha sido borrado`,
  });
});
