var mongoose = require( 'mongoose' );

var commentSchema = new mongoose.Schema({
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog', // Reference to the Blog schema
      required: true
    },
    author: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  mongoose.model('Comment', commentSchema);