/* GET blog page. */
//module.exports.list = function(req, res) {
	//res.render('blogList', {title: 'Blog List'});
//};
module.exports.add = function(req, res) {
	res.render('blogAdd', {title: 'Add Blog'});
};
module.exports.edit = function(req, res) {
	res.render('blogEdit', {title: 'Blog Edit'});
};
module.exports.del = function(req, res) {
	res.render('blogDelete', {title: 'Blog Delete'});
};
module.exports.list = function(req, res) {
	res.render('blogList', {
		title: 'Blog List',
		pageHeader : {
			title: 'Blog List',
			strapline: "My blogs."
		},
		sidebar: 'empty',
		blogs: [
		{
			blogTitle: 'Blog 1',
			blogText: 'Hello.',
			createdOn: '2 February 2024'
		},
		{
			blogText: 'Blog 2',
			blogText: 'I am a blogger.',
			createdOn: '6 February 2024'
		},
		{
			blogTitle: 'Blog 3',
			blogText: 'I AM A BLOGGER!',
			createdOn: '12 February 2024'
		}]
		
	});
};
