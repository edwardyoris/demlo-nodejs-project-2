const { body, validationResult } = require('express-validator');

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.mapped(),
    });
  }

  next();
};

exports.createUserValidation = [
  body('name').notEmpty().withMessage('Nombre no puede estar vacio'),
  body('email')
    .notEmpty()
    .withMessage('Email no puede estar vacio')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña no puede estar vacía')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  validFields,
];

exports.loginUserValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email no puede estar vacio')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido'),
  body('password')
    .notEmpty()
    .withMessage('Contraseña no puede estar vacio')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  validFields,
];

exports.createRepairValidation = [
  body('date')
    .notEmpty()
    .withMessage('Fecha no puede estar vacio')
    .isDate()
    .withMessage('Este campo debe ser una fecha'),
  body('motorsNumber')
    .notEmpty()
    .withMessage('El número de motores no puede estar vacío')
    .isLength({ min: 6 })
    .withMessage('El número de motores debe tener al menos 6 caracteres'),
  body('description').notEmpty().withMessage('La descripción no puede estar vacía'),
  validFields,
];
