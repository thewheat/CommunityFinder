<?php
require_once('./data/bootstrap.php');require_once('./data/functions.php'); ?><!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>  
  
		<?php	 
			printMetaData();
			
			$theme = 'default';
			print('<link type="text/css" href="css/themes/' . $theme . '/jquery-ui-1.7.custom.css" rel="Stylesheet" />');		
		?>
					
		<link href="css/base.css" rel="stylesheet" type="text/css">
		<link href="css/jquery.clearableTextField.css" rel="stylesheet" type="text/css">
		
		<script type="text/javascript" src="javascript/jquery.js"></script>
		<script type="text/javascript" src="javascript/jquery.jfeed.js"></script>
		<script type="text/javascript" src="javascript/ticker-0.1.js"></script>
		<script type="text/javascript" src="javascript/jquery.qtip-1.0.0-rc3.min.js"></script>
		<script type="text/javascript" src="javascript/jquery-ui-1.7.2.custom.js"></script>
		<script type='text/javascript' src="javascript/ui.autocomplete.js"></script> 
		<script type='text/javascript' src="javascript/jquery.clearableTextField.js"></script> 

		<?php	
			print('<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;key=' . $SITE['GOOGLE_KEY'] . '" type="text/javascript"></script>' . "\n");
		?>

		<script src="./javascript/ClusterMarker.js" type="text/javascript"></script>
		<script src="./javascript/app.js" type="text/javascript"></script>
		<script type="text/javascript">

		$(document).ready(function () {
				load();
				runtime_init();		
		});

		
		
		runtime_init = function() {	
			<?php	
			
					$lat = ($_GET['lat']) ? $_GET['lat'] : -36.64197781470593;
					$lng = ($_GET['lng']) ? $_GET['lng'] : 144.656982421875;
					$zoom = ($_GET['zoom']) ? $_GET['zoom'] : 7;
					$lid = ($_GET['lid']) ? $_GET['lid'] : null;
					$subtype = ($_GET['subtype']) ? $_GET['subtype'] : null;
					$username = ($_GET['username']) ? $_GET['username'] : null;
					$r_username = ($_GET['r_username']) ? $_GET['r_username'] : null;
					$r_subtype = ($_GET['r_subtype']) ? $_GET['r_subtype'] : null;
					$action = ($_GET['action']) ? $_GET['action'] : null;
					$rego_email = ($_GET['rego_email']) ? $_GET['rego_email'] : null;
					$rego_code = ($_GET['rego_code']) ? $_GET['rego_code'] : null;
					if($intro = $_GET['intro']) {
						if($intro_text = $_GET['intro_text']) {} else {$intro_text = null;}
					} else {$intro = null;}
					
					// init the map
					print("map.setCenter(new GLatLng(parseFloat($lat),parseFloat($lng)), $zoom );\n\t\t\t");

					// init restrictions
					if($r_username) {
						print("application.resourceManager.restrict_username = '" . $r_username . "';\n\t\t\t");
					}
					if($r_subtype) {
						print("application.resourceManager.restrict_subtype = '" . $r_subtype . "';\n\t\t\t");
						$subtype = $r_subtype;
					}		
					
					// init and run init filter
					// IMPORTANT: order must be load markers >> run search >> open given marker					
					if($lid && $subtype) {
						print("application.panelManager.closeAllPanels();\n\t\t\t");
						print("application.resourceManager.addMarkerTypes(function() { application.resourceManager.widgetRunSearch({subtypes : '" . $subtype . "', usernames: '" . $username . "', callback: function() { application.resourceManager.openMarker(" . $lid . "); }}); });\n\t\t\t");
					}
					else if($lid) {
						print("application.panelManager.closeAllPanels();\n\t\t\t");
						print("application.resourceManager.addMarkerTypes(function() { application.resourceManager.openMarker($lid); });\n\t\t\t");
					}
					else if($subtype) {
						print("application.panelManager.closeAllPanels();\n\t\t\t");
						print("application.resourceManager.addMarkerTypes(function() { application.resourceManager.widgetRunSearch({subtypes : '" . $subtype . "', usernames: '" . $username . "'}); });\n\t\t\t");
					}
					else {
						print("application.resourceManager.addMarkerTypes();\n\t\t\t");
					}

					// init rego links
					if($action == 'rego_confirm' && $rego_email && $rego_code) {
							print('$("#sign_up_email").attr("value", "' . $rego_email . '");' . "\n\t\t\t");
							print('$("#sign_up_rego_code").attr("value", "' . $rego_code . '");' . "\n\t\t\t");
							print('$(".register_step_2").css("display", "table-row");');	
							print('$(".register_step_1").css("display","none");');
							print('$("#sign_up_confirm_button").click();' . "\n\t\t\t");
					}
					if($action == 'invite_confirm' && $rego_email && $rego_code) {
							print('$("#sign_up_email").attr("value", "' . $rego_email . '");' . "\n\t\t\t");
							print('$("#sign_up_rego_code").attr("value", "' . $rego_code . '");' . "\n\t\t\t");
							print('$(".register_step_2").css("display", "none");');	
							print('$(".register_step_1").css("display","none");');
							print('$(".invite_step_1").css("display","table-row");');
					}
					/*if($intro) {	
							if($intro_text) {
									print("document.getElementById('alertPanelIntroText').innerHTML = '" . $intro_text . "';");	
							}
							print("document.getElementById('alertPanel').style.display='block';");	
					}*/
			?>
		}
		</script>

			

	  
	  </head>
	  <!--EYE GUnload just throw error, maybe timing issue or something?? -->
  <body onload="" onunload="GUnload()">

  <div id="modal_layer"></div>
  <div id="header"> 	
	<div id="header_center">

		<div id="header-tool-bar" class="fg-toolbar ui-widget-header ui-corner-all ui-helper-clearfix">
			<div class="fg-buttonset fg-buttonset-single ui-helper-clearfix">		
				<a id="homeButton" href="#" class="header-button fg-button ui-state-default fg-button-icon-solo ui-corner-left" title="Home"><span class="ui-icon ui-icon-home"></span> Home</a>
				<a id="mapButton" href="#" class="header-button fg-button ui-state-default" title="Community Map: see whats happening in Your Community">Community Map</a>
				<!--<a id="calendarButton" href="#" class="fg-button ui-state-default" title="Community Calendar">Community Calendar</a>-->
				<a id="inboxButton" href="#" class="header-button fg-button ui-state-default" title="Inbox: Manage You Messages, Listings and Groups">Inbox</a>
				<a id="docsButton" href="#" class="header-button fg-button ui-state-default ui-corner-right" title="More Information and Help">More Information</a>
			</div>
			<div id="header_login_small">	
				<div class="show_logged_in fg-buttonset fg-buttonset-single ui-helper-clearfix">		
					<a id="logOutButton1" href="#" class="fg-button ui-state-default ui-corner-left" title="Logout">Logout <span id="your_name1"></span></a>
					<a id="" href="#" class="fg-button ui-state-default ui-corner-right" title="Settings">Settings</a>
				</div>
				<span class="show_logged_out">
						<a id="loginButton" href="#" class="loginButton fg-button ui-state-default ui-corner-all" title="Inbox">Login</a>
				</span>
			</div>
			<div id="header_login_large"  style="margin: 0px; display:none;">
				<div class="show_logged_in fg-buttonset fg-buttonset-single ui-helper-clearfix">		
					<a id="logOutButton2" href="#" class="fg-button ui-state-default ui-corner-left" title="Logout">Logout <span id="your_name2"></span></a>
					<a id="settingsButton" href="#" class="fg-button ui-state-default ui-corner-right" onclick="application.panelManager.openProfileWindow(application.user.username);return(false);" title="Profile">Profile</a>
				</div>
				<div class="show_logged_out" >
					<form class="fg-buttonset fg-buttonset-single ui-helper-clearfix" onsubmit="return(false);">
						<input id="header_login_email" name="email" class="ui-corner-all ui-state-default fg-input" style="width: 140px;"/>
						<input id="header_login_password" name="password" type="password" style="width: 70px;" class="ui-corner-all ui-state-default fg-input" />
						<button type="button" onclick="application.panelManager.login(this.form);return(false);" class="fg-button ui-state-default ui-corner-all" style="margin:0 0 0 4px;">Login</button>				
					</form>
				</div>
			</div>
		
		</div>

	</div>
