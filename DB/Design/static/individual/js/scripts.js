

///AJAX MODULE///////////////////////////////////////////////////////////////////////////////////
function AjaxPostParamsToStringTransformer(_params){
    if (typeof (_params) != "object")
        return "";
    var resstring = "";
    for(var key in _params)
    {
        if (key != "")
        {
            if (resstring != "")
            {
                resstring += "&";
            }
            resstring += key.toString() + "=" + encodeURIComponent(_params[key]);
        }
        
    }
    return resstring;
}//Преобразование словаря в строку POST-запроса
function getXMLHTTPRequestObject(){
    var xmlhttp;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            xmlhttp = false;
        }
    }
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
        xmlhttp = new XMLHttpRequest();
    }
    return xmlhttp;
}//Проверка создаваемого объекта запроса (Для IE ActiveX)
function sendAjaxRequest(_type, _adress, _params, _getResponseFunction, _errorFunction, _successFunction) {    
    var xmlhttp = getXMLHTTPRequestObject();
    var timer = setTimeout(ShowNotify, 2000, 0);

        if (_type == "GET") {
            xmlhttp.open('GET', _adress, true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        _getResponseFunction(xmlhttp.responseText);
                        clearTimeout(timer);
                        HideNotify();
                        if (_successFunction)
                            _successFunction();
                    }
                    else {
                        clearTimeout(timer);
                        ShowNotify(1, "Ошибка загрузки данных");
                        if (_errorFunction)
                            _errorFunction();
                    }
                }
            };
            xmlhttp.send(null);
        }
        else if (_type == "POST") {
            xmlhttp.open('POST', _adress, true);
            var params = AjaxPostParamsToStringTransformer(_params);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        _getResponseFunction(xmlhttp.responseText);
                        clearTimeout(timer);
                        HideNotify();

                        if (_successFunction)
                            _successFunction();
                    }
                    else {
                        clearTimeout(timer);
                        ShowNotify(1, "Ошибка загрузки данных");
                        if (_errorFunction)
                            _errorFunction();
                    }
                }
            };
            xmlhttp.send(params);

        }
        else {
            return 0;
        }
    
}
///END AJAX MODULE////////////////////////////////////////////////////////////////////////////////


function showModalWindow(_windowID, currentStatus, resFunction, tittle){
    
    if (currentStatus)    {
        var modalElement = document.getElementById(_windowID);
        modalElement.style.visibility = "visible";
        var topCoord = -1000;
        topCoord -= modalElement.getBoundingClientRect().top;
        topCoord += 60;

        
        //modalElement.style.top = "15%";
        modalElement.style.top = topCoord + "px";
        var modalBackground = document.getElementById("modalWindowBackground");
        modalBackground.style.visibility = "visible";
        
    }
    else     {
        var modalElement = document.getElementById(_windowID);
        modalElement.style.visibility = "hidden";
        modalElement.style.top = "-1000px";
        var modalBackground = document.getElementById("modalWindowBackground");
        modalBackground.style.visibility = "hidden";

        if (resFunction != null)
            resFunction();
    }
    
}


