const express = require('express');
const router = express.Router();

// Controllers
const PostController = require('./../../controllers/postController');
const postController = new PostController();

// Middlewares
const authMiddleware = require('./../../middlewares/auth');

// Validators
const {
  basicPostCreationValidator,
  basicPostCommentCreationValidator,
} = require('./../../validators/post');

/**
 * @route   GET api/post
 * @desc    List All Post
 * @access  Private
 */
router.get('/', authMiddleware, postController.getAll.bind(postController));

/**
 * @route   GET api/post/me
 * @desc    List All Self Posts
 * @access  Private
 */
router.get(
  '/me',
  authMiddleware,
  postController.getPostsForSelf.bind(postController),
);

/**
 * @route   POST api/post
 * @desc    Create A New Post
 * @access  Private
 */
router.post(
  '/',
  [authMiddleware, basicPostCreationValidator],
  postController.createPost.bind(postController),
);

/**
 * @route   PUT api/post/:postId
 * @desc    Edit A Post
 * @access  Private
 */
router.put(
  '/:postId',
  [authMiddleware, basicPostCreationValidator],
  postController.editPost.bind(postController),
);

/**
 * @route   DELETE api/post/:postId
 * @desc    Delete A Post
 * @access  Private
 */
router.delete(
  '/:postId',
  authMiddleware,
  postController.deletePost.bind(postController),
);

/**
 * @route   POST api/post/comment/:postId
 * @desc    Comment On A Post
 * @access  Private
 */
router.post(
  '/comment/:postId',
  [authMiddleware, basicPostCommentCreationValidator],
  postController.commentOnAPost.bind(postController),
);

/**
 * @route   PUT api/post/comment/:postId/:commentId
 * @desc    Edit A Comment Of A Post
 * @access  Private
 */
router.put(
  '/comment/:postId/:commentId',
  [authMiddleware, basicPostCommentCreationValidator],
  postController.editComment.bind(postController),
);

/**
 * @route   DELETE api/post/comment/:postId/:commentId
 * @desc    Delete A Comment Of A Post
 * @access  Private
 */
router.delete(
  '/comment/:postId/:commentId',
  authMiddleware,
  postController.deleteComment.bind(postController),
);

/**
 * @route   GET api/post/comment/:postId
 * @desc    Get All Comments For A Post
 * @access  Private
 */
router.get(
  '/comment/:postId',
  authMiddleware,
  postController.getComments.bind(postController),
);

module.exports = router;
