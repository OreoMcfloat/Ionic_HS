var app = angular.module('starter.controllers', [])

// LOGIN AND SIGN UP FUNCTION
app.controller('login', function($scope, $http, $state){
	
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var productid = localStorage.getItem("productid");
	var name = localStorage.getItem("firstname");
	
	if(productid != null){
		$state.go('app.home');
	}
      
	$scope.signinAction = function(){
		var username = $scope.username;
		var password = $scope.password;

		if(password == undefined || username == undefined || password == "" || username == ""){
			$scope.errorsignin = "Please comple the form!";
		}else{
			$scope.errorsignin = "";
			$http({
				url: 'http://localhost/fireaway/login.php',
				method: "POST",
				data: { 
					'username' : username,
					'password' : password
				}
			})
			.then(function(response) {
				// success
				if(response.data == "No product id" || response.data == "Not registered"){
					localStorage.setItem("username",username);
					$state.go('productid');
					$scope.errorsignin = "";
					$scope.password = "";
				}else if(response.data == "Account doesn't exist"){
					$scope.errorsignin = response.data;
					$scope.password = "";
				}else{
					localStorage.setItem("username",username);
					localStorage.setItem("productid",response.data);
					$state.go('app.home');
					$scope.errorsignin = "";
					$scope.password = "";
				}
			}, function(response) { // optional
				// failed
				console.log('error');
			});
		}
	}

	$scope.signupAction = function(){
		var firstname = $scope.firstname;
		var lastname = $scope.lastname;
		// var password = $scope.passwordS;
		// var repassword = $scope.repasswordS;
		$scope.waiting = 'Please Wait.....';
		
		if(firstname == undefined || lastname == undefined || firstname == "" || lastname == ""){
			$scope.errorsignup = "Please comple the form!";
		}else{
			$scope.errorsignup = "";
			$http({
				url: 'http://localhost/fireaway/adduser.php',
				method: "POST",
				data: { 
					'firstname' : firstname,
					'lastname' : lastname,
					// 'password' : password
				}
			})
			.then(function(response) {
				// success
				if(response.data == "Successfully Registered!"){
					localStorage.setItem("firstname", $scope.firstname);
					$state.go('productid');
				}      
			}, function(response) { 
				// optional
				// failed
				$scope.waiting = '';
				$scope.errorsignup = "No internet connection !";
				console.log('error');
			});
		}
	}
})

// checking device if already installed
app.controller('productid', function($scope, $state, $http){

	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var productid = localStorage.getItem("productid");
	var name = localStorage.getItem("firstname");
	if(productid != null && name != null){
		$state.go('app.home');
	}

	$scope.productidAction = function(){
		if($scope.productid == "" || $scope.productid == undefined){
			$scope.error = "Please enter a product id";
		}else{
			var username = localStorage.getItem("username");
			$http({
				url: 'http://localhost/fireaway/productid.php',
				method: "POST",
				data: { 
					'action' : 'check',
					'productid' : $scope.productid,
					'username' : username
				}
			})
			.then(function(response) {
				// success
				if(response.data == "Not registered"){
					localStorage.setItem("temp_id", $scope.productid);
					$state.go('setup');
				}else if(response.data == "It is already registered"){
					localStorage.setItem("productid", $scope.productid);
					$state.go('app.home');
				}else{
					$scope.error = response.data;
				}
			}, function(response) {
				// optional
				// failed
				console.log('error');
			});
		}
	}
})

// Setting up device
app.controller('setup',function($scope, $state, $http){

	var productid = localStorage.getItem("productid");
	var name = localStorage.getItem("firstname");
	if(productid != "" && name != ""){
		$state.go('app.home');
	}

	$scope.finishAction = function(){
		if($scope.home == "" || $scope.barangay == "" || $scope.city == "" || $scope.home == undefined || $scope.barangay == undefined || $scope.city == undefined ){
			$scope.error = "Please complete the form from the previous page";
		}else{
			var productid = localStorage.getItem("temp_id");
			var username = localStorage.getItem("username");
			$http({
				url: 'http://localhost/fireaway/productid.php',
				method: "POST",
				data: { 
					'action' : 'register',
					'productid' : productid,
					'home' : $scope.home,
					'barangay' : $scope.barangay,
					'city' : $scope.city,
					'username' : username
				}
			})
			.then(function(response) {
				// success
				if(response.data == "Device successfully set"){
					localStorage.setItem("productid", productid);
					$state.go('app.home');
				}else{
					$scope.error = response.data;
				}      
			}, function(response) {
				// optional
				// failed
				console.log('error');
			});
		}
	}
})

