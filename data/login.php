<?php	
include('./bootstrap.php');

$email_or_username = htmlspecialchars($_POST['email_or_username']);
$password = md5($_POST['password']);

$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
if (!mysqli_connect_errno()) {
	if($stmt = $mysqli->prepare("SELECT user_id, username, email, full_name, last_lng, last_lat, last_zoom 
														FROM user  WHERE (email = ? OR username = ?) 
														AND password = ?  AND state = 'active' LIMIT 1 ")) {
	
		$stmt->bind_param("sss", $email_or_username, $email_or_username, $password);
		$stmt->execute();
		$stmt->bind_result($user_id, $username, $email, $full_name, $last_lng, $last_lat, $last_zoom);

		if($stmt->fetch()) {	   
				header('Content-Type: text/xml');	
				print('<response>' . "\n");
				print('<response_state success="true" />' . "\n");
				print('<user user_id ="' . $user_id . '" email="' . $email . '" full_name="' . $full_name . '" username="' . $username . '" />' . "\n");
				print('<last_view last_lng="' . $last_lng . '" last_lat="' . $last_lat . '" last_zoom="' . $last_zoom . '" />'. "\n");
				print('</response>' . "\n");
				
				$_SESSION['user'] = array();
				$_SESSION['user']['user_id'] = $user_id;
				$_SESSION['user']['email'] = $email;
				$_SESSION['user']['full_name'] = $full_name;
				$_SESSION['user']['username'] = $username;
		}
		else {
				header('Content-Type: text/xml');		
				print('<response>' . "\n");
				print('  <response_state success="false" />' . "\n");
				print('  <error error_code="invalid_username_password" message="Incorrect Username or Password" />' . "\n");
				print('</response>' . "\n");
		
				$_SESSION['user'] =	null;
		}	   
		$stmt->close(); // close statement
	}
	$mysqli->close(); // close connection
}

?>