function showModalWindow_new(_button_types, _tittle, _content, _on_ok, _other_buttons)
{
    var modalModule = $('<div>').attr("id", "modal-module");

    var background = $('<div>').attr("id", "modal-window-background");
    background.css("visibility", "visible");
    $(modalModule).append(background);


    var modalWindow = $('<div>').addClass("modalWindow");
    modalWindowID = "modalWindow" + $('.modalWindow').length;
    modalWindow.attr("id", modalWindowID);

    var closeCross = $('<a>').addClass("closecross").attr("onclick", "hideModalWindow('" + modalWindowID + "');");
    var crossIcon = $('<span>').addClass("glyphicon glyphicon-remove btn btn-default");
    closeCross.append(crossIcon);
    modalWindow.append(closeCross);


    var modalTittle = $('<div>').addClass("modalWindowHeader textMiddle");
    modalTittle.html(_tittle);
    $(modalWindow).append(modalTittle);

    var modalContent = $('<div>').addClass("textMiddle");
    modalContent.html(_content);
    $(modalWindow).append(modalContent);

    var container = $('<div>').addClass("textMiddle")
    var buttons = $('<div>').addClass("textFooter displayInline");
    $(container).append(buttons);





    /*


    <div class="textMiddle">
        <div class="textFooter displayInline">
            <input type="button" value="OK" id="modalWindowOkButton">
            &nbsp;
            <input type="button" value="Удалить" id="modalWindowDeleteButton" class="nonDisplay" />
        </div>
    </div>
</div>*/
    switch (_button_types) {
        case "ok":
            var button = $('<input>').attr("type", "button").addClass("btn btn-default").attr("onclick", 'hideModalWindow("' + modalWindowID + '");').val("Oк");
            $(buttons).append(button);


            break;
        case "okcancel":
            debugger;
            var button = $('<input>').attr("type", "button").addClass("btn btn-default").attr("onclick", _on_ok()).val("OК");
            $(buttons).append(button);
            $(buttons).append('<span>&nbsp<span>')
            var button = $('<input>').attr("type", "button").addClass("btn btn-default").attr("onclick", 'hideModalWindow("' + modalWindowID + '");').val("Отмена");
            $(buttons).append(button);
            break;
        case "custom":

           var button = $('<input>').attr("type", "button").addClass("btn btn-default").attr("onclick", _on_ok()).val("OК");
            $(buttons).append(button);
            var button = $('<input>').attr("type", "button").addClass("btn btn-default").attr("onclick", 'hideModalWindow("' + modalWindowID + '");').val("Отмена");
            $(buttons).append(button);
            for(key in _other_buttons){
                var button = $('<input>').attr("type", "button").addClass("btn btn-default").click(_other_buttons[key]).val(key);
                $(buttons).append(button);
                $(buttons).html("&nbsp;");
            }
            break;
        default:
            break;

    }
    $(modalWindow.append(container));
    modalModule.append(modalWindow);
    $('body').append(modalModule);


    var modalElement = document.getElementById(modalWindowID);
        modalElement.style.visibility = "visible";
        var topCoord = -1000;
        topCoord -= modalElement.getBoundingClientRect().top;
        topCoord += 60;


        //modalElement.style.top = "15%";
        modalElement.style.top = topCoord + "px";



}
function hideModalWindow(_windowID)
{
    var modalWindow = $('#' + _windowID)
    modalWindow.css("visibility", "hidden");
    modalWindow.css("top", "-1000px");


    $('#modalWindowBackground').css("visibility", "hidden");
    setTimeout(function(){$(modalWindow).remove()},200);
}

function getCurrentDate() {
    var currentDate = new Date();
    var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    var resultString = currentDate.getDate() + " " + months[currentDate.getMonth()] + " " + currentDate.getFullYear();
    return resultString;
}

