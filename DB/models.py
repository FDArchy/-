from django.db import models
from django.contrib.auth.models import User
import datetime


class Artist(models.Model):  # ШОУ
    name = models.CharField(max_length=100, verbose_name='Наименование коллектива')
    color = models.CharField(max_length=7, verbose_name='Цвет', null=False, default="")
    class Meta:
        ordering = ["name"]
    def __str__(self):
        return u"%s : color: %s" % (self.name, self.color)
class City(models.Model):#Город
    name = models.CharField(max_length = 20, verbose_name='Название города', blank=False, null=False)
    worked_shows = models.ManyToManyField("Artist", verbose_name="Рабочие шоу", null=True)
    enabled = models.BooleanField(verbose_name="Доступность", blank=False, null=False, default=True)
    def __str__(self):
        return u'%s' %( self.name)
    class Meta:
        ordering = ["name"]
class SiteUserOptions(models.Model):#Настройки пользователя
    admin_mode = models.BooleanField(verbose_name = 'Режим администратора', default=False, blank=False, null=False)
    cities_changed = models.BooleanField(verbose_name="Статус обновления городов", default=True)
    clients_page_companies_count = models.IntegerField(verbose_name="Число отображаемых компаний на странице клиентов", default=30)
    full_list_page_companies_count = models.IntegerField(verbose_name="Число отображаемых компаний в полном списке", default=20)
    clients_page_order_by = models.CharField(max_length=25, verbose_name="Поле сортировки на странице клиентов", default="city__name")
    clients_full_list_order_by = models.CharField(max_length=25, verbose_name="Поле сортировки на странице полного списка клиентов", default="city__name")
    logout_request = models.BooleanField(verbose_name="Запрашивать подтверждение при выходе", default=True)
    company_page_calendar = models.BooleanField(verbose_name="Показывать календарь на страницах компаний", default=True)
    full_list_tasks_month_count = models.IntegerField(verbose_name="Число последних месяцев полного списка для задач", default=3)
    full_list_events_month_count = models.IntegerField(verbose_name="Число последних месяцев полного списка для мероприятий", default=3)
    can_show_all_companies = models.BooleanField(verbose_name="Доступ к просмотру абсолютно всех компаний", default=False)
    can_show_allien_companies = models.BooleanField(verbose_name="Может просматривать занятые компании", default=False)
    can_add_companies_to_self = models.BooleanField(verbose_name="Может добавлять себе компании", default=False)
    full_access_cities_list = models.ManyToManyField('City', related_name='full_access_cities', verbose_name='Список городов, к которым есть полный доступ на просмотр компаний', null=True, blank=True)
    can_change_event_percents = models.BooleanField(verbose_name="Может редактировать проценты своих мероприятий", default=False)
    can_show_allowed_cities_events = models.BooleanField(verbose_name="Может просматривать мероприятия доступного города", default=True)
    can_own_companies_free = models.BooleanField(verbose_name="Может освобождать свои компании", default=False)
    hide_done_tasks =  models.BooleanField(verbose_name="Не отображать выполненные задачи", default=False)
    larger_font = models.BooleanField(verbose_name="Увеличенный шрифт в программе", default=False)
    scrolltop_show = models.BooleanField(verbose_name="Отображать кнопку быстрой прокрутки", default=True)
    presentator_show_events_limit = models.IntegerField(verbose_name="Ограничение просмотра компаний артистом", default=400)
    only_own_tasks_for_admin = models.BooleanField(verbose_name="Отображать только свои задачи в режиме админа", default=True)
    def __str__(self):
        return u"%s" % (self.admin_mode)