// HOME PAGE CONTROLLER
app.controller('home',function($state, $scope, $http, $interval){

	setInterval(function(){
		$http({
			url: 'http://localhost/fireaway/tips.php',
			method: "GET",
		})
		.then(function(response) {
			var dailytips = response['data']['0']['event']+" a fire "+response['data'][0]['type'];
			localStorage.setItem('dailytips',dailytips);
			localStorage.setItem('dailytipsid',reponse['data'][0]['id']);
		}, function(response) { 
			// optional
			console.log('error');        
		});
	},1200000);
	
	var promise = $interval(function(){
		
		$http({
		url: 'http://localhost/fireaway/tips.php',
		method: "GET",
		})
		.then(function(response) {
			if(localStorage.getItem('dailytips') == null || localStorage.getItem('dailytips') == ""){
				var dailytips = response['data']['0']['event']+" a fire "+response['data'][0]['type'];
				localStorage.setItem('dailytips',dailytips);
				localStorage.setItem('dailytipsid',reponse['data'][0]['id']);
			}
		}, function(response) { 
			// optional
			console.log('error');        
		});
		
		var productid = localStorage.getItem("productid");
		var today = new Date();
		var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
		var date = months[today.getMonth()]+' '+today.getDate()+', '+today.getFullYear();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var dateTime = date+' '+time;
		var t = "";

		if(today.getHours() >= 12){
			t = "pm";
		}else{
			t = "am";
		}

		$http({
			url: 'http://localhost/fireaway/status.php',
			method: "POST",
			data: { 
				'productid' : productid
			}
		})
		.then(function(response) {
			// success
			var last_data = localStorage.getItem("data");
			if(last_data == null){
				localStorage.setItem("data",JSON.stringify(response['data']));
			}else if(last_data != JSON.stringify(response['data']) && response != "[]" && response != "" && response != null){
				localStorage.setItem("data",JSON.stringify(response['data']));
			}
				 
			var datetime = dateTime+' '+t;
			localStorage.setItem("lastcheck",datetime);

		}, function(response) { 
			// optional
			console.log('error');        
		});
		
		var dailytips = localStorage.getItem('dailytips');
		$scope.dailytips = dailytips;
		
		  var data = JSON.parse(localStorage.getItem("data"));
		  $scope.fire = data[0]['fire'];
		  $scope.smoke = data[0]['smoke'];
		  $scope.humidity = data[0]['humidity'];
		  $scope.date = localStorage.getItem("lastcheck");
		  check(data);

	},500);

	function check(values){

		var alertcode = values[0]['alertcode'];
		var fire = values[0]['fire'];
		var smoke = values[0]['smoke'];
		var humidity = values[0]['humidity'];
		var alert_fire = 300;
		var alert_smoke = 300;
		var alert_humidity = 300;
		var medium_fire = 100;
		var medium_smoke = 220;
		var medium_humidity = 100;
		var low_fire = 15;
		var low_smoke = 165;
		var low_humidity = 62;
		var alert = 0;
		var types = ['Fire','Smoke','Humidity'];

		if(fire >= alert_fire && smoke >= low_smoke){
			$state.go('status');
		}
		
		if(fire >= low_fire || smoke >= low_smoke || humidity >= low_humidity){
			$scope.status_ok = "";
		
			if(fire >= alert_fire){
				$scope.status_label = "We have detected a big amount of fire!";
			}else if(smoke >= alert_smoke){
				$scope.status_label = "We have detected a big amount of smoke !";
			}else if(fire >= medium_fire){
				$scope.status_label = "Fire is getting big, please be aware!";
			}else if(smoke >= medium_smoke){
				$scope.status_label = "Smoke is getting big, please be aware!";
			}else if(humidity >= medium_humidity){
				$scope.status_label = "Humidity is getting high, this may cause fire!";
			}else if(fire >= low_fire){
				$scope.status_label = "Small amount of fire detected.";
			}else if(smoke >= low_smoke){
				$scope.status_label = "Small amount of smoke detected.";
			}else if(humidity >= low_humidity){
				$scope.status_label = "There's a small increase in humidity.";
			}
			
		}else{
			$scope.status_label = "";
			$scope.status_ok = "Everything is ok";
		}
	}
})

