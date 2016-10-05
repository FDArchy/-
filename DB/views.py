from django.http import HttpResponse
from django.contrib.auth.decorators import login_required, user_passes_test
from django.shortcuts import render_to_response, redirect
from django.template import RequestContext
from django.core.exceptions import ObjectDoesNotExist
from DB.models import Company, Manager, Task, Artist, Event, SiteUser, City, Call, CMSILink, Presentator, PresentatorEvent

from django.contrib import auth
from django.core.paginator import Paginator
import logging
from datetime import datetime
from datetime import timedelta
import  os
import json
from django.utils import timezone
from django.core.servers.basehttp import FileWrapper
from django.db.models import Q

#Сторонние библиотеки
import xlsxwriter
import openpyxl #На продакшн сервере не нужна
from openpyxl import load_workbook


def user_is_manager(user):
    return user.is_authenticated() and user.has_perm("DB.can_work_with_db")

#MAINPAGE=======================================================================
@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def mainpage(request):
    return redirect('/showcompaniesnew')
#===============================================================================

#COMPANIES======================================================================
@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def addcompany(request):    
    suser = SiteUser.objects.get(user = request.user)
    cities = City.objects.all()
    artists = Artist.objects.all()
    return render_to_response('html/companies/addcompany.html', {'cities':cities, 'artists':artists}, context_instance=RequestContext(request) )

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def savecompany(request):

    company = Company(
    ctype = noneToEmptyString(request.POST.get('companytype')),
    name = noneToEmptyString(request.POST.get('name')),
    adress=noneToEmptyString(request.POST.get('adress')),
    city = City.objects.get(id = request.POST.get('city')),
    telephone=noneToEmptyString(request.POST.get('telephone')),
    contacts=noneToEmptyString(request.POST.get('contact')),
    comment = noneToEmptyString(request.POST.get('comment')),
    email = noneToEmptyString(request.POST.get('email')),
    site = noneToEmptyString(request.POST.get('site')))
    company.save()
    
    
    
    for check in request.POST.getlist('checks[]'):
        try:
            cmsilink = CMSILink.objects.get(manager = Manager.objects.get(username = request.user.username), show = check)
            cmsilink.company.add(company)
        except ObjectDoesNotExist:
            newCmsilink = CMSILink(manager = Manager.objects.get(username = request.user.username), show = Artist.objects.get(id = check))
            newCmsilink.save()
            newCmsilink.company.add(company)

    #writelog(str(request.user.id), "Adding company", str(request.GET.get('name')))
    return redirect('/showcompaniesnew')

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def showcompaniesnew(request):
    cities = City.objects.filter(id__in = CMSILink.objects.filter(manager__username = request.user.username).values("company__city__id"))
    artists = Artist.objects.filter(id__in = CMSILink.objects.filter(manager__username = request.user.username).values("show__id"))

    citiesData = []
    for city in cities:
        dictItem = {}
        dictItem["id"] = city.id
        dictItem["name"] = city.name
        companiesCount = Company.objects.filter(city = city.id).count()
        dictItem["count"] = companiesCount

        if companiesCount != 0:
            citiesData.append(dictItem)
    return render_to_response('html/companies/showcompaniesnew.html', {'cities':citiesData, 'allcities':City.objects.all().order_by("name"), 'allartists':Artist.objects.all(), 'artists':artists}, context_instance=RequestContext(request))
def companiesnewdata(request):
    if request.POST.get("cityID") == None:
        return "NoneValue"
    if request.POST.get("artistID") == None:
        return  "NoneValue"
    if request.POST.get("search") != "":
        searchString = request.POST.get("search")
    else:
        searchString = False
    if request.POST.get("page") == None or request.POST.get("page") == "null" or request.POST.get("page") == "undefined":
        currentPage = 1
    else:
        currentPage = int(request.POST.get("page"))
    companiesOnPageCount = int(request.POST.get("elementsCount"))

    cityID = request.POST.get("cityID")
    artistID = request.POST.get("artistID")

    manager = Manager.objects.get(username = request.user.username)
    cmsilink = CMSILink.objects.filter(show = artistID, manager = manager)

    allowedCompanies = cmsilink[0].company.all


    if(searchString):
        pages = CalculatePages(Company.objects.filter(id__in = allowedCompanies, city__id = cityID, name__icontains = searchString).count(), companiesOnPageCount, currentPage)
    else:
        pages = CalculatePages(Company.objects.filter(id__in = allowedCompanies, city__id = cityID).count(), companiesOnPageCount, currentPage)
    companies = []

    if(searchString):
        companies = Company.objects.filter(Q(id__in = allowedCompanies), Q(city__id = cityID), Q(name__icontains = searchString) | Q(adress__icontains = searchString)).order_by("id")[pages["startElement"]:pages["endElement"]]
    else:
        companies = Company.objects.filter(id__in = allowedCompanies, city__id = cityID).order_by("name")[pages["startElement"]:pages["endElement"]]




    tasks = Task.objects.filter(company__in = companies, manager = manager, artist = artistID)
    calls = Call.objects.filter(company__in = companies, artist = artistID)
    events = Event.objects.filter(company__in = companies, artist = artistID)
    filtredCompanies = []

    for company in companies:
        dictItem = {}
        dictItem["id"] = company.id
        dictItem["name"] = company.name
        dictItem["adress"] = company.adress
        dictItem["ctype"] = company.ctype

        dictItem["lastcall"] = Call.objects.filter(company = company.id).order_by("-datetime")[:1]

        if(tasks.filter(company = company.id).order_by("-datetime").count() != 0):
            if tasks.filter(company = company.id).order_by("-datetime")[0].datetime >= timezone.now():
                dictItem["lasttask"] = tasks.filter(company = company.id, datetime__gte = timezone.now()).order_by("datetime")[:1]
            else:
                dictItem["lasttask"] = tasks.filter(company = company.id, datetime__lte = timezone.now()).order_by("-datetime")[:1]
        else:
            dictItem["lasttask"] = ""
        if(events.filter(company = company.id).count() != 0):
            if events.filter(company = company.id).order_by("-startTime")[0].startTime >= timezone.now():
                dictItem["lastevent"] = events.filter(company = company.id, startTime__gte = timezone.now()).order_by("startTime")[:1]
            else:
                dictItem["lastevent"] = events.filter(company = company.id, startTime__lte = timezone.now()).order_by("-startTime")[:1]
        else:
            dictItem["lastevent"] = ""

        filtredCompanies.append(dictItem)

    return  render_to_response('html/companies/showcompaniesnewgetcompanydata.html', {'filtredCompanies':filtredCompanies, 'page':pages}, context_instance=RequestContext(request))
def choosecompanies(request):
    link = CMSILink.objects.filter(manager = Manager.objects.get(username = request.user.username)).values("company__city__id")
    cities = City.objects.filter(id__in = link)

    return render_to_response('html/companies/modalSelectionChoose.html', {'cities':cities})
def getpresentatorslist(request):
    city = int(request.POST.get("city"))
    if request.user.has_perm("DB.is_siteadmin"):
        presentators = Presentator.objects.filter(cities = city)
    else:
        if request.user.has_perm("DB.can_work_with_db"):
            link = CMSILink.objects.filter(manager = Manager.objects.get(username = request.user.username), company__city__id = city).values("show__id").distinct()
            if request.POST.get('artist'):
                presentators = Presentator.objects.filter(cities = city, artists__in = request.POST.get('artist')).distinct()
            else:
                presentators = Presentator.objects.filter(cities = city, artists__in = link).distinct()

    if presentators.count() != 0:
        return render_to_response('html/companies/getpresentatorslist.html', {'presentators':presentators})
    else:
        return HttpResponse("");
def showfullcompanieslist(request):
    cities = City.objects.all()
    artists = Artist.objects.all()

    citiesData = []
    for city in cities:
        dictItem = {}
        dictItem["id"] = city.id
        dictItem["name"] = city.name
        companiesCount = Company.objects.filter(city = city.id).count()
        dictItem["count"] = companiesCount

        if companiesCount != 0:
            citiesData.append(dictItem)


    return render_to_response('html/companies/showfullcompanieslist.html', {'cities':citiesData, 'artists':artists}, context_instance=RequestContext(request))
