var app = angular.module('starter.controllers', [])
.controller('ProfileCtrl', function($scope) {
    var data = localStorage.getItem("name");
    
    $scope.profile = [{
    id: 201410505,
    Fname: data,
    img: 'img/avatar.jpg'
  }];

})

.controller('HistoryCtrl', function($scope, $http){

    $http.get('https://homeshield.000webhostapp.com/HomeShield/php/pull1.php')
        .success(function (info) {
            // The json data will now be in scope.
	$scope.myJsonData = info;
	console.log(info);
	
        });
		
})


.controller('newsController', function ($scope, $http) {
    $http.get('https://newsapi.org/v1/articles?source=cnn&sortBy=top&apiKey=6d80a92cce7f4047b0e761178e5d62b5')
        .success(function (data) {
            // The json data will now be in scope.
            $scope.myJsonData = data.articles;
        });
})

.controller('login', function ($scope, $http, $state, $ionicHistory) {
   $scope.loginform = function (){
    var username = $scope.username;
    var password = $scope.password;
    
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $http({
        url: 'https://homeshield.000webhostapp.com/HomeShield/php/login.php',
        method: "POST",
        data: {
            'username' : username,
            'password' : password
        }
    })
    .then(function(response){
        console.log(response);
        var data = response.data[0];
        if(data != "Account Doesn't exist!"){
            $scope.username = '';
            $scope.password = '';
            $state.go('app.home');
            localStorage.setItem("name",data);
        }
		else{
            $scope.error = data;
            $scope.password = '';
        }
    },
    function(response){
        console.log('Error');
    });
   }
})
.controller('register', function ($scope, $http, $state, $ionicHistory) {
   $scope.loginform = function (){
    var username = $scope.username;
    var password = $scope.password;
    var fullname = $scope.fullname;
    var address = $scope.address;
    var contact = $scope.contact;
    
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $http({
        url: 'https://homeshield.000webhostapp.com/HomeShield/php/register.php',
        method: "POST",
        data: {
            'username' : username,
            'password' : password,
            'fullname' : fullname,
            'address' : address,
            'contact' : contact
        }
    })
    .then(function(response){
        console.log(response);
        var data = response.data[0];
            $scope.username = '';
            $scope.password = '';
            $scope.address = '';
            $scope.contact = '';
            $state.go('app.home');
            localStorage.setItem("name",fullname);
     
    },
    function(response){
        console.log('Error');
    });
   }
});



