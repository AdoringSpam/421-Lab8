var request = require('request');
var apiOptions = {
    server : "http://localhost"
};


/* GET blog lists */      
module.exports.list = function(req, res){
    var requestOptions, path;
    path = '/api/blogs';
    requestOptions = { 
	url : apiOptions.server + path, 
	method : "GET",
	json : {},
	qs : {} 
    };
    request(
	requestOptions,
	function(err, response, body) {
	    renderListPage(req, res, body);
	}
    );
};


/* Render the blog list page */
var renderListPage = function(req, res, responseBody){
    res.render('blogList', {
	title: 'Blog List',
	pageHeader: {
	    title: 'Blog List'
	},
	blogs: responseBody
    });
};


/* Blog Add */
module.exports.add = function(req, res) {
    res.render('blogAdd', { title: 'Add Blog' });
};    


/* Blog Add Post */
module.exports.addPost = function(req, res){
    var requestOptions, path, postdata;
    path = '/api/blogs/';

    postdata = {
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText
    }; 

    requestOptions = {
      url : apiOptions.server + path,
      method : "POST",
      json : postdata
    };
    
    request(
      requestOptions,
      function(err, response, body) {
         if (response.statusCode === 201) {
              res.redirect('/blogList');
            } else {
              _showError(req, res, response.statusCode);
            } 
         }
     ); 
};


/* Blog Edit */
module.exports.edit = function(req, res) {
    var requestOptions, path;
    path = "/api/blogs/" + req.params.id;
    requestOptions = {
	url : apiOptions.server + path,
	method : "GET",
	json : {}
    }; 
    request(
	requestOptions,
	function(err, response, body) {
            renderEditPage(req, res, body);
	}
    );
};


/* Render the blog edit page */
var renderEditPage = function(req, res, responseBody){
    res.render('blogEdit', {
        title: 'Blog Edit',
	pageHeader: {
            title: 'Blog Edit'
	},
	blog: responseBody
    });
};


/* Blog Edit Post */
module.exports.editPost = function(req, res){
    var requestOptions, path, postdata;
    var id = req.params.id;
    path = '/api/blogs/' + id;

    postdata = {
        blogTitle: req.body.blogTitle,
	blogText: req.body.blogText
    };

    requestOptions = {
	url : apiOptions.server + path,
	method : "PUT",
	json : postdata
    };

    request(
	requestOptions,
	function(err, response, body) {
	    if (response.statusCode === 201) {
		res.redirect('/blogList');
            } else {
		_showError(req, res, response.statusCode);
            }
        }
    );
};


/* Blog Delete */
module.exports.del = function(req, res) {
    var requestOptions, path;
    path = "/api/blogs/" + req.params.id;
    requestOptions = {
	url : apiOptions.server + path,
	method : "GET",
	json : {}
    };
    request(
	requestOptions,
        function(err, response, body) {
            renderDeletePage(req, res, body);
        }
    );
};


/* Render the blog delete page */
var renderDeletePage = function(req, res, responseBody){
    res.render('blogDelete', {
	title: 'Blog Delete',
	pageHeader: {
            title: 'Blog Delete'
	},
	blog: responseBody
    });
};

/* Blog Delete Post */
module.exports.deletePost = function(req, res){
    var requestOptions, path;
    var id = req.params.id;
    path = '/api/blogs/' + id;

    requestOptions = {
	url : apiOptions.server + path,
        method : "DELETE",
        json : {}
    };

    request(
        requestOptions,
	function(err, response, body) {
            if (response.statusCode === 204) {
                res.redirect('/blogList');
            } else {
		_showError(req, res, response.statusCode);
            }
        }
    );
};


/* _showError function */
//var _showError = function (req, res, status) {
    //var title, content;
    //if (status === 404) {
	//title = "404, page not found";
	//content = "Oh dear. Looks like we can't find this page. Sorry.";
    //} else if (status === 500) {
	//title = "500, internal server error";
	//content = "How embarrassing. There's a problem with our server.";
    //} else {
	//title = status + ", something's gone wrong";
	//content = "Something, somewhere, has gone just a little bit wrong.";
    //}
    //res.status(status);
    //res.render('generic-text', {
	//title : title,
	//content : content
    //});
//};