def getcompaniesdata(request):
    if request.POST.get("cityID") == None:
        return "NoneValue"
    if request.POST.get("artistID") == None:
        return  "NoneValue"
    if request.POST.get("search") != "":
        searchString = request.POST.get("search")
    else:
        searchString = False
    if request.POST.get("page") == None or request.POST.get("page") == "null" or request.POST.get("page") == "undefined":
        currentPage = 1
    else:
        currentPage = int(request.POST.get("page"))
    companiesOnPageCount = int(request.POST.get("elementsCount"))

    cityID = request.POST.get("cityID")
    artistID = request.POST.get("artistID")
    if(searchString):
        pages = CalculatePages(Company.objects.filter(city__id = cityID, name__icontains = searchString).count(), companiesOnPageCount, currentPage)
    else:
        pages = CalculatePages(Company.objects.filter(city__id = cityID).count(), companiesOnPageCount, currentPage)
    companies = []

    if(searchString):
        companies = Company.objects.filter(city__id = cityID, name__icontains = searchString).order_by("name")[pages["startElement"]:pages["endElement"]]
    else:
        companies = Company.objects.filter(city__id = cityID).order_by("name")[pages["startElement"]:pages["endElement"]]


    cmsilinks = CMSILink.objects.filter(show = artistID)
    tasks = Task.objects.filter(company__in = companies, artist = artistID)
    calls = Call.objects.filter(company__in = companies, artist = artistID)
    events = Event.objects.filter(company__in = companies, artist = artistID)
    filtredCompanies = []

    for company in companies:
        dictItem = {}
        dictItem["id"] = company.id
        dictItem["name"] = company.name
        dictItem["adress"] = company.adress
        dictItem["lastcall"] = calls.filter(company = company.id).order_by("-datetime")[:1]
        if events.filter(company = company.id, startTime__gte = datetime.now()).order_by("startTime")[:1].count() != 0:
            dictItem["lastevent"] = events.filter(company = company.id, startTime__gte = datetime.now()).order_by("startTime")[:1]
        else:
            dictItem["lastevent"] = events.filter(company = company.id, startTime__lte = datetime.now()).order_by("-startTime")[:1]

        links = CMSILink.objects.filter(company__id = company.id, show = artistID)
        tmplist = []
        for link in links:
            tmplist.append(link.manager.name)
        dictItem["managers"] = tmplist
        filtredCompanies.append(dictItem)

    return  render_to_response('html/companies/getcompaniesdata.html', {'filtredCompanies':filtredCompanies, 'page':pages}, context_instance=RequestContext(request))
def getcompanydataforantidouble(request):
    if request.POST.get("cityID") == None:
        return "NoneValue"
    if request.POST.get("search") != "":
        searchString = request.POST.get("search")
    else:
        searchString = False
    if request.POST.get("page") == None or request.POST.get("page") == "null" or request.POST.get("page") == "undefined":
        currentPage = 1
    else:
        currentPage = int(request.POST.get("page"))
    companiesOnPageCount = int(request.POST.get("elementsCount"))

    cityID = request.POST.get("cityID")
    if(searchString):
        pages = CalculatePages(Company.objects.filter(city__id = cityID, name__icontains = searchString).count(), companiesOnPageCount, currentPage)
    else:
        pages = CalculatePages(Company.objects.filter(city__id = cityID).count(), companiesOnPageCount, currentPage)
    companies = []

    if(searchString):
        companies = Company.objects.filter(city__id = cityID, name__icontains = searchString).order_by("name")[pages["startElement"]:pages["endElement"]]
    else:
        companies = Company.objects.filter(city__id = cityID).order_by("name")[pages["startElement"]:pages["endElement"]]


    cmsilinks = CMSILink.objects.filter(company__in = companies)
    artists = Artist.objects.all()
    tasks = Task.objects.filter(company__in = companies, artist = artistID)
    calls = Call.objects.filter(company__in = companies, artist = artistID)
    events = Event.objects.filter(company__in = companies, artist = artistID)
    filtredCompanies = []

    for company in companies:
        dictItem = {}
        dictItem["id"] = company.id
        dictItem["name"] = company.name
        dictItem["adress"] = company.adress
        dictItem["controlData"] = {}
        for artist in artists:
            dictItem["controlData"]["artist"] = artist.id
            #dictItem["controlData"]["lastcall"]

            """
        dictItem["lastcall"] = calls.filter(company = company.id).order_by("-datetime")[:1]
        if events.filter(company = company.id, startTime__gte = datetime.now()).order_by("startTime")[:1].count() != 0:
            dictItem["lastevent"] = events.filter(company = company.id, startTime__gte = datetime.now()).order_by("startTime")[:1]
        else:
            dictItem["lastevent"] = events.filter(company = company.id, startTime__lte = datetime.now()).order_by("-startTime")[:1]

        links = CMSILink.objects.filter(company__id = company.id, show = artistID)
        tmplist = []
        for link in links:
            tmplist.append(link.manager.name)
        dictItem["managers"] = tmplist
        filtredCompanies.append(dictItem)"""

    return  render_to_response('html/companies/getcompaniesdata.html', {'filtredCompanies':filtredCompanies, 'page':pages}, context_instance=RequestContext(request))
def deletecompanies(request):

    companiesList = (request.POST.get('changedList')).split(',')
    for company in companiesList:
        currentCompany = Company.objects.get(id = company)
        currentCompany.delete()
    return HttpResponse("success")

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def showcompany(request, company_number):
    try:
        company = Company.objects.get(id = company_number)
    except Company.DoesNotExist:
        company = None
    if(company == None):
        return redirect('/showcompaniesnew')

    user = SiteUser.objects.get(user = request.user)
    manager = Manager.objects.get(username = request.user.username)
    tasks = Task.objects.filter(manager = manager.id, company = company.id)
    #artists = Artist.objects.filter(id__in = CMSILink.objects.filter(company = company, manager = manager).values("show__id"))

    if(request.GET.get("artist") != None):
        artists = Artist.objects.filter(id = request.GET.get("artist"))
        last_event = Event.objects.filter(company = company.id, startTime__lte = datetime.now(), artist = artists[0]).order_by("-startTime")[:1]
        next_event = Event.objects.filter(company = company.id, startTime__gte = datetime.now(), artist = artists[0]).order_by("startTime")[:1]
    else:
        links = CMSILink.objects.filter(manager = Manager.objects.get(username = request.user.username), company__id = company.id).values("show_id")
        artists = Artist.objects.filter(id__in = links)
        last_event = Event.objects.filter(company = company.id, startTime__lte = datetime.now()).order_by("-startTime")[:1]
        next_event = Event.objects.filter(company = company.id, startTime__gte = datetime.now()).order_by("startTime")[:1]

    last_task = Task.objects.filter(manager = manager.id, company = company.id).order_by("-datetime")[:1]
    last_call = Call.objects.filter(manager = manager.id, company = company.id).order_by("-datetime")[:1]

    currentDateTime = datetime.now()


    return render_to_response('html/companies/showcompany.html', {'company':company, 'tasks':tasks, 'artists':artists, 'manager':manager, 'last_task':last_task, 'last_call':last_call, 'last_event':last_event, 'next_event':next_event}, context_instance=RequestContext(request))

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def editcompany(request):#AJAX
    company = Company.objects.get(id = request.POST.get('id'))
    company.ctype = request.POST.get('companytype')
    company.name = request.POST.get('name')
    company.adress=request.POST.get('adress')

    company.telephone=request.POST.get('telephone')
    company.contacts=request.POST.get('contact')
    company.comment = request.POST.get('comment')
    company.email = request.POST.get('email')
    company.site = request.POST.get('site')
    company.save()
    #writelog(str(request.user.id), "Editing company", str(request.POST.get('name')))
    return HttpResponse("success")
def showcompanyupdate(request):

    company = Company.objects.get(id = request.POST.get('id'))
    manager = Manager.objects.get(username = request.user.username)
    artist = Artist.objects.get(id = request.POST.get('artist'))
    if(request.user.has_perm("DB.is_siteadmin")):
        artists = Artist.objects.all()
    else:
        artists = CMSILink.objects.filter(manager = Manager.objects.get(username = request.user.username), company__id = company.id)
    last_task = Task.objects.filter(company = company.id, artist = artist.id).order_by("-datetime")[:1]
    last_call = Call.objects.filter(company = company.id, artist = artist.id).order_by("-datetime")[:1]
    last_event = Event.objects.filter(company = company.id, startTime__lte = datetime.now(), artist = artist.id).order_by("-startTime")[:1]
    next_event = Event.objects.filter(company = company.id, startTime__gte = datetime.now(), artist = artist.id).order_by("startTime")[:1]

    return render_to_response('html/companies/ajaxshowcompanycontent.html', {'company':company, 'last_task':last_task, 'last_call':last_call, 'artists':artists, 'currentartist':artist, 'last_event':last_event, 'next_event':next_event}, context_instance=RequestContext(request))
