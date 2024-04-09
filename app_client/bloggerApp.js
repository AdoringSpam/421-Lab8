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

        .when('/login', {
        templateUrl: 'common/auth/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      }) 

        .when('/register', {
        templateUrl: 'common/auth/register.html',
        controller: 'RegisterController',
        controllerAs: 'vm'
      }) 

      .otherwise({redirectTo: '/'});

    });



//*** REST Web API functions ***
function getAllBlogs($http) {
    return $http.get('/api/blogs');
}

//function getBlogById($http, id) {
    //return $http.get('/api/blogs/' + id);
//}
function getBlogById($http, authentication, id) {
    return $http.get('/api/blogs/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
}

function updateBlogById($http, authentication, id, data) {
    return $http.put('/api/blogs/' + id, data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function addBlog($http, authentication, data){
    return $http.post('/api/blogs',data, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

function deleteBlog($http, authentication, id){
    return $http.delete('/api/blogs/' + id, { headers: { Authorization: 'Bearer '+ authentication.getToken() }} );
}

//*** Controllers ***
app.controller('HomeController', function HomeController() {
  var vm = this;
  vm.pageHeader = {
      title: "Nicholas Wilson's Blog Site"
  };
  vm.message = "Welcome to my blog site!";
});

app.controller('ListController', ['$http', 'authentication', function ListController($http, authentication) {
    var vm = this;
    vm.pageHeader = {
        title: 'Blog List'
    };
    vm.isLoggedIn = function () {
        return authentication.isLoggedIn();
    };
    vm.isUser = function () {
        return authentication.currentUser().email;
    };
    
    getAllBlogs($http)
      .success(function(data) {
        vm.blogs = data;
        vm.message = "Blog data found!";
      })
      .error(function (e) {
        vm.message = "Could not get list of blogs";
      });
}]);

app.controller('EditController', [ '$http', '$routeParams', '$location', 'authentication', function EditController($http, $routeParams, $location, authentication) {
    var vm = this;
    vm.blog = {};       // Start with a blank book
    vm.id = $routeParams.id;    // Get id from $routParams which must be injected and passed into controller
    vm.pageHeader = {
        title: 'Blog Edit'
    };

    vm.isLoggedIn = function () {
      return authentication.isLoggedIn();
    };
    vm.getToken = function () {
      return authentication.getToken();
    };
    
    // Get book data so it may be displayed on edit page
    getBlogById($http, authentication, vm.id)
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
  updateBlogById($http, authentication, vm.id,data)
      .then(function successCallBack(response){
          vm.message="Blog data updated!";
      }),function errorCallBack(response){
          vm.message = "Could not update book given id of " + vm.id + userForm.blogTitle.text + " " + userForm.blogText.text ;
      }
  }
}]);

app.controller('DeleteController',['$http','$location','$routeParams', 'authentication', function DeleteController($http,$location,$routeParams,authentication) {
  var vm = this;
  vm.blog ={};
  vm.id = $routeParams.id;
  vm.pageHeader = {
      title: "Blog Delete"
  };
  console.log("Delete Controller initialized.");
  getBlogById($http,authentication,vm.id)
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
      deleteBlog($http,vm.id,authentication)
      .then(function successCallBack(response){
        vm.message="Blog Deleted!";
    }),function errorCallBack(response){
        vm.message = "Failed to delete Blog" ;
    }
}
}]);

app.controller('AddController',['$http','$location', 'authentication', function AddController($http,$location,authentication) {
  var vm = this;
  vm.pageHeader = {
      title: "Blog Add"
  };
  vm.submit = function(){
      var data = {};
      data.blogTitle = userForm.blogTitle.value;
      data.blogText = userForm.blogText.value;
      data.createdBy = {}
      data.createdBy.userEmail = authentication.currentUser().email;
      data.createdBy.name = authentication.currentUser().name;
      data.createdOn = Date.now();

  addBlog($http,data,authentication)
      .then(function successCallBack(response) {
          vm.message = "Blog Added";
          $location.path(['/blogList']);
      }),function errorCallBack(response){
          vm.message = "Blog failed to add"; 
      }
  }
}]);

app.controller('LoginController', ['$http', '$location', 'authentication', function LoginController($http, $location, authentication) {
  var vm = this;

  vm.pageHeader = {
      title: 'Sign in to Blogger'
  };

  vm.credentials = {
      email: "",
      password: ""
  };

  vm.returnPage = $location.search().page || '/';

  vm.onSubmit = function () {
      vm.credentials.email = userForm.email.value;
      vm.credentials.password = userForm.password.value;
      vm.formError = "";
      if (!vm.credentials.email || !vm.credentials.password) {
          vm.formError = "All fields required, please try again";
          return false;
      } else {
          vm.doLogin();
      }
  };

  vm.doLogin = function () {
      vm.formError = "";
      authentication
          .login(vm.credentials)
          .then(function () {
              $location.search('page', null);
              $location.path(vm.returnPage);
              //$location.path(['/']);
          }, function errorCallBack(response) {
              vm.formError = response.message;
          });
  };
}]);

app.controller('RegisterController', ['$http', '$location', 'authentication', function RegisterController($http, $location, authentication) {
  var vm = this;

  vm.pageHeader = {
      title: 'Create a new Bloger account'
  };

  vm.credentials = {
      name: "",
      email: "",
      password: ""
  };

  vm.returnPage = $location.search().page || '/';

  vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
          vm.formError = "All fields required, please try again";
          return false;
      } else {
          vm.doRegister();
      }
  };

  vm.doRegister = function () {
      vm.formError = "";
      authentication
          .register(vm.credentials)
          .then(function () {
              $location.search('page', null);
              $location.path(vm.returnPage);
              //$location.path(['/']);
              console.log("Successfulyy registered.");
          }, function errorCallBack(response) {
              vm.formError = "Error registering. Try again with a different email address."
          });
  };
}]);

app.controller('NavigationController', ['$location', 'authentication', function NavigationController($location, authentication) {
  var vm = this;
  vm.currentPath = $location.path();
  vm.currentUser = function () {
      return authentication.currentUser();
  }
  vm.isLoggedIn = function () {
      return authentication.isLoggedIn();
  }
  vm.logout = function () {
      authentication.logout();
      $location.path('/');
  };
}]);

//*** Directives ***
app.directive('navigation', function () {
  return {
      restrict: 'EA',
      templateUrl: 'nav/navigation.html',
      controller: 'NavigationController',
      controllerAs: 'vm'
  };
});

//*** Authentication Service and Methods **
app.service('authentication', authentication);
authentication.$inject = ['$window', '$http'];
function authentication($window, $http) {
  var vm = this;

  var saveToken = function (token) {
      $window.localStorage['blog-token'] = token;
  };

  var getToken = function () {
      return $window.localStorage['blog-token'];
  };

  var register = function (user) {
      console.log('Registering user ' + user.email + ' ' + user.password);
      return $http.post('/api/register', user).then(function successCallBack(response) {
          saveToken(response.data.token);
      }, function errorCallBack(error) {
          vm.message = "failed to register";
      });
  };

  var login = function (user) {
      console.log('Attempting to login user ' + user.email + ' ' + user.password);
      //$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
      return $http.post('/api/login', user).then(function (response) {
          saveToken(response.data.token);
      }, function errorCallBack(error) {
          vm.message = "Failed to login";
      });
  };

  var logout = function () {
      $window.localStorage.removeItem('blog-token'); 
  };

  var isLoggedIn = function () {
      var token = getToken();

      if (token) {
          var payload = JSON.parse($window.atob(token.split('.')[1]));

          return payload.exp > Date.now() / 1000;
      } else {
          return false;
      }
  };

  var currentUser = function () {
      if (isLoggedIn()) {
          var token = getToken();
          var payload = JSON.parse($window.atob(token.split('.')[1]));
          return {
              email: payload.email,
              name: payload.name
          };
      }
  };

  return {
      saveToken: saveToken,
      getToken: getToken,
      register: register,
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      currentUser: currentUser
  };
}

angular
.module('bloggerApp')
.config(['$routeProvider','$locationProvider', app.config]);