class SiteUser(models.Model):#ПОЛЬЗОВАТЕЛЬ САЙТА (Включает права)
    user = models.OneToOneField(User, blank=False, null=False, on_delete=models.CASCADE)
    alias = models.CharField(max_length=100, verbose_name='Псевдоним', blank=True, null=False, default="")
    name = models.CharField(max_length = 100, verbose_name = 'Имя пользователя', blank=False, null=False, default="")
    email = models.CharField(max_length = 100, verbose_name = 'Почта', blank=True, null=False, default="")
    adress = models.CharField(max_length = 100, verbose_name = 'Адрес', blank=True, null=False, default="")
    contacts = models.CharField(max_length= 100, verbose_name='Контакты', blank=True, null=False, default="")
    password = models.CharField(max_length = 30, verbose_name='Пароль', blank=False, null=False, default="")
    type = models.CharField(max_length = 15, verbose_name='Тип', blank=True, null=False, default="m")
    active = models.BooleanField(verbose_name = 'Включен', default=True, blank=False, null=False)
    deleted = models.BooleanField(verbose_name = 'Удален', default=False, blank=False, null=False)
    lastActivity = models.DateTimeField(verbose_name="Дата последней активности", blank=False, null=False, default=datetime.datetime.now())
    options = models.OneToOneField(SiteUserOptions, blank=True, null=True, on_delete=models.CASCADE)
    def  __str__(self):
        return u"%s : %s" % (self.user, self.name)
class SiteUserActivity(models.Model):
    siteUser = models.ForeignKey(SiteUser, verbose_name="Пользователь", blank=False, null=False)
    date = models.DateField(verbose_name="Дата активности", blank=False, null=False)
    activityTime = models.IntegerField(verbose_name="Время активности в секундах", blank=False, null=False)
    def __str__(self):
        return u"%s : %s : %s" %(self.siteUser.name, self.date, self.activityTime)
class Company(models.Model):#Учреждение
    ctype = models.CharField(max_length = 10,verbose_name = "Тип", null=False, blank=False)
    name = models.CharField(max_length = 80,verbose_name = 'Название', null=False, blank=False)
    city = models.ForeignKey('City', null=False, blank=False)
    adress = models.CharField(max_length = 100,  verbose_name = 'Адрес', null=False, blank=False)
    telephone = models.CharField(max_length = 100, verbose_name = 'Телефоны', null=False, blank=True, default="")
    contacts = models.CharField(max_length = 100, verbose_name = 'Контакты', null=False, blank=True, default="")
    site = models.CharField(max_length=25, verbose_name='Сайт', null=False, blank=True, default="")
    email = models.CharField(max_length=200, verbose_name='Почта', null=False, blank=True, default="")
    comment = models.CharField(max_length = 200, verbose_name = 'Комментарий', null=False, blank=True, default="")
    dateAdd = models.DateTimeField(auto_now_add=True, verbose_name="Дата", null=False)
    whoAdd = models.ForeignKey(SiteUser, verbose_name="Добавивший пользователь", null=True, blank=False)
    def  __str__(self):
        counter = 0
        return u' %s : %s, город: %s %s' % (self.city, self.id, self.name, counter)
    class Meta:
        ordering  = ['city', 'id']

class Manager(models.Model):#Менеджер
    siteuser = models.OneToOneField('SiteUser', null=False, blank=False, on_delete=models.CASCADE)
    eventPercent = models.IntegerField(verbose_name = 'Процент менеджера', blank=True, null=False, default=15)
    cities_buf = models.ManyToManyField('City', verbose_name = 'Текущий список городов', null=True, blank=True)#Буфер городов менеджера,
    #необходим для оптимизации запросов к БД, чтобы вместо вычисления списка городов в CMSI-Links, просто брать поле отсюда. Заполняется при
    #вызове функции "Fill_manager_cities_list(_manager)" из views.py для указанного менеджера
    #managerPermissions = models.ManyToManyField('Permission', null=True, blank=False)
    def  __str__(self):
        return u'%s' % (self.siteuser)
class Presentator(models.Model):
    siteuser = models.OneToOneField('SiteUser', null=False, blank=False, on_delete=models.CASCADE)
    eventPercent = models.IntegerField(verbose_name = 'Процент артиста', blank=True, null=False, default=60)
    offdays = models.ManyToManyField("DayOfWeek", null=True, blank=True)
    def __str__(self):
        return  u'%s' % (self.siteuser.name)
class PCSLink(models.Model):
    presentator = models.ForeignKey('Presentator', verbose_name="Презентатор", null=False, blank=False)
    city = models.ForeignKey('City', verbose_name="Город", null=False, blank=False)
    shows = models.ManyToManyField('Artist', verbose_name='Артисты', null=True, blank=False)