def getmailslist(request):


    if request.POST.get("type") == "companies":
        companiesList = (request.POST.get("content")).split(',')
        companies = Company.objects.filter(id__in = companiesList)
    else:
        choosenCity = City.objects.get(id = request.POST.get("content"))
        link = CMSILink.objects.filter(manager = Manager.objects.get(username = request.user.username)).values("company__city__id")
        companies = Company.objects.filter(city__id__in = link)

    mailslist = []
    for company in companies:
        if(company.email != None):
            for mail in company.email.split(';'):
                mailslist.append(mail.strip())
    return render_to_response("html/companies/maillist.html", {'mails':mailslist})
def exportmailslisttoexcel(request):

    if request.POST.get("type") == "companies":
        companiesList = (request.POST.get("content")).split(',')
        companies = Company.objects.filter(id__in = companiesList)

    else:
        choosenCity = City.objects.get(id = request.POST.get("content"))
        link = CMSILink.objects.filter(manager = Manager.objects.get(username = request.user.username)).values("company__city__id")
        companies = Company.objects.filter(city__id__in = link)

    strUserName = str(request.user.username)

    file_path = os.getcwd() + "/DB" + "/GeneratedFiles" + "/" + strUserName + ".xlsx"
    #file_path = "C:\\2\\test.xlsx"

    book = xlsxwriter.Workbook(file_path)
    sheet = book.add_worksheet("Клиенты")


    headerFormat = book.add_format()
    headerFormat.set_pattern(1)  # This is optional when using a solid fill.
    headerFormat.set_bg_color('#808080')

    mailFormat = book.add_format()
    mailFormat.set_text_wrap()

    sheet.set_column(0, 0, 10)#Ширина столбца
    sheet.set_column(1, 1, 20)#Ширина столбца
    sheet.set_column(2, 2, 50)#Ширина столбца
    sheet.set_column(3, 3, 50)#Ширина столбца
    sheet.set_column(4, 4, 40)#Ширина столбца

    sheet.write(0, 0, "Код", headerFormat)
    sheet.write(0, 1, "Город", headerFormat)
    sheet.write(0, 2, "Название", headerFormat)
    sheet.write(0, 3, "Адрес", headerFormat)
    sheet.write(0, 4, "Почта", headerFormat)

    i = 1
    for link in companies:
        sheet.write(i, 0, str(link.id))
        sheet.write(i, 1, str(link.city))
        sheet.write(i, 2, str(link.name))
        sheet.write(i, 3, str(link.adress))

        if(link.email != None):
            maillist = link.email.split(";")
            splittedStr = ""
            for mail in maillist:
                splittedStr += mail.strip() + "\n"
            sheet.write(i, 4, splittedStr, mailFormat)
        i+= 1
    book.close()


    wrapper = FileWrapper(open(file_path, "rb"))
    response = HttpResponse(wrapper, content_type='application/zip')
    response['Content-Disposition'] = "attachment; filename=List.xlsx"

    return response


def ajaxTasksHistory(request):
    tasks = Task.objects.filter(company = request.POST.get('company'), artist = request.POST.get('artist')).order_by('-datetime')[:15]
    return  render_to_response('html/tasks/ajaxtaskhistory.html', {'tasks':tasks})
def ajaxCallsHistory(request):
    calls = Call.objects.filter(company = request.POST.get('company'), artist = request.POST.get('artist')).order_by('-datetime')[:15]
    return  render_to_response('html/tasks/ajaxcallhistory.html', {'calls':calls})
def ajaxgetcompanydata(request):
    company = Company.objects.get(id = request.POST.get('companyId'))
    return  render_to_response('html/companies/ajaxgetcompanydata.html', {'company':company})



#=========МЕРОПРИЯТИЯ АРТИСТОВ (ЗАНЯТОЕ ВРЕМЯ)==========================================================================
def addPresentatorEvent(request):
    date = request.POST.get("date")

    return render_to_response('html/companies/addPresentatorEvent.html', {'date':date})
def addPresentatorEventSave(request):
    if request.POST.get('fullday') == "true":
        fullday = True
    else:
        fullday = False
    presentator = Presentator.objects.get(siteuser__user__username = request.user.username)
    city = City.objects.get(id = request.POST.get('city'))
    presentatorEvent = PresentatorEvent(
        presentator = presentator,
        city = city,
        date = request.POST.get("date"),
        startTime = request.POST.get("timeFrom"),
        endTime = request.POST.get("timeTo"),
        fullday = fullday,
        description = request.POST.get("presentatorEventDescription"),
        comment = request.POST.get("presentatorEventComment"),

    )
    presentatorEvent.save()

    return HttpResponse("Success")
def deletePresentatorEvent(request):
    presentatorEvent = PresentatorEvent.objects.get(id = request.POST.get('id'))
    presentatorEvent.delete()
    return  HttpResponse("Success")
#=======================================================================================================================

#=========ЗАДАЧИ И ЗВОНКИ===============================================================================================

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def ajaxMarkCallAddTask(request):
    manager = Manager.objects.get(username = request.user.username)
    call = Call(
        manager = manager,
        company = Company.objects.get(id = request.POST.get('company')),
        artist = Artist.objects.get(id = request.POST.get('artist')),
        comment = request.POST.get('callComment'))
    call.save()
    if(request.POST.get('addTask') == "true"):
        if(request.POST.get('edittask')):
            task = Task.objects.get(id = request.POST.get("oldTask"))
            task.datetime = request.POST.get('taskDate')
            task.comment = request.POST.get('taskComment')
            task.description = request.POST.get('taskDescription')
            task.done = False
            task.save()
        else:

            try:
                oldTask = Task.objects.get(id = Task.objects.filter(manager = manager, company = Company.objects.get(id = request.POST.get('company')), artist = Artist.objects.get(id = request.POST.get('artist'))).order_by("-statsdt")[:1])
                oldTask.done = True
                oldTask.save()
            except Task.DoesNotExist:
                oldTask = None

            task = Task(
                manager = manager,
                company = Company.objects.get(id = request.POST.get('company')),
                artist = Artist.objects.get(id = request.POST.get('artist')),
                datetime = request.POST.get('taskDate'),
                comment = request.POST.get('taskComment'),
                description = request.POST.get('taskDescription'),
                done = False
            )
            task.save()
    return HttpResponse("success")


