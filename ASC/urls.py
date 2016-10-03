
from django.conf.urls import patterns, include, url
from DB.views import mainpage
from django.contrib import admin
from DB.views import addcompany
from DB.views import savecompany
from DB.views import editcompany
from DB.views import showcompanyupdate
from DB.views import fillcalendar
from DB.views import geteventdata
from DB.views import showfullcompanieslist
from DB.views import getcompaniesdata
from DB.views import getcompanydataforantidouble
from DB.views import showcompaniesnew
from DB.views import companiesnewdata
from DB.views import choosecompanies
from DB.views import exportmailslisttoexcel
from DB.views import getmailslist
from DB.views import addPresentatorEvent
from DB.views import addPresentatorEventSave
from DB.views import getpresentatorslist
from DB.views import deletePresentatorEvent
from DB.views import deletecompanies

from DB.views import showcompany

from DB.views import showtasksnew
from DB.views import ajaxgettodaytasks
from DB.views import ajaxgettaskslist
from DB.views import ajaxchangetaskstatus
from DB.views import ajaxchangecallstatus
from DB.views import calendar
from DB.views import saveevent
from DB.views import showevents
from DB.views import showevent
from DB.views import editcrash
from DB.views import redirecttomain
from DB.views import help
from DB.views import statspanel
from DB.views import saveartisttcomment
from DB.views import editEvent
from DB.views import deleteevent
from DB.views import ajaxgetcompanydata
from DB.views import cmsLinkReturn
from DB.views import changePermission



from DB.views import  statsajax
from  DB.views import companiescontrol
from  DB.views import ajaxTasksHistory
from  DB.views import ajaxCallsHistory
from  DB.views import ajaxMarkCallAddTask
from DB.views import testfunc


#====================================NEW DESIGN==========================
#AUTH:
from DB.views import logon
from DB.views import login
from DB.views import logout
#COMPANIES:
from DB.views import showcompany_new
from DB.views import din_working_company_content

admin.autodiscover()

urlpatterns = patterns('',
    (r'^main/$', mainpage),
    (r'^admin/', include(admin.site.urls)),
    (r'^addcompany/$', addcompany),    
    (r'^savecompany/$', savecompany),
    (r'^editcompany/$', editcompany),
    (r'showcompanyupdate', showcompanyupdate),
    (r'fillcalendar', fillcalendar),
    (r'geteventdata', geteventdata),
    (r'editevent', editEvent),
    (r'ajaxdeleteevent', deleteevent),
    (r'ajaxgetcompanydata', ajaxgetcompanydata),
    (r'^showfullcompanieslist/$', showfullcompanieslist),
    (r'showcompaniesnew/$', showcompaniesnew),
    (r'companiesnewdata/$', companiesnewdata),
    (r'choosecompanies/$', choosecompanies),
    (r'exportmailslisttoexcel/$', exportmailslisttoexcel),
    (r'getmailslist/$', getmailslist),
    (r'addPresentatorEvent/$', addPresentatorEvent),
    (r'addPresentatorEventSave/$', addPresentatorEventSave),
    (r'getpresentatorslist', getpresentatorslist),
    (r'deletePresentatorEvent/$', deletePresentatorEvent),
    (r'^getcompaniesdata/$', getcompaniesdata),
    (r'getcompanydataforantidouble/$', getcompanydataforantidouble),
    (r'^deletecompanies/$', deletecompanies),
    (r'^company/(\d+)/$', showcompany),

    (r'^showtasksnew$',showtasksnew),
    (r'^ajaxgettodaytasks',ajaxgettodaytasks),
    (r'^ajaxgettaskslist',ajaxgettaskslist),
    (r'^ajaxchangetaskstatus',ajaxchangetaskstatus),
    (r'^ajaxchangecallstatus',ajaxchangecallstatus),

    (r'^showevents/page/(\d+)/$', showevents),
    (r'^event/(\d+)/$', showevent),
    (r'^saveevent/$', saveevent),
    (r'^editcrash/$', editcrash),
    (r'^calendar/$', calendar),
    (r'^help/$', help),
    (r'^statspanel/$', statspanel),
    (r'^statsajax', statsajax),
    (r'^saveartistcomment/$', saveartisttcomment),
    (r'^$', redirecttomain),


    (r'cmsLinkReturn', cmsLinkReturn),
    (r'changePermission', changePermission),
    (r'companiescontrol', companiescontrol),
    (r'ajaxtaskhistory', ajaxTasksHistory),
    (r'ajaxcallhistory', ajaxCallsHistory),
    (r'ajaxmarkcall', ajaxMarkCallAddTask),
    (r'testfunc', testfunc),
#====================================NEW DESIGN==========================
#AUTH:
    (r'^logon/$', logon),
    (r'^logging/$', login),
    (r'^logout/$', logout),
#COMPANIES
    (r'^company_new/(\d+)/$', showcompany_new),
    (r'aj_workingcompanycontent/$', din_working_company_content),

    # Examples:
    # url(r'^$', 'ASC.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    

)
