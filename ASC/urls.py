from django.conf.urls import patterns, include, url
from DB.views import mainpage
from django.contrib import admin
from DB.views import exportmailslisttoexcel
from DB.views import getmailslist

from DB.views import redirecttomain
from DB.views import help
from DB.views import testfunc


#====================================NEW DESIGN==========================
#COMMON:
from DB.views import change_one_field
from DB.views import get_one_field
#AUTH:
from DB.views import logon
from DB.views import login
from DB.views import logout
#COMPANIES:
from DB.views import company_show_page
from DB.views import company_company_data_page
from DB.views import company_edit_or_add
from DB.views import company_show_manager_work_content
from DB.views import company_company_data_content
from DB.views import company_manager_work_call_task
from DB.views import company_remove
from DB.views import company_managers

from DB.views import companies_show_page
from DB.views import companies_list
from DB.views import companies_full_list_show_page
from DB.views import companies_full_list
from DB.views import companies_full_list_make_companies_free
from DB.views import companies_full_list_transfer_companies_to
from DB.views import companies_full_list_distribute_city
#CALLS
from DB.views import calls_list
from DB.views import call_get
#ARTISTS
from DB.views import artist_allowed_artists_list
#TASKS
from DB.views import tasks_show_page
from DB.views import tasks_get_in_daterange
from DB.views import tasks_get_frame_counters
from DB.views import tasks_list
from DB.views import tasks_get_task
#EVENTS
from DB.views import events_show_page
from DB.views import events_get_in_daterange
from DB.views import events_get_frame_counters
from DB.views import events_add_event
from DB.views import events_add_presentator_event
from DB.views import events_remove_presentator_event
from DB.views import events_get_presentator_event_data
from DB.views import events_list
from DB.views import events_get_event_data
from DB.views import events_edit_event
from DB.views import events_get_allowed_managers
from DB.views import events_load_presentators_list
#CONTROL
from DB.views import control_show_page
#CONTROL: USERS
from DB.views import control_users_list
from DB.views import control_users_user_data
from DB.views import control_users_user_options_data
from DB.views import control_users_user_options_edit
from DB.views import control_users_user_individual_options_data
from DB.views import control_users_user_individual_options_edit
from DB.views import control_users_add
from DB.views import control_users_send_data
from DB.views import control_users_lock
from DB.views import control_users_fast_pass_change
from DB.views import control_users_remove
#STATS
from DB.views import stats_show_page
from DB.views import control_stats_allowed_cities
from DB.views import control_stats_allowed_artists
from DB.views import control_stats_get_stats_data
#CONTROL: LISTS
#CITIES
from DB.views import control_lists_cities
from DB.views import control_lists_city_add
from DB.views import control_lists_city_edit
from DB.views import control_lists_city_remove
from DB.views import control_lists_city_change_status
#CONTROL: LISTS
#ARTISTS
from DB.views import control_lists_artist_paginator
from DB.views import control_lists_artist_data
from DB.views import control_lists_artist_add
from DB.views import control_lists_artist_remove
from DB.views import control_lists_artist_edit
#CONTROL: AGGREGATOR
from DB.views import control_aggregator
#CONTROL: OPTIONS
from DB.views import control_options_load
from DB.views import control_options_save
#CONTROL: UNLOAD
from DB.views import control_unload_events
#LOGS
from DB.views import logs_history
from DB.views import logs_log_data
#Chat
from DB.views import chat_add_message
from DB.views import chat_show_messages
#COMBINERS
from DB.views import combiners_exe
#Users
from DB.views import manager_manager_list
from DB.views import manager_add_company_to_manager
from DB.views import manager_allowed_shows
from DB.views import manager_steal_company
from DB.views import manager_allowed_shows_for_company
from DB.views import manager_get_manager_own_data

#MAIN:
from DB.views import main_load_allowed_shows_to_header
from DB.views import main_change_admin_mode

#HELP
from DB.views import help_send_email_to_admin

#JSON DATA
from DB.views import manager_get_manager_companies_search
from DB.views import api_all
from DB.views import api_admin
from DB.views import individual_script



admin.autodiscover()

