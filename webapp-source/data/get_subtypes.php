<?php
include('./bootstrap.php');

$restrict_subtype = ($_GET['restrict_subtype']) ? $_GET['restrict_subtype'] : '';
$restrict_subtype = ($restrict_subtype == 'ALL' || $restrict_subtype == 'all') ? '': $restrict_subtype;

		$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
		if (!mysqli_connect_errno()) {
				$query =  " SELECT subtype_name, subtype_cd, type_name, type_cd, is_addable, icon, prefixes, prefixes_help ";
				$query .= " FROM type, subtype ";
				$query .=  " WHERE type.type_id = subtype.type_id ";
				
				$types = '';
				$bindings = '';
				
				if ($restrict_subtype  != '' ) { 
					if( strpos($restrict_subtype, ',') ) {
						$subtype_array = explode(',', $restrict_subtype);
						$query .= "AND subtype.subtype_cd IN (";
						for($i = 0; $i < count($subtype_array); $i++) {
								$query .= "?,";
								$types .= 's';
								$bindings .= '$subtype_array[' . $i . '], ';
						}  
						$query = rtrim($query, ','); // remove last , before close braket
						$query .= ") "; 
					}
					else {
						$query .= " AND subtype.subtype_cd IN (?) ";
						$types .= 's';
						$bindings .= '$restrict_subtype, ';
					}
				}
				$query .=  " ORDER BY type_cd, subtype_name ";
				
				if($stmt = $mysqli->prepare($query)) {
						
						if($bindings) {
							$bindings = preg_replace('/,\s$/', '', $bindings);
							$bind_php = '$stmt->bind_param("' . $types . '", ' . $bindings . ');';
							eval($bind_php);
						}
						
						$stmt->execute();		
						$stmt->store_result();
						$stmt->bind_result($subtype_name, $subtype_cd, $type_name, $type_cd, $is_addable, $icon, $prefixes, $prefixes_help);
				}	
				//print ($mysqli->error);
				
				header('Content-Type: text/xml');
				print('<icons>' . "\n");
				while ($stmt->fetch()) {
					printf('<icon subtype_name="%s" subtype="%s" type_name="%s" type="%s" is_addable="%s" image="%s" prefixes="%s" prefixes_help="%s"/>', 
											$subtype_name, $subtype_cd, $type_name, $type_cd, $is_addable, $icon, $prefixes, $prefixes_help);
					print("\n");
				}
				print('</icons>' . "\n");
	
				
				$stmt->close();
		}
		$mysqli->close();

?>
