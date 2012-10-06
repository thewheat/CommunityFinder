<?php	 	
include('./bootstrap.php');
include('./functions.php');	
	$existing_hoods = array();
	

	$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
	if (!mysqli_connect_errno()) {
		
		$query = "	SELECT sharehood_id, lat, lng, suburb 
															FROM sharehood ";
		
		if($stmt_sharehood = $mysqli->prepare($query)) {
			$stmt_sharehood->execute();
			$stmt_sharehood->bind_result($sharehood_id, $plat, $plng, $suburb);
			$stmt_sharehood->store_result();
			while($stmt_sharehood->fetch()) {
				//foreach sharehood member see if there is a hood within x meters of them
				if($stmt2 = $mysqli->prepare("SELECT marker_id FROM marker WHERE subtype = 'sharehood' AND 
														  " . mysqlHaversine($plat, $plng, 1.5) )) {
					$stmt2->execute();
					$stmt2->store_result();
					print('>> ' . $stmt2->num_rows . ' ');
					
					
					//if no hood in distance, add a hood at that spot...
					if($stmt2->num_rows === 0) {
						print('adding ');
						
						if (!mysqli_connect_errno()) {
							if($stmt = $mysqli->prepare("INSERT INTO marker (marker_id, alt_contact_email, alt_contact_url, title, description, type, 	subtype, lat, lng,  www, rss, is_demo ) 
												VALUES (NULL , '', '' , 'Local Community Sharehood', 'Community Sharing in Progress!  The Sharehood is all about sharing resources within your neighbourhood and helps you to meet and make friends with people in your local area, visit the site to find out more...', 'community', 'sharehood', ?, ?, 'http://www.thesharehood.org/' , NULL , 'n'	);")) {
								$stmt->bind_param("dd", $plat, $plng);
								$stmt->execute();
								$marker_id = $stmt->insert_id; // for next query
								$stmt->store_result();
								//$success = $stmt->affected_rows;
								print($stmt->error);
								$stmt->close();
							}
						}
						// Insert Marker to User Record
						if ($marker_id && !mysqli_connect_errno()) {
							if($stmt = $mysqli->prepare("INSERT INTO marker_to_user (marker_id, user_id, state)
													VALUES (?, 136, 'owner');")) {
								$stmt->bind_param("i", $marker_id);
								$stmt->execute();
								$stmt->store_result();
								$success = $stmt->affected_rows;
								$stmt->close();
							}
							
						}
						
					}
					
					$stmt2->reset();
					$stmt2->close();
								
				}		
			}
			$stmt_sharehood->close(); // close statement
		}
		
		
		
		/*
		
			if (!mysqli_connect_errno()) {
		if($stmt = $mysqli->prepare("INSERT INTO marker (marker_id, alt_contact_email, alt_contact_url, title, description, type, 	subtype, lat, lng,  www, rss, is_demo ) 
							VALUES (NULL , '', '' , 'title', 'description', ?, ?, ?, ?, NULL , NULL , 'n'	);")) {
			$stmt->bind_param("ssdd", $type, $subtype, $lat, $lng);
			$stmt->execute();
			$marker_id = $stmt->insert_id;
			$stmt->store_result();
			//$success = $stmt->affected_rows;
			print($stmt->error);
			$stmt->close();
		}
	}
	// Insert Marker to User Record
	if ($marker_id && !mysqli_connect_errno()) {
		if($stmt = $mysqli->prepare("INSERT INTO marker_to_user (marker_id, user_id, state)
								VALUES (?, 136, 'owner');")) {
			$stmt->bind_param("i", $marker_id);
			$stmt->execute();
			$stmt->store_result();
			$success = $stmt->affected_rows;
			$stmt->close();
		}
	}
		
		
		*/
		
		
		
		
		
		
		
		
		
		
		
		
	}
	
	
	$mysqli->close();
?>
