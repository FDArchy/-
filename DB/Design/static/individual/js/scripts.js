

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

//MODAL WINDOWS Module////////////////////////////////////////////////////////////////////////////////
function showModalWindow(_windowID, currentStatus, resFunction, tittle){
    
    if (currentStatus)    {
        var modalElement = document.getElementById(_windowID);
        modalElement.style.visibility = "visible";
        var topCoord = -1000;
        topCoord -= modalElement.getBoundingClientRect().top;
        topCoord += 60;

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
    
}//Переделать на новую функцию


function showModalWindow_new(_button_types, _tittle, _content, _on_ok, _other_buttons){

    var allModalWindows = $('.modalWindow');

    for(i = 0; i < allModalWindows.length; i++)    {
        var newLeftIndent = parseInt($(allModalWindows[i]).css("left")) - 600;
        $(allModalWindows[i]).animate({
            left: newLeftIndent + "px"
        }, 50)
    }//Сдвигаем все открытые окна влево на 600

    var modalModule;
    if($('#modal-module').val() == undefined){//Если контейнера нет, тогда создать его

        var modalModule = $('<div>').attr("id", "modal-module");

        var background = $('<div>').attr("id", "modalWindowBackground");
        background.attr('onclick', "hideAllModalWindows();");

        $(modalModule).append(background);
        $('body').append(modalModule);
    }
    else{
        modalModule = $('#modal-module');
        var background = $('#modalWindowBackground');
    }
    background.css("visibility", "visible");





    var modalWindow = $('<div>').addClass("modalWindow");
    modalWindowID = "modalWindow" + $('.modalWindow').length;
    $(modalWindow).addClass("container-fluid panel panel-primary");


    var panelTitle = $('<div>').addClass("row panel-heading");


    var closeCross = $('<a>').addClass("closecross").attr("onclick", "hideModalWindow('" + modalWindowID + "');");
    var crossIcon = $('<span>').addClass("glyphicon glyphicon-remove btn btn-primary");
    closeCross.append(crossIcon);
    panelTitle.append(closeCross);

    var tittleText = $('<div>').addClass("modalWindowHeader textMiddle");
    tittleText.html(_tittle);
    tittleText.attr("style", "color:#fff");
    $(panelTitle).append(tittleText);

    $(modalWindow).append(panelTitle);

    var panelText = $('<div>').addClass("panel-body textMiddle");
    panelText.html(_content);
    $(modalWindow).append(panelText);
    modalWindow.attr("id", modalWindowID);




    var footer = $('<div>').addClass("textMiddle footer panel-footer");

    var buttons = $('<div>').addClass("displayInline");
    $(footer).append(buttons);


    switch (_button_types) {
        case "ok":
            var button = $('<input>').attr("type", "button").addClass("btn btn-default").attr("onclick", 'hideModalWindow("' + modalWindowID + '");').val("Oк");
            $(buttons).append(button);
            break;
        case "okcancel":
            var button = $('<input>').attr("type", "button").addClass("btn btn-default").val("OК");
            $(button).click(_on_ok);
            $(buttons).append(button);
            $(buttons).append('<span>&nbsp</span>');
            var button = $('<input>').attr("type", "button").addClass("btn btn-default").attr("onclick", 'hideModalWindow("' + modalWindowID + '");').val("Отмена");
            $(buttons).append(button);
            break;
        case "custom":

           var button = $('<input>').attr("type", "button").addClass("btn btn-default").val("OК");
            $(button).click(_on_ok);
            $(buttons).append(button);
            $(buttons).append('<span>&nbsp</span>');
            var button = $('<input>').attr("type", "button").addClass("btn btn-default").attr("onclick", 'hideModalWindow("' + modalWindowID + '");').val("Отмена");
            $(buttons).append(button);
            $(buttons).append('<span>&nbsp</span>');
            for(key in _other_buttons){
                var button = $('<input>').attr("type", "button").addClass("btn btn-default").val(key);
                button.click(_other_buttons[key]);
                $(buttons).append(button);
                $(buttons).append('<span>&nbsp</span>');
            }
            break;
        default:
            break;

    }


    $(modalWindow.append(footer));
    modalModule.append(modalWindow);

    var topCoord = -1000;
    topCoord -= $(modalWindow).offset().top  - $(window).scrollTop();
    topCoord += 60;



    modalWindow.animate({
        top:topCoord + "px"
    }, 50).css("visibility", "visible");

    if($(modalWindow).outerHeight() < $(modalWindow)[0].scrollHeight){
        $(footer).css("position", "static");
    }
    else{
        $(footer).css("position", "absolute");
    }


}
function hideModalWindow(_modalWindowID){

    var modalWindow = $('#' + _modalWindowID);

    var allModalWindows = $('.modalWindow');

    var modalWindowNumber = parseInt(_modalWindowID.replace("modalWindow",""));
    var modalWindowNumberLast = allModalWindows.length - 1;
    var modalWindowNumberFirst = 0;
    var shift = modalWindowNumberLast - modalWindowNumber + 1;


    $(modalWindow).css("visibility", "hidden");
    $(modalWindow).css("top", "-1000px");

    setTimeout(function(){$(modalWindow).remove()},100);


    for(i = modalWindowNumber; i < modalWindowNumberLast + 1; i++){
            $(allModalWindows[i]).css("visibility", "hidden");
            $(allModalWindows[i]).css("top", "-1000px");
            setTimeout(function(){$(allModalWindows[i]).remove()},100);

            //setTimeout(function(){$(modalWindow).remove()},300);
        }//Если закрывается рождающее, тогда порожденные удаляются
        for(i = modalWindowNumberFirst; i < modalWindowNumberLast; i++)    {
            var newLeftIndent = parseInt($(allModalWindows[i]).css("left")) + 600 * shift;
            $(allModalWindows[i]).animate({
                left: newLeftIndent + "px"
                }, 50);
            }
    if(modalWindowNumber == 0){
        $('#modalWindowBackground').css("visibility", "hidden");
        setTimeout(function(){$('#modal-module').remove()},200);
    }


}
function hideAllModalWindows(){

    var modalWindows = $('.modalWindow');
    for (i = 0; i < modalWindows.length; i++)
    {
        var modalWindow = $('#' + $(modalWindows[i]).attr('id'));
        modalWindow.css("visibility", "hidden");
        modalWindow.css("top", "-1000px");
    }
    $('#modalWindowBackground').css("visibility", "hidden");

    setTimeout(function(){$('#modal-module').remove()},200);
}
//END MODAL WINDOWS Module/////////////////////////////////////////////////////////////////////////////


function getCurrentDate() {
    var currentDate = new Date();
    var months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    var resultString = currentDate.getDate() + " " + months[currentDate.getMonth()] + " " + currentDate.getFullYear();
    return resultString;
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

        _type = String(_type);
        _showTime = String(_showTime);
    $('.notification').remove();
    var type = {
        error:"1",
        success:"2",
        info:"3",
        load:"0"
    };
    var closeType = {
        auto : "0",
        manual : "1"
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

//PAGE DATA FILLER////////////////////////////////////////////////////////
function FillPageDataFromPython(_data){
    data = $.parseJSON(_identifier, _data);
    for(i in data)
    {
        $('#' + _identifier + "_" + i).html(_data[i]);
    }
}
function FillPageDataFromJS(_recieverID, _transmitterID, _fields){
    for(i in _fields)
    {
        $('#' + _recieverID + "_" + _fields[i]).html($('#' + _transmitterID + "_" + _fields[i]).html());
    }

}
//END PAGE DATA FILLER MODULE