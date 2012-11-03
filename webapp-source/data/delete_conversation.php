<?php
	include('./bootstrap.php');

	if($_SESSION['user']['user_id']) {

		$user_id = $_SESSION['user']['user_id'];
		$conversation_ids = rtrim($_POST['conversation_ids'], ',');
		$conversation_ids_array = explode(',', $conversation_ids);
		
		$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
		if (!mysqli_connect_errno()) {		
			foreach($conversation_ids_array as $conv_id) {
				//INSERT covnersation record
				if($stmt = $mysqli->prepare("UPDATE conversation_to_user SET deleted = 1 WHERE conversation_id = ? AND user_id = ?")) {
					$stmt->bind_param("ii", $conv_id, $user_id);
					$stmt->execute();
					$stmt->store_result();
					$success = $stmt->affected_rows;
					$stmt->close();
				}
			}			
		}
		$mysqli->close(); // close connection
		//OUTPUT
		header('Content-Type: text/xml');			
		print('<response>' . "\n");
		print('<response_state success="true" />' . "\n");
		print('</response>' . "\n");
	}
	else {
		header('Content-Type: text/xml');	
		print('<response>' . "\n");
		print('  <response_state success="false" />' . "\n");
		print('</response>' . "\n");
	}

?>
