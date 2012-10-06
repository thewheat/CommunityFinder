<?php	 
include('./bootstrap.php');


$wiki_page = ($_GET['q']) ? $_GET['q'] : '';

$fp = fsockopen("en.wikipedia.org", 80, $errno, $errstr, 30); 
if (!$fp) { 
	echo "$errstr ($errno)<br />\n"; 
} 
else { 
	$out = "GET /w/api.php?format=txt&action=opensearch&search=" . urlencode($wiki_page) . "&namespace=0&suggest HTTP/1.1\r\n";
	$out .= "user-agent: myBrowser 0.1\r\n";
	$out .= "Host: en.wikipedia.org:80\r\n"; 
	$out .= "Connection: Close\r\n\r\n"; 
	
	$response = '';
	
	fwrite($fp, $out); 
	while (!feof($fp)) { 
		$line = fgets($fp);
		// only get the line with returned wiki data
		if(preg_match('/^\[/', $line)) {
			$response .= $line; 
		}
	} 
	fclose($fp); 
}

$response = preg_replace('/\s/', '_', $response  ); // underscore spaces
$response = preg_replace('/.*\[.*\[/', '', $response  ); // clean up start of line
$response = preg_replace('/","/', "\n", $response  ); // clean up separators, change to return
$response = preg_replace('/\]\]/', '', $response  ); // clean up end of line
$response = preg_replace('/"/', '', $response  ); // clean up stray quotes
print($response);



?>
