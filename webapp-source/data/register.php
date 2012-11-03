<?php
include('./bootstrap.php');

	$email = $_POST['email'];  
	$password = md5($_POST['password']);  
	$full_name = $_POST['full_name'];  
	$username = $_POST['username'];	
	
	
	$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
	if (!mysqli_connect_errno()) {
		if($stmt = $mysqli->prepare("SELECT username FROM user WHERE email = ? ")) {
			$stmt->bind_param("s", $email);
			$stmt->execute();
			$stmt->store_result();
			$email_exists = $stmt->num_rows;
			$stmt->close();
		}
		if($stmt = $mysqli->prepare("SELECT email FROM user WHERE username = ? ")) {
			$stmt->bind_param("s", $username);
			$stmt->execute();
			$stmt->store_result();
			$username_exists = $stmt->num_rows;
			$stmt->close();        
		}
		
		if($email_exists) {
			header('Content-Type: text/xml');	
			print('<response>' . "\n");
			print('  <response_state success="false" />' . "\n");
			print('  <error error_code="email_exists" message="Email Address Already Exists" />' . "\n");
			print('</response>' . "\n");
			$_SESSION['user'] =	null;			
		}
		else if($username_exists) {
			header('Content-Type: text/xml');	
			print('<response>' . "\n");
			print('  <response_state success="false" />' . "\n");
			print('  <error error_code="username_exists" message="Username Already Exists" />' . "\n");
			print('</response>' . "\n");
			$_SESSION['user'] =	null;
		}		
		else {
			// create rego code to validate email address							
			$rego_code = md5(uniqid(rand(), true));
			if($stmt = $mysqli->prepare("INSERT INTO user (user_id, full_name, username, email, password, state, rego_code, added_on )
							VALUES (NULL, ?, ?, ?, ?, 'unconfirmed', ?, NOW());")) {
				$stmt->bind_param("sssss", $full_name, $username, $email, $password, $rego_code);
				$stmt->execute();
				$stmt->store_result();
				$success = $stmt->affected_rows;
				$new_user_id = $stmt->insert_id;
				$stmt->close();
			}
			if($success) {
				// send email
				$recipient = $email; //recipient
				$subject = "VictoriaMyCommunity.org --  Registration Confirmation"; //subject
				$mail_body = "Hi $full_name, \n\nThanks for joining VictoriaMyCommunity.org.  Your registration is almost complete, just click on the link below so we can confirm your email address, and log you into the site:\n";
				$mail_body .= 'http://' . $SITE['DOMAIN'] . '/index.php?action=rego_confirm&rego_email=' . $email . '&rego_code=' . $rego_code . "\n\n";
				$mail_body .= "If you did not register for the site, please disregard this message. \n\nThanks,\nVictoriaMyCummunity.org.";
				$header = "From: Register <register@victoriamycommunity.org> \r\n"; //optional headerfields
			
				mail($recipient, $subject, $mail_body, $header); //mail command :) 
			
				header('Content-Type: text/xml');	
				print('<response>' . "\n");
				print('<response_state success="true" />' . "\n");
				print('</response>' . "\n");		
				
				/////////////////////////////////
				// And add a message in their inbox for when they confirm rego....
				// insert conversation record
				if($stmt = $mysqli->prepare("INSERT INTO conversation (conversation_id, title)  VALUES (NULL, 'Welcome to VictoriaMyCommunity.org!')")) {
					$stmt->execute();
					$stmt->store_result();
					$conversation_id = $stmt->insert_id;
					$stmt->close();
				}
				//insert conversation_to_user record for sender
				if($conversation_id && ($stmt = $mysqli->prepare("INSERT INTO conversation_to_user (conversation_to_user_id, conversation_id, user_id, read_flag)  
						VALUES (NULL, ?, 51, 0)"))) {
					$stmt->bind_param("i", $conversation_id);
					$stmt->execute();
					$stmt->store_result();
					$success = $stmt->affected_rows;
					$stmt->close();
				}
				//insert conversation_to_user record for recipient (use user_id from rego insert above)
				if($conversation_id && ($stmt = $mysqli->prepare("INSERT INTO conversation_to_user (conversation_to_user_id, conversation_id, user_id, read_flag)  
						VALUES (NULL, ?, ?, 0)"))) {
					$stmt->bind_param("ii", $conversation_id, $new_user_id);
					$stmt->execute();
					$stmt->store_result();
					$success = $stmt->affected_rows;
					$stmt->close();
				}
				//Insert conversation_message record
				if($conversation_id && ($stmt = $mysqli->prepare("INSERT INTO conversation_message (conversation_message_id, conversation_id, user_id, message)  
						VALUES (NULL, ?, 51, ?)"))) {
					$message = 'Hi, Thanks for signing up for the site.  To get started, you can click on the home button up the top left, and then enter the address of the area
					you\'e interested in.  We\'d also appretiate your feedback, or any ideas you have.  Please feel free to tell us what you think by replying to this message, cheers, victoriamycommunity.org';
					$stmt->bind_param("is", $conversation_id, $message);
					$stmt->execute();
					$stmt->store_result();
					$success = $stmt->affected_rows;
					$stmt->close();
				}
				
			
			////////////////////////////////////////////////////
				
				
			}
			else {
				header('Content-Type: text/xml');	
				print('<response>' . "\n");
				print('  <response_state success="false" />' . "\n");
				print('  <error error_code="db_error	" message="Error Adding User to DB" />' . "\n");
				print('</response>' . "\n");

				$_SESSION['user'] =	null;
			}
		}
		$mysqli->close();		
	}
?>
