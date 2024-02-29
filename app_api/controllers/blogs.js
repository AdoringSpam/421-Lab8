var mongoose = require('mongoose');
var blogModel = mongoose.model('Blog');

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
module.exports.blogsList = function(req, res) {
    console.log('Getting blogs list');
    blogModel
	.find()
	.exec(function(err, results) {
            if (!results) {
		sendJSONresponse(res, 404, {
		    "message": "no blogs found"
		});
		return;
            } else if (err) {
		console.log(err);
		sendJSONresponse(res, 404, err);
		return;
            }
            console.log(results);
            sendJSONresponse(res, 200, buildBlogList(req, res, results));
	}); 
};


/* Builds JSON blog list */
var buildBlogList = function(req, res, results) {
    var blogs = [];
    results.forEach(function(obj) {
	blogs.push({
	    blogTitle: obj.blogTitle,
	    blogText: obj.blogText,
	    createdOn: obj.createdOn,
	    _id: obj._id
	});
    });
    return blogs;
};


/* Create a new Blog */
module.exports.blogsCreate = function(req, res) {
    console.log("Creating new blog entry");
    console.log(req.body);
    blogModel
	.create({
	     blogTitle: req.body.blogTitle,
	     blogText: req.body.blogText
          }, function(err, blog) {
	     if (err) {
	         sendJSONresponse(res, 400, err);
	     } else {
	        sendJSONresponse(res, 201, blog);
 	    }
          }
	);
};

/* Update one Blog */
module.exports.blogsUpdateOne = function(req, res) {
    console.log("Updating a blog entry with id of " + req.params.id);
    console.log(req.body);
    blogModel
	.findOneAndUpdate(
	    { _id: req.params.id },
	    { $set: { "blogTitle": req.body.blogTitle,
	              "blogText": req.body.blogText } },
	    //{ $set: {"createdOn": Date.now()}},
	    function(err,response) {
	       if (err) {
	  	  sendJSONresponse(res, 400, err);
	       } else {
		  sendJSONresponse(res, 201, response);
	       }
	    }
        );
};

/* Delete one Blog */
module.exports.blogsDeleteOne = function(req, res) {
    console.log("Deleting  blog entry with id of " + req.params.id);
    console.log(req.body);
    blogModel
        .findByIdAndRemove(req.params.id)
        .exec (
            function(err,response) {
		if (err) {
                    sendJSONresponse(res, 404, err);
		} else {
                    sendJSONresponse(res, 204, null);
		}
            }
        );
};