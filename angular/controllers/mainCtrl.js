var app = angular.module('app');

app.controller('MainCtrl', function($scope, $http, drawFactory){

	$scope.saveLoading = false;
	$scope.saved = false;

	$scope.init = function(){
		drawFactory.init();
	}
	
	$scope.mouseClick = function($event){
		drawFactory.mouseClick($event);
	};

	$scope.undo = function(){
		drawFactory.undo();
	}

	$scope.clear = function(){
		drawFactory.clear();
	}
	$scope.saveData = {};

	$scope.saveDrawing = function(){

		$scope.saveData.segments = drawFactory.getUserSegments();
		$scope.saveData.author = 'me';

		$scope.saveLoading = true;
		$http.post('http://localhost:3000/api/save', $scope.saveData)
			.then(function(res){
				console.log('saved');
			})
			.catch(function(err){
				alert('Something went wrong saving');
			})
			.finally(function(){
				$scope.saveLoading = false;
				$scope.saved = true;
			});
	}


})

app.factory('drawFactory', function(){
	var service = {};
	var lastPt = {};
	var userPath = {};
	var path = {};
	var color = 'black';
	var numSegments = 0;


	service.init = function(){
		var canvas = document.getElementById('Canvas');
		paper.setup(canvas);

		path = new paper.Path();
		path.strokeColor = 'black';
		path.strokeWidth = 5;

		userPath = new paper.Path();
		userPath.strokeColor = color;
		userPath.strokeWidth = 5;

		drawBorder();
	}

	service.getUserSegments = function(){
		return userPath.segments;
	}

	var drawBorder = function(){
		var start = new paper.Point(0,0);
		path.moveTo(start);
		path.add(new paper.Point(0, 519));
		path.add(new paper.Point(1040, 519));
		path.add(new paper.Point(1040, 0));
		path.add(new paper.Point(0, 0));

		draw();
	}

	var draw = function(){
		paper.view.draw();
	}

	service.mouseClick = function($event){
		lastPt.x = $event.layerX;
		lastPt.y = $event.layerY;
		userPath.add(new paper.Point(lastPt.x, lastPt.y));
		numSegments++;

		draw();
	}

	service.undo = function(){
		if(numSegments == 2){
			numSegments = 0;
			userPath.removeSegments();
		}
		else{
			numSegments--;
			userPath.removeSegment(numSegments);
		}
		draw();
	}

	service.clear = function(){
		numSegments = 0;
		userPath.removeSegments();
		draw();
	}

	return service;
});

