from django.db import models
from django.contrib.auth.models import User

class Company(models.Model):#Учреждение
    ctype = models.CharField(max_length = 10,verbose_name = "Тип учреждения", blank=False)
    name = models.CharField(max_length = 80,verbose_name = 'Наименование', null=True)
    manager = models.ForeignKey('Manager', verbose_name="Менеджер", null=True)
    city = models.ForeignKey('City')
    adress = models.CharField(max_length = 100,  verbose_name = 'Адрес', null=True)
    telephone = models.CharField(max_length = 100, verbose_name = 'Телефоны', null=True)
    contacts = models.CharField(max_length = 100, verbose_name = 'Контактные лица', null=True)
    site = models.CharField(max_length=25, verbose_name='Сайт', null=True)
    email = models.CharField(max_length=200, verbose_name='Почта', null=True)
    comment = models.CharField(max_length = 200, verbose_name = 'Комментарии', null=True)
    date = models.DateTimeField(auto_now = True, verbose_name="Дата", null=True)
    lastCall = models.DateTimeField(verbose_name="Последний звонок", null=True)
    def  __str__(self):
        counter = 0
        return u' %s : %s, город: %s %s' % (self.city, self.id, self.name, counter)
    class Meta:
        ordering  = ['city', 'id']
class Call(models.Model):#Звонок с комментарием
    manager = models.ForeignKey('Manager', verbose_name="Менеджер")
    company = models.ForeignKey('Company', verbose_name="Учреждение")
    artist = models.ForeignKey('Artist', verbose_name="Шоу")
    datetime = models.DateTimeField(auto_now = True, verbose_name="Дата")
    comment = models.CharField(max_length=300, verbose_name="Коммент", null=True)
    statsdt = models.DateField(auto_now = True, verbose_name="Статистика Дата", null=True)
    def __str__(self):
        return u'%s:%s:%s' % (self.manager, self.company, self.artist)
class City(models.Model):#Город
    name = models.CharField(max_length = 20, verbose_name='Название города', blank=True)
    def __str__(self):
        return u'%s' %( self.name)
    class Meta:
        ordering = ["name"]
class DayOfWeek(models.Model):
    name = models.CharField(max_length=12, verbose_name="Название", null=False)
    value = models.IntegerField(verbose_name="Код", null=False)
    def  __str__(self):
            return u"%s : %s" % (self.name, self.value)
class Manager(models.Model):#Менеджер. (!ПЕРЕРАБОТАТЬ, ЗАМЕНИТЬ НА SITEUSER!)
        name = models.CharField(max_length = 100, verbose_name = 'Имя менеджера')
        username = models.CharField(max_length = 100, verbose_name = 'Логин')
        class Meta:
            permissions = (
                # Идентификатор права       Описание права
                ("can_work_with_db",               "Может работать с клиентами"),
                ("is_siteadmin", "Может управлять сайтом")
                )
        def  __str__(self):
            return u'%s' % (self.name)
class Presentator(models.Model):
    siteuser = models.OneToOneField('SiteUser')
    cities = models.ManyToManyField('City')
    artists = models.ManyToManyField('Artist')
    #offdays = models.ManyToManyField("DayOfWeek", null=True)
    def __str__(self):
        return  u'%s' % (self.siteuser.name)
class PresentatorEvent(models.Model):
    presentator = models.ForeignKey('Presentator')
    city = models.ForeignKey('City')
    date = models.DateField(verbose_name="День", null=True)
    startTime = models.TimeField(verbose_name = "Время начала", null=True)
    endTime = models.TimeField(verbose_name = "Конец", null=True)
    fullday = models.BooleanField(verbose_name="Весь день", default=False)
    description = models.CharField(max_length = 50, verbose_name="Описание", null=True)
    comment = models.CharField(max_length = 300, verbose_name="Комментарий", null=True)
