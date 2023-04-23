const express = require('express');
const router = express.Router();

// Middlewares
const authMiddleware = require('./../../middlewares/auth');

// Validators
const {
  basicEmailAndPasswordRequiredValidator,
} = require('./../../validators/auth');

// Controllers
const AuthController = require('./../../controllers/authController');
const authController = new AuthController();

/**
 * @route   GET api/auth
 * @desc    Test Route
 * @access  Private
 */
router.get('/', authMiddleware, authController.getUser.bind(authController));

/**
 * @route   POST api/auth
 * @desc    Authenticate User and Get Token
 * @access  Public
 */
router.post(
  '/',
  basicEmailAndPasswordRequiredValidator,
  authController.authenticateUserAndGetToken.bind(authController),
);

module.exports = router;
