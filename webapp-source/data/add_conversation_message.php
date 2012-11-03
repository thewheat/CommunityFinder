<?php	 	

include('./bootstrap.php');

if($_SESSION['user']['user_id']) {
		$link=mysql_connect($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW']) or die ('I cannot connect to the database because: ' . mysql_error());
		$success = mysql_select_db($SITE['DB_NAME'], $link);
		
		$user_id = $_SESSION['user']['user_id'];
		
		$conversation_id = $_POST['conversation_id'];
		$message = $_POST['message'];

		// insert message
		$insert_message_query = "INSERT INTO conversation_message (conversation_id, user_id, message)
								VALUES ($conversation_id, $user_id, '$message')";
		$insert_messge_result = mysql_query($insert_message_query, $link);	
		
		// update all other users read_flag to 0 'unread'
		$update_query = 'UPDATE conversation_to_user 
						 SET read_flag = 0 
						 WHERE conversation_id = ' . $conversation_id . ' 
						 AND user_id <> ' . $_SESSION['user']['user_id'];
		$update_result = mysql_query($update_query, $link);	
		
		// get all participants for this conversation
		$participants_query="SELECT * 
							 FROM conversation, conversation_to_user 
							 WHERE conversation_to_user.conversation_id = conversation.conversation_id 
							 AND conversation.conversation_id = " . $conversation_id;
		$participants_result = mysql_query($participants_query, $link);	
		$participants = '';
		while($participants_row = mysql_fetch_assoc($participants_result)) {
			$participants .= '(user ' . $participants_row['user_id'] . ') ';
			$title = $participants_row['title']; // will be same for each record, easier than another query
		}
		
		$main_query =  "SELECT * FROM conversation, conversation_message, user 
						WHERE user.user_id = conversation_message.user_id
						AND   conversation_message.conversation_id = conversation.conversation_id 
						AND   conversation.conversation_id = $conversation_id 
						ORDER BY conversation_message_id"; // use id instead of timestamp as should be quicker but same order							
		$result = mysql_query($main_query, $link);
			
		//OUTPUT
		header('Content-Type: text/xml');			
		print('<response>' . "\n");
		print('<response_state success="true" />' . "\n");
		print('<conversation conversation_id="' . $conversation_id . '" title="' . $title . '" participants="' . $participants . '">' . "\n");
		while ($row = mysql_fetch_assoc($result)) {	
			print('  <conversation_message conversation_message_id="' . $row['conversation_message_id'] . '" '
				. 'user="' . $row['user_id'] . '" timestamp="' . $row['timestamp'] . '" message	="' . $row['message'] .'"/>' . "\n");
		}
		print('</conversation>' . "\n");
		print('</response>' . "\n");
	}
	else {
		header('Content-Type: text/xml');	
		print('<response>' . "\n");
		print('  <response_state success="false" />' . "\n");
		print('</response>' . "\n");
	}

?>
