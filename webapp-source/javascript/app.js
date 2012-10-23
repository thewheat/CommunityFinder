 
/////////////////////////////////////////////////////////////////////////////////////////////
// GMarker
///////////////////////////////////////////////////////////////////////////////


google.maps.Marker.prototype.openInformationWindow = function(openTab) {
	console.log("google.maps.Marker.prototype.openInformationWindow");
	var that = this;
	var lat_lng = this.getPosition();
	var openTabIndex = (openTab == 'edit') ? 3 : 0;
	
	var Bounds = map.getBounds();
	var NorthEast = Bounds.getNorthEast();
	var SouthWest = Bounds.getSouthWest();
	var nb = NorthEast.lat();
	var eb = NorthEast.lng();
	var sb = SouthWest.lat();
	var wb = SouthWest.lng();
	
	var text = '<div class="info_window">'; 
	text += '<b>' + this.name + ' (<a class="tag_link" href="#" title="Show all listings of category \'' + this.subtype_name + '\' in the current map area." onclick="application.resourceManager.widgetRunSearch({forceLoad:1, text:\'' + this.subtype_name + '\'});return false;">' + this.subtype_name + '</a>)</b><br><span style="color: grey;">Added by: <a href="#" onclick="application.panelManager.openProfileWindow(\'' + this.username + '\');return(false);">' + this.username + '</a></span>';
	text += '<p>' + this.desc + '</p>';

	if(this.phone) {
		text += '<p><b>Phone: </b>' + this.phone + '</p>';
	}
	if(this.address) {
		text += '<p><b>Address: </b>' + this.address + '</p>';
	}
	
	this.current_window = 'openInformationWindow';	
	
	if(this.datetime_on == 1) {
		text += '<b>Start : </b>' + this.start_datetime.getDate() + '-' + (this.start_datetime.getMonth() + 1) + '-' + this.start_datetime.getFullYear() + ' <br/>';
		text += '<b>End : </b>' + this.end_datetime.getDate() + '-' + (this.end_datetime.getMonth() + 1) + '-' + this.end_datetime.getFullYear() + ' <br/>';
	}
	
	text += '<br />';
	for (var prefix in this.tags) {
		text += '<b> ' + prefix.replace(/_/g, ' ') + ':</b> ';
		var tag_text = '';
		for(var i in this.tags[prefix]) {
			var link = '<a title="Show all listings tagged with \'' + this.tags[prefix][i] + '\' in the current map area" class="tag_link" href="#" onclick="application.resourceManager.widgetRunSearch({forceLoad: 1, openExact: 1, text:\'' + this.tags[prefix][i] + '\'});return(false);">' + this.tags[prefix][i] + '</a>';
			tag_text += (tag_text) ? ', ' + link : link; 
		}
		text += tag_text;
	}

	if(this.wiki != undefined && this.wiki != '') {									
		text += '<hr/>';
		text += '<b>Wikipedia: </b><a target="_blank" href="http://en.wikipedia.org/wiki/' + this.wiki + '">http://en.wikipedia.org/wiki/' + this.wiki + '</a><br/>';
	}
	
	if(this.www != undefined && this.www != '') {									
		if (this.rss != undefined && this.rss != '') {
				text += '<hr/>';
				text += '<b>Latest News from : </b><a id="listing_site_preview" " target="_blank" href="' + this.www + '">' + this.www + '</a>';
				text += '<div id="latest_news" style="height: 60px; overflow:hidden; text-align: center; padding-top:10px;">&nbsp;<br/><img src="images/wait_small.gif"/> &nbsp; <b>Loading...</b><br><br>&nbsp;<br/></div>';
				text += '<img style="margin-bottom: -4px;" src="images/rss.gif" />  <a target="_blank" href="' + this.rss + '" title="">Copy this link to save RSS Feed</a>';		
		}
		else {
				text += '<hr/>';									
				text += '<b>Web : </b><a id="listing_site_preview" target="_blank" href="' + this.www + '">' + this.www + '<a/><br>';
		}
	}
	else if(this.rss != undefined && this.rss != '') {
		text += '<b>Latest News : </b><br/>';
		text += '<div style="margin-left: 60px; margin-top: 0px">&nbsp;<br/><img src="images/wait_small.gif"/> &nbsp; <b>Loading...</b><br/></div>';
		text += '<img style="margin-bottom: -4px;" src="images/rss.gif" />  <a target="_blank" href="' + this.rss + '" title="">Copy this link to save RSS Feed</a>';		
	}							
	if(this.invite_email) {
			text += '<hr/><img style="margin-bottom: -4px;" src="images/listing_contact.jpg"/> <a href=""# onclick="application.user.refreshConversationNew(\'' + this.invite_email + '\', \'email\'); application.panelManager.openInboxWindow(); return(false);">Contact</a> ';
	}
	else if(this.invite_url) {
		text += '<hr/><img style="margin-bottom: -4px;" src="images/listing_contact.jpg"/> <a target="_blank" href="' + this.invite_url + '">Contact</a> ';
	}	
	else if(this.invite_text) {
			text += '<hr/><img style="margin-bottom: -4px;" src="images/listing_contact.jpg"/> <a href="#" onclick="application.user.refreshConversationNew(\'' + this.invite_text + '\', \'text\'); return(false);">Contact</a> ';
	}
	else {
			text += '<hr/><img style="margin-bottom: -4px;" src="images/listing_contact.jpg"/> <a href="#" onclick="application.user.refreshConversationNew(\'' + this.username + '\', \'username\'); return(false);">Contact</a> ';
	}
	text += '| <img style="margin-bottom: -4px;" src="images/twitter_share.png" /> <a target="_blank" href="http://twitter.com/home?status=Just found ' + this.name + '. http://victoriamycommunity.org/index.php?lid=' + this.lid + '">Tweet It</a> ';
	text += '| <img style="margin-bottom: -4px;" src="images/facebook_share.gif" /> <a target="_blank" href="http://www.facebook.com/sharer.php?u=http://victoriamycommunity.org/index.php?lid=' + this.lid + '">Share on Facebook</a> ';
	text += '<br/>';	
	text += '</div>';

	//var text_comments = '<div class="info_window">The comment tool is currenly being tested and will be available in our next release (late Aug 09).<br><br>Features<ul><li>Comment and discuss a listing with others</li><li>Rate It</li><li>Report it, if a listing is inappropriate.</li></ul></div>';

	var text_comments = '<div class="info_window" style="overflow: auto; height: 180px;">';
	text_comments += '<div id="listing_comments" style="overflow: auto; display: none;">';
	text_comments += '<div id="listing_comments_results"></div>';
	text_comments += '</div>';
	text_comments += '<div id="listing_comments_add" style="display: none;">';
	text_comments += '<form action="#" name="comment_form">';
	text_comments += '<textarea name="comment" style="width:400px; height:100px;"></textarea><br>';
	text_comments += '<div class="fg-buttonset fg-buttonset-multi fg-comment">';
	text_comments += '<input type="button" value="Add Comment" class="fg-button fg-button-icon-left ui-state-default ui-corner-all" onclick="application.resourceManager.current_marker.addCommentToDB(this.form);return(false);">';
	text_comments += '</div>';
	text_comments += '</form>';
	text_comments += '</div>';
	text_comments += '<div id="listing_comments_report" style="display: none;">';
	text_comments += '<form action="#" name="report_form">';
	text_comments += '<input type="radio" name="report_type" value="date"/>Content is out of Date <br/>';
	text_comments += '<input type="radio" name="report_type" value="inap"/>Content is inapropriate <br/>';
	text_comments += '<b>Reason: </b><input name="details" style="width: 200px;" /><br/>';
	text_comments += '<div class="fg-buttonset fg-buttonset-multi fg-comment">';
	text_comments += '<input type="button" value="Report" class="fg-button fg-button-icon-left ui-state-default ui-corner-all" onclick="application.resourceManager.current_marker.reportCommentToDB(this.form);return(false);">';
	text_comments += '</div>';
	text_comments += '</form>';
	text_comments += '</div>';
	text_comments += '<div id="comment_controls">';
	text_comments += '<form style="padding-top: 0.4em; border-top: 1px solid black; position: absolute; bottom: 0; left:0; width: 100%;">';
	text_comments += '<div class="fg-buttonset fg-buttonset-multi fg-comment">';
	text_comments += '<a onclick="$(\'#listing_comments\').hide();$(\'#comment_controls\').hide(); $(\'#listing_comments_add\').show(); return(false);" class="fg-button fg-button-icon-left ui-state-default ui-corner-all" style="padding-left: 2.1em; margin-left: 1em;" href="#" title="Add Comment"><span class="ui-icon ui-icon-circle-plus"></span>Add Comment</a> &nbsp;';
	text_comments += '<a onclick="$(\'#listing_comments\').hide();$(\'#comment_controls\').hide(); $(\'#listing_comments_report\').show(); return(false);" class="fg-button fg-button-icon-left ui-state-default ui-corner-all" style="padding-left: 2.1em; margin-left: 1em;" href="#" title="Report Inappropriate Content"><span class="ui-icon ui-icon-alert"></span>Report Content to Moderator</a>';
	text_comments += '</div>';
	text_comments += '</form></div>';
	text_comments += '</div>';
	
	var height = '400';
	var subtype = 'all';
	var width = '600';
	var infoBubble = new InfoBubble({
      maxWidth: width
    });

	var text_share = '<div class="info_window" style="height: 130px; overflow:hide;">'; 
	text_share += '<p><img style="margin-bottom: -4px;" src="images/twitter_share.png" /> <a target="_blank" href="http://twitter.com/home?status=Just found ' + this.name + '. http://victoriacommunity.org/index.php?lid=' + this.lid + '">Tweet about it on Twitter</a></p>';
	text_share += '<p><img style="margin-bottom: -4px;" src="images/facebook_share.gif" /> <a target="_blank" href="http://www.facebook.com/sharer.php?u=http://victoriamycommunity.org/index.php?lid=' + this.lid + '">Share it on Facebook</a></p>';
	text_share += '<p><img style="margin-bottom: -4px;" src="images/link_share.jpg" /> <a href="#" onclick="$(\'#link_code\').toggle(\'normal\');$(\'#embed_code\').hide(\'slow\'); return(false);">Email / Link to this Listing</a></p>';	
	text_share += '<p id="link_code" style="display:none;">Cut and Paste the following code to link to this linsting: <br/>';
	text_share += '<input type="text" style="width: 280px;" value="http://www.victoriamycommunity.org/index.php?zoom=' + map.getZoom() + '&lat=' + lat_lng.lat() + '&lng=' + lat_lng.lng() + '&lid=' + this.lid + '" /></p>';		 

	text_share += '<p><img style="margin-bottom: -4px;" src="images/embed_share.jpg" /> <a href="#" onclick="$(\'#embed_code\').toggle(\'normal\');$(\'#link_code\').hide(\'slow\'); return(false);">Embed this Listing / Map into your website</a></p>';	
	text_share += '<p id="embed_code" style="display:none;">Cut and Paste the following code to embed this linsting: <br/>';
	text_share += '<input type="text" style="width: 280px;" value="<iframe src=&quot;http://www.victoriamycommunity.org/index.php?zoom=' + map.getZoom() + '&lat=' + lat_lng.lat() + '&lng=' 
		+ lat_lng.lng() + '&lid=' + this.lid + '&quot; style=&quot;width: ' + width + 'px; height:' + height + 'px; border:none;&quot;></iframe>" /></p>';		 
	text_share += '</div>';
	
	if((application.user.isLoggedIn() && application.user.username == this.username) || this.username === 'anonymous') {
		var text_edit = '<form class="fg-form"><div class="info_window" style="overflow: auto; height: 180px;">'; 	
		text_edit += '';
		text_edit += '<table><tr><td><b>Category: </b></td><td><b>' + this.subtype + ' (' + this.type + ')</b></td></tr>';
		text_edit += '<tr><td><b>Title</b></td><td> <input name="name" value="' + this.name + '" style="width: 220px;" class="fg-input ui-corner-all"/><span title="The title that appears on the listing" style="float: right;" class="tag_link ui-icon ui-icon-info"></span></td></tr>';
		text_edit += '<tr><td><b>Description: </b></td><td> <textarea name="description" cols="35" rows="2" class="fg-input ui-corner-all" style="width: 220px;">' + this.desc + '</textarea><span title="The main description that appears on the listing" class="tag_link ui-icon ui-icon-info" style="float: right;"></span></td></tr>';
		text_edit += '<tr><td><b>Phone: </b></td><td> <input name="phone" value="' + this.phone + '" style="width: 220px;" class="fg-input ui-corner-all"/></td></tr>';
		text_edit += '<tr><td><b>Address: </b></td><td> <input name="address" value="' + this.address + '" style="width: 220px;" class="fg-input ui-corner-all"/></td></tr>';
		text_edit += '<tr><td colspan="2"><hr/></td></tr>';
		text_edit += '<tr><td colspan="2"><b>Tags</b><span title="Tags provide extra detail and help people find your listing.  Just start typing and popular terms that others have used will be suggested, use a comma to separate tags" class="tag_link ui-icon ui-icon-info" style="float: right;"></span></td></tr>';
		var gen_tags = ((this.tags != null) && this.tags['general']) ? this.tags['general'].join(',') : '';
		text_edit += '<tr><td><b>general:</b></td><td> <input name="tags_general" id="tags_general" value="' + gen_tags + '" class="fg-input ui-corner-all" style="width: 220px;"/></td></tr>';
		if (application.resourceManager.marker_types[this.subtype].prefixes != '') {
			for(var i in application.resourceManager.marker_types[this.subtype].prefixes) {
				var prefix = application.resourceManager.marker_types[this.subtype].prefixes[i];
				prefix = prefix.replace(/\s/g, '_');// underscore all spaces
				var prefix_help = application.resourceManager.marker_types[this.subtype].prefixes_help[i];
		
				var tags = (this.tags[prefix]) ? this.tags[prefix].join(',') : '';
				text_edit += '<tr><td><b>' + prefix.replace(/_/g, ' ') + ':</b></td><td> <input name="tags_' + prefix + '" id="tags_' + prefix + '" value="' + tags + '" class="fg-input ui-corner-all" style="width: 220px;"/></td></tr>';
				text_edit += '<tr><td></td><td style="color: grey;">' + prefix_help + '</td></tr>';
			}
		}
		text_edit += '<tr><td colspan="2"><hr/></td></tr>';
		text_edit += '<tr><td><b>Wikipedia Page:</b></td><td> <input id="wiki" name="wiki" value="' + this.wiki + '" class="fg-input ui-corner-all" style="width: 220px;"/><span title="Links listing to associated Wikipedia page, just start typing and we\'ll suggest exisiting pages on wikipedia" class="tag_link ui-icon ui-icon-info" style="float: right;"></span></td></tr>';
		text_edit += '<tr><td colspan="2"><hr/></td></tr>';
		text_edit += '<tr><td><b>WWW (ie http://..):</b></td><td> <input name="www" value="' + this.www + '" class="fg-input ui-corner-all" style="width: 220px;"/><span title="Links listing to an associated Web Site" class="tag_link ui-icon ui-icon-info" style="float: right;"></span></td></tr>';
		text_edit += '<tr><td><b>RSS: (ie http://..)</b></td><td> <input name="rss" value="' + this.rss + '" class="fg-input ui-corner-all" style="width: 220px;" /></td></tr>';
		//var kml_checked = (0) ? 'checked="checked"' : '';
		//text_edit += '<tr><td><b>Submit to google::</b></td><td> <input name="kml_on" type="checkbox" ' + kml_checked + '" class="fg-input ui-corner-all" /></td></tr>';
		var datetime_checked = (this.datetime_on == 1) ? 'checked="checked"' : '';
		var datetime_display = (this.datetime_on == 1) ? '' : 'display: none;';
		//text_edit += '<tr><td><b>Set Date Range:</b></td><td> <input type="checkbox" name="datetime_on" onclick="$(\'.datetime_details\').toggle();" ' + datetime_checked + ' class="fg-input ui-corner-all" /></td></tr>';
		//text_edit += '<tr class="datetime_details" style="' + datetime_display + '" ><td><b>Start Date:</b></td><td> <input id="datepicker" name="start_datetime" value="' + this.start_datetime.getDate() + '-' + (this.start_datetime.getMonth() + 1) + '-' + this.start_datetime.getFullYear() + '" style="width: 70px;" class="fg-input ui-corner-all" /></td></tr>';
		//text_edit += '<tr class="datetime_details" style="' + datetime_display + '" ><td><b>End Date:</b></td><td> <input id="datepicker_end" name="end_datetime" value="' + this.end_datetime.getDate() + '-' + (this.end_datetime.getMonth() + 1) + '-' + this.end_datetime.getFullYear() + '" style="width: 70px;" class="fg-input ui-corner-all" /></td></tr>';
		var checked_text = (this.is_invite == 1) ? 'checked="checked"' : '';
		var checked_text2 = (this.is_invite == 1) ? '' : 'display: none;';
		text_edit += '<tr><td colspan="2"><hr/></td></tr>';
		text_edit += '<tr><td colspan="2"><input onclick="$(\'.invite_details\').toggle();" type="checkbox" name="is_invite" ' + checked_text + ' class="fg-input ui-corner-all" /> <b>Customise \'contact us\' link</td></tr>';
		text_edit += '<tr class="invite_details" style="' + checked_text2 + '"><td  colspan="2" >Instead of using the built in inbox system, provide either an email address, or \'contact us\' form url to customise the \'contact user\' link on this listing.</td></tr>';
		text_edit += '<tr class="invite_details" style="' + checked_text2 + '"><td><b>Email:</b></td><td> <input name="invite_email" value="' + this.invite_email + '" size="35" class="fg-input ui-corner-all"/> or </td></tr>';
		text_edit += '<tr class="invite_details" style="' + checked_text2 + '"><td><b>Contact URL:</b></td><td> <input name="invite_url" value="' + this.invite_url + '" size="35" class="fg-input ui-corner-all"/></td></tr>';
		//text_edit += '<tr class="invite_details" style="' + checked_text2 + '"><td><b>Contact Text:</b></td><td> <input name="invite_text" value="' + this.invite_text + '" size="35" class="fg-input ui-corner-all"/></td></tr>';
		text_edit += '<tr><td colspan="2"><hr/></td></tr>';
		text_edit += '</table></div>';

		text_edit += '<hr/>';
		text_edit += '<button type="button" onClick="application.resourceManager.current_marker.updateToDB(this.form)" class="ui-corner-all fg-button ui-state-default" style="float:left;"  >Save</button>';
		if(application.user.isLoggedIn()) { text_edit += '<button type="button" onClick="application.resourceManager.current_marker.deleteToDB();" class="ui-corner-all fg-button ui-state-default" style="float:right; background: red;">Delete this Listing</button>	';}
		else {text_edit += '<b>Note</b>: You need to <a href="#" onclick="application.panelManager.openLoginWindow(); return(false);">Login</a> to delete anonymous listings.';	}
		text_edit += '</form>';	

/*
		this.openInfoWindowTabsHtml([new GInfoWindowTab('Info', text), 
			new GInfoWindowTab('Comment',text_comments), 
			new GInfoWindowTab('Share',text_share), 
			new GInfoWindowTab('Edit',text_edit)], 
			{selectedTab: openTabIndex});
 */
 // todo - implement openTabIndex
		infoBubble.addTab('Info', text);
		infoBubble.addTab('Comment',text_comments);
		infoBubble.addTab('Share',text_share);
		infoBubble.addTab('Edit',text_edit); 
        infoBubble.open(map,this);
        
	} 
	else {
		//this.openInfoWindowTabsHtml([new GInfoWindowTab('Info', text), new GInfoWindowTab('Comment',text_comments), new GInfoWindowTab('Share',text_share)], {selectedTab: openTabIndex});
 // todo - implement openTabIndex
		infoBubble.addTab('Info', text);
		infoBubble.addTab('Comment',text_comments);
		infoBubble.addTab('Share',text_share);
        infoBubble.open(map,this);
	}
	
	// add datepicker to date fields, HACK: setTimeout a bit dodgie
	addDatepicker = function() {
		console.log("	addDatepicker = function() {")
		$('#datepicker').datepicker({inLine: false, dateFormat: 'dd-mm-yy' }); 
		$('#datepicker_end').datepicker({inLine: false, dateFormat: 'dd-mm-yy' });	
	}
	setTimeout("addDatepicker()",2000);
	
	//now get the fee if there is one
	if (this.rss != undefined && this.rss != '') {
					$.getFeed({
						url: '/rss_proxy/?url=' + this.rss, 
						success: function(feed) {
							var feed_text = '<ul>';						
							for (var i in feed.items) {
								var item = feed.items[i];
								feed_text += '<li><a href="' + item.link + '">' + item.title + '</a> : ' + item.description + '</li>'; 
							} 
							feed_text += '</ul>';
							$("#latest_news").html(feed_text).find("ul").ticker("init",{delay:5000,speed:500,linked:true,selection:'li',animations: {_in:'fadeIn',out:'fadeOut'} }).ticker("loop");
						}
					});
	}	
	
	// Create image content using websnapr thumbnail service
	var content = '<img src="http://www.shrinktheweb.com/xino.php?embed=1&STWAccessKeyId=35b970f614349ea&stwsize=xlg&stwUrl=' + this.www + '" />';
	// Setup the tooltip with the content
	addPreview = function() {
		console.log("addPreview = function() {");
		$('#listing_site_preview').qtip(
		   {
			 content: content,
			 position: {
				corner: {
				   tooltip: 'bottomMiddle',
				   target: 'topMiddle'
				}
			 },
			 style: {
					tip: true, // Give it a speech bubble tip with automatic corner detection
					name: 'green',
					width:320,
					padding: 0,
					tooltip: { 'padding': 0 }, 
					content: { 'padding': 0 },
					border: {
						 width: 4,
						 radius: 6
					}
			 },
			 show: {solo: true}
		   });
	}
	setTimeout('addPreview()', 2000);

	addTagLinks = function() {
		console.log("addTagLinks = function() {");
		$(".tag_link").qtip({
			position: {
				corner: {
				   tooltip: 'bottomMiddle',
				   target: 'topMiddle'
				}
			 },
			 style: {
					tip: true, // Give it a speech bubble tip with automatic corner detection
					name: 'green',
					fontWeight: 800,
					border: {
						 width: 4,
						 radius: 6
					},
					textAlign: 'center'
			 },
			 show: {solo: true}
		});		
	}
	setTimeout('addTagLinks()', 2000);

	
	//for buttons, double upped TODO abstract this...
	fixButtons = function() {
		console.log("fixButtons = function() {");
		$(".fg-button:not(.ui-state-disabled)")
			.hover(
				function(){ 
					$(this).addClass("ui-state-hover"); 
				},
				function(){ 
					$(this).removeClass("ui-state-hover"); 
				}
			)
			.mousedown(function(){
					$(this).parents('.fg-buttonset-single:first').find(".fg-button.ui-state-active").removeClass("ui-state-active");
					if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
					else { $(this).addClass("ui-state-active"); }	
			})
			.mouseup(function(){
				if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
					$(this).removeClass("ui-state-active");
				}
		});
	}
	setTimeout('fixButtons()', 2000);

	setTimeout('$("#wiki").autocomplete({url: "data/autocomplete_wikipedia.php", multiple: false, mustMatch:true})', 2000);
	
	setTimeout('$("#tags_general").autocomplete({url: "data/autocomplete_tags.php", multiple: true,multipleSeparator: ",",extraParams: { prefix: "" }})', 2000);
	setTimeout('$("#tags_general").keyup(function(e) { if(e.keyCode == 188) { return(false);}});', 3000);
	for(var i in application.resourceManager.marker_types[this.subtype].prefixes) {
			var prefix = application.resourceManager.marker_types[this.subtype].prefixes[i];
			prefix_ref = prefix.replace(/\s/g, '_'); // underscore all spaces
			setTimeout('$("#tags_' + prefix_ref+ '").autocomplete({url: "data/autocomplete_tags.php", multiple: true,multipleSeparator: ",",extraParams: { prefix: "' + prefix + '" }})', 2000);
	}
	
	that.loadComments();

}
google.maps.Marker.prototype.addToDB = function(doOnComplete) {
	console.log("google.maps.Marker.prototype.addToDB");
	var lat_lng = this.getLatLng()
	var that = this;
	
	var url = "data/add_resource.php?";
	url += 'title=' + this.name + '&';
	url += 'description=' + this.desc + '&';
	url += 'type=' + this.type + '&';
	url += 'subtype=' + this.subtype + '&';
	url += 'lat=' + lat_lng.lat() + '&';
	url += 'lng=' + lat_lng.lng();
	$.post('data/add_resource.php', {title: this.name, desc: this.desc, type:this.type, subtype:this.subtype, lat:lat_lng.lat(), lng:lat_lng.lng()}, function(data) { 
		console.log("$.post('data/add_resource.php', {title: this.name, desc: this.desc, type:this.type, subtype:this.subtype, lat:lat_lng.lat(), lng:lat_lng.lng()}, function(data) { ");
		if($(data).find("response_state").attr("success") == 'true') {
			//doOnComplete(data);
			that.lid = $(data).find("marker").attr("lid");
			application.resourceManager.markers[that.lid] = that;
		}
	 });		
}
google.maps.Marker.prototype.deleteToDB = function() {
	console.log("google.maps.Marker.prototype.deleteToDB");
	var that = this;
	$.post('data/delete_resource.php', {lid: this.lid}, function() {
		console.log("$.post('data/delete_resource.php', {lid: this.lid}, function() {");
		map.removeOverlay(that);
		application.resourceManager.markers[that.lid].deleted = true;//TODO fix this
	});
}
google.maps.Marker.prototype.updateToDB = function(form) {
	console.log("google.maps.Marker.prototype.updateToDB");
	this.name = form.elements['name'].value;
	this.desc = form.elements['description'].value;
	this.phone = form.elements['phone'].value;
	this.address = form.elements['address'].value;
	this.is_invite = (form.elements['is_invite'].checked == true) ? 1 : 0;
	this.invite_email = form.elements['invite_email'].value;
	this.invite_url = form.elements['invite_url'].value;
	this.invite_url = (this.invite_url.match(/^http:\/\//) || this.invite_url == '') ? this.invite_url : 'http://' + this.invite_url;
	//this.invite_text = form.elements['invite_text'].value;
	//this.address = form.elements['address'].value;
	//this.phone = form.elements['phone'].value;
	this.wiki = form.elements['wiki'].value;
	this.www = form.elements['www'].value;
	this.www = (this.www.match(/^http:\/\//) || this.www == '') ? this.www : 'http://' + this.www;
	
	//this.kml_on = (form.elements['kml_on'].checked == true) ? 1 : 0;
	//this.datetime_on = (form.elements['datetime_on'].checked == true) ? 1 : 0;	
	//var sdt_array = form.elements['start_datetime'].value.split('-'); // different - must be DD-MM-YYYY
	//this.start_datetime.setFullYear(sdt_array[2], sdt_array[1] - 1, sdt_array[0] ); 
	//var edt_array = form.elements['end_datetime'].value.split('-'); // different - must be DD-MM-YYYY
	//this.end_datetime.setFullYear(edt_array[2], edt_array[1] - 1, edt_array[0] ); 
	
	this.rss = form.elements['rss'].value;
	 lat_lng = this.getLatLng();
	// get utc datetime
	//var utc_start_datetime = this.start_datetime.getUTCFullYear() + '-' + (this.start_datetime.getUTCMonth() + 1) + '-' + this.start_datetime.getUTCDate() + ' ' + this.start_datetime.getUTCHours() + ':' + this.start_datetime.getUTCMinutes() + ':' + this.start_datetime.getUTCSeconds();
	//var utc_end_datetime = this.end_datetime.getUTCFullYear() + '-' + (this.end_datetime.getUTCMonth() + 1) + '-' + this.end_datetime.getUTCDate() + ' ' + this.end_datetime.getUTCHours() + ':' + this.end_datetime.getUTCMinutes() + ':' + this.start_datetime.getUTCSeconds();
	// must be YYYY-MM-DD HH:MM:SS

	//for each prefix and general, scan the data
	//var temp_tags = form.elements['tags_general'].value.split();
	//var temp_tags.replace(/,$/, '');
	if(form.elements['tags_general'].value) {this.tags['general'] = form.elements['tags_general'].value.split(','); }
	else { delete this.tags['general']}
	for(var i in application.resourceManager.marker_types[this.subtype].prefixes) {
		var prefix = application.resourceManager.marker_types[this.subtype].prefixes[i];
		prefix = prefix.replace(/\s/g, '_'); // underscore all spaces to allow as key in array
		var current_field = form.elements['tags_' + prefix].value;
		current_field = current_field.replace(/,,+/, ',');//remove multi commas
		current_filed = current_field.replace(/^,|,$/g, '');//remove leading and trailing commas
		current_filed = current_field.replace(/^,/, '');//remove leading and trailing commas
		if(current_field) {
			if(this.tags[prefix] == undefined) {
				this.tags[prefix] = new Array();
			}
			this.tags[prefix] = current_field.split(',');
		}
		else { delete this.tags[prefix];}
	}
	var alltags = '';
	for (var prefix in this.tags) {
		for(var i in this.tags[prefix]) {		
			if(prefix == 'general') {
				alltags += ',' + this.tags[prefix][i];
			}
			else { alltags += ',' + prefix.replace(/_/g, ' ') + ':' + this.tags[prefix][i];}
		}
	}
	$.post('data/update_resource.php', {lid:this.lid, title:this.name, desc:this.desc, type:this.type, 
	subtype:this.subtype, lat:lat_lng.lat(), lng:lat_lng.lng(), www:this.www, wiki:this.wiki, rss:this.rss, is_invite:this.is_invite, invite_email:this.invite_email, invite_url:this.invite_url, address:this.address, phone:this.phone, tags:alltags});

			
	//reset search so is matches added marker
	application.resourceManager.current_marker.openInformationWindow();
}
google.maps.Marker.prototype.addCommentToDB = function(form) {
	console.log("google.maps.Marker.prototype.addCommentToDB");
	var that = this;
	var comment_text = form.elements['comment'].value;
	$.post('data/add_listing_comment.php', {lid:this.lid, comment_text:comment_text});
			
	//reset search so is matches added marker
	that.loadComments();
	
	$("#listing_comments_add").hide();
}
google.maps.Marker.prototype.reportCommentToDB = function(form) {
	console.log("google.maps.Marker.prototype.reportCommentToDB");
	var that = this;
	that.loadComments();	
	$("#listing_comments_report").hide();
}	
google.maps.Marker.prototype.loadComments = function() {
	console.log("google.maps.Marker.prototype.loadComments");
	var that = this;
	$("#listing_comments_results").html("");
	$.get('data/get_marker_comments.php', {lid: that.lid}, function(data) {	
		console.log("$.get('data/get_marker_comments.php', {lid: that.lid}, function(data) {	");
		var flag = 0;
		$(data).find('comment').each(function(i) {
			flag = 1;
			var comment_text = $(this).find('comment_text').text();
			var username = $(this).find('username').text();
			var name = $(this).find('name').text();
			var timestamp = $(this).find('timestamp').text();
		
			$("#listing_comments_results").append('<p><a href="#" onclick="application.panelManager.openProfileWindow(\'' + username + '\');return(false);">' + username + '</a>:' + name + ' (' + timestamp + ')<br/>' + comment_text + '</p>');									
		
		});
		if(flag == 0) {
			$("#listing_comments_results").html('<p><b>No Comments Added</b><br/><br/>be the first to <a onclick="$(\'#listing_comments\').hide(); $(\'#listing_comments_add\').show(); return(false);" class="" style="" href="#" title="Add Comment">add a comment</a> about ' + that.name + '</p>');
		}
		$("#listing_comments").show();
		
	});	
	$("#comment_controls").show();

}		 
		 
/////////////////////////////////////////////////////////////////////////////////////////////
// ResrouceManager
///////////////////////////////////////////////////////////////////////////////

function ResourceManager(map) {	
	console.log("function ResourceManager(map) {	");
	var that = this;
	this.marker_types = [];
	
	//both indexed by their resource id, first contains actual markers, the other the current cluster marker id for the marker
	this.markers = [];
	this.markers_cluster_id = [];
	
	this.current_marker = null;

	this.current_filter_subtype = '';
	this.current_filter_text = '';
	this.current_filter_username = '';	
	
	this.restrict_subtype = '';
	this.restrict_username = null;
		
	this.addMarkerTypes = function(callback) {
		console.log("this.addMarkerTypes = function(callback) {");
		/*var baseIcon = new GIcon();
		baseIcon.image = "http://www.google.com/mapfiles/markera.png";
		baseIcon.shadow = "http://www.victoriamycommunity.org/images/shadow.png";
		baseIcon.iconSize = new GSize(30, 30);
		baseIcon.shadowSize = new GSize(31, 32);
		baseIcon.iconAnchor = new GPoint(16, 16);
		baseIcon.infoWindowAnchor = new GPoint(13, 1);		
		*/
		var baseIcon=new google.maps.MarkerImage(
			'http://www.google.com/mapfiles/markera.png',
			new google.maps.Size(30,30),
			new google.maps.Point(16, 16)
			);

		/*var cluster_icon = new GIcon(baseIcon);
		cluster_icon.image = '/images/cluster.png';
		cluster_icon.iconSize = new GSize(40, 40);
		cluster_icon.shadow = null;*/
		var cluster_icon=new google.maps.MarkerImage(
			'../images/cluster.png',
			new google.maps.Size(38,38),   // size of orignal image
			new google.maps.Point(0, 0),   // origin
			new google.maps.Point(15, 15), // anchor based on scaled image
			new google.maps.Size(30,30)    // size to scaled image to
			);

		//this.cluster = new ClusterMarker(map, {intersectPadding: -6, clusterMarkerIcon: cluster_icon});
		//this.cluster.clusterMarkerClick=function() { that.cluster.fitMapMaxZoom(1) };
		this.cluster = new MarkerClusterer(map, that.markers, {
			gridSize: 50
			, maxZoom: 14
			, style: [{
		        url: '../images/cluster.png',
		        height: 38,
		        width: 38,
		        opt_anchor: [16, 0],
		        opt_textColor: '#FF00FF'
				}],
		});
		
		$.get('data/get_subtypes.php', {restrict_subtype: that.restrict_subtype}, function(data) {
			console.log("$.get('data/get_subtypes.php', {restrict_subtype: that.restrict_subtype}, function(data) {");
			var type_heading = '';
			$(data).find('icon').each(function(i) {	
				var subtype = $(this).attr('subtype');
				var type = $(this).attr('type');
				var is_addable = $(this).attr('is_addable');
				var image = $(this).attr("image");
				var subtype_name = $(this).attr("subtype_name");
				var type_name = $(this).attr("type_name");
				var prefixes = ($(this).attr("prefixes")) ? ($(this).attr("prefixes")).split(',') : null;
				var prefixes_help = $(this).attr("prefixes_help");
	
				//TODO: remove and combine with above code?
				//that.marker_types[subtype] = new GIcon(baseIcon);
				//that.marker_types[subtype].image = image;	
				that.marker_types[subtype]=new google.maps.MarkerImage(
					image,
					new google.maps.Size(38,38),   // size of orignal image
					new google.maps.Point(0, 0),   // origin
					new google.maps.Point(15, 15), // anchor based on scaled image
					new google.maps.Size(30,30)    // size to scaled image to
				);
				that.marker_types[subtype].subtype = subtype;	
				that.marker_types[subtype].type = type;	
				that.marker_types[subtype].is_addable = is_addable;	
				that.marker_types[subtype].subtype_name = subtype_name;
				that.marker_types[subtype].type_name = type_name;
				that.marker_types[subtype].prefixes = prefixes;
				that.marker_types[subtype].prefixes_help = prefixes_help.split('_');
				
				if(type_heading != type_name) {
					type_heading = type_name;
					$("#search_subtype_checkboxes").append('<b>' + type_name + '</b><br>');					
				}

				$("#search_subtype_checkboxes").append('<input type="checkbox" name="subtype" value="' + subtype + '" checked="checked"/>' + subtype_name + '<br />');			
			});
			
			if(typeof(callback) == 'function') { callback(); }

		});		
	}
		
	// adding new user added resource to the map
	this.addResource = function(form) {
		console.log("this.addResource = function(form) {");
		if(form) {		 
			var marker = this.createMarker({username: application.user.username, 
					point: application.current_point,
					subtype: form.subtype.value, 
					subtype_name: that.marker_types[form.subtype.value].subtype_name,
					type_name: that.marker_types[form.subtype.value].type_name});
			marker.username = (application.user.isLoggedIn()) ? marker.username : 'anonymous';
			//marker.subtype_name = that.marker_types[form.subtype.value].subtype_name;
			application.resourceManager.current_marker = marker; 
			map.addOverlay(marker);
			marker.openInformationWindow('edit');
			marker.addToDB();
		}
	}
	
	this.createMarker = function(args) {
		console.log("this.createMarker = function(args) {");		//var marker = new GMarker(args.point, {icon: application.resourceManager.marker_types[args.subtype], title: args.name + ' (' + args.subtype + ')'});	
		var marker = new google.maps.Marker({position: args.point, icon: application.resourceManager.marker_types[args.subtype], title: args.name + ' (' + args.subtype + ')'});	

		marker.lid = (args && args.lid) ? args.lid : null;
		marker.username = (args && args.username) ? args.username : '';
		marker.type = (args && args.type) ? args.type : '';
		marker.subtype = (args && args.subtype) ? args.subtype : '';
		marker.subtype_name = (args && args.subtype_name) ? args.subtype_name : '';
		marker.name = (args && args.name) ? args.name : '';;
		marker.desc = (args && args.desc) ? args.desc : '';;
		marker.www = (args && args.www) ? args.www : '';
		marker.wiki = (args && args.wiki) ? args.wiki : '';
		marker.rss = (args && args.rss) ? args.rss : '';
		marker.address = (args && args.address) ? args.address : '';
		marker.phone = (args && args.phone) ? args.phone : '';

		marker.datetime_on = (args && args.datetime_on) ? args.datetime_on : '';

		var start_datetime_str = (args && args.start_datetime_on) ? args.start_datetime_on : 0;
		var end_datetime_str = (args && args.end_datetime_on) ? args.end_datetime_on : 0;

		marker.start_datetime =   new Date(); // current date / time
		if(start_datetime_str != '' && !start_datetime_str.match(/0000/)) {
			var sdt_array = start_datetime_str.split(/\W/); // must be YYYY-MM-DD HH:MM:SS
			marker.start_datetime.setUTCFullYear(sdt_array[0], (sdt_array[1] - 1), sdt_array[2] ); 
			marker.start_datetime.setUTCHours(sdt_array[3], sdt_array[4]); 
		}
		
		marker.end_datetime =   new Date(); // current date / time
		if(end_datetime_str != '' && !end_datetime_str.match(/0000/)) {
			var edt_array = end_datetime_str.split(/\W/); // must be YYYY-MM-DD HH:MM:SS
			marker.end_datetime.setUTCFullYear(edt_array[0], (edt_array[1] - 1), edt_array[2] ); 
			marker.end_datetime.setUTCHours(edt_array[3], edt_array[4]); 
		}
		
		//marker.tags = tags;
		/////////////////
		
		
		var tags = (args && args.tags) ? args.tags : '';

		marker.tags = new Array();		
		if(tags != '') {	
			var split_tags = tags.split(',');		
			for (var i in split_tags){
					if(split_tags[i].match(/:/)) {
							var split_tag = split_tags[i].split(':');
							// check if prefix array already exists
							split_tag[0] = split_tag[0].replace(/\s/g, '_'); // underscore all spaces
							if(marker.tags[split_tag[0]] == undefined) {
								marker.tags[split_tag[0]] = new Array();// add new prefix array
							}
							marker.tags[split_tag[0]].push(split_tag[1]);// push tag on existing prefix array
					}
					else {
							if(marker.tags['general'] == undefined) {
								marker.tags['general'] = new Array();// add new general array
							}
							marker.tags['general'].push(split_tags[i]);
					} 
			}
		}
				
		
		///////////////////
		marker.current_window = null;  //TODO check if used?
		marker.is_invite = (args && args.ac_on) ? args.ac_on : '';
		marker.invite_email = (args && args.ac_email) ? args.ac_email : '';
		marker.invite_url = (args && args.ac_url) ? args.ac_url : '';
		//marker.invite_text = (args && args.invite_text) ? args.invite_text : '';

		return marker;
	}
	
	this.openMarker = function(id) {
		console.log("this.openMarker = function(id) {");
		if(this.markers_cluster_id[id] != undefined) {
			var cluster_id = this.markers_cluster_id[id];
			application.resourceManager.cluster.triggerClick(cluster_id);
			//this.markers[id].openInformationWindow();
			this.current_marker = this.markers[id];
			application.panelManager.closeAllPanels();
		}
		else if (this.markers[id]) {
			this.markers[id].openInformationWindow();
			this.current_marker = this.markers[id];
			application.panelManager.closeAllPanels();
		}
		else {
			that.loadMarkers({lid: id, openExact: 1, wideSearch: 1, activeLoad: 1})
		}
	}
	
	this.blockSearch = 0;
	this.widgetRunSearch = function(args) {
		console.log("this.widgetRunSearch = function(args) {");
		application.panelManager.hideAdvanced();
		$("#search_widget_button").html('<img src="http://victoriamycommunity.org/images/wait_small_white.gif"/>');
		$("#search_indicator").show();
		if(args && (args.subtypes != undefined || args.text != undefined || args.username != undefined)) {
			search_subtypes = (args.subtypes) ? args.subtypes : 'all';
			search_text = (args.text) ? args.text : '';
			search_usernames = (args.usernames) ? args.usernames : '';
			that.current_filter_subtype = search_subtypes;
			that.current_filter_text = search_text;
			that.current_filter_username = search_usernames;
			
			// update interface: check boxes
			$("#search_subtype_checkboxes input").each(function () {
				var pattern = new RegExp($(this).val(), 'i');
				if(search_subtypes.search(pattern) != -1) {
					$(this).attr('checked', true);	
				}
				else {
					$(this).attr('checked', false);	
				}
			});			
			
			// update interface: serach box
			$('#search_text').val(search_text);
			
			// flash search box to indicate new search
			application.panelManager.flashSearchBox();
			
		}
		else { 
			var search_subtypes = '';
			$("#search_subtype_checkboxes input:checked").each(function () {
				   search_subtypes += $(this).val() + ',';
			});
			search_subtypes = search_subtypes.substring(0, search_subtypes.length - 1);	//remove comma
			search_subtypes = (search_subtypes.match(/^ALL/) ) ? 'ALL' : search_subtypes	;
			var search_text = $('#search_text').val();
			var search_usernames = $('#search_only_user_input').val();
			that.current_filter_subtype = search_subtypes;
			that.current_filter_text = search_text;
			that.current_filter_username = search_usernames;
		}
		
		var active_load = 0;
		if (args && args.forceLoad) {
			that.blockSearch =  0;
			active_load = 1;
		}

		if(args && args.openExact) {
			that.loadMarkers({subtype: search_subtypes, text: search_text, username: search_usernames, openExact: 1, activeLoad: active_load });
		} else that.loadMarkers({subtype: search_subtypes, text: search_text, username: search_usernames, activeLoad: active_load});
		
	}
	
	$("#search_check_all").click(function() { 
           var checked_status = this.checked; 
           $("input[name=subtype]").each(function() { 
               this.checked = checked_status; 
           }); 
	}); 
   
	
	
	this.loadMarkers = function(args) {			
		console.log("this.loadMarkers = function(args) {			");
	
		/*var defaults = {  
			active_load: 0,
			open_exact: 0,
			wide_search: 0,
			filter_text: 	"",  
			filter_subtype: "",  
			username: 	"",  
			lid: "",
		}; 
		var args = $.extend(defaults, args);
		args.username = (that.restrict_username) ? that.restrict_username : args.username;
		*/
	
		// get the current filter & restrict requirements
		var active_load = (args && args.activeLoad) ? args.activeLoad : 0;
		var filter_text = (args && args.text) ? args.text : '';
		var filter_subtype = (args && args.subtype) ? args.subtype : '';
		if (filter_subtype == '' || filter_subtype == 'ALL' || filter_subtype == 'all') {
			filter_subtype = that.restrict_subtype;	
		}
		var username = (args && args.username) ? args.username : '';
		var username = (that.restrict_username) ? that.restrict_username : username;
		
		var open_exact = (args && args.openExact) ? args.openExact : '';
		var lid = (args && args.lid) ? args.lid : '';

		var wide_search = (args && args.wideSearch) ? args.wideSearch : '';
		if(wide_search) { // pass bounds through as empty if searching wider than current area
			var north_lat = '';
			var east_lng = '';
			var south_lat = '';
			var west_lng = '';	
		}
		else {
			var Bounds = map.getBounds();
			var NorthEast = Bounds.getNorthEast();
			var SouthWest = Bounds.getSouthWest();
			var north_lat = NorthEast.lat();
			var east_lng = NorthEast.lng();
			var south_lat = SouthWest.lat();
			var west_lng = SouthWest.lng();	
		}
		
		$.getJSON('data/get_markers.php', {format:"json",north_lat:north_lat, east_lng:east_lng, south_lat:south_lat, west_lng:west_lng, filter_text: filter_text, filter_subtype: filter_subtype, username:username, listing_id: lid}, function(data) {	
			if(!that.blockSearch || active_load) { // else cancel the search...	
				var new_markers = [];
				var results_text = '';

				that.clearAllMarkers();

				var results_found = 0;
				var last_id = null;
				
				$.each(data.markers, function(i, marker_args) {	
					results_found = i + 1;
					console.log(marker_args);
					//marker_args.point = new GLatLng(parseFloat(marker_args.lat),parseFloat(marker_args.lng));
					marker_args.point = new google.maps.LatLng(parseFloat(marker_args.lat),parseFloat(marker_args.lng));

					last_id = marker_args.lid; // to be able to open exact match listing
					
					// create the marker
					var marker = that.createMarker(marker_args);
					
					var desc_short = (marker.desc.length > 160) ? marker.desc.substring(0, 160) + '...' : marker.desc; 
					desc_short = (desc_short) ? desc_short + '<br/>' : '';
					var address_text = (marker.address) ? '<br/>Address: ' + marker.address + '<br/>' : '';
					var phone_text = (marker.phone) ? '<br/>Phone: ' + marker.phone + '<br/>' : '';
					var full_tag_text = '';					
					if(marker.tags != null) {
						for (var prefix in marker.tags) {
							full_tag_text += (full_tag_text) ? '. &nbsp; <b> ' + prefix.replace(/_/g, ' ') + ':</b> ' : '<b> ' + prefix.replace(/_/g, ' ') + ':</b> ';
							var tag_text = '';
							for(var j in marker.tags[prefix]) {
								var link = '<a class="tag_link" href="#" title="Show all listings tagged with \'' + marker.tags[prefix][j] + '\' in the current map area." onclick="application.resourceManager.widgetRunSearch({text:\'' + marker.tags[prefix][j] + '\'});return false;">' + marker.tags[prefix][j] + '</a>';
								tag_text += (tag_text) ? ', ' + link : link; 
							}
							full_tag_text += tag_text;
						}
					}
						
					results_text += '<div class="main_results" style="padding: 0.4em 0.6em;"><div style="margin: 4px 0px;  border-top: 1px dotted;"><a href="#" onclick="application.resourceManager.openMarker(' + marker_args.lid + '); application.panelManager.hideResults(); return(false);">' + marker_args.name + '</a> &nbsp; (<a class="tag_link" href="#" title="Show all listings of category \'' + marker_args.subtype_name + '\' in the current map area." onclick="application.resourceManager.widgetRunSearch({text:\'' + marker_args.subtype_name + '\'});return false;">' + marker_args.subtype_name + '</a>)</div><div class="subtle_text" style="font-size: 0.9em;"> ' + desc_short + address_text + phone_text + '</div><div class="subtle_text" style="font-size: 0.9em; margin-top:0.2em;">' + full_tag_text + '</div></div>';
					new_markers[i] = marker;
			google.maps.event.addListener(marker, 'click', marker.openInformationWindow);
					
					that.markers[marker_args.lid] = marker;
					that.markers_cluster_id[marker_args.lid] = i;
					
				});
				if(results_text == '') {
					results_text = '<div style="padding: 0.4em 0.6em;">Sorry, there are no matching listings in this area, try <a href="#" onclick="map.zoomOut(); application.resourceManager.endMapDrag(); return false;">zooming out</a> or <a href="#" onclick="$(\'#search_text\').focus().select();application.panelManager.flashSearchBox();return(false);">change your search</a>.</div>';
					$("#searchPanelNoResults").html(results_text);
					$("#searchPanelResultsFound").html('<b><span style="font-size: 1.2em;">0</span> results found</b>');
					if(typeof(callback) == 'function') { callback(); } 
					application.panelManager.showNoResults();
				}
				else {
					$("#searchPanelResultsListings").html(results_text);
					$("#searchPanelResultsFound").html('<b><span style="font-size: 1.2em;">' + results_found + '</span> results found </b>');
					application.resourceManager.cluster.addMarkers(new_markers);					
					//application.resourceManager.cluster.refresh();		
					application.panelManager.hideNoResults();
					
					application.panelManager.feedsCustomize();				
					
					if(open_exact && results_found === 1) { 
						application.resourceManager.openMarker(last_id);
					} 
					else if(args && args.activeLoad) {
						application.panelManager.showResults();	
					}

				}
				$('#map_filter_center').animate( { backgroundColor: "#FFDE40" }, { queue:true, duration:200 } ).animate( { backgroundColor: application.panelManager.search_bg_color }, { queue:true, duration:1000 } );
				//map.enableDragging(); // toV3it
				
				that.markerTip = function() {
					console.log("that.markerTip = function() {");
					$("img[id^='mtgt']").qtip({
								position: {
									corner: {
									   tooltip: 'bottomMiddle',
									   target: 'topMiddle'
									}
								 },
								 style: {
										tip: true, // Give it a speech bubble tip with automatic corner detection
										name: 'green',
										fontWeight: 800,
										
										border: {
											 width: 4,
											 radius: 6
										},
										textAlign: 'center'
								 },
								 show: {solo: true}
					});		
				}
				setTimeout("application.resourceManager.markerTip()", 1000);

				// add tooltips for tags and categories				
				$(".tag_link").qtip({
					position: {
						corner: {
						   tooltip: 'bottomMiddle',
						   target: 'topMiddle'
						}
					 },
					 style: {
							tip: true, // Give it a speech bubble tip with automatic corner detection
							name: 'green',
							fontWeight: 800,
							border: {
								 width: 4,
								 radius: 6
							},
							textAlign: 'center'
					 },
					 show: {solo: true}
				});	
				
				$("#search_widget_button").html('Go');
				$("#search_indicator").hide();

			}
			else {
				$("#search_widget_button").html('Go');	
				$("#search_indicator").hide();

			}
		});
	}
	
	this.clearAllMarkers = function() {
		console.log("this.clearAllMarkers = function() {");
		this.markers = [];
		this.markers_cluster_id = [];
		this.cluster.removeMarkers(this.markers);
		//map.clearOverlays(); // toV3it
	}
	
	this.drag_timer = null;
	this.endMapDrag = function() {
		console.log("this.endMapDrag = function() {");
			clearTimeout(that.drag_timer);
			that.drag_timer = setTimeout("application.resourceManager.triggerDragLoad()", 1000);
	}
	this.startMapDrag = function() {
		console.log("this.startMapDrag = function() {");
			clearTimeout(that.drag_timer);
	}
	this.triggerDragLoad = function() {
		console.log("this.triggerDragLoad = function() {");
		if(!this.blockSearch) {
			$('#search_text').autocomplete("flushCache");
			map.disableDragging();
			that.widgetRunSearch({ callback: function() {map.enableDragging();} });
		}
	}
	
	//GEvent.bind(map, "dragend", this, this.endMapDrag); // toV3it
	//GEvent.bind(map, "dragstart", this, this.startMapDrag); // toV3it
	google.maps.event.addListener(map, 'dragend', this.endMapDrag);
	google.maps.event.addListener(map, 'dragstart', this.startMapDrag);

	
	this.infoWindowOpened = function() {
		console.log("this.infoWindowOpened = function() {");
		this.blockSearch = 1;
	}
	this.infoWindowClosed = function() {
		console.log("this.infoWindowClosed = function() {");
		this.blockSearch = 0;
		that.widgetRunSearch({ callback: function() {map.enableDragging();} });
	}
	//GEvent.bind(map, "infowindowopen", this, this.infoWindowOpened);// toV3it
	//GEvent.bind(map, "infowindowbeforeclose", this, this.infoWindowClosed);// toV3it
	google.maps.event.addListener(map, "infowindowopen", this.infoWindowOpened);
	google.maps.event.addListener(map, "infowindowbeforeclose", this.infoWindowClosed);


	
	/////////////////////////////////////////////

	this.yVIHLookup = function(response) {
		console.log("this.yVIHLookup = function(response) {");
			//map.clearOverlays();
		  if (!response || response.Status.code != 200) {
				alert("Status Code:" + response.Status.code);
			  } else {
				place = response.Placemark[0];
				var postcode = place.AddressDetails.Country.AdministrativeArea.Locality.PostalCode.PostalCodeNumber;

				text = '<div class="info_window">';
				text += '<p></p>';
				text += '<p><a target="_blank" href="http://yourvoiceinhouse.org.au/index.php?page=results&pcode=' + postcode + '">Click Here</a> to find your local members of parliament<br/> (You will be redirected to the Your Voice In House website in a new window.)</p>';
				text += '</div>';
				map.openInfoWindowHtml(application.current_point, text);  
			  }
	}
	
	this.YVIHPopup = function() {	
		console.log("this.YVIHPopup = function() {	");
		var point = application.current_point;
		geocoder.getLocations(point, this.yVIHLookup);
	}
	
}
			

function PanelManager(map) {
	console.log("function PanelManager(map) {");
	var that = this;
		
	this.autoFill = function(id, v){
		console.log("this.autoFill = function(id, v){");
		$(id).css({ color: "#b2adad" }).attr({ value: v }).focus(function(){
			if($(this).val()==v){
				$(this).val("").css({ color: "#333" });
			}
		}).blur(function(){
			if($(this).val()==""){
				$(this).css({ color: "#b2adad" }).val(v);
			}
		});
	}
	
	this.autoFill('#header_login_email', "Username or Email");
	this.autoFill('#header_login_password', "Password");
	this.autoFill('.gotoAddress', "Suburb, Town, Country or Street Address");

	//this.autoFill('#sign_up_email', "Email Address");
	//this.autoFill('#sign_up_password', "Password");
	//this.autoFill('#sign_up_full_name', "Full Name");
	//this.autoFill('#sign_up_username', "Username");
	
	$(".map-button").qtip({
			position: {
				corner: {
				   tooltip: 'leftMiddle',
				   target: 'rightMiddle'
				}
			 },
			 style: {
					tip: true, // Give it a speech bubble tip with automatic corner detection
					name: 'green',
					fontWeight: 800,
					border: {
						 width: 4,
						 radius: 6
					},
					textAlign: 'center'
			 },
			 show: {solo: true}
	});	
	$(".header-button").qtip({
			position: {
				corner: {
				   tooltip: 'topMiddle',
				   target: 'bottomMiddle'
				}
			 },
			 style: {
					tip: true, // Give it a speech bubble tip with automatic corner detection
					name: 'green',
					fontWeight: 800,
					
					border: {
						 width: 4,
						 radius: 6
					},
					textAlign: 'center'
			 },
			 show: {solo: true}
	});	
	
	$('#search_text').autocomplete( {
			url: "data/autocomplete_search.php", 
			scrollHeight: 320,
			extraParams: {
					nlat: function() { return map.getBounds().getNorthEast().lat(); },
					elng: function() { return map.getBounds().getNorthEast().lng(); },
					slat: function() { return map.getBounds().getSouthWest().lat(); },
					wlng: function() { return map.getBounds().getSouthWest().lng(); } 
			},
			formatResult: function(row) { return row[0].replace(/\s<.*>$/, ''); },
			matchContains: true
	});
	$('#search_text').clearableTextField();

	
	
	// needed as submit disabled by autocomplete
	$('#search_text').keyup(function(e) {
		if(e.keyCode == 13) {
			application.resourceManager.widgetRunSearch({forceLoad: 1, openExact: 1});
		}
	});
	
	//$('#search_text').click();
	
	$(".fg-button:not(.ui-state-disabled)")
		.hover(
			function(){ 
				$(this).addClass("ui-state-hover"); 
			},
			function(){ 
				$(this).removeClass("ui-state-hover"); 
			}
		)
		.mousedown(function(){
				$(this).parents('.fg-buttonset-single:first').find(".fg-button.ui-state-active").removeClass("ui-state-active");
				if( $(this).is('.ui-state-active.fg-button-toggleable, .fg-buttonset-multi .ui-state-active') ){ $(this).removeClass("ui-state-active"); }
				else { $(this).addClass("ui-state-active"); }	
		})
		.mouseup(function(){
			if(! $(this).is('.fg-button-toggleable, .fg-buttonset-single .fg-button,  .fg-buttonset-multi .fg-button') ){
				$(this).removeClass("ui-state-active");
			}
	});
	
	
	$('#inbox_tabs').tabs();
	$('#inbox_tabs').bind('tabsselect', function(event, ui) {
		//if(ui.index == 0) { application.user.refreshInboxConversations(); }
		//else if(ui.index == 1) { application.user.refreshInboxRss(); }
		// else if(ui.index == 2) { application.user.refreshInboxMarkers(); }
	});

	$('#tabs_doco').tabs({
		/*load: function(event, ui) {
			$('a', ui.panel).click(function() {
				$(ui.panel).load(this.href);
				return false;
			});
		}*/
	});
	
	// Dialog		
	dialog_height = 250;
	$('#map_dialog_add').dialog({
					title: 'Add Listing',
					autoOpen: false,
					resizable: true,
					width: 400,
					height: 150,
					position: 'bottom',
					zindex: 500 
	});	
	$('#map_dialog_location').dialog({
					title: 'Change Location',
					autoOpen: false,
					resizable: true,
					width: 400,
					height: 150,
					position: 'bottom',
					zindex: 500 
	});	
	$('#map_dialog_yvih').dialog({
					title: 'Your Voice In House',
					autoOpen: false,
					resizable: true,
					width: 250,
					height: 150,
					position: 'bottom',
					zindex: 500 
	});	
	$('#map_dialog_data').dialog({
					title: 'Data Feeds',
					autoOpen: false,
					resizable: true,
					width: 400,
					height: 180,
					position: 'bottom',
					zindex: 500 
	});	
	$('#map_dialog_plugin').dialog({
					title: 'Website Plugin',
					autoOpen: false,
					resizable: true,
					width: 350,
					height: 220,
					position: 'bottom',
					zindex: 500 
	});	



	var resizeTimer = null;
	this.setHeaderSize = function() {
		console.log("this.setHeaderSize");
		var map_size = map.getDiv(); 
		var x_size = map_size.width;
		var y_size = map_size.height;

		if(x_size < 800) {
			$("#header_center").css("width", x_size - 20);
			$("#map_filter_center").css("width", x_size - 20);
			$("#panel_center").css("width", x_size - 20);

			$("#header_login_small").css("display", "block");
			$("#header_login_large").css("display", "none");
		}
		else if(x_size < 1000) {
			$("#header_center").css("width", x_size - 120);
			$("#map_filter_center").css("width", x_size - 120);
			$("#panel_center").css("width", x_size - 120);
			
			$("#header_login_large").css("display", "block");
			$("#header_login_small").css("display", "none");
		}
		else { // big and bigger...
			$("#header_center").css("width", 880);
			$("#map_filter_center").css("width", 880);
			$("#panel_center").css("width", 880);

			$("#header_login_large").css("display", "block");
			$("#header_login_small").css("display", "none");
		}
		$("#searchPanelResults").css("height", y_size - 100);
		$("#search_subtype_checkboxes").css("height", y_size - 100);
	}
	$(window).bind('resize', function(that) {
		console.log("$(window).bind('resize', function(that) {");
		if (resizeTimer) clearTimeout(resizeTimer);
    	resizeTimer = setTimeout("application.panelManager.setHeaderSize()", 100);
	}); 
	
	
	this.login = function(form) {
		console.log("this.login = function(form) {");
		$("#login_response").html('<img src="images/wait_small.gif"/>');
		application.user.login(form, this.loginSuccess, this.loginFailure);
	}
	this.loginSuccess = function(name, last_lng, last_lat, last_zoom) {
		console.log("this.loginSuccess = function(name, last_lng, last_lat, last_zoom) {");
		$("#login_response").html('<div class="ui-widget"><div class="ui-state-highlight ui-corner-all" style="padding: 0pt 0.7em; margin-top: 20px;"> <p><span class="ui-icon ui-icon-check" style="float: left; margin-right: 0.3em;"></span><b>Hi! You\'re logged in as ' + name + '</b></p></div></div>');									 
		that.openInboxWindow(1);
		$(".show_logged_in").css("display", "block");
		$(".show_logged_out").css("display", "none");	
		$("span[id^='your_name']").html(name);
		//map.setCenter(new GLatLng(last_lat, last_lng), 15);
	}
	this.loginFailure = function(error_message) {
		console.log("this.loginFailure = function(error_message) {");
		$("#login_response").html('<div class="ui-widget"><div class="ui-state-error ui-corner-all" style="padding: 0pt 0.7em; margin-top: 20px;"> <p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: 0.3em;"></span><b>' + error_message + '</b></p></div></div>');									 
		that.openLoginWindow();
		$(".show_logged_in").css("display", "none");
		$(".show_logged_out").css("display", "block");	
	}

	
	this.logOut = function(form) {
		console.log("this.logOut = function(form) {");
		application.user.logout(this.logoutSuccess);
		return(false);
	}
	this.logoutSuccess = function() {	
		console.log("this.logoutSuccess = function() {	");
		that.openHomeWindow();
		$(".show_logged_in").css("display", "none");
		$(".show_logged_out").css("display", "block");
	}
	$("a[id^='logOutButton']").bind("click", function() {	
		that.logOut();
		return(false);
	});
	
	this.register = function(form) {
		console.log("this.register = function(form) {");
		$("#register_response").html('<img src="images/wait_small.gif"/>');
		application.user.register(form, this.registerSuccess, this.registerFailure); 
	}	
	this.registerSuccess = function() {	
		console.log("this.registerSuccess = function() {	");
		$("#register_response").html('<b style="color: green"><img src="images/tick.jpeg" /> Great! We\'ve just sent you an email to confirm your email address, just click on the link in this email to complete sign up.</b>');			
		$(".register_step_2").css("display", "table-row");	
		$(".register_step_1").css("display","none");
	}
	this.registerFailure = function(error_message) {
		console.log("this.registerFailure = function(error_message) {");
		$("#register_response").html('<b style="color: red"><img src="images/cross.jpeg" />' + error_message + '</b>');
	}
	
	this.registerConfirm = function(form) {
		console.log("this.registerConfirm = function(form) {");
		$("#register_response").html('<img src="images/wait_small.gif"/>');
		application.user.registerConfirm(form, this.registerConfirmSuccess, this.registerConfirmFailure); 
	}	
	this.registerConfirmSuccess = function(name) {	
		console.log("this.registerConfirmSuccess = function(name) {	");
		$("#register_response").html('<b style="color: green"><img src="images/tick.jpeg" /> Hi! Youre logged in as ' +  name + '!</b>');			
		$("#login_response").html('<b style="color: green"><img src="images/tick.jpeg" /> Hi! Youre logged in as ' +  name + '!</b>');			
		$(".register_step_2").css("display", "none");	
		$(".register_step_1").css("display","table-row");
		$(".show_logged_in").css("display", "block");
		$(".show_logged_out").css("display", "none");
		$("span[id^='your_name']").html(name);
		that.openInboxWindow(1);
	}
	this.registerConfirmFailure = function(error_message) {
		console.log("this.registerConfirmFailure = function(error_message) {");
		$("#register_response").html('<b style="color: red"><img src="images/cross.jpeg" />' + error_message + '</b>');
	}
	
	this.inviteConfirm = function(form) {
		console.log("this.inviteConfirm = function(form) {");
		$("#register_response").html('<img src="images/wait_small.gif"/>');
		application.user.inviteConfirm(form, this.inviteConfirmSuccess, this.inviteConfirmFailure); 
	}	
	this.inviteConfirmSuccess = function(name) {	
		console.log("this.inviteConfirmSuccess = function(name) {	");
		$("#register_response").html('<b style="color: green"><img src="images/tick.jpeg" /> Hi! Youre logged in as ' +  name + '!</b>');			
		$("#login_response").html('<b style="color: green"><img src="images/tick.jpeg" /> Hi! Youre logged in as ' +  name + '!</b>');			
		$(".register_step_2").css("display", "none");	
		$(".register_step_1").css("display","table-row");
		$(".show_logged_in").css("display", "block");
		$(".show_logged_out").css("display", "none");
		$("span[id^='your_name']").html("Hi " + name);
		that.openInboxWindow();
	}
	this.inviteConfirmFailure = function(error_message) {
		console.log("this.inviteConfirmFailure = function(error_message) {");
		$("#register_response").html('<b style="color: red"><img src="images/cross.jpeg" />' + error_message + '</b>');
	}
	
	////////////////////////////////////////////////////////////////////////////	
	
	this.loadProfile = function(username) {
		console.log("this.loadProfile = function(username) {");
		$.get('data/get_profile.php', {username: username}, function(data) {
			$('#pp_username').text(username);
			$('#pp_full_name').text($(data).find('full_name').text());
			$('#pp_www').html('<a href="' + $(data).find('www').text() + '" target="_blank">' + $(data).find('www').text() + '</a>');
			$('#pp_blurb').text($(data).find('blurb').text());			
		});	
		
		$.getJSON('data/get_markers.php', {format:"json", username: username}, function(data) {
				$("#pp_listings").html(' ');
				
				$.each(data.markers, function(i, marker_args) {	
					results_found = i + 1;
					//marker_args.point = new GLatLng(parseFloat(marker_args.lat),parseFloat(marker_args.lng));
					marker_args.point = new google.maps.LatLng(parseFloat(marker_args.lat),parseFloat(marker_args.lng));
					var name = marker_args.name;
					var lid = marker_args.lid;
					var desc = marker_args.desc;
					var address = (marker_args.address) ? '<br/>Address: ' + marker_args.address : '';
					var phone = (marker_args.phone) ? '<br/>Phone: ' + marker_args.phone : '';
					var desc = marker_args.desc;
					var markers_text = '<div class="listing_main" style="width: 85%;"><a href="#" onclick="application.panelManager.closeAllPanels(); application.resourceManager.openMarker(' + marker_args.lid + '); return(false);">' + marker_args.name + '</a> (' +  marker_args.subtype_name + ')<div class="listing_sub"><span style="color:#666666">' + marker_args.desc + marker_args.address + marker_args.phone + '</span></div>';							
					$('<div class="listing_div"></div>').html(markers_text).appendTo("#pp_listings");

				});
		});
		
	}  
	
	
	////////////////////////////////////////////////////////////////////////////	
	
	this.openPanel = function(panelId) {
		console.log("this.openPanel = function(panelId) {");
		$("#panel_background").animate( { opacity:"1" }, 500).fadeIn("slow", function(){
			$(".content_pane").css("display", "none");
			$("#panel").fadeIn("slow");
			$(panelId).css("display", "block");	
			if(panelId == '#panel_home') {
							$("#header-tool-bar").animate( { marginTop: "3.8em" }, { queue:false, duration:500 } ).animate( { marginLeft: "120px" }, { queue:false, duration:500 } ).animate( { marginBottom: "3em" }, { queue:false, duration:500 } );
							$("#panel_center").animate( { marginTop: "8.4em" }, { queue:false, duration:500 } );							
			} 
			else {
							$("#header-tool-bar").animate( { marginTop: "0" }, { queue:false, duration:500 } ).animate( { marginLeft: "0px" }, { queue:false, duration:500 } ).animate( { marginBottom: "0px" }, { queue:false, duration:500 } );
							$("#panel_center").animate( { marginTop: "2.8em" }, { queue:false, duration:500 } );
			}
		});	
	}
	this.closeAllPanels = function() {
		console.log("this.closeAllPanels = function() {");
		$("#panel").fadeOut("fast", function() { 
				$("#panel_background").fadeOut("slow", function () {
						$("#map_zoom_div").fadeIn("slow");
				});	
		});
		
		$("#header-tool-bar").animate( { marginTop: "0px" }, { queue:false, duration:500 } ).animate( { marginLeft: "0px" }, { queue:false, duration:500 } ).animate( { marginBottom: "0em" }, { queue:false, duration:500 } );
		
		//$('#dialog_map_tools').dialog('option', 'position', 'left');
		//$('#dialog_map_tools').dialog('open');
	}
	
	$("#mapButton").bind("click", function() {		
		that.closeAllPanels();
		$('#dialog_map_tools').dialog('open');
	});
	
	this.openHomeWindow = function() {
		console.log("this.openHomeWindow = function() {");
		this.openPanel("#panel_home");
	}
	$("#homeButton").bind("click", function() {		
		that.openHomeWindow();
	});
	
	this.openLoginWindow = function() {
		console.log("this.openLoginWindow = function() {");
			this.openPanel("#panel_login");
	}		
	$(".loginButton").bind("click", function() {		
		that.openLoginWindow();
	});
	
	this.openInboxWindow = function(refresh) {
		console.log("this.openInboxWindow = function(refresh) {");
			this.openPanel("#panel_inbox");	
			if(refresh) {
				application.user.refreshInboxRss();
				application.user.refreshInboxMarkers();
				application.user.refreshInboxConversations();
			}
	}
	$("#inboxButton").bind("click", function() {		
		that.openInboxWindow(1);
	});
	
	this.openDocsWindow = function(url) {			
		console.log("this.openDocsWindow = function(url) {			");
			that.openPanel("#panel_docs");
	}	
	$("#docsButton").bind("click", function() {		
		that.openDocsWindow();
	});
	
	this.openProfileWindow = function(username) {
		console.log("this.openProfileWindow = function(username) {");
			this.openPanel("#panel_profile");
			this.loadProfile(username);
	}		
	

	
	

	
	this.clickMap = function(point) {
		console.log("this.clickMap = function(point) {");
		if(point) {application.onMapClick(null, point);}
		else {application.onMapClick(null, map.getCenter());}
	}
	
	/*
	this.openYVIHWindow = function() {
			this.openPanel("#panel_yvih");	
	}	*/
	this.gotoAddress = function(address, callback) {
		console.log("this.gotoAddress = function(address, callback) {");
		if (geocoder) {
			/*
			geocoder.getLatLng(address, function(point) {
				if (!point) {
					alert(address + " not found");
				} 
				else {
					map.setCenter(point, 14);		
					that.closeAllPanels();
					if(typeof(callback) == 'function') { callback(point); }
				}
			});*/
 			geocoder.geocode( { 'address': address}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					var point = results[0].geometry.location;
					map.setCenter(point, 14);		
					that.closeAllPanels();
					if(typeof(callback) == 'function') { callback(point); }
				} else {
					alert(address + " not found");
				}
			});

		}
	}	
	this.widgetPluginCustomize = function() {
		console.log("this.widgetPluginCustomize = function() {");
		var start_screen = $("#widget_plugin_form select[name=start_screen] option:selected").val();
		var theme = $("#widget_plugin_form select[name=theme] option:selected").val();
		var size = $("#widget_plugin_form select[name=size] option:selected").val();

		var lat_lng = map.getCenter();					
							
		if (start_screen == 'map_filter') {
				var settings = '?theme=' + theme + '&zoom=' + map.getZoom() + '&lat=' + lat_lng.lat() + '&lng=' + lat_lng.lng() + '&subtype=' + application.resourceManager.current_filter_subtype + '&username=' + application.resourceManager.current_filter_username;
		}					
		else if (start_screen == 'map_restrict') {
				var settings = '?theme=' + theme + '&zoom=' + map.getZoom() + '&lat=' + lat_lng.lat() + '&lng=' + lat_lng.lng() + '&r_subtype=' + application.resourceManager.current_filter_subtype + '&r_username=' + application.resourceManager.current_filter_username;
		}
		else {
				var settings = '?theme=' + theme + '&zoom=' + map.getZoom() + '&lat=' + lat_lng.lat() + '&lng=' + lat_lng.lng() + '&subtype=all';
		}
		
		if (size == 'l') {
			var x = 1050;
			var y = 600;
		}
		else if (size == 'm') {
			var x = 850;
			var y = 500;
		}
		else {
			var x = 650;
			var y = 400;
		}
		
		
		$('#wpf_link').attr({href: 'http://www.victoriamycommunity.org/plugin_preview.php?st=' + start_screen+ '&su=' + application.resourceManager.current_filter_subtype + '&username=' + application.resourceManager.current_filter_username + '&th=' + theme + '&si=' + size + '&zoom='  + map.getZoom() + '&lat=' + lat_lng.lat() + '&lng=' + lat_lng.lng() + ''});
		$('#wpf_code').attr({value: '<iframe style="border: none; width:' + x + 'px; height:' + y + 'px;" src="www.victoriamycommunity.org/index.php' + settings + '"></iframe>'});
	}
	this.feedsCustomize = function() {
		console.log("this.feedsCustomize = function() {");
		var Bounds = map.getBounds();
		var NorthEast = Bounds.getNorthEast();
		var SouthWest = Bounds.getSouthWest();
		var nb = NorthEast.lat();
		var eb = NorthEast.lng();
		var sb = SouthWest.lat();
		var wb = SouthWest.lng();
		var lat_lng = map.getCenter();
		var filter_subtype = application.resourceManager.current_filter_subtype;
		var filter_text = application.resourceManager.current_filter_text;
		var username = application.resourceManager.current_filter_username;
		$('#listings_feed_xml').attr({href: 'http://www.victoriamycommunity.org/data/get_markers.php?format=xml&north_lat=' + nb + '&east_lng=' + eb + '&south_lat=' + sb + '&west_lng=' + wb + '&filter_subtype=' + filter_subtype + '&filter_text=' + filter_text + '&username=' + username }); 
		$('#listings_feed_kml').attr({href: 'http://www.victoriamycommunity.org/data/get_markers.php?format=kml&north_lat=' + nb + '&east_lng=' + eb + '&south_lat=' + sb + '&west_lng=' + wb + '&filter_subtype=' + filter_subtype + '&filter_text=' + filter_text + '&username=' + username }); 
		$('#listings_feed_csv').attr({href: 'http://www.victoriamycommunity.org/data/get_markers.php?format=csv&north_lat=' + nb + '&east_lng=' + eb + '&south_lat=' + sb + '&west_lng=' + wb + '&filter_subtype=' + filter_subtype + '&filter_text=' + filter_text + '&username=' + username }); 

	}
	
	this.search_bg_color = $('#map_filter_center').css("background-color");
	// Map Filter / Search Bar
	this.show_results_timer = null;
	this.showResults = function() {
		console.log("this.showResults = function() {");
		$('#searchPanelResults').slideDown('normal');
		$('#show_results_button').html("<b>Hide Results</b>");
		$('#show_results_button').unbind('click', that.showResults).click(that.hideResults);
		that.hideAdvanced();
		that.hideNoResults();
	}
	this.hideResults = function() {
		console.log("this.hideResults = function() {");
		$('#searchPanelResults').slideUp('normal');
		$('#show_results_button').html("<b>Show Results</b>");
		$('#show_results_button').unbind('click', that.hideResults).click(that.showResults);
	}
	$("#map_div").mouseenter(
		function () {console.log("$('#map_div').mouseenter(");that.hideResults();}
	);
	this.showNoResults = function() {
		console.log("this.showNoResults = function() {");
		$('#searchPanelNoResults').slideDown('normal');
		$('#show_results_button').hide();
		that.hideResults();
		that.hideAdvanced();
	}
	this.hideNoResults = function() {
		console.log("this.hideNoResults = function() {");
		$('#searchPanelNoResults').slideUp('normal');
		$('#show_results_button').show();
	}
	this.showAdvanced = function() {
		console.log("this.showAdvanced = function() {");
		$('#search_subtype_checkboxes').slideDown('normal');
		$('#advanced_button').html("Hide Advanced");
		$('#advanced_button').unbind('click', that.showAdvanced).click(that.hideAdvanced);
		that.hideResults();
		that.hideNoResults();
	}
	this.hideAdvanced = function() {
		console.log("this.hideAdvanced = function() {");
		$('#search_subtype_checkboxes').slideUp('normal');
		$('#advanced_button').html("Advanced");
		$('#advanced_button').unbind('click', that.hideAdvanced).click(that.showAdvanced);
	}
	this.flashSearchBox = function() {
		console.log("this.flashSearchBox = function() {");
		$('#search_text').animate( { backgroundColor: "#FFDE40" }, { queue:true, duration:200 } )
										.animate( { backgroundColor: "white" }, { queue:true, duration:1000 } );	
	}
}
	

/////////////////////////////////////////////////////
// User
/////////////////////////////////
	
function User(map) {
	console.log("function User(map) {");
	//all things user
	var that = this;
	
	this.email = null;
	this.username = null;
	this.full_name = null;
	 
	this.isLoggedIn = function() {
		console.log("this.isLoggedIn = function() {");
		if (this.username === null) {return false;} else {return true;}
	}
	this.refreshIsLoggedIn = function() {
		console.log("this.refreshIsLoggedIn = function() {");
			$.post('data/is_logged_in.php', {}, function(data) {
				if($(data).find("response_state").attr("success") == 'true') {
					that.email = $(data).find("user").attr("email");
					that.full_name = $(data).find("user").attr("full_name");
					that.username = $(data).find("user").attr("username");
					//var last_lat = $(data).find("last_view").attr("last_lng");
					//var last_lng = $(data).find("last_view").attr("last_lat");
					//var last_zoom = $(data).find("last_view").attr("last_zoom");
					$(".show_logged_in").css("display", "block");
					$(".show_logged_out").css("display", "none");	
					$("span[id^='your_name']").html(that.full_name);
				}
			});	
	}
	this.refreshIsLoggedIn();
	 
	this.logout = function(doOnSuccess) {
		console.log("this.logout = function(doOnSuccess) {");
		$.post('data/logout.php', {}, function(data) {
				$("#register_wait").css("display", "none");
				if($(data).find("response_state").attr("success") == 'true') {
					// all dood, null the user
					that.clearUser();
					(doOnSuccess) ? doOnSuccess(that.username): null;
				}
		});
	}	
	
	this.clearUser = function() {
		console.log("this.clearUser = function() {");
		this.username = null;
		this.email = null;
		this.full_name = null;
	}
	
	this.login = function(form, doOnSuccess, doOnFailure) {			
		console.log("this.login = function(form, doOnSuccess, doOnFailure) {			");
		var email_or_username = form.email.value;
		var password = form.password.value;
			 
		if(email_or_username != '' && password != '') {
			$.post('data/login.php', {email_or_username:email_or_username, password:password}, function(data) {
				$("#register_wait").css("display", "none");
				if($(data).find("response_state").attr("success") == 'true') {
					that.email = $(data).find("user").attr("email");
					that.full_name = $(data).find("user").attr("full_name");
					that.username = $(data).find("user").attr("username");
					//var last_lat = $(data).find("last_view").attr("last_lng");
					//var last_lng = $(data).find("last_view").attr("last_lat");
					//var last_zoom = $(data).find("last_view").attr("last_zoom");
					//if(doOnSuccess) {doOnSuccess(that.username, last_lat, last_lng, last_zoom);}
					if(doOnSuccess) {doOnSuccess(that.username);}

				}
				else {
					if(doOnFailure) {doOnFailure('Incorext username or password, please try again.');}
				}
			});
		}
		else {
			doOnFailure('You need to provide your email and password to log in.');									 
		}
	}
	   
	this.register = function(form, doOnSuccess, doOnFailure) {					 
		console.log("this.register = function(form, doOnSuccess, doOnFailure) {					 ");
		var email = form.email.value;
		var password = form.password.value;
		var full_name = form.full_name.value;
		var username = form.username.value;
	   
		if(email != '' && password != '' && full_name != '' && username != '') {
			$.post('data/register.php', {email: email, password: password, full_name: full_name, username: username}, function(data) {
				$("#register_wait").css("display", "none");
				if($(data).find("response_state").attr("success") == 'true') {
					if(doOnSuccess) {doOnSuccess();}	
				}
				else if($(data).find("error").attr("error_code") == 'email_exists') {
					if(doOnFailure) {doOnFailure('Sorry, this email address has already registered!');}
				}
				else if($(data).find("error").attr("error_code") == 'username_exists') {
					if(doOnFailure) {doOnFailure('Sorry, this username has already registered!');}
				}
				else if($(data).find("error").attr("error_code") == 'db_error') {
					if(doOnFailure) {doOnFailure('Sorry, there was a DB Error, please try again later.');}
				}
			});
		}
		else {
			if(doOnFailure) {doOnFailure('Sorry, you must fill in all fields to register!');}							 
		}	 
	}
	   
	this.registerConfirm = function(form, doOnSuccess, doOnFailure) {				
		console.log("this.registerConfirm = function(form, doOnSuccess, doOnFailure) {				");
		document.getElementById('login_response').innerHTML = '<img src="images/wait_small.gif"/>';	 
		var email = form.email.value;
		var rego_code = form.rego_code.value;
	   
		if(rego_code != '' && email != '') {
			$.post('data/register_confirm.php', {rego_code: rego_code, email: email}, function(data) {
				$("#register_wait").css("display", "none");
				if($(data).find("response_state").attr("success") == 'true') {
					that.email = $(data).find("user").attr("email");
					that.full_name = $(data).find("user").attr("full_name");
					that.username = $(data).find("user").attr("username");
					if(doOnSuccess) {doOnSuccess(that.username);}		
				}
				else if($(data).find("error").attr("error_code") == 'incorrect_rego_code') {
					if(doOnFailure) {doOnFailure('Incorrect confirmation code, check your details and try again');}
				}
			});
		}
		else {
			if(doOnFailure) {doOnFailure('You need to provide your email and the rego code sent to this email address to confirm your registration!');}							 
		}
			 
	}
	
	this.inviteConfirm = function(form, doOnSuccess, doOnFailure) {					 
		console.log("this.inviteConfirm = function(form, doOnSuccess, doOnFailure) {					 ");
		var email = form.email.value;
		var password = form.password_invite.value;
		var full_name = form.full_name_invite.value;
		var username = form.username_invite.value;
		var rego_code = form.rego_code.value;
	   
		if(email != '' && password != '' && full_name != '' && username != '') {
				$.post('data/invite_confirm.php', {email:email, password:password, full_name:full_name, username:username, rego_code:rego_code}, function(data) {
				$("#register_wait").css("display", "none");
				if($(data).find("response_state").attr("success") == 'true') {
					that.email = $(data).find("user").attr("email");
					that.full_name = $(data).find("user").attr("full_name");
					that.username = $(data).find("user").attr("username");
					if(doOnSuccess) {doOnSuccess(that.username);}		
				}
				else if($(data).find("error").attr("error_code") == 'username_exists') {
					if(doOnFailure) {doOnFailure('Sorry, this username has already registered!');}
				}
				else if($(data).find("error").attr("error_code") == 'db_error') {
					if(doOnFailure) {doOnFailure('Sorry, there was a DB Error, please try again later.');}
				}
			});
		}
		else {
			if(doOnFailure) {doOnFailure('Sorry, you must fill in all fields to register!');}							 
		}	 
	}
	   
	this.conversationReply = function(conv_id, reply) {
		console.log("this.conversationReply = function(conv_id, reply) {");
		$("#conversation_reply_button").html('<image id="conversation_reply_wait" src="images/wait_small_white.gif"/>');
		$.post('data/add_conversation_message.php', {conversation_id: conv_id, message: reply}, function(data) {
			that.refreshConversation(conv_id);
		});
	}

	this.conversationNew = function(usernames_or_email, title, message) {
		console.log("this.conversationNew = function(usernames_or_email, title, message) {");
		$('#inbox_tabs').tabs( 'select' , 0 );
		$("#conversation_reply_wait").css("display", "inline");
		$.post('data/add_conversation.php', {users: usernames_or_email, title: title, message: message}, function(data) {
			that.refreshInboxConversations();
		});
	}
	
	this.conversationDelete = function(form) {
		console.log("this.conversationDelete = function(form) {");
		var conversation_ids = '';
		for (i=0; i<form.conversation_id.length; i++) {
			if (form.conversation_id[i].checked==true) {
				conversation_ids += form.conversation_id[i].value + ',';
			}
		}
		$.post('data/delete_conversation.php', {conversation_ids: conversation_ids}, function(data) {
				that.refreshInboxConversations();
		});
	}
	
	this.rssAdd = function(url) {
		console.log("this.rssAdd = function(url) {");
		$.post('data/add_rss.php', {rss: url});
	}
	
	this.refreshConversation = function(conv_id) {
		console.log("this.refreshConversation = function(conv_id) {");
		$('#inbox_tabs').tabs( 'select' , 0 );
		if(this.isLoggedIn()) {
			$("#message-inbox").hide("fast", function() { 
				$("#message-edit").slideDown("fast");	
			});
			
			$.post('data/get_conversation.php', {conversation_id: conv_id}, function(data) {
				var title = $(data).find('conversation').attr("title");
				$("#inbox_conversation").html('<div class="listing_div"><div class="listing_left" style="width: 20%;">&nbsp;</div><div class="listing_main"><h3>' + title + '</h3></div>');
				$(data).find('conversation_message').each(function(j){
					var message = $(this).attr("message");
					var user = $(this).attr("user");
					var timestamp = $(this).attr("timestamp");
					var message_text = '<div class="listing_left" style="width: 20%;">' + user + '<br><div class="listing_sub">' + timestamp + '</div></div><div class="listing_main">' + message + '</div>';
					$('<div class="listing_div"></div>').html(message_text).appendTo("#inbox_conversation");
				});
				$("#inbox_conversation").append('<div class="listing_div"><div class="listing_left" style="width: 20%;">&nbsp;</div><div class="listing_main"><b>Reply: </b><br><form class="fg-form" action="#" name="replyform"><textarea name="reply" class="fg-input ui-corner-all" style="width:400px; height:100px; margin-bottom: 0.4em;"></textarea><br><button id="conversation_reply_button" type="button" class="fg-button ui-corner-all ui-state-default" onclick="application.user.conversationReply(' + conv_id + ', this.form.reply.value);">Send</button></form></div></div>');
			});
		}	
	}
	
	
	this.refreshConversationNew = function(contact_details, type) {
		console.log("this.refreshConversationNew = function(contact_details, type) {");
		$('#inbox_tabs').tabs( 'select' , 0 );
		if(type == 'email' || type == 'username') {
			$("#inbox_conversations").html('<h2 style="margin-left: 155px;">New Conversation</h2><p style="margin-left: 155px;">Between YOU and User ' + contact_details + '</p><hr><div id="conversation_reply" style="margin-left:155px;"><form action="#" name="replyform"><input name="title" style="width:400px;"/><br><textarea name="message" style="width:400px; height:100px;"></textarea><br><input type="button" value="Send" class="button" onclick="application.user.conversationNew(\'' + contact_details + '\', this.form.title.value, this.form.message.value);"><image style="margin: 4px; display:none;" id="conversation_reply_wait" src="images/wait_small.gif"/></form></div> ');
		}
		else if(type == 'text') {
			$("#inbox_conversations").html('<h2 style="margin-left: 155px;">Contact Details</h2><p style="margin-left: 155px;">Contact Deatils: ' + contact_details + '</p>');
		}
		application.panelManager.openInboxWindow();
		
	}
	
	this.refreshInboxConversations = function() {
		console.log("this.refreshInboxConversations = function() {");
		if(this.isLoggedIn()) {
			$("#message-edit").hide("fast", function() { 
				$("#message-inbox").slideDown("fast");
				$("#message-edit").css('display', 'none');
			});
			$.post('data/get_all_conversations.php', {}, function(data) {
				$("#inbox_conversations").html('');
				$(data).find('conversation').each(function(j){
					var title = $(this).attr("title");
					var conversation_id = $(this).attr("conversation_id");
					var participants = $(this).attr("participants");
					var timestamp = $(this).attr("timestamp");
					var last_message = $(this).attr("last_message");
					var read_flag = '';
					if($(this).attr("read_flag") == 0) {var read_flag = '<image src="images/unread_star.jpg"/>';}
					var conversations_text = '<div class="listing_left" style="width: 5%; clear: left;">' + read_flag + '<input name="conversation_id" type="checkbox" value="' + conversation_id + '"/></div><div class="listing_left" style="width: 15%;">' + participants + '<br><div class="listing_sub">' + timestamp + '</div></div><div class="listing_main"><a href="#" onclick="application.user.refreshConversation(' + conversation_id + '); return(false);">' + title + ' &nbsp; &nbsp; (view message)</a><div class="listing_sub">' + last_message + '</div></div>';
					$('<div class="listing_div"></div>').html(conversations_text).appendTo("#inbox_conversations");
				});
			});
		}	   
	}
	
	this.refreshInboxRss = function() {
		console.log("this.refreshInboxRss = function() {");
		/*if(this.isLoggedIn()) {
			$("#news_wait").css("display", "inline");
			$.post('data/get_inbox_rss.php', {}, function(data) {
				$("#news_wait").css("display", "none");
				$("#inbox_rss_feeds").html(' ');
				$(data).find('feed').each(function(j){
					var url = $(this).attr("url");
					var feeds_text = '<div class="listing_left" style="width: 5%; clear: left;"><input type="checkbox"/></div><div class="listing_main" id="inbox_rss_' + j + '" style="width: 85%;"><img src="images/wait_small.gif"/></div>';
					$('<div class="listing_div" style="min-height: 5em;"></div>').html(feeds_text).appendTo("#inbox_rss_feeds");
					
					$.getFeed({
						url: '/rss_proxy/?url=' + url,
						success: function(feed) {
							var feed_text = feed.title + '<ul>';						
							for (var i in feed.items) {
								var item = feed.items[i];
								feed_text += '<li><a href="' + item.link + '">' + item.title + '</a><br>' + item.desc.substring(0, 144) + '</li>'; 
							} 
							feed_text += '</ul>';
							$("#inbox_rss_" + j).html(feed_text).find("ul").ticker("init",{delay:5000,speed:500,linked:true,selection:'li',animations: {_in:'fadeIn',out:'fadeOut'} }).ticker("loop");
						}
					});
				});
			});
		}
		//else document.getElementById('inbox_login_status').innerHTML = '<b style="color: red">You are not logged in, <a href="javascript: application.user.openLoginWindow();">Login</a> </b>';									 
*/
	} 	
	
	this.refreshInboxMarkers = function() {
		console.log("this.refreshInboxMarkers = function() {");
		if(this.isLoggedIn()) {
			$("#resources_wait").css("display", "inline");
			$.getJSON('data/get_markers.php', {format:"json", username: this.username}, function(data) {
				$("#inbox_markers").html(' ');
				$("#resources_wait").css("display", "none");
				
				$.each(data.markers, function(i, marker_args) {	
					//results_found = i + 1;
					//marker_args.point = new GLatLng(parseFloat(marker_args.lat),parseFloat(marker_args.lng));
					var name = marker_args.name;
					var lid = marker_args.lid;
					var desc = marker_args.desc;
					var address = (marker_args.address) ? '<br/>Address: ' + marker_args.address : '';
					var phone = (marker_args.phone) ? '<br/>Phone: ' + marker_args.phone : '';
					var desc = marker_args.desc;
					var markers_text = '<div class="listing_main" style="width: 85%;"><a href="#" onclick="application.panelManager.closeAllPanels(); application.resourceManager.openMarker(' + marker_args.lid + '); return(false);">' + marker_args.name + '</a> (' +  marker_args.subtype_name + ')<div class="listing_sub"><span style="color:#666666">' + marker_args.desc + marker_args.address + marker_args.phone + '</span></div>';							
					$('<div class="listing_div"></div>').html(markers_text).appendTo("#inbox_markers");

				});
			});
			
		}	   
	} 
} 	
			 
			
			 
			 
////////////////////////////////////////////
// AGCApp
/////////////////////////////////////////////
			 
			
function AGCApp() {
	console.log("function AGCApp() {");

	this.current_point = 'NULL';
	
	//create and setup map
	//map = new GMap2(document.getElementById("map_div"));
	var mapOptions = {
		zoom: 14,
		center: new google.maps.LatLng(0,0),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map_div'), mapOptions);
	//map.setCenter(new GLatLng(0, 0), 3);  // set to 0 as load_params in app.html will set with url params
	//bind map clicks to map click controller	
	//GEvent.bind(map, "click", this, this.onMapClick);
	google.maps.event.addListener(map, 'click', this.onMapClick);
	
	this.user = new User(map);
	this.resourceManager = new ResourceManager(map);

	this.panelManager = new PanelManager(map);

	this.panelManager.setHeaderSize();
	
    //map.addControl(new GMapTypeControl());				
	//map.enableScrollWheelZoom();
	//map.enableContinuousZoom();
	
}
	


AGCApp.prototype.onMapClick = function(overlay, point) {
	console.log("AGCApp.prototype.onMapClick = function(overlay, point) {");
	//If Icon clicked, display its basic info...						
	if (overlay && overlay.type) {
			this.resourceManager.current_marker = overlay;
			overlay.openInformationWindow();
	}
	else if (point) {	
			this.current_point = point;
			var current_map_tool = $("#accordion h3").index($("#accordion h3.ui-state-active"));
			if($('#map_dialog_add').dialog('isOpen')) {			
				this.resourceManager.widgetRunSearch({text: '', subtypes: ''});
				
				text = '<div class="info_window">';
				
				if(application.user.isLoggedIn()) {
					text += '<p><b>Add Listing at this location:</b><br/><br/>';
					text += 'Choose a Listing Category from the dropdown list below.</p>';
					text += '<form class="fg-form"><select class="fg-input ui-corner-all" style="width: 100%;" name="subtype" onchange="application.resourceManager.addResource(this.form)">';
					text += '<option>select a type of resource to add...<option/>';
					var optgroup = '';
					for(key in application.resourceManager.marker_types) {						
						if(application.resourceManager.marker_types[key].is_addable == 1) {
							if(application.resourceManager.marker_types[key].type_name === optgroup) { // just print the option
								text += '<option value="' + application.resourceManager.marker_types[key].subtype + '">' + application.resourceManager.marker_types[key].subtype_name + '</option>';
							}
							else { // new optgroup heading
								text += (optgroup === '') ? '' : '</optgroup>';  //close previous optgroup 
								optgroup = application.resourceManager.marker_types[key].type_name;
								text += '<optgroup label="' + optgroup + '"><option value="' + application.resourceManager.marker_types[key].subtype + '">' + application.resourceManager.marker_types[key].subtype_name + '</option>';
							}
						}
					}
					text += '</optgroup></select></form><br/><br/><strong>Not the right location?</strong>  Click the map to change location, or provide extra detail to the address field.';
				}
				else {
					text += '<p><b>Add Anonymous Listing at this location:</b><br/><br/>';
					text += 'Choose a Listing Category from the dropdown list below.</p>';
					text += '<form class="fg-form"><select class="fg-input ui-corner-all" style="width: 100%;" name="subtype" onchange="application.resourceManager.addResource(this.form)">';
					text += '<option>select a type of resource to add...<option/>';
					var optgroup = '';
					for(key in application.resourceManager.marker_types) {						
						if(application.resourceManager.marker_types[key].is_addable == 1) {
							if(application.resourceManager.marker_types[key].type === optgroup) { // just print the option
								text += '<option value="' + application.resourceManager.marker_types[key].subtype + '">' + application.resourceManager.marker_types[key].subtype_name + '</option>';
							}
							else { // new optgroup heading
								text += (optgroup === '') ? '' : '</optgroup>';  //close previous optgroup 
								optgroup = application.resourceManager.marker_types[key].type;
								text += '<optgroup label="' + optgroup + '"><option value="' + application.resourceManager.marker_types[key].subtype + '">' + application.resourceManager.marker_types[key].subtype_name + '</option>';
							}
						}
					}
					text += '</optgroup></select></form><br/><a href="#" onclick="application.panelManager.openLoginWindow(); return(false);">Login</a> or <a href="#" onclick="application.panelManager.openHomeWindow(); return(false);">Sign Up</a> to add a listing that you can track and manage..<br/><br/><strong>Not the right location?</strong>  Click the map to change location, or provide extra detail to the address field.';		
					
				}
				map.openInfoWindowHtml(point, text);  
			}
			else if($('#map_dialog_yvih').dialog('isOpen')) {
				application.resourceManager.YVIHPopup();
			}
	}


}		
			  
	


function stopRKey(evt) {
	console.log("function stopRKey(evt) {");
	var evt = (evt) ? evt : ((event) ? event : null);
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if ((evt.keyCode == 13) && (node.type=="text")) {return false;}
} 

var application; //set as global through load func

var load = function load() {
	console.log("var load = function load() {");
	//<![CDATA[
	if (true || GBrowserIsCompatible()) {
			// set as global
			application = new AGCApp();	
			// init geocoder for use by the showAddress function...
			//this.geocoder = new GClientGeocoder();	
			this.geocoder = new google.maps.Geocoder();
			
			//document.onkeypress = stopRKey;

			// hide error as app should have loaded...
			$("#error_load_message").css("display", "none");

	}
	else {
			alert("Sorry, the Google Maps API is not compatible with this browser");
	}
	//]]>
}
			

	

