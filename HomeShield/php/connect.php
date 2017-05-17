<?php 
	//connection
	header('Access-Control-Allow-Origin: *'); // macontrol kung sno pwede makapagaccess ng data na andto. asterisk, lahat pwede makaaccess
	header('application/json');
	
	$SERVER = "localhost";
	$USERNAME = "root";
	$PASSWORD = "";
	$DBASE = "homeshield";
	
	//define("SERVER", "localhost"); mas secure
	
    $conn = mysqli_connect($SERVER,$USERNAME,$PASSWORD,$DBASE);

?>