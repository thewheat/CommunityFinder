<?php
include('./bootstrap.php');

$lid = ($_GET['lid']);

$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
if (!mysqli_connect_errno()) {
	

	if($stmt = $mysqli->prepare("SELECT comment, name, username, marker_comment.added_on  
														FROM marker_comment, user 
														WHERE marker_comment.user_id = user.user_id 
														AND marker_id = ? ORDER BY marker_comment.added_on DESC")) {
	
		$stmt->bind_param("i", $lid);
		$stmt->execute();
		$stmt->bind_result($comment, $name, $username, $timestamp);

		header('Content-Type: text/xml');
		print('<response>' . "\n");
		print('<response_state success="true" />' . "\n");

		while($stmt->fetch()) {	   
				print('<comment>' . "\n");
				print('<comment_text>' . stripslashes($comment) . '</comment_text>' . "\n");
				print('<username>' . $username . '</username>' . "\n");
				print('<name>' . stripslashes($name) . '</name>' . "\n");
				print('<timestamp>' . $timestamp . '</timestamp>' . "\n");
				print('</comment>' . "\n");
		}

		print('</response>' . "\n");
	
			
			/*else {
				header('Content-Type: text/xml');		
				print('<response>' . "\n");
				print('  <response_state success="false" />' . "\n");
				print('  <error error_code="invalid_username" message="Invalid Username" />' . "\n");
				print('</response>' . "\n");
		
		}	*/
		
		
		$stmt->close(); // close statement
	}
	$mysqli->close(); // close connection
}

?>
