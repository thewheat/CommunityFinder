<?php
include('./bootstrap.php');

$username = htmlspecialchars($_GET['username']);

$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
if (!mysqli_connect_errno()) {
	if($stmt = $mysqli->prepare("SELECT full_name, blurb, www 
														FROM user  WHERE username = ? LIMIT 1 ")) {
	
		$stmt->bind_param("s", $username);
		$stmt->execute();
		$stmt->bind_result($full_name, $blurb, $www);

		if($stmt->fetch()) {	   
				header('Content-Type: text/xml');
				print('<response>' . "\n");
				print('<response_state success="true" />' . "\n");
				print('<user>');
				print('<full_name test="test">' . $full_name . '</full_name>' . "\n");
				print('<www>' . $www . '</www>' . "\n");
				print('<blurb>' . $blurb . '</blurb>' . "\n");
				print('</user>' . "\n");
				print('</response>' . "\n");
		}
		else {
				header('Content-Type: text/xml');		
				print('<response>' . "\n");
				print('  <response_state success="false" />' . "\n");
				print('  <error error_code="invalid_username" message="Invalid Username" />' . "\n");
				print('</response>' . "\n");
		
		}	   
		$stmt->close(); // close statement
	}
	$mysqli->close(); // close connection
}

?>
