var mongoose = require('mongoose');
var blogModel = mongoose.model('Blog');
var commentModel = mongoose.model('Comment');
/* Set HTTP status and send JSON response */
var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};


/* GET a blog by the id */
module.exports.blogsReadOne = async (req, res) => {
    console.log('Reading one blog', req.params);
    if (req.params && req.params.id) {
		try {
			const blog = await blogModel.findById(req.params.id).exec();
			if (!blog) {
				sendJSONresponse(res, 404, {
					"message": "id not found"
				});
			} else {
				console.log(blog);
				sendJSONresponse(res, 200, blog);
			}
		} catch (err) {
			console.log(err); 
			sendJSONresponse(res, 404, err);
		}
    } 
	else {
		console.log('No id specified');
		sendJSONresponse(res, 404, {
	    	"message": "No id in request"
		});
    }
};


/* GET a list of all blogs */
module.exports.blogsList = async (req, res) => {
    console.log('Getting blogs list');
    try {
        const results = await blogModel.find().exec();
        if (!results || results.length === 0) {
            sendJSONresponse(res, 404, {
                "message": "No blogs found"
            });
            return;
        }
        console.log(results);
        sendJSONresponse(res, 200, buildBlogList(req, res, results));
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
    }
};


/* Builds JSON blog list */
var buildBlogList = function(req, res, results) {
    var blogs = [];
    results.forEach(function(obj) {
	blogs.push({
	    blogTitle: obj.blogTitle,
	    blogText: obj.blogText,
        createdBy: obj.createdBy,
	    createdOn: obj.createdOn,
	    _id: obj._id
	});
    });
    return blogs;
};


/* Create a new Blog */
module.exports.blogsCreate = async (req, res) => {
    console.log("Creating new blog entry");
    console.log(req.body);
    try {
        const blog = await blogModel.create({
            blogTitle: req.body.blogTitle,
            blogText: req.body.blogText,
            createdBy: req.body.createdBy
        });
        sendJSONresponse(res, 201, blog);
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 400, err);
    }
};

/* Update one Blog */
module.exports.blogsUpdateOne = async (req, res) => {
    console.log("Updating a blog entry with id of " + req.params.id);
    console.log(req.body);
    try {
        const response = await blogModel.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { "blogTitle": req.body.blogTitle, "blogText": req.body.blogText } },
			{ $set: {"createdOn": Date.now()}},
            { new: true } 
        );
        sendJSONresponse(res, 201, response);
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 400, err);
    }
};

/* Delete one Blog */
module.exports.blogsDeleteOne = async (req, res) => {
    console.log("Deleting blog entry with id of " + req.params.id);
    try {
        const response = await blogModel.findByIdAndDelete(req.params.id);
        if (!response) {
            sendJSONresponse(res, 404, {
                "message": "Blog not found"
            });
        } else {
            sendJSONresponse(res, 204, null);
        }
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
    }
};

/* Get comments for a specific blog */
module.exports.blogsComments = async (req, res) => {
    try {
        const blogId = req.params.id;
        const comments = await commentModel.find({ blogId: blogId }).populate('author').exec();
        if (!comments) {
            sendJSONresponse(res, 404, {
                "message": "No comments found for this blog"
            });
            return;
        }
        sendJSONresponse(res, 200, comments);
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 500, err);
    }
};



/* Add a comment to a blog */
module.exports.addCommentToBlog = async (req, res) => {
    console.log('Adding comment to blog with id', req.params.id);
    try {
        const blog = await blogModel.findById(req.params.id).exec();
        if (!blog) {
            sendJSONresponse(res, 404, {
                "message": "Blog not found"
            });
            return;
        }
        
        const newComment = {
            blogId: req.params.id,
            //author: req.payload.userId, // Assuming the user ID is available in req.payload.userId after authentication
            author: req.body.author,
            content: req.body.content
        };
        
        const comment = await commentModel.create(newComment);
        
        sendJSONresponse(res, 201, comment); // Sending back the newly added comment
    } catch (err) {
        console.log(err);
        sendJSONresponse(res, 400, err);
    }
};
