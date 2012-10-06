<?php	 
include('./bootstrap.php');

$restrict_subtype = ($_GET['restrict_subtype']) ? $_GET['restrict_subtype'] : '';
$restrict_subtype = ($restrict_subtype == 'ALL' || $restrict_subtype == 'all') ? '': $restrict_subtype;

		$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
		if (!mysqli_connect_errno()) {
				$query =  " SELECT marker_id, subtype  ";
				$query .= " FROM marker ";
								
				if($stmt = $mysqli->prepare($query)) {
					
						$stmt->execute();		
						$stmt->store_result();
						$stmt->bind_result($marker_id, $subtype_cd);
				}	
				//print ($mysqli->error);
				
				header('Content-Type: text/xml');
				print('<icons>' . "\n");
				while ($stmt->fetch()) {
					printf('<icon marker_id="%s" subtype="%s"/>', 
											$marker_id, $subtype_cd);
					print("\n");
					
					if (!mysqli_connect_errno()) {
						$query2 =  " SELECT subtype_id ";
						$query2 .= " FROM subtype WHERE subtype_cd = '$subtype_cd' ";
						
						
						if($stmt2 = $mysqli->prepare($query2)) {	
								$stmt2->execute();		
								$stmt2->store_result();
								$stmt2->bind_result($subtype_id);								
								$stmt2->fetch();
								print($subtype_id);
						}
						
						$query3 =  " UPDATE .marker  SET  subtype_id =  $subtype_id ";
						$query3 .= "  WHERE  `marker`.`marker_id` = $marker_id ";
						
						
						if($stmt3 = $mysqli->prepare($query3)) {	
								$stmt3->execute();		
								$stmt3->store_result();
								//$stmt3->bind_result($subtype_id);								
								//$stmt3->fetch();
								print($stmt3->affected_rows);
						}
						
						
						
						
					}
					
					
					
					
					
					
				}
				print('</icons>' . "\n");
	
				
				$stmt->close();
		}
		$mysqli->close();

?>
