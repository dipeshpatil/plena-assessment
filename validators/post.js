const { check } = require('express-validator');

module.exports = {
  // Checks if text fields is defined and returns Boolean Array
  basicPostCreationValidator: [
    check('text', 'Text is required').not().isEmpty(),
  ],

  // Checks if text field is defined and returns Boolean Array
  basicPostCommentCreationValidator: [
    check('text', 'Text is required').not().isEmpty(),
  ],
};
