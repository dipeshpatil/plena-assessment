const { validationResult } = require('express-validator');

// Controllers
const BaseController = require('./baseController');

// Models
const { Post, PostComment } = require('./../models/post');
const User = require('./../models/user');

class PostController extends BaseController {
  constructor() {
    super(Post);
  }

  /**
   * Create a new post and save it to the database
   *
   * @async
   * @function createPost
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing the newly created post and user information
   */
  async createPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = new Post({
        author: req.user.id,
        text: req.body.text,
      });
      await post.save();

      res.json({
        post,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  /**
   * Edit an existing post by the authenticated user
   *
   * @async
   * @function editPost
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing the updated post and user information
   */
  async editPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findOneAndUpdate(
        { _id: req.params.postId, author: req.user.id },
        { text: req.body.text },
        { returnOriginal: false },
      );

      res.json({
        post,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  /**
   * Delete a post by the authenticated user
   *
   * @async
   * @function deletePost
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response containing the deleted post and user information
   */
  async deletePost(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findOne({
        _id: req.params.postId,
        author: req.user.id,
      });

      if (!post) {
        return res.status(404).send('Post Not Found');
      }

      const deletedPost = await Post.findOneAndDelete({
        _id: req.params.postId,
        author: req.user.id,
      });

      res.json({
        deletedPost,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  /**
   * Create a comment on a post
   *
   * @async
   * @function commentOnAPost
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - JSON object containing the new comment for the specified post.
   */
  async commentOnAPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(400).send('Post Not Found!');
      }

      const postComment = new PostComment({
        user: req.user.id,
        text: req.body.text,
        post: req.params.postId,
      });
      await postComment.save();

      res.json({
        postComment,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  /**
   * Edits a comment on a post.
   *
   * @async
   * @function editComment
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} Response object containing the updated comment, user ID, name, and avatar if successful, or a 400 status code with an error message if unsuccessful.
   */
  async editComment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.postId);

      if (!post) {
        return res.status(400).send('Post Not Found!');
      }

      const postComment = await PostComment.findOneAndUpdate(
        {
          _id: req.params.commentId,
          user: req.user.id,
          post: req.params.postId,
        },
        { text: req.body.text },
        { returnOriginal: false },
      );

      res.json({
        postComment,
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
      });
    } catch (err) {}
  }

  /**
   * Deletes a comment on a post
   *
   * @async
   * @function deleteComment
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} - Returns the deleted comment on success or an error message on failure
   */
  async deleteComment(req, res) {
    try {
      const postComment = await PostComment.findOne({
        user: req.user.id,
        post: req.params.postId,
        _id: req.params.commentId,
      });
      if (!postComment) {
        return res.status(400).send('Comment Not Found!');
      }
      res.json(postComment);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  /**
   * Retrieves all comments for a given post ID and sends the result as a JSON response.
   *
   * @async
   * @function getComments
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} - Returns a JSON response of all comments for the given post
   */
  async getComments(req, res) {
    try {
      const postComments = await PostComment.find({
        post: req.params.postId,
      }).populate('user', '-_id name email avatar');

      return res.json(postComments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }

  /**
   * Retrieves all posts for self sends the result as a JSON response.
   *
   * @async
   * @function getPostsForSelf
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Object} - Returns a JSON response of all comments for the given post
   */
  async getPostsForSelf(req, res) {
    try {
      const posts = await Post.find({
        author: req.user.id,
      })
        .populate('author', '-_id name email avatar')
        .sort({ createdAt: -1 });

      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = PostController;
