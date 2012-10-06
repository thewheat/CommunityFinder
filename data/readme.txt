Web Services Files...

bootstrap.php : bootstrap config included by web service xml interfaces - (sets db / server vars etc...)


# ! denotes mysqli interface upgraded
# > good xml

# Listing services
! icons.xml
! add_resource.php :  TODO:  Change query, currently only adds half of fields, should be all or none, whole process change?
! delete_resource.php
! update_resource.php
! get_markers.php


# autocompletes
! autocomplete_search.php
! autocomplete_tags.php


# Login / Logout / Register
! login.php
! logout.php
! is_logged_in.php
! register.php
  register_confirm.php
  invite_confirm.php


# Inbox Conversations
  add_conversation.php
  add_conversation_message.php
!  delete_conversation.php : sets delete=1 on multiple conversation_to_user for id  
  get_all_conversations.php
  get_conversation.php


# Inbox Rss
  get_inbox_rss.php
! add_rss.php : adds rss to users inbox rss feeds


# PROFILE

!> get_profile.php gets all data for a profile...

