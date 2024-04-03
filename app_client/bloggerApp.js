var app = angular.module('bloggerApp', ['ngRoute']);

//*** Router Provider ***
app.config(function($routeProvider,$locationProvider) {
  $locationProvider.hashPrefix('');
  $locationProvider.html5Mode({
    enabled: false,
    requireBase: false
  });
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
      title: "Nicholas Wilson's Blog Site"
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

app.controller('EditController', [ '$http', '$routeParams', '$location', function EditController($http, $routeParams, $location) {
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
    vm.submit = function(){
      var data = vm.blog;
      data.blogTitle = userForm.blogTitle.value;
      data.blogText = userForm.blogText.value;
      $location.path(['/blogList']);
  updateBlogById($http,vm.id,data)
      .then(function successCallBack(response){
          vm.message="Blog data updated!";
      }),function errorCallBack(response){
          vm.message = "Could not update book given id of " + vm.id + userForm.blogTitle.text + " " + userForm.blogText.text ;
      }
  }
}]);

app.controller('DeleteController',['$http','$location','$routeParams',function DeleteController($http,$location,$routeParams) {
  var vm = this;
  vm.blog ={};
  vm.id = $routeParams.id;
  vm.pageHeader = {
      title: "Blog Delete"
  };
  console.log("Delete Controller initialized.");
  getBlogById($http,vm.id)
    .success(function(data) {
      vm.blog = data;
      vm.message ="Blog data found!"
      console.log("Blog data found:", data);
  })
    .error(function (e){
      vm.message = "Could not find Blog with id of " + vm.id;
  });

  vm.submit = function(){
      $location.path(['/blogList']);
      deleteBlog($http,vm.id)
      .then(function successCallBack(response){
        vm.message="Blog Deleted!";
    }),function errorCallBack(response){
        vm.message = "Failed to delete Blog" ;
    }
}
}]);

app.controller('AddController',['$http','$location',function AddController($http,$location) {
  var vm = this;
  vm.pageHeader = {
      title: "Blog Add"
  };
  vm.submit = function(){
      var data = {};
      data.blogTitle = userForm.blogTitle.value;
      data.blogText = userForm.blogText.value;
      data.createdOn = Date.now();

  addBlog($http,data)
      .then(function successCallBack(response) {
          vm.message = "Blog Added";
          $location.path(['/blogList']);
      }),function errorCallBack(response){
          vm.message = "Blog failed to add"; 
      }
  }
}]);

angular
.module('bloggerApp')
.config(['$routeProvider','$locationProvider', app.config]);