var express = require('express');
var router = express.Router();
var ctrlBlogs = require('../controllers/blogs');

/* Setup routes to API URLs */
router.get('/blogs', ctrlBlogs.blogsList);
router.post('/blogs', ctrlBlogs.blogsCreate);
router.get('/blogs/:id', ctrlBlogs.blogsReadOne);
router.put('/blogs/:id', ctrlBlogs.blogsUpdateOne);
router.delete('/blogs/:id', ctrlBlogs.blogsDeleteOne);

module.exports = router;