</div>		

		<div id="panel_background">
		</div>
		<div id="panel">
		<div id="panel_center">
			<div id="panel_home" class="content_pane" style="overflow: auto; padding-top: 1em;">
				
				<div style="float: right; clear: both; width: 250px; margin: 0.4em 0 0.4em 0.6em; padding: 0.4em 0.4em 0.4em 0.8em" class="ui-corner-all ui-widget-content"><b>Become a Contributor:</b><br>Join the network to contribute information about your community... <br/> <button type="button" class="loginButton fg-button ui-corner-all ui-state-default" style="float: right; margin: 0.6em">Sign Up</button></div>

				<div style="float: right; clear: both; width: 250px; margin: 0.4em 0 0.4em 0.6em; padding: 0.4em 0.4em 0.4em 0.8em" class="ui-corner-all ui-widget-content"><b>Watch the Video</b><br/>To learn how the site works...
				<a target="_blank" href="http://www.youtube.com/watch?v=mqhUG63pwAE"><img style="margin: 5px 18px;" src="images/youtube.png" title="watch on youtube"/></a>
				</div>
				<p style="font-size: 1.2em;">VictoriaMyCommunity.org lets you add, find, connect with community resources, services and groups in the area around you. The network is a community built and run resource that supports more resilient, sustainable communities. <a href="javascript: application.panelManager.openDocsWindow();">Learn more...</a><br><br> </p> 	
				<div class="" style="padding: 0.4em; margin-right: 2em; width: 60%;" >
					See whats happening in your area:
					<form id="home goto"class="" onsubmit="application.panelManager.gotoAddress(this.address.value, application.resourceManager.widgetRunSearch);return(false);">
								<input type="text" class="gotoAddress fg-input ui-corner-all" style="width: 80%; margin-bottom: 0.2em;" name="address" value="" />
								<button type="button" class="fg-button ui-corner-all ui-state-default" onclick="application.panelManager.gotoAddress(this.form.address.value, application.resourceManager.widgetRunSearch);">Go</button><br/>
								<a href="#" onclick="application.panelManager.gotoAddress('brunswick, melbourne', application.resourceManager.widgetRunSearch);$('#accordion').accordion( 'activate' , 1); return(false);">See Brunswick, Melbourne for an example...</a>
					</form>
					
				</div>
				<div id="error_load_message" class="ui-widget" style>
							<div class="ui-state-error ui-corner-all" style="padding: 0pt 0.7em; margin-top: 20px;"> 
								<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"></span>
									Sorry, we're having dificulty loading the site on your browser.  This seems to be because you are using an older browser.  Updating your browser is easy, and means your computer will be more secure and run faster.  You can <a href="http://www.mozilla.com/en-US/firefox/firefox.html" target="_blank">Download the latest version of Firefox</a>, which is a great open, free, and community developed browser.  Or download the lastest <a href="http://www.google.com/chrome" target="_blank">Google Chrome</a> or <a href="http://www.microsoft.com/nz/windows/internet-explorer/default.aspx" target="_blank">Internet Explorer</a>.
								</p>
							</div>
				</div>

			</div>
			<div id="panel_login" class="content_pane">
				<div class="ui-corner-all ui-widget-content" style="float: left; width: 260px; margin: 5% 5% 5% 0; ">
					<form style="font-size: 10px;" class="fg-form" onsubmit="return(false);">
						<table width="100%">
							<tr class="register_step_1"><td style="width:80px; text-align:right"><h3>Login</h3	></td><td style="width: 180px;">&nbsp;</td></tr>
							<tr><td style="width:70px; text-align:right">Email</td><td><input name="email" class="ui-corner-all  fg-input"/></td></tr>
							<tr><td style="width:70px; text-align:right">Password</td><td><input name="password" type="password" class="ui-corner-all  fg-input"/></td></tr>					
							<tr><td></td><td><input type="button" value="Log In" onclick="application.panelManager.login(this.form)" class="fg-button ui-state-default ui-corner-all">
							<tr><td colspan="2"><span id="login_response"></span></td></tr>
						</table>						
					</form>
				</div>
				<div class="ui-corner-all ui-widget-content" style="float: right; width: 260px; margin: 5% 0 5% 5%;  ">
					<form id="sign_up_form" class="fg-form" onsubmit="return(false);">
					<table>
						<tr class="register_step_1"><td style="width:80px; text-align:right"><h3>Sign Up</h3	></td><td style="width: 180px;">&nbsp;</td></tr>
						<tr class="register_step_2_hidden" style="display:none"><td colspan="2">Now check your email for instrunctions to complete sign up.</td></tr>
						<tr class="invite_step_1" style="display:none"><td colspan="2">To complete signup, please provide the following:</td></tr>
						<tr class="register_step_1"><td style="text-align:right">Email</td><td style=""><input id="sign_up_email" name="email" class="ui-corner-all  fg-input" style="width:150px;"/></td></tr>
						<tr class="register_step_1"><td style="text-align:right">Password</td><td style=""><input id="sign_up_password"name="password" type="password" class="ui-corner-all  fg-input" style="width:150px;"/></td></tr>
						<tr class="register_step_1"><td style="text-align:right">Full Name</td><td style=""><input id="sign_up_full_name"name="full_name" class="ui-corner-all  fg-input" style="width:150px;"/></td></tr>
						<tr class="register_step_1"><td style=" text-align:right">Username</td><td style=""><input id="sign_up_username" name="username" class="ui-corner-all  fg-input" style="width:150px;"/></td></tr>
						<tr class="register_step_2_hidden" style="display:none"><td style="text-align:right">Confirmation Code</td><td style=""><input id="sign_up_rego_code" name="rego_code" type="text" class="ui-corner-all  fg-input" style="width:70px;"/></td></tr>
						<tr class="invite_step_1" style="display:none"><td style="text-align:right">Password</td><td style=""><input name="password_invite" style="width: 150px;" type="password" class="ui-corner-all  fg-input" style="width:150px;"/></td></tr>
						<tr class="invite_step_1" style="display:none"><td style=" text-align:right">Full Name</td><td style=""><input name="full_name_invite" class="ui-corner-all  fg-input" style="width:150px;"/></td></tr>
						<tr class="invite_step_1" style="display:none"><td style=" text-align:right">Username</td><td style=""><input name="username_invite" class="ui-corner-all  fg-input" style="width:150px;"/></td></tr>
						<tr class="register_step_1" ><td></td><td><button type="button" onclick="application.panelManager.register(this.form)" class="fg-button ui-state-default ui-corner-all">Sign Up</button></td></tr>
						<tr class="register_step_2_hidden" style="display:none"><td></td><td><button id="sign_up_confirm_button" type="button" onclick="application.panelManager.registerConfirm(this.form)" class="fg-button ui-state-default ui-corner-all">Confirm Sign Up</button>
						<tr class="invite_step_1" style="display:none"><td></td><td><button id="inivte_confirm_button" type="button" onclick="application.panelManager.inviteConfirm(this.form)" class="fg-button ui-state-default ui-corner-all">Confirm Invite</button>
						<tr><td colspan="2" style="text-align:center;"><span id="register_response"></span></td></tr>
						<tr><td colspan="2">&nbsp;</td></tr>
					</table>						
					</form>
				</div>
			</div>
			
			<div id="panel_calendar" class="content_pane" style="text-align: center;">
				<div id="calendar" style="margin: 1em; auto;text-align: left;">

				</div>
			</div>

			<div id="panel_inbox" class="content_pane">
				<div id="inbox_tabs" style="margin-bottom: 2em;">	
					<ul>
						<li><a href="#tabs-messages" onclick="application.user.refreshInboxConversations();">Inbox</a></li>
						<li><a href="#tabs-listings" onclick="application.user.refreshInboxMarkers(); ">Your Listings</a></li>
					</ul>
					<div id="tabs-messages">
						<div class="show_logged_in">
						<div id="message-inbox">
							<form name="conversations_form">
							<div class="inbox-control" style="border-bottom: 1px solid black; height: 2.8em; font-size: 0.8em;">
								<div  style="float: right;" class="fg-buttonset">
									<span><button type="button" onclick="application.user.conversationDelete(this.form);" class="fg-button fg-button-icon-left ui-state-default ui-corner-all" style="padding-left: 2.1em;" title="Delete Messages"><span class="ui-icon ui-icon-circle-close"></span>Delete Messages</button></span>
								</div>
							</div>
							<div id="inbox_conversations">
							</div>
							</form>
						</div>
						<div id="message-edit">
							<div class="inbox-control" style="border-bottom: 1px solid black; height: 2.8em; font-size: 0.8em;">
								<div  style="float: left;" class="fg-buttonset">
									<span><a href="#" onclick="application.user.refreshInboxConversations(); return(false);" class="fg-button fg-button-icon-left ui-state-default ui-corner-all" style="padding-left: 2.1em;" title="Inbox"><span class="ui-icon ui-icon-circle-triangle-w"></span>Inbox</a></span>
								</div>
							</div>
							<div id="inbox_conversation">
							</div>
						</div>
						</div>
						
												
						<span class="show_logged_out">
						<div class="ui-widget">
							<div class="ui-state-error ui-corner-all" style="padding: 0pt 0.7em; margin-top: 20px;"> 
								<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"></span>
									Sorry, you need to <a href="#" onclick="application.panelManager.openLoginWindow(); return(false);">Login</a> or <a href="#" onclick="application.panelManager.openHomeWindow(); return(false);">Sign Up</a> to send and receive messages with other members!
								</p>
							</div>
						</div>
						</span>
						
					</div>
					<div id="tabs-listings">
						<div class="inbox-control show_logged_in" style="border-bottom: 1px solid black; height: 2.8em; font-size: 0.8em;">
							<div  style="float: right;" class="fg-buttonset fg-buttonset-multi">
								<a href="#" onclick="return(false);" class="fg-button fg-button-icon-left ui-state-default ui-corner-all" style="padding-left: 2.1em;" title="Inbox"><span class="ui-icon ui-icon-circle-triangle-w"></span>Filter</a>
							</div>
						</div>
						<div id="inbox_markers" class="show_logged_in">
						</div>
						<span class="show_logged_out">
						<div class="ui-widget">
							<div class="ui-state-error ui-corner-all" style="padding: 0pt 0.7em; margin-top: 20px;"> 
								<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"></span>
									Sorry, you need to <a href="#" onclick="application.panelManager.openLoginWindow(); return(false);">Login</a> or <a href="#" onclick="application.panelManager.openHomeWindow(); return(false);">Sign Up</a> to add and manage listings in the network!
								</p>
							</div>
						</div>
						</span>
					</div>
				</div>
			</div>
			<div id="panel_docs" class="content_pane">
				<div id="tabs_doco">
					<ul>
						 <li><a href="docs/index.html"><span>Welcome</span></a></li>
						 <li><a href="docs/help.html"><span>Instructions / Help</span></a></li>
						 <li><a href="docs/planned_features.html"><span>Future Development</span></a></li>
						 <li><a href="docs/about_us.html"><span>Contact / About Us</span></a></li>
					</ul>
				</div>
			</div>
			<div id="panel_profile" class="content_pane">
			<h3>User: <span id="pp_username"></span></h3>
			<p id="pp_full_name"></p>
			<p id="pp_www"></p>
			<p id="pp_blurb"></p>
			<h3>Listings</h3>
			<p id="pp_listings"></p>
			</div>
		</div>
		</div>
		<div id="map_filter">
			<div id="map_filter_center" class="ui-corner-all content_area" >	
				<div id="map_filter_search"  >
					<form id="search_form" class="fg-form" onsubmit="application.resourceManager.widgetRunSearch({forceLoad: 1, openExact: 1});return(false);">																										
						<div id="search_message" style="padding: 0.6em; position: relative;">
								Search: <input type="text" style="width:280px;" class="fg-input ui-corner-all" id="search_text" name="search_text" value="" />
								<button style="" type="button" id="search_widget_button" class="fg-button ui-corner-all ui-state-default" onclick="application.resourceManager.widgetRunSearch({forceLoad: 1, openExact: 1});">Go</button>
								(<a id="advanced_button" href="#" onclick="application.panelManager.showAdvanced();return(false);">advanced</a>)
								<span id="search_indicator" style="display: none;"> &nbsp; searching...</span>
								<button id="show_results_button" style="margin-left: 0.4em; float: right;" type="button" id="search_widget_button" class="fg-button ui-corner-all ui-state-default" onclick="application.panelManager.showResults();"><b>Show Results</b></button>     
								<span id="searchPanelResultsFound" style="float: right;margin:0.2em;"></span>
							</div> 
						<div id="search_subtype_checkboxes" style="display: none; overflow: auto; padding: 0.6em;">
							<br/>
							<div id="search_only_user" style="width: 50%; float: right;">
								Show only Listings added by user<hr/>
								<input id="search_only_user_input" style="width: 200px;"/><br/>
								Only listings added by this user will be displayed.
							</div>
							Show only Specific Categories:<hr/>
							<input id="search_check_all" type="checkbox" value="ALL" checked="checked" />All Listings &nbsp; <br/>
						</div>							
						<div id="searchPanelResults" style="height:300px; width: 100%; overflow:auto; display:none;">
							<div id="searchPanelResultsListings">
							</div>
							<div id="error_load_message" class="ui-widget" style>
							<div class="ui-state-error ui-corner-all" style="padding: 0pt 0.7em; margin: 20px;"> 
								<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"></span>
										The links below provide feeds of all listings matching your current search within the current area.</p>
								<p>
									<a id="listings_feed_xml" target="_blank" href=""><img src="images/link_xml.jpg" /></a> &nbsp; &nbsp;
									<a id="listings_feed_kml" target="_blank" href=""><img src="images/link_kml.jpg" /></a> &nbsp;
									<a id="listings_feed_csv" target="_blank" href=""><img src="images/link_csv.jpg" /></a> &nbsp;
								</p>
								<p><b>Note:</b> If new listings are added that match your current search, they will also appear in these feeds.</p>
							</div>
							</div>
						</div>
						<div id="searchPanelNoResults" style="height:30px; display:none;">
						</div>
					</form>		
				</div>
			</div>
		</div>
		<div id="map_zoom_div" class="ui-corner-all">
					<a id="" href="#" class="map-button fg-button ui-state-default fg-button-icon-solo ui-corner-top" style="margin: 0px;" title="Zoom In" onclick="map.zoomIn(); application.resourceManager.endMapDrag(); return false;"><span class="ui-icon ui-icon-zoomin"></span>Zoom In</a>
					<a id="" href="#" class="map-button fg-button ui-state-default fg-button-icon-solo ui-corner-bottom" style="margin: 0px;" title="Zoom Out" onclick="map.zoomOut(); application.resourceManager.endMapDrag(); return false;"><span class="ui-icon ui-icon-zoomout"></span>Zoom Out</a>
		</div>
		<div id="map_add_div" class="ui-corner-all">
					<a id="" href="#" class="map-button fg-button ui-state-default fg-button-icon-solo ui-corner-all" style="margin: 0px;" title="Add Listing" onclick="application.resourceManager.widgetRunSearch({text: '', subtypes: ''});$('#map_dialog_add').dialog('open');return(false);"><span class="ui-icon ui-icon-plusthick"></span>Add Listing</a>
		</div>
		<div id="map_tools_div" class="ui-corner-all">
					<a id="" href="#" class="map-button fg-button ui-state-default fg-button-icon-solo ui-corner-top" style="margin: 0px;" title="Website Plugin: Customise the network for your Website" onclick="$('#map_dialog_plugin').dialog('open');return(false);"><span class="ui-icon ui-icon-image"></span>Website Plugin</a>
					<a id="" href="#" class="map-button fg-button ui-state-default fg-button-icon-solo ui-corner-bottom" style="margin: 0px;" title="Find and contact your local members of parliament" onclick="$('#map_dialog_yvih').dialog('open');return(false);"><span class="ui-icon ui-icon-check"></span>Your Voice In House</a>
		</div>
		<div id="map_div">
		</div>
		
		<!-- dialog divs-->
		<div id="map_dialog_location" style="padding: 0.4em 0.8em;" onclick="$('#map_dialog_location').dialog();">
			Enter your location
			<form class="fg-form" onsubmit="application.panelManager.gotoAddress(this.address.value, application.resourceManager.widgetRunSearch);return(false);">
				<input id="goto1Box" type="text" class="fg-input ui-corner-all" style="width: 75%; margin-top:1em;" name="address" value="" />
				<button id="goto1Button" type="button" class="fg-button ui-corner-all ui-state-default" onclick="application.panelManager.gotoAddress(this.form.address.value, application.resourceManager.widgetRunSearch);">Go</button>
			</form>
			<p class="listing_sub">for example: <a href="#" onclick="application.panelManager.gotoAddress('brunswick, melbourne', application.panelManager.widgetRunSearch);return(false);"> 'brunswick, melbourne'</a></p>
		</div>
		<div id="map_dialog_add" style="padding: 0.4em 0.8em;">
			To add a listing, choose a location by clicking on the map or by entering an address in the field below:<br>  
			<form id="search_form" class="fg-form" onsubmit="application.panelManager.gotoAddress(this.address.value, application.panelManager.clickMap);return(false);" >
				<input type="text" style="width: 75%; margin-top: 1em; margin-bottom: 1em;" class="fg-input ui-corner-all" name="address" value="" />
				<button type="button" id="search_widget_button" class="fg-button ui-corner-all ui-state-default" onClick="application.panelManager.gotoAddress(this.form.address.value, application.panelManager.clickMap); ">Go</button>	
			</form>		
			
			
			<a href="javascript:application.panelManager.openDocsWindow('/docs/listings.html')">Learn more</a> about listings.<br />&nbsp;
			
		</div>					
		<div id="map_dialog_yvih" style="padding: 0.4em 0.8em;">
			To Find and Contact your elected state and federal representatives, click on your location on the map.
		</div>					
		<div id="map_dialog_plugin"style="padding: 0.4em 0.8em;">
			Cut and paste the following code to embed the map into your website.  Use the options below to customise the plugin:
			<input id="wpf_code" type="text" class="fg-input ui-corner-all" style="margin-top: 1em; margin-bottom: 1em; width:95%;" value="<iframe src=&quot;http://www.victoriamycommunity.org/index.php?zoom=' + map.getZoom() + '&lat=' + lat_lng.lat() + '&lng=' + lat_lng.lng() + '&nb=' + nb+ '&eb=' + eb + '&sb=' + sb + '&wb=' + wb + '&lid=' + this.resource_id + '&subtype=' +'&subtype=' + subtype + '&quot; style=&quot;width: ' + width + 'px; height:' + height + 'px; border:none;&quot;></iframe>"  />
			Customise: (<a id="wpf_link" href="http://theveggiebox.org/plugin_preview.php?" target="_blank">preview</a>)
			<form id="widget_plugin_form" class="fg-form" >
					<select id="wpf_start_screen" name="start_screen" onchange="application.panelManager.widgetPluginCustomize();" class="fg-input ui-corner-all"  style="width: 100%; margin-bottom:2px;margin-top:5px;">
							<option value="">Select Start Screen</option>
							<option value="map_all">Map with All Listings</option>
							<option value="map_filter">Map initiliased with current Search</option>	
							<option value="map_restrict">Map restricted to current Search</option>	
					</select><br />
					<select id="wpf_size" onchange="application.panelManager.widgetPluginCustomize();" name="size" class="fg-input ui-corner-all" style="width: 100%; margin-bottom:2px;">
							<option value="">Select Plugin Size</option>
							<option value="s">Small (600 x 400)</option>
							<option value="m">Medium (800 x 600)</option>
							<option value="l">Large (1000 x 800)</option>	
					</select><br />	
			</form>	
    	
		</div>	
		<div id="map_dialog_data" style="padding: 0.4em 0.8em;">
			</div>					

    <noscript><b>JavaScript must be enabled in order for you to use VictoriaMyCommunity.org.</b> 
      However, it seems JavaScript is either disabled or not supported by your browser. 
      To view VictoriaMyCommunity.org, enable JavaScript by changing your browser options, and then 
      try again.
    </noscript>


  </body>

</html>





