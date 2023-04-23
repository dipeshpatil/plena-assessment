const { check } = require('express-validator');

module.exports = {
  // Checks if email and password fields are defined and returns Boolean Array
  basicEmailAndPasswordRequiredValidator: [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
};
