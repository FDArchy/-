__author__ = 'Артем'
import datetime
from django import template
from  DB.models import Manager, Task, SiteUser, City, CMSILink, Presentator, Artist

def todaytasks(request):

    is_manager = True;
    currentTasks = None;
    if(request.user.has_perm("DB.can_work_with_db")):
        is_manager = True;
        task_manager = Manager.objects.get(username = request.user.username)
        currentTasks = Task.objects.all().filter(manager = task_manager.id).filter(datetime__year = datetime.date.today().year, datetime__month = datetime.date.today().month, datetime__day = datetime.date.today().day)
    else:
        is_manager = False;

    is_superuser = False
    if(request.user.is_superuser):
        is_superuser = True
    return {'currentTasks': currentTasks,'is_manager': is_manager, 'is_superuser':is_superuser}


def filterPanel(request):
    suser = SiteUser.objects.get(user = request.user)
    allowedCities = None
    allowedArtists = None
    #choosenCity = 0
    #choosenArtist = 0
   # if(request.user.has_perm("DB.is_siteadmin")):
       # allowedCities = City.objects.all()
        #allowedArtists = Artist.objects.all()

   # else:
        #if(request.user.has_perm("DB.can_work_with_db")):
           # allowedCities = City.objects.filter(id__in = CMSILink.objects.all().filter(manager__username = request.user.username).values("company__city"))
            #allowedArtists = Artist.objects.filter(id__in = CMSILink.objects.all().filter(manager__username = request.user.username).values("show"))
       # else:
            #presentator = Presentator.objects.get(siteuser = suser)
           # allowedCities = City.objects.filter(id__in =  presentator.cities.all)
            #allowedArtists = Artist.objects.filter(id__in = presentator.artists.all)

    #if(suser.city != None):
      #  choosenCity  = suser.city.id
   # if(suser.artist != None):
       # choosenArtist  = suser.artist.id

    currentUser = suser.name

    return {'currentUser':currentUser}#'allowedArtists': allowedArtists, 'allowedCities': allowedCities,'choosenCity':choosenCity, 'choosenArtist':choosenArtist, }