class Call(models.Model):#Звонок с комментарием
    manager = models.ForeignKey('Manager', verbose_name="Менеджер", blank=False, null=False)
    company = models.ForeignKey('Company', verbose_name="Учреждение", blank=False, null=False)
    artist = models.ForeignKey('Artist', verbose_name="Шоу", blank=False, null=False)
    datetime = models.DateTimeField(verbose_name="Дата", blank=False, null=False)
    comment = models.CharField(max_length=300, verbose_name="Коммент", blank=True, null=True, default="")
    statsdt = models.DateTimeField(auto_now_add = True, verbose_name="Статистика Дата", null=True)
    type = models.CharField(max_length=10, verbose_name="Тип звонка", blank=True, null=False, default="company")
    def __str__(self):
        return u'%s:%s:%s' % (self.manager, self.company, self.artist)
class Task(models.Model):#ЗАДАЧА
    manager = models.ForeignKey('Manager', blank=False, null=False)
    company = models.ForeignKey('Company', blank=True, null=True)
    artist = models.ForeignKey('Artist', blank=True, null=True)
    datetime = models.DateTimeField(verbose_name="Дата", blank=False, null=False)
    description = models.CharField(max_length = 200, null=False, blank=False, default="")
    comment = models.CharField(max_length = 700, blank=True, null=True)
    done = models.BooleanField(verbose_name = 'Выполнена', default=False)
    doneDateTime = models.DateTimeField(verbose_name="Дата выполнения задачи", null=True)
    statsdt = models.DateTimeField(auto_now_add = True, verbose_name="Статистика Дата", null=True)
    type = models.CharField(max_length=10, verbose_name="Тип задачи", blank=True, null=False, default="company")
    assigned_by = models.ForeignKey('SiteUser', verbose_name="Кто назначил", null=True)
    def  __str__(self):
            return u'%s:%s' % (self.manager, self.datetime)

class Event(models.Model):#МЕРОПРИЯТИЕ
    artist = models.ForeignKey('Artist', blank=False, null=False)
    manager = models.ForeignKey('Manager', blank=False, null=False)
    startTime = models.DateTimeField(verbose_name = 'Начало', blank=False, null=True, default=datetime.datetime.now())
    price = models.FloatField(verbose_name = 'Стоимость', blank=True, null=True, default=0)
    percent = models.IntegerField(verbose_name = 'Процент перечисления', blank=True, null=True, default=0)
    sumPercent = models.FloatField(verbose_name='Процент менеджера', blank=True, null=True, default=15)
    childCount = models.IntegerField(verbose_name = 'Число детей', blank=True, null=True, default=0)

    companyNote = models.CharField(max_length = 200, verbose_name = 'Заметка филиала', blank=True, null=True, default="")

    callDay = models.ForeignKey(Call, verbose_name="Обзвон за день", related_name='call_day', blank=False, null=True)
    callWeek = models.ForeignKey(Call, verbose_name="Обзвон за неделю", related_name='call_week', blank=False, null=True)
    callMonth = models.ForeignKey(Call, verbose_name="Обзвон за месяц", related_name='call_month', blank=False, null=True)
    taskDay = models.ForeignKey(Task, verbose_name="Задача за день", related_name='task_day', blank=False, null=True)
    taskWeek = models.ForeignKey(Task, verbose_name="Задача за неделю", related_name='task_week', blank=False, null=True)
    taskMonth = models.ForeignKey(Task, verbose_name="Задача за месяц", related_name='task_month', blank=False, null=True)

    # MARKTOREMOVE##########################################################################################################
    attentionCallWeekBool = models.BooleanField(verbose_name='Обзвон за неделю чек', default=False)
    attentionCallWeekDone = models.BooleanField(verbose_name='Обзвон за неделю выполнен', default=False)
    attentionCallWeekComment = models.CharField(max_length=200, verbose_name='Обзвон за неделю коммент', blank=True,
                                                null=True)
    attentionCallDayBool = models.BooleanField(verbose_name='Обзвон за день чек', default=False)
    attentionCallDayDone = models.BooleanField(verbose_name='Обзвон за день выполнен', default=False)
    attentionCallDayComment = models.CharField(max_length=200, verbose_name='Обзвон за день коммент', blank=True,
                                               null=True)
    attentionCallMonthBool = models.BooleanField(verbose_name='Обзвон за месяц чек', default=False)
    attentionCallMonthDone = models.BooleanField(verbose_name='Обзвон за месяц выполнен', default=False)
    attentionCallMonthComment = models.CharField(max_length=200, verbose_name='Обзвон за месяц коммент', blank=True,
                                                 null=True)
    ##########################################################################################################
    crashBool = models.BooleanField(verbose_name = 'Слет чек', default=False)
    crash = models.CharField(max_length = 200, verbose_name = 'Слет коммент', blank=True, null=False, default="")
    company = models.ForeignKey('Company', blank=False, null=True)
    companyName = models.CharField(max_length = 80,verbose_name = 'Название для артиста', null=True, blank=False, default="")
    companyAdress = models.CharField(max_length = 100,  verbose_name = 'Адрес для артиста', null=False, blank=False, default="")
    companyContacts = models.CharField(max_length = 100, verbose_name = 'Контакты для артиста', null=True, blank=True, default="")
    note = models.CharField(max_length=300, verbose_name='Примечание', blank=True, null=True, default="")

    artistNote = models.CharField(max_length = 500, verbose_name = 'Комментарий артиста', blank=True, null=False, default="")
    resultSum = models.FloatField(verbose_name = 'Итоговая сумма', blank=True, null=True, default=0)

    sumTransfered = models.FloatField(verbose_name = 'Сумма перечисления', blank=True, null=False, default=0)
    removed = models.BooleanField(verbose_name = 'Удалено чек', default=False)
    removedDescription = models.CharField(max_length = 300, verbose_name = 'Удалено коммент', blank=True, null=True)
    statsdt = models.DateTimeField(auto_now_add = True, verbose_name="Статистика Дата", null=True)
    def  __str__(self):
            return u'%s' % (self.startTime)
