__author__ = 'Артем'
import datetime
from django import template
from DB.models import Manager, Task, SiteUser, City, CMSILink, PCSLink, Presentator, Artist
from DB.views import user_is_admin, user_is_manager
from DB.views import get_worked_cities
from DB.views import get_user_options_from_db
from DB.views import fill_manager_cities_list
from DB.views import get_current_user_type
from DB.views import get_current_presentator
def main_options(request):
    if(not request.user.is_authenticated()):
        return {}
    try:
        site_user = SiteUser.objects.get(user = request.user)
    except:
        return {"error": "Пользователь не найден"}
    choosen_city = 0
    choosen_show = 0
    admin_mode = site_user.options.admin_mode
    cities_changed = site_user.options.cities_changed
    if (site_user.type == "a" and admin_mode):
        cities = City.objects.filter(id__in = get_worked_cities())
        if (cities_changed):
            fill_manager_cities_list(site_user.manager.id)
    elif site_user.type == "m" or site_user.type == "a":
        manager = Manager.objects.get(siteuser = SiteUser.objects.get(user = request.user))
        if(cities_changed):
            fill_manager_cities_list(manager.id)
        cities = manager.cities_buf.all()
    else:
        cities = City.objects.filter(id__in = PCSLink.objects.filter(presentator = get_current_presentator(request)).values("city__id"))
    if (not cities_changed and request.COOKIES.get("choosenCity")):
            if request.COOKIES.get("choosenCity") != "0":
                choosen_city = City.objects.get(id = request.COOKIES.get("choosenCity"))
            else:
                choosen_city = {}
                choosen_city["id"] = 0
            if request.COOKIES.get("choosenShow"):
                if request.COOKIES.get("choosenShow") != "0":
                    choosen_show = Artist.objects.get(id=request.COOKIES.get("choosenShow"))
    if(cities.count() == 1):
        choosen_city = cities[0]
    user_type = get_current_user_type(_request=request)
    options = get_user_options_from_db(_request = request, _user = False, _individual = True)
    return {'currentUser':site_user, 'cities': cities, 'choosen_city':choosen_city, 'choosen_show':choosen_show, 'admin_mode': admin_mode, "cities_changed": cities_changed, "options": options, "user_type": user_type}