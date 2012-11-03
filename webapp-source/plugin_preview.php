<html>
<head>
<body>

<?php	 
				
					$start_screen = ($_GET['st']) ? $_GET['st'] : 'm';
					$subtype = ($_GET['su']) ? $_GET['su'] : 'all';
					$username = ($_GET['username']) ? $_GET['username'] : '';
					$theme = 'default';
					$size = ($_GET['si']) ? $_GET['si'] : 'm';
					
					$lat = ($_GET['lat']) ? $_GET['lat'] : -37.7957;
					$lng = ($_GET['lng']) ? $_GET['lng'] : 144.961;
					$zoom = ($_GET['zoom']) ? $_GET['zoom'] : 3;
					$lid = ($_GET['lid']) ? $_GET['lid'] : null;

					
					if ($start_screen == 'map_filter') {
						$settings = '?theme=' . $theme . '&zoom=' . $zoom . '&lat=' . $lat . '&lng=' . $lng . '&subtype=' . $subtype . '&username=' . $username;
					}					
					else if ($start_screen == 'map_restrict') {
						$settings = '?theme=' . $theme . '&zoom=' . $zoom . '&lat=' . $lat . '&lng=' . $lng . '&r_subtype=' . $subtype . '&r_username=' . $username;
					}
					else {
						$settings = '?theme=' . $theme . '&zoom=' . $zoom . '&lat=' . $lat . '&lng=' . $lng . '&subtype=all';
					}
					
					if ($size == 'l') {
						$x = 1050;
						$y = 600;
					}
					else if ($size == 'm') {
						$x = 850;
						$y = 500;
					}
					else {
						$x = 650;
						$y = 400;
					}
					
					print('<iframe style="border: none; width:' . $x . 'px; height:' . $y . 'px;" src="./index.php' . $settings . '"></iframe>');
					
					?>


</body>
</html>
			
