var app = angular.module('bloggerApp', ['ngRoute']);

//*** Router Provider ***
app.config(function($routeProvider) {
  $routeProvider
      .when('/', {
	      templateUrl: 'pages/home.html',
		  controller: 'HomeController',
		  controllerAs: 'vm'
		  })

      .when('/blogList', {
	      templateUrl: 'pages/blogList.html',
		  controller : 'ListController',
		  controllerAs: 'vm'
		  })

      .when('/blogAdd', {
	      templateUrl: 'pages/blogAdd.html',
		  controller: 'AddController',
		  controllerAs: 'vm'
		  })
          
        .when('/blogEdit/:id', {
	      templateUrl: 'pages/blogEdit.html',
		  controller: 'EditController',
		  controllerAs: 'vm'
		  })

        .when('/blogDelete/:id', {
        templateUrl: 'pages/blogDelete.html',
      controller: 'DeleteController',
      controllerAs: 'vm'
      })

      .otherwise({redirectTo: '/'});
    });




//*** REST Web API functions ***
function getAllBlogs($http) {
    return $http.get('/api/blogs');
}

function getBlogById($http, id) {
    return $http.get('/api/blogs/' + id);
}

function updateBlogById($http, id, data) {
    return $http.put('/api/blogs/' + id, data);
}




//*** Controllers ***
app.controller('HomeController', function HomeController() {
  var vm = this;
  vm.pageHeader = {
      title: "My Blog Site"
  };
  vm.message = "Welcome to my blog site!";
});

app.controller('ListController', function ListController($http) {
    var vm = this;
    vm.pageHeader = {
        title: 'Blog List'
    };
    
    getAllBlogs($http)
      .success(function(data) {
        vm.blogs = data;
        vm.message = "Blog data found!";
      })
      .error(function (e) {
        vm.message = "Could not get list of blogs";
      });
});

app.controller('EditController', [ '$http', '$routeParams', '$state', function EditController($http, $routeParams, $state) {
    var vm = this;
    vm.blog = {};       // Start with a blank book
    vm.id = $routeParams.id;    // Get id from $routParams which must be injected and passed into controller
    vm.pageHeader = {
        title: 'Blog Edit'
    };
    
    // Get book data so it may be displayed on edit page
    getBlogById($http, vm.id)
      .success(function(data) {
        vm.blog = data;
        vm.message = "Blog data found!";
      })
      .error(function (e) {
        vm.message = "Could not get blog given id of " + vm.id;
      });
    
    // Submit function attached to ViewModel for use in form
    vm.submit = function() {
        var data = vm.blog;
        data.blogTitle = userForm.blogTitle.value;
        data.blogText = userForm.blogText.value;
               
        updateBlogById($http, vm.id, data)
          .success(function(data) {
            vm.message = "Blog data updated!";
            $state.go('blogList');   // Refer to book for info on StateProvder
          })
          .error(function (e) {
            vm.message = "Could not update book given id of " + vm.id + userForm.blogTitle.text + " " + userForm.blogText.text;
          });
    }
}]);