<?php
include('./bootstrap.php');
include('./functions.php');

		$URL = 'http://dev.thesharehood.org/locations.txt';

		$mysqli = new mysqli($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW'], $SITE['DB_NAME']);
		if (!mysqli_connect_errno()) {
				// remove current listings **************************
				if($stmt = $mysqli->prepare('DELETE FROM sharehood')) {
						$stmt->execute();							
				}	
				$stmt->close();

				
				// add new listings **************************

				// get the page from url
				$sh_page = file($URL);
				$listings = array();
				
				foreach($sh_page as $line) {
					$lat = null;
					$lng = null;

					if(preg_match('/<lat>(.*)<\/lat>/', $line, $matches)) {
						$lat = $matches[1]; }
					
					if(preg_match('/<lng>(.*)<\/lng>/', $line, $matches)) {
						$lng = $matches[1]; }
					
					if($lat && $lng) {
						$listings[] = array('lat' => $lat, 'lng' => $lng); }
				}
				
				//$listings = array_unique($listings);
				
				// for each in array add new listing				
				if($stmt = $mysqli->prepare('INSERT INTO sharehood (lat, lng, suburb) VALUES (?, ?, ?)')) {
														
					foreach($listings as $listing) {
					
						$lat = $listing['lat'];
						$lng = $listing['lng'];
						$suburb = '';
						
						$stmt->bind_param('dds', $lat, $lng, $suburb);
						$stmt->execute();							
					}
					$stmt->close();
				}
		}
		$mysqli->close();
		
		print('all done, well I assume so, check www.theveggiebox.org to see the results...');

?>