@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def showtasksnew(request):
    return render_to_response('html/tasks/showtasks_new.html', {}, context_instance=RequestContext(request))

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def ajaxgettodaytasks(request):
    currentDateTime = datetime.now()
    currentDateTime = currentDateTime.replace(hour=0, minute=0)
    weekTimeDelta = currentDateTime + timedelta(days = 6)
    dayTimeDelta = currentDateTime + timedelta(days=1)
    resentlyCrashedTimeDelta = currentDateTime - timedelta(days = 7)
    manager = Manager.objects.get(username = request.user.username)

    allowedCompanies = CMSILink.objects.filter(manager = manager).values("company__id").distinct()
    tasks = Task.objects.filter(manager = manager, datetime__year = currentDateTime.year, datetime__month = currentDateTime.month, datetime__day = currentDateTime.day, company__id__in = allowedCompanies).order_by("artist")
    tasksExpired = Task.objects.filter(manager = manager, done = False, datetime__lte = (currentDateTime - timedelta(days=1))).order_by("artist")
    tasksExpiredExists = False
    if(tasksExpired.filter(done = False).count == 1):
        tasksExpiredExists = False
    else:
        tasksExpiredExists = True
    eventsWeekCalls = Event.objects.filter(manager = manager, attentionCallWeekBool = True, startTime__range = ((currentDateTime + timedelta(days = 1)), weekTimeDelta)).order_by("artist")
    eventsDayCalls = Event.objects.filter(manager = manager, attentionCallDayBool = True, startTime__range = (currentDateTime.replace(hour=23, minute=59), dayTimeDelta)).order_by("artist")
    eventsRecentlyCrashed = Event.objects.filter(manager = manager, crashBool = True, startTime__range = (resentlyCrashedTimeDelta, currentDateTime.replace(hour=23, minute=59))).order_by("artist")
    return render_to_response('html/tasks/ajaxgettodaytasks.html',{'currentDateTime':currentDateTime, 'tasks':tasks, 'eventsWeekCalls':eventsWeekCalls, 'eventsDayCalls':eventsDayCalls, 'eventsRecentlyCrashed':eventsRecentlyCrashed, 'tasksExpired':tasksExpired, 'tasksExpiredExists':tasksExpiredExists})

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def ajaxgettaskslist(request):
    """if(request.POST.get("page") != None and request.POST.get("page") != "undefined"):
        page_number = request.POST.get("page")
    else:
        page_number = 1
    task_manager = Manager.objects.get(username = request.user.username)
    tasks = Task.objects.all().order_by('-statsdt').filter(manager = task_manager.id)
    #tasks = Task.objects.filter(company__id = 30454)
    filtredList = {}#Хранит отфильтрованные по последней дате задачи (создает словарь вида {номер компании:[дата создания, номер задачи]})
    filtredTasks = []#Контейнер для ID необходимых задач
    for task in tasks:#Алгоритм сортирует задачи менеджера по последней дате
        if(task.company.id in filtredList.keys()):
            if(task.statsdt == filtredList[task.company.id][0]):#Этот момент проверяет задачи с одинаковой датой и выбирает задачу с бОльшим номером
                if(task.id > filtredList[task.company.id][1]):
                    if(task.artist):
                        filtredList[task.company.id][1] = task.id
            else:
                if(not (task.statsdt == None)):
                    if(not(filtredList[task.company.id][0] == None)):
                        if(task.statsdt > filtredList[task.company.id][0]):
                            filtredList[task.company.id][1] = task.id
                else:
                    if(filtredList[task.company.id][0] != None):
                        filtredList[task.company.id][1] = task.id



        else:
            try:
                if(task.artist):
                    filtredList[task.company.id] = []
                    filtredList[task.company.id].append(task.statsdt)
                    filtredList[task.company.id].append(task.id)
            except ObjectDoesNotExist:
                pass
    for task in filtredList.values():
        filtredTasks.append(task[1])
    allowedCompanies = CMSILink.objects.filter(manager = task_manager.id).values("company").distinct()
    tasks = Task.objects.filter(id__in = filtredTasks, company__id__in = allowedCompanies).order_by("datetime", "artist")
    current_tasks = Paginator(tasks, 20)"""

    if(request.POST.get("page") != None and request.POST.get("page") != "undefined"):
        page_number = request.POST.get("page")
    else:
        page_number = 1
    if(request.POST.get("doneTasksShowCheckBox")) == "True":
        doneTasksShowCheckBox = True
    else:
        doneTasksShowCheckBox = False
    task_manager = Manager.objects.get(username = request.user.username)
    if doneTasksShowCheckBox:
        tasks = Task.objects.all().order_by('-statsdt').filter(manager = task_manager.id)
    else:
        tasks = Task.objects.all().order_by('-statsdt').filter(manager = task_manager.id, done = False)
    filtredList = {}#Хранит отфильтрованные по последней дате задачи (создает словарь вида {номер компании:[дата создания, номер задачи]})
    filtredTasks = []#Контейнер для ID необходимых задач
    for task in tasks:#Алгоритм сортирует задачи менеджера по последней дате
        if(task.company.id in filtredList.keys()):
            if(task.statsdt == filtredList[task.company.id][0]):#Этот момент проверяет задачи с одинаковой датой и выбирает задачу с бОльшим номером
                if(task.id > filtredList[task.company.id][1]):
                    if(task.artist):
                        filtredList[task.company.id][1] = task.id
            else:
                if(not (task.statsdt == None)):
                    if(not(filtredList[task.company.id][0] == None)):
                        if(task.statsdt > filtredList[task.company.id][0]):
                            filtredList[task.company.id][1] = task.id
                else:
                    if(filtredList[task.company.id][0] != None):
                        filtredList[task.company.id][1] = task.id
        else:
            try:
                if(task.artist):
                    filtredList[task.company.id] = []
                    filtredList[task.company.id].append(task.statsdt)
                    filtredList[task.company.id].append(task.id)
            except ObjectDoesNotExist:
                pass
    for task in filtredList.values():
        filtredTasks.append(task[1])
    allowedCompanies = CMSILink.objects.filter(manager = task_manager.id).values("company").distinct()

    if doneTasksShowCheckBox:
        tasks = Task.objects.filter(id__in = filtredTasks, company__id__in = allowedCompanies)
    else:
        tasks = Task.objects.filter(id__in = filtredTasks, company__id__in = allowedCompanies, done = False)


    dateTimeNow = datetime.now()
    dateTimeNow = dateTimeNow.replace(hour= 0, minute=0, second=0)

    actualTasks = tasks.filter(datetime__gte = dateTimeNow).order_by("datetime", "artist")
    lateTasks = tasks.filter(datetime__lte = dateTimeNow).order_by("-datetime", "artist")

    resultList = []
    for task in lateTasks:
        resultList.append(task)
    for task in actualTasks:
        resultList.append(task)

    current_tasks = Paginator(resultList, 20)
    return  render_to_response('html/tasks/ajaxgettaskslist.html', {'tasks':current_tasks.page(page_number)})

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def ajaxchangetaskstatus(request):
    task = Task.objects.get(id = request.POST.get('taskId'))
    if(request.POST.get('action') == 'activate'):
        task.done = True
    else:
        task.done = False

    task.save()

    return HttpResponse("success")

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def ajaxchangecallstatus(request):
    event = Event.objects.get(id = request.POST.get('eventId'))

    if(request.POST.get('type') == 'week'):
        if(request.POST.get('action') == 'activate'):
            event.attentionCallWeekDone = True
        else:
            event.attentionCallWeekDone = False
    elif(request.POST.get('type') == 'day'):
        if(request.POST.get('action') == 'activate'):
            event.attentionCallDayDone = True
        else:
            event.attentionCallDayDone = False

    event.save()

    return HttpResponse("success")
#=======================================================================================================================


#==================МЕРОПРИЯТИЯ==========================================================================================
@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def showevents(request, page_number):
    currentDateTime = datetime.now()
    currentDateTime = currentDateTime.replace(hour= 0, minute =0)
    events_manager = Manager.objects.get(username = request.user.username)
    events = Event.objects.all().filter(manager = events_manager.id).order_by('-startTime')
    current_events = Paginator(events, 20)
    return render_to_response('html/events/showevents.html', {'events':current_events.page(page_number)}, context_instance=RequestContext(request))

@login_required(login_url='/logon/')
def fillcalendar(request):#Выдает события календаря, календарь получает их через javascript eval
    presentator = None
    if((request.POST.get("company") != "") and (request.POST.get("company") != None)):#Для календаря по учреждению

        company = Company.objects.get(id = request.POST.get("company"))
        if(request.POST.get("presentator") != "None"):
            presentator = Presentator.objects.get(id = request.POST.get("presentator"))
            events = Event.objects.filter(artist__in = presentator.artists.all(), startTime__year = request.POST.get('year'), startTime__month = request.POST.get('month'), company__city = company.city).order_by("startTime")
        else:
            events = Event.objects.filter(startTime__year = request.POST.get('year'), startTime__month = request.POST.get('month'), company__city = company.city).order_by("startTime")
    else:#Для календаря по городу
        if(request.user.has_perm("DB.is_siteadmin")):#Если админ выводим все.
            if(request.POST.get("presentator") != "None"):
                presentator = Presentator.objects.get(id = request.POST.get("presentator"))
                events = Event.objects.filter(artist__in = presentator.artists.all(), startTime__year = request.POST.get('year'), startTime__month = request.POST.get('month'), company__city = request.POST.get('city')).order_by("startTime")#И фильтруем
            else:
                events = Event.objects.filter(startTime__year = request.POST.get('year'), startTime__month = request.POST.get('month'), company__city = request.POST.get('city')).order_by("startTime")

        else:
            if(request.user.has_perm("DB.can_work_with_db")):#Если менеджер, ищем по учреждениям
                links = CMSILink.objects.filter(manager = Manager.objects.get(username = request.user.username), company__city = request.POST.get("city")).values("show").distinct() #Находим все шоу в выбранном городе для менеджера
                showlist = []
                for link in links:
                    showlist.append(link["show"])
                if(request.POST.get("presentator") != "None"):
                    presentator = Presentator.objects.get(id = request.POST.get("presentator"))
                    events = Event.objects.filter(startTime__year = request.POST.get('year'), startTime__month = request.POST.get('month'), company__city = request.POST.get('city'), artist__in = showlist).order_by("startTime").filter(artist__in = presentator.artists.all())#И фильтруем
                else:
                    events = Event.objects.filter(startTime__year = request.POST.get('year'), startTime__month = request.POST.get('month'), company__city = request.POST.get('city'), artist__in = showlist).order_by("startTime")#И фильтруем

            else:#Если артист, ищем по открытым городам
                presentatorShows = Presentator.objects.get(siteuser = SiteUser.objects.get(user = request.user)).artists.all().values("id")#Находим все шоу для артиста (возможно придется пофиксить и сделать для каждого города свое шоу )
                events = Event.objects.filter(startTime__year = request.POST.get('year'), startTime__month = request.POST.get('month'), company__city = request.POST.get('city'), artist__in = presentatorShows).order_by("startTime")
                presentator = Presentator.objects.get(siteuser__user = request.user)

    if(presentator != None):
        presentatorEvents = PresentatorEvent.objects.filter(presentator = presentator, city__id = request.POST.get('city'), date__year = request.POST.get('year'), date__month = request.POST.get('month'))

    else:
        presentatorEvents = PresentatorEvent.objects.filter(city__id = request.POST.get('city'), date__year = request.POST.get('year'), date__month = request.POST.get('month'))
    return render_to_response('html/companies/ajaxFillCalendar.html', {'events':events, 'presentatorEvents':presentatorEvents, 'user':request.user.username}, context_instance=RequestContext(request))

