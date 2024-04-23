var express = require('express');
var router = express.Router();
var jwt = require('express-jwt'); 
var auth = jwt({   // Lab 6
  secret: process.env.JWT_SECRET,
  userProperty: 'payload'
});
var ctrlBlogs = require('../controllers/blogs');
var ctrlAuth = require('../controllers/authentication');  // Lab 6

/* Setup routes to API URLs */
router.get('/blogs', ctrlBlogs.blogsList);
router.post('/blogs', auth, ctrlBlogs.blogsCreate);
router.get('/blogs/:id', ctrlBlogs.blogsReadOne);
router.put('/blogs/:id', auth, ctrlBlogs.blogsUpdateOne);
router.delete('/blogs/:id', auth, ctrlBlogs.blogsDeleteOne);
router.post('/register', ctrlAuth.register);  // Lab 6
router.post('/login', ctrlAuth.login);  // Lab 6
//router.post('/api/login', ctrlAuth.login);
router.get('/blogs/:id/comments', ctrlBlogs.blogComments); // Get comments for a blog
router.post('/blogs/:id/comments', auth, ctrlBlogs.addCommentToBlog); // Add a comment to a blog

module.exports = router;