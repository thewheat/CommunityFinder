<?php
include('./bootstrap.php');


if($_SESSION['user']['user_id']) {
	
		// returns all markers in database formated as xml document
	
		$link=mysql_connect($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW']) or die ('I cannot connect to the database because: ' . mysql_error());
		$success = mysql_select_db($SITE['DB_NAME'], $link);
		
		$query =  " SELECT *
								FROM `user_rss_feeds`
								WHERE `user_id` = " . $_SESSION['user']['user_id'] . "
								LIMIT 0 , 30  ";
										
		$result = mysql_query($query, $link);
			
		header('Content-Type: text/xml');			
		print('<response>' . "\n");
		print('<response_state success="true" />' . "\n");
		
		while ($row = mysql_fetch_assoc($result)) {
			print('<feed url="' . $row["url"] . '" />' . "\n");
		}
		
		print('</response>' . "\n");
		
	}
	
	else {
	
		header('Content-Type: text/xml');	
		
		print('<response>' . "\n");
		print('  <response_state success="false" />' . "\n");
		print('</response>' . "\n");

			
	}

?>