@login_required(login_url='/logon/')
def geteventdata(request):
    ownEvent = None
    managers = None
    if(request.user.has_perm("DB.can_work_with_db")):
        if((request.POST.get("companyId") != "" and (request.POST.get("companyId") != None))):
            company = Company.objects.get(id = request.POST.get('companyId'))

            artists = CMSILink.objects.filter(manager = Manager.objects.get(username = request.user.username), company__id = company.id)
        else:
            artists = CMSILink.objects.filter(manager = Manager.objects.get(username = request.user.username))
        showonly = False;

        if(request.POST.get("eventId")):
            event = Event.objects.get(id = request.POST.get("eventId"))
            if(event.manager != Manager.objects.get(username = request.user.username)):
                showonly = True;
            if(event.manager != Manager.objects.get(username = request.user.username)):
                ownEvent = False
            else:
                ownEvent = True
        else:
            event = None;
        manager = Manager.objects.get(username = request.user.username)


    else:
        event = Event.objects.get(id = request.POST.get("eventId"))
        showonly = True
        artists = None
        ownEvent = None
        company = Company.objects.get(id = event.company.id)
        manager = event.manager

    if(request.user.has_perm("DB.is_siteadmin")):
        showonly = False
        managers = Manager.objects.filter(id__in = CMSILink.objects.filter(company__id = company.id).values("manager_id"))
    return render_to_response('html/companies/ajaxGetEventData.html', {'event':event, 'artists':artists, 'date':request.POST.get('dateString'), 'company':company.name, 'manager':manager, 'managers':managers, 'artist':request.POST.get("artist"), 'showonly':showonly, 'ownEvent':ownEvent}, context_instance=RequestContext(request))

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def saveevent(request):
    event_artist =  Artist.objects.get(name = request.POST.get("artist_name"))
    event_manager = Manager.objects.get(name = request.POST.get("manager_name"))
    event_startTime = request.POST.get('start_time')
    #event_duration = request.POST.get("duration")
    if(request.POST.get('price') != ""):
        event_price = request.POST.get('price')
    else:
        event_price = 0
    if(request.POST.get('percent') != ""):
        event_percent = request.POST.get('percent')
    else:
        event_percent = 0
    if(request.POST.get('childCount') != ""):
        event_childCount = request.POST.get('childCount')
    else:
        event_childCount = 0

    #event_photoPrice = request.POST.get('photoPrice')
    event_note = request.POST.get('note')
    event_companyNote = request.POST.get('companyNote')
    event_attentionCallWeekBool = request.POST.get('attentionCallWeekBool')   
    if not(event_attentionCallWeekBool):
        event_attentionCallWeekBool = 0
    else:
        event_attentionCallWeekBool = 1
    event_attentionCall = request.POST.get('attentionCall')
    event_attentionCallDayBool = request.POST.get('attentionCallDayBool')
    if not(event_attentionCallDayBool):
        event_attentionCallDayBool = 0
    else:
        event_attentionCallDayBool = 1
    event_crashBool = request.POST.get('crashBool')   
    if not(event_crashBool):
        event_crashBool = 0
    else:
        event_crashBool = 1
    event_crash = request.POST.get('crash')
    event_company = Company.objects.get(id = request.POST.get("company_id"))
    event = Event(
         artist = event_artist,
         manager = event_manager,
         startTime = event_startTime,
         #duration = event_duration,
         price = event_price,
         percent = event_percent,
         childCount = event_childCount,
         #photoPrice = event_photoPrice,
         note = event_note,
         companyNote = event_companyNote,
         attentionCallWeekBool = event_attentionCallWeekBool,
         attentionCall = event_attentionCall,
         attentionCallDayBool = event_attentionCallDayBool,
         crashBool = event_crashBool,
         crash = event_crash,
         company = event_company,        
        )
    event.save()

    #writelog(str(request.user.id), "Adding event", str(event_startTime + " " + event_artist.name))
    return redirect('/showevents/page/1/')

@login_required(login_url='/logon/')
def showevent(request, event_number):
    try:
        event = Event.objects.get(id = event_number)
    except Event.DoesNotExist:
        event = None
    if(event == None):
        return redirect('/showevents/page/1')
    artists = Artist.objects.all()
    user = SiteUser.objects.get(user = request.user)
    if(request.user.has_perm("DB.can_work_with_db")):
        manager = Manager.objects.get(username = request.user.username)
        allowedCompanies = CMSILink.objects.filter(manager = manager)
        companies = Company.objects.filter(id__in = allowedCompanies.all().values("company")).order_by("city", "name")
    else:
        companies = None;
    return render_to_response('html/events/showevent.html', {'event':event, 'artists':artists, 'companies':companies}, context_instance=RequestContext(request))
@login_required(login_url='/logon/')
def editEvent(request):#AJAX
    if(request.POST.get('new') == "true"):
        artist =  Artist.objects.get(id = request.POST.get("artistId"))
        manager = Manager.objects.get(username = request.user.username)
        company = Company.objects.get(id = request.POST.get('companyId'))
        if((request.POST.get('price') != "") and (request.POST.get('price') != "None")):
            price = float(str(request.POST.get('price').replace(',','.')))
        else:
            price = 0
        if((request.POST.get('percent') != "") and (request.POST.get('price') != "percent")):
            percent = request.POST.get('percent')
        else:
            percent = 0
        if(request.POST.get('childCount') != "" and request.POST.get('childCount') != "None" ):
            childCount = request.POST.get('childCount')
        else:
            childCount = 0
        note = request.POST.get('note')
        attentionCallWeekComment = request.POST.get('attentionCallWeekComment')
        attentionCallDayComment = request.POST.get('attentionCallDayComment')
        if(request.POST.get('attentionCallWeekBool') == "true"):
            attentionCallWeekBool = True
        else:
            attentionCallWeekBool = False
        if(request.POST.get('attentionCallDayBool') == "true"):
            attentionCallDayBool = True
        else:
            attentionCallDayBool = False
        if(request.POST.get('crashBool') == "true"):
            crashBool = True
        else:
            crashBool = False


        crash = request.POST.get('crash')

        if(request.user.has_perm("DB.is_siteadmin")):
            manager = Manager.objects.get(id = request.POST.get('manager'))

        event = Event(
         artist = artist,
         manager = manager,
         company = company,
         startTime = request.POST.get('startTime'),
         price = price,
         percent = percent,
         childCount = childCount,
         note = note,
         attentionCallWeekBool = attentionCallWeekBool,
         attentionCallWeekComment = attentionCallWeekComment,
         attentionCallDayBool = attentionCallDayBool,
         attentionCallDayComment = attentionCallDayComment,
         crashBool = crashBool,
         crash = crash,
        )
        event.save()
    else:
        event = Event.objects.get(id = request.POST.get('eventId'))
        event.startTime = request.POST.get('startTime')
        if((request.POST.get('price') != "") and (request.POST.get('price') != "None")):
            event.price = float(str(request.POST.get('price').replace(',','.')))
        else:
            event.price = 0
        if((request.POST.get('percent') != "") and (request.POST.get('price') != "percent")):
            event.percent = request.POST.get('percent')
        else:
            event.percent = 0
        if(request.POST.get('childCount') != "" and request.POST.get('childCount') != "None" ):
            event.childCount = request.POST.get('childCount')
        else:
            event.childCount = 0
        event.note = request.POST.get('note')
        event.attentionCallWeekComment = request.POST.get('attentionCallWeekComment')
        event.attentionCallDayComment = request.POST.get('attentionCallDayComment')
        if(request.POST.get('attentionCallWeekBool') == "true"):
            event.attentionCallWeekBool = True
        else:
            event.attentionCallWeekBool = False
        if(request.POST.get('attentionCallDayBool') == "true"):
            event.attentionCallDayBool = True
        else:
            event.attentionCallDayBool = False
        if(request.POST.get('crashBool') == "true"):
            event.crashBool = True
        else:
            event.crashBool = False

        event.crash = request.POST.get('crash')
        event.artistNote = request.POST.get('artistNote')
        if((request.POST.get('resultSum') != "") and (request.POST.get('resultSum') != None)):
            event.resultSum = float(str(request.POST.get('resultSum').replace(',','.')))
        else:
            event.resultSum = 0

        if(request.user.has_perm("DB.is_siteadmin")):
            manager = Manager.objects.get(id = request.POST.get('manager'))
            event.manager = manager
        event.save()

    #writelog(str(request.user.id), "Editing company", str(request.POST.get('name')))
    return HttpResponse("success")
