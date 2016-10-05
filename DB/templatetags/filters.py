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
        abs_difference = abs(int(difference.days))
        end_word = ""
        if(abs_difference < 10 or abs_difference > 20):

            if(abs_difference % 10 == 1):
                end_word = "день"
            if(abs_difference % 10 > 1 and abs_difference % 10 < 5):
                end_word = "дня"
            if(abs_difference % 10 > 4 or abs_difference == 0):
                end_word = "дней"
        else:
            end_word = "дней"
        if(difference.days < 0):

            resstring = "Через " + str(-difference.days) + " " + end_word# + " дней."

        elif(difference.days > 0):
            resstring = str(difference.days) + " " + end_word + " назад"
        else:
            resstring = "Сегодня"
        return resstring

@register.filter(name='cutter')
def cutter(_value, _symb_count):
    if _value == None:
        return ""
    result = _value[:_symb_count - 3]

    if(result != _value):
        result = result.strip() + "..."


    return  result

@register.filter(name='replacenone')
def replaceNone(_value):
    if (_value == None or _value == "None"):
        return ""
    else:
        return _value