urlpatterns = patterns('',
    (r'^admin/', include(admin.site.urls)),
    (r'^main/$', mainpage),
    (r'exportmailslisttoexcel/$', exportmailslisttoexcel),
    (r'getmailslist/$', getmailslist),

    (r'^help/$', help),
    (r'^$', redirecttomain),
    (r'testfunc', testfunc),
#====================================NEW DESIGN==========================
#COMMON
    ('^aj_change_one_field/$', change_one_field),
    ('^aj_get_one_field/$', get_one_field),
#AUTH:
    (r'^logon/$', logon),
    (r'^aj_logging/$', login),
    (r'^logout/$', logout),
#COMPANIES
    (r'^client/(\d+)/$', company_show_page),
    (r'^aj_updated_company_data/$', company_company_data_page),
    (r'aj_company_edit_or_add/$', company_edit_or_add),
    (r'aj_company_manager_work/$', company_show_manager_work_content),
    (r'aj_company_company_data_content/$', company_company_data_content),
    (r'aj_company_manager_work_mark_call_and_add_task/$', company_manager_work_call_task),
    (r'aj_company_remove/$', company_remove),
    (r'aj_company_managers/$', company_managers),

    (r'clients/$', companies_show_page),
    (r'aj_clients_list/$', companies_list),
    (r'full/$', companies_full_list_show_page),
    (r'aj_full_list/$', companies_full_list),
    (r'aj_make_companies_free', companies_full_list_make_companies_free),
    (r'aj_transfer_companies_to', companies_full_list_transfer_companies_to),
    (r'aj_distribute_city', companies_full_list_distribute_city),
#CALLS
    (r'aj_calls_list/$', calls_list),
    (r'aj_call_get/$', call_get),
#ARTISTS
    (r'aj_artist_allowed_artists_list/$', artist_allowed_artists_list),
#TASKS
    (r'tasks/$', tasks_show_page),
    (r'aj_tasks_get_in_daterange/$', tasks_get_in_daterange),
    (r'aj_tasks_get_frame_counters', tasks_get_frame_counters),
    (r'aj_tasks_list/$', tasks_list),
    (r'aj_tasks_get_task/$', tasks_get_task),
#EVENTS
    (r'events/$', events_show_page),
    (r'aj_events_get_in_daterange/$', events_get_in_daterange),
    (r'aj_events_get_frame_counters/$', events_get_frame_counters),
    (r'aj_events_add_event/$', events_add_event),
    (r'aj_events_add_presentator_event/$', events_add_presentator_event),
    (r'aj_events_get_presentator_event_data/$', events_get_presentator_event_data),
    (r'aj_events_load_presentators_list/$', events_load_presentators_list),
    (r'aj_events_remove_presentator_event/$', events_remove_presentator_event),
    (r'aj_events_get_event_data/$', events_get_event_data),
    (r'aj_events_edit_event/$', events_edit_event),
    (r'aj_events_get_allowed_managers/$', events_get_allowed_managers),
    (r'aj_events_list/$', events_list),
#CONTROL
    (r'control/$', control_show_page),
    (r'stats/$', stats_show_page),
#CONTROL: USERS
    (r'aj_users_list/$', control_users_list),
    (r'aj_user_data/$', control_users_user_data),
    (r'aj_user_options_get/$', control_users_user_options_data),
    (r'aj_user_options_edit/$', control_users_user_options_edit),
    (r'aj_user_individual_options_get/$', control_users_user_individual_options_data),
    (r'aj_user_individual_options_edit/$', control_users_user_individual_options_edit),
    (r'aj_control_users_send_data/$', control_users_send_data),
    (r'aj_users_add/$', control_users_add),
    (r'aj_users_lock/$', control_users_lock),
    (r'aj_users_fastpasschange/$', control_users_fast_pass_change),
    (r'aj_control_users_remove/$', control_users_remove),
#CONTROL: STATS
    (r'aj_control_stats_allowed_cities/$', control_stats_allowed_cities),
    (r'aj_control_stats_allowed_artists/$', control_stats_allowed_artists),
    (r'aj_control_stats_get_stats_data/$', control_stats_get_stats_data),
#CONTROL: LISTS
    (r'aj_control_lists_cities/$', control_lists_cities),
    (r'aj_control_lists_city_add/$', control_lists_city_add),
    (r'aj_control_lists_city_edit/$', control_lists_city_edit),
    (r'aj_control_lists_city_remove/$', control_lists_city_remove),
    (r'aj_control_lists_city_change_status/$', control_lists_city_change_status),
    (r'aj_control_lists_artist_paginator/$', control_lists_artist_paginator),
    (r'aj_control_lists_artist_data/$', control_lists_artist_data),
    (r'aj_control_lists_artist_add/$', control_lists_artist_add),
    (r'aj_control_lists_artist_remove/$', control_lists_artist_remove),
    (r'aj_control_lists_artist_edit/$', control_lists_artist_edit),
#CONTROL: AGGREGATOR
    (r'aj_control_aggregator/$', control_aggregator),
#CONTROL: OPTIONS
    (r'aj_control_options_load/$', control_options_load),
    (r'aj_control_options_save/$', control_options_save),
#CONTROL: UNLOAD
    (r'aj_unload_events_list/$', control_unload_events),
#LOGS
    (r'aj_logs_log_data/$', logs_log_data),
    (r'aj_logs_history/$', logs_history),
#CHAT
    (r'aj_chat_add_message/$', chat_add_message),
    (r'aj_chat_show_messages/$', chat_show_messages),
#USERS
    (r'aj_manager_manager_list/$', manager_manager_list),
    (r'aj_manager_add_company_to_manager/$', manager_add_company_to_manager),
    (r'aj_manager_allowed_shows/$', manager_allowed_shows),
    (r'aj_manager_steal_company/$', manager_steal_company),
    (r'aj_manager_allowed_shows_for_company/$', manager_allowed_shows_for_company),
    (r'aj_manager_get_manager_own_data/$', manager_get_manager_own_data),
#MAIN
    (r'aj_main_load_allowed_shows_to_header/$', main_load_allowed_shows_to_header),
    (r'aj_main_change_admin_mode/$', main_change_admin_mode),
#HELP
    (r'aj_help_send_email_to_admin/$', help_send_email_to_admin),
#JSON DATA
    (r'aj_manager_get_manager_companies_search/$', manager_get_manager_companies_search),
    (r'aj_api_all/$', api_all),
    (r'aj_api_admin/$', api_admin),
    (r'aj_admin_script/$', individual_script),


    (r'combiners_exe/$', combiners_exe),
#EVERY STRING
    (r'.*/$', mainpage),

)
