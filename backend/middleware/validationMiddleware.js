const { check, validationResult } = require('express-validator');

// Validation logic runner
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: errors.array()[0].msg, 
      errors: errors.array() 
    });
  }
  next();
};

const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('role', 'Role is required').not().isEmpty(),
  runValidation
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  runValidation
];

const jobValidation = [
  check('title', 'Title is required').not().isEmpty(),
  check('companyId', 'Company ID is required').not().isEmpty(),
  check('location', 'Location is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  runValidation
];

const companyValidation = [
  check('name', 'Company name is required').not().isEmpty(),
  runValidation
];

module.exports = {
  registerValidation,
  loginValidation,
  jobValidation,
  companyValidation
};
