from django.core.paginator import Paginator
from django import template
from DB.models import Event
from DB.models import Manager
register = template.Library()
import  datetime

def cut(value, arg):
    "Удаляет все значения аргумента arg из строки value"
    return value.replace(arg, '')

@register.filter(name='replacepoint')
def replacepoint(_value):
    _value = str(_value)
    return _value.replace(',', '.')
@register.filter(name='checkevent')
def checkEvent(_value, _currentManager):
    if(Event.objects.get(id = _value).manager.username == _currentManager):
        return True;
    else:
        return False;
@register.filter(name='datecountdown')
def dateCountdown(_value):
    splitted = str(_value).split('-')
    if(splitted[0] == ''):
        return False
    else:
        compared = datetime.datetime(int(splitted[0]), int(splitted[1]), int(splitted[2]))
        now = datetime.datetime.now();
        difference = now-compared;
        if(difference.days < 0):
            resstring = "Через " + str(-difference.days) + " дней."
        elif(difference.days > 0):
            resstring = str(difference.days) + " дней назад"
        else:
            resstring = "Сегодня"
        return resstring

@register.filter(name='replacenone')
def replaceNone(_value):
    if (_value == None or _value == "None"):
        return ""
    else:
        return _value