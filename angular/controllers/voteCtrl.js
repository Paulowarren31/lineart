var app = angular.module('app');

app.controller('VoteCtrl', function($scope, $http){
	$scope.filteredTodos = []
	  ,$scope.currentPage = 1
	  ,$scope.numPerPage = 10
	  ,$scope.maxSize = 5;

	$scope.makeTodos = function() {
	    $scope.todos = [];
			for (i=1;i<=1000;i++) {
					$scope.todos.push({ text:"todo "+i, done:false });
							    
			}
			  
	};
 
	$scope.makeTodos(); 
	$scope.$watch("currentPage + numPerPage", function() {
		    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
		    , end = begin + $scope.numPerPage;
	    $scope.filteredTodos = $scope.todos.slice(begin, end);
	});


});