// STATUS PAGEEEEEEEEEEEEEEE
app.controller('alert',function($scope, $state, $http){

	setInterval(function(){
		var productid = localStorage.getItem("productid");
		$http({
			url: 'http://localhost/fireaway/status.php',
            method: "POST",
			data: { 
				'productid' : productid
            }
		})
		.then(function(response) {
            // success
            var data = response;
            check(data);  
		}, 
		function(response) { // optional
             console.log('error');       
		});
	},500);
	
	setInterval(function(){
		var productid = localStorage.getItem("productid");
		$http({
			url: 'http://localhost/fireaway/status.php',
            method: "POST",
			data: { 
				'productid' : productid
            }
		})
		.then(function(response) {
            // success
            var data = response;
            check(data);  
		}, 
		function(response) { // optional
             console.log('error');       
		});
	},500);

	function check(values){

		var alertcode = values['data'][0]['alertcode'];
		var fire = values['data'][0]['fire'];
		var smoke = values['data'][0]['smoke'];
		var humidity = values['data'][0]['humidity'];
		var alert_fire = 300;
		var alert_smoke = 300;
		var alert_humidity = 300;
		var medium_fire = 100;
		var medium_smoke = 220;
		var medium_humidity = 100;
		var low_fire = 15;
		var low_smoke = 165;
		var low_humidity = 62;
		var alert = 0;
		var types = ['Fire','Smoke','Humidity'];

		if(fire >= alert_fire || smoke >= alert_smoke){
			$scope.help = true;
			$scope.alert = false;
			$scope.whattodo = false;
			$scope.status_label = "We have detected a large amount of fire and smoke in your area !";
		}else if(humidity >= alert_humidity){
			$scope.help = false;
			$scope.whattodo = false;
			$scope.alert = false;
			$scope.status_label = "Value of humidity is still high this may can cause fire";
		}else if(fire >= medium_fire){
			$scope.help = true;
			$scope.whattodo = false;
			$scope.alert = false;
			$scope.status_label = "Fire is getting big, please be aware!";
		}else if(smoke >= medium_smoke){
			$scope.help = false;
			$scope.whattodo = false;
			$scope.alert = false;
			$scope.status_label = "Smoke is getting big, please be aware!";
		}else if(humidity >= medium_humidity){
			$scope.help = false;
			$scope.whattodo = false;
			$scope.alert = false;
			$scope.status_label = "Humidity is getting high, this may cause fire!";
		}else if(fire >= low_fire){
			$scope.help = false;
			$scope.whattodo = false;
			$scope.alert = false;
			$scope.status_label = "Small amount of fire detected.";
		}else if(smoke >= low_smoke){
			$scope.help = false;
			$scope.whattodo = false;
			$scope.alert = false;
			$scope.status_label = "Small amount of smoke detected.";
		}else if(humidity >= low_humidity){
			$scope.help = false;
			$scope.whattodo = false;
			$scope.alert = false;
			$scope.status_label = "There's a small increase in humidity.";
		}else{
			$scope.help = false;
			$scope.whattodo = true;
			$scope.alert = true;
			$scope.status_label = "You're place is safe now";
		}

	}

})

// DAILY TIPS DETAILS
app.controller('tipsdetails',function($scope, $http){
	
	setInterval(function(){
		$scope.dailytips = localStorage.getItem('dailytips');
	},1000);
	
})

//CREATE MESSAGE
app.controller('message',function($scope, $http, $state , $ionicScrollDelegate, $timeout, $interval){
		

	var productid = localStorage.getItem("productid");
	$scope.sendmessage = function(){
		var content =  $scope.messagecontent;
		var username = localStorage.getItem("firstname");
		
		$http({
			url: 'http://localhost/fireaway/sendmessage.php',
            method: "POST",
			data: { 
				'productid' : productid,
				'content' : content,
				'username' : username
            }
		})
		.then(function(response) {
            // succes
			$scope.messagecontent = "";
            $state.go('app.message');
		}, 
		function(response) { // optional
             console.log('error');       
		});
		
		
	}
	
	$scope.message_data = $interval(function(){
		$http({
			url: 'http://localhost/fireaway/messages.php',
            method: "POST",
			data: { 
				'productid' : productid
            }
		})
		.then(function(response) {
            // success
			if(JSON.stringify(response['data']) != localStorage.getItem("message")){
				localStorage.setItem("message",JSON.stringify(response['data']));
				$scope.message = JSON.parse(localStorage.getItem("message"));
				$ionicScrollDelegate.scrollBottom();	
			}else{
				$scope.message = JSON.parse(localStorage.getItem("message"));
			}
			
		}, 
		function(response) { // optional
             console.log('error');    
			 $scope.message = JSON.parse(localStorage.getItem("message"));

		});
			
			
			
	},1000)

	$scope.$on('$ionicView.beforeEnter', function(){
		$scope.message = JSON.parse(localStorage.getItem("message"));
		 $ionicScrollDelegate.scrollBottom();	
  });

	$scope.$on('$ionicView.beforeLeave', function(){
		$interval.cancel( $scope.message_data );
  });

		
	
})