@login_required(login_url='/logon/')
def deleteevent(request):
    event = Event.objects.get(id = request.POST.get("eventId"))
    #writelog(str(request.user.id), "Deleting event", str(str(event.startTime) + " " + str(event.artist.name)))
    event.delete()
    return HttpResponse("success")
@login_required(login_url='/logon/')
def saveartisttcomment(request):
    event = Event.objects.get(id = request.POST.get("id"))
    event.artistNote = request.POST.get("comment")
    event.save()
    redirectstring = '/event/' + str(event.id);
    return redirect(redirectstring)

@login_required(login_url='/logon/')
@user_passes_test(user_is_manager, login_url='/calendar/')
def editcrash(request):
    event = Event.objects.get(id = request.POST.get("id"))
    event.crash = request.POST.get('comment')
    event.crashBool = True;
    #writelog(str(request.user.id), "Deleting event", str(str(event.startTime) + " " + str(event.artist.name)))
    event.save()
    redirect_string = "/event/" + str(event.id)
    return redirect(redirect_string)
#==================================================================================

#AUTH================================================================================



#=======================================================================================================================

#==============================КАЛЕНДАРЬ================================================================================
@login_required(login_url='/logon/')
def calendar(request):
    user = SiteUser.objects.get(user = request.user)
    artists = None
    allowedCities = City.objects.filter(id__in = CMSILink.objects.all().filter(manager__username = request.user.username).values("company__city"))
    if(request.user.has_perm("DB.can_work_with_db")):
        pass
    else:
        presentator = Presentator.objects.get(siteuser = user)
        allowedCities = City.objects.filter(id__in =  presentator.cities.all)

    if(request.user.has_perm("DB.is_siteadmin")):
        monthTimeDelta = datetime.now() - timedelta(days = 31) #Не показывает города, в которых не было мероприятий месяц
        artists = Artist.objects.all();
        workedCities = Event.objects.filter(startTime__gte = monthTimeDelta).values("company__city__id").distinct()
        allowedCities = City.objects.filter(id__in = workedCities)

    return render_to_response('html/calendar/calendar.html', {'cities':allowedCities, 'artists':artists}, context_instance=RequestContext(request))
#=======================================================================================================================

#==============================СТАТИСТИКА===============================================================================
#Страница статистики
def statspanel(request):

    test = None
    if(request.user.has_perm("DB.is_siteadmin")):
        managers = Manager.objects.exclude(name = 'archy')
        allowedCities = City.objects.all()
        artists = Artist.objects.all()
    else:
        managers = Manager.objects.filter(username = request.user.username)
        allowedCities = City.objects.filter(id__in = CMSILink.objects.all().filter(manager__username = request.user.username).values("company__city"))
        artists = Artist.objects.filter(id__in = CMSILink.objects.filter(manager__username = request.user.username).values("show__id"))
    return  render_to_response('html/stats/managerStats.html', {'managers':managers, 'artists':artists, 'cities':allowedCities, 'TESTVAR':test}, context_instance=RequestContext(request))
#Динамические данные статистики
def statsajax(request):

    allowedCompaniesCount = 0
    tasksCount = 0
    tasksCompanies = 0
    callsCount = 0
    callsCompanies = 0
    eventsCount = 0
    eventsCompanies = 0
    endEventsCount = 0
    salary = 0

    allowedCompaniesCount = CMSILink.objects.filter(show = Artist.objects.get(id = int(request.POST.get('artist'))), manager = request.POST.get('manager'), company__city = request.POST.get('city')).values("company").distinct().count
    #allowedCompaniesCount = City.objects.get(id = 2)

    tasksCount = Task.objects.filter(artist = request.POST.get('artist'), manager = request.POST.get('manager'), company__city = request.POST.get('city'), statsdt__lte = request.POST.get('dtTo'), statsdt__gte = request.POST.get('dtFrom')).count
    tasksCompanies = Task.objects.filter(artist = request.POST.get('artist'), manager = request.POST.get('manager'), company__city = request.POST.get('city'), statsdt__lte = request.POST.get('dtTo'), statsdt__gte = request.POST.get('dtFrom')).values("company").distinct().count
    callsCount = Call.objects.filter(artist = request.POST.get('artist'), manager = request.POST.get('manager'), company__city = request.POST.get('city'), statsdt__lte = request.POST.get('dtTo'), statsdt__gte = request.POST.get('dtFrom')).count
    callsCompanies = Task.objects.filter(artist = request.POST.get('artist'), manager = request.POST.get('manager'), company__city = request.POST.get('city'), statsdt__lte = request.POST.get('dtTo'), statsdt__gte = request.POST.get('dtFrom')).values("company").distinct().count
    eventsCount = Event.objects.filter(artist = request.POST.get('artist'), manager = request.POST.get('manager'), company__city = request.POST.get('city'), statsdt__lte = request.POST.get('dtTo'), statsdt__gte = request.POST.get('dtFrom')).count
    eventsCompanies = Event.objects.filter(artist = request.POST.get('artist'), manager = request.POST.get('manager'), company__city = request.POST.get('city'), statsdt__lte = request.POST.get('dtTo'), statsdt__gte = request.POST.get('dtFrom')).values("company").distinct().count
    endEventsCount = Event.objects.filter(artist = request.POST.get('artist'), manager = request.POST.get('manager'), company__city = request.POST.get('city'), startTime__lte = request.POST.get('dtTo'), startTime__gte = request.POST.get('dtFrom')).values("company").count
    for event in Event.objects.filter(artist = request.POST.get('artist'), manager = request.POST.get('manager'), company__city = request.POST.get('city'), startTime__lte = request.POST.get('dtTo'), startTime__gte = request.POST.get('dtFrom')):
        if(event.percent != None and event.resultSum != None):
            salary += 0.01 * event.percent * event.resultSum
    return  render_to_response('html/stats/getstats.html', locals())
#=======================================================================================================================


#===================================================================================================================


#СТРАНИЦА ПОМОЩИ
def help(request):
    return  render_to_response('html/help/help.html', context_instance=RequestContext(request))
#================================================================================================


#=====================================CONTROL================================================================================
###########УПРАВЛЕНИЕ ДОСТУПОМ МЕНЕДЖЕРОВ###################################################################
def companiescontrol(request):
    #managers = Manager.objects.exclude(name = 'archy')
    managers = Manager.objects.all()
    artists = Artist.objects.all()
    cities = City.objects.all()
    types = ["ДС","ШК","ДК", "ДО"]
    return  render_to_response('html/control/companiescontrol.html', {'managers':managers, 'artists':artists, 'cities':cities, 'types':types}, context_instance=RequestContext(request))
def cmsLinkReturn(request):
    freeCompanies = None
    filtredCompanies = None
    count = int(request.POST.get('count'))
    page = int(request.POST.get('page'))
    start = page * count
    end = start + count
    if(request.POST.get('manager') != "0"):
        try:
            filtredCompanies = CMSILink.objects.get(manager = request.POST.get('manager'), show = request.POST.get('artist')).company
            filtredCompanies = filtredCompanies.filter(city = request.POST.get('city'))
            if(request.POST.get('type') != "0"):
                filtredCompanies = filtredCompanies.filter(ctype = request.POST.get('type'))
        except CMSILink.DoesNotExist:
            return HttpResponse("")

    else:
        freeCompanies = Company.objects.filter(city = request.POST.get('city'))
        if(request.POST.get('type') != "0"):
            freeCompanies = freeCompanies.filter(ctype = request.POST.get('type'))

        links = CMSILink.objects.filter(show = request.POST.get('artist'), company__city = request.POST.get('city')).values("company").distinct()

        tmpList = []
        for link in links:
            if(link["company"] != None):
                tmpList.append(link["company"])
        freeCompanies = freeCompanies.exclude(id__in = tmpList)

    busy = None
    if(freeCompanies != None):
        busy = freeCompanies[start:end]
    free = None
    if(filtredCompanies != None):
        free = filtredCompanies[start:end]
    return render_to_response('html/control/cmsiContent.html', {'free':free, 'busy':busy})
