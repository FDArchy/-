from django.contrib import admin
from DB.models import Company, Task, Manager, Artist,  Event, City, SiteUser, Call, CMSILink, Presentator, PresentatorEvent, DayOfWeek

class CompanyAdmin(admin.ModelAdmin):
    list_display = ('city', 'name')


class ManagerAdmin(admin.ModelAdmin):
    list_display = ('name',)

class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')

class DayOfWeekAdmin(admin.ModelAdmin):
    list_display = ('name', 'value')

admin.site.register(Company, CompanyAdmin)
admin.site.register(Task)
admin.site.register(Manager, ManagerAdmin)
admin.site.register(Artist, ArtistAdmin)
admin.site.register(Event)
admin.site.register(City)
admin.site.register(SiteUser)
admin.site.register(Call)
admin.site.register(CMSILink)
admin.site.register(Presentator)
admin.site.register(PresentatorEvent)
admin.site.register(DayOfWeek)