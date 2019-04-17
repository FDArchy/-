from django.contrib import admin
from DB.models import Company, Task, Manager, Artist,  Event, City, SiteUser, Call, CMSILink, Presentator, PCSLink, PresentatorEvent, DayOfWeek, TableName, FieldName, ChangeFieldLog, ChangeType, ChatMessage, SiteOptions, SiteUserActivity, SiteUserOptions


class CompanyAdmin(admin.ModelAdmin):
    list_display = ('city', 'name')


class ArtistAdmin(admin.ModelAdmin):
    list_display = ('name', 'id')

class DayOfWeekAdmin(admin.ModelAdmin):
    list_display = ('name', 'value')

class TableNameAdmin(admin.ModelAdmin):
    list_display = ('name',)

class FieldNameAdmin(admin.ModelAdmin):
    list_display = ('name',)
class EventAdmin(admin.ModelAdmin):
    list_display = ('manager', 'startTime', 'company')
class ChangeFieldLogAdmin(admin.ModelAdmin):
    list_display = ('changeType', 'table', 'field', 'value', 'datetime')
class ChangeTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'verbose')
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'table', 'table_link_id', 'message')
class SiteOptionsAdmin(admin.ModelAdmin):
    list_display = ('main_manager_email',)
class PCSILinkAdmin(admin.ModelAdmin):
    list_display = ("presentator", "city")
admin.site.register(Company, CompanyAdmin)
admin.site.register(Task)
admin.site.register(Manager)
admin.site.register(Artist, ArtistAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(City)
admin.site.register(SiteUser)
admin.site.register(SiteUserActivity)
admin.site.register(SiteUserOptions)
admin.site.register(Call)
admin.site.register(CMSILink)
admin.site.register(Presentator)
admin.site.register(PCSLink, PCSILinkAdmin)
admin.site.register(PresentatorEvent)
admin.site.register(DayOfWeek)
admin.site.register(TableName, TableNameAdmin)
admin.site.register(FieldName, FieldNameAdmin)
admin.site.register(ChangeFieldLog, ChangeFieldLogAdmin)
admin.site.register(ChangeType, ChangeTypeAdmin)
admin.site.register(ChatMessage, ChatMessageAdmin)
admin.site.register(SiteOptions, SiteOptionsAdmin)