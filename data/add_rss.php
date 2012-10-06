<?php	 	
include('./bootstrap.php');

	$rss = $_POST['rss'];	
	
	if($_SESSION['user']['user_id']) {
	
		$user_id = $_SESSION['user']['user_id'];
		$username = $_SESSION['user']['username'];
		$rss = $_POST['rss'];	
	
		$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
		if (!mysqli_connect_errno()) {
			if($stmt = $mysqli->prepare("INSERT INTO user_rss_feeds (user_rss_feed_id, user_id, url, added_on )
							VALUES (NULL, ?, ?, NOW());")) {
				$stmt->bind_param("is", $user_id, $rss);
				$stmt->execute();
				$stmt->store_result();
				$success = $stmt->affected_rows;
				$stmt->close();
			}
			if($success) {
				header('Content-Type: text/xml');		
				print('<response>' . "\n");
				print('  <response_state success="true" />' . "\n");
				print('</response>' . "\n");	
			}
			else {
				header('Content-Type: text/xml');		
				print('<response>' . "\n");
				print('  <response_state success="false" />' . "\n");
				print('  <error error_code="db_error" message="Database Error" />' . "\n");
				print('</response>' . "\n");	
				
			}
		}
		$mysqli->close(); // close connection

	}
	else {
				header('Content-Type: text/xml');		
				print('<response>' . "\n");
				print('  <response_state success="false" />' . "\n");
				print('  <error error_code="not_logged_in" message="You to Loggin first" />' . "\n");
				print('</response>' . "\n");		
	}

?>
