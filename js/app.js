var app = angular.module('tutor', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'howmany.html',
        controller: 'HowManyCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