class PresentatorEvent(models.Model):
    presentator = models.ForeignKey('Presentator', blank=False, null=False)
    date = models.DateField(verbose_name="День" , default=datetime.datetime.now())#? blank, null? LABEL
    startTime = models.TimeField(verbose_name = "Время начала", null=True)#?
    endTime = models.TimeField(verbose_name = "Конец", null=True)#?
    fullday = models.BooleanField(verbose_name="Весь день", default=False, blank=True, null=False)
    description = models.CharField(max_length = 50, verbose_name="Описание", null=True, blank=True)
    comment = models.CharField(max_length = 300, verbose_name="Комментарий", null=True, blank=True)
    statsdt = models.DateField(auto_now = True, verbose_name="Статистика Дата", null=True)

class CMSILink(models.Model): #CityManagerShow Individual Link. Необходимо для определения индивидуальных учреждений для менеджера.
    manager = models.ForeignKey('Manager', verbose_name = 'Менеджер', null=False, blank=False)
    show = models.ForeignKey(Artist, verbose_name = 'Шоу', null=False, blank=False)
    company = models.ManyToManyField('Company', verbose_name = 'Учреждения', null=True, blank=False)
    def  __str__(self):
        return u"%s : %s" % (self.manager.siteuser.name, self.show.name)
class DayOfWeek(models.Model):
    name = models.CharField(max_length=12, verbose_name="Название", null=False, blank=False)
    value = models.IntegerField(verbose_name="Код", null=False, blank=False)
    def  __str__(self):
            return u"%s : %s" % (self.name, self.value)

class TableName(models.Model):
    name = models.CharField(max_length=20, verbose_name="Название таблицы", blank=False, null=False)
    verbose = models.CharField(max_length=20, verbose_name="Описание таблицы", blank=False, null=False)
    def  __str__(self):
        return u"%s"% (self.name)
class FieldName(models.Model):
    name = models.CharField(max_length=20, verbose_name="Название поля", blank=False, null=False)
    verbose = models.CharField(max_length=20, verbose_name="Описание поля", blank=False, null=False)
    def  __str__(self):
        return u"%s" % (self.name)
class ChangeType(models.Model):
    name = models.CharField(max_length=20, verbose_name="Действие", blank=False, null=False)
    verbose = models.CharField(max_length=20, verbose_name="Описание действия", blank=False, null=False)
    def  __str__(self):
        return u"%s" % (self.name)
