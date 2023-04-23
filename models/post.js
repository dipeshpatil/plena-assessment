const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    text: { type: String, required: true },
    image: { type: String },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const PostCommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
    },
    text: { type: String, required: true, length: 200 },
    post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'post' },
  },
  { timestamps: true },
);

module.exports = {
  Post: mongoose.model('post', PostSchema),
  PostComment: mongoose.model('post_comment', PostCommentSchema),
};
