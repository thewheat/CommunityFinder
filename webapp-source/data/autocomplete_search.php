<?php	 	
include('./bootstrap.php');

$match_text = ($_GET['q']) ? $_GET['q'] : '';
//match_text may contain multiple tags, only match last tag, the tag after last comma
$temp = explode(',', $match_text);
$match_text = array_pop($temp); 
$match_text = '%' . $match_text . '%';

$prefix = ($_GET['prefix']) ? $_GET['prefix'] : null;
$prefix = preg_replace('/\+/', ' ', $prefix);

$nlat = ($_GET['nlat']) ? $_GET['nlat'] : null;
$elng = ($_GET['elng']) ? $_GET['elng'] : null;
$slat = ($_GET['slat']) ? $_GET['slat'] : null;
$wlng = ($_GET['wlng']) ? $_GET['wlng'] : null;

		header('Content-Type: text');
		
		$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
		if (!mysqli_connect_errno()) {

			
			// Add Category Matches to autocomplete
			$query =  " SELECT DISTINCT subtype_name FROM subtype 
								WHERE subtype.subtype_name LIKE ? 
								ORDER BY subtype_name ";
			
			if($stmt = $mysqli->prepare($query)) {
					$stmt->bind_param('s', $match_text);
					
					$stmt->execute();		
					$stmt->store_result();
					$stmt->bind_result($subtype);
			}	
			
			while ($stmt->fetch()) {
					print($subtype . ' <em style="">(category)</em>' . "\n");
			}
			$stmt->close();
		
			// Add Tag Matches to autocomplete
			$query =  " SELECT tag, prefix FROM tag 
								WHERE tag.tag LIKE ? 
								ORDER BY tag ";
			
			if($stmt = $mysqli->prepare($query)) {
					$stmt->bind_param('s', $match_text);
					
					$stmt->execute();		
					$stmt->store_result();
					$stmt->bind_result($tag, $prefix);
			}	
			while ($stmt->fetch()) {
				$tag = ($prefix) ? $prefix . ':' . $tag : $tag;
				print($tag  . ' <em style="">(tag)</em>' . "\n");
			}
			$stmt->close();
			
			
			// Add Title Matches to autocomplete	
			$query =  " SELECT title FROM marker 
								WHERE marker.title LIKE ?  ";
			if($wlng < $elng) {
				$query .= "		AND marker.lat BETWEEN ? AND ?
										AND marker.lng BETWEEN ? AND ? ";
			}
			else {
				$query .= "		AND marker.lat BETWEEN ? AND ?
										AND ((marker.lng BETWEEN ? AND 180) OR (marker.lng BETWEEN -180 AND ?))";	
			}			
			$query .= "			ORDER BY title ";
			
			if($stmt = $mysqli->prepare($query)) {
					$stmt->bind_param('sdddd', $match_text, $slat, $nlat, $wlng, $elng);
					
					$stmt->execute();		
					$stmt->store_result();
					$stmt->bind_result($title);
			}	
			while ($stmt->fetch()) {
				print($title  . ' <em style="">(listing)</em>' . "\n");
			}
			$stmt->close();
			
			
			
		}
		$mysqli->close();

?>