class ChangeFieldLog(models.Model):
    link_to_object_id = models.IntegerField(verbose_name="Код элемента, к которому делалась запись в лог", blank=True, null=True)
    link_to_object_table = models.ForeignKey(TableName, verbose_name="Название таблицы элемента, к которому делалась запись в лог", related_name='link_to_object_table', blank=True, null=True)
    table_link_id = models.IntegerField(verbose_name="Код объекта в измененной таблице", blank=False, null=False)
    changeType = models.ForeignKey(ChangeType, verbose_name="Тип изменения", blank=False, null=False)
    table = models.ForeignKey(TableName, verbose_name="Название таблицы", blank=False, null=False)
    field = models.ForeignKey(FieldName, verbose_name="Название поля", blank=True, null=True)
    value = models.CharField(max_length=300, verbose_name="Значение поля", blank=False, null=False)
    datetime = models.DateTimeField(auto_now_add = True, verbose_name="Дата изменения", null=False)
    whoChange = models.ForeignKey(SiteUser, verbose_name="Пользователь, изменивший поле", blank=False, null=False)
    whoViewChange = models.ManyToManyField(SiteUser, verbose_name="Кто видел изменения", related_name='change_viewers', blank=True, null=True)
    bufStrField1 = models.CharField(max_length=150, verbose_name="Вспомогательное текстовое поле 1", blank=True, null=True)
    bufStrField2 = models.CharField(max_length=150, verbose_name="Вспомогательное текстовое поле 2", blank=True, null=True)
    def  __str__(self):
        return u"%s : %s : %s" % (self.changeType, self.table.name, self.field.name)

class ChatMessage(models.Model):
    sender = models.ForeignKey(SiteUser, verbose_name = 'Пользователь сайта', null=False, blank=False)
    message = models.CharField(max_length=200, verbose_name="Текст сообщения", blank=False, null=False)
    table = models.ForeignKey(TableName, verbose_name="Таблица соответствия", blank=True, null=True)
    table_link_id = models.IntegerField(verbose_name="Код объекта в измененной таблице", blank=True, null=True)
    viewers = models.ManyToManyField(SiteUser, verbose_name="Кто читал сообщения", related_name='message_viewers', blank=True, null=True)
    datetime = models.DateTimeField(auto_now_add = True, verbose_name="Дата создания", null=False)
    def  __str__(self):
        return u"%s : %s" % (self.sender.name, self.message)

class SiteOptions(models.Model):
    main_manager_email = models.CharField(max_length=50, verbose_name="Контактный email управляющего", blank=False, null=False, default="mirgorodskayam@bk.ru")
    developer_email = models.CharField(max_length=50, verbose_name="Контактный email разработчика", blank=False, null=False, default="fd_archy@mail.ru")

    manager_lesson_link = models.CharField(max_length=200, verbose_name="Ссылка на руководство для менеджера", blank=False, null=False, default="")
    presentator_lesson_link = models.CharField(max_length=200, verbose_name="Ссылка на руководство для артиста",blank=False, null=False, default="")
    admin_lesson_link = models.CharField(max_length=200, verbose_name="Ссылка на руководство для администратора",blank=False, null=False, default="")

    sippoint_login = models.CharField(max_length=40, verbose_name="SipPoint логин", blank=False, null=False, default="smtp.yandex.ru:465")
    sippoint_password = models.CharField(max_length=40, verbose_name="SipPoint пароль", blank=False, null=False, default="smtp.yandex.ru:465")

    informer_out_server = models.CharField(max_length=200, verbose_name="Почтовый сервер", blank=False, null=False, default="smtp.yandex.ru:465")
    informer_out_port = models.CharField(max_length=200, verbose_name="Исходящий порт сервера", blank=False, null=False, default= "5434")
    informer_in_port = models.CharField(max_length=200, verbose_name="Входящий порт сервера", blank=False, null=False, default="")
    informer_password = models.CharField(max_length=200, verbose_name="Пароль пользователя почты", blank=False, null=False, default="899#SS900")
    informer_login = models.CharField(max_length=200, verbose_name="Логин пользователя почты", blank=False, null=False, default= "sc-inform")
    def  __str__(self):
        return u"%s" % (self.main_manager_email)