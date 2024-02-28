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
    createdOn: {
        type: Date,
	    "default": Date.now
    }
});

// Compile the model (model, schema, collection)
mongoose.model('Blog', blogSchema, 'blogs');