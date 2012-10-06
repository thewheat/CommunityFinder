<?php

include('./bootstrap.php');

$conversation_id = $_POST['conversation_id'];

if($_SESSION['user']['user_id']) {
		// returns all conversations for a given user as xml document
		$link=mysql_connect($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW']) or die ('I cannot connect to the database because: ' . mysql_error());
		$success = mysql_select_db($SITE['DB_NAME'], $link);
		
		// update read_flag
		$update_query = 'UPDATE conversation_to_user 
						 SET read_flag = 1 
						 WHERE conversation_id = ' . $conversation_id . ' 
						 AND user_id = ' . $_SESSION['user']['user_id'];
		$update_result = mysql_query($update_query, $link);	
		
		// get all participants for this conversation
		$participants_query="SELECT * 
							 FROM conversation, conversation_to_user, user 
							 WHERE conversation_to_user.conversation_id = conversation.conversation_id 
							 AND conversation_to_user.user_id = user.user_id 
							 AND conversation.conversation_id = " . $conversation_id;
			
		$participants_result = mysql_query($participants_query, $link);
			
		$participants = '';
		while($participants_row = mysql_fetch_assoc($participants_result)) {
			$participants .= $participants_row['user_id'] . ', ';
			$title = $participants_row['title']; // will be same for each record, easier than another query
		}
		
		$main_query =  "SELECT * FROM conversation, conversation_message, user 
						WHERE user.user_id = conversation_message.user_id
						AND   conversation_message.conversation_id = conversation.conversation_id 
						AND   conversation.conversation_id = $conversation_id
						ORDER BY conversation_message_id"; // use id instead of timestamp as should be quicker but same order							

										
		$result = mysql_query($main_query, $link);
			
		header('Content-Type: text/xml');			
		print('<response>' . "\n");
		print('<response_state success="true" />' . "\n");
		
		print('<conversation conversation_id="' . $conversation_id . '" title="' . $title . '" participants="' . $participants . '">' . "\n");

		while ($row = mysql_fetch_assoc($result)) {	
			print('  <conversation_message conversation_message_id="' . $row['conversation_message_id'] . '" '
				. 'user="' . $row['username'] . '" timestamp="' . $row['timestamp'] . '" message	="' . $row['message'] .'"/>' . "\n");
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
