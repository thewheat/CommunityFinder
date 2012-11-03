<?php	
	include('./bootstrap.php');

	$_SESSION['user'] = null;
		
	print('<response>' . "\n");
	print('  <response_state success="true" message="user logged out" />' . "\n");
	print('</response>' . "\n");

?>
