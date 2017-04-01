var app = angular.module('starter.controllers', [])
.controller('ProfileCtrl', function($scope) {
    $scope.profile = [{
    id: 201410505,
    Fname: 'John Philip',
	Lname: 'Canlas',
    img: 'img/avatar.jpg'
  }];

})

.controller('HistoryCtrl', function($scope) {

  
    $scope.record = [{
    id: 10010,
    Fname: 'John Philip',
	Lname: 'Canlas',
	alarmDate: 'March 31, 2017',
	alarmDuration: '20 seconds',
	alarmLevel: 'HIGH'
  }];

})


.controller('newsController', function ($scope, $http) {
    $http.get('https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=6d80a92cce7f4047b0e761178e5d62b5')
        .success(function (data) {
            // The json data will now be in scope.
            $scope.myJsonData = data.articles;
        });
});