class Artist(models.Model):#АРТИСТ. (!ПЕРЕРАБОТАТЬ, ЗАМЕНИТЬ НА SITEUSER!)
        name = models.CharField(max_length = 100, verbose_name = 'Наименование коллектива')
        city = models.ForeignKey('City')
        username = models.CharField(max_length = 100, verbose_name = 'Логин')
        color = models.CharField(max_length = 7, verbose_name = 'Цвет', null=True)
        class Meta:
            ordering = ["name"]
        def  __str__(self):
                return u"%s : color: %s" % (self.name, self.color)
class Task(models.Model):#ЗАДАЧА
        manager = models.ForeignKey('Manager')
        company = models.ForeignKey('Company')
        artist = models.ForeignKey('Artist')
        datetime = models.DateTimeField()
        description = models.CharField(max_length = 200, null=True)
        comment = models.CharField(max_length = 700)
        done = models.BooleanField(verbose_name = 'Выполнена', default=True)
        statsdt = models.DateField(auto_now = True, verbose_name="Статистика Дата", null=True)
        def  __str__(self):
                return u'%s:%s' % (self.manager, self.datetime)
class Event(models.Model):#МЕРОПРИЯТИЕ
        artist = models.ForeignKey('Artist')
        manager = models.ForeignKey('Manager')
        startTime = models.DateTimeField(verbose_name = 'Начало', blank=True, null=True)
        price = models.FloatField(verbose_name = 'Стоимость', blank=True, null=True)
        percent = models.IntegerField(verbose_name = 'Процент', blank=True, null=True)
        childCount = models.IntegerField(verbose_name = 'Число детей', blank=True, null=True)
        note = models.CharField(max_length = 200, verbose_name = 'Примечание', blank=True, null=True)
        companyNote = models.CharField(max_length = 200, verbose_name = 'Заметка филиала', blank=True, null=True)
        attentionCallWeekBool = models.BooleanField(verbose_name = 'Обзвон за неделю чек', default=False)
        attentionCallWeekDone = models.BooleanField(verbose_name = 'Обзвон за неделю выполнен', default=False)
        attentionCallWeekComment = models.CharField(max_length = 200, verbose_name = 'Обзвон за неделю коммент', blank=True, null=True)
        attentionCallDayBool = models.BooleanField(verbose_name = 'Обзвон за день чек', default=False)
        attentionCallDayDone = models.BooleanField(verbose_name = 'Обзвон за день выполнен', default=False)
        attentionCallDayComment = models.CharField(max_length = 200, verbose_name = 'Обзвон за день коммент', blank=True, null=True)
        crashBool = models.BooleanField(verbose_name = 'Слет чек', default=False)
        crash = models.CharField(max_length = 200, verbose_name = 'Слет коммент', blank=True, null=True)
        company = models.ForeignKey('Company', blank=True, null=True)
        artistNote = models.CharField(max_length = 500, verbose_name = 'Комментарий артиста', blank=True, null=True)
        resultSum = models.FloatField(verbose_name = 'Итоговая сумма', blank=True, null=True)
        statsdt = models.DateField(auto_now = True, verbose_name="Статистика Дата", null=True)
        def  __str__(self):
                return u'%s' % (self.startTime)
class SiteUser(models.Model):#ПОЛЬЗОВАТЕЛЬ САЙТА (Включает права)
    user = models.OneToOneField(User)
    accountType = models.IntegerField(verbose_name = 'Тип аккаунта', blank=True, null=True)
    name = models.CharField(max_length = 100, verbose_name = 'Имя пользователя')
    city = models.ForeignKey(City, related_name="userCity")
    allowedCities = models.ManyToManyField(City)
    def  __str__(self):
        return u"%s : %s" % (self.user, self.name)
class CMSILink(models.Model): #CityManagerShow Individual Link. Необходимо для определения индивидуальных учреждений для менеджера.
    manager = models.ForeignKey('Manager', verbose_name = 'Менеджер', null=False)
    company = models.ManyToManyField('Company', verbose_name = 'Учреждение', null=True)
    show = models.ForeignKey(Artist, verbose_name = 'Шоу', null=False)
    def  __str__(self):
        return u"%s : %s" % (self.manager.name, self.show.name)
        
               