def changePermission(request):
    linkFrom = None
    linkTo = None

    if(request.POST.get('from') != '0'):
        try:
            linkFrom = CMSILink.objects.get(manager = Manager.objects.get(id = request.POST.get('from')), show = Artist.objects.get(id = request.POST.get('artist')))
        except CMSILink.DoesNotExist:
            linkFrom = CMSILink(
                manager =  Manager.objects.get(id = request.POST.get('from')),
                show = Artist.objects.get(id = request.POST.get('artist'))
            )
            linkFrom.save()
    if(request.POST.get('to') != '0'):
        try:
            linkTo = CMSILink.objects.get(manager = Manager.objects.get(id = request.POST.get('to')), show = Artist.objects.get(id = request.POST.get('artist')))
        except CMSILink.DoesNotExist:
            linkTo = CMSILink(
                manager =  Manager.objects.get(id = request.POST.get('to')),
                show = Artist.objects.get(id = request.POST.get('artist'))
            )
            linkTo.save()

    companiesList = (request.POST.get('changedList')).split(',')
    if(request.POST.get('from') != '0'):
        for company in companiesList:
            linkFrom.company.remove(Company.objects.get(id = company))
            linkFrom.save()

    if(request.POST.get('to') != '0'):
         for company in companiesList:
            linkTo.company.add(Company.objects.get(id = company))
            linkTo.save()

    return HttpResponse(companiesList)
############################################################################################################
#============================================================================================================================


#Вспомогательные функции:


#Перенаправляет на главную страницу
@login_required(login_url='/logon/')
def redirecttomain(request):
    return redirect('/main')




def getcompanylistcookies(request):#Функция проверяет наличие куков выбора режима показа компаний (просто полный список или антидубль)
    response = redirect('/')
    response.set_cookie("qwe", "1")
    return response
    return None
#Функция для логгирования: создает папку для менеджера, там создает/дописывает файлы по дням (работает только в Windows)
def writelog(_username, _userAction, _objectDescription):
    pathToDir = "worklogs\\" #Путь к папке с логами
    logString = "";#Строка для записи

    currentDateTime = datetime.now()
    siteUser = SiteUser.objects.get(user = _username)
    pathToDir += siteUser.name + "\\"
    try:
        os.makedirs(pathToDir)
    except:
        print("suffer")
    pathToFile = pathToDir + str(currentDateTime.day) + '.' + str(currentDateTime.month) + '.' + str(currentDateTime.year) + ".log";#Путь к файлу лога.
    file = open(pathToFile, 'a')
    fileContain = timeStringConvert(currentDateTime) + " ACTION: (" + _userAction + ") DESCRIPTION: (" + _objectDescription + ")\n";
    file.write(fileContain)
    file.close()
    return "success"
def timeStringConvert(time):#Функция преобразует формат строки времени к привычному виду: добавляет нули вначале одноцифрового параметра
    convertedTime = "";
    if(len(str(time.hour)) == 1):
        convertedTime += "0" + str(time.hour)
    else:
        convertedTime += str(time.hour)
    convertedTime += ":"
    if(len(str(time.minute)) == 1):
        convertedTime += "0" + str(time.minute)
    else:
        convertedTime += str(time.minute)
    convertedTime += ":"
    if(len(str(time.second)) == 1):
        convertedTime += "0" + str(time.second)
    else:
        convertedTime += str(time.second)
    return convertedTime
#Функция рассчитывает число страниц, индекс первого и последнего элемента, а также возвращает текущую страницу
def CalculatePages(elementsCount, countOnPage, currentPage):


    result = {}
    result["pageCount"] = elementsCount / countOnPage
    result["endElement"] = currentPage * countOnPage
    result["startElement"] = result["endElement"] - countOnPage
    pagesList = []

    if(elementsCount % countOnPage == 0):
        countCorrection = 1
    else:
        countCorrection = 2
    for i in range(1, (int(result["pageCount"]) + countCorrection)):
        pagesList.append(i)
    result["pagesList"] = pagesList
    result["currentPage"] = currentPage
    return result
def noneToEmptyString(_value):
    if (_value == None or _value == False):
        return ""
    else:
        return _value


