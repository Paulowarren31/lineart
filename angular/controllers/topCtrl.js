var app = angular.module('app');

app.controller('TopCtrl', function($scope, $http, drawMultipleFactory){

	$scope.topDraw = drawMultipleFactory.getTopDrawings();
	$scope.loadTopDrawings = function(){
		drawMultipleFactory.init();
	}

		
});

app.factory('drawMultipleFactory', function($http){
	var service = {};
  var topDrawings = [];

	service.init = function(){
		var addDrawing = {};

		for(var i = 0; i < 12; i++){
			topDrawings.push({
				id: i,
				votes: -1,
				author: 'a',
				title: 't',
				segments: []
			});
		}

		$http.get('http://localhost:3000/api/topTen').then(function(res){
			var len = res.data.length;
			for(var i =0; i < len; i++){

				topDrawings[i].author = res.data[i].author;
				topDrawings[i].votes = res.data[i].votes;
				topDrawings[i].title = res.data[i].title;
				topDrawings[i].segments = res.data[i].segments;

				var topCanvas = document.getElementById(i);
				paper.setup(topCanvas);
				var topPath = new paper.Path();
				topPath.strokeColor = 'black';
				topPath.strokeWidth = 5;
				var topLength = topDrawings[i].segments.length;
				
				for(var j = 0; j < topLength; j++){
					topDrawings[i].segments[j][1] *= 326.656;
					topDrawings[i].segments[j][2] *= 163;
				}

				var startX = topDrawings[i].segments[0][1];
				var startY = topDrawings[i].segments[0][2];

				var start = new paper.Point(startX,startY);
				topPath.moveTo(start);
				for(var j = 1; j < topLength; j++){
					startX = topDrawings[i].segments[j][1];
					startY = topDrawings[i].segments[j][2];

					topPath.lineTo(start.add([startX, startY]));
					paper.view.draw();
				}
			}
			topDrawings = [];
		});
	};
	service.getTopDrawings = function(){
		return topDrawings;
	}
	var draw = function(){
		paper.view.draw();
	}

	return service;
})
