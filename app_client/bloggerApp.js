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

// State Provider
app.config(function($stateProvider){
  $stateProvider
    .state('blogList', {
      url: '/blogList',
      templateUrl: 'pages/blogList.html',
      controller: 'ListController'
    });
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

function addBlog($http,data){
    return $http.post('/api/blogs',data);
}

function deleteBlog($http,id){
    return $http.delete('/api/blogs/' + id);
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

blogApp.controller('DeleteController',['$http','$state','$routeParams',function DeleteController($http,$state,$routeParams) {
  var vm = this;
  vm.blog ={};
  vm.id = $routeParams.id;
  vm.pageHeader = {
      title: "Blog Delete"
  };
  getBlogById($http,vm.id)
    .success(function(data) {
      vm.blog = response.data;
      vm.message ="Blog data found!"
  })
    .error(function (e){
      vm.message = "Could not find Blog with id of " + vm.id;
  });

  vm.delete = function(){
      $state.go('blogList');
      deleteBlog($http,vm.id)
        .success(function(data){
          vm.message="Blog Deleted!";
      })
        .error(function (e) {
          vm.message = "Failed to delete Blog" ;
      });
  }
}]);

blogApp.controller('AddController',['$http','$state',function AddController($http,$state) {
  var vm = this;
  vm.pageHeader = {
      title: "Blog Add"
  };
  vm.add = function(){
      var data = {};
      data.blogTitle = userForm.blogTitle.value;
      data.blogText = userForm.blogText.value;
      data.createdOn = Date.now();

  addBlog($http,data)
      .then(function successCallBack(response) {
          vm.message = "Blog Added";
          $state.go('blogList');
      }),function errorCallBack(response){
          vm.message = "Blog failed to add"; 
      }
  }
}]);