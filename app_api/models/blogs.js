var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: true
    },
    blogText: {
	type: String,
	required: true
    },
    createdBy: {
        userEmail: {
            type: String,
            required: true
          },
          name: {
            type: String,
            required: true
          }
    },	
    createdOn: {
        type: Date,
	    "default": Date.now
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }]
});


mongoose.model('Blog', blogSchema);