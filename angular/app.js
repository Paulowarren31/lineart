var app = angular.module('app', ['ngRoute','ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider){

	$routeProvider.when('/', {
		templateUrl: 'views/home.html',
		controller: 'MainCtrl'
	})
	
	.when('/top', {
		templateUrl: 'views/topTen.html',
		controller: 'TopCtrl'
	})
	
	.when('/vote', {
		templateUrl: 'views/vote.html',
		controller: 'VoteCtrl'
	});

	$locationProvider.html5Mode(true);
}]);
