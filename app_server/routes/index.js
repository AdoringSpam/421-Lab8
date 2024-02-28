var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlBlogs = require('../controllers/blog');

/* Setup routes to pages */
router.get('/', ctrlHome.home);
router.get('/blogList', ctrlBlogs.list);
router.get('/blogAdd', ctrlBlogs.add);
router.post('/blogAdd', ctrlBlogs.addPost);
router.get('/blogEdit/:id', ctrlBlogs.edit);
router.post('/blogEdit/:id', ctrlBlogs.editPost);
router.get('/blogDelete/:id', ctrlBlogs.del);
router.post('/blogDelete/:id', ctrlBlogs.deletePost);

module.exports = router;
