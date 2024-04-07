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
    }
});


mongoose.model('Blog', blogSchema);