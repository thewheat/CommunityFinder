<?php	

/**
 * Formats portion of the WHERE clause for a SQL statement.
 * SELECTs points within the $distance radius
 *
 * @param float $lat Decimal latitude
 * @param float $lng Decimal longitude
 * @param float $distance Distance in kilometers
 * @return string
 */
function printMetaData() {
	if($_GET['lid']) {
		global $SITE;
		
		$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
		if (!mysqli_connect_errno()) {
			if($stmt = $mysqli->prepare("SELECT title, description, icon
														FROM marker, subtype 
														WHERE marker.marker_id = ? 
														AND marker.subtype_id = subtype.subtype_id LIMIT 1 ")) {
	
				$stmt->bind_param("s", $_GET['lid']);
				$stmt->execute();
				$stmt->bind_result($title, $description, $icon);

				if($stmt->fetch()) {
					print('<title>' . $title . '</title>' . "\n");
					print('<meta name="title" content="' . $title . '" />' . "\n");
					print('<meta name="description" content="' . $description . '" />' . "\n");
					print('<link rel="image_src" type="image/png" href="http://' . $SITE['DOMAIN'] . '/' . $icon . '" />' . "\n");
				}
			}
		}

		
	}
	else {
		print('<title>' . $SITE['DOMAIN']. '</title>' . "\n");
		print('<meta name="title" content="' . $SITE['DOMAIN'] . '" />' . "\n");
		print('<meta name="description" content="' . $SITE['DOMAIN'] . ' lets you add, find and connect with community resources, services and groups in the area around you." />' . "\n");
		print('<link rel="image_src" href="http://www.onjd.com/design05/images/PH2/WableAFC205.jpg" />' . "\n");
	}
	
	
	
}


/**
 * Formats portion of the WHERE clause for a SQL statement.
 * SELECTs points within the $distance radius
 *
 * @param float $lat Decimal latitude
 * @param float $lng Decimal longitude
 * @param float $distance Distance in kilometers
 * @return string
 */
function mysqlHaversine($lat = 0, $lng = 0, $distance = 0)
{
  if ($distance > 0)
  {
    return ('
      ((6372.797 * (2 *
        ATAN2(
          SQRT(
            SIN(('.($lat*1).' * (PI()/180)-lat*(PI()/180))/2) *
            SIN(('.($lat*1).' * (PI()/180)-lat*(PI()/180))/2) +
            COS(lat * (PI()/180)) *
            COS('.($lat*1).' * (PI()/180)) *
            SIN(('.($lng*1).' * (PI()/180)-lng*(PI()/180))/2) *
            SIN(('.($lng*1).' * (PI()/180)-lng*(PI()/180))/2)
          ),
          SQRT(1-(
            SIN(('.($lat*1).' * (PI()/180)-lat*(PI()/180))/2) *
            SIN(('.($lat*1).' * (PI()/180)-lat*(PI()/180))/2) +
            COS(lat * (PI()/180)) *
            COS('.($lat*1).' * (PI()/180)) *
            SIN(('.($lng*1).' * (PI()/180)-lng*(PI()/180))/2) *
            SIN(('.($lng*1).' * (PI()/180)-lng*(PI()/180))/2)
          ))
        )
      )) <= '.($distance*1). ')');
  }//if

  return '';
}//func


function printSharehood($north_lat, $south_lat, $east_lng, $west_lng, $mysqli) {	
	
	//print($south_lat . ' ' . $north_lat . ' ' . $west_lng . ' ' . $east_lng);
	
	if (!mysqli_connect_errno()) {
		// get current tags from DB
		
		$query = "	SELECT sharehood_id, lat, lng, suburb 
															FROM sharehood 
															WHERE sharehood.lat BETWEEN ? AND ? ";
		if($west_lng < $east_lng) {
						$query .= "		AND sharehood.lng BETWEEN ? AND ? ";
					}
					else {
						$query .= "		AND ((sharehood.lng BETWEEN ? AND 180) OR (sharehood.lng BETWEEN -180 AND ?))";	
					}													
		
		if($stmt_sharehood = $mysqli->prepare($query)) {
			$stmt_sharehood->bind_param("dddd", $south_lat, $north_lat, $west_lng, $east_lng);
			$stmt_sharehood->execute();
			$stmt_sharehood->bind_result($sharehood_id, $lat, $lng, $suburb);
			while($stmt_sharehood->fetch()) {
				print('<marker lat="' . $lat . '" lng="' . $lng . '" name="Member of the ' . $suburb . ' Sharehood" description="The Sharehood is all about sharing resources within your neighbourhood and helps you to meet and make friends with people in your local area, visit the site to find out more..." resource_id="999999' . $sharehood_id . '" username="sharehood" type="community" subtype="sharehood" www="http://www.thesharehood.org/" rss="" kml_on="0" datetime_on="0" start_datetime="" end_datetime="" tags="" is_invite="0" invite_email="" invite_url="" invite_text="" tagss="" />' );
			}
			$stmt_sharehood->close(); // close statement
		}	
	}
}


function updateTags($marker_id, $tags_update, $mysqli) {

	// get state of new and old tags
	
	// clean it up
	// maybe move to after stiping on comma??
	//$tags_update = preg_replace('/,,+/', ',', $tags_update);
	//$tags_update = preg_replace('/(^,|,$)/', '', $tags_update);
	//$tags_update = preg_replace('/(,.*?:,)/', ',', $tags_update);

	$tags_update = explode(',', $tags_update);
	$tags_update = array_unique($tags_update); // remove duplicates as hard to pick up when looping later
	$tags_current = array();
	
	if (!mysqli_connect_errno()) {
		// get current tags from DB
		if($stmt_current_tags = $mysqli->prepare("	SELECT tag, prefix, marker_to_tag_id 
															FROM tag, marker_to_tag 
															WHERE tag.tag_id = marker_to_tag.tag_id 
															AND marker_to_tag.marker_id = ?")) {
			$stmt_current_tags->bind_param("i", $marker_id );
			$stmt_current_tags->execute();
			$stmt_current_tags->bind_result($tag, $prefix, $marker_to_tag_id);
			while($stmt_current_tags->fetch()) {
				$tags_current[$marker_to_tag_id] = ($prefix && $prefix != ' ') ? $prefix . ':' . $tag : $tag;
			}
			$stmt_current_tags->close(); // close statement
		}	
	}

	// Remove tags - remove mapping for current tags not in update list
	if($stmt_delete_tags = $mysqli->prepare("	DELETE FROM marker_to_tag 
																				WHERE marker_to_tag_id = ? LIMIT 1")) {
		foreach($tags_current as $mtt_id => $current_tag) {
			if(!in_array($current_tag, $tags_update)) {
				$stmt_delete_tags->bind_param("i", $mtt_id);
				$stmt_delete_tags->execute();
			}		
		}
		$stmt_delete_tags->close(); // close statement
	}
	
	
	// Add tags - add mapping [and tag] for update tags not in current list
	if(($stmt_tag_exists = $mysqli->prepare("SELECT tag_id FROM tag WHERE tag.tag = ? AND tag.prefix = ? LIMIT 1"))
		&& ($stmt_add_tag = $mysqli->prepare("INSERT INTO tag (tag, prefix) VALUES (?, ?)")) 
		&& ($stmt_add_marker_to_tag = $mysqli->prepare("INSERT INTO marker_to_tag (marker_id, tag_id) VALUES (?, ?)")) ) {
		foreach($tags_update as $update_tag) {
			if(!in_array($update_tag, $tags_current)) {	
				//foreach update tag not in current list...		
				if(preg_match('/:/', $update_tag)) {
					$array = explode(':', $update_tag);
					$tag = trim($array[1]);
					$prefix = trim($array[0]);
				}
				else { $tag = $update_tag; $prefix = ''; 
				}
				// Clean tag and prefix
				// only add if tag portion not empty
				$tag = strtolower($tag);
				$prefix = strtolower($prefix);
				if(($tag != '') && ($tag != ' ')) {
					$stmt_tag_exists->reset();
					$stmt_tag_exists->bind_param("ss", $tag, $prefix);
					$stmt_tag_exists->execute();
					$stmt_tag_exists->bind_result($tag_id);
					$stmt_tag_exists->store_result();//must fully collect data else kills next statement on connection, not just this statement
	
					// if tag exists, get its id
					if($stmt_tag_exists->fetch()) {
						$insert_tag_id = $tag_id;
					}				
					// else add tag, get its id
					else {
						$stmt_add_tag->reset();
						$stmt_add_tag->bind_param("ss", $tag, $prefix);
						$stmt_add_tag->execute();
						$insert_tag_id = $stmt_add_tag->insert_id;
					}
					// add mapping
					$stmt_add_marker_to_tag->reset();
					$stmt_add_marker_to_tag->bind_param("ii", $marker_id, $insert_tag_id);
					$stmt_add_marker_to_tag->execute();
				}
			}
		}
		$stmt_tag_exists->close();		
		$stmt_add_tag->close();		
		$stmt_add_marker_to_tag->close();
	}
}

?>