function SetCookie(name, value){
    document.cookie = name + "=" + "value";
}
function GetCookie(name){
    var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


function ShowDropDownMenu(menuItemID)//Передает код элемента родителя и параметры для генерации выпадающего списка (нечетный элемент - название пункта, четный - ссылка для перехода)
{
    menuItem = document.getElementById(menuItemID);

    ddFromY = menuItem.getBoundingClientRect().top + pageYOffset;//Вертикальный сдвиг элемента, из которого выпадает меню
    ddFromX = menuItem.getBoundingClientRect().left + pageXOffset;//Горизонтальный сдвиг элемента, из которого выпадает меню


    container = document.createElement("div");
    document.body.appendChild(container);
    container.id = "dropDownList";
    for(i = 1; i < arguments.length; i++)
    {
        if(i % 2 == 0)
        {
            listElement.setAttribute("onclick", ("location.href =\'" +  arguments[i] + "\'"));
            container.appendChild(listElement);

        }
        else
        {
            listElement = document.createElement("div");
            listElement.classList.add("dropDownMenuElement");
            listElement.classList.add("mainMenuElement");
            listElement.innerHTML = arguments[i];
        }
    }

    container.style.position = "absolute";
    container.style.top = ddFromY + 20;//Небольшой сдвиг ниже элемента, из которого выпадает


    if((ddFromX + container.offsetWidth) > document.documentElement.clientWidth) //Если у правого края, тогда выступ влево, чтобы не нужно было прокручивать
    {
        container.style.left = ddFromX - ((ddFromX + container.offsetWidth) - document.documentElement.clientWidth) - 5;

    }
    else//Если посередине, то высчитывается так, чтобы была как раз посередине элемента, под которым возникает
    {
        shift = menuItem.offsetWidth/2 -  container.offsetWidth/2;
        container.style.left = ddFromX + shift;
    }

    document.body.appendChild(container)

    document.body.addEventListener("click", SHIT);
}

///NOTIFY MODULE//////////////////////////////////////////////////////////
function ShowNotify(_type, _notifyText, _closeType, _showTime){

    $('.notification').remove();
    var type = {
        error:1,
        success:2,
        info:3,
        load:0
    };
    var closeType = {
        auto : 0,
        manual : 1
    };
    var notifyElement = $('<div/>', {
        class: 'notification'
    });
    var notifyTitle = $('<div/>', {
        class:"notification-title"
    });
    var notifyText = $('<div/>', {
        class: "notification-text"
    });
    var closeButton = $('<button/>').html("&times");
    closeButton.addClass('close');
    closeButton.attr("onclick", "HideNotify();");
    notifyElement.append(closeButton);
    switch (_type) {
        case type.error:
            notifyTitle.append($('<span/>').html("Ошибка"));
            notifyTitle.children("span").addClass("notification-title-text");
            notifyTitle.addClass("glyphicon glyphicon-remove");
            notifyElement.addClass('notification-error');

            break;
        case type.success:
            notifyTitle.append($('<span/>').html("Успешно"));
            notifyTitle.children("span").addClass("notification-title-text");
            notifyTitle.addClass("glyphicon glyphicon-ok");
            notifyElement.addClass('notification-success');
            break;
        case type.info:
            notifyTitle.append($('<span/>').html("Информация"));
            notifyTitle.children("span").addClass("notification-title-text");
            notifyTitle.addClass("glyphicon glyphicon-info-sign");
            notifyElement.addClass('notification-info');
            break;
        case type.load:
            var container = $('<div/>',{class:'cssload-container'});
            container.append(($('<div/>').addClass("cssload-speeding-wheel")));
            container.append($('<div style ="float:left;"></div>').html("Данные загружаются..."));
            notifyTitle.append(container);
            notifyElement.addClass('notification-info');
            break;
        default:
            alert('Ошибка в выборе типа уведомления. (1 - error, 2 - success, 3 - info, 0 - load)');
            return;
            break;
    }
    notifyElement.append(notifyTitle);
    if(_notifyText != undefined && _notifyText != "")
    {
        notifyText.html(_notifyText);
        notifyElement.append(notifyText);
    }
    $('body').append(notifyElement);
    notifyElement.animate({height : "60px", bottom:"0px", opacity:"1"}, 500);

    if(_closeType == closeType.auto){
        if(_showTime != undefined && _showTime != 0){
            setTimeout(HideNotify, _showTime);
            return;
        }
        else{
            setTimeout(HideNotify, 3500);
            return;
        }

    }
}
function HideNotify(){

    if($('.notification').val() == undefined)
        return;
    $('.notification').animate({height : "-60px", bottom:"0px", opacity:"0"}, 500);
    setTimeout(function(){$('.notification').remove();}, 500);
}
///END NOTIFY MODULE//////////////////////////////////////////////////////

function SHIT(e)//Доделать
{

    /*if(e.target.classList.item(0) == )
    for(i = 0; i < e.target.classList.item.length; i++)
    {
        alert();
        //if(document.getElementsByClassName())
    }
*/
}