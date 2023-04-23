const express = require('express');
const router = express.Router();

// Controllers
const UserController = require('../../controllers/userController');
const userController = new UserController();

// Validators
const { basicUserRegistrationValidator } = require('./../../validators/user');

/**
 * @route   POST api/users
 * @desc    Register User
 * @access  Public
 */
router.post(
  '/',
  basicUserRegistrationValidator,
  userController.registerUser.bind(userController),
);

module.exports = router;