def testfunc(request):#Вспомогательная функция для выполнения индивидуальных скриптов админа

    c1 = Company.objects.get(id = 36)
    return render_to_response('Design/html/companies/company_page/page.html', {'company':c1})


    if(request.user.username == "archy"):
        case = "LoadDataFromExcelCase";

        if(case == "ChangeCityCase"):#Замена ошибочно указанного города в учреждении
            fromCity = City.objects.get(name = "Красноярск")
            toCity = City.objects.get(name = "Братск")
            searchStrings = ["Братск", "братск", "Вихоревка", "вихоревка", "Усть - Илимск", "Усть-Илимск", "Усть-и", "Усть- И"]
            for cityName in searchStrings:
                companies = Company.objects.filter(city = fromCity, name__icontains = cityName).update(city = toCity)




        if(case == "LoadDataFromExcelCase"): #Экспорт данных из Excel таблиц
            #Мариинск
            wb = load_workbook('MNSK.xlsx')
            ws = wb.active
            city = City.objects.get(name = "Кемерово")
            for i in range(1, 21):
                if(ws[i][0].value == None):
                    continue
                ctype = ""
                name = str(ws[i][0].value).strip().replace("_x000D_", " ")
                adress = str(ws[i][1].value).strip().replace("_x000D_", " ")
                contacts = ""
                site = str(ws[i][4].value).strip().replace("_x000D_", " ")
                email = str(ws[i][3].value).strip().replace("_x000D_", " ")
                comment = ""
                telephone = str(ws[i][2].value).strip().replace("_x000D_", " ")

                if(comment == None):
                    comment = ""


                company = Company(ctype = ctype, city = city, name = name, adress = adress, contacts = contacts, telephone = telephone, site = site, email = email, comment = comment)
                company.save()

            #
            wb = load_workbook('LSV.xlsx')
            ws = wb.active
            city = City.objects.get(name = "Пермь")
            for i in range(1, 76):
                if(ws[i][1].value == None):
                    continue
                ctype = ""
                name = str(ws[i][1].value).strip().replace("_x000D_", " ")
                adress = str(ws[i][2].value).strip().replace("_x000D_", " ")
                contacts = str(ws[i][5].value).strip().replace("_x000D_", " ")
                site = ""
                email = str(ws[i][3].value).strip().replace("_x000D_", " ")
                comment = ""
                telephone = str(ws[i][4].value).strip().replace("_x000D_", " ")

                if(comment == None):
                    comment = ""


                company = Company(ctype = ctype, city = city, name = name, adress = adress, contacts = contacts, telephone = telephone, site = site, email = email, comment = comment)
                company.save()
        if(case == "DoubleCompanyRemover"):
            citiesList = ["Барнаул"]
            forremove = []
            forcheck = []
            for city in citiesList:
                cityCompanies = Company.objects.filter(city__name = city)
                for company in cityCompanies:
                    checked = Company.objects.filter(city__name = city, name__contains = company.name.strip(), adress__contains = company.adress.strip())
                    if checked.count() > 1:
                        choosen = checked[0]
                        for topCompareCompany in checked:
                            for botCompareCompany in checked:
                                if topCompareCompany.id == botCompareCompany.id:
                                    continue
                                else:
                                    if(CMSILink.objects.filter(company__id = topCompareCompany.id).count() > CMSILink.objects.filter(company__id = botCompareCompany.id).count()):
                                        choosen = topCompareCompany
                                    else:
                                        if topCompareCompany.id < botCompareCompany.id:
                                            choosen = topCompareCompany

                        for compareCompany in checked:
                            if compareCompany.id == choosen.id:
                                continue
                            else:
                                if CMSILink.objects.filter(company__id = compareCompany.id):
                                    topManager = CMSILink.objects.filter(company__id = compareCompany.id)[0].manager
                                else:
                                    topManager = None

                                if CMSILink.objects.filter(company__id = choosen.id):
                                    botManager = CMSILink.objects.filter(company__id = compareCompany.id)[0].manager
                                else:
                                    botManager = None

                                if(Event.objects.filter(company = compareCompany.id, startTime__gte = datetime.now()) or (topManager != botManager and topManager != None and botManager != None)):
                                    print(Event.objects.filter(company = compareCompany.id, startTime__gte = datetime.now()))
                                    print(CMSILink.objects.filter(company__id = compareCompany.id))
                                    print(CMSILink.objects.filter(company__id = choosen.id))

                                    print(CMSILink.objects.filter(company__id = compareCompany.id).manager != CMSILink.objects.filter(company__id = choosen.id).manager)

                                    forcheck.append(compareCompany.id)
                                else:
                                    Event.objects.filter(company = compareCompany.id).update(company = choosen)
                                    Task.objects.filter(company = compareCompany.id).update(company = choosen)
                                    Call.objects.filter(company = compareCompany.id).update(company = choosen)
                                    forremove.append(compareCompany.id)


            Company.objects.filter(id__in = forremove).delete()
            print(forremove, forcheck)
            return HttpResponse("Удалено")# %d компаний, спорных %d компаний", forremove.count(), forcheck.count())
                    #for removeCompany in checked:
                        #if removeCompany == choosen:
        if(case == "DoubleCompanyRemoverV2"):
            #citiesList = ["Астрахань", "Барнаул", "Бердск", "Братск", "Волгоград", "Волжский", "Красноярск", "Москва-Восток", "Москва-Запад", "Москва-Юг", "Нижневартовск", "Новокузнецк", "Новосибирск", "Омск", "Петербург", "Саратов", "Тольятти", "Уфа", "Череповец"]
            citiesList = ["TESTCITY",]
            currentStatus = 0


            for i, city in enumerate(citiesList):
                companies = Company.objects.filter(city__name = city)
                eventCounter = 0
                taskCounter = 0
                callCounter = 0
                cityStatus = 0
                deletedCompanies = 0
                for company in companies:
                    doubleChecker = companies.filter(name__contains = company.name.strip(), adress__contains = company.adress.strip())
                    if doubleChecker.count() < 1:
                        continue
                    else:
                        remainCompany = doubleChecker[0]
                        for checkedCompany in doubleChecker:
                            if(checkedCompany == remainCompany):
                                continue
                            else:
                                if (remainCompany.contacts.strip() == ""  or remainCompany.contacts == None) and checkedCompany.contacts.strip() != "":
                                    print("change")
                                    print(remainCompany.contacts)
                                    print(checkedCompany.contacts)
                                    remainCompany.contacts = checkedCompany.contacts
                                if (remainCompany.comment.strip() == ""  or remainCompany.comment == None) and checkedCompany.comment.strip() != "":
                                    remainCompany.comment = checkedCompany.comment
                                if (remainCompany.email.strip() == "" or remainCompany.email == None) and checkedCompany.email.strip() != "":
                                    remainCompany.email = checkedCompany.email
                                if (remainCompany.site.strip() == "" or remainCompany.site == None) and checkedCompany.site.strip() != "":
                                    remainCompany.site = checkedCompany.site
                                if (remainCompany.telephone.strip() == "" or remainCompany.telephone == None) and checkedCompany.telephone.strip() != "":
                                    remainCompany.telephone = checkedCompany.telephone
                                remainCompany.save()

                                movedEvents = Event.objects.filter(company = checkedCompany).update(company = remainCompany)
                                if(movedEvents):
                                    eventCounter += len(movedEvents)

                                movedTasks = Task.objects.filter(company = checkedCompany).update(company = remainCompany)
                                if(movedTasks):
                                    taskCounter += len(movedTasks)

                                movedCalls = Call.objects.filter(company = checkedCompany).update(company = remainCompany)
                                if(movedCalls):
                                    callCounter += len(movedCalls)


                                managerLinks = CMSILink.objects.filter(company__id = checkedCompany.id)
                                for link in managerLinks:
                                    link.company.remove(checkedCompany)
                                    link.company.add(remainCompany)
                                    link.save()
                            deletedCompany = Company.objects.filter(id = checkedCompany.id)
                            deletedCompany.delete()
                            deletedCompanies += 1
                    cityStatus += 100 / len(companies)
                    print("Текущий прогресс по городу: " + str(cityStatus) + " %")


                print("Удалено " + str(deletedCompanies) + " компаний.")
                print("Город " + city + " проверен. Перемещено " + str(eventCounter) + " мероприятий, " + str(taskCounter) + " задач, " + str(callCounter) + " звонков.")
                currentStatus += 100/ len(citiesList)
                print("Общий прогресс: " + str(currentStatus) + " %")
    else:
        return HttpResponse("НЕАВТОРИЗОВАНО")
    return HttpResponse("Скрипт успешно выполнен")

def buffunc(request):
    return HttpResponse("QWE")
def buffunc2(request):

    return HttpResponse("QWE")


#NEW DESIGN:
#Auth:=====================================================================================
def logon(request):
    return render_to_response('Design/html/auth/login.html')
def login(request):
    args = {}
    if request.POST:
        username = request.POST.get('login','')
        password = request.POST.get('password', '')
        user = auth.authenticate(username = username.strip(), password = password)
        if user is not None:
            auth.login(request, user)
            return HttpResponse("true")
        else:
            return HttpResponse("false")
    else:
        return HttpResponse("false")
@login_required(login_url='/logon/')
def logout(request):
    auth.logout(request)
    return redirect('/logon/')
#Companies:=================================================================================
@login_required(login_url='/logon/')
def company_show_page(request, company_number):
    try:
        company = Company.objects.get(id = company_number)
    except Company.DoesNotExist:
        company = None
    if(company == None):
        return redirect('/showcompaniesnew')

    user = request.user
    manager = Manager.objects.get(username = request.user.username)

    if not user.has_perm("DB.can_show_all_companies"):#Если нет доступа к просмотру учреждения - переход на главную
        if(CMSILink.objects.filter(company__id = company.id, manager = manager).count() == 0):
            return redirect('/showcompaniesnew')

    site_user = SiteUser.objects.get(user = request.user)

    allowed_shows = Artist.objects.filter(id__in = CMSILink.objects.filter(manager = manager, company__id = company.id).values("show"))




    return render_to_response('Design/html/companies/company_page/page.html', {'company':company, 'user':site_user, 'shows':allowed_shows})
@login_required(login_url='/logon/')
def company_show_manager_work_content(request):

    company = Company.objects.get(id = request.POST.get('company'))
    manager = Manager.objects.get(username = request.user.username)
    all = False
    if(request.POST.get('artist') == '0'):
        artist = Artist.objects.filter(id__in = CMSILink.objects.filter(manager = manager, company__id = company.id).values("show"))
        all = True

    else:
        artist = Artist.objects.filter(id = request.POST.get('artist'))

    last_call = Call.objects.filter(company = company, artist__in = artist).order_by("-datetime")[:1]
    last_task = Task.objects.filter(company = company.id, artist__in = artist, datetime__lte = datetime.now()).order_by("-datetime")[:1]
    next_task = Task.objects.filter(company = company.id, artist__in = artist, datetime__gte = datetime.now()).order_by("-datetime")[:1]
    last_event = Event.objects.filter(company = company.id, startTime__lte = datetime.now(), artist__in = artist).order_by("-startTime")[:1]
    next_event = Event.objects.filter(company = company.id, startTime__gte = datetime.now(), artist__in = artist).order_by("startTime")[:1]





    #АДМИНСКАЯ ЛАБУДА
    # if(request.user.has_perm("DB.is_siteadmin")):
    #     artists = Artist.objects.all()
    # else:
    #     artists = CMSILink.objects.filter(manager = Manager.objects.get(username = request.user.username), company__id = company.id)



    return render_to_response('Design/html/companies/company_page/aj_manager_work.html', {'last_call':last_call, 'last_task':last_task, 'next_task':next_task, 'last_event':last_event, 'next_event':next_event, 'all_button':all}, context_instance=RequestContext(request))
def company_remove(request):
    company = Company.objects.get(id = request.POST.get('id'))
    result = {}
    if request.user.has_perm("DB.is_siteadmin"):

        result["type"] = "2"
        result["text"] = "Учреждение \"" + company.name + "\" было успешно удалено из базы. Автоматическая переадресация через 5 секунд"
        result["show_time"] = 5000
        result["close_type"] = 0
        #company.delete()
        serialized = json.dumps(result)
        return HttpResponse(serialized)


    return True

#############################################################################################
