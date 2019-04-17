//CONTROL CARCASS CREATOR=================================================================================================
function ChooseNavMenuItem(_section, _statsOnly, _userType) {
    if(!_statsOnly){
        $('#controlNavbar li').removeClass("active");
        $("#controlNavbar li[data-label=\"" + _section + "\"]").addClass("active");
        $('#control_contentContainer').attr("data-current_section", _section);
        WriteCookie({
            control_choosen_section: _section
        });
    }

    $('#control_contentContainer').empty();
    ClearSearchPanelValue();

    switch (_section){
        case "users":
            MakeUsersFrame();
            break;
        case "options":
            OptionsLoad();
            break;
        case "lists":
            MakeListsFrame();
            break;
        case "upload":
            MakeUnloadFrame();
            break;
        case "stats":
            MakeStatsFrame(_userType);
            break;
        default:
            break;
    }
}
function MakeUsersFrame() {
    //Получение данных контейнера
    var frameContainer = $('#control_contentContainer');

    //Статичные данные заголовка
    var header = $('<div>').addClass("usr-header").appendTo(frameContainer);
    //Динамический контент
    var content = $('<div>').addClass("usr-content").appendTo(frameContainer);

    //header
    var table = $('<table>').attr("width", "100%").appendTo(header);
    var tr = $('<tr>').appendTo(table);
    var td = $('<td>').attr("width", "5%").appendTo(tr);
    var span = $('<span>').addClass("events_add_event_button-decoration").attr("title", "Добавить пользователя").css("margin-left", "10px").appendTo(td);
    $('<span>').addClass("glyphicon glyphicon-plus").appendTo(span);
    span.click(function () {
        AddUser($('#usrTypeChoose').val());
    });
    td = $('<td>').attr("width", "45%").appendTo(tr);
    //type user
    var select = $('<select>').attr("id", "usrTypeChoose").addClass("value").appendTo(td);
    $('<option>').attr("value", "Менеджеры").text("Менеджеры").appendTo(select);
    $('<option>').attr("value", "Артисты").text("Артисты").appendTo(select);
    td = $('<td>').attr("width", "40%").appendTo(tr);
    //status user
    var select = $('<select>').attr("id", "usrStatusChoose").addClass("value").appendTo(td);
    $('<option>').attr("value", "Активныеизаблокированные").text("Активные и заблокированные").appendTo(select);
    $('<option>').attr("value", "Все").text("Все").appendTo(select);
    $('<option>').attr("value", "Активные").css("color", "green").text("Активные").appendTo(select);
    $('<option>').attr("value", "Заблокированные").text("Заблокированные").appendTo(select);
    $('<option>').attr("value", "Удаленные").text("Удаленные").appendTo(select);
    //content
    var usrPagination = $('<div>').attr("id", "usrPagination").appendTo(content);
    var usrContent = $('<div>').attr("id", "usrContent").css("border", "1px solid #d7d8db").css("padding", "5px").css("border-radius", "5px").appendTo(content);


    $('#usrTypeChoose').select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Выберите тип пользователей.",
        language: "ru"
    });
    $('#usrTypeChoose').change(function () {
        FillUsersPaginator();
    });
    $('#usrStatusChoose').select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Выберите статус пользователей.",
        language: "ru"
    });
    $('#usrStatusChoose').change(function () {
        FillUsersPaginator();
    });
    FillUsersPaginator();
}
function MakeStatsFrame(_userType){
    //Получение данных контейнера
    var frameContainer = $('#control_contentContainer');
    //Статичные данные заголовка
    var header = $('<div>').addClass("usr-header").appendTo(frameContainer);
    //Динамический контент
    var activityContent = $('<div>').addClass("usr-content").css("margin", "0 auto").css("width", "40%").css("border", "1px solid #d7d8db").css("padding", "5px").css("border-radius", "5px").css("margin-top", "10px").appendTo(frameContainer);

    var fieldsTable = $('<table>').attr("id", "userActivityTable").css("width", "100%").css("margin", "0 auto").appendTo(activityContent);

    var fieldsTr = $('<tr>').appendTo(fieldsTable);
    var fieldsTd = $('<td>').addClass("neutral-text").css("width", "50%").text("Последняя активность").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "last_activity").attr("title", "Дата последней активности пользователя").css("text-align", "right").css("font-weight", 600).css("width", "50%").appendTo(fieldsTr);

    var fieldsTr = $('<tr>').appendTo(fieldsTable);
    var fieldsTd = $('<td>').addClass("neutral-text").css("width", "50%").text("Время работы").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "work_time").attr("title", "Время работы пользователя за период").css("text-align", "right").css("font-weight", 600).css("width", "50%").appendTo(fieldsTr);

    var fieldsTr = $('<tr>').appendTo(fieldsTable);
    var fieldsTd = $('<td>').addClass("neutral-text").css("width", "50%").text("Зарплата за период").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "manager_salary").attr("title", "Финансы менеджера за период").css("text-align", "right").css("font-weight", 600).css("width", "50%").appendTo(fieldsTr);


    var statsContent = $('<div>').addClass("usr-content").css("margin", "0 auto").css("width", "40%").css("border", "1px solid #d7d8db").css("padding", "5px").css("border-radius", "5px").css("margin-top", "10px").appendTo(frameContainer);

    //header
    var table = $('<table>').attr("width", "100%").appendTo(header);
    var tr = $('<tr>').appendTo(table);

    //user type
    td = $('<td>').attr("width", "12%").appendTo(tr);
    var select = $('<select>').attr("id", "statsType").attr("disabled","disabled").addClass("value").appendTo(td);
    $('<option>').attr("value", "Менеджер").text("Менеджер").appendTo(select);
    //manager
    td = $('<td>').attr("width", "30%").appendTo(tr);
    var select = $('<select>').attr("id", "statsUser").addClass("value").appendTo(td);
    //city
    td = $('<td>').attr("width", "25%").appendTo(tr);
    var select = $('<select>').attr("id", "statsCity").addClass("value").appendTo(td);
    //artist
    td = $('<td>').attr("width", "24%").appendTo(tr);
    var select = $('<select>').attr("id", "statsArtist").addClass("value").appendTo(td);



    //Диапазон фильтрации событий
    //Таблица-контейнер
    var table = $('<table>').attr("width", "50%").css("margin", "0 auto").css("margin-top", 10).appendTo(header);
    var tr = $('<tr>').appendTo(table);
    //Сдвиг даты влево
    var td = $('<td>').css("padding-right", 5).appendTo(tr);
    var leftButton = $('<button>').addClass("btn btn-lg").attr("title", "Месяц назад").appendTo(td);
    leftButton.click(function(){
        Stats_ShiftMonth("back");
    });
    var buttonLabel = $('<span>').addClass("glyphicon glyphicon-chevron-left").appendTo(leftButton);

    td = $('<td>').attr("width", "100%").appendTo(tr);
    var rangeContainer = $('<div>').css("float", "right").css("width", "100%").css("margin-top", "2px").appendTo(td);
    var rangeInputContainer = $('<div>').addClass("input-group input-daterange").appendTo(rangeContainer);
    var labelFromSelect = $('<span>').addClass("input-group-addon").css("padding-right", 5).css("user-select", "none").css("border-width", 1).text("От: ").appendTo(rangeInputContainer);
    var fromSelect = $('<input>').addClass("form-control").attr("type", "text").css("text-align", "center").css("user-select", "none").attr("id", "rangeFrom").appendTo(rangeInputContainer);
    labelFromSelect = $('<span>').addClass("input-group-addon").css("padding-right", 5).css("user-select", "none").css("border-width", 1).text("До: ").appendTo(rangeInputContainer);
    var toSelect = $('<input>').addClass("form-control").attr("type", "text").css("text-align", "center").css("user-select", "none").attr("id", "rangeTo").appendTo(rangeInputContainer);

    td = $('<td>').css("padding-left", 5).appendTo(tr);
    var rightButton = $('<button>').addClass("btn btn-lg").attr("title", "Месяц вперед").appendTo(td);
    var buttonLabel = $('<span>').addClass("glyphicon glyphicon-chevron-right").appendTo(rightButton);
    rightButton.click(function(){
        Stats_ShiftMonth("forward");
    });


    var fieldsTable = $('<table>').attr("id", "userStatsTable").css("width", "100%").css("margin", "0 auto").appendTo(statsContent);
    var fieldsTr = $('<tr>').appendTo(fieldsTable);
    var fieldsTd = $('<td>').addClass("neutral-text").css("width", "25%").text("Учреждения").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "companies_count").attr("title", "Число доступных учреждений").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").css("font-weight", 600).css("text-align", "right").css("padding-right", 15).css("width", "65%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').css("padding", 2).css("width", "33px").css("text-align", "right").appendTo(fieldsTr);

    var fieldsTd = $('<td>').css("padding", 2).css("width", "33px").css("text-align", "right").appendTo(fieldsTr);
    var listButton = $('<button>').addClass("btn btn-default btn-sm").attr("title", "Показать список").appendTo(fieldsTd);
    var listButtonIcon = $('<span>').addClass("glyphicon glyphicon-list").appendTo(listButton);
    (function (x) {
        x.click(function () {
            Stats_CompaniesList(_userType);
        })
    })(listButton);

    var fieldsTr = $('<tr>').appendTo(fieldsTable);
    var fieldsTd = $('<td>').addClass("neutral-text").css("width", "25%").text("Звонки").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "calls_count").attr("title", "Число выполненных звонков").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "calls_date").attr("title", "Дата последнего звонка").css("font-weight", 600).css("text-align", "right").css("padding-right", 15).css("width", "65%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').css("padding", 2).css("width", "33px").css("text-align", "right").appendTo(fieldsTr);
    var showLastButton = $('<button>').attr("id", "lastCallButton").addClass("btn btn-default btn-sm").attr("title", "Показать последнее изменение").appendTo(fieldsTd);
    var showLastButtonIcon = $('<span>').addClass("glyphicon glyphicon-chevron-up").appendTo(showLastButton);

    var fieldsTd = $('<td>').css("padding", 2).css("width", "33px").css("text-align", "right").appendTo(fieldsTr);
    var listButton = $('<button>').addClass("btn btn-default btn-sm").attr("title", "Показать список").appendTo(fieldsTd);
    var listButtonIcon = $('<span>').addClass("glyphicon glyphicon-list").appendTo(listButton);
    (function (x) {
        x.click(function () {
            Stats_CallsList();
        })
    })(listButton);

    var fieldsTr = $('<tr>').appendTo(fieldsTable);
    var fieldsTd = $('<td>').addClass("neutral-text").css("width", "25%").text("Задачи").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "tasks_count").attr("title", "Число назначенных задач").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "tasks_done_count").css("text-align", "left").css("font-weight", 600).css("width", "5%").css("color", "green").attr("title", "Число выполненных задач").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "tasks_date").attr("title", "Дата последней назначенной задачи").css("font-weight", 600).css("text-align", "right").css("padding-right", 15).css("width", "65%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').css("padding", 2).css("width", "33px").css("text-align", "right").appendTo(fieldsTr);
    var showLastButton = $('<button>').attr("id", "lastTaskButton").addClass("btn btn-default btn-sm").attr("title", "Показать последнее изменение").appendTo(fieldsTd);
    var showLastButtonIcon = $('<span>').addClass("glyphicon glyphicon-chevron-up").appendTo(showLastButton);
    var fieldsTd = $('<td>').css("padding", 2).css("width", "33px").css("text-align", "right").appendTo(fieldsTr);
    var listButton = $('<button>').addClass("btn btn-default btn-sm").attr("title", "Показать список").appendTo(fieldsTd);
    var listButtonIcon = $('<span>').addClass("glyphicon glyphicon-list").appendTo(listButton);
    (function (x) {
        x.click(function () {
            Stats_TasksList();
        })
    })(listButton);
    var fieldsTr = $('<tr>').appendTo(fieldsTable);
    var fieldsTd = $('<td>').addClass("neutral-text").css("width", "30%").text("Мероприятия").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "events_count").attr("title", "Число прошедших мероприятий").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "events_done_count").css("text-align", "left").css("font-weight", 600).css("width", "5%").css("color", "green").attr("title", "Число завершенных мероприятий").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "events_add_count").css("text-align", "left").attr("title", "Число назначенных мероприятий").css("color", "blue").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "events_date").attr("title", "Дата последнего назначенного мероприятия").css("font-weight", 600).css("text-align", "right").css("padding-right", 15).css("width", "75%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').css("padding", 2).css("width", "33px").css("text-align", "right").appendTo(fieldsTr);
    var showLastButton = $('<button>').attr("id", "lastEventButton").addClass("btn btn-default btn-sm").attr("title", "Показать последнее изменение").appendTo(fieldsTd);
    var showLastButtonIcon = $('<span>').addClass("glyphicon glyphicon-chevron-up").appendTo(showLastButton);
    var fieldsTd = $('<td>').css("padding", 2).css("width", "33px").css("text-align", "right").appendTo(fieldsTr);
    var listButton = $('<button>').addClass("btn btn-default btn-sm").attr("title", "Показать список").appendTo(fieldsTd);
    var listButtonIcon = $('<span>').addClass("glyphicon glyphicon-list").appendTo(listButton);
    (function (x) {
        x.click(function () {
            Stats_EventsList();
        })
    })(listButton);
    var fieldsTr = $('<tr>').appendTo(fieldsTable);
    var fieldsTd = $('<td>').addClass("neutral-text").css("width", "30%").text("События").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "facts_count").attr("title", "Число событий по всей базе за период").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").css("text-align", "left").css("font-weight", 600).css("width", "5%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').addClass("neutral-text").attr("id", "facts_date").css("font-weight", 600).css("text-align", "right").css("padding-right", 15).css("width", "75%").appendTo(fieldsTr);
    var fieldsTd = $('<td>').css("padding", 2).css("width", "33px").css("text-align", "right").appendTo(fieldsTr);
    var showLastButton = $('<button>').addClass("btn btn-default btn-sm").attr("title", "Показать последнее изменение").appendTo(fieldsTd);
    var showLastButtonIcon = $('<span>').addClass("glyphicon glyphicon-chevron-up").appendTo(showLastButton);
    showLastButton.click(function(){
        Stats_LoadLogEntry();
    });
    var fieldsTd = $('<td>').css("padding", 2).css("width", "33px").css("text-align", "right").appendTo(fieldsTr);
    var listButton = $('<button>').addClass("btn btn-default btn-sm").attr("title", "Показать список").appendTo(fieldsTd);
    var listButtonIcon = $('<span>').addClass("glyphicon glyphicon-list").appendTo(listButton);
    (function (x) {
        x.click(function () {
            Stats_LogsList();
        })
    })(listButton);
    fromSelect.datepicker({
        format: "dd MM yyyy",
        language: "ru",
        autoclose: true,
        todayHighlight: true,
        title: "Диапазон: от"

    });
    toSelect.datepicker({
        format: "dd MM yyyy",
        language: "ru",
        autoclose: true,
        todayHighlight: true,
        title: "Диапазон: до"
    });
    var currentDate = new Date();
    currentDate.setDate(1);
    fromSelect.datepicker('update', currentDate);
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(0);
    toSelect.datepicker('update', currentDate);

    $('#statsType').select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Выберите тип пользователz.",
        language: "ru"
    });

    $('#statsType').change(function () {
        Stats_LoadSelectItemsUsers(_userType);
    });

    $('#statsUser').select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Выберите пользователя.",
        language: "ru"
    });
    $('#statsUser').change(function () {
        Stats_LoadSelectItemsCities()
    });
    $('#statsCity').select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Выберите город",
        language: "ru"
    });
    $('#statsCity').change(function(){
        Stats_LoadSelectItemsArtists();
    });
    $('#statsArtist').select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Выберите шоу",
        language: "ru"
    });
    $('#statsArtist').change(function(){
        Stats_LoadStats();
    });

    $(fromSelect).datepicker().on("changeDate", function (e) {
        Stats_CheckRangeValues("from");
    });
    $(toSelect).datepicker().on("changeDate", function (e) {
        Stats_CheckRangeValues("to");
    });

    Stats_LoadSelectItemsUsers(_userType);
}
function MakeListsFrame(){
    //Получение данных контейнера
    var frameContainer = $('#control_contentContainer');

    //Статичные данные заголовка
    var header = $('<div>').addClass("usr-header").appendTo(frameContainer);
    //Динамический контент
    var content = $('<div>').addClass("usr-content").appendTo(frameContainer);

    //header
    var table = $('<table>').attr("width", "100%").appendTo(header);
    var tr = $('<tr>').appendTo(table);
    var td = $('<td>').attr("width", "5%").appendTo(tr);
    var span = $('<span>').addClass("events_add_event_button-decoration").attr("title", "Добавить объект в список").css("margin-left", "10px").appendTo(td);
    $('<span>').addClass("glyphicon glyphicon-plus").appendTo(span);
    span.click(function () {
        AddObjectToLists($('#usrTypeChoose').val());
    });
    td = $('<td>').attr("width", "95%").appendTo(tr);
    //header
    var select = $('<select>').attr("id", "listsTypeChoose").addClass("value").appendTo(td);
    $('<option>').attr("value", "city").text("Города").appendTo(select);
    $('<option>').attr("value", "shows").text("Шоу").appendTo(select);


    td = $('<td>').attr("width", "40%").appendTo(tr);

    //content
    var usrPagination = $('<div>').attr("id", "usrPagination").appendTo(content);
    var usrContent = $('<div>').attr("id", "usrContent").css("border", "1px solid #d7d8db").css("padding", "5px").css("border-radius", "5px").appendTo(content);


    $('#listsTypeChoose').select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Выберите тип списков.",
        language: "ru"
    });
    $('#listsTypeChoose').change(function () {
        if($('#listsTypeChoose').val() == "city"){
            Lists_CityPaginator();
        }else if($('#listsTypeChoose').val() == "shows"){
            Lists_ArtistPaginator();
        }
    });
    Lists_CityPaginator();
}
function MakeAggregatorFrame() {
    //Получение данных контейнера
    var frameContainer = $('#control_contentContainer');

    //Статичные данные заголовка
    var header = $('<div>').addClass("usr-header").appendTo(frameContainer);
    //Динамический контент
    var content = $('<div>').addClass("usr-content").appendTo(frameContainer);

    //header
    var table = $('<table>').attr("width", "100%").appendTo(header);
    var tr = $('<tr>').appendTo(table);


    $.post('/aj_api_all/',
        {cities: "cities"},
        function (response) {
            var data = ResponseToNotify(response);
            if (response["status"] != "data") {
                return;
            }
            var td = $('<td>').attr("width", "33%").appendTo(tr);
            var selectCities = $('<select>').attr("id", "aggregatorCities").addClass("value").appendTo(td);
            var cities = data["cities"];
            for (i = 0; i < cities.length; i++) {
                $('<option>').attr("value", cities[i]["id"]).text(cities[i]["name"]).appendTo(selectCities);
            }
            var td = $('<td>').attr("width", "33%").appendTo(tr);

            var select = $('<select>').attr("id", "aggregatorTypes").addClass("value").appendTo(td);
            $('<option>').attr("value", "events").text("События").appendTo(select);
            $('<option>').attr("value", "access").text("Доступы").appendTo(select);
            $('<option>').attr("value", "chats").text("Чаты").appendTo(select);
            $('<option>').attr("value", "chrono").text("Хронограф").appendTo(select);
            var td = $('<td>').attr("width", "29%").appendTo(tr);
            var select = $('<select>').attr("id", "aggregatorVariousSelect").addClass("value").appendTo(td);

            $('#aggregatorTypes').change(function () {
                if ($('#aggregatorTypes').val() == "events") {
                    $('#aggregatorVariousSelect').empty();
                    $('<option>').attr("value", "all").text("Все").appendTo($('#aggregatorVariousSelect'));
                    $('<option>').attr("value", "calls").text("Звонки").appendTo($('#aggregatorVariousSelect'));
                    $('<option>').attr("value", "tasks").text("Задачи").appendTo($('#aggregatorVariousSelect'));
                    $('<option>').attr("value", "events").text("Мероприятия").appendTo($('#aggregatorVariousSelect'));
                } else if ($('#aggregatorTypes').val() == "access") {
                    $('#aggregatorVariousSelect').empty();
                    $('<option>').attr("value", "all").text("Все").appendTo($('#aggregatorVariousSelect'));

                    $.post('/aj_api_all/',
                        {artists: "artists"},
                        function (response) {
                            var data = ResponseToNotify(response);
                            if (response["status"] != "data") {
                                return;
                            }
                            var artists = data["artists"];
                            for (i = 0; i < artists.length; i++) {
                                $('<option>').attr("value", artists[i]["id"]).text(artists[i]["name"]).appendTo($('#aggregatorVariousSelect'));
                            }

                        });
                }
                });
                $('<option>').attr("value", "all").text("Все").appendTo(select);
                $('<option>').attr("value", "calls").text("Звонки").appendTo(select);
                $('<option>').attr("value", "tasks").text("Задачи").appendTo(select);
                $('<option>').attr("value", "events").text("Мероприятия").appendTo(select);

                $('#aggregatorCities').select2({//Преобразует элемент управления к Select2 виду
                    language: "ru"
                });
                $('#aggregatorCities').change(function () {
                    Aggregators_Load();
                });
                $('#aggregatorTypes').select2({//Преобразует элемент управления к Select2 виду
                    language: "ru"
                });
                $('#aggregatorVariousSelect').select2({//Преобразует элемент управления к Select2 виду
                    language: "ru"
                });
                $('#aggregatorVariousSelect').change(function () {
                    Aggregators_Load();
                });


            //header


            //content
            var usrPagination = $('<div>').attr("id", "usrPagination").appendTo(content);
            var usrContent = $('<div>').attr("id", "usrContent").css("border", "1px solid #d7d8db").css("padding", "5px").css("border-radius", "5px").appendTo(content);
            Aggregators_Load();

        });
}
function MakeUnloadFrame(){
    //Получение данных контейнера
    var frameContainer = $('#control_contentContainer');

    var buttonContainer = $('<div>').css("margin-bottom", 15).css("text-align", "left").appendTo(frameContainer);
    $('<input>').addClass("btn btn-success full-list-control-button").attr("type", "button").val("Выгрузить").attr("onclick", "UnloadReportDownload();").appendTo(buttonContainer)

    //Статичные данные заголовка
    var header = $('<div>').addClass("usr-header").appendTo(frameContainer);

    //header
    var table = $('<table>').css("border-collapse", "separate").css("border-spacing", "3px").attr("width", "100%").appendTo(header);
    var tr = $('<tr>').appendTo(table);

    //manager
    td = $('<td>').css("text-align", "right").attr("width", "4%").text("Менеджер").appendTo(tr);
    td = $('<td>').attr("width", "28%").appendTo(tr);

    var select = $('<select>').attr("id", "unloadUser").addClass("value").appendTo(td);
    //city
    td = $('<td>').css("text-align", "right").attr("width", "4%").text("Город").appendTo(tr);
    td = $('<td>').attr("width", "28%").appendTo(tr);
    var select = $('<select>').attr("id", "unloadCity").addClass("value").appendTo(td);
    //sort
    td = $('<td>').css("text-align", "right").attr("width", "4%").text("Сортировка").appendTo(tr);
    td = $('<td>').attr("width", "28%").appendTo(tr);
    var select = $('<select>').attr("id", "unloadSort").addClass("value").appendTo(td);
    $('<option>').val("city").text("Город").appendTo(select);
    $('<option>').val("manager").text("Менеджер").appendTo(select);
    $('<option>').val("dt").text("Дата").appendTo(select);

    //Диапазон фильтрации событий
    //Таблица-контейнер
    var table = $('<table>').attr("width", "50%").css("margin", "0 auto").css("margin-bottom", 25).css("margin-top", 10).appendTo(header);
    var tr = $('<tr>').appendTo(table);
    //Сдвиг даты влево
    var td = $('<td>').css("padding-right", 5).appendTo(tr);
    var leftButton = $('<button>').addClass("btn btn-lg").attr("title", "Месяц назад").appendTo(td);
    leftButton.click(function(){
        Stats_ShiftMonth("back", true);
    });
    var buttonLabel = $('<span>').addClass("glyphicon glyphicon-chevron-left").appendTo(leftButton);

    td = $('<td>').attr("width", "100%").appendTo(tr);
    var rangeContainer = $('<div>').css("float", "right").css("width", "100%").css("margin-top", "2px").appendTo(td);
    var rangeInputContainer = $('<div>').addClass("input-group input-daterange").appendTo(rangeContainer);
    var labelFromSelect = $('<span>').addClass("input-group-addon").css("padding-right", 5).css("user-select", "none").css("border-width", 1).text("От: ").appendTo(rangeInputContainer);
    var fromSelect = $('<input>').addClass("form-control").attr("type", "text").css("text-align", "center").css("user-select", "none").attr("id", "rangeFrom").appendTo(rangeInputContainer);
    labelFromSelect = $('<span>').addClass("input-group-addon").css("padding-right", 5).css("user-select", "none").css("border-width", 1).text("До: ").appendTo(rangeInputContainer);
    var toSelect = $('<input>').addClass("form-control").attr("type", "text").css("text-align", "center").css("user-select", "none").attr("id", "rangeTo").appendTo(rangeInputContainer);

    td = $('<td>').css("padding-left", 5).appendTo(tr);
    var rightButton = $('<button>').addClass("btn btn-lg").attr("title", "Месяц вперед").appendTo(td);
    var buttonLabel = $('<span>').addClass("glyphicon glyphicon-chevron-right").appendTo(rightButton);
    rightButton.click(function(){
        Stats_ShiftMonth("forward", true);
    });

    fromSelect.datepicker({
        format: "dd MM yyyy",
        language: "ru",
        autoclose: true,
        todayHighlight: true,
        title: "Диапазон: от"

    });
    toSelect.datepicker({
        format: "dd MM yyyy",
        language: "ru",
        autoclose: true,
        todayHighlight: true,
        title: "Диапазон: до"
    });
    var currentDate = new Date();
    currentDate.setDate(1);
    fromSelect.datepicker('update', currentDate);
    currentDate.setMonth(currentDate.getMonth() + 1);
    currentDate.setDate(0);
    toSelect.datepicker('update', currentDate);

    $('<div>').attr("id", "eventsPaginator").appendTo(frameContainer);
    $('<div>').attr("id", "eventsContent").appendTo(frameContainer);

    
    $('#unloadUser').select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Выберите пользователя.",
        language: "ru"
    });
    $('#unloadUser').change(function () {
        UnloadLoadCities();
    });
    $('#unloadCity').select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Выберите город",
        language: "ru"
    });
    $('#unloadCity').change(function(){
        UnloadEventsPaginator();
    });
    $('#unloadSort').select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Выберите тип сортировки",
        language: "ru"
    });
    $('#unloadSort').change(function(){
        UnloadEventsPaginator();
    });

    $(fromSelect).datepicker().on("changeDate", function (e) {
        UnloadEventsPaginator();
    });
    $(toSelect).datepicker().on("changeDate", function (e) {
        UnloadEventsPaginator();
    });

    UnloadLoadUsers();
}
//Users==================================================================================
function FillUsersPaginator() {
    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};

    urls["pages_count"] = "/aj_users_list/";
    urls["content"] = "/aj_users_list/";

    params["search"] = GetSearchPanelValue();
    params["type"] = $('#usrTypeChoose').val();
    params["status"] = $('#usrStatusChoose').val();

    containers["paginator"] = $('#usrPagination');
    containers["content"] = $('#usrContent');
    functions["get_page_data"] = FillUsersPage;

    var paginator = new Paginator(containers, urls, params, functions);
    paginator.Create();
    return paginator;
}
function FillUsersPage(_container, _data) {
    var div = $('<div>').css("margin-bottom", "7px").css("background-color", "#e4dada").css("padding", "2px").css("border-top-left-radius", "5px").css("border-top-right-radius", "5px").appendTo(_container);
    var table = $('<table>').attr("width", "100%").appendTo(div);
    var tr = $('<tr>').addClass("table-header-row-decoration").css("font-weight", "bold").css("font-size", "medium").appendTo(table);
    var td = $('<td>').attr("width", "30%").text("Имя").appendTo(tr);
    var td = $('<td>').attr("width", "30%").text("Псевдоним").appendTo(tr);
    var td = $('<td>').attr("width", "15%").text("Логин").appendTo(tr);
    var td = $('<td>').attr("width", "15%").text("Пароль").appendTo(tr);
    var td = $('<td>').attr("width", "10%").text("Управление").appendTo(tr);
    for (i = 0; i < _data.length; i++) {
        var div = $('<div>').addClass("list-item").attr("data-id", _data[i]["id"]).css("padding", "2px").appendTo(_container);
        if(_data[i]["active"]){
            div.attr("data-status", "active");
        }
        else{
            div.attr("data-status", "locked");
        }
        div.click(function () {
            ShowUser($(this).attr("data-id"), $('#usrTypeChoose').val());
        });
        var table = $('<table>').addClass("fixed-layouts").attr("width", "100%").css("color", "inherit").appendTo(div);
        var tr = $('<tr>').css("font-size", "small").css('border-radius', "1px").attr("data-email", _data[i]["email"]).attr("data-type", "email").appendTo(table);
        var td = $('<td>').addClass("overflow-dotted").attr("width", "30%").css("padding-bottom", "3px").css("padding-top", "3px").attr("data-type", "name").text(_data[i]["name"]).appendTo(tr);

        if (_data[i]["deleted"]) {
            td.prepend($('<span>').addClass("glyphicon glyphicon-trash user-status").css("margin-right", "3px").css("margin-left", "3px").css("color", "rgb(128, 0, 0)"));
            tr.attr("title", "Удален").css("background-color", "rgba(128, 0, 0, 0.34)");
        } else if (!_data[i]["active"]) {
            td.prepend($('<span>').addClass("glyphicon glyphicon-lock user-status").css("margin-right", "3px").css("margin-left", "3px").css("color", "rgb(51, 122, 183)"));
            tr.attr("title", "Заблокирован").css("background-color", "rgba(51, 122, 183, 0.34)");
        } else {
            td.prepend($('<span>').addClass("glyphicon glyphicon-check user-status").css("margin-right", "3px").css("margin-left", "3px").css("color", "green"));
            tr.attr("title", "Активен").css("background-color", "rgba(0, 128, 0, 0.34)");
        }
        var td = $('<td>').addClass("overflow-dotted").attr("width", "30%").attr("data-type", "alias").text(_data[i]["alias"]).appendTo(tr);
        var td = $('<td>').addClass("overflow-dotted").attr("width", "15%").attr("data-type", "login").text(_data[i]["user__username"]).appendTo(tr);
        (function(elem){
            elem.click(function (event) {
                event.stopPropagation();
            });
        })(td);
        var tdPassword = $('<td>').addClass("overflow-dotted").attr("width", "15%").attr("data-type", "password").text(_data[i]["password"]).appendTo(tr);

        (function (elem) {
            elem.click(function (event) {
                event.stopPropagation();

            });
        })(tdPassword);

        var td = $('<td>').attr("width", "10%").css("text-align", "right").appendTo(tr);
        if(!_data[i]["deleted"]){
            var userOptionsButton = $('<span>').addClass("control-button glyphicon glyphicon-cog").attr("title", "Настройки пользователя").appendTo(td);
            userOptionsButton.click(function (event) {
                var elem = $(this).parents('.list-item')[0];
                var id = $(elem).attr("data-id");
                ShowUserOptions(id);
                event.stopPropagation();
            });
            var copyToBufferButton = $('<span>').addClass("control-button glyphicon glyphicon-floppy-open").attr("title", "Копировать данные в буфер обмена").appendTo(td);
            copyToBufferButton.click(function (event) {
                var tdValues = $(this).parents("tr").children("td");
                CopyTextToClipBoard($(tdValues[0]).text() + "\n\n" + $(tdValues[2]).text() + "\n\n" + $(tdValues[3]).text());
                ShowNotify(2, "Данные пользователя успешно скопированы в буфер обмена", 0, 3000);
                event.stopPropagation();
            });
            var sendMailButton = $('<span>').addClass("control-button glyphicon glyphicon-envelope").attr("title", "Отправить учетные данные на электронную почту").appendTo(td);
            sendMailButton.click(function (event) {
                var tdValues = $(this).parents("tr").children("td");
                UserSendAuthData($(tdValues[0]).text(), $(tdValues[2]).text(), $(tdValues[3]).text(), $(this).parents("tr").attr("data-email"));
                event.stopPropagation();
            });
            var lockButton = $('<span>').addClass("control-button glyphicon glyphicon-lock").attr("title", "Заблокировать/Разблокировать пользователя").appendTo(td);
            lockButton.click(function (event) {
                var elem = $(this).parents('.list-item')[0];
                var id = $(elem).attr("data-id");
                var status = $(elem).attr("data-status");
                UserLock(id, status, elem);
                event.stopPropagation();
            });
            var changePassButton = $('<span>').addClass("control-button glyphicon glyphicon-retweet").attr("title", "Быстрая смена пароля пользователя").appendTo(td);
            changePassButton.click(function (event) {
                var container = $(this).parents('.list-item')[0];
                var elem = $(container).find("[data-type=\"password\"]");
                var id = $(container).attr("data-id");
                UserUpdatePass(id, elem);
                event.stopPropagation();
            });
            var removeButton = $('<span>').addClass("control-button glyphicon glyphicon-remove-circle").attr("title", "Удалить выбранного пользователя").appendTo(td);
            (function (alias) {
                removeButton.click(function (event) {
                    var container = $(this).parents('.list-item')[0];
                    var id = $(container).attr("data-id");
                    UserRemove(id, alias, container);
                    event.stopPropagation();
                });
            })(_data[i]["alias"])

        }
    }
    return;
}
function ShowUser(_id, _type, _link) {
    if(isDict(_id)){
        _type = _id["type"];
        _link = _id["link"] || false;
        _id = _id["id"];
    }
    _type = _type || "Менеджеры";
    _link = _link || "False";
    $.post('aj_user_data/', {
        id: _id,
        type: _type,
        link: _link
    }, function(response){
        var data = ResponseToNotify(response);
        if(response["status"] != "data"){
            return;
        }
        AddUser(_type, data);
    });
}
function ShowUserOptionsIndividual() {
    $.post("/aj_user_individual_options_get/", {}, function (response) {
        var data = ResponseToNotify(response);
        if (response["status"] != "data") {
            return;
        }
        var options = data["user_options"];

        var content = $('<div>').addClass("textMiddle");
        var frame = $('<form>').addClass("form-horizontal").appendTo(content);

        var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
        var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
        var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
        $('<label>').attr("for", "check_logout_request").addClass("text-primary control-label").text("Запрашивать подтверждение при выходе").css("user-select", "none").appendTo(labelContainer);
        var checkLogoutRequestToggle = $('<input>').attr("id", "check_logout_request").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        if("company_page_calendar" in options){
            $('<hr>').addClass("company-primary-divider").appendTo(frame);
            var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
            var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
            var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
            $('<label>').attr("for", "check_company_page_calendar").addClass("text-primary control-label").css("text-align", "left").text("Не отображать календарь на странице учреждения").css("user-select", "none").appendTo(labelContainer);
            var checkCompanyPageCalendarToggle= $('<input>').attr("id", "check_company_page_calendar").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        }
        if("hide_done_tasks" in options){
            $('<hr>').addClass("company-primary-divider").appendTo(frame);
            var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
            var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
            var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
            $('<label>').attr("for", "check_hide_done_tasks").addClass("text-primary control-label").css("text-align", "left").text("Не отображать выполненные задачи").css("user-select", "none").appendTo(labelContainer);
            var checkHideDoneTasksToggle= $('<input>').attr("id", "check_hide_done_tasks").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        }
        if("larger_font" in options){
            $('<hr>').addClass("company-primary-divider").appendTo(frame);
            var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
            var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
            var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
            $('<label>').attr("for", "check_larger_font").addClass("text-primary control-label").css("text-align", "left").text("Увеличенный шрифт").css("user-select", "none").appendTo(labelContainer);
            var largerFontTasksToggle= $('<input>').attr("id", "check_larger_font").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        }
        if("scrolltop_show" in options){
            $('<hr>').addClass("company-primary-divider").appendTo(frame);
            var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
            var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
            var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
            $('<label>').attr("for", "check_scrolltop_show").addClass("text-primary control-label").css("text-align", "left").text("Отображать значок быстрой прокрутки наверх").css("user-select", "none").appendTo(labelContainer);
            var scrolltopShowToggle= $('<input>').attr("id", "check_scrolltop_show").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        }
        var modalWindow = showModalWindow_new("okcancel", "Индивидуальные настройки", content, function () {
            var resultOptions = {};
            for(var option in options){
                if ($('#check_' + option).length != 0) {
                     if($('#check_' + option).prop("checked")){
                         resultOptions[option] = true;
                     }else {
                         resultOptions[option] = false;
                     }
                }
            }
            $.post('/aj_user_individual_options_edit/', {
                options: JSON.stringify(resultOptions)
            }, function (response) {
                var response = ResponseToNotify(response);
                if(response == "success"){
                    var logoutRequest = "";
                    if($('#check_logout_request').prop("checked")){
                        logoutRequest = "True";
                    }else{
                        logoutRequest = "False";
                    }
                    InitializeOptionsButtonsHandlers(logoutRequest);
                    hideModalWindow(modalWindow);
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                }
            });
        });
        //Заполнение тоглов
        for(var option in options){
            if($('#check_' + option).length != 0){
                if(options[option]){
                    $('#check_' + option).attr("checked", true);
                }
            }
        }
        $(checkLogoutRequestToggle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
        if("company_page_calendar" in options){
            $(checkCompanyPageCalendarToggle).bootstrapToggle({
                on: "Да",
                off: "Нет",
                size: "small",
                offstyle: "danger",
                onstyle: "success"
            });
        }
        if("hide_done_tasks" in options){
            $(checkHideDoneTasksToggle).bootstrapToggle({
                on: "Да",
                off: "Нет",
                size: "small",
                offstyle: "danger",
                onstyle: "success"
            });
        }
        if("larger_font" in options){
            $(largerFontTasksToggle).bootstrapToggle({
                on: "Да",
                off: "Нет",
                size: "small",
                offstyle: "danger",
                onstyle: "success"
            });
        }
        if("scrolltop_show" in options){
            $(scrolltopShowToggle).bootstrapToggle({
                on: "Да",
                off: "Нет",
                size: "small",
                offstyle: "danger",
                onstyle: "success"
            });
        }
    });
    return;
}
function ShowUserOptions(_id) {
    $.post("/aj_user_options_get/", {id: _id}, function (response) {
        var data = ResponseToNotify(response);
        if(response["status"] != "data"){
            return;
        }
        var cities = data["all_cities"];
        var full_list_cities = data["full_list_cities"];
        var options = data["user_options"];

        var content = $('<div>').addClass("textMiddle");
        var frame = $('<form>').addClass("form-horizontal").appendTo(content);


        var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
        $('<label>').addClass("col-md-4 small text-primary control-label text-left").attr("for", "selectAllowedCities").css("text-align", "left").text("Доступные города для полного списка").appendTo(innerDiv);
        var inputContainer = $('<div>').addClass("col-md-8").appendTo(innerDiv);
        var selectAllowedCities = $('<select>').addClass("form-control input-sm").attr("id", "selectAllowedCities").attr("placeholder", "Доступные города для полного списка").appendTo(inputContainer);
        for (var i = 0; i < cities.length; i++) {
            $('<option>').val(cities[i]["id"]).text(cities[i]["name"]).appendTo(selectAllowedCities);
        }

        $('<hr>').addClass("company-primary-divider").appendTo(frame);
        var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
        var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
        var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
        $('<label>').attr("for", "check_can_show_all_companies").addClass("text-primary control-label").text("Доступ к просмотру всех незанятых компаний").css("user-select", "none").appendTo(labelContainer);
        var canShowAllCompaniesTogle = $('<input>').attr("id", "check_can_show_all_companies").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        $('<hr>').addClass("company-primary-divider").appendTo(frame);
        var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
        var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
        var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
        $('<label>').attr("for", "check_can_show_allien_companies").addClass("text-primary control-label").text("Может просматривать занятые компании").css("user-select", "none").appendTo(labelContainer);
        var canShowBusyCompaniesToggle = $('<input>').attr("id", "check_can_show_allien_companies").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        $('<hr>').addClass("company-primary-divider").appendTo(frame);
        var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
        var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
        var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
        $('<label>').attr("for", "check_can_add_companies_to_self").addClass("text-primary control-label").text("Может забирать себе компании").css("user-select", "none").appendTo(labelContainer);
        var canAddCompaniesToMyselfToggle = $('<input>').attr("id", "check_can_add_companies_to_self").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        $('<hr>').addClass("company-primary-divider").appendTo(frame);
        var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
        var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
        var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
        $('<label>').attr("for", "check_can_own_companies_free").addClass("text-primary control-label").text("Может освобождать свои компании").css("user-select", "none").appendTo(labelContainer);
        var canFreeOwnCompaniesToggle = $('<input>').attr("id", "check_can_own_companies_free").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        $('<hr>').addClass("company-primary-divider").appendTo(frame);
        var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
        var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
        var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
        $('<label>').attr("for", "check_can_change_event_percents").addClass("text-primary control-label").css("text-align", "left").text("Может редактировать проценты своих мероприятий").css("user-select", "none").appendTo(labelContainer);
        var canEditOwnEventPercent = $('<input>').attr("id", "check_can_change_event_percents").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        $('<hr>').addClass("company-primary-divider").appendTo(frame);
        var outerDiv = $('<div>').addClass("form-group").appendTo(frame);
        var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
        var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
        $('<label>').attr("for", "check_can_show_allowed_cities_events").css("text-align", "left").addClass("text-primary control-label").text("Может просматривать мероприятия доступных городов").css("user-select", "none").appendTo(labelContainer);
        var canCanShowOwnCityEvents = $('<input>').attr("id", "check_can_show_allowed_cities_events").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

        var modalWindow = showModalWindow_new("okcancel", "Настройки пользователя: " + data["user_data"]["alias"], content, function () {
            var resultOptions = {};
            for(var option in options){
                if ($('#check_' + option).length != 0) {
                     if($('#check_' + option).prop("checked")){
                         resultOptions[option] = true;
                     }else {
                         resultOptions[option] = false;
                     }
                }
            }
            $.post('/aj_user_options_edit/', {
                id: _id,
                options: JSON.stringify(resultOptions),
                allowed_cities: JSON.stringify($(selectAllowedCities).val())
            }, function (response) {
                var response = ResponseToNotify(response);
                if(response == "success"){
                    hideModalWindow(modalWindow);
                }
            });
        });
        //Заполнение тоглов
        for(var option in options){
            if($('#check_' + option).length != 0){
                if(options[option]){
                    $('#check_' + option).attr("checked", true);
                }
            }
        }
        selectAllowedCities.select2({
                placeholder: "Открытые города в полном списке",
                language: "ru",
                multiple: true,
                allowClear: true
            }
        );
        if (full_list_cities.length != 0) {
            $(selectAllowedCities).val(full_list_cities).trigger('change');
        }else {
            $(selectAllowedCities).val(null).trigger('change');
        }
        $(canShowAllCompaniesTogle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
        $('#check_can_show_all_companies').parent().click(function () {
            $('#selectAllowedCities').val(null).trigger('change');
        });
        $(canShowBusyCompaniesToggle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
        $(canAddCompaniesToMyselfToggle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
        $(canFreeOwnCompaniesToggle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
        $(canEditOwnEventPercent).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
        $(canCanShowOwnCityEvents).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });

    });
    return;
}
function AddUser(_type, _editData) {
    var data = {};
    var permissions = [];
    if (_editData) {
        var data = _editData["user_data"];
    }

    var editLabel = _editData ? true : false;
    var userId = data["siteuser__id"] || 0;

    var modalWindowTitle = "";
    var content = $('<div>').addClass("textMiddle");
    var frame = $('<form>').addClass("form-horizontal").appendTo(content);

    if (_type == "Менеджеры") {
        var fieldsContainer = [{
            name: "firstName",
            text: editLabel ? "ФИО" : "Фамилия",
            val: data["siteuser__name"]
        },
            {
                name: "lastName",
                text: "Имя"
            },
            {
                name: "alias",
                text: "Псевдоним",
                val: data["siteuser__alias"]
            },
            {
                name: "email",
                text: "Почта",
                val: data["siteuser__email"]
            },
            {
                name: "adress",
                text: "Адрес",
                val: data["siteuser__adress"]
            }, {
                name: "contacts",
                text: "Контакты",
                val: data["siteuser__contacts"]
            },
            {
                name: "login",
                text: "Логин",
                val: data["siteuser__user__username"]
            }, {
                name: "password",
                text: "Пароль",
                val: data["siteuser__password"]
            }, {
                name: "percent",
                text: "Процент менеджера",
                val: data["eventPercent"]
            }];
        if (editLabel) {
            modalWindowTitle = "Редактировать менеджера";
        } else {
            modalWindowTitle = "Добавить менеджера";
        }


        for (field in fieldsContainer) {
            var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
            $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", fieldsContainer[field]["name"]).text(fieldsContainer[field]["text"]).appendTo(innerDiv);
            var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
            var input = $('<input>').addClass("form-control input-sm").attr("id", fieldsContainer[field]["name"]).attr("placeholder", fieldsContainer[field]["text"]).attr("autocomplete", "off").appendTo(inputContainer);
            if (fieldsContainer[field]["val"]) {
                input.val(fieldsContainer[field]["val"]);
            }
            if (fieldsContainer[field]["name"] == "firstName") {
                if (!(editLabel)) {
                    input.keyup(function () {
                        MakeLoginNameForManager();
                    });
                }
                input.attr("required", "true");
                input.attr("maxlength", 50);
            }
            if (fieldsContainer[field]["name"] == "lastName") {
                input.keyup(function () {
                    MakeLoginNameForManager();
                });
                input.attr("required", "true");
                input.attr("maxlength", 25);
                if (editLabel) {
                    //Если редактирование - это поле не нужно
                    input.parents(".form-group")[0].remove();
                }
            }
            if (fieldsContainer[field]["name"] == "alias") {
                input.attr("required", "true");
                input.attr("maxlength", 50);
            }
            if (fieldsContainer[field]["name"] == "email") {
                input.attr("type", "email");
                input.attr("maxlength", 30);
            }
            if (fieldsContainer[field]["name"] == "contacts") {
                input.attr("maxlength", 30);
            }
            if (fieldsContainer[field]["name"] == "adress") {
                input.attr("maxlength", 30);
            }
            if (fieldsContainer[field]["name"] == "login") {
                if (editLabel) {
                    input.attr("readonly", "readonly");
                } else {
                    input.attr("required", "true");
                    input.attr("nospace", "true");
                    input.attr("onlylatin", "true");
                    input.attr("maxlength", 30);
                    input.attr("minlength", 8);
                }


            }
            if (fieldsContainer[field]["name"] == "password") {

                input.attr("required", "true");
                input.attr("nospace", "true");
                input.attr("onlylatin", "true");
                input.attr("maxlength", 25);
                input.attr("minlength", 8);
            }
            if (fieldsContainer[field]["name"] == "percent") {
                var percentVal = fieldsContainer[field]["val"] || 15;
                input.val(percentVal);
                input.attr("required", "true");
                input.attr("type", "number");
                input.attr("step", 1);
                input.attr("min", 1);
                input.attr("max", 99);
            }
        }


        var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, content, function () {
            if (TotalInputsValidator(modalWindow)) {
                $.post("aj_users_add/", {
                    type: _type,
                    mode: _editData ? "edit" : "add",
                    id: userId,
                    firstName: $('#firstName').val().trim(),
                    lastName: $('#lastName').val() ? $('#lastName').val().trim() : "",
                    alias: $('#alias').val().trim(),
                    email: $('#email').val().trim(),
                    adress: $('#adress').val().trim(),
                    contacts: $('#contacts').val().trim(),
                    login: $('#login').val().trim(),
                    password: $('#password').val().trim(),
                    percent: $('#percent').val().trim()
                }, function (response) {

                    var status = ResponseToNotify(response);
                    if (status == "success") {
                        hideModalWindow(content);
                        UpdateData();
                    }
                });
            }
        });


        if (!(editLabel)) {
            PassGen();
        }
    } else {
        $.post('/aj_api_admin/', {cities:1}, function (response) {
            var citiesData = ResponseToNotify(response);
            if(response["status"] != "data"){
                return;
            }
            var cities = citiesData["cities"];
            if (editLabel) {
            modalWindowTitle = "Редактировать артиста";

        } else {
            modalWindowTitle = "Добавить артиста";
        }
            var eventsLimit = 0;
            if (_editData) {
                if ("events_limit" in _editData) {
                    eventsLimit = _editData["events_limit"];
                }
            }

            var fieldsContainer = [{
                name: "name",
                text: "ФИО артиста",
                val: data["name"]
            },
                {
                    name: "alias",
                    text: "Псевдоним",
                    val: data["alias"]
                },
                {
                    name: "email",
                    text: "Почта",
                    val: data["email"]
                },
                {
                    name: "adress",
                    text: "Адрес",
                    val: data["adress"]
                }, {
                    name: "contacts",
                    text: "Контакты",
                    val: data["contacts"]
                },
                {
                    name: "login",
                    text: "Логин",
                    val: data["siteuser__user__username"]
                }, {
                    name: "password",
                    text: "Пароль",
                    val: data["password"]
                }, {
                    name: "presentator_show_events_limit",
                    text: "Ограничение на просмотр (недели)",
                    val: eventsLimit
                }];
            for (field in fieldsContainer) {
                var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
                var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", fieldsContainer[field]["name"]).text(fieldsContainer[field]["text"]).appendTo(innerDiv);
                var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
                var input = $('<input>').addClass("form-control input-sm").attr("id", fieldsContainer[field]["name"]).attr("placeholder", fieldsContainer[field]["text"]).attr("autocomplete", "off").appendTo(inputContainer);

                if (fieldsContainer[field]["val"]) {
                    input.val(fieldsContainer[field]["val"]);
                }

                if (fieldsContainer[field]["name"] == "name") {
                    input.on("input", function () {
                        CloneInputValue($('#name'), $('#alias'));
                    });
                    input.attr("maxlength", 50);

                }
                if (fieldsContainer[field]["name"] == "alias") {
                    input.attr("required", "true");
                    input.attr("maxlength", 50);
                }
                if (fieldsContainer[field]["name"] == "email") {
                    input.attr("type", "email");
                    input.attr("maxlength", 30);
                }
                if (fieldsContainer[field]["name"] == "contacts") {
                    input.attr("maxlength", 30);
                }
                if (fieldsContainer[field]["name"] == "adress") {
                    input.attr("maxlength", 30);
                }
                if (fieldsContainer[field]["name"] == "login") {
                    if (editLabel) {
                        input.attr("readonly", "readonly");
                    } else {
                        var genLoginButton = $('<span>').css("margin-left", "5px").css("top", "2px").css("cursor", "pointer").addClass("control-button glyphicon glyphicon-retweet").attr("title", "Сгенерировать логин").appendTo(label);
                        $(genLoginButton).on("click", function (event) {
                            MakeLoginNameForArtist();
                        });
                        input.attr("required", "true");
                        input.attr("nospace", "true");
                        input.attr("onlylatin", "true");
                        input.attr("maxlength", 30);
                        input.attr("minlength", 8);
                    }


                }
                if (fieldsContainer[field]["name"] == "password") {
                    input.attr("required", "true");
                    input.attr("nospace", "true");
                    input.attr("onlylatin", "true");
                    input.attr("maxlength", 25);
                    input.attr("minlength", 8);
                }
                if (fieldsContainer[field]["name"] == "presentator_show_events_limit") {
                    var eventsLimit = fieldsContainer[field]["val"] || 4;
                    input.val(eventsLimit);
                    input.attr("required", "true").attr("numericonly", "numericonly");

                }
            }
            var innerDiv = $('<div>').addClass("form-group").css("margin-top", "35px").appendTo(frame);
            var header = $('<span>').addClass("medium-info-header").text("Доступы артиста").appendTo(innerDiv);
            var addPermissionButton = $('<span>').addClass("events_add_event_button-decoration").attr("title", "Добавить пользователя").css("margin-left", "10px").appendTo(header);
            $('<span>').addClass("glyphicon glyphicon-plus").appendTo(addPermissionButton);

            var innerDiv = $('<div>').css("margin-top", "10px").appendTo(frame);
            var permissionsTable = $('<table>').attr("id", "presentatorPermissionsTable").addClass("table table-bordered text-in-table modal_window_list").appendTo(innerDiv);

            addPermissionButton.click(function () {
                var currentShows = [];
                var permissionsContent = $('<div>');

                var outerDiv = $('<div>').css("margin-bottom", "7px").appendTo(permissionsContent);
                var citySelectorWrapper = $('<div>').addClass("form-group").appendTo(outerDiv);
                $('<div>').addClass("header small").text("Город").appendTo(citySelectorWrapper);
                var citySelector = $('<select>').addClass("form-control input-sm").attr("id", "cities").attr("required", "required").css("width", "100%").appendTo(citySelectorWrapper)
                for (city in cities) {
                    $('<option>').val(cities[city]["id"]).text(cities[city]["name"]).appendTo(citySelector);
                }
                var outerDiv = $('<div>').appendTo(permissionsContent);
                var showSelectorWrapper = $('<div>').addClass("form-group").appendTo(outerDiv);
                $('<div>').addClass("header small").text("Доступные шоу").appendTo(showSelectorWrapper);
                var artistSelector = $('<select>').addClass("form-control input-sm").attr("id", "artists").attr("required", "required").css("width", "100%").appendTo(showSelectorWrapper)

                var permissionModalWindow = showModalWindow_new("okcancel", "Добавление доступов артиста", permissionsContent, function () {
                    if (TotalInputsValidator(permissionModalWindow)) {
                        var cityData = $(citySelector).select2('data');
                        var city = cityData[0]["id"];
                        var cityName = cityData[0]["text"];
                        var shows = $(artistSelector).val();
                        var permissionTr = $(permissionsTable).find('tr[data-city-id=' + city + ']');
                        if(permissionTr.length > 0){
                            permissionTr.remove();
                        }
                        var permissionTr = $('<tr>').addClass("little-selection").attr("data-city-id", city).attr("data-shows", shows).appendTo(permissionsTable);
                        var removePermissionTd = $('<td>').css("width", "22px").addClass("td-remove").appendTo(permissionTr);
                        removePermissionTd.click(function(){
                            $(this).parent().remove();
                        });
                        $('<span>').addClass("glyphicon glyphicon-remove icon icon-remove").appendTo(removePermissionTd);
                        $('<td>').text(cityName).css("width", "65%").css("font-weight", "bold").css("text-align", "center").appendTo(permissionTr);
                        var showsTd = $('<td>').css("width", "35%").appendTo(permissionTr);
                        for(var i = 0; i < shows.length; i++){
                            for(var j = 0; j < currentShows.length; j++){
                                if(+shows[i] == +currentShows[j]["id"]){
                                    $('<span>').addClass("square").css("background-color", currentShows[i]["color"]).attr("title", currentShows[i]["name"]).appendTo(showsTd);
                                    break;
                                }
                            }
                        }
                        hideModalWindow(permissionModalWindow);
                        ContainerLoadIndicatorHide();
                        
                    }
                });
                $(citySelector).select2({//Преобразует элемент управления к Select2 виду
                    placeholder: "Выберите города артиста",
                    language: "ru",
                    allowClear: true

                });

                $(artistSelector).select2({//Преобразует элемент управления к Select2 виду
                    placeholder: "Для получения списка шоу, выберите город",
                    language: "ru",
                    multiple: true,
                    allowClear: true

                });
                if(cities.length != 0){
                    $(citySelector).val(0).trigger("change");
                }
                citySelector.change(function () {
                    ContainerLoadIndicatorShow($(artistSelector).next());
                    $.post("/aj_api_admin/", {allowed_artists:1, city_for_check:$(citySelector).val()}, function(response){
                        var data = ResponseToNotify(response);
                        if(response["status"] != "data"){
                            return;
                        }
                        var allowed_artists = data["allowed_shows"];
                        currentShows = data["allowed_shows"];
                        artistSelector.empty();
                        for(var i = 0; i < allowed_artists.length; i++){
                            $('<option>').text(allowed_artists[i]["name"]).val(allowed_artists[i]["id"]).attr("data-color", allowed_artists[i]["color"]).appendTo(artistSelector);
                        }
                    });
                });
            });
            //Отображение доступов артиста
            if(_editData) {
                var permissions = _editData["presentator_permissions"];
                var permissionTable = $('#presentatorPermissionsTable');
                for (var i = 0; i < permissions.length; i++) {
                    var shows = permissions[i]["shows"];
                    var showsIds = [];
                    var permissionTr = $('<tr>').addClass("little-selection").attr("data-city-id", permissions[i]["city_id"]).appendTo(permissionsTable);
                    var removePermissionTd = $('<td>').css("width", "22px").addClass("td-remove").appendTo(permissionTr);
                    removePermissionTd.click(function () {
                        $(this).parent().remove();
                    });
                    $('<span>').addClass("glyphicon glyphicon-remove icon icon-remove").appendTo(removePermissionTd);
                    $('<td>').text(permissions[i]["city_name"]).css("width", "65%").css("font-weight", "bold").css("text-align", "center").appendTo(permissionTr);
                    var showsTd = $('<td>').css("width", "35%").appendTo(permissionTr);
                    for (var j = 0; j < shows.length; j++) {
                        $('<span>').addClass("square").css("background-color", shows[j]["color"]).attr("title", shows[j]["name"]).appendTo(showsTd);
                        showsIds.push(shows[j]["id"])
                    }
                    permissionTr.attr("data-shows", showsIds);
                }
            }

            var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, content, function () {
                if (TotalInputsValidator(modalWindow)) {
                    $.post("aj_users_add/", {
                        id: userId,
                        type: _type,
                        name: $('#name').val().trim(),
                        alias: $('#alias').val().trim(),
                        email: $('#email').val().trim(),
                        adress: $('#adress').val().trim(),
                        contacts: $('#contacts').val().trim(),
                        login: $('#login').val().trim(),
                        password: $('#password').val().trim(),
                        presentator_show_events_limit: $('#presentator_show_events_limit').val().trim(),
                        permissions: JSON.stringify(GetChoosenArtistPermissons()),
                    }, function (response) {

                        var status = ResponseToNotify(response);
                        if (status == "success") {
                            hideModalWindow(content);
                            UpdateData();
                        }
                    });
                }
            });
        if (!(editLabel)) {
            PassGen();
        }
        });


    }
}
function UserSendAuthData(_name, _username, _password, _email) {
    var modalWindowTitle = "Отправка учетных данных пользователю";
    var content = $('<div>').addClass("textMiddle");
    var frame = $('<form>').addClass("form-horizontal").appendTo(content);

    var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
    $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "name").text("Имя").appendTo(innerDiv);
    var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
    var input = $('<input>').addClass("form-control input-sm").attr("id", "name").val(_name).appendTo(inputContainer);
    input.attr("readonly", "readonly");

    var frame = $('<form>').addClass("form-horizontal").appendTo(content);
    var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
    $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "login").text("Логин").appendTo(innerDiv);
    var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
    var input = $('<input>').addClass("form-control input-sm").attr("id", "login").val(_username).appendTo(inputContainer);
    input.attr("readonly", "readonly");

    var frame = $('<form>').addClass("form-horizontal").appendTo(content);
    var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
    $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "password").text("Пароль").appendTo(innerDiv);
    var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
    var input = $('<input>').addClass("form-control input-sm").attr("id", "password").val(_password).appendTo(inputContainer);
    input.attr("readonly", "readonly");

    var frame = $('<form>').addClass("form-horizontal").appendTo(content);
    var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
    $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "email").text("Адрес отправки").appendTo(innerDiv);
    var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
    var input = $('<input>').addClass("form-control input-sm").attr("id", "email").attr("type", "email").attr("required", "required").val(_email).appendTo(inputContainer);

    var frame = $('<form>').addClass("form-horizontal").appendTo(content);
    var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
    $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "comment").text("Комментарий в письме").appendTo(innerDiv);
    var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
    var input = $('<textarea>').addClass("form-control input-sm").attr("id", "comment").attr("rows", 12).css("resize", "none").appendTo(inputContainer);


    var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, content, function () {
        if (TotalInputsValidator(modalWindow)) {
            $.post("aj_control_users_send_data/", {
                name: _name,
                username: _username,
                password: _password,
                comment: $('#comment').val(),
                email: $('#email').val()
            }, function (response) {

                var status = ResponseToNotify(response);
            });
            ShowNotify(0, "Письмо с учетными данными отправляется...", 1);
            hideModalWindow(content);
        }
    });
}
function UserLock(_id, _status, _divElem) {
    var confirmQuestion = "";
    if(_status == "active"){
        confirmQuestion = "Заблокировать выбранного пользователя?";
    }
    else{
        confirmQuestion = "Разблокировать выбранного пользователя?";
    }
    var modalWindow = showModalWindow_new("okcancel", confirmQuestion, false, function () {
        $.post("/aj_users_lock/", {
                id: _id,
                status: _status
            }, function (response) {
                var responseStatus = ResponseToNotify(response);
                if(responseStatus == "success"){
                    _divElem = $(_divElem);
                    if (_status == "active") {
                        _divElem.attr("data-status", "locked");
                        _divElem.find(".user-status").removeClass("glyphicon-check").addClass("glyphicon-lock").css("color", "rgb(51, 122, 183").attr("title", "Заблокирован");
                        _divElem.find("tr").css("background-color", "rgba(51, 122, 183, 0.34)");
                    }
                    else {
                        _divElem.attr("data-status", "active");
                        _divElem.find("tr").css("background-color", "rgba(0, 128, 0, 0.34)");
                        _divElem.find(".user-status").removeClass("glyphicon-lock").addClass("glyphicon-check").css("color", "green").attr("title", "Активен");
                    }
                    hideModalWindow(modalWindow);
                }
            });
    }, false, true);
    return;
//
}
function UserUpdatePass(_id, _elem) {
    var confirmQuestion = "Сгенерировать новый пароль для пользователя?";
    var modalWindow = showModalWindow_new("okcancel", confirmQuestion, false, function () {
        var password = "";
        for (i = 0; i < 8; i++) {
            password += String(RangomGenerator(0, 9));
        }
        $.post("/aj_users_fastpasschange/", {
            id: _id,
            password: password
        }, function (response) {
            var responseStatus = ResponseToNotify(response);
            if (responseStatus == "success") {
                _elem.text(password);
                hideModalWindow(modalWindow);
            }
        });
    }, false, true);
    return;
}
function UserRemove(_id, _userName, _elem) {
    var frame = $('<form>').addClass("form-horizontal");
    var exclamation = $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 15).text("ВНИМАНИЕ!").appendTo(frame);

    var exclamation = $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 55).text("Это действие будет нельзя отменить").appendTo(frame);

    var removeConfirmToggle = $('<div>').appendTo(frame);
    var labelContainer = $('<div>').addClass("col-md-10").css("text-align", "right").appendTo(removeConfirmToggle);
    var toggleContainer = $('<div>').addClass("col-md-2").css("text-align", "right").appendTo(removeConfirmToggle);
    var removeConfirmToggle = $('<input>').attr("id", "removeConfirmToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
    $('<label>').attr("for", "removeConfirmToggle").addClass("text-primary control-label").text("Подтверждение удаления").css("user-select", "none").appendTo(labelContainer);

    var modalWindow = showModalWindow_new("okcancel", ("Удаление: " + _userName), frame, function () {
        $.post("/aj_control_users_remove/", {
                id: _id,
                remove_confirm: $(removeConfirmToggle).prop("checked")
            }, function (response) {
                var responseStatus = ResponseToNotify(response);
                if (responseStatus == "success") {
                    _elem.remove();
                    hideModalWindow(modalWindow);
                }
            });
    });
    $(removeConfirmToggle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
    return;
}
//USERS:
//Автогенерация логина для менеджера (на основе имени и фамилии)
function MakeLoginNameForManager(){
    //Получение данных из открывшейся формы
    var login = $('#login');
    var alias = $('#alias');
    var fname = $('#firstName').val() || "" ;
    var lname = $('#lastName').val() || "";

    var resName = "";
    var lastCharCode = 4;
    var replacer = Transliteration(fname, 7);
    replacer = replacer.trim();
    replacer = replacer.replace("'", "");
    if(replacer.length < 4){
        lastCharCode = replacer.length;
    }
    replacer = replacer.substring(0, lastCharCode);

    resName += replacer;

    replacer = Transliteration(lname, 7);

    replacer = replacer.trim();
    replacer = replacer.replace("'", "");
    lastCharCode = 4;
    if(replacer.length < 4){
        lastCharCode = replacer.length;
    }
    replacer = replacer.substring(0, lastCharCode);

    resName += replacer;
    resName = resName.toLowerCase();
    login.val(resName);
    alias.val(fname + " " + lname);
    return;
}
//Автогенерация логина для артиста
function MakeLoginNameForArtist(){
    //Получение данных из открывшейся формы
    var permissions = $('#presentatorPermissionsTable tr');
    if(permissions.length == 0){
        alert("Для генерации логина необходимо выбрать доступные города и шоу");
        return;
    }
    var login = "p_";
    var city_string = Transliteration($($(permissions[0]).find("td")[1]).text()).toLowerCase();

    $('#login').val((login + city_string).replace("'", "").replace("-", ""));
    return;
}
function GetChoosenArtistPermissons() {
    var permissions = [];
    var unprocessedPermissions = $('#presentatorPermissionsTable tr');
    for(var i = 0; i < unprocessedPermissions.length; i++){
        var permission = {};
        permission["city"] = +$(unprocessedPermissions[i]).attr("data-city-id");
        permission["shows"] = $(unprocessedPermissions[i]).attr("data-shows").split(",");
        permissions.push(permission);
    }
    return permissions;
}
//Генерация пароля в форме
function PassGen(){
    var password = $('#password');
    var passwordCharsCount = 8;
    var lowRandomGeneratorLimit = 0;
    var highRandomGeneratorLimit = 9;
    var resultPassString = "";

    for(i = 0; i < passwordCharsCount; i++){
        resultPassString += String(RangomGenerator(lowRandomGeneratorLimit, highRandomGeneratorLimit));
    }
    password.val(resultPassString);
}

//Stats==================================================================================
function Stats_LoadSelectItemsUsers(_userType){
    if(_userType == "manager"){
        ContainerLoadIndicatorShow($('#statsUser').next());
        $.post("aj_api_all/", {manager_own_data: true}, function (response) {
            ContainerLoadIndicatorHide();
            var data = ResponseToNotify(response);
            if (response["status"] != "data") {
                return;
            }
            var user = data["manager_own_data"];
            $("#statsUser").append($('<option>').val(user["siteuser__id"]).text(user["siteuser__name"]));
            $("#statsUser").val(user["siteuser__id"]);
            $("#statsUser").attr("disabled", "disabled");
            Stats_LoadSelectItemsCities();
        });
    }else{
        var requestedUsers = {};
        var usersType = "";
        var notifyNoUsersText = "";
        if ($('#statsType').val() == "Менеджер") {
            requestedUsers["managers"] = 1;
            requestedUsers["managers_active"] = 1;
            usersType = "manager";
            notifyNoUsersText = "Нет активных менеджеров"
        } else {
            if ($('#statsType').val() == "Артист") {
                requestedUsers["presentators"] = 1;
                requestedUsers["presentators_active"] = 1;
                usersType = "artist";
                notifyNoUsersText = "Нет активных артистов"
            }
        }
        ContainerLoadIndicatorShow($('#statsUser').next());
        $.post("aj_api_admin/", requestedUsers, function (response) {
            ContainerLoadIndicatorHide();
            var data = ResponseToNotify(response);
            if (response["status"] != "data") {
                return;
            }
            if (usersType == "manager") {
                var users = data["managers"];
            } else {
                var users = data["presentators"];
            }
            $("#statsUser").empty();

            if (users.length != 0) {
                var firstListUser = users[0]["id"];
                for (var i = 0; i < users.length; i++) {
                    $("#statsUser").append($('<option>').val(users[i]["id"]).text(users[i]["alias"]));
                    $("#statsUser").val(firstListUser);
                }
                Stats_LoadSelectItemsCities();
            } else {
                ShowNotify(3, notifyNoUsersText, 0, 2500);
            }

        });
    }
    return;


}
function Stats_LoadSelectItemsCities(){

    if($('#statsType').val() == "Менеджер"){
        usersType = "manager";
    }else{
        if($('#statsType').val() == "Артист"){
            usersType = "artist";
        }
    }
    ContainerLoadIndicatorShow($('#statsCity').next());
    $.post('aj_control_stats_allowed_cities/', {
        type: usersType,
        user: $("#statsUser").val()
    }, function(response){
        ContainerLoadIndicatorHide();
        var data = ResponseToNotify(response);
        if (response["status"] == "info") {
            $("#statsCity").empty();
            $('#statsCity').select2(
                {
                    placeholder: "Нет городов"
                }
            );
            $("#statsArtist").empty();
            $('#statsArtist').select2(
                {
                    placeholder: "Нет шоу"
                }
            );
            var vals_list = ["companies_count", "companies_date", "calls_count", "calls_date", "tasks_count", "tasks_done_count", "tasks_date", "events_count", "events_add_count", "events_done_count", "events_date", "facts_count", "facts_date"];
            for (var i = 0; i < vals_list.length; i++) {
                $('#' + vals_list[i]).empty();
            }
            return;
        }else{
            var cities = data["list"];
            $("#statsCity").empty();
            $("#statsCity").append($('<option>').val(0).text("Все"));
            for (i = 0; i < cities.length; i++) {
                $("#statsCity").append($('<option>').val(cities[i]["id"]).text(cities[i]["name"]));
            }
            Stats_LoadSelectItemsArtists();
        }
    });
}
function Stats_LoadSelectItemsArtists(){
    if($('#statsType').val() == "Менеджер"){
        usersType = "manager";
    }else{
        if($('#statsType').val() == "Артист"){
            usersType = "artist";
        }
    }
    ContainerLoadIndicatorShow($('#statsArtist').next());
    $.post('aj_control_stats_allowed_artists/', {
        type: usersType,
        user: $("#statsUser").val(),
        city: $('#statsCity').val()
    }, function(response){
        ContainerLoadIndicatorHide();
        var data = ResponseToNotify(response);
        if (response["status"] == "info") {
            $("#statsArtist").empty();
            $('#statsArtist').select2(
                {
                    placeholder: "Нет шоу"
                }
            );
            var vals_list = ["companies_count", "companies_date", "calls_count", "calls_date", "tasks_count", "tasks_done_count", "tasks_date", "events_count", "events_add_count", "events_done_count", "events_date", "facts_count", "facts_date"];
            for (var i = 0; i < vals_list.length; i++) {
                $('#' + vals_list[i]).empty();
            }
            return;
        }else{
            var artists = data["list"];
            $("#statsArtist").empty();
            $("#statsArtist").append($('<option>').val(0).text("Все"));
            for (i = 0; i < artists.length; i++) {
                $("#statsArtist").append($('<option>').val(artists[i]["id"]).text(artists[i]["name"]));
            }
            Stats_LoadStats();
        }
    });
}
function Stats_LoadStats(){
    var vals_list = ["companies_count", "companies_date", "calls_count", "calls_date", "tasks_count", "tasks_done_count", "tasks_date", "events_count", "events_add_count", "events_done_count", "events_date", "facts_count", "facts_date", "last_activity", "work_time", "manager_salary"];
    for(var i = 0; i < vals_list.length; i++) {
        $('#' + vals_list[i]).empty();
    }
    ContainerLoadIndicatorShow($('#userActivityTable'));
    ContainerLoadIndicatorShow($('#userStatsTable'));
    $.post("aj_control_stats_get_stats_data/", {
        type: $('#statsType').val(),
        user: $('#statsUser').val(),
        city: $('#statsCity').val(),
        artist: $('#statsArtist').val(),
        from: ConvertDateTimeToPythonType($('#rangeFrom').datepicker("getDate")),
        to: ConvertDateTimeToPythonType($('#rangeTo').datepicker("getDate"))

    }, function(response){
        ContainerLoadIndicatorHide();
        ContainerLoadIndicatorHide();
        var data = ResponseToNotify(response);
        if(response["status"] != "data"){
            return;
        }
        for(var i = 0; i < vals_list.length; i++){

            $('#' + vals_list[i]).empty();
            if(vals_list[i] == "last_activity"){
                if(data[vals_list[i]]["year"] != 1950 ){
                    var date = ConvertDateToJSFormat(data[vals_list[i]]);
                    $('#' + vals_list[i]).append(ConvertDateToCountDownValue(date));
                }else{
                    $('#' + vals_list[i]).text("Нет данных");
                }
                continue;
            }
            if(vals_list[i] == "work_time"){
                $('#' + vals_list[i]).text(ConvertSecondsToHMSstring(data[vals_list[i]]));
                continue;
            }
            if(data[vals_list[i]]["hour"] != undefined){
                var date = ConvertDateToJSFormat(data[vals_list[i]]);

                if(data[vals_list[i]]["year"] != 1950 ){
                    $('#' + vals_list[i]).attr("title", ConvertDateToCountDownValue(date).text()).append(ConvertDateTimeToDateLabel(date, "date"));
                }else{
                    $('#' + vals_list[i]).text("Нет данных");
                }
            }else{
                $('#' + vals_list[i]).text(data[vals_list[i]]);
            }
        }
        //Заполнение обработчиков кнопок
        var lastCallButton = $('#lastCallButton');
        var lastTaskButton = $('#lastTaskButton');
        var lastEventButton = $('#lastEventButton');

        $(lastCallButton).unbind();
        $(lastTaskButton).unbind();
        $(lastEventButton).unbind();

        if(data["last_call"]){
            $(lastCallButton).click(function () {
                ShowCall(data["last_call"]["id"], data["last_call"]["name"]);
            });
        }else{
            $(lastCallButton).click(function () {
                ShowNotify("3", "Нет последнего звонка");
            });
        }

        if(data["last_task"]){
            $(lastTaskButton).click(function () {
                ShowTask(data["last_task"]["id"], data["last_task"]["name"]);
            });
        }else{
            $(lastTaskButton).click(function () {
                ShowNotify("3", "Нет последней задачи");
            });
        }

        if(data["last_event"]){
            $(lastEventButton).click(function () {
                ShowEvent(data["last_event"]["id"]);
            });
        }else{
            $(lastEventButton).click(function () {
                ShowNotify("3", "Нет последнего мероприятия");
            });
        }

    });
    return;
}
function Stats_ShiftMonth(_direction, _inUnloadMenu){
    if(_direction == "back"){
        var currentDate = $('#rangeFrom').datepicker("getDate");
        currentDate.setMonth(currentDate.getMonth() - 1);
        currentDate.setDate(1);
        $('#rangeFrom').datepicker("update", currentDate);

        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(0);
        $('#rangeTo').datepicker("update", currentDate);
    }else if(_direction == "forward"){
        var currentDate = $('#rangeFrom').datepicker("getDate");
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1);
        $('#rangeFrom').datepicker("update", currentDate);

        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(0);
        $('#rangeTo').datepicker("update", currentDate);
    }else{
        alert("ERROR at Stats_ShiftMonth - wrong '_direction' argument. Allowed values: [back, forward]");
        return;
    }
    if(_inUnloadMenu){
        UnloadEventsPaginator();
    }else{
        Stats_LoadStats();
    }
    return;
}
function Stats_CheckRangeValues(_rangeElem){
    var dateFrom = $('#rangeFrom').datepicker("getDate");
    var dateTo = $('#rangeTo').datepicker("getDate");

    if(_rangeElem == "from"){
        if(dateFrom > dateTo){
            $('#rangeTo').datepicker("setDate", dateFrom);
            ShowNotify(3, "Неправильный диапазон дат. Значение пикера было скорректировано", 0, 3000);
        }
    }else if(_rangeElem == "to"){
        if(dateFrom > dateTo){
            $('#rangeFrom').datepicker("setDate", dateTo);
            ShowNotify(3, "Неправильный диапазон дат. Значение пикера было скорректировано", 0, 3000);
        }
    }else{
        alert("ERROR at Stats_CheckRangeValues - wrong 'rangeElem' argument. Allowed values: [from, to]");
        return;

    }
    Stats_LoadStats();
    return;
}
function Stats_LoadLogEntry(_id){
    ShowNotify_LoadData();
    $.post('/aj_logs_log_data/', {
        id: _id
    }, function(response){
        var data = ResponseToNotify(response);
        if (response["status"] != "data") {
            return;
        }
        var modalBody = TransformLogForModal(data);
        var modalWindow = showModalWindow_new("cancel", "Событие лога", modalBody);
    });
    return;
}

function Stats_CompaniesList(_userType){
    var modalWindowTitle = "Список компаний пользователя: " + $('#statsUser').select2('data')[0]["text"] + " для города: " + $('#statsCity').select2('data')[0]["text"] + " для шоу: " + $('#statsArtist').select2('data')[0]["text"];

    var content = $('<div>').addClass("textMiddle");
    var contentModule = $('<div>').addClass("pagination").css("margin-bottom", "10px").css("margin-left", "15px").css("margin-right", "15px").appendTo(content);
    var contentModule = $('<div>').addClass("content").appendTo(content);


    var controlButtons = {};
    var modalWindowStatus = "";

    if(_userType == "manager") {
        var modalWindowStatus = "cancel";
    }else{
        var modalWindowStatus = "customcancel";
        controlButtons["Добавить компанию пользователю"] = {
                            "button": $('<button>').css("background-color", "blue").css("color", "white").append($('<span>').addClass("glyphicon glyphicon-plus").css("top", "-1px")),
                            "function": function () {
                                var wrapper = $('<div>').addClass("form-group").css("padding-bottom", "20px").css("margin-top", 10);
                                $('<div>').addClass("header").text("Город:").appendTo(wrapper);
                                $('<select>').addClass("form-control input-sm").attr("id", "addCompany_city").attr("required", "required").appendTo(wrapper);
                                $('<div>').addClass("header").text("Компания:").appendTo(wrapper);
                                $('<select>').addClass("form-control input-sm").attr("id", "addCompany_company").attr("noplaceholder", "noplaceholder").attr("required", "required").attr("disabled", "disabled").appendTo(wrapper);
                                $('<div>').addClass("header").text("Доступные шоу:").appendTo(wrapper);
                                $('<select>').addClass("form-control input-sm").attr("disabled", "disabled").attr("id", "addCompany_artist").attr("required", "required").appendTo(wrapper);

                                var modalWindow = showModalWindow_new("okcancel", "Добавить компанию пользователю", wrapper, function (
                                ){
                                    if (TotalInputsValidator(modalWindow)) {
                                        $.post("/aj_manager_add_company_to_manager/", {
                                            user: $('#statsUser').select2("val"),
                                            company: $('#addCompany_company').select2("val"),
                                            shows: JSON.stringify($('#addCompany_artist').select2("val"))
                                        }, function (response) {
                                            var status = ResponseToNotify(response);
                                            if (status == "success") {
                                                UpdateData();
                                                hideAllModalWindows();
                                            }
                                        });
                                    }
                                });
                                $('#addCompany_city').select2({//Преобразует элемент управления к Select2 виду
                                    placeholder: "Выберите город",
                                    language: "ru"
                                });
                                $('#addCompany_city').change(function () {
                                    $('#addCompany_company').empty();
                                    Select2CompaniesLoader($("#addCompany_company"), "/aj_api_admin/", $('#addCompany_city').select2("val"), FormatJsonDataSelectionsCompanyPicker);

                                });
                                $('#addCompany_artist').select2({//Преобразует элемент управления к Select2 виду
                                    placeholder: "Выберите шоу",
                                    language: "ru",
                                    multiple: true,
                                    allowClear: true
                                });
                                $.post("/aj_api_all/", {
                                        cities: 1
                                    }, function(response){
                                    var data = ResponseToNotify(response);
                                    if (response["status"] != "data") {
                                        hideModalWindow(wrapper);
                                        return;
                                    }
                                    var artists = data['artists'];
                                    var cities = data["cities"];
                                    for(var i = 0; i < cities.length; i++){
                                        $('#addCompany_city').append($('<option>').text(cities[i]["name"]).val(cities[i]["id"]));
                                    }
                                    $('#addCompany_company').removeAttr("disabled");
                                    Select2CompaniesLoader($("#addCompany_company"), "/aj_api_admin/", $('#addCompany_city').select2("val"), FormatJsonDataSelectionsCompanyPicker, FormatJsonDataSelectionCompanyPickerForCompanyAdder, modalWindow);

                                    });
                            }
                        };
    }
    var modalWindow = showModalWindow_new(modalWindowStatus, modalWindowTitle, content, function () {}, controlButtons);

    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};
    var options = {};
    if(_userType == "manager"){
        urls["pages_count"] = "/aj_api_all/";
        urls["content"] = "/aj_api_all/";

        params["search"] = GetSearchPanelValue();
        params["manager_companies"] = 1;

    }else{
        urls["pages_count"] = "/aj_api_admin/";
        urls["content"] = "/aj_api_admin/";

        params["search"] = GetSearchPanelValue();
        params["manager_companies"] = 1;
        params["manager"] = $('#statsUser').select2('val');
    }

    params["city"] = $('#statsCity').select2('val');
    params["show"] = $('#statsArtist').select2('val');

    containers["paginator"] = $(modalWindow).find('.pagination');
    containers["content"] = $(modalWindow).find('.content');

    functions["get_page_data"] = Stats_CompaniesList_Fill;

    options["nobigshift"] = true;

    paginator = new Paginator(containers, urls, params, functions, options);
    paginator.Create();
}
function Stats_CompaniesList_Fill(_container, _data){
    var table = $('<table>').addClass("table table-bordered text-in-table modal_window_list").attr("width", "100%").css("table-layout", "fixed").css("cellpadding", "5").appendTo(_container);
    for (var i = 0; i < _data.length; i++) {
        var tr = $('<tr>').addClass("little-selection").attr("width", "100%").appendTo(table);//В классе modal-tr - изменение цвета при наведении

        var td = $('<td>').addClass("active-content").css("font-size", "smaller").css("font-weight", "bold").appendTo(tr).attr("width", "23px");
        var spanDelete = $('<span>').addClass("glyphicon glyphicon-remove icon icon-red").attr("title", "Забрать компанию у менеджера.").css("margin-right", "0").appendTo(td);
        (function (companyId, clickedElem) {
            clickedElem.click(function () {
                var deletedElem = $(this).parent();
                var modalWindow = showModalWindow_new("okcancel", "Забрать эту компанию у выбранного менеджера?", false, function () {
                    $.post("/aj_manager_steal_company/", {
                        company: companyId,
                        site_user: $('#statsUser').select2('val')
                    }, function (response) {
                        ResponseToNotify(response);
                        if (response["status"] == "success") {
                            deletedElem.remove();
                            UpdateData();
                        }
                        hideModalWindow(modalWindow);
                    });
                }, false, true);
            })

        })(_data[i]["id"], td);
        var td = $('<td>').addClass("active-content").css("font-size", "smaller").css("font-weight", "bold").text(_data[i]["name"]).attr("title",_data[i]["name"]).attr("width", "34%").appendTo(tr);
        (function(companyId, companyName){
            td.click(function(){
                $.post('/aj_manager_allowed_shows/',
                    {
                        company: companyId,
                        site_user: $('#statsUser').select2('val')
                    }, function (response) {
                        var shows = ResponseToNotify(response);
                        if (response["status"] != "data") {
                            return;
                        }

                        var companyShowsContent = $('<div>').addClass("textMiddle");

                        var modalWindowTitle = "Шоу пользователя: " + $('#statsUser').select2('data')[0]["text"] + ", для компании: " + companyName;
                        var companyShowsModal = showModalWindow_new("cancel", modalWindowTitle, companyShowsContent, function () {});
                        var table = $('<table>').addClass("modal_window_list table table-bordered text-in-table").attr("width", "100%").css("table-layout", "fixed").css("cellpadding", "5").appendTo(companyShowsContent);

                        for (j = 0; j < shows["list"].length; j++){
                            var tr = $('<tr>').attr("width", "100%").appendTo(table);
                            var td = $('<td>').addClass("active-content").appendTo(tr).attr("width", "24px");

                            var spanDelete = $('<span>').addClass("glyphicon glyphicon-remove icon icon-red").attr("title", "Забрать шоу в компании у менеджера.").attr("show-id", shows["list"][j]["show__id"]).css("margin-right", "0").appendTo(td);
                            (function (forshow_companyId, clickedElemForShow) {

                                var showDeletedElem = spanDelete.parent().parent();
                                clickedElemForShow.click(function () {
                                    var modalWindow = showModalWindow_new("okcancel", "Забрать это шоу в компании?", false, function () {
                                        $.post("/aj_manager_steal_company/", {
                                            site_user: $('#statsUser').select2('val'),
                                            show_id: $(this).attr("show-id"),
                                            company: forshow_companyId
                                        }, function (response) {
                                            var status = ResponseToNotify(response);
                                            if (status == "success") {
                                                var showsContainer = showDeletedElem.parent();
                                                showDeletedElem.remove();
                                                if(showsContainer.find("tr").length == 0){
                                                    hideAllModalWindows();
                                                }
                                                UpdateData();
                                            }
                                            hideModalWindow(modalWindow);
                                        });
                                    }, false, true);
                                });
                            })(companyId, td);
                            var td = $('<td>').text(shows["list"][j]["show__name"]).attr("title", shows["list"][j]["show__name"]).attr("width", "94%").appendTo(tr);
                        }
                    });
            });
        })(_data[i]["id"], _data[i]["name"]);
        var td = $('<td>').css("font-size", "smaller").css("font-weight", "bold").text(_data[i]["city__name"] + ", " + _data[i]["adress"]).attr("title", _data[i]["city__name"] + ", " + _data[i]["adress"]).attr("width", "54%").appendTo(tr);
        var td = $('<td>').addClass("active-content").css("font-size", "smaller").css("font-weight", "bold").appendTo(tr).attr("width", "23px");
        var spanGoTo = $('<span>').addClass("glyphicon glyphicon-arrow-right icon icon-blue").attr("title", "Перейти к компании.").css("margin-right", "0").appendTo(td);
        (function (companyId) {
            td.click(function (event) {
                GoToCompanyPage(companyId);
                event.stopPropagation();
            });
        })(_data[i]["id"]);
    }
}

function Stats_CallsList() {
    ShowCallsHistory(false, false, false, true);
    return;
}
function Stats_TasksList() {
    ShowTasksHistory(false, false, false, true);
    return;
}
function Stats_EventsList() {
    ShowEventsHistory(false, false, false, true);
    return;
}
function Stats_LogsList() {
    LogsHistory_Paginator(false, false, false, true);
    return;
}
//Lists=====================================================================================
function AddObjectToLists(){
    var currentType = $('#listsTypeChoose').val();
    var content = $('<div>').addClass("textMiddle");
    var frame = $('<form>').addClass("form-horizontal").appendTo(content);
    var modalWindowTitle = "";
    if(currentType == "city"){
        modalWindowTitle = "Добавление города";
        var innerDiv = $('<div>').appendTo(frame);
        $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "cityName").text("Название").appendTo(innerDiv);
        var inputContainer = $('<div>').addClass("form-group").addClass("col-md-9").appendTo(innerDiv);
        var input = $('<input>').addClass("form-control input-sm").attr("id", "cityName").attr("required", "required").attr("placeholder", "Название города").attr("autocomplete", "off").appendTo(inputContainer);
        $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "cityName").text("Доступные шоу").appendTo(innerDiv);
        var inputContainer = $('<div>').addClass("form-group").addClass("col-md-9").appendTo(innerDiv);
        var selectAllowedShows = $('<select>').attr("id", "allowedCityShows").css("width", "100%").attr("required", "required").appendTo(inputContainer);
        $.post('/aj_api_admin/',
            {
                artists: "1"
            }, function(response){
                var data = ResponseToNotify(response);
                if(response["status"] != "data"){
                    return;
                }
                for(var i = 0; i < data["artists"].length; i++){
                    $('<option>').val(data["artists"][i]["id"]).text(data["artists"][i]["name"]).appendTo(selectAllowedShows);
                }
                var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, content, function () {
                    if (TotalInputsValidator(modalWindow)) {
                        $.post("/aj_control_lists_city_add/", {
                            name: $('#cityName').val().trim(),
                            shows: JSON.stringify($('#allowedCityShows').val())
                        }, function (response) {

                            var status = ResponseToNotify(response);
                            if (status == "success") {
                                hideModalWindow(content);
                                UpdateData();
                            }
                        });
                    }
                });
                $('#allowedCityShows').select2({
                        placeholder: "Доступные шоу города",
                        language: "ru",
                        multiple: true,
                        allowClear: true
                    }
                );
                $('#allowedCityShows').val(0).trigger("change");
            });


    }else if(currentType == "shows"){
        modalWindowTitle = "Добавление артиста";
        var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
        $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "artistName").text("Название").appendTo(innerDiv);
        var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
        var input = $('<input>').addClass("form-control input-sm").attr("id", "artistName").attr("required", "required").attr("placeholder", "Название шоу").attr("autocomplete", "off").appendTo(inputContainer);
        var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
        $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "artistColor").text("Цвет").appendTo(innerDiv);
        var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
        var input = $('<input>').addClass("form-control input-sm").attr("id", "artistColor").attr("autocomplete", "off").appendTo(inputContainer);

        var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, content, function () {
            if (TotalInputsValidator(modalWindow)) {
                $.post("/aj_control_lists_artist_add/", {
                    name: $('#artistName').val().trim(),
                    color: $('#artistColor').spectrum("get").toHexString()
                }, function (response) {

                    var status = ResponseToNotify(response);
                    if (status == "success") {
                        hideModalWindow(content);
                        UpdateData();
                    }
                });
            }
        });
        $("#artistColor").spectrum({
            preferredFormat: "hex",
            showInput: true,
            color: "#000"
        });
        $('.sp-replacer').css("display", "block");
    }

}
function RemoveObjectFromLists(_id){
    var currentType = $('#listsTypeChoose').val();
    var modalWindowTitle = "";
    var postUrl = "";
    if(currentType == "city"){
        modalWindowTitle = "Удалить выбранный город?";
        postUrl = "/aj_control_lists_city_remove/";
    }else if(currentType == "shows"){
        modalWindowTitle = "Удалить выбранное шоу?";
        postUrl = "/aj_control_lists_artist_remove/";
    }
    var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, false, function () {
        $.post(postUrl, {id: _id}, function (response) {
                var result = ResponseToNotify(response);
                if (result == "success") {
                    UpdateData();
                    hideModalWindow(modalWindow);
                }
            });
    }, false, true);
    return;
}
//Cities
function Lists_CityPaginator(){
    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};


    urls["pages_count"] = "/aj_control_lists_cities/";
    urls["content"] = "/aj_control_lists_cities/";

    params["search"] = GetSearchPanelValue();

    containers["paginator"] = $('#usrPagination');
    containers["content"] = $('#usrContent');

    functions["get_page_data"] = Lists_CityContent;

    paginator = new Paginator(containers, urls, params, functions);
    paginator.Create();
    return;
}
function Lists_CityContent(_container, _data){
    var div = $('<div>').css("margin-bottom", "7px").css("background-color", "#e4dada").css("padding", "2px").css("border-top-left-radius", "5px").css("border-top-right-radius", "5px").appendTo(_container);
    var table = $('<table>').attr("width", "100%").appendTo(div);
    var tr = $('<tr>').addClass("table-header-row-decoration").css("font-weight", "bold").css("font-size", "medium").appendTo(table);
    var td = $('<td>').attr("width", "90%").css("text-align", "left").text("Имя").appendTo(tr);
    var td = $('<td>').attr("width", "10%").text("Управление").appendTo(tr);
    for (i = 0; i < _data.length; i++) {
        var div = $('<div>').addClass("list-item").attr("data-id", _data[i]["id"]).css("padding", "2px").appendTo(_container);

        div.click(function () {
            Lists_CityEdit($(this).attr("data-id"));
        });
        var table = $('<table>').addClass("fixed-layouts").attr("width", "100%").appendTo(div);
        var tr = $('<tr>').css("font-size", "small").css('border-radius', "1px").attr("title", _data[i]["name"]).appendTo(table);
        var td = $('<td>').addClass("overflow-dotted").attr("width", "90%").css("padding-bottom", "3px").css("text-align", "left").css("padding-top", "3px").css("padding-left", "5px").attr("data-type", "name").css("font-weight", "bold").text(_data[i]["name"]).appendTo(tr);

        if(_data[i]["enabled"]){
            tr.css("background-color", "rgba(0, 128, 0, 0.34)");
            tr.attr("data-enabled", true);
        }else{
            tr.css("background-color", "rgba(51, 122, 183, 0.34)");
            tr.attr("data-enabled", false);
        }



        var td = $('<td>').attr("width", "10%").css("text-align", "right").appendTo(tr);
        var lockUnlockButton = $('<span>').addClass("control-button glyphicon glyphicon-lock").attr("title", "Разблокировать/заблокировать город").appendTo(td);
        lockUnlockButton.click(function(event){
            var modalWindowTitle = "";
            if($(this).parents('tr').attr("data-enabled") == "true"){
                modalWindowTitle = "Заблокировать город?";
                var frame = $('<form>').addClass("form-horizontal");
                var exclamation = $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 15).text("ВНИМАНИЕ!").appendTo(frame);

                var exclamation = $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 55).text("Блокировка города затронет все доступы менеджеров и артистов").appendTo(frame);

                var removeConfirmToggle = $('<div>').appendTo(frame);
                var labelContainer = $('<div>').addClass("col-md-10").css("text-align", "right").appendTo(removeConfirmToggle);
                var toggleContainer = $('<div>').addClass("col-md-2").css("text-align", "right").appendTo(removeConfirmToggle);
                var removeConfirmToggle = $('<input>').attr("id", "removeConfirmToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
                $('<label>').attr("for", "removeConfirmToggle").addClass("text-primary control-label").text("Подтверждение блокировки").css("user-select", "none").appendTo(labelContainer);

                var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, frame, function () {
                ShowNotify_LoadData();
                $.post("/aj_control_lists_city_change_status/", {id: $(clickedItem).parents('.list-item').attr("data-id"), lock_confirm: $(removeConfirmToggle).prop("checked")}, function(response){
                    ResponseToNotify(response);
                    if(response["status"] == "success"){
                        UpdateData();
                        hideModalWindow(modalWindow);
                    }
                });
                });
                $(removeConfirmToggle).bootstrapToggle({
                    on: "Да",
                    off: "Нет",
                    size: "small",
                    offstyle: "danger",
                    onstyle: "success"
                });
            }else{
                modalWindowTitle = "Разблокировать город?";
                var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, false, function () {
                ShowNotify_LoadData();
                $.post("/aj_control_lists_city_change_status/", {id: $(clickedItem).parents('.list-item').attr("data-id")}, function(response){
                    ResponseToNotify(response);
                    if(response["status"] == "success"){
                        UpdateData();
                        hideModalWindow(modalWindow);
                    }
                });
            }, false, true);
            }
            var clickedItem = this;

            event.stopPropagation();
        });
        var removeButton = $('<span>').addClass("control-button glyphicon glyphicon-remove-circle").attr("title", "Удалить город").appendTo(td);
        removeButton.click(function (event) {
            var container = $(this).parents('.list-item')[0];
            var id = $(container).attr("data-id");
            RemoveObjectFromLists(id);
            event.stopPropagation();
        });


    }
}
function Lists_CityEdit(_id){

    $.post("/aj_api_admin/", {city: "1", id: _id, artists:"1", allowed_artists: 1, city_for_check: _id}, function(response){
        var data = ResponseToNotify(response);
        if(response["status"] != "data"){
            return;
        }
        var shows  = data["artists"];
        var cityData = data["city_data"];
        var allowedShowsUnprocessed = data["allowed_shows"];
        var allowedShows = [];
        for(var i = 0; i < allowedShowsUnprocessed.length; i++){
            allowedShows.push(allowedShowsUnprocessed[i]["id"]);
        }
        var content = $('<div>').addClass("textMiddle");
        var frame = $('<form>').addClass("form-horizontal").appendTo(content);
        var modalWindowTitle = "Редактирование города " + cityData["name"];
        var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
        $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "cityName").text("Название").appendTo(innerDiv);
        var inputContainer = $('<div>').addClass("form-group col-md-9").appendTo(innerDiv);
        var input = $('<input>').addClass("form-control input-sm").attr("id", "cityName").attr("required", "required").attr("placeholder", "Название города").attr("autocomplete", "off").val(cityData["name"]).appendTo(inputContainer);
        $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "cityName").text("Доступные шоу").appendTo(innerDiv);
        var inputContainer = $('<div>').addClass("form-group").addClass("col-md-9").appendTo(innerDiv);
        var selectAllowedShows = $('<select>').attr("id", "allowedCityShows").css("width", "100%").attr("required", "required").appendTo(inputContainer);

        for (var i = 0; i < shows.length; i++) {
            $('<option>').val(shows[i]["id"]).text(shows[i]["name"]).appendTo(selectAllowedShows);
        }
        var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, content, function () {
            if (TotalInputsValidator(modalWindow)) {
                $.post("/aj_control_lists_city_edit/", {
                    name: $('#cityName').val().trim(),
                    id: _id,
                    shows: JSON.stringify($('#allowedCityShows').val())
                }, function (response) {

                    var status = ResponseToNotify(response);
                    if (status == "success") {
                        hideModalWindow(content);
                        UpdateData();
                    }
                });
            }
        });
        $('#allowedCityShows').select2({
                        placeholder: "Доступные шоу города",
                        language: "ru",
                        multiple: true,
                        allowClear: true
                    }
                );
        $('#allowedCityShows').val(allowedShows).trigger("change");
    });
    return;
}
//Shows
function Lists_ArtistPaginator(){
    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};


    urls["pages_count"] = "/aj_control_lists_artist_paginator/";
    urls["content"] = "/aj_control_lists_artist_data/";

    params["search"] = GetSearchPanelValue();

    containers["paginator"] = $('#usrPagination');
    containers["content"] = $('#usrContent');

    functions["get_page_data"] = Lists_ArtistContent;

    var paginator = new Paginator(containers, urls, params, functions);
    paginator.Create();
    return;
}
function Lists_ArtistContent(_container, _data){
    var div = $('<div>').css("margin-bottom", "7px").css("background-color", "#e4dada").css("padding", "2px").css("border-top-left-radius", "5px").css("border-top-right-radius", "5px").appendTo(_container);
    var table = $('<table>').attr("width", "100%").appendTo(div);
    var tr = $('<tr>').addClass("table-header-row-decoration").css("font-weight", "bold").css("font-size", "medium").appendTo(table);
    var td = $('<td>').attr("width", "90%").css("text-align", "left").text("Имя").appendTo(tr);
    var td = $('<td>').attr("width", "10%").text("Управление").appendTo(tr);
    for (i = 0; i < _data.length; i++) {
        var div = $('<div>').addClass("list-item").attr("data-id", _data[i]["id"]).css("padding", "2px").appendTo(_container);

        div.click(function () {
            Lists_ArtistEdit($(this).attr("data-id"));
        });
        var table = $('<table>').addClass("fixed-layouts").attr("width", "100%").css("color", "inherit").appendTo(div);
        var tr = $('<tr>').css("font-size", "small").css('border-radius', "1px").appendTo(table);
        var td = $('<td>').addClass("overflow-dotted").attr("width", "90%").css("padding-bottom", "3px").css("text-align", "left").css("padding-top", "3px").css("padding-left", "5px").attr("data-type", "name").css("font-weight", "bold").text(_data[i]["name"]).appendTo(tr);

        tr.attr("title", _data[i]["name"]).css("background-color", _data[i]["color"]);

        var td = $('<td>').attr("width", "10%").css("text-align", "right").appendTo(tr);
        var removeButton = $('<span>').addClass("control-button glyphicon glyphicon-remove-circle").attr("title", "Удалить шоу").appendTo(td);
        removeButton.click(function (event) {
            var container = $(this).parents('.list-item')[0];
            var id = $(container).attr("data-id");
            RemoveObjectFromLists(id);
            event.stopPropagation();
        });

    }
    return;
}
function Lists_ArtistEdit(_id){

    $.post("/aj_api_all/", {artist: "1", id: _id}, function(response){
        if(response["status"] == "error"){
            return;
        }
        var result = ResponseToNotify(response);
        var currentType = $('#listsTypeChoose').val();
        var content = $('<div>').addClass("textMiddle");
        var frame = $('<form>').addClass("form-horizontal").appendTo(content);
        var modalWindowTitle = "Редактирование артиста: " + result["name"];
        var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
        $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "artistName").text("Название").appendTo(innerDiv);
        var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
        var input = $('<input>').addClass("form-control input-sm").attr("id", "artistName").attr("required", "required").attr("placeholder", "Название шоу").attr("autocomplete", "off").val(result["name"]).appendTo(inputContainer);
        var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
        $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "artistColor").text("Цвет").appendTo(innerDiv);
        var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
        var input = $('<input>').addClass("form-control input-sm").attr("id", "artistColor").attr("autocomplete", "off").appendTo(inputContainer);

        var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, content, function () {
            if (TotalInputsValidator(modalWindow)) {
                $.post("/aj_control_lists_artist_edit/", {
                    name: $('#artistName').val().trim(),
                    color: $('#artistColor').spectrum("get").toHexString(),
                    id: _id
                }, function (response) {

                    var status = ResponseToNotify(response);
                    if (status == "success") {
                        hideModalWindow(content);
                        UpdateData();
                    }
                });
            }
        });
        $("#artistColor").spectrum({
            preferredFormat: "hex",
            showInput: true,
            color: result["color"]
        });
        $('.sp-replacer').css("display", "block");
        });
    return;
}
//Agregators
function Aggregators_Load() {
    if($('#aggregatorTypes').val() == "events"){
        Aggregators_Events_Load();
    }else if ($('#aggregatorTypes').val() == "access"){

    }else if ($('#aggregatorTypes').val() == "chats"){

    }else if ($('#aggregatorTypes').val() == "chrono"){

    }
    return
}
function Aggregators_Events_Load() {
    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};
    var options = {};

    urls["pages_count"] = "/aj_control_aggregator/";
    urls["content"] = "/aj_control_aggregator/";

    params["search"] = GetSearchPanelValue();
    params["type"] = $('#aggregatorVariousSelect').val();
    params["city_id"] = $('#aggregatorCities').val();

    containers["paginator"] = $('#usrPagination');
    containers["content"] = $('#usrContent');

    functions["get_page_data"] = Aggregators_Events_Fill;

    options["owndatastructure"] = true;

    var paginator = new Paginator(containers, urls, params, functions, options);
    paginator.Create();
    return;
}
function Aggregators_Events_Fill(_container, _data) {
    var events = _data["events"];

    var div = $('<div>').css("margin-bottom", "7px").css("padding", "2px").css("border-top-left-radius", "5px").css("border-top-right-radius", "5px").appendTo(_container);
    var table = $('<table>').addClass("table main-table-decoration small-text-in-table table").attr("width", "100%").appendTo(div);
    var headersTr = $('<tr>').addClass("main-table-header-row-decoration main-td-decoration").appendTo(table);
    $('<td>').css("width", "10%").text("Тип").appendTo(headersTr);
    $('<td>').css("width", "15%").text("Менеджер").appendTo(headersTr);
    $('<td>').css("width", "30%").text("Учреждение").appendTo(headersTr);
    $('<td>').css("width", "10%").text("Дата добавления").appendTo(headersTr);
    $('<td>').css("width", "10%").text("Дата события").appendTo(headersTr);
    $('<td>').css("width", "25%").text("Комментарий").appendTo(headersTr);

    for(i = 0; i < events.length; i++){
        table.append(Aggregators_Event_Transform(events[i]));
    }
    return;
}
function Aggregators_Event_Transform(_eventData) {
    var tr = $('<tr>').addClass("main-td-decoration").css("background-color", HexToRGB(_eventData["data"]["artist__color"], 0.4)).css("font-weight", "bold").css("font-size", "medium");
    if(_eventData["t"] == "c"){
        var eventTypeTD = $('<td>').addClass("active_content").attr("title", _eventData["data"]["artist__name"]).text("Звонок").appendTo(tr);
        var commentTD = $('<td>').addClass("active_content").attr("title", _eventData["data"]["comment"]).text(_eventData["data"]["comment"]);
        (function(_x) {
            commentTD.click(function () {
               ShowCall(_x);
            });
            eventTypeTD.click(function () {
               ShowCall(_x);
            });
        })(_eventData["data"]["id"]);
    }else if(_eventData["t"] == "t"){
        var eventTypeTD = $('<td>').addClass("active_content").attr("title", _eventData["data"]["artist__name"]).text("Задача").appendTo(tr);
        var commentTD = $('<td>').addClass("active_content").attr("title", _eventData["data"]["comment"]).text(_eventData["data"]["comment"]);
        (function(_x) {
            commentTD.click(function () {
               ShowTask(_x);
            });
            eventTypeTD.click(function () {
               ShowTask(_x, true);
            });
        })(_eventData["data"]["id"]);
    }else if(_eventData["t"] == "e"){
        var eventTypeTD = $('<td>').addClass("active_content").attr("title", _eventData["data"]["artist__name"]).text("Мероприятие").appendTo(tr);
        var commentTD = $('<td>').addClass("active_content").attr("title", _eventData["data"]["comment"]).text(_eventData["data"]["comment"]);
        (function(_x) {
            commentTD.click(function () {
               ShowEvent(_x);
            });
            eventTypeTD.click(function () {
               ShowEvent(_x);
            });
        })(_eventData["data"]["id"]);
    }
    var managerNameTD = $('<td>').addClass("active_content").attr("title", _eventData["data"]["manager__siteuser__name"]).text(_eventData["data"]["manager__siteuser__name"]).appendTo(tr);
    var companyNameTD = $('<td>').addClass("active_content").attr("title", _eventData["data"]["company__name"]).text(_eventData["data"]["company__name"]).appendTo(tr);
    var statsDT_TD = $('<td>').attr("title", ConvertDateTimeToDateLabel(ConvertDateFromStringValue(_eventData["statsdt"]))).html(ConvertDateToCountDownValue(ConvertDateFromStringValue(_eventData["statsdt"]))).appendTo(tr);
    var datetimeTD = $('<td>').attr("title", ConvertDateTimeToDateLabel(ConvertDateFromStringValue(_eventData["data"]["datetime"]))).html(ConvertDateToCountDownValue(ConvertDateFromStringValue(_eventData["data"]["datetime"]))).appendTo(tr);
    commentTD.appendTo(tr);
    (function (_x) {
            managerNameTD.click(function () {
               ShowUser(_x, "Менеджеры", "manager");
            });
        })(_eventData["data"]["manager__id"]);
    (function(_x) {
            companyNameTD.click(function () {
               EditCompany(false, _x);
            });
        })(_eventData["data"]["company__id"]);

    return tr;
}
//========================================================================================
//=======================================================================================================================
//MANAGERWORK///////////////////////////////////////////////////////////////////////////////////////
//Открывает модальное окно с информацией о менеджерах учреждения и возможностью их редактирования
function CompanyManagers(_id){
    $.post("/aj_company_managers/", {company_id: _id}, function(response) {
        //Содержимое диалогового окна - таблица с менеджерами учреждения
        ShowNotify_LoadData();
        var data = ResponseToNotify(response);
        if (response["status"] != "data") {
            return;
        }
        var managersItems = data;//Разбор полученного контента
        var container = $('<div>').css("width", "100%");//Контейнер не табличный чтобы отделить кнопку
        var table = $('<table>').addClass("text-in-clients-table").attr("id", "managersListTable").addClass("modal_window_list table table-bordered text-in-table").attr("width", "100%").css("table-layout", "fixed").css("cellpadding", "5").appendTo(container);
        if(managersItems["managers"].length == 0){
            $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 15).text("Нет менеджеров учреждения").appendTo(container);
        }
        for(i = 0; i < managersItems["managers"].length; i++) {//Проходимся по списку менеджеров
            var tr = $('<tr>').addClass("little-selection").attr("width", "100%").appendTo(table);
            var td = $('<td>').addClass("td-remove").appendTo(tr).attr("width", "8%").css("text-align", "center");
            var spanManagerDelete = $('<span>').addClass("glyphicon glyphicon-remove icon icon-remove").attr("title", "Забрать компанию у менеджера.").appendTo(td);

            (function(_siteUserId){
                td.click(function() {
                    var deletedElem = $(this).parent();
                    var currentModalWindow = showModalWindow_new("okcancel", "Забрать компанию у выбранного менеджера?", "", function () {
                        ShowNotify_LoadData();
                        $.post("/aj_manager_steal_company/", {
                            company: _id,
                            site_user: _siteUserId
                        }, function (response) {
                            ResponseToNotify(response);
                            if (response["status"] == "success") {
                                deletedElem.remove();
                                if($('#managersListTable').find('td.td-remove').length == 0){
                                    $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 15).text("Нет менеджеров учреждения").prependTo(container);
                                }
                                UpdateData(true, true);
                            }
                            hideModalWindow(currentModalWindow);
                        });
                    }, false, true);
                });

            })(managersItems["managers"][i]["site_user"]["id"]);

            var td = $('<td>').addClass("active-content").attr("width", "15%").css("text-align", "center").appendTo(tr);
            if (managersItems["managers"][i]["shows"].length != 0) {
                for(var j = 0; j < managersItems["managers"][i]["shows"].length; j++){
                    $('<span>').addClass("square").attr("title", managersItems["managers"][i]["shows"][j]["show__name"]).css("background-color", managersItems["managers"][i]["shows"][j]["show__color"]).appendTo(td);
                }
            }
            (function (event, site_user, f_managersItems) {//Обработчик нажатия на элемент в таблице - выводит подробную информацию о менеджере для этой компании
                td.click(function () {
                    var topDiv = $('<div>');
                    if(event == ""){
                        var div = $('<div>').addClass("datestamp").text("Нет последнего события").css("margin-bottom", "15px").css("text-align", "center").appendTo(topDiv);
                    }
                    else{
                        var div = $('<div>').addClass("header").text("Последнее событие:").appendTo(topDiv);
                        var div = $('<div>').css("padding-bottom", "20px").addClass("inner-content").html(TransformLogForModal(event)).appendTo(topDiv);
                    }


                    div = $('<div>').addClass("header").html("Доступные шоу:").appendTo(topDiv);
                    ShowNotify_LoadData();
                    $.post("/aj_manager_allowed_shows/", {company:_id, site_user:site_user}, function(response) {
                        var data = ResponseToNotify(response);
                        if (response["status"] != "data") {
                            return;
                        }
                        var showsTable = $('<table>').addClass("modal_window_list table table-bordered text-in-table").appendTo(topDiv);
                        var shows = data["list"];
                        for(var z = 0; z < shows.length; z++){
                            var showsTR = $('<tr>').attr("data-show-id", shows[z]["show__id"]).css("background-color", HexToRGB(shows[z]["show__color"], 0.5)).appendTo(showsTable);
                            var tdRemoveShow = $('<td>').addClass("bold-text td-remove").attr("width", "5%").appendTo(showsTR);
                            var showsSpan = $('<span>').addClass("glyphicon glyphicon-remove icon icon-remove").attr("title", "Забрать шоу у менеджера").appendTo(tdRemoveShow);
                            var td= $('<td>').addClass("bold-text").attr("width", "95%").appendTo(showsTR);
                            var showsSpanShowName = $('<span>').css("color","white").text(shows[z]["show__name"]).appendTo(td);
                            (function (delete_show_id) {//Добавляем обработчик на нажатие шоу в списке шоу менеджера, для удаления
                                tdRemoveShow.click(function (){
                                    var deletedElem = $(this).parent();
                                    var currentModalWindow = showModalWindow_new("okcancel", "Забрать шоу у выбранного менеджера?", "", function () {
                                        ShowNotify_LoadData();
                                        $.post("/aj_manager_steal_company/", {
                                            company:_id,
                                            site_user:site_user,
                                            show_id:delete_show_id
                                        }, function (response) {
                                            ResponseToNotify(response);
                                            if (response["status"] == "success") {
                                                deletedElem.remove();
                                                UpdateData(true, true);
                                            }
                                            hideModalWindow(currentModalWindow);
                                        });
                                    }, false, true);
                                });
                            }(shows[z]["show__id"]));
                        }
                    });

                    showModalWindow_new("cancel", f_managersItems["site_user"]["alias"], topDiv);//При нажатии на элемент в списке - показываем диалоговое окно с информацией о событии
                });
            })(managersItems["managers"][i]["last_log_event"], managersItems["managers"][i]["site_user"]["id"], managersItems["managers"][i]);
            if(managersItems["managers"][i]["last_log_event"] != ""){//Если последняя запись лога есть, выводим ее дату и текст

                var tdManager = $('<td>').addClass("active-content").attr("title", managersItems["managers"][i]["site_user"]["alias"]).text(managersItems["managers"][i]["site_user"]["alias"]).attr("width", "20%").appendTo(tr);
                var td = $('<td>').attr("title", managersItems["managers"][i]["last_log_event"]["datetime"].split(" ")[0]).html(ConvertDateToCountDownValue(ConvertDateFromStringValue(managersItems["managers"][i]["last_log_event"]["datetime"]))).attr("width", "18%").appendTo(tr);

                var eventTextLabled = TransformLogForModal(managersItems["managers"][i]["last_log_event"], true);
                var td = $('<td>').addClass("active-content").attr("title",eventTextLabled).html(eventTextLabled).appendTo(tr).attr("width", "52%");
                (function(x){
                    td.click(
                        function () {
                            Stats_LoadLogEntry(x);
                        }
                    );
                })(managersItems["managers"][i]["last_log_event"]["id"]);
            }else{//Иначе делаем пустые значения
                var tdManager= $('<td>').addClass("active-content").attr("title", managersItems["managers"][i]["site_user"]["alias"]).text(managersItems["managers"][i]["site_user"]["alias"]).attr("width", "67%").attr("colspan", 3).appendTo(tr);
            }
            (function (_id) {
                tdManager.click(function () {
                    ShowUser(_id);
                });
            }(managersItems["managers"][i]["site_user"]["id"]));

        }
        var button = $('<button>').addClass("btn btn-primary").text("Добавить менеджера").appendTo(container);
        (function (_companyId) {//На кнопку вешаем обработчик - открывает диалоговое окно добавления менеджера
            button.click(function () {
                ShowNotify_LoadData();
                $.post("/aj_manager_manager_list/", {company_id: _companyId}, function(response) {
                    var data = ResponseToNotify(response);
                    if(response["status"] != "data"){
                        return;
                    }
                    var div = $('<div>');
                    var select = $('<select>').attr("required", true).appendTo(div).attr("id", "chooseManagerSelect").css("width", "100%").css("margin-bottom", "10");
                    for(var i = 0; i < data["siteusers"].length; i++){
                        option = $('<option>').val(data["siteusers"][i]["id"]).html(data["siteusers"][i]["alias"]).appendTo(select);
                    }
                    div.append($('<p>'));
                    var select = $('<select>').attr("required", true).appendTo(div).attr("id", "chooseArtistSelect").css("width", "100%").attr("multiple", "multiple");
                    for(i = 0; i < data["shows"].length; i++){
                        var option = $('<option>').val(data["shows"][i]["id"]).text(data["shows"][i]["name"]).appendTo(select);
                    }
                    var modalWindow = showModalWindow_new("okcancel", "Передать компанию менеджеру", div, function(){
                        if(TotalInputsValidator(modalWindow)){
                            ShowNotify_LoadData();
                            $.post("/aj_manager_add_company_to_manager/", {company:_id, user: $("#chooseManagerSelect").val(), shows:JSON.stringify($('#chooseArtistSelect').val())}, function(response) {
                            ResponseToNotify(response);
                            if(response["status"] == "success"){
                                var trs = $('<tr>').prependTo(table);
                                var td = $('<td>').appendTo(tr).attr("width", "35%").css("text-align", "center").text("Новый менеджер:").appendTo(trs);

                                td = $('<td>').attr("title", $("#chooseManagerSelect option:selected").html()).html($("#chooseManagerSelect option:selected").html()).attr("width", "100%").attr("colspan", 3).appendTo(trs);
                                UpdateData(true, true);
                                hideModalWindow(modalWindow );
                            }
                        });
                        }
                    });
                    $("#chooseManagerSelect").select2({//Преобразует элемент управления к Select2 виду
                        placeholder: "Выберите менеджера для добавления",
                        allowClear: true,
                        language: "ru"
                        });
                    $("#chooseArtistSelect").select2({//Преобразует элемент управления к Select2 виду
                        placeholder: "Выберите шоу для добавления",
                        allowClear: true,
                        language: "ru"
                        });
                });
            });
        })(_id);
        showModalWindow_new("cancel", "Менеджеры учреждения", container);
    });
    return;
    }
function LogsHistory_Paginator(_type, _id, _user, _toStats) {

    $('#logsCountLabel').remove();

    var container = $('<div>').attr("id", "logsContainer");
    var paginator = $('<div>').css("margin-bottom", "5px").appendTo(container);
    var content = $('<div>').appendTo(container);
    var modalWindow = showModalWindow_new("cancel", "История событий", container, function () {

    });
    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};
    var options = {};

    urls["pages_count"] = "/aj_logs_history/";
    urls["content"] = "/aj_logs_history/";

    if(_toStats){
        params["type"] = "stats";
        params["from"] = ConvertDateTimeToPythonType($('#rangeFrom').datepicker("getDate"));
        params["to"] = ConvertDateTimeToPythonType($('#rangeTo').datepicker("getDate"));
        params["siteuser"] = $('#statsUser').val();
    }else{
        params["element_id"] = _id;
        params["user"] = _user;
        params["type"] = _type;
    }


    containers["paginator"] = paginator;
    containers["content"] = content;

    functions["get_page_data"] = LogsHistory_Content;

    var paginator = new Paginator(containers, urls, params, functions, options);
    paginator.Create();
    return;
}
function LogsHistory_Content(_container, _data) {
    var logs = _data;

    var table = $('<table>').addClass("table table-bordered text-in-table modal_window_list").appendTo(_container);
    for(var i = 0; i < logs.length; i++){
        var tr = $('<tr>').addClass("little-selection").appendTo(table);
        var td = $('<td>').attr("width", "20%").addClass("active-content").html(ConvertDateToCountDownValue(ConvertDateFromStringValue(logs[i]["datetime"]))).attr("title", ConvertDateTimeToDateLabel(ConvertDateFromStringValue(logs[i]["datetime"]))).appendTo(tr);
        (function(_log){
            td.click(function(){
                var transformedLog = TransformLogForModal(_log);
                showModalWindow_new("cancel", "Событие лога", transformedLog);
                }
            );
        })(logs[i]);
        var td = $('<td>').attr("width", "5%").appendTo(tr);
        if("artist__name" in logs[i]){
            $('<span>').addClass("square").attr("title", logs[i]["artist__name"]).css("background-color", logs[i]["color"]).appendTo(td);
        }

        var td = $('<td>').addClass("active-content").attr("width", "20%").attr("title", logs[i]["whoChange__alias"]).css("font-size", "smaller").css("font-weight", "bold").text(logs[i]["whoChange__alias"]).appendTo(tr);
        (function (x) {
            td.click(function () {
                ShowUser(x);
            });
        })(logs[i]["whoChange__id"]);
        var td = $('<td>').attr("width", "30%").attr("title", logs[i]["changeType__verbose"]).text(logs[i]["changeType__verbose"]).css("font-size", "smaller").css("font-weight", "bold").appendTo(tr);
        var td = $('<td>').attr("width", "25%").addClass("active-content").css("font-size", "smaller").css("font-weight", "bold").appendTo(tr);
        switch (logs[i]["table__name"]){
            case "Company":
                td.append($('<span>').addClass("glyphicon glyphicon-pencil text-primary").attr("title", "Редактирование"));
                td.append($("<span>").text(" Компания").attr("title", "Компания"));
                (function (x) {
                    td.click(function(){EditCompany(UpdateData, x, true)});
                })(logs[i]["table_link_id"]);
                break;
            case "Call":
                td.append($('<span>').addClass("glyphicon glyphicon-earphone text-primary"));
                td.append($("<span>").text(" Звонок").attr("title", "Звонок"));
                (function (x) {
                        td.click(function () {
                                ShowCall(x);
                            }
                        );
                    })(logs[i]["table_link_id"]);
                break;
            case "Task":
                td.append($('<span>').addClass("glyphicon glyphicon-flag  text-primary"));
                td.append($("<span>").text(" Задача").attr("title", " Задача"));
                (function (x) {
                        td.click(function () {
                                ShowTask(x);
                            }
                        );
                    })(logs[i]["table_link_id"]);
                break;
            case "Event":
                td.append($('<span>').addClass("glyphicon glyphicon-play-circle  text-primary "));
                td.append($("<span>").text(" Мероприятие").attr("title", " Мероприятие"));
                (function (x) {
                        td.click(function () {
                                ShowEvent(x);
                            }
                        );
                    })(logs[i]["table_link_id"]);
                break;
            default:
                td.text("Неизвестно").attr("title", "Неизвестно");
                break;
        }
    }
    ChangeModalListFontSize();
    return;
}
function TransformLogForModal(_logItem, _textOnly) {
    if (_logItem == "") {
        return "";
    }
    var result = "";
    if (_textOnly) {
        result += "Пользователь ";
        result += _logItem["whoChange__alias"];
        if (_logItem["link_to_object_table__name"] != null) {
            if (_logItem["link_to_object_table__name"] == "Company") {
                switch (_logItem["table__name"]) {
                    case "Call": {
                        result += " добавил ";
                        result += "звонок ";
                    }
                        break;
                    case "Task": {
                        result += " добавил ";
                        result += "задачу ";
                    }
                        break;
                    case "Event": {
                        result += " добавил ";
                        result += "мероприятие ";
                    }
                        break;

                    default:
                        break;
                }
                result += " в ";
                result += " компанию ";
            }

        } else {
            if (_logItem["table__name"] == "Company") {
                if (_logItem["changeType__name"] == "edit") {
                    result += " изменил поле ";
                    result += _logItem["field__verbose"];
                    result += " в ";
                    result += "компании";
                    result += " Предыдущее значение поля: ";
                    result += _logItem["value"];
                }
            }
        }
    } else {
        var resultDiv = $('<div>');
        var dateLabel = $('<div>').addClass("datestamp").css("text-align", "center").html(ConvertDateToCountDownValue(ConvertDateFromStringValue(_logItem["datetime"]))).appendTo(resultDiv);

        var textContainer = $('<div>').css("margin-top", "25px").appendTo(resultDiv);

        $('<span>').text("Пользователь ").appendTo(textContainer);
        var userSpan = $('<span>').addClass("label label-primary bold-text label-own-style").text(_logItem["whoChange__alias"]).appendTo(textContainer);
        (function (x) {
            userSpan.click(function () {
                    ShowUser(x);
                }
            );
        })(_logItem["whoChange__id"]);
        if (_logItem["link_to_object_table__name"] != null) {
            if (_logItem["link_to_object_table__name"] == "Company") {
                switch (_logItem["table__name"]) {
                    case "Call": {
                        $('<span>').text(" добавил ").appendTo(textContainer);
                        var callSpan = $('<span>').addClass("label label-primary bold-text label-own-style").text("звонок ").appendTo(textContainer);
                        (function (x) {
                            callSpan.click(function () {
                                    ShowCall(x);
                                }
                            );
                        })(_logItem["table_link_id"]);

                    }
                        break;
                    case "Task": {
                        $('<span>').text(" добавил ").appendTo(textContainer);
                        var taskSpan = $('<span>').addClass("label label-primary bold-text label-own-style").text("задачу").appendTo(textContainer);
                        (function (x) {
                            taskSpan.click(function () {
                                    ShowTask(x);
                                }
                            );
                        })(_logItem["table_link_id"]);
                    }
                        break;
                    case "Event": {
                        $('<span>').text(" добавил ").appendTo(textContainer);
                        var eventSpan = $('<span>').addClass("label label-primary bold-text label-own-style").text("мероприятие").appendTo(textContainer);
                        (function (x) {
                            eventSpan.click(function () {
                                    ShowEvent(x);
                                }
                            );
                        })(_logItem["table_link_id"]);
                    }
                        break;

                    default:
                        break;
                }
                $('<span>').text("  в ").appendTo(textContainer);
                var companySpan = $('<span>').addClass("label label-primary bold-text label-own-style").text("компанию").appendTo(textContainer);
                (function (x) {
                    companySpan.click(function () {
                            EditCompany(UpdateData, x);
                        }
                    );
                })(_logItem["link_to_object_id"]);
            }
            else if (_logItem["link_to_object_table__name"] == "Event") {
                switch (_logItem["table__name"]) {
                    case "Call": {
                        $('<span>').text(" добавил ").appendTo(textContainer);
                        var callSpan = $('<span>').addClass("label label-primary bold-text label-own-style").text("отзвон ").appendTo(textContainer);
                        (function (x) {
                            callSpan.click(function () {
                                    ShowCall(x);
                                }
                            );
                        })(_logItem["table_link_id"]);

                    }
                        break;

                    default:
                        break;
                }
            }
        } else {
            if (_logItem["table__name"] == "Company") {
                if (_logItem["changeType__name"] == "edit") {
                    $('<span>').text(" изменил поле ").appendTo(textContainer);
                    $('<span>').addClass("label label-primary bold-text").text(_logItem["field__verbose"]).appendTo(textContainer);
                    $('<span>').text(" в ").appendTo(textContainer);
                    var companySpan = $('<span>').addClass("label label-primary bold-text label-own-style").text("компании").appendTo(textContainer);
                    (function (x) {
                        companySpan.click(function () {
                                EditCompany(UpdateData, x);
                            }
                        );
                    })(_logItem["table_link_id"]);
                    $('<span>').text(" Предыдущее значение поля: ").appendTo(textContainer);
                    $('<span>').addClass("label label-primary bold-text").text(_logItem["value"]).appendTo(textContainer);
                }
            } else if (_logItem["table__name"] == "Event") {
                if (_logItem["changeType__name"] == "edit") {
                    $('<span>').text(" изменил поле ").appendTo(textContainer);
                    $('<span>').addClass("label label-primary bold-text").text(_logItem["field__verbose"]).appendTo(textContainer);
                    $('<span>').text(" в ").appendTo(textContainer);
                    var eventSpan = $('<span>').addClass("label label-primary bold-text label-own-style").text("мероприятии").appendTo(textContainer);
                    (function (x) {
                        eventSpan.click(function () {
                                ShowEvent(x);
                            }
                        );
                    })(_logItem["table_link_id"]);
                    $('<span>').text(" Предыдущее значение поля: ").appendTo(textContainer);
                    $('<span>').addClass("label label-primary bold-text").text(_logItem["value"]).appendTo(textContainer);
                } else if (_logItem["changeType__name"] == "transfer") {
                    $('<span>').text(" перенес дату ").appendTo(textContainer);
                    var eventSpan = $('<span>').addClass("label label-primary bold-text label-own-style").text(" мероприятия.").appendTo(textContainer);
                    (function (x) {
                        eventSpan.click(function () {
                                ShowEvent(x);
                            }
                        );
                    })(_logItem["table_link_id"]);
                    $('<span>').text(" Предыдущая дата: ").appendTo(textContainer);
                    $('<span>').addClass("label label-primary bold-text").text(ConvertDateTimeToDateLabel(ConvertDateFromStringValue(_logItem["value"]))).appendTo(textContainer);
                } else if (_logItem["changeType__name"] == "transference") {
                    $('<span>').text(" изменил менеджера ").appendTo(textContainer);
                    var eventSpan = $('<span>').addClass("label label-primary bold-text label-own-style").text(" мероприятия.").appendTo(textContainer);
                    (function (x) {
                        eventSpan.click(function () {
                                ShowEvent(x);
                            }
                        );
                    })(_logItem["table_link_id"]);
                    $('<span>').text(" Предыдущий менеджер: ").appendTo(textContainer);
                    $('<span>').addClass("label label-primary bold-text").text(_logItem["value"]).appendTo(textContainer);

                }
                else if (_logItem["changeType__name"] == "mark") {
                    $('<span>').text(" выполнил отметку:  ").appendTo(textContainer);
                    $('<span>').text(_logItem["value"] + " для ").appendTo(textContainer);
                    var eventSpan = $('<span>').addClass("label label-primary bold-text label-own-style").text(" мероприятия.").appendTo(textContainer);
                    (function (x) {
                        eventSpan.click(function () {
                                ShowEvent(x);
                            }
                        );
                    })(_logItem["table_link_id"]);

                }
                else if (_logItem["changeType__name"] == "remove") {
                    $('<span>').text(" удалил ").appendTo(textContainer);
                    var eventSpan = $('<span>').addClass("label label-primary bold-text label-own-style").text(" мероприятие.").appendTo(textContainer);
                    (function (x) {
                        eventSpan.click(function () {
                                ShowEvent(x);
                            }
                        );
                    })(_logItem["table_link_id"]);

                }
            }


        }
        result = resultDiv;
    }
    return result;
}
//Options
function OptionsLoad() {
    $('#control_contentContainer').empty();
    $.post('/aj_control_options_load/', {}, function (response) {
        var data = ResponseToNotify(response);
        if(response["status"] != "data"){
            return;
        }
        var container = $('#control_contentContainer');
        var options = data["list"];
        var startText = "Options_";
        for(var i = 0; i < options.length; i++){
            $('<div>').addClass("header").text(options[i]["verbose"]).appendTo(container);
            $('<input>').addClass("form-control input").css("margin-bottom", 8).attr("id", startText + options[i]["field"]).val(options[i]["value"]).appendTo(container);
        }
        var buttonContainer = $('<div>').css("margin-top", 15).css("text-align", "center").appendTo(container);
        $('<input>').addClass("btn btn-success full-list-control-button").attr("type", "button").val("Сохранить").attr("onclick", "OptionsSave();").appendTo(buttonContainer)
    });
    return;
}
function OptionsSave() {
    ContainerLoadIndicatorShow($('#control_contentContainer'));
    $.post("/aj_control_options_save/", {
        data: GetVariablesFromModalToDict('content-container', "Options")
    }, function(response){
       ContainerLoadIndicatorHide();
       ResponseToNotify(response);
    });
    return;
}
//Upload
function UnloadLoadUsers(){
    ContainerLoadIndicatorShow($('#unloadUser').next());
    $.post("/aj_api_admin/", {
        managers: 1,
        managers_active: 1
    }, function(response){
        ContainerLoadIndicatorHide();
        $("#unloadUser").empty();
        var data = ResponseToNotify(response);
        if(response["status"] != "data"){
            return;
        }
        var users = data["managers"];

        $("#unloadUser").append($('<option>').val(0).text("Все"));
        $("#unloadUser").val(0);

        if (users.length != 0) {
            var firstListUser = users[0]["id"];
            for (var i = 0; i < users.length; i++) {
                $("#unloadUser").append($('<option>').val(users[i]["id"]).text(users[i]["alias"]));
            }
            UnloadLoadCities();
        } else {
            ShowNotify(3, "Нет активных пользователей", 0, 2500);
        }

    });
    return;
}
function UnloadLoadCities(){
    ContainerLoadIndicatorShow($('#unloadCity').next());
    $.post('aj_control_stats_allowed_cities/', {
        type: "manager",
        user: $("#unloadUser").val()
    }, function(response){
        ContainerLoadIndicatorHide();
        var data = ResponseToNotify(response);
        if (response["status"] != "data") {
            $("#unloadCity").empty();
            $('#unloadCity').select2(
                {
                    placeholder: "Нет городов"
                }
            );
            return;
        }
        var cities = data["list"];
        $("#unloadCity").empty();
        $("#unloadCity").append($('<option>').val(0).text("Все"));
        for (var i = 0; i < cities.length; i++) {
            $("#unloadCity").append($('<option>').val(cities[i]["id"]).text(cities[i]["name"]));
        }

    });
    UnloadEventsPaginator();
    return;
}

function UnloadEventsPaginator() {
    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};
    var options = {};

    urls["pages_count"] = "/aj_unload_events_list/";
    urls["content"] = "/aj_unload_events_list/";

    params["city"] = $('#unloadCity').val();
    params["user"] = $('#unloadUser').val();
    params["sort"] = $('#unloadSort').val();
    params["from"] = ConvertDateTimeToPythonType($('#rangeFrom').datepicker("getDate"));
    params["to"] = ConvertDateTimeToPythonType($('#rangeTo').datepicker("getDate"));

    containers["paginator"] = $('#eventsPaginator');
    containers["content"] = $('#eventsContent');


    functions["get_page_data"] = UnloadEventsContent;

    var paginator = new Paginator(containers, urls, params, functions, options);
    paginator.Create();

    return paginator.Update;
}
function UnloadEventsContent(_container, _data) {
    var events = _data;

    var table = $('<table>').css("border-collapse", "collapse").css("margin-top", 15).addClass("event_table-decoration").appendTo(_container);
    var tr = $('<tr>').css("border", "1px solid black").css("font-size", "x-small").css("color", "white").css("background-color", "black").appendTo(table);
    $('<td>').addClass("event_in_frame-td-decoration").css("font-weight", "bold").css("width", "15%").text("Дата").appendTo(tr);
    $('<td>').addClass("event_in_frame-td-decoration").css("font-weight", "bold").text("Статус").appendTo(tr);
    $('<td>').addClass("event_in_frame-td-decoration").css("font-weight", "bold").text("Менеджер").appendTo(tr);
    $('<td>').addClass("event_in_frame-td-decoration").css("font-weight", "bold").text("Город").appendTo(tr);
    $('<td>').addClass("event_in_frame-td-decoration").css("font-weight", "bold").text("Компания").appendTo(tr);
    $('<td>').addClass("event_in_frame-td-decoration").css("font-weight", "bold").css("text-align", "right").text("Итоговая").appendTo(tr);
    $('<td>').addClass("event_in_frame-td-decoration").css("font-weight", "bold").css("text-align", "right").text("Перечислено").appendTo(tr);
    for(var i = 0; i < events.length; i++){
        var eventDateTime = ConvertDateFromStringValue(events[i]["startTime"], "full");
        var tr = $('<tr>').attr("data-id", events[i]["id"]).css("border", "1px solid black").addClass("event_in_frame-decoration").css("background-color", HexToRGB(events[i]["artist__color"], 0.4)).attr("title", events[i]["artist__name"]).appendTo(table);
        tr.click(function () {
            ShowEvent($(this).attr("data-id"));
        });
        $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("width", "15%").text(eventDateTime.getDate() + " " + ConvertMonthFromNumberToName(eventDateTime.getMonth(), false, true) + " " + eventDateTime.getFullYear()).attr("title", "Дата").appendTo(tr);
        $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").append(ReturnEventStatusIconSpan(events[i])).append($('<span>').css("margin-left", 5).text(eventDateTime.getHours() + ":" + ConvertDateComponentTo2CharsFormat(eventDateTime.getMinutes())).attr("title", "Время")).appendTo(tr);
        $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration").text(events[i]["manager__siteuser__name"]).appendTo(tr);
        $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration").text(events[i]["company__city__name"]).appendTo(tr);
        $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration").text(events[i]["company__name"]).appendTo(tr);
        $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration").text(events[i]["resultSum"]).css("text-align", "right").appendTo(tr);
        $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration").text(events[i]["sumTransfered"]).css("text-align", "right").appendTo(tr);

    }
    return;
}
function UnloadReportDownload() {
    var form = document.createElement("form");

    form.setAttribute("method", 'POST');
    form.setAttribute("action", '/aj_unload_events_list/');
    var input = document.createElement("input");
    input.name = 'city';
    input.type = 'hidden';
    input.value = $('#unloadCity').val();
    form.appendChild(input);
    var input = document.createElement("input");
    input.name = 'user';
    input.type = 'hidden';
    input.value = $('#unloadUser').val();
    form.appendChild(input);
    var input = document.createElement("input");
    input.name = 'sort';
    input.type = 'hidden';
    input.value = $('#unloadSort').val();
    form.appendChild(input);
    var input = document.createElement("input");
    input.name = 'from';
    input.type = 'hidden';
    input.value = ConvertDateTimeToPythonType($('#rangeFrom').datepicker("getDate"));
    form.appendChild(input);
    var input = document.createElement("input");
    input.name = 'to';
    input.type = 'hidden';
    input.value = ConvertDateTimeToPythonType($('#rangeTo').datepicker("getDate"));
    form.appendChild(input);
    var input = document.createElement("input");
    input.name = 'unload';
    input.type = 'hidden';
    input.value = 1;
    form.appendChild(input);
    form.submit();
    var input = document.createElement("input");
    input.name = 'csrfmiddlewaretoken';
    input.type = 'hidden';
    input.value = $.cookie('csrftoken');
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();
    $(form).remove();
    return;
}
//Manager Work
function AddNewTask(_company, _companyName, _showId, _dateDict) {

    var dateNow = new Date();
    var year = this.year || dateNow.getFullYear();
    var month = this.month|| dateNow.getMonth() + 1;
    var date = this.date || dateNow.getDate() + 1;
    var hour = this.hour || 12;
    var minute = 0;

    if(isDict(_dateDict)){
        year = _dateDict["year"];
        month = _dateDict["month"];
        date = _dateDict["date"];
        hour = _dateDict["hour"];
        minute = _dateDict["minute"];
    }

    _showId = _showId || GetCurrentChoosenShow();
    _showId = +_showId;
    var modalWindowHeader = "Добавить задачу";
    if (_companyName) {
        modalWindowHeader += ": " + _companyName;
    }
    var modalWindow = showModalWindow_new("okcancel", modalWindowHeader, AddNewTask_GenerateContent(_company, _showId, year, month, date, hour, minute), function () {

        var sended_artist = $('#AddTask_show').val();
        if($('#AddTask_company').length != 0){
            var company = $('#AddTask_company').val();
        }else {
            var company = _company;
        }
        if(TotalInputsValidator(modalWindow)) {
            ShowNotify_LoadData();
            $.post("/aj_company_manager_work_mark_call_and_add_task/", {
                task: "True",
                company: company,
                artist: sended_artist,
                task_datetime: $('#AddTask_date').pickadate('picker').get('select', "yyyy-mm-dd ") + $('#AddTask_time').pickatime('picker').get('select', 'HH:i'),
                task_description: $('#AddTask_taskDescription').val(),
                task_comment: $('#AddTask_taskComment').val(),
                manager_id: $('#AddTask_manager').length > 0 ? $('#AddTask_manager').val() : false
            }, function (response) {
                var status = ResponseToNotify(response);
                if(status == "success"){
                    hideModalWindow(modalWindow);
                    if(UpdateData){
                        UpdateData(true, true, true);
                    }
                }
            });
        }
    });
    if($('#userTypeContainer').attr("data-user_type") == "admin"){
            $('#needManagerToggle').bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
    }
    $("#AddTask_show").select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите шоу для задачи.",
            language: "ru"

        });
    $('#needManagerToggle').change(function () {
            $('#AddTask_manager').empty();
            if ($('#needManagerToggle').prop("checked")) {
                ContainerLoadIndicatorShow($('#AddTask_manager').next());
                $.post("/aj_api_admin/",
                    {
                        company_managers: 1,
                        company_id: $('#AddTask_company').val(),
                        show_id: $('#AddTask_show').val()
                    }, function (response) {
                        ContainerLoadIndicatorHide();
                        var data = ResponseToNotify(response);
                        if(response["status"] != "data"){
                            return;
                        }
                        for(var i = 0; i < data["managers"].length; i++){
                            $('#AddTask_manager').append($('<option>').val(data["managers"][i]["id"]).text(data["managers"][i]["siteuser__alias"]));
                        }
                        $('#AddTask_manager').attr("required", "required").removeAttr("disabled");
                        $("#AddTask_manager").select2({//Преобразует элемент управления к Select2 виду
                            placeholder: "Менеджер задачи",
                            language: "ru"
                        });
                    }
                )
            } else {
                $('#AddTask_manager').attr("disabled", "disabled").removeAttr("required");
                $("#AddTask_manager").select2({//Преобразует элемент управления к Select2 виду
                    placeholder: "Менеджер задачи",
                    language: "ru"
                });
            }
        });
    $("#AddTask_manager").select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Менеджер задачи",
            language: "ru"

        });
    if(!_company){
        Select2CompaniesLoader($("#AddTask_company"), "/aj_manager_get_manager_companies_search/", $('#cityPickerTittle').attr("data-id"), FormatJsonDataSelectionsCompanyPicker, FormatJsonDataSelectionsCompanyPickerForTasks, modalWindow);

    }else{
        ContainerLoadIndicatorShow($('#AddTask_show').next());
        $.post("/aj_manager_allowed_shows_for_company/", {company: _company}, function (response) {
            var data = ResponseToNotify(response);
            if (response["status"] != "data") {
                return;
            }
            ContainerLoadIndicatorHide();
            var showsSelect = $('#AddTask_show');
            var shows = data["shows"];

            for (var i = 0; i < shows.length; i++) {
                $('<option>').val(shows[i]["id"]).text(shows[i]["name"]).appendTo(showsSelect);
            }

            if (_showId && _showId != 0) {
                $("#AddTask_show").val(_showId).trigger("change");
            }
        });
    }

    return;
}
function AddNewTask_GenerateContent(_companyId, _showId, _year, _month, _date, _hour, _minute) {
    var idStartText = "AddTask_";
    var container = $('<div>');

    if(!_companyId){
        $('<div>').addClass("header").text("Компания:").appendTo(container);
        $('<select>').addClass("form-control input-sm").attr("id", idStartText + "company").attr("required", "required").attr("noplaceholder", "noplaceholder").appendTo(container);
    }
    //ChooseShow block

    $('<div>').addClass("header small").text("Шоу:").appendTo(container);
    var selectElem = $('<select>').addClass("form-control input-sm").css("width", "100%").attr("id", idStartText + "show").attr("placeholder", "выберите шоу для добавления").attr("noplaceholder", "noplaceholder").css("margin-bottom", "10px").appendTo(container);
    $('<div>').css("height", 10).appendTo(container);
    if($('#userTypeContainer').attr("data-user_type") == "admin"){
        var frame = $('<form>').addClass("form-horizontal").appendTo(container);
        var needManagerToggleContainer = $('<div>').appendTo(frame);
        var labelContainer = $('<div>').addClass("col-md-10").css("text-align", "right").appendTo(needManagerToggleContainer);
        var toggleContainer = $('<div>').addClass("col-md-2").css("text-align", "right").appendTo(needManagerToggleContainer);
        var needManagerToggle = $('<input>').attr("id", "needManagerToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
        $('<label>').attr("for", "needManagerToggle").addClass("text-primary control-label").text("Задача для менеджера").css("user-select", "none").appendTo(labelContainer);

        $('<div>').addClass("header").text("Менеджер задачи:").appendTo(container);
        $('<select>').addClass("form-control input-sm").attr("id", idStartText + "manager").attr("disabled", "disabled").attr("noplaceholder", "noplaceholder").appendTo(container);

    }
    //NewTaskBlock
    $('<div>').addClass("header").text("Новая задача:").appendTo(container);
    //DateTimeRow
    var wrapper = $('<div>').addClass("form-group").css("padding-bottom", "35px").appendTo(container);
    //DateInput
    $('<label>').addClass("col-md-1 small text-primary control-label").attr("for", idStartText + "date").css("padding-right", "0px").css("padding-left", "0px").css("margin-top", "6").html("Дата:").appendTo(wrapper);
    var controlContainer = $('<div>').addClass("col-md-4").css("padding-left", "0px").appendTo(wrapper);
    var control = $('<input>').attr("id", idStartText + "date").addClass("form-control input-sm").appendTo(controlContainer);
    control.pickadate({
        format: "d, mmmm, yyyy",
        clear: '',
        selectYears: true,
        selectMonths: true,
        labelMonthPrev: "Предыдущий месяц",
        labelMonthNext: "Следующий месяц",
        labelMonthSelect: "Выберите месяц",
        labelYearSelect: "Выберите год",
        min: true,
        max: new Date(new Date().getFullYear() + 2, 1, 1),
        container: '#pickadatecontainer'

    });
    var pickerDate = $(control).pickadate('picker');



    //TimeInput
    $('<label>').addClass("col-md-2 small text-primary control-label").attr("for", idStartText + "time").css("padding-right", "0px").css("margin-top", "6").html("Время:").appendTo(wrapper);
    controlContainer = $('<div>').addClass("col-md-3").css("padding-left", "0px").appendTo(wrapper);
    control = $('<input>').attr("id", idStartText + "time").addClass("form-control input-sm").appendTo(controlContainer);
    control.pickatime({
        format: 'HH:i',
        interval: 15,
        min: [6, 30],
        max: [20, 0],
        clear: ''
    });
    var pickerTime = $(control).pickatime('picker');

    pickerDate.set('select', new Date(+_year, (+_month) - 1, +_date));
    pickerTime.set('select', [+_hour, +_minute]);
    //TaskDescription
    var formWrapper = $('<div>').addClass("form-group").appendTo(container);
    $('<div>').addClass("header small").text("Заголовок задачи:").appendTo(formWrapper);
    $('<input>').addClass("form-control input-sm").attr("id", idStartText + "taskDescription").attr("autocomplete", "off").attr("required", "required").attr("placeholder", "Укажите краткое описание задачи").css("margin-bottom", "10px").val("Позвонить.").appendTo(formWrapper);
    //TaskComment
    var formWrapper = $('<div>').addClass("form-group").appendTo(container);
    $('<div>').addClass("header small").text("Описание задачи:").appendTo(formWrapper);
    var taskComment = $('<textarea>').addClass("form-control input-sm").attr("id", idStartText + "taskComment").attr("rows", 7).attr("placeholder", "Укажите полное описание задачи").css("resize", "none").appendTo(formWrapper);
    if($('#userTypeContainer').attr("data-user_type") == "admin") {
        taskComment.attr("rows", 3);
    }

    return container;
}
function ShowTask(_taskId, _companyName, _elemToChange, _modalToHide) {
    ShowNotify_LoadData();
    $.post("/aj_tasks_get_task/", {id: _taskId}, function (response) {
        var controlButtons = {};
        var data = ResponseToNotify(response);
        if(response["status"] != "data"){
            return;
        }
        var task_data = data["task_data"];
        var modalButtonsType = "cancel";
        if(task_data["done"]){
            modalButtonsType = "customcancel";
        }else{
            modalButtonsType = "customcancel";
            if(task_data["type"] == "company"){
                controlButtons["Выполнить"] = {
                "button": $('<button>').attr("title", "Выполнить").append($('<span>').addClass("glyphicon glyphicon-check text-primary")),
                "function": function () {
                    AddCall(false, false, _taskId);
                    return;
                }
            };
            }
            controlButtons["Выполнить со звонком"] = {
                "button": $('<button>').attr("title", "Выполнить со звонком").append($('<span>').addClass("glyphicon glyphicon-earphone text-primary")),
                "function": function () {
                    AddCall(task_data["company__id"], task_data["company__name"], _taskId, task_data["artist__id"], task_data["type"], _elemToChange, _modalToHide);
                    return;
                }
            };
        }

        controlButtons["Данные компании"] = {
            "button": $('<button>').css("margin-left", 10).css("color", "white").css("background-color", "green").attr("title", "Данные компании").append($('<span>').addClass("glyphicon glyphicon-info-sign")),
            "function": function () {
                EditCompany(false, task_data["company__id"]);
                return;
            }
        };
        if(!data["last_call"]){
            controlButtons["Последний звонок отсутствует"] = {
                "button": $('<button>').css("color", "white").css("background-color", "#909090").attr("title", "Последний звонок отсутствует").append($('<span>').addClass("glyphicon glyphicon-earphone")),
                "function": function () {
                    ShowNotify("3", "Последний звонок отсутствует");
                    return;
                }
            };
            controlButtons["История звонков"] = {
                "button": $('<button>').css("color", "white").css("background-color", "#909090").attr("title", "Данные компании").append($('<span>').addClass("glyphicon glyphicon-list")),
                "function": function () {
                    ShowNotify("3", "История звоноков отсутствует");
                    return;
                }
            };
        }else{
            controlButtons["Последний звонок"] = {
                "button": $('<button>').css("color", "white").css("background-color", "green").attr("title", "Последний звонок").append($('<span>').addClass("glyphicon glyphicon-earphone")),
                "function": function () {
                    ShowCall(data["last_call"]["id"]);
                    return;
                }
            };
            controlButtons["История звонков"] = {
                "button": $('<button>').css("color", "white").css("background-color", "green").attr("title", "Данные компании").append($('<span>').addClass("glyphicon glyphicon-list")),
                "function": function () {
                    ShowCallsHistory(task_data["company__id"]);
                    return;
                }
            };
        }


        controlButtons["Перейти к компании"] = {
            "button": $('<button>').css("color", "white").css("background-color", "green").attr("title", "Перейти к компании").append($('<span>').addClass("glyphicon glyphicon-share-alt")),
            "function": function () {
                GoToCompanyPage(task_data["company__id"]);
                return;
            }
        };
        if("event_id" in data){
            controlButtons["Просмотр мероприятия"] = {
            "button": $('<button>').css("color", "white").css("margin-left", "10px").css("background-color", "#337ab7").attr("title", "Просмотр мероприятия").append($('<span>').addClass("glyphicon glyphicon-play-circle")),
            "function": function () {
                ShowEvent(data["event_id"]);
                return;
            }
        };
        }
        var modalWindowHeaderText = "Просмотр задачи";
        modalWindowHeaderText += ": " + task_data["company__name"];
        var modalWindowTitle = $('<div>');
        var modalWindowIcon = ReturnTaskStatusIconSpan(task_data["datetime"], task_data["done"]).css("margin-right", "10px").appendTo(modalWindowTitle);
        $('<span>').text(modalWindowHeaderText).appendTo(modalWindowTitle);
        var content = $('<div>');

        $('<div>').addClass("events_date_label-decoration").css("color", "#5cb85c").text("Назначена").appendTo(content);
        if(task_data["statsdt"]){
            $('<div>').addClass("events_date_label-decoration").html(ConvertDateToCountDownValue(ConvertDateFromStringValue(task_data["statsdt"]), null, true).append($('<span>').text(": " + task_data["assigned_by__name"]))).appendTo(content);
        }else{
            $('<div>').addClass("events_date_label-decoration").html("Не определено").appendTo(content);

        }

        var taskTimeContainer = $('<div>').appendTo(content);

        if(task_data["done"]){
            $('<div>').addClass("events_date_label-decoration").css("color", "#5cb85c").text("Выполнена").appendTo(taskTimeContainer);
            if (task_data["doneDateTime"]) {
                $('<div>').addClass("events_date_label-decoration").html(ConvertDateTimeToDateLabel(ConvertDateFromStringValue(task_data["doneDateTime"]), "countdownandtime")).appendTo(taskTimeContainer);

            } else {
                $('<div>').addClass("events_date_label-decoration").html("Не определено").appendTo(taskTimeContainer);

            }

        }else{
            $('<div>').addClass("events_date_label-decoration").css("color", "#5cb85c").text("Выполнение: ").appendTo(taskTimeContainer);
            $('<div>').addClass("events_date_label-decoration").html(ConvertDateTimeToDateLabel(ConvertDateFromStringValue(task_data["datetime"]), "countdownandtime")).appendTo(taskTimeContainer);

        }
        $('<div>').addClass("header").text("Менеджер:").appendTo(content);
        var managerInput = $('<input>').css("margin-bottom", "10px").css("cursor", "default").attr("readonly", "readonly").addClass("form-control input-sm").val(task_data["manager__siteuser__alias"]).appendTo(content);
        if(data["admin_mode"]){
            MakeElementClickable(managerInput, ShowUser, {id:task_data["manager__siteuser__id"], type:"Менеджеры"});
        }

        $('<div>').addClass("header").text("Шоу:").appendTo(content);
        $('<input>').css("margin-bottom", "10px").css("cursor", "default").attr("readonly", "readonly").addClass("form-control input-sm").val(task_data["artist__name"]).appendTo(content);

        $('<div>').addClass("header").text("Заголовок задачи:").appendTo(content);
        $('<input>').css("cursor", "default").attr("readonly", "readonly").addClass("form-control input-sm").val(task_data["description"]).appendTo(content);

        $('<div>').addClass("header").text("Описание задачи:").appendTo(content);
        $('<textarea>').css("cursor", "default").attr("readonly", "readonly").addClass("form-control input-sm").attr("rows", 3).css("resize", "none").val(task_data["comment"]).appendTo(content);


        var modalWindow = showModalWindow_new(modalButtonsType, modalWindowTitle, content, function () {
            hideModalWindow(modalWindow);
        }, controlButtons);
        DecorateModalWindow(modalWindow, task_data["artist__color"]);
    });
    return;
}
function ShowTasksHistory(_company, _show, _companyName, _toStats) {
    var modalWindowHeader = "История задач";
    if (_companyName) {
        modalWindowHeader += ": " + _companyName;
    }
    var modalContent = $('<div>');
    var modalContentPaginator = $('<div>').css("margin-bottom", "5px").appendTo(modalContent);
    var modalContentData = $('<div>').appendTo(modalContent);

    showModalWindow_new("cancel", modalWindowHeader, modalContent);

    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};
    var options = {};

    urls["pages_count"] = "/aj_tasks_list/";
    urls["content"] = "/aj_tasks_list/";

    if(_toStats) {
        params["stats"] = true;
        params["from"] = ConvertDateTimeToPythonType($('#rangeFrom').datepicker("getDate"));
        params["to"] = ConvertDateTimeToPythonType($('#rangeTo').datepicker("getDate"));
        params["siteuser"] = $('#statsUser').val();
        params["show_id"] = $('#statsArtist').val();
        params["city__id"] = $('#statsCity').val();
    }else{
        params["company_id"] = _company;
        params["show_id"] = _show;
    }

    containers["paginator"] = modalContentPaginator;
    containers["content"] = modalContentData;

    functions["get_page_data"] = ShowTasksHistory_Content;

    var paginator = new Paginator(containers, urls, params, functions, options);
    paginator.Create();

    return;
}
function ShowTasksHistory_Content(_container, _data) {
    var table = $('<table>').addClass("table table-bordered text-in-table modal_window_list").appendTo(_container);
    for (var i = 0; i < _data.length; i++) {
        var taskStatus = ReturnTaskStatusIconSpan(_data[i]["datetime"], _data[i]["done"]);

        var tr = $('<tr>').addClass("modal-tr modal-window-content").css("background", HexToRGB(_data[i]["artist__color"], 0.4)).appendTo(table);
        var td = $('<td>').css("background-color", "white").css("color", "black").attr("width", '5%').css("max-width", "24px").append(taskStatus).appendTo(tr);
        var td = $('<td>').append(ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["statsdt"]))).attr("title", "Назначена: " + ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["statsdt"]), true)).attr("width", '25%').css("max-width", "81px").appendTo(tr);
        if(_data[i]["done"]){
            var td = $('<td>').append(ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["doneDateTime"]))).attr("title", "Выполнена: " + ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["doneDateTime"]), true)).attr("width", '25%').css("max-width", "124px").appendTo(tr);
        }else{
            var td = $('<td>').append(ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["datetime"]))).attr("title", "Выполнение: " + ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["datetime"]), true)).attr("width", '25%').css("max-width", "124px").appendTo(tr);
        }
        var td = $('<td>').text(_data[i]["manager__siteuser__alias"]).attr("title", _data[i]["manager__siteuser__alias"]).attr("width", '20%').css("max-width", "113px").appendTo(tr);
        var td = $('<td>').text(_data[i]["description"]).attr("title", _data[i]["description"]).attr("maxwidth", '25%').css("max-width", "125px").appendTo(tr);

        (function (x) {
            tr.click(function () {
                ShowTask(x["id"], x["company__name"]);
            })
        })(_data[i]);
    }
    ChangeModalListFontSize();
    return;
}
function AddCall(_company, _companyName, _taskId, _showId, _taskType, _elemToChange, _modalToHide) {
    _showId = _showId || GetCurrentChoosenShow();
    _showId = +_showId;
    var modalWindowHeader = "Отметить звонок";
    if (_companyName) {
        modalWindowHeader += ": " + _companyName;
    }
    var requestParams = {};

    //Если нет компании, только id задачи, значит только отметка задачи
    if (_taskId && !_company) {
        requestParams["task_exe"] = 1;
        requestParams["task_id"] = _taskId;
        requestParams["current_datetime"] = ConvertDateTimeToPythonType(new Date());
        var modalWindow = showModalWindow_new("okcancel", "Отметить выполнение задачи?", false, function () {
            $.post("/aj_company_manager_work_mark_call_and_add_task/", requestParams, function (response) {
                var status = ResponseToNotify(response);
                if(status == "success"){
                    hideAllModalWindows();
                    UpdateData(true, true, true);
                }
            });
        }, false, true);

    }else{
        var modalWindow = showModalWindow_new("okcancel", modalWindowHeader, AddCall_GenerateContent(_company, _showId), function () {
            if (TotalInputsValidator(modalWindow)) {
                var sended_artist = $('#addCall_show').val();
                if (_company) {
                    requestParams = {
                        call: "True",
                        new_call: "True",
                        company: _company,
                        artist: sended_artist,
                        call_comment: $('#addCall_callComment').val(),
                        current_datetime: ConvertDateTimeToPythonType(new Date())
                    };
                    if ($('#addTaskToggle').prop("checked")) {
                        requestParams["task"] = "True";
                        requestParams["task_datetime"] = $('#addCall_date').pickadate('picker').get('select', "yyyy-mm-dd ") + $('#addCall_time').pickatime('picker').get('select', 'HH:i');
                        requestParams["task_description"] = $('#addCall_taskDescription').val();
                        requestParams["task_comment"] = $('#addCall_taskComment').val();
                    }
                }
                if (_taskId) {
                    requestParams["task_exe"] = 1;
                    requestParams["task_id"] = _taskId;
                }
                if (_taskType) {
                    requestParams["task_type"] = _taskType;
                }
                $.post("/aj_company_manager_work_mark_call_and_add_task/", requestParams, function (response) {
                    var status = ResponseToNotify(response);
                    if (status == "success") {
                        if(_elemToChange){
                            $(_elemToChange).val($('#addCall_callComment').val()).css("color", "green").css("border-color", "green");
                            $(_elemToChange).prev().css("color", "green");
                            hideModalWindow(modalWindow);
                            hideModalWindow($(modalWindow).prev());
                        }else{
                            hideAllModalWindows();
                        }

                        UpdateData(true, true, true);

                    }
                });
            }
        });
        $('#addTaskToggle').bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
        $('#addTaskToggle').change(function () {
            if ($('#addTaskToggle').prop("checked")) {
                $('#addCall_date').removeAttr("disabled");
                $('#addCall_time').removeAttr("disabled");
                $('#addCall_taskDescription').removeAttr("disabled").attr("required", "required");
                $('#addCall_taskComment').removeAttr("disabled");
            } else {
                $('#addCall_date').attr("disabled", "disabled");
                $('#addCall_time').attr("disabled", "disabled");
                $('#addCall_taskDescription').attr("disabled", "disabled").removeAttr("required");
                $('#addCall_taskComment').attr("disabled", "disabled");
            }
        });
    }
    return;

}
function AddCall_GenerateContent(_companyId, _showId) {
    var idStartText = "addCall_";
    var container = $('<div>');

    var wrapperForm = $('<div>').addClass("form-group").appendTo(container);
    $('<div>').addClass("header small").text("Шоу:").appendTo(wrapperForm);
    var selectElem = $('<select>').addClass("form-control input-sm").attr("id", idStartText + "show").attr("placeholder", "выберите шоу для добавления").css("margin-bottom", "10px").appendTo(wrapperForm);
    $.post("/aj_manager_allowed_shows_for_company/", {company: _companyId}, function (response) {
        var data = ResponseToNotify(response);
        if (response["status"] != "data") {
            return;
        }
        var shows = data["shows"];
        for (i = 0; i < shows.length; i++) {
            $('<option>').val(shows[i]["id"]).text(shows[i]["name"]).appendTo(selectElem);
        }
        $(selectElem).select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите шоу для отметки звонка.",
            language: "ru"
        });
        if(_showId && _showId != 0){
            $(selectElem).val(_showId).trigger("change");
        }
    });

    //NewCallBlock
    var wrapperForm = $('<div>').addClass("form-group").appendTo(container);
    $('<div>').addClass("header").text("Комментарий к звонку:").appendTo(wrapperForm);
    $('<textarea>').addClass("form-control input-sm").attr("id", idStartText + "callComment").attr("rows", 2).attr("required", "required").attr("placeholder", "Укажите комментарий к звонку").css("resize", "none").appendTo(wrapperForm);

    var addTaskToggle = $('<div>').appendTo(container);
    var toggleContainer = $('<div>').css("text-align", "left").appendTo(addTaskToggle);
    var removeConfirmToggle = $('<input>').attr("id", "addTaskToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
    var newTaskLabel = $('<span>').addClass("datestamp").text("Новая задача").css("margin-left", "15px").appendTo(toggleContainer);
    $('<br>').appendTo(container);
    //DateTimeRow
    var wrapper = $('<div>').addClass("form-group").css("padding-bottom", "35px").appendTo(container);
    //DateInput
    $('<label>').addClass("col-md-1 small text-primary control-label").attr("for", idStartText + "date").css("padding-right", "0px").css("padding-left", "0px").css("margin-top", "6").html("Дата:").appendTo(wrapper);
    var controlContainer = $('<div>').addClass("col-md-4").css("padding-left", "0px").appendTo(wrapper);
    var control = $('<input>').attr("id", idStartText + "date").attr("disabled", "disabled").addClass("form-control input-sm").appendTo(controlContainer);
    control.pickadate({
        format: "d, mmmm, yyyy",
        clear: '',
        selectYears: true,
        selectMonths: true,
        labelMonthPrev: "Предыдущий месяц",
        labelMonthNext: "Следующий месяц",
        labelMonthSelect: "Выберите месяц",
        labelYearSelect: "Выберите год",
        min: true,
        max: new Date(new Date().getFullYear() + 2, 1, 1),
        container: '#pickadatecontainer'

    });
    var picker = $(control).pickadate('picker');
    picker.set('select', new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1));

    //TimeInput
    $('<label>').addClass("col-md-2 small text-primary control-label").attr("for", idStartText + "time").css("padding-right", "0px").css("margin-top", "6").html("Время:").appendTo(wrapper);
    controlContainer = $('<div>').addClass("col-md-3").css("padding-left", "0px").appendTo(wrapper);
    control = $('<input>').attr("id", idStartText + "time").attr("disabled", "disabled").addClass("form-control input-sm").appendTo(controlContainer);
    control.pickatime({
        format: 'HH:i',
        interval: 15,
        min: [6, 30],
        max: [20, 0],
        clear: ''
    });
    picker = $(control).pickatime('picker');
    picker.set('select', [12, 0]);
    //TaskDescription
    var formWrapper = $('<div>').addClass("form-group").appendTo(container);
    $('<div>').addClass("header small").text("Заголовок задачи:").appendTo(formWrapper);
    $('<input>').addClass("form-control input-sm").attr("disabled", "disabled").attr("id", idStartText + "taskDescription").attr("required", "required").attr("placeholder", "Укажите краткое описание задачи").css("margin-bottom", "10px").val("Позвонить.").appendTo(formWrapper);
    //TaskComment
    var formWrapper = $('<div>').addClass("form-group").appendTo(container);
    $('<div>').addClass("header small").text("Описание задачи:").appendTo(formWrapper);
    $('<textarea>').addClass("form-control input-sm").attr("disabled", "disabled").attr("id", idStartText + "taskComment").attr("rows", 2).attr("placeholder", "Укажите полное описание задачи").css("resize", "none").appendTo(formWrapper);

    return container;
}
function ShowCall(_id, _companyName) {
    ShowNotify_LoadData();
    $.post('/aj_call_get/', {id: _id}, function (response) {
        var data = ResponseToNotify(response);
        if (response["status"] != "data") {
            return;
        }
        var modalWindowHeader = "Просмотр звонка: ";
        modalWindowHeader += data["company__name"];
        var content = $('<div>');
        $('<div>').addClass("events_date_label-decoration").html(ConvertDateToCountDownValue(ConvertDateFromStringValue(data["datetime"]), null, true)).appendTo(content);
        $('<div>').addClass("events_date_label-decoration").html(ConvertDateTimeToDateLabel(ConvertDateFromStringValue(data["datetime"]), "date")).appendTo(content);
        $('<div>').addClass("events_date_label-decoration").css("margin-bottom", "10px").html(ConvertDateTimeToDateLabel(ConvertDateFromStringValue(data["datetime"]), "time")).appendTo(content);


        $('<div>').addClass("header").text("Менеджер:").appendTo(content);
        var managerInput = $('<input>').css("margin-bottom", "10px").css("cursor", "default").attr("readonly", "readonly").addClass("form-control input-sm").val(data["manager__siteuser__alias"]).appendTo(content);
        if(data["admin_mode"]){
            MakeElementClickable(managerInput, ShowUser, {id:data["manager__siteuser__id"], type:"Менеджеры"});
        }

        $('<div>').addClass("header").text("Шоу:").appendTo(content);
        $('<input>').css("margin-bottom", "10px").css("cursor", "default").attr("readonly", "readonly").addClass("form-control input-sm").val(data["artist__name"]).appendTo(content);

        $('<div>').addClass("header").text("Комментарий к звонку:").appendTo(content);
        $('<textarea>').css("cursor", "default").attr("readonly", "readonly").addClass("form-control input-sm").attr("rows", 7).css("resize", "none").val(data["comment"]).appendTo(content);

        var controlButtons = {};
        controlButtons["Данные компании"] = {
            "button": $('<button>').css("margin-left", 10).css("color", "white").css("background-color", "#337ab7").attr("title", "Данные компании").append($('<span>').addClass("glyphicon glyphicon-info-sign")),
            "function": function () {
                EditCompany(false, data["company__id"], true);
                return;
            }
        };
        controlButtons["Перейти к компании"] = {
            "button": $('<button>').css("color", "white").css("background-color", "green").attr("title", "Перейти к компании").append($('<span>').addClass("glyphicon glyphicon-share-alt")),
            "function": function () {
                GoToCompanyPage(data["company__id"]);
                return;
            }
        };
        var modalWindow = showModalWindow_new("customcancel", modalWindowHeader, content, false, controlButtons);//При нажатии на элемент в списке - показываем диалоговое окно с информацией о событии
        $(modalWindow).children(".modalWindowHead").css("background-color", data["artist__color"]);
        $(modalWindow).children(".modalWindowHead").css("border-bottom-color", data["artist__color"]);
        $(modalWindow).css("border-color", data["artist__color"]);
    });
    return;
}
function ShowCallsHistory(_company, _show, _companyName, _toStats) {
    _show = _show || GetCurrentChoosenShow();
    //Берем код шоу, используя элемент с CSS классом "active"
    var modalWindowHeader = "История звонков";
    if (_companyName) {
        modalWindowHeader += ": " + _companyName;
    }
    var modalContent = $('<div>');
    var modalContentPaginator = $('<div>').css("margin-bottom", "5px").appendTo(modalContent);
    var modalContentData = $('<div>').appendTo(modalContent);

    showModalWindow_new("cancel", modalWindowHeader, modalContent);

    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};
    var options = {};

    urls["pages_count"] = "/aj_calls_list/";
    urls["content"] = "/aj_calls_list/";


    params["company_id"] = _company;
    params["show_id"] = _show;
    if(_toStats){
        params["stats"] = true;
        params["from"] = ConvertDateTimeToPythonType($('#rangeFrom').datepicker("getDate"));
        params["to"] = ConvertDateTimeToPythonType($('#rangeTo').datepicker("getDate"));
        params["siteuser"] = $('#statsUser').val();
        params["show_id"] = $('#statsArtist').val();
        params["city__id"] = $('#statsCity').val();
    }else{
        params["company_id"] = _company;
        params["show_id"] = _show;
    }

    containers["paginator"] = modalContentPaginator;
    containers["content"] = modalContentData;

    functions["get_page_data"] = ShowCallsHistory_Content;
    var paginator = new Paginator(containers, urls, params, functions, options);
    paginator.Create();
    return;
}
function ShowCallsHistory_Content(_container, _data) {
    var table = $('<table>').addClass("table table-bordered text-in-table modal_window_list").appendTo(_container);
    for (var i = 0; i < _data.length; i++) {
        var tr = $('<tr>').addClass("modal-tr modal-window-content").css("background", HexToRGB(_data[i]["artist__color"], 0.4)).appendTo(table);
        if(!_data[i]["own"]){
            tr.css("opacity", "0.7");
        }
        var td = $('<td>').css("max-width", "56px").append(ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["datetime"]))).attr("title", "Выполнен: " + ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["datetime"]), true)).attr("width", '15%').appendTo(tr);
        var td = $('<td>').css("max-width", "93px").append(ConvertDateTimeToDateLabel(ConvertDateFromStringValue(_data[i]["datetime"]), "date")).attr("title", ConvertDateTimeToDateLabel(ConvertDateFromStringValue(_data[i]["datetime"]), "date")).attr("width", '25%').appendTo(tr);
        var td = $('<td>').css("max-width", "39px").append(ConvertDateTimeToDateLabel(ConvertDateFromStringValue(_data[i]["datetime"]), "time")).attr("title", ConvertDateTimeToDateLabel(ConvertDateFromStringValue(_data[i]["datetime"]), "time")).attr("width", '15%').appendTo(tr);
        var td = $('<td>').css("max-width", "106px").text(_data[i]["manager__siteuser__alias"]).attr("title", _data[i]["manager__siteuser__alias"]).attr("width", '15%').appendTo(tr);
        var td = $('<td>').css("max-width", "118px").text(_data[i]["comment"]).attr("title", _data[i]["comment"]).attr("width", '30%').appendTo(tr);//

        (function (x) {
            tr.click(function () {
                ShowCall(x["id"], x["company__name"]);
            });
        })(_data[i]);
    }
    ChangeModalListFontSize();
    return;
}
function CreateOldCalTaskDecoration(_event, _calType, _calOption){

    var contentDiv = $('<div>').addClass("oldcal-show_in_table-container_decoration").attr("data-id", _event["id"]).css("background-color", HexToRGB(_event["artist__color"], 0.6));
    if (LargeFontNeed()) {
        $(contentDiv).css("font-size", "14px");
    }
    if (_event["done"]) {
        contentDiv.css("opacity", "0.8").css("text-decoration", "line-through");
    }
    var contentTable = $('<table>').addClass("oldcal-show_in_table-table_decoration").appendTo(contentDiv);
    var contentTr = $('<tr>').appendTo(contentTable);
    var contentTd = $('<td>').addClass("oldcal-show_in_table-icon_container_decoration").appendTo(contentTr);
    contentTd.append(ReturnTaskStatusIconSpan(_event["datetime"], _event["done"]).addClass("oldcal-show_in_table-icon_decoration"));
    var contentTd = $('<td>').text(ConvertDateFromStringValue(_event["datetime"], "strtime")).addClass("oldcal-show_in_table-time_container_decoration").appendTo(contentTr);
    var contentTr = $('<tr>').appendTo(contentTable);
    var contentTd = $('<td>').attr("colspan", 2).css("overflow", "hidden").addClass("oldcal-show_in_table-content_container_decoration").appendTo(contentTr);


    contentTd.attr("data-user", _event["manager__siteuser__alias"]).attr("data-company", _event["company__name"]).attr("data-show", _event["description"]).attr("data-adress", _event["company__adress"]);

    switch (_calOption) {
        case "user":
            contentTd.text(_event["manager__siteuser__alias"]).attr("title", _event["manager__siteuser__alias"]);
            break;
        case "company":
            contentTd.text(_event["company__name"]).attr("title", _event["company__name"]);
            break;
        case "show":
            contentTd.text(_event["description"]).attr("title", _event["description"]);
            break;
        case "adress":
            contentTd.text(_event["company__adress"]).attr("title", _event["company__adress"]);
            break;
    }


        return contentDiv;
    }
function CreateMyCal_TaskEventDecoration(_event, _calType, _calOption) {
    var contentDiv = $('<div>').attr("data-id", _event["id"]).addClass("oldcal-show_in_table-container_decoration").css("background-color", HexToRGB(_event["artist__color"], 0.6)).css("margin-left", 0).css("float", "left").css("margin-bottom", 0);
    if (LargeFontNeed()) {
        $(contentDiv).css("font-size", "14px");
    }
    if(_event["done"]){
            contentDiv.css("opacity", "0.8").css("text-decoration", "line-through");
    }
    var contentTable = $('<table>').addClass("oldcal-show_in_table-table_decoration").appendTo(contentDiv);
    var contentTr = $('<tr>').appendTo(contentTable);
    var contentTd = $('<td>').addClass("oldcal-show_in_table-icon_container_decoration").appendTo(contentTr);
    contentTd.append(ReturnTaskStatusIconSpan(_event["datetime"], _event["done"]).addClass("oldcal-show_in_table-icon_decoration"));
    var contentTd = $('<td>').text(TransformDateFromTask(_event, "strtime")).addClass("oldcal-show_in_table-time_container_decoration").appendTo(contentTr);
    var contentTr = $('<tr>').appendTo(contentTable);
    var contentTd = $('<td>').attr("colspan", 2).css("overflow", "hidden").addClass("oldcal-show_in_table-content_container_decoration").appendTo(contentTr);
    contentTd.text(_event["description"]).attr("title", _event["description"]);


    return contentDiv;
}
function CreateInListTaskDecoration(_data, _calType, _calOption) {
    var _event = _data["event"];
    var eventsTr = $('<tr>').addClass("event_in_frame-decoration").attr("data-id", _event["id"]);
    if (LargeFontNeed()) {
        $(eventsTr).css("font-size", "14px");
    }
    if(_event["done"]){
        eventsTr.css("opacity", "0.8").css("text-decoration", "line-through");
    }
    eventsTr.css("background-color", HexToRGB(_event["artist__color"], 0.4));

    (function (_id) {
        eventsTr.click(function () {
            ShowTask(_id);
        });
    })(_event["id"]);
    var eventDateTime = ConvertDateFromStringValue(_event["datetime"], "full");
    var totalWidth = 100;
    switch (_calType) {
        case "datelist":
            switch (_calOption) {
                case "year":
                    $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("width", "15%").text(eventDateTime.getDate() + " " + ConvertMonthFromNumberToName(eventDateTime.getMonth(), false, true)).attr("title", "Дата").appendTo(eventsTr);
                    totalWidth -= 15;
                    break;
                case "month":
                    $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("width", "5%").text(eventDateTime.getDate()).attr("title", "Число").appendTo(eventsTr);
                    totalWidth -= 5;
                    break;
                case "range":
                    $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("width", "15%").text(eventDateTime.getDate() + " " + ConvertMonthFromNumberToName(eventDateTime.getMonth(), false, true) + " " + eventDateTime.getFullYear()).attr("title", "Дата").appendTo(eventsTr);
                    totalWidth -= 15;
                    break;
            }
            break;
        case "fulllist":
            $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("width", "15%").text(eventDateTime.getDate() + " " + ConvertMonthFromNumberToName(eventDateTime.getMonth(), false, true) + " " + eventDateTime.getFullYear()).attr("title", "Дата").appendTo(eventsTr);
            $('<td>').attr("title", "Число");
            totalWidth -= 15;
            break;

    }

    var statusIcon = ReturnTaskStatusIconSpan(_event["datetime"], _event["done"]).css("margin-right", 3);

    $('<td>').addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("font-weight", "bold").css("width", "8%").append(statusIcon).append($('<span>').text(eventDateTime.getHours() + ":" + ConvertDateComponentTo2CharsFormat(eventDateTime.getMinutes())).attr("title", "Время")).appendTo(eventsTr);
    totalWidth -= 8;
    $('<td>').addClass("event_in_frame-td-decoration").text(_event["manager__siteuser__alias"]).attr("title", _event["manager__siteuser__alias"]).css("width", "15%").css("font-weight", "bold").appendTo(eventsTr);
    totalWidth -= 15;
    $('<td>').addClass("event_in_frame-td-decoration").text(_event["company__city__name"]).attr("title", _event["company__city__name"]).css("width", "10%").appendTo(eventsTr);
    totalWidth -= 10;
    $('<td>').addClass("event_in_frame-td-decoration").text(_event["company__name"]).attr("title", _event["company__name"]).appendTo(eventsTr);
    $('<td>').addClass("event_in_frame-td-decoration").text(_event["description"]).attr("title", _event["description"]).css("width", "10%").appendTo(eventsTr);
    totalWidth -= 10;
    $('<td>').addClass("event_in_frame-td-decoration").text(_event["comment"]).attr("title", _event["comment"]).css("width", "20%").appendTo(eventsTr);
    totalWidth -= 20;
    var buttons = $('<td>').css("text-align", "right").css("width", 125).addClass("event_in_frame-td-decoration").appendTo(eventsTr);

    if (!_event["done"]) {
        if (_event["type"] != "event") {
            var taskDoneButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Выполнить").css("height", 18).css("width", 18).css("margin-right", 10).css("color", "#337ab7").appendTo(buttons);
            $('<span>').addClass("glyphicon glyphicon-check text-primary").css("color", "inherit").css("top", "-3px").css("left", -6).appendTo(taskDoneButton);
            (function (_id) {
                taskDoneButton.click(function (event) {
                    AddCall(false, false, _id);
                    event.stopPropagation();

                });
            })(_event["id"]);
        }
        var taskDoneWithCallButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Выполнить со звонком").css("height", 18).css("width", 18).css("margin-right", 10).css("color", "#337ab7").appendTo(buttons);
        $('<span>').addClass("glyphicon glyphicon-earphone text-primary").css("color", "inherit").css("top", "-3px").css("left", -6).appendTo(taskDoneWithCallButton);
        (function (_id, _companyId, _companyName) {
            taskDoneWithCallButton.click(function (event) {
                AddCall(_companyId, _companyName, _id);
                event.stopPropagation();

            });
        })(_event["id"], _event["company__id"], _event["company__name"]);
    }
    //Кнопка перехода к учреждению
    var companyInfoButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Данные компании").css("height", 18).css("width", 18).css("margin-right", 10).css("color", "#337ab7").appendTo(buttons);
    $('<span>').addClass("glyphicon glyphicon-info-sign").css("color", "inherit").css("top", "-3px").css("left", -6).appendTo(companyInfoButton);
    (function (_id) {
        companyInfoButton.click(function (event) {
            EditCompany(false, _id, true);
            event.stopPropagation();

        });
    })(_event["company__id"]);
    //Кнопка перехода к учреждению
    var goToCompanyButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Перейти к компании").css("height", 18).css("width", 18).css("margin-right", 10).css("color", "#337ab7").appendTo(buttons);
    $('<span>').addClass("glyphicon glyphicon-share-alt").css("color", "inherit").css("top", "-3px").css("left", -6).appendTo(goToCompanyButton);
    (function (_id) {
        goToCompanyButton.click(function (event) {
            GoToCompanyPage(_id);
            event.stopPropagation();
        });
    })(_event["company__id"]);
    return eventsTr;
}
function ShowUnExeTasks(_data) {
    var expiredTasksContainer = $('#expiredTasksContainer');
    var expiredTasks = _data["expired_tasks"];
    expiredTasksContainer.empty();
    if (expiredTasks.length == 0) {
        $('#expiredTasksFrame').css("display", "none");
    } else {
        $('#expiredTasksFrame').css("display", "block");
    }
    for (var i = 0; i < expiredTasks.length; i++) {
        var eventDiv = $('<div>').addClass("events_frame-decoration").appendTo(expiredTasksContainer);
        var eventTable = $('<table>').addClass("event_table-decoration").appendTo(eventDiv);

        CreateInListTaskDecoration({event: expiredTasks[i]}, "fulllist").appendTo(eventTable);
    }
    return;
}
function TransformDateFromTask(_task, _type) {
    return ConvertDateFromStringValue(_task["datetime"], _type);
}
//Events
//Add Event functions:
function AddEvent(_companyId, _show, _companyDataDict, _dateDict, _onOkFunction) {
    var dateNow = new Date();
    var companyName = false;
    var companyAdress = false;
    var companyContacts = false;

    var year = this.year || dateNow.getFullYear();
    var month = this.month|| dateNow.getMonth() + 1;
    var date = this.date || dateNow.getDate();
    var hour = this.hour || 12;
    var minute = 0;

    if(isDict(_companyDataDict)){
        companyName = _companyDataDict["companyName"];
        companyAdress = _companyDataDict["companyAdress"];
        companyContacts = _companyDataDict["companyContacts"];
    }
    if(isDict(_dateDict)){
        year = _dateDict["year"];
        month = _dateDict["month"];
        date = _dateDict["date"];
        hour = _dateDict["hour"];
        minute = _dateDict["minute"];
    }
    $.post('/aj_manager_get_manager_own_data/', {}, function (response) {
        var data = ResponseToNotify(response);
        if (response["status"] != "data") {
            return;
        }
        var dictContext = {
            eventPercent: data["eventPercent"]
        };
        var modalWindow = showModalWindow_new("okcancel", "Добавить мероприятие", AddEvent_GenerateContent(year, month, date, hour, minute, _show, _companyId, dictContext), function () {
            if (TotalInputsValidator(modalWindow)) {
                $.post("/aj_events_add_event/", {
                    startTime: $('#AddEvent_date').pickadate('picker').get('select', "yyyy-mm-dd ") + $('#AddEvent_time').pickatime('picker').get('select', 'HH:i'),
                    company: $('#AddEvent_company').val(),
                    companyName: $('#AddEvent_companyName').val(),
                    companyAdress: $('#AddEvent_companyAdress').val(),
                    companyContacts: $('#AddEvent_companyContacts').val(),
                    note: $('#AddEvent_note').val(),
                    artist: $('#AddEvent_artist').val(),
                    price: $('#AddEvent_price').val().replace(/[^0-9]/g, ''),
                    childCount: $('#AddEvent_childCount').val().replace(/[^0-9]/g, ''),
                    percent: $('#AddEvent_percent').val().replace(/[^0-9]/g, ''),
                    attentionCallMonthBool: $('#AddEvent_attentionCallMonthBool').is(':checked'),
                    attentionCallWeekBool: $('#AddEvent_attentionCallWeekBool').is(':checked'),
                    attentionCallDayBool: $('#AddEvent_attentionCallDayBool').is(':checked')
                }, function (response) {
                    if (ResponseToNotify(response) == "success") {
                        UpdateData(true, true, true);
                    }
                });
                hideModalWindow(modalWindow)
            }

        });
        //Инициализация подгрузки списка компаний
        Select2CompaniesLoader($("#AddEvent_company"), "/aj_manager_get_manager_companies_search/", $('#cityPickerTittle').attr("data-id"), FormatJsonDataSelectionsCompanyPicker, FormatJsonDataSelectionCompanyPicker_OtherData, modalWindow);
        //Автозаполнение процентов
        $('#AddEvent_percent').keyup(function () {
            $(this).val(function (index, old) {
                var newVal = old.replace(/[^0-9]/g, '') + ' %';
                if (newVal != " %")
                    return newVal;
                else
                    return "";
            });
        });
        if (_companyId) {
            if (companyName) {
                if (!$('#AddEvent_companyName').val()) {
                    $('#AddEvent_companyName').val(companyName);
                }
                if (!$('#AddEvent_companyAdress').val()) {
                    $('#AddEvent_companyAdress').val(companyAdress);
                }
                if (!$('#AddEvent_companyContacts').val()) {
                    $('#AddEvent_companyContacts').val(companyContacts);
                }
                $('#AddEvent_companyName').removeAttr("readonly");
                $('#AddEvent_companyAdress').removeAttr("readonly");
                $('#AddEvent_companyContacts').removeAttr("readonly");
                $("#AddEvent_company").attr("disabled", "disabled").append($('<option>').attr("value", _companyId).text(companyName));
                $("#AddEvent_company").select2();


                $("#AddEvent_artist").select2({//Преобразует элемент управления к Select2 виду
                    placeholder: "Выберите шоу для отметки звонка.",
                    language: "ru"

                });
                $("#AddEvent_artist").removeAttr("title");
                $("#AddEvent_artist").removeAttr("disabled");
                ContainerLoadIndicatorShow($('#AddEvent_artist').next($('span')));
                $.post("/aj_manager_allowed_shows_for_company/", {company: $('#AddEvent_company').val()}, function (response) {
                    $('#AddEvent_artist').empty();
                    $('#AddEvent_artist').empty();
                    ContainerLoadIndicatorHide();
                    var data = ResponseToNotify(response);
                    if (response["status"] != "data") {
                        return;
                    }
                    var shows = data["shows"];
                    for (var i = 0; i < shows.length; i++) {
                        $('<option>').val(shows[i]["id"]).text(shows[i]["name"]).appendTo($("#AddEvent_artist"));
                    }
                    if (parseInt(_show) != 0) {
                        $('#AddEvent_artist').val(_show).trigger("click");
                    }
                });
            }
            else {

                setTimeout(function () {
                    $("#AddEvent_company").select2('open');
                    $('.select2-search__field').val("Выполняется поиск..." + _companyId);
                    $('.select2-search__field').trigger("keyup");

                }, 400)
            }
        }
    });
    return;
}
function AddEvent_GenerateContent(_year, _month, _date, _hour, _minute, _show, _companyId, _dictContext) {
    var idStartText = "AddEvent_";
    var container = $('<div>');

    //DateTimeRow
    var wrapper = $('<div>').addClass("form-group").css("padding-bottom", "1px").appendTo(container);
    //DateInput
    $('<label>').addClass("col-md-1 small text-primary control-label").attr("for", idStartText + "date").css("padding-right", "0px").css("padding-left", "0px").css("margin-top", "6").html("Дата:").appendTo(wrapper);
    var controlContainer = $('<div>').addClass("col-md-5").css("padding-left", "0px").appendTo(wrapper);
    var control = $('<input>').attr("type", "text").attr("id", idStartText + "date").addClass("form-control input-sm").appendTo(controlContainer);
    control.pickadate({
        format: "d, mmmm, yyyy",
        clear: '',
        selectYears: true,
        selectMonths: true,
        labelMonthPrev: "Предыдущий месяц",
        labelMonthNext: "Следующий месяц",
        labelMonthSelect: "Выберите месяц",
        labelYearSelect: "Выберите год",
        max: new Date(new Date().getFullYear() + 2, 1, 1),
        container: '#pickadatecontainer'

    });
    var picker = $(control).pickadate('picker');
    picker.set('select', new Date(_year, _month - 1, _date));
    //TimeInput
    $('<label>').addClass("col-md-2 small text-primary control-label").attr("for", idStartText + "time").css("padding-right", "0px").css("margin-top", "6").html("Время:").appendTo(wrapper);
    var controlContainer = $('<div>').addClass("col-md-4").css("padding-left", "0px").appendTo(wrapper);
    var control = $('<input>').attr("type", "text").attr("id", idStartText + "time").addClass("form-control input-sm").appendTo(controlContainer);
    control.pickatime({
        format: 'HH:i',
        interval: 15,
        min: [6, 30],
        max: [20, 0],
        clear: ''
    });
    var picker = $(control).pickatime('picker');
    picker.set('select', [_hour, _minute]);


    $('<div>').addClass("header").text("Компания:").appendTo(container);
    $('<select>').addClass("form-control input-sm").attr("id", idStartText + "company").attr("required", "required").appendTo(container);
    $('<div>').addClass("header").text("Имя компании для артиста:").appendTo(container);
    $('<input>').addClass("form-control input-sm").attr("id", idStartText + "companyName").attr("checknotneed", "checknotneed").attr("readonly", "true").attr("placeholder", "Выберите компанию из списка для разблокировки этого поля").appendTo(container);
    $('<div>').addClass("header").text("Адрес для артиста:").appendTo(container);
    $('<input>').addClass("form-control input-sm").attr("id", idStartText + "companyAdress").attr("checknotneed", "checknotneed").attr("readonly", "true").attr("placeholder", "Выберите компанию из списка для разблокировки этого поля").appendTo(container);
    $('<div>').addClass("header").text("Контакты для артиста:").appendTo(container);
    $('<input>').addClass("form-control input-sm").attr("id", idStartText + "companyContacts").attr("checknotneed", "checknotneed").attr("readonly", "true").attr("placeholder", "Выберите компанию из списка для разблокировки этого поля").appendTo(container);
    $('<div>').addClass("header").text("Примечание:").appendTo(container);
    $('<textarea>').css("resize", "none").addClass("form-control input-sm").attr("rows", 3).attr("id", idStartText + "note").attr("checknotneed", "checknotneed").attr("placeholder", "Примечание").appendTo(container);
    $('<div>').addClass("header").text("Шоу:").appendTo(container);
    var selectElem = $('<select>').addClass("form-control input-sm").attr("checknotneed", "checknotneed").attr("id", idStartText + "artist").attr("disabled", "disabled").appendTo(container);
    if ($('#showPickerTittle').attr("data-id") != 0) {
        selectElem.attr("title", "Для того чтобы была возможность выбора другого шоу, выберите в общем списке 'Все шоу'");
        $('<option>').attr("selected", "selected").attr("value", $('#showPickerTittle').attr("data-id")).text($('#showPickerTittle').children('span').text()).appendTo(selectElem);
        $("#AddEvent_artist").select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите шоу для отметки звонка.",
            language: "ru"
        });
    } else {
        selectElem.attr("title", "Выберите компанию из списка для разблокировки этого поля");
        $("#AddEvent_artist").select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите шоу для отметки звонка.",
            language: "ru"

        });
    }
    var table = $('<table>').css("width", "100%").css("border-collapse", "separate").css("border-spacing", "5px").appendTo(container);
    var tr = $('<tr>').appendTo(table);
    var td = $('<td>').appendTo(tr);
    $('<div>').addClass("header").text("Стоимость").css("font-size", 15).css("font-weight", 400).appendTo(td);
    var td = $('<td>').appendTo(tr);
    $('<div>').addClass("header").text("Число детей").css("font-size", 15).css("font-weight", 400).appendTo(td);
    var td = $('<td>').appendTo(tr);
    $('<div>').addClass("header").text("Процент учреждению").css("font-size", 15).css("font-weight", 400).appendTo(td);
    var tr = $('<tr>').appendTo(table);
    var td = $('<td>').addClass("header").appendTo(tr);
    $('<input>').addClass("form-control input-sm").attr("checknotneed", "checknotneed").attr("id", idStartText + "price").attr("placeholder", "Стоимость").appendTo(td);
    var td = $('<td>').addClass("header").appendTo(tr);
    $('<input>').addClass("form-control input-sm").attr("checknotneed", "checknotneed").attr("id", idStartText + "childCount").attr("placeholder", "Число детей").appendTo(td);
    var td = $('<td>').addClass("header").appendTo(tr);
    var managerPercent = $('<input>').addClass("form-control input-sm").attr("checknotneed", "checknotneed").attr("id", idStartText + "percent").attr("placeholder", "Процент учреждению").appendTo(td);
    if ("eventPercent" in _dictContext) {
        managerPercent.val(_dictContext["eventPercent"] + " %");
    }

    var inputContainer = $('<div>').css("color", "#428bca").css("font-size", "small").css("width", "100%").css("text-align", "left").appendTo(container);
    $('<input>').attr("type", "checkbox").addClass("beautycheck").attr("id", idStartText + "attentionCallDayBool").appendTo(inputContainer);
    $('<label>').attr("for", idStartText + "attentionCallDayBool").addClass("header beautycheck").text("Позвонить за день").css("user-select", "none").appendTo(inputContainer);

    var inputContainer = $('<div>').css("color", "#428bca").css("font-size", "small").css("width", "100%").css("text-align", "left").appendTo(container);
    $('<input>').attr("type", "checkbox").addClass("beautycheck").attr("id", idStartText + "attentionCallWeekBool").appendTo(inputContainer);
    $('<label>').attr("for", idStartText + "attentionCallWeekBool").addClass("header beautycheck").text("Позвонить за неделю").css("user-select", "none").appendTo(inputContainer);

    var inputContainer = $('<div>').css("color", "#428bca").css("font-size", "small").css("width", "100%").css("text-align", "left").appendTo(container);
    $('<input>').attr("type", "checkbox").addClass("beautycheck").attr("id", idStartText + "attentionCallMonthBool").appendTo(inputContainer);
    $('<label>').attr("for", idStartText + "attentionCallMonthBool").addClass("header beautycheck").text("Позвонить за месяц").css("user-select", "none").appendTo(inputContainer);

    return container;
}
function AddPresentatorEvent() {
    var year = this.year || dateNow.getFullYear();
    var month = this.month|| dateNow.getMonth() + 1;
    var date = this.date || dateNow.getDate();
    var hour = this.hour || 12;
    var minute = 0;

    var idStartText = "AddPresentatorEvent_";
    var container = $('<div>');
    var toggleWrapper = $('<div>').appendTo(container);
    var labelContainer = $('<div>').addClass("col-md-3").css("text-align", "left").appendTo(toggleWrapper);
    var toggleContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(toggleWrapper);
    var fullDayToggle = $('<input>').attr("id", "fullDayToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
    $('<label>').attr("for", "fullDayToggle").addClass("text-primary control-label").text("Весь день").css("user-select", "none").appendTo(labelContainer);

    $('<hr>').addClass("company-primary-divider col-md-12").css("margin-bottom", "15px").appendTo(container);
    //DateTimeRow
    var dateWrapper = $('<div>').addClass("form-group").css("padding-bottom", "1px").appendTo(container);
    //DateInput
    $('<label>').addClass("col-md-1 small text-primary control-label").attr("for", idStartText + "date").css("padding-right", "0px").css("padding-left", "0px").css("margin-top", "6").html("Дата:").appendTo(dateWrapper);
    var controlContainer = $('<div>').addClass("col-md-11").css("margin-bottom", "15px").css("padding-left", "0px").appendTo(dateWrapper);
    var control = $('<input>').attr("type", "text").attr("checknotneed", "checknotneed").attr("id", idStartText + "date").addClass("form-control input-sm").appendTo(controlContainer);
    control.pickadate({
        format: "d, mmmm, yyyy",
        clear: '',
        selectYears: true,
        selectMonths: true,
        labelMonthPrev: "Предыдущий месяц",
        labelMonthNext: "Следующий месяц",
        labelMonthSelect: "Выберите месяц",
        labelYearSelect: "Выберите год",
        max: new Date(new Date().getFullYear() + 2, 1, 1),
        container: '#pickadatecontainer'

    });
    var picker = $(control).pickadate('picker');
    picker.set('select', new Date(year, month - 1, date));


    var timeRangeWrapper = $('<div>').addClass("form-group col-md-12").css("padding-bottom", "1px").appendTo(container);
    //TimeFrom
    $('<label>').addClass("col-md-3 small text-primary control-label").attr("for", idStartText + "timeFrom").css("padding-right", "3px").css("margin-top", "6").html("Время от:").appendTo(timeRangeWrapper);
    var controlContainer = $('<div>').addClass("col-md-3").css("padding-left", "0px").appendTo(timeRangeWrapper);
    var control = $('<input>').attr("type", "text").attr("checknotneed", "checknotneed").attr("id", idStartText + "startTime").addClass("form-control input-sm").appendTo(controlContainer);
    control.pickatime({
        format: 'HH:i',
        interval: 15,
        min: [6, 30],
        max: [19, 0],
        clear: ''
    });
    var picker = $(control).pickatime('picker');
    picker.set('select', [hour, minute]);

    //TimeTo
    $('<label>').addClass("col-md-3 small text-primary control-label").attr("for", idStartText + "timeTo").css("padding-right", "2px").css("padding-bottom", "23px").css("margin-top", "6").html("Время до:").appendTo(timeRangeWrapper);
    var controlContainer = $('<div>').addClass("col-md-3").css("padding-left", "0px").appendTo(timeRangeWrapper);
    var control = $('<input>').attr("type", "text").attr("checknotneed", "checknotneed").attr("id", idStartText + "endTime").addClass("form-control input-sm").appendTo(controlContainer);
    control.pickatime({
        format: 'HH:i',
        interval: 15,
        min: [6, 30],
        max: [20, 0],
        clear: ''
    });
    var picker = $(control).pickatime('picker');
    picker.set('select', [hour + 1, minute]);


    var descriptionContainer = $('<div>').addClass("form-group").appendTo(container);
    $('<label>').addClass("header").attr("for", idStartText + "description").css("text-align", "left").css("width", "100%").css("color","#5395ce").text("Причина:").appendTo(descriptionContainer);
    $('<input>').css("resize", "none").addClass("form-control input-sm").attr("id", idStartText + "description").attr("required", "required").attr("placeholder", "Причина").appendTo(descriptionContainer);

    $('<div>').addClass("header").text("Описание:").appendTo(container);
    $('<textarea>').css("resize", "none").addClass("form-control input-sm").attr("rows", 8).attr("id", idStartText + "comment").attr("checknotneed", "checknotneed").attr("placeholder", "Описание").appendTo(container);

    var modalWindow = showModalWindow_new("okcancel", "Отметка занятого времени", container, function () {
        if(TotalInputsValidator(modalWindow)){
            $.post("/aj_events_add_presentator_event/", {
                date: $('#AddPresentatorEvent_date').pickadate('picker').get('select', "yyyy-mm-dd"),
                startTime: $('#AddPresentatorEvent_startTime').pickatime('picker').get('select', 'HH:i'),
                endTime: $('#AddPresentatorEvent_endTime').pickatime('picker').get('select', 'HH:i'),
                description: $('#AddPresentatorEvent_description').val(),
                comment: $('#AddPresentatorEvent_comment').val(),
                full_day: $('#fullDayToggle').prop("checked")
            }, function (response) {
                if(ResponseToNotify(response) == "success"){
                    UpdateData(true, true, true);
                    hideModalWindow(modalWindow);
                }
            });

        }
    });
    $(fullDayToggle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "info",
            onstyle: "success"
        });
    $('#fullDayToggle').change(function () {
        if (fullDayToggle.prop("checked")) {
            timeRangeWrapper.css("visibility", "hidden");
        } else {
            timeRangeWrapper.css("visibility", "visible");
        }
    });
    return;
}
function ShowPresentatorEvent(_id) {
    $.post('/aj_events_get_presentator_event_data/', {
        id: _id
    }, function (response) {
        var data = ResponseToNotify(response);
        if(response["status"] != "data"){
            return;
        }
        var modalWindowType = "cancel";
        var buttons = {};
        if(data["user"]["type"] == "presentator" || data["user"]["type"] == "admin"){
            modalWindowType = "customcancel";
            buttons["Удаление"] = {
                            "button": $('<button>').css("background-color", "#42aebf").css("color", "white").append($('<span>').addClass("glyphicon glyphicon-trash")),
                            "function": function () {
                                var removeModalWindow = showModalWindow_new("okcancel", "Удалить отметку?", false, function () {
                                    $.post('/aj_events_remove_presentator_event/', {id: _id}, function (response) {
                                        var response = ResponseToNotify(response);
                                        if(response != "success"){
                                            return;
                                        }
                                        hideAllModalWindows();
                                        UpdateData(true, true, true);
                                    });
                                }, false, true);
                            }
                        };
        }
        var container = $('<div>');
        $('<div>').addClass("events_date_label-decoration").html(ConvertDateTimeToDateLabel(ConvertOnlyDateFromStringValue(data["date"]), "date")).appendTo(container);
        if(data["fullday"]){
            $('<div>').addClass("events_date_label-decoration").text("Весь день").appendTo(container);
        }else{
            $('<div>').addClass("events_date_label-decoration").text(ConvertTimeTo2ComponentsFormat(data["startTime"]) + " - " + ConvertTimeTo2ComponentsFormat(data["endTime"])).appendTo(container);
        }
        var descriptionContainer = $('<div>').addClass("form-group").appendTo(container);
        $('<label>').addClass("header").css("text-align", "left").css("width", "100%").css("color", "#5395ce").text("Причина:").appendTo(descriptionContainer);
        $('<input>').css("resize", "none").addClass("form-control input-sm").attr("readonly", "readonly").val(data["description"]).attr("title", data["description"]).appendTo(descriptionContainer);

        $('<div>').addClass("header").text("Описание:").appendTo(container);
        $('<textarea>').css("resize", "none").addClass("form-control input-sm").attr("readonly", "readonly").attr("rows", 8).text(data["comment"]).attr("title", data["comment"]).appendTo(container);

        $('<div>').addClass("events_date_label-decoration").css("margin-top", "25px").text("Дата добавления отметки:").appendTo(container);
        $('<div>').addClass("events_date_label-decoration").html(ConvertDateTimeToDateLabel(ConvertOnlyDateFromStringValue(data["statsdt"]), "date")).appendTo(container);

        var modalWindow = showModalWindow_new(modalWindowType, "Просмотр занятого времени", container, false, buttons);
    });
    return;
}
function ShowPresentatorEvents(_data, _frame, _type, _option) {
    if("presentator_events" in _data){
        var presentatorEvents = _data["presentator_events"];
        switch(_type){
            case "oldcal":
                _frame.find('td[data-date]').css("background-color", "ffffff");
                _frame.find(".presentator_event-oldcal_fullday_decoration").remove();
                _frame.find(".presentator_event-oldcal_decoration-description_container").remove()
                for(var i = 0; i < presentatorEvents.length; i++){
                    var updatedElem = $('td[data-date=\"' + ConvertDateForOldcalFinder(presentatorEvents[i]["date"]) + '"]');
                    if (presentatorEvents[i]["fullday"]) {
                        updatedElem.css("background-color", "#fff7007d");
                        var descriptionContainer = $('<div>').addClass("presentator_event-oldcal_decoration-description_container").appendTo(updatedElem);
                        $('<div>').text("День занят").appendTo(descriptionContainer);
                        $('<div>').text(presentatorEvents[i]["description"]).appendTo(descriptionContainer);
                        var backCover = $('<div>').addClass("presentator_event-oldcal_fullday_decoration").attr("title", "День занят: " + presentatorEvents[i]["description"]).attr("data-id", presentatorEvents[i]["id"]).css("cursor", "pointer").appendTo(updatedElem);

                        $(backCover).click(function (e) {
                            ShowPresentatorEvent($(this).attr("data-id"));
                            e.stopPropagation();
                        });
                    } else {
                        var contentDiv = $('<div>').attr("title", "Занятое артистом время").attr("data-id", presentatorEvents[i]["id"]).css("height", "52px").addClass("oldcal-show_in_table-container_decoration presentator_event-oldcal_decoration").css("background-color", "#00ff088c").insertAfter(updatedElem.children(".oldcal-month_day_decoration"));
                        var contentTable = $('<table>').addClass("oldcal-show_in_table-table_decoration").appendTo(contentDiv);
                        var contentTr = $('<tr>').appendTo(contentTable);
                        var contentTd = $('<td>').text("Занятое время").css("height", "17px").css("text-align", "center").css("font-weight", "bold").appendTo(contentTr);
                        var contentTr = $('<tr>').appendTo(contentTable);
                        var contentTd = $('<td>').addClass("presentator_event-oldcal_decoration-time").text(ConvertTimeTo2ComponentsFormat(presentatorEvents[i]["startTime"]) + "-" + ConvertTimeTo2ComponentsFormat(presentatorEvents[i]["endTime"])).appendTo(contentTr);
                        var contentTr = $('<tr>').appendTo(contentTable);
                        var contentTd = $('<td>').addClass("presentator_event-oldcal_decoration-time").text(presentatorEvents[i]["description"]).attr("title", presentatorEvents[i]["description"]).appendTo(contentTr);

                        (function (_id, _elem) {
                            $(_elem).click(function (e) {
                                ShowPresentatorEvent(_id);
                                e.stopPropagation();
                            });
                            $(_elem).contextmenu(function (e) {
                                e.preventDefault();
                            });
                        })(presentatorEvents[i]["id"], contentDiv);
                    }
                }
                break;

            case "mycal":
                if(_option == "week"){
                    _frame.find('.presentator_event-week_cover_decoration').remove();
                    for(var i = 0; i < presentatorEvents.length; i++){
                        var updatedElem = WeekFrameFinder(presentatorEvents[i]["date"]);
                        if(presentatorEvents[i]["fullday"]){
                            updatedElem.find(".week-add_event-decoration").append($('<div>').addClass("presentator_event-week_cover_decoration").attr("title", "Время занято: " + presentatorEvents[i]["description"]).attr("data-id", presentatorEvents[i]["id"]));
                            updatedElem.find(".presentator_event-week_cover_decoration").click(function (event) {
                                ShowPresentatorEvent($(this).attr("data-id"));
                                event.stopPropagation();
                            });

                        }else{
                            var low_range_hour = GetTimeComponent(presentatorEvents[i]["startTime"], "hour");
                            var high_range_hour = GetTimeComponent(presentatorEvents[i]["endTime"], "hour");
                            if(GetTimeComponent(presentatorEvents[i]["endTime"], "minute") != 0){
                                high_range_hour += 1;
                            }
                            for(var j = low_range_hour; j < high_range_hour + 1; j++){
                                var elem = updatedElem.find("[data-hour=\"" + ConvertDateComponentTo2CharsFormat(j) + "\"]");
                                var coverElem = $('<div>').addClass("presentator_event-week_cover_decoration").attr("title", "Время занято: " + presentatorEvents[i]["description"]).attr("data-id", presentatorEvents[i]["id"]);
                                elem.parent().append(coverElem);
                                coverElem.click(function (event) {
                                    ShowPresentatorEvent($(this).attr("data-id"));
                                    event.stopPropagation();
                                });

                            }
                        }


                    }
                }else{
                    $('.presentator_event-inlist_container_decoration').remove();
                    if(presentatorEvents.length != 0){
                        var presentatorEvent = presentatorEvents[0];
                        var eventsContainer = $('<div>').addClass("events_frame-decoration presentator_event-inlist_container_decoration").css("border-bottom", "10px solid #337ab7").insertAfter(".events_frame_header-decoration");
                        var eventsTable = $('<table>').addClass("event_table-decoration").appendTo(eventsContainer);
                        var eventsTr = $('<tr>').addClass("presentator_event-inlist_tr_decoration").attr("data-id", presentatorEvent["id"]).appendTo(eventsTable);
                        if(presentatorEvent["fullday"]){
                            $('<td>').addClass("event_in_frame-td-decoration").css("font-weight", "bold").css("width", "20%").append($('<span>').text("День занят")).attr("title", "День занят").appendTo(eventsTr);

                            eventsContainer.css("background-color", "#fff7007d");
                        }else{
                            $('<td>').addClass("event_in_frame-td-decoration").css("text-align", "left").css("font-weight", "bold").css("width", "10%").append($('<span>').text("Занятое время")).attr("title", "Занятое время").appendTo(eventsTr);
                            eventsContainer.css("background-color", "#00ff088c");
                            $('<td>').addClass("event_in_frame-td-decoration").css("text-align", "left").text(ConvertTimeTo2ComponentsFormat(presentatorEvent["startTime"]) + " - " + ConvertTimeTo2ComponentsFormat(presentatorEvent["endTime"])).attr("title", ConvertTimeTo2ComponentsFormat(presentatorEvent["startTime"]) + " - " + ConvertTimeTo2ComponentsFormat(presentatorEvent["endTime"])).css("width", "10%").css("font-weight", "bold").appendTo(eventsTr);

                        }
                        eventsTr.click(function(event){
                           ShowPresentatorEvent($(this).attr("data-id"));
                        });
                        $('<td>').addClass("event_in_frame-td-decoration").text(presentatorEvent["presentator__siteuser__alias"]).attr("title", presentatorEvent["presentator__siteuser__alias"]).css("text-align", "left").css("width", "15%").appendTo(eventsTr);
                        $('<td>').addClass("event_in_frame-td-decoration").text(presentatorEvent["description"]).attr("title", presentatorEvent["description"]).css("text-align", "left").css("width", "65%").appendTo(eventsTr);
                    }
                }
                break;
            case "datelist":
                if(_option == "date"){
                    if(presentatorEvents.length != 0){
                        var presentatorEvent = presentatorEvents[0];
                        var eventsContainer = $('<div>').addClass("events_frame-decoration presentator_event-inlist_container_decoration").css("border-bottom", "10px solid #337ab7").insertAfter(".events_frame_header-decoration");
                        var eventsTable = $('<table>').addClass("event_table-decoration").appendTo(eventsContainer);
                        var eventsTr = $('<tr>').addClass("presentator_event-inlist_tr_decoration").attr("data-id", presentatorEvent["id"]).appendTo(eventsTable);
                        if(presentatorEvent["fullday"]){
                            $('<td>').addClass("event_in_frame-td-decoration").css("font-weight", "bold").css("width", "20%").append($('<span>').text("День занят")).attr("title", "День занят").appendTo(eventsTr);
                            eventsContainer.css("background-color", "#fff7007d");
                        }else{
                            $('<td>').addClass("event_in_frame-td-decoration").css("text-align", "left").css("font-weight", "bold").css("width", "10%").append($('<span>').text("Занятое время")).attr("title", "Занятое время").appendTo(eventsTr);
                            eventsContainer.css("background-color", "#00ff088c");
                            $('<td>').addClass("event_in_frame-td-decoration").css("text-align", "left").text(ConvertTimeTo2ComponentsFormat(presentatorEvent["startTime"]) + " - " + ConvertTimeTo2ComponentsFormat(presentatorEvent["endTime"])).attr("title", ConvertTimeTo2ComponentsFormat(presentatorEvent["startTime"]) + " - " + ConvertTimeTo2ComponentsFormat(presentatorEvent["endTime"])).css("width", "10%").css("font-weight", "bold").appendTo(eventsTr);

                        }
                        eventsTr.click(function(event){
                           ShowPresentatorEvent($(this).attr("data-id"));
                        });
                        $('<td>').addClass("event_in_frame-td-decoration").text(presentatorEvent["presentator__siteuser__alias"]).attr("title", presentatorEvent["presentator__siteuser__alias"]).css("text-align", "left").css("width", "15%").appendTo(eventsTr);
                        $('<td>').addClass("event_in_frame-td-decoration").text(presentatorEvent["description"]).attr("title", presentatorEvent["description"]).css("text-align", "left").css("width", "65%").appendTo(eventsTr);
                    }
                }
                break;
        }
    }
    return;
}
//Show Event functions:
function ShowEvent(_id, _item) {
    if(_item){
        _item.find(".logscount-label").remove();
        _item.removeClass("event-mycalweek-haveevents").attr("title", "");
    }
    ShowNotify_LoadData();
    $.post("/aj_events_get_event_data/", {
        id: _id
    }, function (response) {
        var eventData = ResponseToNotify(response);

        if (response["status"] != "data") {
            return;
        }
        //HEADER
        var header = $('<div>').css("margin-top", "10px");
        var statusIcon = ReturnEventStatusIconSpan(eventData).css("margin-right", "10px");
        header.append(statusIcon);
        header.append($('<span>').text("Просмотр мероприятия"));




        var button = $('<button>').attr("title", "История изменений мероприятия").addClass("btn").css("height", "30px").css("background-color", HexToRGB(eventData["artist__color"], 1)).appendTo(header);
        $('<span>').addClass("glyphicon glyphicon-align-justify").css("color", "#337ab7").appendTo(button);
        if(eventData["logs_count"] != 0){
            $('<div>').addClass("count-label").attr("id", "logsCountLabel").attr("title", "Число новых событий").text(eventData["logs_count"]).appendTo(button);
        }
        button.click(function () {
           LogsHistory_Paginator("event_history", _id);
        });
        var showNameHeader = $('<div>').text(eventData["company__city__name"] + ": " + eventData["artist__name"]).css("color", HexToRGB(eventData["artist__color"], 1)).appendTo(header);

        var button = $('<button>').attr("title", "Открыть чат мероприятия").css("background-color", HexToRGB(eventData["artist__color"], 1)).css("margin-right", "15px").addClass("btn").css("height", "29px").prependTo(showNameHeader);
        (function (but) {
            but.click(function () {
                but.find('div').remove();
                ShowChatHistory(eventData["id"], "Event");
            });
        })(button);

        $('<span>').addClass("\tglyphicon glyphicon-envelope").css("color", "#337ab7").appendTo(button);
        if (eventData["unread_messages_count"] != 0) {
            button.attr("title", "Открыть чат: " + eventData["unread_messages_count"] + " непрочитанных сообщений.");
            $('<div>').text(eventData["unread_messages_count"]).css("color", "white").css("background-color", "red").css("border-radius", "10px").css("font-size", 10).css("position", "relative").css("top", "-5px").css("left", "5px").appendTo(button);
        }


        var controlButtons = {};
        var modalWindowStatus = "";
        switch (eventData["user"]["type"]) {
            case "admin":
                var changeShowButton = $('<button>').attr("title", "Изменить шоу").addClass("btn").css("margin-left", "10px").css("background-color", HexToRGB(eventData["artist__color"], 1)).appendTo(showNameHeader);
                $('<span>').addClass("glyphicon glyphicon-pencil").css("color", "#337ab7").appendTo(changeShowButton);
                changeShowButton.click(function () {
                    ShowArtistEdit(eventData["artist__id"], eventData["company__id"], eventData["id"]);
                });
                modalWindowStatus = "custom";

                controlButtons["Перенос"] = {
                            "button": $('<button>').css("background-color", "#337ab7").css("color", "white").append($('<span>').addClass("glyphicon glyphicon-share-alt")),
                            "function": function () {
                                AddCrashTransferRemove(eventData, "transfer");
                            }
                        };
                controlButtons["Оформить слет"] = {
                            "button": $('<button>').css("color", "white").css("background-color", "#ff5a5a").append($('<span>').addClass("glyphicon glyphicon-exclamation-sign")),
                            "function": function () {
                                AddCrashTransferRemove(eventData, "crash");
                            }
                        };
                controlButtons["Удалить"] = {
                            "button": $('<button>').css("background-color", "#42aebf").css("color", "white").append($('<span>').addClass("glyphicon glyphicon-trash")),
                            "function": function () {
                                AddCrashTransferRemove(eventData, "remove");
                            }
                        };
                controlButtons["Управление отзвонами"] = {
                            "button": $('<button>').css("background-color", "green").css("color", "white").css("margin-left", "10px").append($('<span>').addClass("glyphicon glyphicon-earphone")),
                            "function": function () {
                                EventCallsControl(eventData["id"]);
                            }
                        };
                controlButtons["Управление процентом менеджера"] = {
                            "button": $('<button>').css("background-color", "green").css("color", "white").append($('<span>').addClass("glyphicon").css("font-weight", "bold").css("top", "-1px").text("%").attr("title", "Текущий процент: " + eventData["sumPercent"])),
                            "function": function () {
                                EventManagerPercentControl(eventData["id"], eventData["sumPercent"]);
                            }
                        };
                switch (statusIcon.attr("data-status")) {
                    case "crash":
                        controlButtons = {};
                        controlButtons["Отмена слета"] = {
                            "button": $('<button>').css("background-color", "#008000").css("color", "white").attr("title", "Отменить слет мероприятия").append($('<span>').addClass("glyphicon glyphicon-exclamation-sign")),
                            "function": function () {
                                AddCrashTransferRemove(eventData, "crash", true);
                            }
                        };
                        changeShowButton.remove();
                        break;
                    case "removed":
                        modalWindowStatus = "cancel";
                        changeShowButton.remove();
                        break;
                }
                break;
            case "manager":
                var changeShowButton = $('<button>').attr("title", "Изменить шоу").addClass("btn").css("margin-left", "10px").css("background-color", HexToRGB(eventData["artist__color"], 1)).appendTo(showNameHeader);
                $('<span>').addClass("glyphicon glyphicon-pencil").css("color", "#337ab7").appendTo(changeShowButton);
                changeShowButton.click(function () {
                    ShowArtistEdit(eventData["artist__id"], eventData["company__id"], eventData["id"]);
                });
                modalWindowStatus = "custom";

                controlButtons["Перенос"] = {
                    "button": $('<button>').css("background-color", "#337ab7").css("color", "white").append($('<span>').addClass("glyphicon glyphicon-share-alt")),
                    "function": function () {
                        AddCrashTransferRemove(eventData, "transfer");
                    }
                };
                controlButtons["Оформить слет"] = {
                    "button": $('<button>').css("color", "white").css("background-color", "#ff5a5a").append($('<span>').addClass("glyphicon glyphicon-exclamation-sign")),
                    "function": function () {
                        AddCrashTransferRemove(eventData, "crash");
                    }
                };
                controlButtons["Удалить"] = {
                    "button": $('<button>').css("background-color", "#42aebf").css("color", "white").append($('<span>').addClass("glyphicon glyphicon-trash")),
                    "function": function () {
                        AddCrashTransferRemove(eventData, "remove");
                    }
                };
                controlButtons["Управление отзвонами"] = {
                    "button": $('<button>').css("background-color", "green").css("color", "white").append($('<span>').css("font-weight", "bold").css("top", "-1px").addClass("glyphicon glyphicon-earphone")),
                    "function": function () {
                        EventCallsControl(eventData["id"]);
                    }
                };
                controlButtons["Управление процентом менеджера"] = {
                            "button": $('<button>').css("background-color", "green").css("color", "white").css("margin-left", "10px").append($('<span>').addClass("glyphicon").text("%")),
                            "function": function () {
                                EventManagerPercentControl(eventData["id"], eventData["sumPercent"]);
                            }
                        };

                switch (statusIcon.attr("data-status")) {
                    case "crash":
                        controlButtons = {};
                        controlButtons["Отмена слета"] = {
                            "button": $('<button>').css("background-color", "#008000").css("color", "white").attr("title", "Отменить слет мероприятия").append($('<span>').addClass("glyphicon glyphicon-exclamation-sign")),
                            "function": function () {
                                AddCrashTransferRemove(eventData, "crash", true);
                            }
                        };
                        changeShowButton.remove();
                        break;
                    case "removed":
                        modalWindowStatus = "cancel";
                        changeShowButton.remove();
                        break;
                }
                break;
            case "presentator":
                controlButtons = {};
                modalWindowStatus = "okcancel";
                switch (statusIcon.attr("data-status")) {
                    case "crash":
                        modalWindowStatus = "cancel";
                }
                break;
        }

        HideNotify(true);
        var modalWindow = showModalWindow_new(modalWindowStatus, header, ShowEvent_GenerateContent(eventData, statusIcon.attr("data-status")), function () {
            if(TotalInputsValidator(modalWindow)){
                $.post('/aj_events_edit_event/',
                    {
                        id: eventData["id"],
                        data: GetVariablesFromModalToDict("modalWindow", "EditEvent")
                    },
                    function (response) {
                        ResponseToNotify(response);
                        UpdateData(true, true, true);
                    }
                );
                hideModalWindow(modalWindow);
            }

        }, controlButtons);

        $('#EditEvent_percent').keyup(function () {
            $(this).val(function (index, old) {
                var newVal = old.replace(/[^0-9]/g, '') + ' %';
                if (newVal != " %")
                    return newVal;
                else
                    return "";
            });
        });
        DecorateModalWindow(modalWindow, HexToRGB(eventData["artist__color"], 0.3));
    });


}
function ShowEvent_GenerateContent(_event, _status) {
    var idStartText = "EditEvent_";
    var container = $('<div>');

    //Дата и время
    var eventDateTime = ConvertDateFromStringValue(_event["startTime"], "full");
    //DateTimeRow
    var wrapper = $('<div>').addClass("form-group").css("padding-bottom", "20px").appendTo(container);
    onOpenPickADate = function () {
        var picker = $("#" + "date").pickadate('picker');
        picker.close();
    };
    onOpenPickATime = function () {
        var picker = $("#" + "time").pickatime('picker');
        picker.close();
    };
    //DateInput
    $('<label>').addClass("col-md-1 small text-primary control-label").attr("for", "date").css("padding-right", "0px").css("padding-left", "0px").css("margin-top", "6").html("Дата:").appendTo(wrapper);
    var controlContainer = $('<div>').addClass("col-md-5").css("padding-left", "0px").appendTo(wrapper);
    var control = $('<input>').attr("type", "text").attr("disabled", "disabled").css("cursor", "default").attr("id", "date").addClass("form-control input-sm").attr("checknotneed", "checknotneed").appendTo(controlContainer);
    control.pickadate({
        format: "d, mmmm, yyyy",
        clear: '',
        selectYears: true,
        selectMonths: true,
        labelMonthPrev: "Предыдущий месяц",
        labelMonthNext: "Следующий месяц",
        labelMonthSelect: "Выберите месяц",
        labelYearSelect: "Выберите год",
        container: '#pickadatecontainer'

    });
    var picker = $(control).pickadate('picker');
    picker.set('select', eventDateTime);
    //TimeInput
    $('<label>').addClass("col-md-2 small text-primary control-label").attr("for", "time").css("padding-right", "0px").css("margin-top", "6").html("Время:").appendTo(wrapper);
    var controlContainer = $('<div>').addClass("col-md-4").css("padding-left", "0px").appendTo(wrapper);
    var control = $('<input>').attr("type", "text").attr("disabled", "disabled").css("cursor", "default").attr("id", "time").addClass("form-control input-sm").attr("checknotneed", "checknotneed").appendTo(controlContainer);
    control.pickatime({
        format: 'HH:i',
        interval: 15,
        min: [6, 30],
        max: [20, 0],
        clear: ''
    });
    var picker = $(control).pickatime('picker');
    picker.set('select', [eventDateTime.getHours(), eventDateTime.getMinutes()]);

    //Менеджер
    $('<div>').addClass("header").text("Менеджер:").css("margin-top", 5).css("margin-bottom", 0).appendTo(container);
    var table = $('<table>').css("width", "100%").css("border-collapse", "separate").css("border-spacing", "5px").appendTo(container);
    var tr = $('<tr>').appendTo(table);
    var td = $('<td>').addClass("header").appendTo(tr);
    var eventManagerName = $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").attr("checknotneed", "checknotneed").css("cursor", "default").val(_event["manager__siteuser__alias"]).attr("title", _event["manager__alias"]).appendTo(td);
    if (_event["user"]["type"] == "admin") {
        eventManagerName.css("cursor", "pointer");
        eventManagerName.click(function () {
            ShowUser(_event["manager__siteuser__id"]);
        });
        var td = $('<td>').addClass("header").css("width", "40px").attr("title", "Сменить менеджера мероприятия").appendTo(tr);
        var editManager = $('<button>').addClass("btn").appendTo(td);
        $('<span>').addClass("glyphicon glyphicon-pencil").css("color", "#337ab7").appendTo(editManager);
        editManager.click(function () {
            ShowManagerEdit(_event["id"], eventManagerName);
        });
    }

    //Компания
    var companyLabel = $('<div>').addClass("header").text("Компания:").css("margin-top", 5).css("margin-bottom", 0).appendTo(container);
    var companyInfoTable = $('<table>').css("width", "100%").css("border-collapse", "separate").css("border-spacing", "5px").appendTo(container);
    tr = $('<tr>').appendTo(companyInfoTable);
    var companyNameTd = $('<td>').addClass("header").appendTo(tr);
    var goToCompanyButton = $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").css("cursor", "pointer").val(_event["company__name"]).attr("title", _event["company__name"]).appendTo(companyNameTd);

    var companyInfoTd = $('<td>').addClass("header").css("width", "40px").attr("title", "Просмотр данных компании").appendTo(tr);
    var companyInfoButton = $('<button>').addClass("btn").appendTo(companyInfoTd);
    $('<span>').addClass("glyphicon glyphicon-info-sign").css("color", "#337ab7").appendTo(companyInfoButton);
    companyInfoTd.click(function () {
        EditCompany(false, _event["company__id"], true, true);
    });
    td = $('<td>').addClass("header").css("width", "40px").appendTo(tr);
    td.click(function () {
        GoToYaAdress( _event["company__city__name"], _event["companyAdress"]);
    });
    var button = $('<button>').addClass("btn").attr("title", "Показать на карте").appendTo(td);
    $('<span>').addClass("glyphicon glyphicon-road").css("color", "#337ab7").appendTo(button);

    var artistDataEditTd = $('<td>').addClass("header").css("width", "40px").attr("title", "Редактировать данные компании для артиста").appendTo(tr);
    var presentatorDataButton = $('<button>').addClass("btn").appendTo(artistDataEditTd );
    $('<span>').addClass("glyphicon glyphicon-pencil").css("color", "#337ab7").appendTo(presentatorDataButton);



    switch(_status){
        case "crash":
            $('<div>').addClass("event-text-label").text(_event["crash"]).prependTo(container);
            $('<div>').addClass("event-header-text-label").text("Слет мероприятия: ").prependTo(container);
            break;
        case "removed":

            $('<div>').addClass("event-text-label").text(_event["removedDescription"]).prependTo(container);
            $('<div>').addClass("event-header-text-label").css("color", "#42aebf").text("Мероприятие удалено: ").prependTo(container);
            break;
        default:
        break;
    }
    //Звонки
    var noteLabel = $('<div>').addClass("header").text("Отзвоны:").appendTo(container);
    var callsContainer = $('<div>').appendTo(container);

    var callContainer = $('<div>').css("margin-bottom", 5).css("text-align", "left").appendTo(callsContainer);
    var button = $('<button>').addClass("btn").attr("title", "Отзвон за день").css("margin-right", 5).css("position", "relative").css("top", -2).appendTo(callContainer);
    var callInput = $('<input>').attr("readonly", "readonly").css("cursor", "default").css("border-radius", 5).css("width", "92%").css("border-style", "groove").addClass("form-input", "input-lg").appendTo(callContainer);
    ReturnCallStatusIconStyle(_event["events_calls_data"], _event["startTime"], 1, button, false, callInput);

    var callContainer = $('<div>').css("margin-bottom", 5).css("text-align", "left").appendTo(callsContainer);
    var button = $('<button>').addClass("btn").attr("title", "Отзвон за неделю").css("margin-right", 5).css("position", "relative").css("top", -2).appendTo(callContainer);
    var callInput = $('<input>').attr("readonly", "readonly").css("cursor", "default").css("border-radius", 5).css("width", "92%").css("border-style", "groove").addClass("form-input", "input-lg").appendTo(callContainer);
    ReturnCallStatusIconStyle(_event["events_calls_data"], _event["startTime"], 7, button, false, callInput);

    var callContainer = $('<div>').css("margin-bottom", 5).css("text-align", "left").appendTo(callsContainer);
    var button = $('<button>').addClass("btn").attr("title", "Отзвон за месяц").css("margin-right", 5).css("position", "relative").css("top", -2).appendTo(callContainer);
    var callInput = $('<input>').attr("readonly", "readonly").css("cursor", "default").css("border-radius", 5).css("width", "92%").css("border-style", "groove").addClass("form-input", "input-lg").appendTo(callContainer);
    ReturnCallStatusIconStyle(_event["events_calls_data"], _event["startTime"], 30, button, false, callInput);


    var noteLabel = $('<div>').addClass("header").text("Примечание менеджера:").appendTo(container);
    var managerNote = $('<textarea>').addClass("form-control input-sm").attr("rows", 3).attr("id", idStartText + "note").attr("checknotneed", "checknotneed").attr("placeholder", "Примечание менеджера").css("resize", "none").val(_event['note']).appendTo(container);

    var noteLabel = $('<div>').addClass("header").text("Примечание артиста:").appendTo(container);
    var artistNote = $('<textarea>').addClass("form-control input-sm").attr("rows", 3).attr("id", idStartText + "artistNote").attr("checknotneed", "checknotneed").attr("placeholder", "Примечание артиста").css("resize", "none").val(_event['artistNote']).appendTo(container);


    var countPrecendChildSection = $('<table>').css("width", "100%").css("border-collapse", "separate").css("border-spacing", "5px").appendTo(container);
    tr = $('<tr>').appendTo(countPrecendChildSection);
    td = $('<td>').appendTo(tr);
    var labelContainer = $('<div>').addClass("header").css("font-size", 13).appendTo(td);
    $('<label>').text("Стоимость").attr("for", idStartText + "price").appendTo(labelContainer);
    td = $('<td>').appendTo(tr);
    var labelContainer = $('<div>').addClass("header").css("font-size", 13).appendTo(td);
    $('<label>').text("Число детей").attr("for", idStartText + "childCount").appendTo(labelContainer);
    td = $('<td>').appendTo(tr);
    var labelContainer = $('<div>').addClass("header").css("font-size", 13).appendTo(td);
    $('<label>').text("Процент учреждению").attr("for", idStartText + "percent").appendTo(labelContainer);


    tr = $('<tr>').appendTo(countPrecendChildSection);
    td = $('<td>').addClass("header").appendTo(tr);
    var formDivContainer = $('<div>').css("margin-bottom", "0px").addClass("form-group").appendTo(td);
    var price = $('<input>').addClass("form-control input-sm").attr("autocomplete", "off").attr("id", idStartText + "price").attr("placeholder", "Стоимость").attr("required", "required").attr("numericonly", "numericonly").val(_event["price"]).appendTo(formDivContainer);
    td = $('<td>').addClass("header").appendTo(tr);
    var formDivContainer = $('<div>').css("margin-bottom", "0px").addClass("form-group").appendTo(td);
    var childCount = $('<input>').addClass("form-control input-sm").attr("autocomplete", "off").attr("id", idStartText + "childCount").attr("placeholder", "Число детей").attr("required", "required").attr("numericonly", "numericonly").val(_event["childCount"]).appendTo(formDivContainer);
    td = $('<td>').addClass("header").appendTo(tr);
    var formDivContainer = $('<div>').css("margin-bottom", "0px").addClass("form-group").appendTo(td);
    var percent = $('<input>').attr("autocomplete", "off").addClass("form-control input-sm").attr("numericonly", "numericonly").attr("id", idStartText + "percent").attr("required", "required").attr("placeholder", "Процент учреждению").appendTo(formDivContainer);
    if (_event["percent"]) {
        percent.val(_event["percent"] + " %");
    }


    var resultSection = $('<table>').css("width", "100%").css("border-collapse", "separate").css("border-spacing", "5px").appendTo(container);
    tr = $('<tr>').appendTo(resultSection);
    td = $('<td>').appendTo(tr);
    var labelContainer = $('<div>').addClass("header").css("font-size", 13).appendTo(td);
    $('<label>').text("Итоговая сумма").attr("for", idStartText + "resultSum").appendTo(labelContainer);
    td = $('<td>').appendTo(tr);
    var labelContainer = $('<div>').addClass("header").css("font-size", 13).appendTo(td);
    $('<label>').text("Перечислено").attr("for", idStartText + "sumTransfered").appendTo(labelContainer);

    tr = $('<tr>').appendTo(resultSection);
    td = $('<td>').addClass("header").appendTo(tr);

    var formDivContainer = $('<div>').css("margin-bottom", "0px").addClass("form-group").appendTo(td);
    var resultSum = $('<input>').attr("autocomplete", "off").addClass("form-control input-sm").attr("id", idStartText + "resultSum").attr("required", "required").attr("numericonly", "numericonly").attr("placeholder", "Итоговая сумма").val(_event["resultSum"]).appendTo(formDivContainer);

    td = $('<td>').addClass("header").appendTo(tr);
    var formDivContainer = $('<div>').css("margin-bottom", "0px").addClass("form-group").appendTo(td);
    var sumTransfered = $('<input>').addClass("form-control input-sm").attr("autocomplete", "off").attr("required", "required").attr("numericonly", "numericonly").attr("id", idStartText + "sumTransfered").attr("placeholder", "Перечисленная сумма").val(_event["sumTransfered"]).appendTo(formDivContainer);


    $('<div>').addClass("header").text("Чат").css("margin-top", 5).css("margin-bottom", 0).appendTo(container);
    table = $('<table>').css("width", "100%").css("border-collapse", "collapse").css("border", "1px solid #cccccc").appendTo(container);
    tr = $('<tr>').appendTo(table);
    td = $('<td>').appendTo(tr);
    $('<input>').val(_event["last_artist_chat_message"]["message"]).attr("title", "Артист: " + _event["last_artist_chat_message"]["sender__alias"] + ": " + _event["last_artist_chat_message"]["message"]).addClass("form-control input-sm").attr("id", "lastArtistMessage").attr("readonly", "readonly").attr("placeholder", "Последнее сообщение артиста отсутствует").css("background-color", "rgba(35, 177, 0, 0.3)").css("width", "98%").appendTo(td);
    td = $('<td>').attr("rowspan", "2").css("width", "40px").appendTo(tr);
    button = $('<button>').addClass("btn").css("height", "45px").css("width", "55px").css("margin-right", "5px").attr("title", "Написать сообщение в чат").appendTo(td);

    $('<span>').addClass("glyphicon glyphicon-plus").css("color", "#337ab7").appendTo(button);
    switch (_event["user"]["type"]) {
        case "admin":
            button.click(function () {
                AddChatMessage(_event["id"], "Event", $("#lastManagerMessage"));
            });
            break;
        case "manager":
            button.click(function () {
                AddChatMessage(_event["id"], "Event", $("#lastManagerMessage"));
                artistNote.attr("readonly", "readonly");
            });
            break;
        case "presentator":
            button.click(function () {
                AddChatMessage(_event["id"], "Event", $("#lastArtistMessage"));
            });
            managerNote.attr("readonly", "readonly");
            break;
    }
    var tr = $('<tr>').appendTo(table);
    var td = $('<td>').addClass("header").appendTo(tr);
    $('<input>').val(_event["last_manager_chat_message"]["message"]).attr("title", "Менеджер: " + _event["last_manager_chat_message"]["sender__alias"] + ": " + _event["last_manager_chat_message"]["message"]).addClass("form-control input-sm").attr("readonly", "readonly").attr("id", "lastManagerMessage").attr("placeholder", "Последнее сообщение менеджера отсутствует").css("background-color", "rgba(36, 138, 210, 0.3)").css("width", "98%").appendTo(td);




    switch (_event["user"]["type"]) {
        case "admin":
            goToCompanyButton.click(function () {
                GoToCompanyPage(_event["company__id"]);
            });
            presentatorDataButton.click(function () {
                ShowPresentatorCompanyDataEdit(_event["id"], false, "admin", true);
            });

            break;
        case "manager":
            goToCompanyButton.click(function () {
                GoToCompanyPage(_event["company__id"]);
            });
            presentatorDataButton.click(function () {
                ShowPresentatorCompanyDataEdit(_event["id"], false, "admin", true);
            });
            break;
        case "presentator":
            if(_status != "crash"){
                noteLabel.css("text-align", "center");
            }

            companyLabel.text("Данные компании").css("text-align", "center");
            companyInfoTable.attr("width", "100%");
            tr = $('<tr>').prependTo(companyInfoTable);
            td = $('<td>').attr("colspan", "2").appendTo(tr);
            $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").css("cursor", "default").attr("title", _event["companyName"]).val(_event["companyName"]).appendTo(td);

            $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").css("cursor", "default").attr("title", _event["companyAdress"]).val(_event["companyAdress"]).appendTo(companyNameTd);
            tr = $('<tr>').appendTo(companyInfoTable);
            td = $('<td>').attr("colspan", "2").appendTo(tr);
            $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").css("cursor", "default").attr("title", _event["companyContacts"]).val(_event["companyContacts"]).appendTo(td);

            companyInfoButton.remove();
            goToCompanyButton.remove();
            presentatorDataButton.remove();
            companyInfoTd.remove();
            artistDataEditTd.remove();
            break;
    }
    $('<div>').addClass("events_date_label-decoration").css("margin-top", "25px").text("Дата добавления мероприятия:").appendTo(container);
    $('<div>').addClass("events_date_label-decoration").html(ConvertDateTimeToDateLabel(ConvertOnlyDateFromStringValue(_event["statsdt"], true), "date")).appendTo(container);

    return container;
}
//Events History functions:
function ShowEventsHistory(_company, _show, _companyName, _toStats) {
    _show = _show || GetCurrentChoosenShow();
    //Берем код шоу, используя элемент с CSS классом "active"
    var modalWindowHeader = "История мероприятий";
    if (_companyName) {
        modalWindowHeader += ": " + _companyName;
    }
    var modalContent = $('<div>');
    var modalContentPaginator = $('<div>').css("margin-bottom", "5px").appendTo(modalContent);
    var modalContentData = $('<div>').appendTo(modalContent);

    showModalWindow_new("cancel", modalWindowHeader, modalContent);

    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};
    var options = {};

    urls["pages_count"] = "/aj_events_list/";
    urls["content"] = "/aj_events_list/";

    if(_toStats) {
        params["stats"] = true;
        params["from"] = ConvertDateTimeToPythonType($('#rangeFrom').datepicker("getDate"));
        params["to"] = ConvertDateTimeToPythonType($('#rangeTo').datepicker("getDate"));
        params["siteuser"] = $('#statsUser').val();
        params["show_id"] = $('#statsArtist').val();
        params["city__id"] = $('#statsCity').val();
    }else {
        params["company_id"] = _company;
        params["show_id"] = _show;
    }
    containers["paginator"] = modalContentPaginator;
    containers["content"] = modalContentData;

    functions["get_page_data"] = ShowEventsHistory_Content;

    var paginator = new Paginator(containers, urls, params, functions, options);
    paginator.Create();
    return;
}
function ShowEventsHistory_Content(_container, _data) {
    var table = $('<table>').addClass("table table-bordered text-in-table modal_window_list").appendTo(_container);
    for (var i = 0; i < _data.length; i++) {
        var tr = $('<tr>').addClass("modal-tr modal-window-content").css("background", HexToRGB(_data[i]["artist__color"], 0.4)).appendTo(table);
        if(!_data[i]["own"]){
            tr.css("opacity", "0.7");
        }
        var td = $('<td>').css("background-color", "white").css("color", "black").attr("width", '5%').css("max-width", "24px").append(EventStatusIconPick(_data[i]["status"])).appendTo(tr);
        var tdEventCreateDate = $('<td>').css("max-width", "105px").attr("title", "Дата назначения недоступна").appendTo(tr);
        var tdEventDate = $('<td>').css("max-width", "105px").attr("title", "Дата выполнения недоступна").appendTo(tr);
        var td = $('<td>').css("max-width", "163px").text(_data[i]["manager__siteuser__alias"]).attr("title", _data[i]["manager__siteuser__alias"]).attr("width", '35%').appendTo(tr);

        var tdResultSum = $('<td>').css("max-width", "70px").attr("width", '15%').attr("title", "Итоговая сумма недоступна").appendTo(tr);
        if(_data[i]["status"] != "alien")
        {
            tdEventCreateDate.append(ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["data"]["statsdt"]))).attr("title", "Назначен: " + ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["data"]["statsdt"]), true));
            tdEventDate.append(ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["data"]["startTime"]))).attr("title", "Выполнение: " + ConvertDateToCountDownValue(ConvertDateFromStringValue(_data[i]["data"]["startTime"]), true));
            tdResultSum.text(_data[i]["data"]["resultSum"]).attr("title", "Итоговая сумма");
        }
        (function (x) {
            tr.click(function () {
                ShowEvent(x["id"]);
            })
        })(_data[i]);
    }
    ChangeModalListFontSize();
    return;
}
//Events Call functions
function CreateOldCalEventDecoration(_event, _calType, _calOption){
    var contentDiv = $('<div>').addClass("oldcal-show_in_table-container_decoration").attr("data-id", _event["id"]).css("height", "37px").css("background-color", HexToRGB(_event["artist__color"], 0.6));
    if (LargeFontNeed()) {
        $(contentDiv).css("font-size", "14px").css("heigt", "auto");
    }
    if(!_event["own"]){
        contentDiv.css("opacity", "0.5");
    }
    var contentTable = $('<table>').addClass("oldcal-show_in_table-table_decoration").appendTo(contentDiv);
    var contentTr = $('<tr>').appendTo(contentTable);
    var contentTd = $('<td>').addClass("oldcal-show_in_table-icon_container_decoration").appendTo(contentTr);
    contentTd.append(ReturnEventStatusIconSpan(_event).addClass("oldcal-show_in_table-icon_decoration"));
    if(_event["status"] == "crash"){
        var contentTd = $('<td>').text("СЛЕТЕЛО! " + ConvertDateFromStringValue(_event["startTime"], "strtime")).css("color", "red").attr("title", "СЛЕТ").addClass("oldcal-show_in_table-time_container_decoration").appendTo(contentTr);
    }else if(_event["status"] == "removed"){
        var contentTd = $('<td>').text("УДАЛЕНО! " + ConvertDateFromStringValue(_event["startTime"], "strtime")).css("color", "#337ab7").addClass("oldcal-show_in_table-time_container_decoration").appendTo(contentTr);
    }
    else{
        var contentTd = $('<td>').text(ConvertDateFromStringValue(_event["startTime"], "strtime")).addClass("oldcal-show_in_table-time_container_decoration").appendTo(contentTr);
    }
    contentTd.css("font-size", 12);
    var contentTr = $('<tr>').appendTo(contentTable);
    var contentTd = $('<td>').attr("colspan", 2).css("overflow", "hidden").addClass("oldcal-show_in_table-content_container_decoration").appendTo(contentTr);
    contentTd.attr("data-user", _event["manager__siteuser__alias"]).attr("data-company", _event["companyName"]).attr("data-show", _event["artist__name"]).attr("data-adress", _event["companyAdress"]);
    contentTd.css("font-size", 13).text(_event["manager__alias"]).attr("title", _event["manager__alias"]);
    if(_event["log_count"] != 0){
        $('<div>').addClass("logscount-label event-oldcal-logscount").attr("title", "Число непросмотренных событий").text(_event["log_count"]).appendTo(contentDiv);
    }
    if(_event["chat_messages_count"]){
        var messagesLabel = $('<div>').addClass("logscount-label event-oldcal-chatmessagescount glyphicon glyphicon-envelope").attr("title", "Есть непрочитанные сообщения чата").appendTo(contentDiv);
        if(_event["log_count"] == 0){
            messagesLabel.css("left", "90%").css("top", "-33px");
        }
    }
    switch (_calOption) {
        case "user":
            contentTd.text(_event["manager__siteuser__alias"]).attr("title", _event["manager__siteuser__alias"]);
            break;
        case "company":
            contentTd.text(_event["companyName"]).attr("title", _event["companyName"]);
            break;
        case "show":
            contentTd.text(_event["artist__name"]).attr("title", _event["artist__name"]);
            break;
        case "adress":
            contentTd.text(_event["companyAdress"]).attr("title", _event["companyAdress"]);
            break;
    }

        $(contentDiv).mouseup(function(e){
            e.preventDefault();
            if(e.which == 3){
                ShowPresentatorCompanyDataEdit($(this).attr("data-id"), true, GetCurrentUserType());
            }

        });
        return contentDiv;
    }
function CreateMyCal_WeekEventDecoration(_event, _calType, _calOption){
    var contentDiv = $('<div>').attr("data-id", _event["id"]).css("border", "1px solid white").addClass("oldcal-show_in_table-container_decoration").css("background-color", HexToRGB(_event["artist__color"], 0.6)).css("margin-left", 0).css("float", "left").css("margin-bottom", 0).css("max-height", 34);
    if (LargeFontNeed()) {
        $(contentDiv).css("font-size", "14px").css("heigt", "auto");
    }
    if (_event["log_count"] != 0 || _event["chat_messages_count"]) {
        contentDiv.addClass("event-mycalweek-haveevents").attr("title", "Есть непросмотренные уведомления");
    }

    var contentTable = $('<table>').addClass("oldcal-show_in_table-table_decoration").appendTo(contentDiv);
    var contentTr = $('<tr>').appendTo(contentTable);
    var contentTd = $('<td>').addClass("oldcal-show_in_table-icon_container_decoration").appendTo(contentTr);
    contentTd.append(ReturnEventStatusIconSpan(_event).addClass("oldcal-show_in_table-icon_decoration"));
    if(_event["status"] == "crash"){
        var contentTd = $('<td>').text("СЛЕТЕЛО!").css("color", "red").attr("title", "СЛЕТ").addClass("oldcal-show_in_table-time_container_decoration").appendTo(contentTr);
    }else if(_event["status"] == "removed"){
        var contentTd = $('<td>').text("УДАЛЕНО!").css("color", "#337ab7").addClass("oldcal-show_in_table-time_container_decoration").appendTo(contentTr);
    }else{
        var contentTd = $('<td>').text(TransformDateFromEvent(_event, "strtime")).addClass("oldcal-show_in_table-time_container_decoration").appendTo(contentTr);
    }

    var contentTr = $('<tr>').appendTo(contentTable);
    var contentTd = $('<td>').attr("colspan", 2).css("overflow", "hidden").addClass("oldcal-show_in_table-content_container_decoration").appendTo(contentTr);
    contentTd.text(_event["companyName"]).attr("title", _event["companyName"]);

    $(contentDiv).mouseup(function (e) {
        if (e.which == 3) {
            ShowPresentatorCompanyDataEdit($(this).attr("data-id"), true, GetCurrentUserType());
        }

    });
    $(contentDiv).contextmenu(function (e) {
        e.preventDefault();
    });
    return contentDiv;
}
function CreateInListEventDecoration(_data, _calType, _calOption) {
    var _event = _data["event"];
    var eventsTr = $('<tr>').addClass("event_in_frame-decoration").attr("data-id", _event["id"]);
    if (LargeFontNeed()) {
        $(eventsTr).css("font-size", "14px");
    }
    if(!_event["own"]){
        eventsTr.css("opacity", "0.5");
    }
    (function (_id) {
        eventsTr.click(function () {
           ShowEvent(_id);
        });
    })(_event["id"]);
    eventsTr.css("background-color", HexToRGB(_event["artist__color"], 0.4));
    var eventDateTime = ConvertDateFromStringValue(_event["startTime"], "full");
    var totalWidth = 100;
    switch (_calType) {
        case "datelist":
            switch (_calOption) {
                case "year":
                    $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("width", "15%").text(eventDateTime.getDate() + " " + ConvertMonthFromNumberToName(eventDateTime.getMonth(), false, true)).attr("title", "Дата").appendTo(eventsTr);
                    totalWidth -= 15;
                    break;
                case "month":
                    $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("width", "5%").text(eventDateTime.getDate()).attr("title", "Число").appendTo(eventsTr);
                    totalWidth -= 5;
                    break;
                case "range":
                    $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("width", "15%").text(eventDateTime.getDate() + " " + ConvertMonthFromNumberToName(eventDateTime.getMonth(), false, true) + " " + eventDateTime.getFullYear()).attr("title", "Дата").appendTo(eventsTr);
                    totalWidth -= 15;
                    break;

            }
            break;
        case "fulllist":
            $('<td>').css("font-weight", "bold").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("width", "15%").text(eventDateTime.getDate() + " " + ConvertMonthFromNumberToName(eventDateTime.getMonth(), false, true) + " " + eventDateTime.getFullYear()).attr("title", "Дата").appendTo(eventsTr);
            $('<td>').attr("title", "Число");
            totalWidth -= 15;
            break;

    }

    var statusIcon = ReturnEventStatusIconSpan(_event).css("margin-right", 3);
    if (statusIcon.attr("data-status") == "alien") {
        eventsTr.css("opacity", 0.5)
    }
    if(_event["status"] == "crash"){
        var contentTd = $('<td>').css("font-weight", "bold").text("СЛЕТЕЛО! ").css("width", "8%").css("color", "red").attr("title", "СЛЕТ").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").append(statusIcon).append($('<span>').text(eventDateTime.getHours() + ":" + ConvertDateComponentTo2CharsFormat(eventDateTime.getMinutes())).attr("title", "Время")).appendTo(eventsTr);
    }else if(_event["status"] == "removed"){
        var contentTd = $('<td>').css("font-weight", "bold").text("УДАЛЕНО! ").css("width", "8%").css("color", "#337ab7").addClass("event_in_frame-td-decoration event_in_frame_date-decoration").append(statusIcon).append($('<span>').text(eventDateTime.getHours() + ":" + ConvertDateComponentTo2CharsFormat(eventDateTime.getMinutes())).attr("title", "Время")).appendTo(eventsTr);
    }else {
        $('<td>').addClass("event_in_frame-td-decoration event_in_frame_date-decoration").css("font-weight", "bold").css("width", "8%").append(statusIcon).append($('<span>').text(eventDateTime.getHours() + ":" + ConvertDateComponentTo2CharsFormat(eventDateTime.getMinutes())).attr("title", "Время")).appendTo(eventsTr);

    }
    totalWidth -= 8;
    $('<td>').addClass("event_in_frame-td-decoration").text(_event["manager__siteuser__alias"]).attr("title", _event["manager__siteuser__alias"]).css("width", "15%").css("font-weight", "bold").appendTo(eventsTr);
    totalWidth -= 15;
    $('<td>').addClass("event_in_frame-td-decoration").text(_event["company__city__name"]).attr("title", _event["company__city__name"]).css("width", "10%").appendTo(eventsTr);
    totalWidth -= 10;
    $('<td>').addClass("event_in_frame-td-decoration").text(_event["companyName"]).attr("title", _event["companyName"]).appendTo(eventsTr);

    $('<td>').addClass("event_in_frame-td-decoration").text(_event["artist__name"]).attr("title", _event["artist__name"]).appendTo(eventsTr);
    totalWidth -= 8;
    var buttons = $('<td>').css("text-align", "right").css("width", "240px").addClass("event_in_frame-td-decoration").appendTo(eventsTr);
    if (_event["own"]) {
        //Кнопки чата
        var addChatMessageButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Написать сообщение в чат мероприятия").css("height", 18).css("width", 10).css("margin-right", 5).css("color", "#337ab7").appendTo(buttons);
        $('<span>').addClass("glyphicon glyphicon-plus").css("color", "inherit").css("top", "-3px").css("left", -6).appendTo(addChatMessageButton);
        var showChatButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Открыть чат мероприятия").css("height", 18).css("width", 10).css("margin-right", 10).css("color", "#337ab7").appendTo(buttons);
        $('<span>').addClass("glyphicon glyphicon-list").css("color", "inherit").css("top", "-3px").css("left", -6).appendTo(showChatButton);
        if ("chat_messages_count" in _event) {
            showChatButton.attr("title", showChatButton.attr("title") + ": " + _event["chat_messages_count"] + " непрочитанных сообщений");
            $('<div>').text(_event["chat_messages_count"]).css("color", "white").css("background-color", "red").css("width", 8).css("height", 8).css("border-radius", "10px").css("position", "relative").css("top", "-11").css("left", "0").css("font-size", "6px").appendTo(showChatButton);
        }

        //Кнопка просмотра изменений мероприятия
        var showEventLogButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Открыть историю изменений мероприятия").css("height", 18).css("width", 10).css("margin-right", 10).css("color", "#337ab7").appendTo(buttons);
        $('<span>').addClass("glyphicon glyphicon-align-justify").css("color", "inherit").css("top", "-3px").css("left", -6).appendTo(showEventLogButton);
        if (_event["log_count"] != 0) {
            showEventLogButton.attr("title", showEventLogButton.attr("title") + ": " + _event["log_count"] + " непросмотренных уведомлений");
            $('<div>').text(_event["log_count"]).css("color", "white").css("background-color", "red").css("width", 8).css("height", 8).css("border-radius", "10px").css("position", "relative").css("top", "-11").css("left", "0").css("font-size", "6px").appendTo(showEventLogButton);
        }
        //Кнопка перехода к учреждению
        var goToCompanyButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Перейти к учреждению").css("height", 18).css("width", 18).css("margin-right", 10).css("color", "#337ab7").appendTo(buttons);
        $('<span>').addClass("glyphicon glyphicon-share-alt").css("color", "inherit").css("top", "-3px").css("left", -6).appendTo(goToCompanyButton);
        (function (_id) {
            goToCompanyButton.click(function(event) {
                event.stopPropagation();
                GoToCompanyPage(_id);
            });
        })(_event["company__id"]);

        var dayCallButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Отзвон за месяц").css("height", 18).css("width", 26).css("margin-right", 15).prependTo(buttons);
        ReturnCallStatusIconStyle(_event["calls_data"], _event["startTime"], 30, dayCallButton, true);
        var weekCallButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Отзвон за неделю").css("height", 18).css("width", 26).css("margin-right", 5).prependTo(buttons);
        ReturnCallStatusIconStyle(_event["calls_data"], _event["startTime"], 7, weekCallButton, true);
        var monthCallButton = $('<button>').addClass("btn btn-sm gray_event_button").attr("title", "Отзвон за день").css("height", 18).css("width", 26).css("margin-right", 5).prependTo(buttons);
        ReturnCallStatusIconStyle(_event["calls_data"], _event["startTime"], 1, monthCallButton, true);
        //ЧАСТНЫЕ ОБРАБОТЧИКИ
        switch (_data["user"]["type"]) {
            case "admin":
                break;
            case "manager":
                break;
            case "presentator":
                goToCompanyButton.remove();
                break;

        }
        //ОБЩИЕ ОБРАБОТЧИКИ


        //Чат
        //Добавить сообщение
        (function (but, evid) {
            but.click(function (event) {
                event.stopPropagation();
                AddChatMessage(evid, "Event");

            });
        })(addChatMessageButton, _event["id"]);


        //Просмотреть историю
        (function (but, evid) {
            but.click(function (event) {
                event.stopPropagation();
                but.children('div').remove();
                ShowChatHistory(evid, "Event");

            });
        })(showChatButton, _event["id"]);

        (function (but, evid) {
            but.click(function (event) {
                event.stopPropagation();
                but.children('div').remove();
                LogsHistory_Paginator("event_history", evid);

            });
        })(showEventLogButton, _event["id"]);


    }
    $(eventsTr).mouseup(function(e){
            e.preventDefault();
            e.stopPropagation();
            if(e.which == 3){
                ShowPresentatorCompanyDataEdit($(this).attr("data-id"), true, GetCurrentUserType());
            }

        });
    eventsTr.contextmenu(function (e) {
        e.preventDefault();
    });
    return eventsTr;
}
function TransformDateFromEvent(_event, _type){
        return ConvertDateFromStringValue(_event["startTime"], _type);
    }
//Events Common functions
function ShowPresentatorCompanyDataEdit(_eventId, _onlyShow, _userType, _editArtistData) {
    if(_userType == "presentator"){
        var _managerData = false;
    }else{
        if(_editArtistData){
            _managerData = false;
        }else{
            var _managerData = true;
        }
    }
    $.post('/aj_events_get_event_data/',
        {
            id: _eventId,
            only_artist_data: "True",
            manager_data: _managerData
        },
        function (response) {
            var data = ResponseToNotify(response);
            if (response["status"] != "data") {
                return;
            }
            var idStartText = "artistCompanyDataEdit_";
            var container = $('<div>');

            if (_managerData) {
                modalWindowHeader = "Полные данные о компании";
                var modalWindowType = "cancel";

                $('<div>').addClass("header").text("Название:").appendTo(container);
                var companyName = $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").attr("title", data["company__name"]).css("cursor", "pointer").val(data["company__name"]).appendTo(container);
                companyName.click(function () {
                    GoToCompanyPage(data["company__id"]);
                });
                $('<div>').addClass("header").text("Адрес:").appendTo(container);
                var companyAdress = $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").attr("title", data["company__adress"]).css("cursor", "pointer").val(data["company__city__name"] + ", " + data["company__adress"]).appendTo(container);
                companyAdress.click(function () {
                    GoToYaAdress(data["company__city__name"], data["companyAdress"]);
                });

                $('<div>').addClass("header").text("Контакты:").appendTo(container);
                $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").attr("title", data["company__contacts"]).val(data["company__contacts"]).appendTo(container);
                $('<div>').addClass("header").text("Телефоны:").appendTo(container);
                $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").attr("title", data["company__telephone"]).val(data["company__telephone"]).appendTo(container);
                $('<div>').addClass("header").text("Сайт:").appendTo(container);
                $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").attr("title", data["company__site"]).val(data["company__site"]).appendTo(container);
                $('<div>').addClass("header").text("Почта:").appendTo(container);
                $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").attr("title", data["company__email"]).val(data["company__email"]).appendTo(container);
                $('<div>').addClass("header").text("Комментарии:").appendTo(container);
                $('<input>').addClass("form-control input-sm").attr("readonly", "readonly").attr("title", data["company__comment"]).val(data["company__comment"]).appendTo(container);

            } else {
                $('<div>').addClass("header").text("Название:").appendTo(container);
                var companyName = $('<input>').addClass("form-control input-sm").attr("id", idStartText + "companyName").attr("placeholder", "Укажите наименование компании для артиста").val(data["companyName"]).appendTo(container);
                $('<div>').addClass("header").text("Адрес:").appendTo(container);
                var companyAdress = $('<input>').addClass("form-control input-sm").attr("id", idStartText + "companyAdress").attr("placeholder", "Укажите адрес компании для артиста").val(data["companyAdress"]).appendTo(container);
                $('<div>').addClass("header").text("Контакты:").appendTo(container);
                var companyContacts = $('<textarea>').addClass("form-control input-sm").attr("rows", 10).css("resize", "none").attr("id", idStartText + "companyContacts").attr("placeholder", "Укажите контакты компании для артиста").text(data["companyContacts"]).appendTo(container);
                var modalWindowHeader = "";
                if (_onlyShow) {
                    modalWindowHeader = "Данные о компании для артиста";
                    var modalWindowType = "cancel";
                    companyName.attr("readonly", "readonly").attr("title", data["companyName"]).attr("placeholder", "Название компании");
                    companyAdress.css("cursor", "pointer").attr("readonly", "readonly").attr("title", "Нажмите чтобы перейти к карте").attr("placeholder", "Адрес компании").val(data["company__city__name"] + ", " + data["companyAdress"]);
                    (function (city, adress) {
                        companyAdress.click(function () {
                            GoToYaAdress(city, adress);
                        })
                    }(data["company__city__name"], data["companyAdress"]));
                    companyContacts.attr("readonly", "readonly").attr("title", data["companyContacts"]);
                } else {
                    modalWindowHeader = "Данные компании отображаемые артисту";
                    modalWindowType = "okcancel";
                }
            }
            var modalWindow = showModalWindow_new(modalWindowType, modalWindowHeader, container, function () {
                $.post('/aj_events_edit_event/',
                    {
                        id: _eventId,
                        artist_data: true,
                        data: GetVariablesFromModalToDict("modalWindow", "artistCompanyDataEdit")

                    },
                    function (response) {
                        var status = ResponseToNotify(response);
                        if (status != "success") {
                            return;
                        }
                        UpdateData(true, true, true);
                        hideModalWindow(modalWindow);
                    }
                );

            });


        });
    return;
}
function ShowManagerEdit(_eventId, _changedField) {

    $.post('/aj_events_get_allowed_managers/',
        {
            id: _eventId
        },
        function (response) {
            var data = ResponseToNotify(response);
            if (response["status"] != "data") {
                return;
            }
            var container = $('<div>');
            var idStartText = "artistEdit_";
            $('<div>').addClass("header").text("Новый менеджер:").appendTo(container);
            var managerSelect = $('<select>').addClass("form-control input-sm").attr("id", idStartText + "manager").appendTo(container);
            for (var i = 0; i < data["list"].length; i++) {
                $('<option>').text(data["list"][i]["siteuser__name"]).val(data["list"][i]["id"]).appendTo(managerSelect);
            }
            var modalWindowHeader = "Новый менеджер мероприятия";
            var modalWindowType = "okcancel";

            var modalWindow = showModalWindow_new(modalWindowType, modalWindowHeader, container, function () {
                $.post('/aj_events_edit_event/',
                    {
                        id: _eventId,
                        new_manager: true,
                        data: GetVariablesFromModalToDict("modalWindow", "artistEdit")
                    },
                    function (response) {
                        var status = ResponseToNotify(response);
                        if (status == "success") {
                            $(_changedField).val(managerSelect.children("option:selected").text()).attr("title", managerSelect.children("option:selected").text());
                            UpdateData(true, true, true);
                            hideModalWindow(modalWindow);
                        }
                    }
                );

            });
            $("#" + idStartText + "manager").select2({//Преобразует элемент управления к Select2 виду
                placeholder: "Выберите менеджера",
                language: "ru"
            });

        });
}
function ShowArtistEdit(_currentArtist, _companyId, _eventId) {
    $.post('/aj_artist_allowed_artists_list/',
        {
            company: _companyId
        },
        function (response) {
            var data = ResponseToNotify(response)["list"];
            var idStartText = "artistEdit_";
            var container = $('<div>');
            $('<div>').addClass("header").text("Выберите шоу:").appendTo(container);
            var selectElem = $('<select>').addClass("form-control input-sm").attr("id", idStartText + "artist").appendTo(container);

            for (var i = 0; i < data.length; i++) {
                var option = $('<option>').text(data[i]["name"]).val(data[i]["id"]).appendTo(selectElem);
                if (data[i]["id"] == _currentArtist) {
                    option.attr("selected", "selected");
                }
            }

            showModalWindow_new("okcancel", "Изменить шоу мероприятия", container, function () {
                $.post('/aj_events_edit_event/',
                    {
                        id: _eventId,
                        new_show: true,
                        data: GetVariablesFromModalToDict("modalWindow", "artistEdit")

                    },
                    function (response) {
                        var status = ResponseToNotify(response);
                        if(status == "success"){
                            UpdateData(true, true, true);;
                            hideAllModalWindows();
                        }
                    }
                );
            });
            $("#artistEdit_artist").select2({//Преобразует элемент управления к Select2 виду
                placeholder: "Выберите шоу.",
                language: "ru"
            });
        });
    return;
}
function AddCrashTransferRemove(_eventData, _action, _abortCrash) {
    var idStartText = "eventAction_";
    var container = $('<div>');
    var modalTitle = "";

    var _eventId = _eventData["id"];
    var eventDateTime = ConvertDateFromStringValue(_eventData["startTime"], "full");

    var postData = {};
    postData["id"] = _eventId;

    switch (_action) {
        case "crash":
            modalTitle = "Отметить слет мероприятия";


            var textContainer = $('<div>').addClass("form-group text-left").appendTo(container);
            $('<label>').addClass("header text-primary control-label").attr("for", idStartText + "crashText").text("Причина слета:").appendTo(textContainer);
            var controlContainer = $('<div>').appendTo(textContainer);
            $('<textarea>').addClass("form-control input-sm").attr("id", idStartText + "crashText").attr("required", "required").attr("placeholder", "Укажите причину слета").attr("rows", 7).css("resize", "none").appendTo(controlContainer);

            var addTaskToggle = $('<div>').appendTo(container);
            var toggleContainer = $('<div>').css("text-align", "left").appendTo(addTaskToggle);
            var removeConfirmToggle = $('<input>').attr("id", "addTaskToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
            var newTaskLabel = $('<span>').addClass("datestamp").text("Новая задача").css("margin-left", "15px").appendTo(toggleContainer);
            $('<br>').appendTo(container);
            //DateTimeRow
            var wrapper = $('<div>').addClass("form-group").css("padding-bottom", "35px").appendTo(container);
            //DateInput
            $('<label>').addClass("col-md-1 small text-primary control-label").attr("for", idStartText + "date").css("padding-right", "0px").css("padding-left", "0px").css("margin-top", "6").html("Дата:").appendTo(wrapper);
            var controlContainer = $('<div>').addClass("col-md-4").css("padding-left", "0px").appendTo(wrapper);
            var control = $('<input>').attr("id", idStartText + "date").attr("disabled", "disabled").addClass("form-control input-sm").appendTo(controlContainer);
            control.pickadate({
                format: "d, mmmm, yyyy",
                clear: '',
                selectYears: true,
                selectMonths: true,
                labelMonthPrev: "Предыдущий месяц",
                labelMonthNext: "Следующий месяц",
                labelMonthSelect: "Выберите месяц",
                labelYearSelect: "Выберите год",
                min: true,
                max: new Date(new Date().getFullYear() + 2, 1, 1),
                container: '#pickadatecontainer'

            });
            var picker = $(control).pickadate('picker');
            picker.set('select', new Date(new Date().getFullYear(), new Date().getMonth() + 2, 1));

            //TimeInput
            $('<label>').addClass("col-md-2 small text-primary control-label").attr("for", idStartText + "time").css("padding-right", "0px").css("margin-top", "6").html("Время:").appendTo(wrapper);
            controlContainer = $('<div>').addClass("col-md-3").css("padding-left", "0px").appendTo(wrapper);
            control = $('<input>').attr("id", idStartText + "time").attr("disabled", "disabled").addClass("form-control input-sm").appendTo(controlContainer);
            control.pickatime({
                format: 'HH:i',
                interval: 15,
                min: [6, 30],
                max: [20, 0],
                clear: ''
            });
            picker = $(control).pickatime('picker');
            picker.set('select', [12, 0]);
            //TaskDescription
            var formWrapper = $('<div>').addClass("form-group").appendTo(container);
            $('<div>').addClass("header small").text("Заголовок задачи:").appendTo(formWrapper);
            $('<input>').addClass("form-control input-sm").attr("disabled", "disabled").attr("id", idStartText + "taskDescription").attr("required", "required").attr("placeholder", "Укажите краткое описание задачи").css("margin-bottom", "10px").val("Позвонить.").appendTo(formWrapper);
            //TaskComment
            var formWrapper = $('<div>').addClass("form-group").appendTo(container);
            $('<div>').addClass("header small").text("Описание задачи:").appendTo(formWrapper);
            $('<textarea>').addClass("form-control input-sm").attr("disabled", "disabled").attr("id", idStartText + "taskComment").attr("rows", 2).attr("placeholder", "Укажите полное описание задачи").css("resize", "none").appendTo(formWrapper);


            var hiddenDataContainer = $('<div>').addClass("form-group").appendTo(container);
            $('<input>').attr("type", "hidden").attr("id", idStartText + "crash").val("True").appendTo(hiddenDataContainer);
            break;
        case "transfer":
            modalTitle = "Перенос мероприятия";
            $('<div>').addClass("header").text("Дата и время переноса:").appendTo(container);

            var dateNow = new Date();
            var hour = 12;
            var minute = 0;

            var wrapper = $('<div>').addClass("form-group").css("padding-bottom", "20px").css("margin-top", 10).appendTo(container);
            //DateInput
            $('<label>').addClass("col-md-1 small text-primary control-label").attr("for", "date").css("padding-right", "0px").css("padding-left", "0px").css("margin-top", "6").html("Дата:").appendTo(wrapper);
            var controlContainer = $('<div>').addClass("col-md-5").css("padding-left", "0px").appendTo(wrapper);
            var control = $('<input>').attr("type", "text").attr("id", idStartText + "date").addClass("form-control input-sm").appendTo(controlContainer);
            control.pickadate({
                format: "d, mmmm, yyyy",
                clear: '',
                selectYears: true,
                selectMonths: true,
                labelMonthPrev: "Предыдущий месяц",
                labelMonthNext: "Следующий месяц",
                labelMonthSelect: "Выберите месяц",
                labelYearSelect: "Выберите год",
                onOpen: onOpenPickADate,
                container: '#pickadatecontainer'

            });
            var picker = $(control).pickadate('picker');
            picker.set('select', eventDateTime);

            //TimeInput
            $('<label>').addClass("col-md-2 small text-primary control-label").attr("for", "time").css("padding-right", "0px").css("margin-top", "6").html("Время:").appendTo(wrapper);
            var controlContainer = $('<div>').addClass("col-md-4").css("padding-left", "0px").appendTo(wrapper);
            var control = $('<input>').attr("type", "text").attr("id", idStartText +  "time").addClass("form-control input-sm").appendTo(controlContainer);
            control.pickatime({
                format: 'HH:i',
                interval: 15,
                min: [6, 30],
                max: [20, 0],
                clear: '',
                onOpen: onOpenPickATime,
                container: '#pickadatecontainer'
            });
            picker = $(control).pickatime('picker');
            picker.set('select', [eventDateTime.getHours(), eventDateTime.getMinutes()]);

            $('<input>').attr("type", "hidden").attr("id", idStartText + "transfer").val("True").appendTo(container);
            break;
        case "remove":
            modalTitle = "Удаление мероприятия";

            var exclamation = $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 15).text("ВНИМАНИЕ!").appendTo(container);
            var exclamation = $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 55).text("Это действие нельзя будет отменить").appendTo(container);

            var removeConfirmToggle = $('<div>').appendTo(container);
            var labelContainer = $('<div>').addClass("col-md-10").css("text-align", "right").appendTo(removeConfirmToggle);
            var toggleContainer = $('<div>').addClass("col-md-2").css("text-align", "right").appendTo(removeConfirmToggle);
            var removeConfirmToggle = $('<input>').attr("id", "removeConfirmToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
            $('<label>').attr("for", "removeConfirmToggle").addClass("text-primary control-label").text("Подтверждение удаления").css("user-select", "none").appendTo(labelContainer);

            $('<div>').css("height", "20px").appendTo(container);
            var textContainer = $('<div>').addClass("form-group text-left").appendTo(container);
            $('<label>').addClass("header text-primary control-label").attr("for", idStartText + "removedDescriptionText").text("Причина удаления:").appendTo(textContainer);
            var controlContainer = $('<div>').appendTo(textContainer);
            $('<textarea>').addClass("form-control input-sm").attr("id", idStartText + "removedDescriptionText").attr("required", "required").attr("placeholder", "Укажите причину удаления").attr("rows", 10).css("resize", "none").appendTo(controlContainer);

            var hiddenDataContainer = $('<div>').addClass("form-group").appendTo(container);
            $('<input>').attr("type", "hidden").attr("id", idStartText + "remove").val("True").appendTo(hiddenDataContainer);



            break;
    }


    if(_abortCrash){
        var modalWindow = showModalWindow_new("okcancel", "Отменить слет мероприятия?", false, function () {
            $.post('/aj_events_edit_event/',
                {
                    id: _eventId,
                    crash: "True",
                    abort_crash: "True"
                },
                    function (response) {
                        ResponseToNotify(response);
                        UpdateData(true, true, true);;
                    }
                );
                hideAllModalWindows();
        }, false, true);
    }else{
        var modalWindow = showModalWindow_new("okcancel", modalTitle, container, function () {
            if (TotalInputsValidator(container)) {
                var variables = $.parseJSON(GetVariablesFromModalToDict("modalWindow", "eventAction"));
                for (var postVar in variables) {
                    postData[postVar] = variables[postVar];
                }
                if(_action == "transfer"){
                    postData["newDateTime"] = $("#" + idStartText +  "date").pickadate('picker').get('select', "yyyy-mm-dd ") + $("#" + idStartText +  "time").pickatime('picker').get('select', 'HH:i');
                }else if(_action == "remove"){
                    postData["remove_confirm"] = $(removeConfirmToggle).prop("checked");
                }else if(_action == "crash"){
                    postData["new_task"] = $('#addTaskToggle').prop("checked");
                    postData["task_datetime"] = $('#eventAction_date').pickadate('picker').get('select', "yyyy-mm-dd ") + $('#eventAction_time').pickatime('picker').get('select', 'HH:i');
                    postData["task_description"] = $('#eventAction_taskDescription').val();
                    postData["task_comment"] = $('#eventAction_taskComment').val();
                }
                $.post('/aj_events_edit_event/',
                    postData,
                    function (response) {
                        var status = ResponseToNotify(response);
                        if(status == "error"){
                            return;
                        }
                        UpdateData(true, true, true);;
                        hideAllModalWindows();
                    }
                );

            }
        });

    }
    
    switch (_action) {
        case "crash":
            DecorateModalWindow(modalWindow, "red");
            break;
        case "transfer":
            DecorateModalWindow(modalWindow, "#337ab7");
            break;
        case "remove":
            DecorateModalWindow(modalWindow, "#42aebf");
            break;
    }
    if(_action == "remove"){
        $(removeConfirmToggle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
    }else if(_action == "crash"){
        $('#addTaskToggle').bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
        $('#addTaskToggle').change(function () {
            if ($('#addTaskToggle').prop("checked")) {
                $('#eventAction_date').removeAttr("disabled");
                $('#eventAction_time').removeAttr("disabled");
                $('#eventAction_taskDescription').removeAttr("disabled").attr("required", "required");
                $('#eventAction_taskComment').removeAttr("disabled");
            } else {
                $('#eventAction_date').attr("disabled", "disabled");
                $('#eventAction_time').attr("disabled", "disabled");
                $('#eventAction_taskDescription').attr("disabled", "disabled").removeAttr("required");
                $('#eventAction_taskComment').attr("disabled", "disabled");
            }
        });
    }

    return;

}
function EventCallsControl(_eventId) {
    ShowNotify_LoadData();
    $.post("/aj_events_get_event_data/",
        {
            id: _eventId,
            only_calls_data: true
        }, function (response) {

            var data = ResponseToNotify(response);
            if(response["status"] != "data"){
                return;
            }
            var container = $('<form>').addClass("form-horizontal");
            var outerDiv = $('<div>').addClass("form-group").appendTo(container);
            var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
            var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
            var dayLabel = $('<label>').attr("for", "dayCall").addClass("text-primary control-label").text("Нужен отзвон за день").css("user-select", "none").appendTo(labelContainer);
            var dayCallToggle = $('<input>').attr("id", "dayCall").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
            $('<hr>').addClass("company-primary-divider").appendTo(container);

            var outerDiv = $('<div>').addClass("form-group").appendTo(container);
            var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
            var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
            var weekLabel = $('<label>').attr("for", "weekCall").addClass("text-primary control-label").text("Нужен отзвон за неделю").css("user-select", "none").appendTo(labelContainer);
            var weekCallToggle = $('<input>').attr("id", "weekCall").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
            $('<hr>').addClass("company-primary-divider").appendTo(container);

            var outerDiv = $('<div>').addClass("form-group").appendTo(container);
            var labelContainer = $('<div>').addClass("col-md-9").css("text-align", "left").appendTo(outerDiv);
            var toggleContainer = $('<div>').addClass("col-md-3").css("text-align", "right").css("margin-top", "7px").appendTo(outerDiv);
            var monthLabel = $('<label>').attr("for", "monthCall").addClass("text-primary control-label").text("Нужен отзвон за месяц").css("user-select", "none").appendTo(labelContainer);
            var monthCallToggle = $('<input>').attr("id", "monthCall").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);

            switch(data["day"]) {
                case "done":
                    dayCallToggle.attr("checked", "checked").attr("disabled", "disabled");
                    dayLabel.css("color", "green").text("Отзвон за день выполнен");
                    break;
                case "need":
                    dayCallToggle.attr("checked", "checked");
                    break;
            }
            switch(data["week"]) {
                case "done":
                    weekCallToggle.attr("checked", "checked").attr("disabled", "disabled");
                    weekLabel.css("color", "green").text("Отзвон за неделю выполнен");
                    break;
                case "need":
                    weekCallToggle.attr("checked", "checked");
                    break;
            }
            switch(data["month"]) {
                case "done":
                    monthCallToggle.attr("checked", "checked").attr("disabled", "disabled");
                    monthLabel.css("color", "green").text("Отзвон за месяц выполнен");
                    break;
                case "need":
                    monthCallToggle.attr("checked", "checked");
                    break;
            }
            $(dayCallToggle).bootstrapToggle({
                on: "Да",
                off: "Нет",
                size: "small",
                offstyle: "danger",
                onstyle: "success"
            });
            $(weekCallToggle).bootstrapToggle({
                on: "Да",
                off: "Нет",
                size: "small",
                offstyle: "danger",
                onstyle: "success"
            });
            $(monthCallToggle).bootstrapToggle({
                on: "Да",
                off: "Нет",
                size: "small",
                offstyle: "danger",
                onstyle: "success"
            });

            var modalWindow = showModalWindow_new("okcancel", "Управление отзвонами", container, function () {
                $.post("/aj_events_edit_event/", {
                    id: _eventId,
                    only_call_data: true,
                    day: $(dayCallToggle).prop("checked"),
                    week: $(weekCallToggle).prop("checked"),
                    month: $(monthCallToggle).prop("checked")
                }, function(response){
                    ResponseToNotify(response);
                    hideModalWindow(modalWindow);
                });
            });
        }
    );
    return;
}
function EventManagerPercentControl(_eventId, _currentPercent) {
    var container = $('<div>');
    var wrapper = $('<div>').addClass("form-group").css("padding-bottom", "20px").appendTo(container);
    $('<div>').addClass("header").text("Процент менеджера:").appendTo(wrapper);
    var percent = $('<input>').attr("autocomplete", "off").addClass("form-control input-sm").attr("numericonly", "numericonly").attr("id", "managerPercent").attr("required", "required").attr("placeholder", "Процент менеджера").val(_currentPercent).appendTo(wrapper);

    var modalWindow = showModalWindow_new("okcancel", "Управление процентом менеджера", container, function () {
        if(TotalInputsValidator(container)){
            $.post('/aj_events_edit_event/', {
                id: _eventId,
                only_manager_percent: 1,
                managerPercent: $('#managerPercent').val()
            }, function (response) {
                if(ResponseToNotify(response) != "success"){
                    return;
                }
                hideAllModalWindows();
            });
        }
    });
    return;
}

function FillPresentatorsHeadPanel(_presentatorsData, _onlyFrame, _onlyEvents) {
    if(!_onlyEvents){
        if($('#choosePanel').length > 0){
            var spanContainer = $('<span>').css("margin-left", 15).css("width", 500).appendTo($('#choosePanel'));
            var label = $('<label>').addClass("small text-primary control-label").css("font-weight", "bold").css("margin-right", 5).text("Артист:").appendTo(spanContainer);
            var selectElem = $('<select>').attr("id", "selectPresentator").css("width", 350).appendTo(spanContainer);
        }else{
            var liElem = $('<li>').appendTo($('#addedNavbarElements'));
            var aElem = $('<a>').addClass("presentators-select").css("width", "390px").appendTo(liElem);
            var label = $('<label>').addClass("small text-primary control-label").css("font-weight", "bold").text("Артист:").appendTo(aElem);
            var selectElem = $('<select>').attr("id", "selectPresentator").appendTo(aElem);
        }


        var presentatorsArray = [];
    }
    if(!_onlyFrame){
        for (var i = 0; i < _presentatorsData.length; i++) {
            var arrayItem = {};
            arrayItem["id"] = _presentatorsData[i]["id"];
            arrayItem["text"] = _presentatorsData[i]["siteuser__alias"];
            presentatorsArray.push(arrayItem);
        }
        $(selectElem).select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Артист",
            language: "ru",
            data: presentatorsArray,
            dropdownAutoWidth: true,
            width: "resolve"
        });
        if (presentatorsArray.length != 0) {
            $(selectElem).val(presentatorsArray[0]["id"]).trigger('change');
        }
        $(selectElem).change(function () {
            UpdateData(true, true);
        });
    }
    if(_onlyFrame){
        $(selectElem).select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Артист",
            language: "ru",
            data: presentatorsArray,
            dropdownAutoWidth: true,
            width: "resolve"
        });
    }
    return;
}
function LoadPresentatorsHeadPanel(_updateOnly){
    ContainerLoadIndicatorShow($('#selectPresentator').next());
    $.post('/aj_events_load_presentators_list/', {
        city_id: GetCurrentChoosenCity(),
        show_id: GetCurrentChoosenShow()
    }, function (response) {
        var data = ResponseToNotify(response);
        if(response["status"] != "data"){
            return;
        }
        ContainerLoadIndicatorHide();
        $('#selectPresentator').empty();
        var presentatorsData = data["list"];
        if(presentatorsData.length != 0){
            for (var i = 0; i < presentatorsData.length; i++) {
                $('#selectPresentator').append($('<option>').text(presentatorsData[i]["siteuser__alias"]).val(presentatorsData[i]["id"]));

            }
            $('#selectPresentator').append($('<option>').text("Без артиста").val(0));
        }else{
            $('#selectPresentator').append($('<option>').text("Нет артистов").val(0));
        }
        if (presentatorsData.length != 0) {
            $("#selectPresentator").val(presentatorsData[0]["id"]).trigger('change');
        }else{
            $("#selectPresentator").val(0).trigger('change');
        }
        if(!_updateOnly){
            CreateCalendar();
            $('#selectPresentator').change(function () {
                UpdateData(true, true);
            });
        }


    });
    return;
}
function FillOnlyCurrentCompanyChecker() {
    //var liElem = $('<li>').appendTo($('#addedNavbarElements'));
    //var aElem = $('<a>').addClass("presentators-select").css("width", "230px").appendTo(liElem);
    var spanContainer = $('<span>').css("margin-left", 25).css("color", "rgb(66, 139, 202)").css("text-align", "left").appendTo($('#choosePanel'));
    var check = $('<input>').attr("type", "checkbox").attr("id", "onlyThisCompany").appendTo(spanContainer);
    var label = $('<label>').attr("for", "onlyThisCompany").addClass("header").css("user-select", "none").appendTo(spanContainer);
    $('<span>').text("Только это учреждение").appendTo(label);
    check.change(function () {
       UpdateData(true, true);
    });
    return;
}

function AddChatMessage(_linkId, _table, _updatedElem) {
    var idStartText = "chat_";
    var container = $('<div>');

    var currentDate = new Date();

    $('<div>').addClass("header").text("Текст сообщения:").appendTo(container);
    $('<textarea>').addClass("form-control input-sm").attr("id", idStartText + "message").attr("placeholder", "Напишите текст сообщения").attr("rows", 10).css("resize", "none").appendTo(container);
    $('<input>').attr("type", "hidden").attr("id", idStartText + "attentionCallDayDone").val("True").appendTo(container);
    $('<input>').attr("type", "hidden").attr("id", idStartText + "attentionCallDayDoneDate").val(ConvertDateTimeToPythonType(currentDate)).appendTo(container);
    var modalWindow = showModalWindow_new("okcancel", "Написать в чат мероприятия", container, function () {
        if ($('#chat_message').val() == "") {
            ShowNotify(3, "Сообщение не может быть пустым");
            ContainerLoadIndicatorHide();
            hideModalWindow(modalWindow);
        }
        else {
            var chatMessage = $('#chat_message').val();
            $.post('/aj_chat_add_message/',
                {
                    id: _linkId,
                    message: chatMessage,
                    table: _table
                },
                function (response) {
                    ResponseToNotify(response);
                    AddChatMessageToList(currentDate, chatMessage);
                    if (_updatedElem) {
                        $(_updatedElem).val(chatMessage).text(chatMessage).attr("title", chatMessage);
                    }
                hideModalWindow(modalWindow);
                }
            );
        }
    });
    return;
}
function ShowChatHistory(_linkId, _table) {

    $.post('/aj_chat_show_messages/',
        {
            id: _linkId,
            table: _table
        },
        function (response) {
            var resp = ResponseToNotify(response);
            if (response["status"] != "data"){
                return;
            }
            var container = $('<div>').attr("id", "chatMessagesContainer");
            var data = resp["list"];
            if(data.length == 0){
                var noEventsExclamation = $('<div>').addClass("datestamp events_frame-decoration").css("left", 0).css("border", "none").css("min-width", "0px").text("Нет элементов для указанных фильтров.").css("text-align", "center").appendTo(container);
            }
            for (var i = 0; i < data.length; i++) {
                var messageTopContainer = $('<div>').addClass().css("width", "100%").css("margin-bottom", "30px").appendTo(container);
                var messageBotContainer = $('<div>').css("width", "85%").appendTo(messageTopContainer);
                var table = $('<table>').css("width", "100%").css("border-collapse", "collapse").appendTo(messageBotContainer);
                var trHeader = $('<tr>').appendTo(table);

                var dateTd = $('<td>').html(ConvertDateTimeToDateLabel(ConvertDateFromStringValue(data[i]["datetime"]), false, true, true)).css("font-size", "11px").css("text-align", "center").css("font-weight", "bold").css("padding", "3px").css("width", "152px");
                var senderTd = $('<td>').css("font-size", "12px").css("text-align", "center").css("font-weight", "bold").css("padding", "3px");
                var aliasTd = $('<td>').text(data[i]["sender__alias"]).css("font-size", "11px").css("text-align", "center").css("font-weight", "bold").css("padding", "3px");

                var trMessage = $('<tr>').appendTo(table);

                var messagesTd = $('<td>').attr("colspan", 2).text(data[i]["message"]).css("font-size", "11px").css("text-align", "center").css("padding", "2px");

                switch (data[i]["sender__type"]) {
                    case "m":
                        senderTd.text("Менеджер");
                        break;
                    case "p":
                        senderTd.text("Артист");
                        break;
                    case "a":
                        senderTd.text("Администратор");
                        break;

                }
                if (data[i]["own"]) {
                    messageBotContainer.css("margin-left", "auto");
                    senderTd.css("border", "1px solid #cccccc").text("Вы").appendTo(trHeader);
                    aliasTd.css("border-top", "1px solid #cccccc").css("border-right", "1px solid #cccccc").css("border-left", "1px solid #cccccc").appendTo(trHeader);
                    dateTd.css("border", "1px solid #cccccc").appendTo(trHeader);
                    var td = $('<td>').appendTo(trMessage);
                    messagesTd.css("border", "1px solid #cccccc").appendTo(trMessage);


                } else {
                    dateTd.css("border", "1px solid #cccccc").appendTo(trHeader);
                    aliasTd.css("border", "1px solid #cccccc").appendTo(trHeader);
                    senderTd.css("border", "1px solid #cccccc").appendTo(trHeader);
                    messagesTd.css("border", "1px solid #cccccc").appendTo(trMessage);

                    switch (data[i]["sender__type"]) {
                        case "m":
                            dateTd.css("background-color", "rgba(51, 122, 183, 0.87)").css("color", "white");
                            senderTd.css("background-color", "rgba(51, 122, 183, 0.87)").css("color", "white");
                            aliasTd.css("background-color", "rgba(51, 122, 183, 0.87)").css("color", "white");
                            messagesTd.css("background-color", "rgba(51, 122, 183, 0.87)").css("color", "white");
                            break;
                        case "p":
                            dateTd.css("background-color", "rgba(35, 177, 0, 0.87)").css("color", "white");
                            senderTd.css("background-color", "rgba(35, 177, 0, 0.87)").css("color", "white");
                            aliasTd.css("background-color", "rgba(35, 177, 0, 0.87)").css("color", "white");
                            messagesTd.css("background-color", "rgba(35, 177, 0, 0.87)").css("color", "white");
                            break;
                        case "a":
                            dateTd.css("background-color", "rgba(0, 0, 255, 0.6)").css("color", "white");
                            senderTd.css("background-color", "rgba(0, 0, 255, 0.6)").css("color", "white");
                            aliasTd.css("background-color", "rgba(0, 0, 255, 0.6)").css("color", "white");
                            messagesTd.css("background-color", "rgba(0, 0, 255, 0.6)").css("color", "white");
                            break;
                    }
                }

                if (data[i]["new"]) {
                    var tdNewLabel = $('<td>').appendTo(trHeader);
                    tdNewLabel.append($('<span>').addClass("glyphicon glyphicon-chevron-left").css("color", "red").attr("title", "Непрочитанное сообщение"));

                }
            }
            var modalButtonsType = "customcancel";
            var controlButtons = {};
            controlButtons["Добавить сообщение в чат"] = {
                "button": $('<button>').attr("title", "Добавить сообщение в чат").append($('<span>').addClass("glyphicon glyphicon-plus text-primary")),
                "function": function () {
                    var updatedElem = false;
                    if($('#lastArtistMessage').length != 0){
                        if($('.user-name strong').attr("data-user_type") == "admin" || $('.user-name strong').attr("data-user_type") == "manager"){
                            updatedElem = $('#lastManagerMessage');
                        }else{
                            updatedElem = $('#lastArtistMessage');
                        }
                    }

                    AddChatMessage(_linkId, _table, updatedElem);
                    return;
                }
            };
            showModalWindow_new(modalButtonsType, "Чат мероприятия", container, false, controlButtons);
        });
    return;
}
//Добавление сообщения в списке чата
function AddChatMessageToList(_date, _chatMessage){
    var chatMessageContainer = $('#chatMessagesContainer');
    if(chatMessageContainer.length != 0){
        var messageTopContainer = $('<div>').addClass().css("width", "100%").css("margin-bottom", "30px").prependTo(chatMessageContainer);
        var messageBotContainer = $('<div>').css("width", "85%").css("margin-left", "auto").appendTo(messageTopContainer);
        var table = $('<table>').css("width", "100%").css("border-collapse", "collapse").appendTo(messageBotContainer);
        var trHeader = $('<tr>').appendTo(table);

        var senderTd = $('<td>').css("font-size", "12px").css("text-align", "center").css("font-weight", "bold").css("padding", "3px").text("Вы").appendTo(trHeader);
        var aliasTd = $('<td>').text($('.user-name strong').text()).css("font-size", "11px").css("text-align", "center").css("font-weight", "bold").css("padding", "3px").appendTo(trHeader);
        var dateTd = $('<td>').html(ConvertDateTimeToDateLabel(_date, false, true, true)).css("font-size", "11px").css("text-align", "center").css("font-weight", "bold").css("padding", "3px").css("width", "152px").appendTo(trHeader);

        var trMessage = $('<tr>').appendTo(table);

        $('<td>').appendTo(trMessage);
        var messagesTd = $('<td>').attr("colspan", 2).text(_chatMessage).css("font-size", "11px").css("text-align", "center").css("padding", "2px").appendTo(trMessage);

        dateTd.css("border", "1px solid #cccccc");
        aliasTd.css("border", "1px solid #cccccc");
        senderTd.css("border", "1px solid #cccccc");
        messagesTd.css("border", "1px solid #cccccc");
    }
    return;
}

function SendEmailToAdmin(_to) {
    var modalWindowTitle = "";
    if(_to == "administrator"){
        modalWindowTitle = "Написать администратору"
    }else{
        modalWindowTitle = "Написать разработчику"
    }
    var content = $('<div>').addClass("textMiddle");

    var frame = $('<form>').addClass("form-horizontal").appendTo(content);
    var innerDiv = $('<div>').addClass("form-group").appendTo(frame);
    $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "comment").text("Сообщение").appendTo(innerDiv);
    var inputContainer = $('<div>').addClass("col-md-9").appendTo(innerDiv);
    var input = $('<textarea>').addClass("form-control input-sm").attr("required", "required").attr("id", "message").attr("rows", 14).css("resize", "none").appendTo(inputContainer);

    var modalWindow = showModalWindow_new("okcancel", modalWindowTitle, content, function () {
        if (TotalInputsValidator(modalWindow)) {
            $.post("aj_help_send_email_to_admin/", {
                to: _to,
                message: $('#message').val()
            }, function (response) {
                ResponseToNotify(response);
            });
            ShowNotify(0, "Письмо отправляется...", 1);
            hideModalWindow(content);
        }
    });

    return;
}
//MODAL WINDOWS Module////////////////////////////////////////////////////////////////////////////////

function showModalWindow_new(_buttonTypes, _tittle, _content, _onOk, _otherButtons, _questionMode) {
    var allModalWindows = $('.modalWindow');
    for (var i = 0; i < allModalWindows.length; i++) {
        var newLeftIndent = parseInt($(allModalWindows[i]).css("left")) - 600;
        $(allModalWindows[i]).animate({
            left: newLeftIndent + "px"
        }, 50)
    }//Сдвигаем все открытые окна влево на 600
    var modalModule;
    if ($('#modal-module').val() == undefined) {//Если контейнера нет, тогда создать его

        var modalModule = $('<div>').attr("id", "modal-module");

        var background = $('<div>').attr("id", "modalWindowBackground");
        background.attr('onclick', "hideAllModalWindows();");

        $(modalModule).append(background);
        $('body').append(modalModule);
    }
    else {
        modalModule = $('#modal-module');
        var background = $('#modalWindowBackground');
    }
    background.css("visibility", "visible");
    $(background).animate({"opacity": "0.5"}, 300);
    var modalWindow = $('<div>').addClass("modalWindow");

    var modalWindowID = "modalWindow" + $('.modalWindow').length;
    $(modalWindow).addClass("container-fluid panel panel-primary");
    if(_questionMode){
        $(modalWindow).css("height", 145);
    }
    var panelTitle = $('<div>').addClass("row panel-heading modalWindowHead").css("user-select", "none").css("cursor", "default");

    var topButtons = $('<div>').appendTo(panelTitle);

    var printButton = $('<button>').attr("title", "Печать содержимого модального окна").addClass("btn btn-primary").css("background-color", "green").css("margin-right", "10px").appendTo(topButtons);
    $('<span>').addClass("glyphicon glyphicon-print").appendTo(printButton);

    (function(_id){
        printButton.click(
            function () {
                PrintPagePart(_id, "modalwindow");
            }
        );
    }(modalWindowID));

    var closeCross = $('<a>').addClass("closecross").attr("onclick", "hideModalWindow('" + modalWindowID + "');").appendTo(topButtons);
    var crossIcon = $('<span>').addClass("glyphicon glyphicon-remove btn btn-primary").appendTo(closeCross);

    var tittleText = $('<div>').addClass("textMiddle");
    if(typeof _tittle == "string"){
        tittleText.text(_tittle);
    }else{
        tittleText.html(_tittle);
    }

    tittleText.attr("style", "color:#fff");
    $(panelTitle).append(tittleText);
    $(modalWindow).append(panelTitle);
    if(!_questionMode) {
        var panelTextWrapper = $('<div>').addClass("modalWindowBody").css("overflow", "hidden");
        var panelText = $('<div>').addClass("textMiddle").css("padding-bottom", "15px").appendTo(panelTextWrapper);
        panelText.html(_content);
    }
    $(modalWindow).append(panelTextWrapper);
    modalWindow.attr("id", modalWindowID);
    var footer = $('<div>').addClass("textMiddle panel-footer modalWindowFooter");
    var buttons = $('<div>').addClass("displayInline").attr("id", "buttonsContainer");
    $(footer).append(buttons);
    $(modalWindow.append(footer));
    if(!_questionMode){
        modalWindow.scroll(function () {//При прокрутке оставляем шапку и дно диалогового окна на месте
            //Заголовок модального окна остается наверху
            $(panelTitle).offset({top: ($(modalWindow).offset().top)});
            $(footer).offset({top: (($(modalWindow).offset().top) + ($(modalWindow).height())) - ($(footer).outerHeight())});
            $(panelTextWrapper).offset({top: ($(modalWindow).offset().top) + $(panelTitle).height() + 23});
            $(panelText).offset({top: ($(modalWindow).offset().top) + $(panelTitle).height() + 43 - modalWindow.scrollTop()});

            if ((600-panelTitle.height()) > ((panelTextWrapper.height()  - panelTitle.height() + panelText.offset().top))) {
                modalWindow.scrollTop(modalWindow.scrollTop() - 0.5);
            }

        });
    }else{
        printButton.remove();
        footer.css("position", "static");
        panelTitle.css("margin-bottom", 0);
    }

    modalModule.append(modalWindow);

    switch (_buttonTypes) {
        case "cancel":
            var button = $('<button>').attr("title", "Выход").addClass("btn btn-default").attr("onclick", 'hideModalWindow("' + modalWindowID + '");').css("color", "white").css("background-color", "green");
            button.append($('<span>').addClass('glyphicon glyphicon-log-out').css("top", "-1px"));
            $(buttons).append(button);
            break;
        case "okcancel":
            var button = $('<button>').attr("title", "Применить").addClass("btn btn-default").css("color", "green").css("background-color", "white");
            button.append($('<span>').addClass('glyphicon glyphicon-ok').css("top", "-1px"));
            $(button).click(function(){
                ContainerLoadIndicatorShow(modalWindow);
                _onOk();

            });
            $(buttons).append(button);
            $(buttons).append('<span>&nbsp</span>');
            var button = $('<button>').attr("title", "Отмена").addClass("btn btn-default").attr("onclick", 'hideModalWindow("' + modalWindowID + '");').css("color", "red").css("background-color", "white");
            button.append($('<span>').addClass('glyphicon glyphicon-ban-circle').css("top", "-1px"));
            $(buttons).append(button);
            break;
        case "custom":
            var button = $('<button>').attr("title", "Применить").addClass("btn btn-default").css("color", "green").css("background-color", "white");
            button.append($('<span>').addClass('glyphicon glyphicon-ok').css("top", "-1px"));
            $(button).click(function(){
                ContainerLoadIndicatorShow(modalWindow);
                _onOk();

            });
            $(buttons).append(button);
            $(buttons).append('<span>&nbsp</span>');
            var button = $('<button>').attr("title", "Отмена").addClass("btn btn-default").attr("onclick", 'hideModalWindow("' + modalWindowID + '");').css("color", "red").css("background-color", "white");
            button.append($('<span>').addClass('glyphicon glyphicon-ban-circle').css("top", "-1px"));
            $(buttons).append(button);
            $(buttons).append('<span>&nbsp;&nbsp;&nbsp;&nbsp</span>');
            for (key in _otherButtons) {
                var button = _otherButtons[key]["button"].attr("title", key).addClass("btn btn-default");
                button.click(_otherButtons[key]["function"]);
                $(buttons).append(button);
                $(buttons).append('<span>&nbsp</span>');
            }

            break;
        case "customcancel":
            var button = $('<button>').attr("title", "Выход").addClass("btn btn-default").attr("onclick", 'hideModalWindow("' + modalWindowID + '");').css("color", "white").css("background-color", "green");
            button.append($('<span>').addClass('glyphicon glyphicon-log-out').css("top", "-1px"));
            $(buttons).append(button);
            $(buttons).append('<span>&nbsp;&nbsp;&nbsp;&nbsp</span>');
            for (key in _otherButtons) {
                var button = _otherButtons[key]["button"].attr("title", key).addClass("btn btn-default");
                button.click(_otherButtons[key]["function"]);
                $(buttons).append(button);
                $(buttons).append('<span>&nbsp</span>');
            }
            break;
        default:
            alert("Неверно выбран тип кнопок модального окна");
            return;
            break;

    }
    var topCoord;
    if (allModalWindows.length > 0) {
        topCoord = ($('.modalWindow').css("top")).replace("px", "");
    }
    else {
        topCoord = -1000;
        topCoord -= $(modalWindow).offset().top - $(window).scrollTop();
        topCoord += 60;
    }
    modalWindow.animate({
        top: topCoord + "px"
    }, 10).css("visibility", "visible");

    return modalWindow;
}
function hideModalWindow(_modalWindow) {
    switch (typeof (_modalWindow)) {
        case "string":
            var modalWindow = $('#' + _modalWindow);
            break;
        case "object":
            var modalWindow = $(_modalWindow).parents('.modalWindow');
            if (modalWindow.length == 0) {
                modalWindow = _modalWindow;
            }
            break;
        default:
            alert("Ошибка в выборе типа модального окна.")
            return;
    }

    var allModalWindows = $('.modalWindow');

    var modalWindowNumber = parseInt(modalWindow.attr("id").replace("modalWindow", ""));
    var modalWindowNumberLast = allModalWindows.length - 1;
    var modalWindowNumberFirst = 0;
    var shift = modalWindowNumberLast - modalWindowNumber + 1;

    $(modalWindow).css("visibility", "hidden");
    $(modalWindow).css("top", "-1000px");

    setTimeout(function () {
        $(modalWindow).remove();
    }, 100);

    for (var i = modalWindowNumber; i < modalWindowNumberLast + 1; i++) {
        $(allModalWindows[i]).css("visibility", "hidden");
        $(allModalWindows[i]).css("top", "-1000px");
        setTimeout(function () {
            $(allModalWindows[i]).remove()
        }, 100);
    }//Если закрывается рождающее, тогда порожденные удаляются
    for (var i = modalWindowNumberFirst; i < modalWindowNumberLast; i++) {
        var newLeftIndent = parseInt($(allModalWindows[i]).css("left")) + 600 * shift;
        $(allModalWindows[i]).animate({
            left: newLeftIndent + "px"
        }, 50);
    }
    if (modalWindowNumber == 0) {
        $('#modalWindowBackground').css("visibility", "hidden");
        setTimeout(function () {
            $('#modal-module').remove()
        }, 200);
    }
}
function hideAllModalWindows() {
    var modalWindows = $('.modalWindow');
    for (i = 0; i < modalWindows.length; i++) {
        var modalWindow = $('#' + $(modalWindows[i]).attr('id'));
        modalWindow.css("visibility", "hidden");
        modalWindow.css("top", "-1000px");
    }
    $('#modalWindowBackground').css("visibility", "hidden");

    setTimeout(function () {
        $('#modal-module').remove()
    }, 200);
}
function DecorateModalWindow(_modalWindow, _color) {
    $(_modalWindow).children(".modalWindowHead").css("background-color", _color);
    $(_modalWindow).children(".modalWindowHead").css("border-bottom-color", _color);
    $(_modalWindow).css("border-color", _color);
    return;
}

//SMALL CHANGE WINDOW MODULE
function ShowSmallChangeWindow(_text, _header, _element, _onok, _validator, _hideChange, _only_show, _changeOnPage, _nonStandartShift) {
    _only_show = _only_show || false;
    _hideChange = _hideChange || false;
    _validator = _validator || false;
    _changeOnPage = _changeOnPage || false;

    MakeBackgroundCover(function () {
        HideSmallChangeWindow($('#smallChangeBox').children().children().children());
    });

    if ($('#smallChangeBox')) {//Проверяем наличие открытого окна, если она есть, закрываем его
        HideSmallChangeWindow($('#smallChangeBox').children().children().children());//Причина подобной инсталляции видна в функции HideSmallChangeWindow...
    }
    var coordWindowLeft = 0;
    var coordWindowTop = 0 + $(window).scrollTop();
    var sizeWindowWidth = $(window).width();
    var sizeWindowHeight = $(window).height();

    var coordElementLeft = $(_element).offset().left;
    var coordElementTop = $(_element).offset().top;

    var sizeElementWidth = _element.offsetWidth;
    var sizeElementHeight = _element.offsetHeight;

    if(!sizeElementWidth){
        sizeElementWidth = $(_element).width();
    }
    if(!sizeElementHeight){
        sizeElementHeight = $(_element).height();
    }
    var coordChangeWindowLeft = 0;
    var coordChangeWindowTop = 0;
    var sizeChangeWindowWidth = 550 + 22 + 22;//22 - это сдвиг стрелочки контрола
    var sizeChangeWindowHeight = 215;

    var changeWindowType = "";//Тип окна редактирования - в зависимости от его местоположения

    //Рассчитываем координаты окна редактирования, чтобы оно входило в область видимости экрана, хотя бы по горизонтали
    if ((coordElementLeft + sizeElementWidth + sizeChangeWindowWidth - 33) < sizeWindowWidth) {
        changeWindowType = "left";
        coordChangeWindowLeft = coordElementLeft + sizeElementWidth + 11;
        coordChangeWindowTop = (coordElementTop - sizeElementHeight / 2 - sizeChangeWindowHeight / 2);
    } else if ((coordElementLeft - (sizeChangeWindowWidth + 11)) > 0) {
        changeWindowType = "right";
        coordChangeWindowLeft = coordElementLeft - sizeChangeWindowWidth + 22;
        coordChangeWindowTop = coordElementTop - sizeChangeWindowHeight / 2 + sizeElementHeight / 2;
    }
    else {
        changeWindowType = "top";
        coordChangeWindowLeft = coordElementLeft + sizeElementWidth / 2 - sizeChangeWindowWidth / 2 + 22;
        coordChangeWindowTop = coordElementTop + sizeElementHeight + 22;
    }

    var changeWindowElement = $('<div>').attr("id", "smallChangeBox").css("left", coordChangeWindowLeft).css("top", coordChangeWindowTop);//создаем окно
    $('<div>').addClass("light_border").css("width", sizeElementWidth + 2).css("height", sizeElementHeight + 5).css("left", coordElementLeft - 2).css("top", coordElementTop - 2).appendTo($("body"));//Добавляем рамку для выделения редактируемого элемента

    if (changeWindowType == "left") {
        changeWindowElement.addClass("small_change_box_left");
    }
    if (changeWindowType == "right") {
        changeWindowElement.addClass("small_change_box_right");
    }
    if (changeWindowType == "top") {
        changeWindowElement.addClass("small_change_box_top");
    }
    var inside_div = $('<div>').addClass("inside_block").appendTo(changeWindowElement);//Создаем внутри блок для контента

    $('<div>').addClass("modalWindowHeader textMiddle").html(_header).css("color", "#428bca").css("margin-bottom", "4px").css("margin-top", "4px").appendTo(inside_div);//Добавляем заголовок в окно - берется из параметра _title


    if (!_only_show) {
        var ok_button = $('<button>').attr("title", "Применить").css("margin-right", "5px").addClass("btn btn-default").css("color", "green").css("background-color", "white");
        ok_button.append($('<span>').addClass('glyphicon glyphicon-ok').css("top", "-1px"));

    }
    var textarea = $('<textarea>').attr("id", "changeWindowTextarea").addClass("textarea_block").attr("rows", "4").css("width", "100%").css("resize", "none").css("padding", "9px 9px 9px 9px;").attr("data-getted-text", _text).text(_text).on("keyup paste", function () {
        $(ok_button).removeClass("disabled");
    }).appendTo(inside_div);//Добавляем textarea с полученным текстом
    var footer = $('<div>').addClass("textMiddle footer").css("margin-top", "10px").appendTo(inside_div);//Добавляем дно окна с кнопками

    var copy_button = $('<button>').attr("title", "Скопировать данные в буфер обмена").css("position", "absolute").css("left", "17px").addClass("btn btn-default").css("color", "black").css("background-color", "white").prependTo(footer);
    copy_button.append($('<span>').addClass('glyphicon glyphicon-floppy-open').css("top", "-1px"));
    copy_button.click(function () {
       CopyTextToClipBoard($(textarea).val());
       ShowNotify(2, "Значение успешно скопировано в буфер обмена", 0, 2000);
    });

    if (_onok) {//Если есть функция для кнопки ОК
        ok_button.appendTo(footer);//Добавляем кнопку ОК на дно
        ok_button.on("click", (function () {//Добавляем обработчик на кнопку ОК.
            if (!ok_button.hasClass("disabled")) {//Если кнопка не выключена
                if (textarea.data("getted-text") == $(textarea).val()) {//Если нет изменений выбранного поля
                    ShowNotify(3, "Нет изменений, ничего не сохранено.", 0, 2500);//Выводим уведомление о том что нет изменений
                    HideBackgroundCover();
                    HideSmallChangeWindow(this);//Закрываем окно.
                }
                else {
                    if (_validator) {
                        if (!_validator($(textarea).val())) {
                            return;
                        }
                    }

                    _onok();//Если есть изменения, выполняем функцию для OK
                    if (!_hideChange) {//Если параметр скрытого изменения задан, то не выводим новый полученный текст никуда, кроме ввода в базу данных
                        if (_changeOnPage) {
                            _changeOnPage();
                        }
                        else {
                            if ($(_element).children().length > 0) {
                                var childChecker = $(_element).children();
                                childChecker.html($(textarea).val());
                            }
                            else {
                                $(_element).html($(textarea).val());
                            }
                        }

                    }
                    HideBackgroundCover();
                    HideSmallChangeWindow(this);//Закрываем окно.
                }

            }
        }));
    }

    var removeButton = $('<button>').attr("title", "Отмена").addClass("btn btn-default").css("color", "red").css("background-color", "white").appendTo(footer);
    removeButton.append($('<span>').addClass('glyphicon glyphicon-ban-circle').css("top", "-1px"));
    removeButton.click(function(){
        HideSmallChangeWindow(this);
        HideBackgroundCover();
    });

    $('body').append(changeWindowElement);
    setTimeout(function () {//Добавляем анимацию, при этом ставим паузу в 5 милисекунд для того чтобы элемент успел добавился в body
        $(changeWindowElement).addClass("unscaled");
    }, 5);
    return;
}//Создает окно частного редактирования (редактирования одного элемента)
function HideSmallChangeWindow(_innerElem) {
    var changeWindow = $(_innerElem).parent().parent().parent();//На костылях допрыгиваем по DOM до окна частного редактирования и закрываем его
    $(changeWindow).removeClass("unscaled");//Анимацией убираем окно
    $('.light_border').remove();
    setTimeout(function () {//Перед удалением ставим паузу в 200мс, чтобы анимация успела сработать.
        $(changeWindow).remove();

    }, 200);

    return;
}//Скрывает окно частного редактирования
function HideAllSmallChangeWindows() {
    $('#backgroundCover').remove();
    $('.light_border').remove();
    $('#smallChangeBox').remove();
    return;
}
function ChangeOneField(_id, _table, _field, _value) {
    $.post("/aj_change_one_field/", {id: _id, table: _table, field: _field, value: _value}, function (response) {
        ResponseToNotify(response);
    })
}
//END MODAL WINDOWS Module/////////////////////////////////////////////////////////////////////////////

function MakeBackgroundCover(_onClick) {
    var backgroundCover = $('<div>').attr("id", "backgroundCover").addClass("background-cover").appendTo('body');
    backgroundCover.animate({"opacity": "0.5"}, 100);
    backgroundCover.click(function () {
        if(_onClick && isFunction(_onClick)){
            HideBackgroundCover();
            _onClick();
    }
    });
    return;
}
function HideBackgroundCover() {
    $('#backgroundCover').animate({"opacity": "0"}, 100);
    setTimeout(function () {
        $('#backgroundCover').remove();
    }, 100);
    return;
}
///NOTIFY MODULE//////////////////////////////////////////////////////////
function ShowNotify(_type, _notifyText, _closeType, _showTime) {
    if (GLOBAL_CURRENT_NOTIFY_STATUS) {//Если окно открыто скрываем его и затем открываем новое
        HideNotify();
        setTimeout(function () {
            ShowNotify(_type, _notifyText, _closeType, _showTime)
        }, 600);
        return;
    }
    _closeType = _closeType || 0;//Тип закрытия уведомления по умолчанию - авто
    _showTime = _showTime || 3000;//Время закрытия уведомления по умолчанию - 3 секунды

    _type = String(_type);
    _showTime = String(_showTime);
    $('.notification').remove();
    var type = {//Тип уведомления - ошибка, успешно, информация, загрузка
        error: "1",
        success: "2",
        info: "3",
        load: "0"
    };
    var closeType = {
        auto: "0",
        manual: "1"
    };
    var notifyElement = $('<div/>', {
        class: 'notification'
    });
    var notifyTitle = $('<div/>', {
        class: "notification-title"
    });
    var notifyText = $('<div/>', {
        class: "notification-text"
    });
    var closeButton = $('<button/>').html("&times");
    closeButton.addClass('close');
    closeButton.attr("onclick", "HideNotify();");
    notifyElement.append(closeButton);
    switch (_type) {//Устанавливаем дизайн в зависимости от типа уведомления

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
            var container = $('<div/>', {class: 'cssload-container'});
            container.append(($('<div/>').addClass("cssload-speeding-wheel")));
            if(_notifyText == "" || _notifyText == undefined){
                container.append($('<div style ="float:left;"></div>').html("Загрузка данных"));
            }
            else{
                container.append($('<div style ="float:left;"></div>').html(_notifyText));
            }

            notifyTitle.append(container);
            notifyElement.addClass('notification-info');
            break;
        default:
            alert('Ошибка в выборе типа уведомления. (1 - error, 2 - success, 3 - info, 0 - load)');
            return;
            break;
    }
    notifyElement.append(notifyTitle);
    if (_notifyText != undefined && _notifyText != "" && _type != type.load) {

        notifyText.html(_notifyText);
        notifyElement.append(notifyText);
    }
    $('body').append(notifyElement);
    notifyElement.animate({height: "60px", bottom: "0px", opacity: "1"}, 500);
    if (_closeType == closeType.auto) {//Для автозакрытия запускаем функцию закрытия с задержкой
        if (_showTime != undefined && _showTime != 0) {
            setTimeout(HideNotify, _showTime);
            return;
        }
    }
    GLOBAL_CURRENT_NOTIFY_STATUS = true;//Устанавливаем глобальную переменную в положение, указывающее что уведомление открыто
}//Функция показывает окно уведомления
function HideNotify(_loadData) {
    if ($('.notification').val() == undefined)//Если окна нет в документе, выходим из функции
        return;
    if(_loadData){
        if($('.notification').find(".cssload-speeding-wheel").val()){
            HideNotify();
        }
    }else{
        $('.notification').animate({height: "-60px", bottom: "0px", opacity: "0"}, 500);
        setTimeout(function () {//Удаляем окно с задержкой, чтобы анимация успела сработать
            $('.notification').remove();
            GLOBAL_CURRENT_NOTIFY_STATUS = false;//Устанавливаем глобальную переменную в положение, указывающее что уведомление скрыто
        }, 500);
    }
    return;

}//Функция скрывает окно уведомления
function ShowNotify_LoadData(_successAfter, _startTime, _endTime, _notFirstStart) {
    if ((_startTime == undefined) || (_endTime == undefined)) {//При первом запуске функции, устанавливаем время ее открытия и повторного открытия в значение сейчас
        _startTime = new Date();
        _endTime = new Date();
    }
    if(!_notFirstStart){
        setTimeout(function () {
          ShowNotify_LoadData(_successAfter, _startTime, new Date(), true)
        }, 300);
        return;
    }
    _successAfter = _successAfter || false;
    if (GLOBAL_CURRENT_AJAX_RESPONSE_STATUS == "ERROR") {//Если сервер вернул ошибку, выводим уведомление и закрываем функцию
        ShowNotify_LoadDataError();
        HideBackgroundCover();
        return;
    }
    if (((_endTime.getTime() - _startTime.getTime())) > 1000 && !GLOBAL_CURRENT_NOTIFY_STATUS) {//Если сервер молчит больше 2х секунды и уведомление еще не выведено, выводим уведомление о загрузке и возвращаем функцию опять
        MakeBackgroundCover();
        ShowNotify(0, "", 1);
    }
    if (!GLOBAL_CURRENT_AJAX_STATUS) {//Если ответ сервера еще не загрузился, ждем его

        setTimeout(function () {
          ShowNotify_LoadData(_successAfter, _startTime, new Date(), true)
        }, 300);
        return;
    }
    else {//В ином случае скрываем уведомление, либо выводим сообщение об успешности загрузки
        if (_successAfter) {
            ShowNotify_LoadDataSuccess();
        } else {
            HideNotify(true);
        }
        HideBackgroundCover();
        return;
    }

    return;
}//Функция запускает уведомление о загрузке интерактивных данных, если время ответа сервера превышает 2 секунды
function ShowNotify_LoadDataError() {
    ShowNotify(1, "Неизвестная ошибка при загрузке данных. Перезагрузите страницу и попробуйте снова.", 1);
}//Выводит уведомление при ошибке загрузке данных
function ShowNotify_LoadDataSuccess() {
    ShowNotify(2, "Успешная загрузка данных", 0, 1500);
}//Выводит уведомление при успешной загрузке данных
function ResponseToNotify(_response) {
    if (!("status" in _response)) {
        ShowNotify(1, "Ошибка при разборе ответа сервера. Поменяйте параметры запроса.", 1);
        return false;
    }
    ContainerLoadIndicatorHide();
    switch (_response["status"]) {
        case "error":
            ShowNotify(1, _response["text"], 1);
            return _response["status"];
        case "success":
            ShowNotify(2, _response["text"], 0, 3000);
            return _response["status"];
        case "info":
            ShowNotify(3, _response["text"], 0, 3000);
            return _response["status"];
        case "data":
            return _response["data"];
        default :
            ShowNotify(1, "Неизвестный статус полученных данных.", 1);
            return;
    }
}
function ContainerLoadIndicatorShow(_container) {
    var containerParent = $(_container).parent();
    var cover = $('<div>').attr("id", "loadIndicator").addClass("container-load-indicator-cover").appendTo(containerParent);
    $(cover).css("width", $(_container).width() + parseInt($(_container).css("padding-left")) + parseInt($(_container).css("padding-right"))).css("height", $(_container).height()).css("left", $(_container).position().left).css("top", $(_container).position().top);
    cover.css("border-radius", _container.css("border-radius"));
    var loadWheel= $('<div>').attr("id", "loadIndicatorWheel").addClass("cssload-container container-load-wheel-container").appendTo(containerParent);
    $('<div>').addClass("cssload-speeding-wheel container-load-wheel").appendTo(loadWheel);
    var loadWheelLeft = $(_container).position().left + parseInt($(_container).css("padding-left")) + $(_container).width()/2 - 40;
    var loadWheelTop = $(_container).position().top + $(_container).height()/2 - 40;
    loadWheel.css("left", loadWheelLeft).css("top", loadWheelTop);
    return;
}
function ContainerLoadIndicatorHide() {
    $('#loadIndicator').remove();
    $('#loadIndicatorWheel').remove();
    return;
}
///END NOTIFY MODULE//////////////////////////////////////////////////////
function ShowGoToTopArrow() {
    var container = $('<div>').addClass("gototoparrow-container").appendTo($(document.body));
    var content = $('<span>').addClass("gototoparrow glyphicon glyphicon-chevron-up").appendTo(container);
    container.click(function () {
        $(document.body).animate({scrollTop:0}, '200');
    });
    return;
}
function HideGoTopArrow() {
    if($('.gototoparrow-container').length > 0) {
        $('.gototoparrow-container').remove();
    }
    return;
}
function CheckGoTopArrow(){
    if($('.gototoparrow-container').length > 0){
        return true;
    }else{
        return false;
    }
}
//PAGE DATA FILLER////////////////////////////////////////////////////////
function FillPageDataFromPython(_data) {
    data = $.parseJSON(_identifier, _data);
    for (i in data) {
        $('#' + _identifier + "_" + i).html(_data[i]);
    }
}
function FillPageDataFromJS(_recieverID, _transmitterID, _fields) {
    for (i in _fields) {
        $('#' + _recieverID + "_" + _fields[i]).html($('#' + _transmitterID + "_" + _fields[i]).html());
    }

}
//END PAGE DATA FILLER MODULE

//COOKIE WORKER///////////////////////////////////////////////
function WriteCookie(_cookieDict, _path) {
    var path = _path ? _path : "/";
    for (cookie in _cookieDict) {
        $.cookie(cookie, _cookieDict[cookie], {path: path});
    }
    return;
}
function RemoveCookie(_cookieName, _path) {
    var path = _path ? _path : "/";
    $.removeCookie(_cookieName, {path: path});
    return;
}

/////////////////////////////////////////////////////////////////////////

//CONVERTORS////////////////////////////////////////////////////////
function ConvertDateToJSFormat(_dateDict) {
    if(_dateDict instanceof Date){
        return _dateDict
    }
    try {
        var test = _dateDict["year"];
    }
    catch (e) {
        return "Error"
    }

    var JSDate = new Date(_dateDict["year"], _dateDict["month"] - 1, _dateDict["day"], _dateDict["hour"], _dateDict["minute"], _dateDict["second"]);

    return JSDate;
}
function ConvertDateToCountDownValue(_date, _textOnly) {
    //Обнуление даты для получения точной разницы в днях
    if (!(_date instanceof Date))
        return "Error";
    var date = new Date(_date);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    var currentDate = new Date();
    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);


    var dateDifferenceDays = Math.round((currentDate - date) / 1000 / 60 / 60 / 24);
    var absDateDifferenceDays = Math.abs(dateDifferenceDays);
    var endWord = "";
    var resString = "";
    if (dateDifferenceDays < 10 || dateDifferenceDays > 20) {
        if (absDateDifferenceDays % 10 == 1)
            endWord = "день";
        if (absDateDifferenceDays % 10 > 1 && absDateDifferenceDays % 10 < 5)
            endWord = "дня";
        if (absDateDifferenceDays % 10 > 4 || absDateDifferenceDays == 0 || absDateDifferenceDays % 10 == 0)
            endWord = "дней";
    }
    else
        endWord = "дней";

    if (dateDifferenceDays < 0)
        resString = "Через " + -dateDifferenceDays + " " + endWord;
    else if (dateDifferenceDays > 0)
        resString = dateDifferenceDays + " " + endWord + " назад";
    else
        resString = "Сегодня";
    if(_textOnly){
        return resString;
    }else{
        return $('<span>').text(resString);
    }
}
function ConvertDateFromStringValue(_value, _outputType) {
    //Вид Python1: гггг-мм-ддTчч:мм:сс
    //Вид Python2: гггг-мм-дд чч:мм:сс
    //Строковый вид: гггг.мм.дд чч:мм:сс
    //Python1
    if(_value.indexOf('T') + 1) {
        var dateTime = _value.split("T");
        var date = dateTime[0].split("-");
        var time = dateTime[1].split(":");
        time[2] = time[2].split(".")[0];
    }
    //Если преобразованный вид
    else {
        var dateTime = _value.split(" ");
        //Python2
        if (dateTime[0].indexOf('-') + 1) {
            var date = dateTime[0].split("-");
        //Строковый
        } else {
            var date = dateTime[0].split(".");
        }
        var time = dateTime[1].split(":");
        if(time[2]){
            time[2] = time[2].split(".")[0];
        }
    }
    if (_outputType == undefined)
        _outputType = "full";

    switch (_outputType) {
        case "full":
            if(time[2] == undefined){
                time[2] = 0;
            }
            return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
        case "strdate":
            return dateTime[0];
        case "strtime":
            return dateTime[1];
        case "y":
            return date[0];
        case "m":
            return date[1];
        case "d":
            return date[2];
        case "h":
            return time[0];
        case "m":
            return time[1];
    }

}
function ConvertOnlyDateFromStringValue(_value, _dotType){
    if(_dotType){
        var date = _value.split(" ");
        var dateTime = date[0].split(".");
    }else{
        var dateTime = _value.split("-");
    }
    return new Date(dateTime[0], dateTime[1] - 1, dateTime[2], 0, 0, 0);
}
function ConvertDateTimeToPythonType(_dt) {
    var year = _dt.getFullYear();
    var month = ConvertDateComponentTo2CharsFormat(+_dt.getMonth() + 1);
    var date = ConvertDateComponentTo2CharsFormat(_dt.getDate());
    var hour = ConvertDateComponentTo2CharsFormat(_dt.getHours());
    var minute = ConvertDateComponentTo2CharsFormat(_dt.getMinutes());

    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
}
function ConvertDateTimeStringToMonthLabel(_str) {//2017.02.10 00:30
    var monthNamesDict = {
        "01": "Январь",
        "02": "Февраль",
        "03": "Март",
        "04": "Апрель",
        "05": "Май",
        "06": "Июнь",
        "07": "Июль",
        "08": "Август",
        "09": "Сентябрь",
        "10": "Октябрь",
        "11": "Ноябрь",
        "12": "Декабрь"
    };
    var date = (_str.split(" ")[0]).split(".");
    var year = date[0];
    var month = monthNamesDict[date[1]];

    return month + ", " + year;

}
function ConvertJSDateToMonthLabel(_date) {
    var monthNamesDict = {
        0: "Январь",
        1: "Февраль",
        2: "Март",
        3: "Апрель",
        4: "Май",
        5: "Июнь",
        6: "Июль",
        7: "Август",
        8: "Сентябрь",
        9: "Октябрь",
        10: "Ноябрь",
        11: "Декабрь"
    };
    var year = _date.getFullYear();
    var month = monthNamesDict[_date.getMonth()];

    return month + ", " + year;
}
function ConvertDateTimeToDateLabel(_date, _type, _reverse, _noNbsp, _titleLabel) {
    if(_type == "date"){
        return _date.getDate() + " " + ConvertMonthFromNumberToName((+_date.getMonth() + 1)) + " " + _date.getFullYear();
    }else if(_type == "time") {
        return _date.getHours() + ":" + ConvertDateComponentTo2CharsFormat(_date.getMinutes());
    } if(_type == "countdownandtime"){
        return ConvertDateToCountDownValue(_date, true) + " в " + _date.getHours() + ":" + ConvertDateComponentTo2CharsFormat(_date.getMinutes());
    }else{
        if(_reverse){
            if(_titleLabel){
                var spaceString = " ";
            }else{
                if (_noNbsp) {
                    var spaceString = "&nbsp";
                } else {
                    var spaceString = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
                }
            }

            return _date.getHours() + ":" + ConvertDateComponentTo2CharsFormat(_date.getMinutes()) + spaceString + _date.getDate() + " " + ConvertMonthFromNumberToName((+_date.getMonth() + 1)) + " " + _date.getFullYear();
        }else{
            return _date.getDate() + " " + ConvertMonthFromNumberToName((+_date.getMonth() + 1)) + " " + _date.getFullYear() + " " + _date.getHours() + ":" + ConvertDateComponentTo2CharsFormat(_date.getMinutes());
        }

    }
    return;
}
function ConvertSecondsToHMSstring(_seconds){
    var hours = Math.floor(_seconds/3600);
    var minutes = Math.floor((_seconds - (hours * 3600))/60);
    //var seconds = _seconds % 60;
    var resStr = "";
    if(hours > 0){
        resStr += hours + " ч. ";
    }
    if(minutes > 0){
        resStr += minutes + " м. ";
    }
    //resStr += seconds + " с.";
    return resStr;
}
function ConvertMonthFromNumberToName(_number, _short, _js) {

    if (_js) {
        _number = +_number + 1;
    }
    if (_short) {
        monthNamesDict = {
            1: "Янв",
            2: "Фев",
            3: "Мар",
            4: "Апр",
            5: "Май",
            6: "Июн",
            7: "Июл",
            8: "Авг",
            9: "Сен",
            10: "Окт",
            11: "Ноя",
            12: "Дек"
        }
    } else {
        monthNamesDict = {
            1: "Январь",
            2: "Февраль",
            3: "Март",
            4: "Апрель",
            5: "Май",
            6: "Июнь",
            7: "Июль",
            8: "Август",
            9: "Сентябрь",
            10: "Октябрь",
            11: "Ноябрь",
            12: "Декабрь"
        }
    }
    return monthNamesDict[_number];

}
function ConvertWeekDayFromNumberToName(_number, _short) {
    if (_short) {
        weekDaysNamesDict = {
            1: "Пн",
            2: "Вт",
            3: "Ср",
            4: "Чт",
            5: "Пт",
            6: "Сб",
            0: "Вс"

        }
    } else {
        weekDaysNamesDict = {
            1: "Понедельник",
            2: "Вторник",
            3: "Среда",
            4: "Четверг",
            5: "Пятница",
            6: "Суббота",
            0: "Воскресение"
        }
    }
    return weekDaysNamesDict[_number];
}
function HexToRGB(_hex, _alphaYes) {
    var hex = _hex.toUpperCase();
    var h = "0123456789ABCDEF";
    var r = h.indexOf(hex[1]) * 16 + h.indexOf(hex[2]);
    var g = h.indexOf(hex[3]) * 16 + h.indexOf(hex[4]);
    var b = h.indexOf(hex[5]) * 16 + h.indexOf(hex[6]);
    if (_alphaYes) return "rgba(" + r + ", " + g + ", " + b + "," + _alphaYes + ")";
    else return "rgb(" + r + ", " + g + ", " + b + ")";
}//Преобразование формата цвета из HEX в RGBA
function ConvertNamesToShort(_name) {
    splittedString = _name.split(" ");
    abbr = "";
    for (j = 0; j < splittedString.length; j++) {
        abbr += splittedString[j][0].toUpperCase();
    }
    return abbr;
}//Преобразует наименования в аббревеатуры
function FirstSymbolToUpperCase(_str) {
    resString = "";
    for (lengthCounter = 0; lengthCounter < _str.length; lengthCounter++) {
        if (lengthCounter == 0) {
            resString += _str[lengthCounter].toUpperCase();
        } else {
            resString += _str[lengthCounter];
        }

    }
    return resString;
}//Возвращает строку с первым символом, переведенным в верхний регистр
function ConvertDateComponentTo2CharsFormat(_value) {
    if (_value.toString().length == 1) {
        return "0" + _value;
    }
    else {
        return _value;
    }
}
function ConvertDateComponentTo1CharsFormat(_value) {
    return +_value;
}
function ConvertDateForOldcalFinder(_dtstring) {
    var components = _dtstring.split("-");
    return components[0] + "." + components[1] + "." + components[2];
}
function WeekFrameFinder(_dtstring) {
    var components = _dtstring.split("-");
    return $('td[data-fulldate=\"' + components[0] + "." + components[1] + "." + components[2] + "\"]");
}
function ConvertTimeTo2ComponentsFormat(_dtstring) {
    var components = _dtstring.split(":");
    return components[0] + ":" + components[1];
}
function GetTimeComponent(_dtstring, _type) {
    var components = _dtstring.split(":");
    if(_type == "hour"){
        return +components[0];
    }else{
        return +components[1];
    }
}
function ConvertBoolFromPython(_var) {
    if(_var == "True"){
        return true;
    }
    else {
        return false;
    }
}
/////////////////////////////////////////////////////////////////////////

//COMMONS//////////////////////////////////////////////////////////////////////////////////////////////////////
function Authorize() {
        $('#auth').attr("disabled", "false");
        $.post("/aj_logging/", {login: $('#login').val(), password: $('#password').val()}, function (response) {
            ContainerLoadIndicatorShow($('#loginContainer'));
            var data = ResponseToNotify(response);
            if (response["status"] == "data") {
                ShowNotify("2", "Успешная авторизация, производится вход");
                setTimeout(function () {
                    if(data["user_type"] == "presentator"){
                        (window.location = "/events/")
                    }else{
                        (window.location = "/clients/")
                    }
                }, 1200);
            }
            else {
                $('#auth').removeAttr("disabled");
                $('#password').val("");
                $('#password').css("border-color", "red").focus();
            }
            ContainerLoadIndicatorHide();
        });

    }
function ShowChoosePanels() {
    $('#cityPickerTittle').css("visibility", "visible");
    $('#showPickerTittle').css("visibility", "visible");
    $('#search_panel').css("visibility", "visible");
    return;
}

function MakeAdminToggle(_currentStatus) {
    //Режим администратора Toggle
    var outerDiv = $('<div>').addClass("form-group").appendTo($('#adminModeToggle'));
    var toggleContainer = $('<span>').addClass("col-md-3").css("text-align", "right").appendTo(outerDiv);
    var adminModeToggle = $('<input>').attr("id", "adminModeToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
    if (_currentStatus == "True") {
        adminModeToggle.attr("checked", "checked");
    }
    $(adminModeToggle).bootstrapToggle({
        on: "Да",
        off: "Нет",
        size: "small",
        onstyle: "success"
    });
    toggleContainer.click(function () {
        //Костыльная переменная - посколько тогл срабатывает после события клика
        var currentToggleStatus = $(adminModeToggle).prop("checked");

        $.post("aj_main_change_admin_mode/", {
            mode: !currentToggleStatus
        }, function (response) {
            var responseStatus = ResponseToNotify(response);
            if (responseStatus != "error") {
                ClearTopLeftPanelCookies();
                setTimeout(function () {
                    location.reload();
                }, 3000);
            } else {
                $(adminModeToggle).bootstrapToggle("off");
            }
        });
    });
    return;
}
function AddHandlerToSearchInput(_onlyEvents) {
    $('#search_input').on("input", function () {
        if (search_safe_timeout) {
            clearTimeout(search_safe_timeout);
        }
        if (search_notify_timeout) {
            clearTimeout(search_notify_timeout);
        }
        search_notify_timeout = setTimeout(function () {
            ShowNotify("0");
        }, 500);
        search_safe_timeout = setTimeout(function () {
            UpdateData(_onlyEvents, _onlyEvents);
            ShowNotify_LoadDataSuccess();
        }, 1500);
    });
    $('.search-input-reset').on("click", function () {
        if ($('#search_input').val() != "") {
            $('#search_input').val("");
            setTimeout(function () {
                UpdateData(_onlyEvents, _onlyEvents);
            }, 100);

        }
    });
    return;
}
function ChooseCity(_cityID, _cityName, _firstUpdateNotNeed) {//Выбор города в панели фильтрации
        $('#cityPickerTittle span').text(_cityName); //Меняем в списке заголовок на новое название города
        $('#cityPickerTittle').attr("data-id", _cityID);

        $.post("/aj_main_load_allowed_shows_to_header/", {id: _cityID}, function (response) {//Загружаем список доступных шоу для города

            var allowedArtists = ResponseToNotify(response)["list"];//Получаем список доступных шоу для города в формате JSON
            var choosenShowId;//Выбранное шоу
            var showsList = {};//Список шоу
            $('#showPickerContainer').empty();//Убираем элементы из списка шоу

            var choosenShowId = 0;
            if (allowedArtists.length > 1) {//Если больше 1 шоу в списке - добавляем вначале "Все Шоу" и разделитель
                $('#showPickerTittle span').text("Все шоу");//Заголовком делаем "Все шоу"
                var liElement = $('<li>');
                var aElement = $('<a>').attr("href", "#").attr("data-id", 0).html("Все шоу");
                liElement.append(aElement);
                liElement.on("click", {id: 0, name: "Все шоу", firstUpdateNotNeed: _firstUpdateNotNeed}, ChooseShow);
                $('#showPickerContainer').append(liElement);
                var liElement = $('<li>').addClass("divider");
                $('#showPickerContainer').append(liElement);
                choosenShowId = 0;//Выбранным шоу делаем "Все шоу"

                showsList[0] = "Все шоу";

            }
            else {//В ином случае:
                $('#showPickerTittle span').text(allowedArtists[0].name);//Заголовком делаем первое шоу
                choosenShowId = allowedArtists[0].id;//Выбранным шоу делаем первое в этом списке
            }
            $('#showPickerTittle').attr("data-id", choosenShowId);
            for (var i = 0; i < allowedArtists.length; i++)//Заполняем список шоу, полученными из запроса
            {
                var liElement = $('<li>');
                var aElement = $('<a>').attr("href", "#").attr("data-id", allowedArtists[i].id).html(allowedArtists[i].name);
                liElement.append(aElement);
                liElement.on("click", {id: allowedArtists[i].id, name: allowedArtists[i].name, firstUpdateNotNeed: _firstUpdateNotNeed}, ChooseShow);
                $('#showPickerContainer').append(liElement);

                showsList[allowedArtists[i].id] = allowedArtists[i].name;
            }
            WriteCookie({choosenCity: _cityID, choosenShow: choosenShowId, allowedShowList: JSON.stringify(showsList)});//Обновляем данные куки - идентификаторы города и шоу, а также список шоу

            if (UpdateData) {
                if (_firstUpdateNotNeed) {
                    UpdateData(true);
                } else {
                    UpdateData();
                }
            }
        });
        return;
    }//Обработчик выбора города в списке городов
function ChooseShow(event){
    $('#showPickerTittle span').html(event.data.name);//Заменить заголовок
    $('#showPickerTittle').attr("data-id", event.data.id);
    WriteCookie({choosenShow: event.data.id});//Записать куки
    if(UpdateData)
    {
        if(event.data.firstUpdateNotNeed){
            UpdateData(true);
        }else{
            UpdateData();
        }
    }
    return;

}//Выбор шоу в списке
function LoadShowListFromCookies(_choosenCity, _firstUpdateNotNeed){
    _firstUpdateNotNeed = ConvertBoolFromPython(_firstUpdateNotNeed);
    if($.cookie("choosenCity") != _choosenCity) {//Если куки выбранных города и шоу отсутствуют (проверка идет по куки города), тогда выполнить вызов функции от 0 значения - все города
        ChooseCity(0, "Все города", _firstUpdateNotNeed);
        return;
    }
    var shows = $.parseJSON($.cookie("allowedShowList"));//Получаем список шоу и перебираем его
    for (var show in shows)
        {
            var liElement = $('<li>');
            var aElement = $('<a>').attr("href", "#").attr("data-id", show).text(shows[show]);//Меняем заголовок списка шоу
            liElement.append(aElement);
            liElement.on("click",{id:show, name:shows[show], firstUpdateNotNeed: _firstUpdateNotNeed}, ChooseShow);//Вешаем обработчик клика на шоу в списке
            $('#showPickerContainer').append(liElement);


            if(show == 0){//Если в списке несколько шоу, значит есть нулевой пункт - "Все шоу". Добавляем после этого пункта разделительную черту.
                liElement = $('<li>').addClass("divider");
                $('#showPickerContainer').append(liElement);
            }
            if(show == $.cookie("choosenShow")){//Указываем в заголовке списка шоу то шоу, которое хранится в куках
                $('#showPickerTittle span').text(shows[show]);
            }
        }
        if(UpdateData){
            UpdateData();
        }
        return;
}//Функция загружает хранящийся в куках список шоу, для панели фильтрации. Сделано это для производительности, чтобы не делать лишних запросов к базе данных
function InitializeAjaxHandlers(){
    $(document).ajaxComplete(function(){
        GLOBAL_CURRENT_AJAX_STATUS = true;
    });
    $(document).ajaxSend(function(){
        GLOBAL_CURRENT_AJAX_STATUS = false;
        GLOBAL_CURRENT_AJAX_RESPONSE_STATUS = "LOAD";
    });
    $(document).ajaxError(function(){
        GLOBAL_CURRENT_AJAX_RESPONSE_STATUS = "ERROR";
    });
    $(document).ajaxSuccess(function(){
        GLOBAL_CURRENT_AJAX_RESPONSE_STATUS = "SUCCESS";
    });
}//Добавляет обработчки интерактивных запросов к документу
function InitializeOptionsButtonsHandlers(_logoutRequest) {
    $('#mainCancelButton').unbind();
    $('#mainOptionsButton').unbind();

    $('#mainCancelButton').click(function(){
        if(_logoutRequest == "True"){
            var modalWindow = showModalWindow_new("okcancel", "Выйти из программы?", "", function () {
                ClearTopLeftPanelCookies();
                window.location.href = '/logout/';
            }, false, true);
        }else{
            ClearTopLeftPanelCookies();
            window.location.href = '/logout/';
        }
    });
    $('#mainOptionsButton').click(function () {
       ShowUserOptionsIndividual();
    });
    return;
}
function InitializeMenuButtonsMiddleClick(){
    $('#mainMenuClientsButton').mousedown(function(e){
        if(e.which == 2){
            e.preventDefault();
            window.open("/clients/", '_blank');
        }

    });
    $('#mainMenuTasksButton').mousedown(function(e){
        if(e.which == 2){
            e.preventDefault();
            window.open("/tasks/", '_blank');
        }

    });
    $('#mainMenuEventsButton').mousedown(function(e){
        if(e.which == 2){
            e.preventDefault();
            window.open("/events/", '_blank');
        }

    });
    $('#mainMenuStatsButton').mousedown(function(e){
        if(e.which == 2){
            e.preventDefault();
            window.open("/stats/", '_blank');
        }

    });
    $('#mainMenuHelpButton').mousedown(function(e){
        if(e.which == 2){
            e.preventDefault();
            window.open("/help/", '_blank');
        }

    });
    $('#mainMenuControlButton').mousedown(function(e){
        if(e.which == 2){
            e.preventDefault();
            window.open("/control/", '_blank');
        }

    });

    return;
}
function InitializeEscPressHandler(){
    $(document).keyup(function (e) {
        if (e.key === "Escape") { // escape key maps to keycode `27`
            hideAllModalWindows();
            HideAllSmallChangeWindows();
        }
    });
    return;
}
function InitializePageAutoUpdater() {
    setInterval(function () {
        UpdateData(true, true, true);;
    }, 7200000);
    return;
}
function InitializeSelectTextHandler() {
    $(document).mouseup(function (e) {
        var text = GetSelectedText();
        if (text != '') {
            e.preventDefault();
        }else{
            document.getSelection().removeAllRanges();
        }
    });
    return;
}
function InitializeDeSelectTextHandler(){
    $(document).mousedown(function (e) {
        if(e.which == 1){
            document.getSelection().removeAllRanges();
        }
    });
    return;
}
function InitializeScrollHandler(){
    $(document).scroll(function () {
        if($(document).scrollTop() > 200){
            if(!CheckGoTopArrow()){
                ShowGoToTopArrow();
            }
        }else{
            if(CheckGoTopArrow()){
                HideGoTopArrow();
            }
        }
    });
    return
}
function HandlersInitialise(){
    InitializeMenuButtonsMiddleClick();
    InitializeEscPressHandler();
    InitializePageAutoUpdater();
    return;
}
function UpdateMainMenuButtons(_userType) {
    switch(_userType){
        case "admin":
            break;
        case "manager":
            $('#mainMenuControlButton').parent().remove();
            break;
        case "presentator":
            $('#mainMenuClientsButton').parent().parent().remove();
            $('#mainMenuTasksButton').parent().remove();
            $('#mainMenuControlButton').parent().remove();
            $('#mainMenuStatsButton').parent().remove();
            break;
    }
    return;
}
function StyliseMainMenuActiveButton(_buttonId) {
    $('#' +_buttonId).addClass("main-menu-elements-button-clicked");
    return;
}
function ClearTopLeftPanelCookies(){
    RemoveCookie("choosenCity");
    RemoveCookie("choosenShow");
    RemoveCookie("allowedShowList");
    return;
}
function MakeElementClickable(_element, _onclick, _params) {
    $(_element).css("cursor", "pointer");
    _element.click(
        function () {
            _onclick(_params);
        }
    );
    return;
}
function CheckForbiddenAccessTry() {
    if(RemoveRedirectMark(window.location.href)){
        ShowNotify("3", "Доступ по этой ссылке запрещен. Было выполнено перенаправление.");
    }
    return;
}
function GetCurrentChoosenCity() {
    return +$('#cityPickerTittle').attr("data-id");
}
function GetCurrentChoosenShow() {
    if($('#tabsNav').length != 0){
        return +$('#company_page_manager_work').attr("data-show-id");
    }else{
        return +$('#showPickerTittle').attr("data-id");
    }

}
function ClearSearchPanelValue() {
    $('#search_panel').find('#search_input').val("");
    return;
}
function GetSearchPanelValue() {
    return $('#search_panel').find('#search_input').val();
}
function GetCurrentUserType(){
    return $('#userTypeContainer').attr("data-user_type");
}
function HideCityShowPickers() {
    $('#cityPickerTittle').css("display", "none");
    $('#showPickerTittle').css("display", "none");
    return;
}
function ShowCityShowPickers() {
    $('#cityPickerTittle').css("display", "block");
    $('#showPickerTittle').css("display", "block");
    return;
}
function LargeFontNeed() {
    if($('#userTypeContainer').attr("data-large_font") == "True"){
        return true;
    }else{
        return false;
    }
}
function ChangeModalListFontSize() {
    if (LargeFontNeed()) {
        $(".modal_window_list").css("font-size", "14px");
    }
    return;
}
//Забирает потомков с id, начинающихся на _substring из окна с классом _container и возвращает их в формате json в виде ключ:значение
function GetVariablesFromModalToDict(_container, _substring) {
    var controls = $('.' + _container + ' [id ^= ' + _substring + ']');
    var dict = {};
    for (var i = 0; i < controls.length; i++) {
        dict[$(controls[i]).attr("id").replace(_substring + "_", "")] = $(controls[i]).val();
    }
    return JSON.stringify(dict);
}
//VALIDATORS///////////////////////////////////////////////////////
function CheckEmail(_text) {
    if (_text == "") {
        return true;
    }
    regexp = new RegExp("^((([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})(;?)(\s*))*)$");

    if (_text.search(regexp) == -1) {
        alert("Введен некорректный адрес электронной почты. Укажите правильный адрес, возможно указать несколько адресов, разделяя их символом точки с запятой (\";\")");

        return false;
    }
    else {
        return true;
    }

}//Проверка почтового адреса на валидность в форме ввода данных
function CheckSite(_text) {
    if (_text == "") {
        return true;
    }
    regexp = new RegExp("^([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$");
    if (_text.search(regexp) == -1) {
        alert("Введен некорректный адрес сайта. Укажите правильный адрес сайта (например site.ru)");

        return false;
    }
    else {
        return true;
    }

}//Проверка веб-адреса на валидность в форме ввода данных
////////////////////////////////////////////////////////////////////////////////////////////////////
function CheckDateSide(_strDate) {//Сравнивает переданную дату с текущей, если день, указанный в дате - сегодня, возвращает 0, если до: -1, если после: 1
    var year = 0;
    var month = 0;
    var day = 0;

    var hour = 0;
    var minute = 0;
    var convertedDate = ConvertDateToJSFormat(_strDate);
    if (convertedDate != "Error") {
        var converted = convertedDate;
        year = converted.getFullYear();
        month = converted.getMonth();
        day = converted.getDate();

        var hour = converted.getHours();
        var minute = converted.getMinutes();
    }
    else {

        var date = _strDate.split(" ")[0];
        year = date.split(".")[0];
        month = date.split(".")[1];
        day = date.split(".")[2];

        var time = date.split(" ")[1];
        hour = time.split(":")[0];
        minute = time.split(":")[1];
    }
    var jsDate = new Date(+year, +month, +day, +hour, +minute, 0);
    var nowDate = new Date();
    var onlyDateJsDate = new Date(+year, +month, +day, 0, 0);
    var onlyDateNowDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0);

    if (onlyDateJsDate.getTime() == onlyDateNowDate.getTime() && nowDate.getTime() > jsDate.getTime()) {
        return -2;
    }

    if (nowDate.getTime() == jsDate.getTime()) {
        return 0;
    }
    else {
        if (nowDate.getTime() < jsDate.getTime()) {
            return 1;
        }
        else {
            return -1;
        }
    }


}
function ReturnTaskStatusIconSpan(_strDate, _done) {
    var statusClasses = {
        "done": "glyphicon glyphicon-check",
        "wait": "glyphicon glyphicon-time",
        "expired": "glyphicon glyphicon-exclamation-sign"
    };
    if(!isDict(_strDate)){
        _strDate = ConvertDateFromStringValue(_strDate);
    }
    var dateSide = CheckDateSide(_strDate);
    var statusSpan = $('<span>');
    if (_done == "True" || _done == true) {
        statusSpan.addClass(statusClasses["done"]);
        statusSpan.css("color", "green");
        statusSpan.attr("title", "Выполнена");
    } else {
        if (dateSide == -2) {
            statusSpan.addClass(statusClasses["expired"]);
            statusSpan.css("color", "#337ab7");
            statusSpan.attr("title", "Просрочена по времени");
        }
        else {
            if (dateSide == -1) {
                statusSpan.addClass(statusClasses["expired"]);
                statusSpan.css("color", "red");
                statusSpan.attr("title", "Просрочена");
            } else {
                if (dateSide == 0) {
                    statusSpan.addClass(statusClasses["wait"]);
                    statusSpan.css("color", "green");
                    statusSpan.attr("title", "Сегодня");

                }
                else {
                    statusSpan.addClass(statusClasses["wait"]);
                    statusSpan.css("color", "black");
                    statusSpan.attr("title", "Ожидает выполнения");
                }
            }
        }


    }
    return statusSpan;
}
function ReturnEventStatusIconSpan(_event) {
    return EventStatusIconPick(_event["status"]);
}
function ReturnCallStatusIconStyle(_callData, _eventStartTime, _days, _button, _inList, _inputContainer) {
    var eventDate = ConvertDateFromStringValue(_eventStartTime);
    var nowDate = new Date();
    var dateDifferenceDays = (eventDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60 * 24);
    var icon = $('<span>').addClass("glyphicon glyphicon-earphone").addClass("event-call-button-icon").appendTo(_button);
    var callLabel = $('<span>').addClass("event-call-button-icon-days_count").appendTo(_button);
    if(_inList){
        icon.css("top", "-3px").css("left", "-2px");
        callLabel.css("top", "-1px").css("left", "-20px");
    }
    _button.addClass("event-call-button");

    if(_inputContainer){
        _inputContainer.css("padding-left", 7);
        switch (_days) {
            case 1:
                if (_callData["day"]["status"] == "notneed") {
                } else if (_callData["day"]["status"] == "done") {
                    _inputContainer.css("color", "green").css("border-color", "green").css("border-width", 1).val(_callData["day"]["result"]);

                } else if (dateDifferenceDays > 1) {
                    _inputContainer.css("color", "rgb(51, 122, 183)").css("border-color", "rgb(51, 122, 183)").css("border-width", 1).val("Ожидает отзвона");
                } else {
                    _inputContainer.css("color", "red").css("border-color", "red").css("border-width", 1).val("Отзвон просрочен");
                }
                break;
            case 7:
                if (_callData["week"]["status"] == "notneed") {
                } else if (_callData["week"]["status"] == "done") {
                    _inputContainer.css("color", "green").css("border-color", "green").css("border-width", 1).val(_callData["week"]["result"]);

                } else if (dateDifferenceDays > 1) {
                    _inputContainer.css("color", "rgb(51, 122, 183)").css("border-color", "rgb(51, 122, 183)").css("border-width", 1).val("Ожидает отзвона");
                } else {
                    _inputContainer.css("color", "red").css("border-color", "red").css("border-width", 1).val("Отзвон просрочен");
                }
                break;
            case 30:
                if (_callData["month"]["status"] == "notneed") {
                } else if (_callData["month"]["status"] == "done") {
                    _inputContainer.css("color", "green").css("border-color", "green").css("border-width", 1).val(_callData["month"]["result"]);

                } else if (dateDifferenceDays > 1) {
                    _inputContainer.css("color", "rgb(51, 122, 183)").css("border-color", "rgb(51, 122, 183)").css("border-width", 1).val("Ожидает отзвона");
                } else {
                    _inputContainer.css("color", "red").css("border-color", "red").css("border-width", 1).val("Отзвон просрочен");
                }
                break;
            default:
                break;
        }
    }
    switch (_days) {
        case 1:
            callLabel.text("1");
            if (_callData["day"]["status"] == "notneed") {
                _button.css("color", "gray").css("cursor", "pointer");
                _button.attr("data-status", "not_need");
                _button.attr("title", "Отзвон за день не нужен");
                (function(_but){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowNotify(3, "Отзвон за день не требуется");
                    });
                })(_button);
            } else if (_callData["day"]["status"] == "done") {
                _button.css("color", "green").css("cursor", "pointer");
                _button.attr("data-status", "done");
                _button.attr("title", "Отзвон за день выполнен (просмотреть комментарий)");
                (function(_but, _id){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowCall(_id);
                    });
                })(_button, _callData["day"]["id"]);
            } else if (dateDifferenceDays > 1) {
                _button.css("color", "rgb(51, 122, 183)").css("cursor", "pointer");
                _button.attr("data-status", "wait");
                _button.attr("title", "Ожидает отзвона за день (отметить звонок)");
            } else {
                _button.css("color", "red").css("cursor", "pointer");
                _button.attr("data-status", "expired");
                _button.attr("title", "Отзон за день просрочен (отметить звонок)");
            }
            if(_callData["day"]["status"] == "presentatorwait"){
                (function(_but){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowNotify(3, "Менеджер еще не выполнил отзвон, результат отзвона будет доступен после выполнения (цвет иконки изменится на зеленый)");
                    });
                })(_button);

            }else if(_callData["day"]["status"] == "need"){
                (function(_but, _id){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowTask(_id, false, _inputContainer);
                    });
                })(_button, _callData["day"]["id"]);
            }
            break;
        case 7:
            callLabel.text("7");
            if (_callData["week"]["status"] == "notneed") {
                _button.css("color", "gray").css("cursor", "pointer");
                _button.attr("data-status", "not_need");
                _button.attr("title", "Отзвон за неделю не нужен");
                (function(_but){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowNotify(3, "Отзвон за неделю не требуется");
                    });
                })(_button);
            } else if (_callData["week"]["status"] == "done") {
                _button.css("color", "green").css("cursor", "pointer");
                _button.attr("data-status", "done");
                _button.attr("title", "Отзвон за неделю выполнен (просмотреть комментарий)");
                (function(_but, _id){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowCall(_id);
                    });
                })(_button, _callData["week"]["id"]);
            } else if (dateDifferenceDays > 7) {
                _button.css("color", "rgb(51, 122, 183)").css("cursor", "pointer");
                _button.attr("data-status", "wait");
                _button.attr("title", "Ожидает отзвона за неделю (отметить звонок)");
            } else {
                _button.css("color", "red").css("cursor", "pointer");
                _button.attr("data-status", "expired");
                _button.attr("title", "Отзон за неделю просрочен (отметить звонок)");
            }
            if(_callData["week"]["status"] == "presentatorwait"){
                (function(_but){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowNotify(3, "Менеджер еще не выполнил отзвон, результат отзвона будет доступен после выполнения (цвет иконки изменится на зеленый)");
                    });
                })(_button);

            }else if(_callData["week"]["status"] == "need"){
                (function(_but, _id){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowTask(_id, false, _inputContainer);
                    });
                })(_button, _callData["week"]["id"]);
            }
            break;
        case 30:
            callLabel.text("30");
            if (_callData["month"]["status"] == "notneed") {
                _button.css("color", "gray").css("cursor", "pointer");
                _button.attr("data-status", "not_need");
                _button.attr("title", "Отзвон за месяц не нужен");
                (function(_but){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowNotify(3, "Отзвон за месяц не требуется");
                    });
                })(_button);
            } else if (_callData["month"]["status"] == "done") {
                _button.css("color", "green").css("cursor", "pointer");
                _button.attr("data-status", "done");
                _button.attr("title", "Отзвон за месяц выполнен (просмотреть комментарий)");
                (function(_but, _id){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowCall(_id);
                    });
                })(_button, _callData["month"]["id"]);
            } else if (dateDifferenceDays > 30) {
                _button.css("color", "rgb(51, 122, 183)").css("cursor", "pointer");
                _button.attr("data-status", "wait");
                _button.attr("title", "Ожидает отзвона за месяц (отметить звонок)");
            } else {
                _button.css("color", "red").css("cursor", "pointer");
                _button.attr("data-status", "expired");
                _button.attr("title", "Отзон за месяц просрочен (отметить звонок)");
            }
            if(_callData["month"]["status"] == "presentatorwait"){
                (function(_but){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowNotify(3, "Менеджер еще не выполнил отзвон, результат отзвона будет доступен после выполнения (цвет иконки изменится на зеленый)");
                    });
                })(_button);

            }else if(_callData["month"]["status"] == "need"){
                (function(_but, _id){
                    _but.click(function (event) {
                        event.stopPropagation();
                        ShowTask(_id, false, _inputContainer);
                    });
                })(_button, _callData["month"]["id"]);
            }
            break;
    }
    return;
}
function EventStatusIconPick(_status, _textOnly) {
    var icon = $('<span>');
    var title = "";
    switch (_status) {
        case "allowed":
            title = "Чужое мероприятие";
            icon.addClass("glyphicon glyphicon-eye-open").attr("data-status", _status);
            break;
        case "alien":
            title = "Мероприятие недоступно";
            icon.addClass("glyphicon glyphicon-lock").attr("data-status", _status);
            break;
        case "wait":
            title = "Ожидание мероприятия";
            icon.addClass("glyphicon glyphicon-time").css("color", "#337ab7").attr("data-status", _status);
            break;
        case "wait_no_result":
            title = "Ожидание конечной суммы от артиста";
            icon.addClass("glyphicon glyphicon-time").css("color", "red").attr("data-status", _status);
            break;
        case "crash":
            title = "Слетело";
            icon.addClass("glyphicon glyphicon-exclamation-sign").css("color", "white").css("top", "0px").attr("data-status", _status);
            break;
        case "wait_money":
            title = "Ожидается отправка денег артистом";
            icon.addClass("glyphicon glyphicon-usd").css("color", "#337ab7").attr("data-status", _status);
            break;
        case "late_money":
            title = "Отправка денег артистом не производится более 3 дней";
            icon.addClass("glyphicon glyphicon-usd").css("color", "red").attr("data-status", _status);
            break;
        case "success":
            title = "Успешное завершение мероприятия";
            icon.addClass("glyphicon glyphicon-check").css("color", "green").attr("data-status", _status);
            break;
        case "removed":
            title = "Мероприятие удалено";
            icon.addClass("glyphicon glyphicon-trash").css("color", "#337ab7").attr("data-status", _status);
            break;
    }
    icon.attr("title", title);
    if(_textOnly){
        return title;
    }else{
        return icon;    
    }    
}
//module
function LabelAsErrorAtFormGroup(_input) {
    _input = $(_input);
    var formGroup = $(_input).parents('.form-group');
    formGroup.removeClass("has-success has-feedback");
    formGroup.addClass("has-error has-feedback");
    $('label[for=' + _input.attr("id") + "]").css("color", "#a94442");
    if(_input.is('select')){

        if(!_input.attr("noplaceholder")){
            $(_input).attr('placeholder', 'Элементы должны быть выбраны');
            $('.select2-placeholder').focus().blur();
            //$(_input).next().find(".select2-search__field").attr("placeholder", "Элементы должны быть выбраны");
        }
        _input.next().attr("title", "Элементы должны быть выбраны");
        var input2Elem = _input.next().children().children();
        input2Elem.find(".status-icon").remove();
        input2Elem.prepend($('<span>').addClass("glyphicon glyphicon-remove status-icon").css("float", "left").css("margin-left", "3").css("top", "5").css("color", "red"));

        return;
    }
    _input.parent().find('span').remove();
    _input.after($('<span>').addClass("glyphicon glyphicon-remove form-control-feedback").attr("aria-hidden", "true"));
    return;
}
function LabelAsConfirmAtFormGroup(_input) {
    _input = $(_input);
    var formGroup = $(_input).parents('.form-group');
    formGroup.removeClass("has-error has-feedback");
    formGroup.addClass("has-success has-feedback");
    $('label[for=' + _input.attr("id") + "]").css("color", "#3c763d");
    if(_input.is('select')){
        var input2Elem = _input.next().children().children();
        input2Elem.find(".status-icon").remove();
        input2Elem.prepend($('<span>').addClass("glyphicon glyphicon-ok status-icon").css("float", "left").css("margin-left", "3").css("top", "5").css("color", "green"));
        return
    }
    _input.parent().find('span').remove();
    _input.after($('<span>').addClass("glyphicon glyphicon-ok form-control-feedback").attr("aria-hidden", "true"));
    return;
}
function TotalInputsValidator(_inputsContainer) {
    var inputs = _inputsContainer.find('input').not(".select2-search__field");
    var textareas = _inputsContainer.find('textarea');
    var selects = _inputsContainer.find('select');
    inputs = inputs.add(textareas).add(selects);
    var errorLabel = true;
    for (var i = 0; i < inputs.length; i++) {
        if ($(inputs[i]).attr('type') == "checkbox" || $(inputs[i]).attr('type') == "hidden" || $(inputs[i]).hasClass("picker__input") || $(inputs[i]).attr('checknotneed') == "checknotneed") {
            continue;
        }
        if (InputValidator(inputs[i])) {
            LabelAsConfirmAtFormGroup(inputs[i]);
        }
        else {
            LabelAsErrorAtFormGroup(inputs[i]);
            if (errorLabel) {
                errorLabel = false;
            }
        }
    }
    if (!errorLabel) {
        ShowNotify(1, "Исправьте ошибки в полях ввода данных. Для информации об ошибке, наведите курсор на поле с ошибкой.");
        ContainerLoadIndicatorHide();
    }
    return errorLabel;
}
function InputValidator(_input) {
    _input = $(_input);
    if(_input.is('select')){
        if(_input.attr("required")){
            if (_input.next().is("span") && _input.next().hasClass("select2-container")) {
                if(_input.select2("val")){
                    if (_input.select2("val").length == 0) {
                        return false;
                    } else {
                        return true;
                    }
                }else{
                    return false;
                }

            }else{
                if(_input.val() == undefined){
                    return false;
                }else{
                    return true;
                }
            }
        }else{
            return true;
        }
    }
    else{
        _input.val(_input.val().trim());
        var inputVal = $(_input).val();
        //Required checker
        if (_input.attr("required")) {
            if (inputVal == "") {
                return false;
            }
        } else if (inputVal == "") {
            _input.attr("placeholder", "Поле не обязательно для заполнения");
            return true;
        }
        //nubler only checker
        if(_input.attr("numericonly")){
            if($.isNumeric((_input.val().replace("%", ""))) || _input.val().trim() == ""){
                _input.attr("title", "В этом поле должно быть числовое значение");
                return true;
            }else{
                return false;
            }
        }
        //whitespace checker
        if(_input.attr("nospace")){
            if((/[ ]+/).test(_input.val())) {
                _input.attr("title", "В значении поля не должно быть пробелов");
                return false;
            }
        }
        //latin symbols checker
        if(_input.attr("onlylatin")){
            if((/[а-яА-яёЁ]+/).test(_input.val())){
                _input.attr("title", "В значении поля не должно быть кириллических символов");
                return false;
            }
        }
        //Email checker
        if (_input.attr("type") == "email") {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(inputVal)) {
                _input.attr("title", "Необходимо указать корректный адрес электронной почты");
                return false;
            }
        }
        //Site checker
        if(_input.attr("type") == "site"){
            var re = /^([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!re.test(inputVal)) {
                _input.attr("title", "Необходимо указать корректный адрес веб-сайта");
                return false;
            }
        }
        //length checker
        if (parseInt(_input.attr("minlength")) > parseInt(_input.val().length)) {
            _input.attr("title", "Минимальная длина поля составляет " + _input.attr("minlength") + " символов");
            return false;
        }
        _input.attr("title", "Поле заполнено верно");
        }
    return true;
}
//PICKADATE_ADDED///////////////////////////////////////////////////////////////////////////////////
function GetPickDateAPIObject(_pickadateElem) {
    return $(_pickadateElem).pickadate("picker");
}
function GetPickTimeAPIObject(_pickatimeElem) {
    return $(_pickatimeElem).pickatime("picker");
}
//LOADERS///////////////////////////////////////////////////////////////////////
//Подгрузка списка компаний в выбранном элементе select2
function Select2CompaniesLoader(_select2Elem, _url, _cityId, _choiseFormatter, _callBackWithItemParams, _loadIndicatorContainer){
    $(_select2Elem).select2({
            ajax: {
                url: _url,
                dataType: 'json',
                delay: 1000,
                data: function (params) {
                    if (params.term.includes("Выполняется поиск...")) {
                        return {
                            id: params.term.replace("Выполняется поиск...", "")
                        };
                    } else {
                        return {
                            search_string: params.term, // search term
                            city: _cityId,
                            companies: 1,
                            flat: 1
                        };
                    }

                },
                processResults: function (data, params) {
                    if (!("data" in data)) {
                        return 0;
                    } else {
                        return {
                            results: data.data["list"]
                        };
                    }
                }
            },
            escapeMarkup: function (markup) {
                return markup;
            },
            minimumInputLength: 1,
            templateResult: FormatJsonDataCompanyPicker,
            templateSelection: _choiseFormatter

        });
    //Костыль - в Select2 есть баг, вызывающий templateSelection 4! раза, соответственно летит 4 бесполезных ajax запроса
    //Поэтому установлен дополнительный обработчик выбора
    $(_select2Elem).on('select2:select', function (selection) {
        if(_callBackWithItemParams){
            _callBackWithItemParams(selection.params.data);
        }
    });
}
function FormatJsonDataCompanyPicker(data) {
    if (data.loading) {
        return data.text;
    }

    var container = $('<div>').css("width", "100%");
    var header = $('<div>').text(data.city__name + ", " + data.adress).appendTo(container);
    var content = $('<div>').css("font-weight", "bold").text(data.name).appendTo(container);
    setTimeout(function () {
        if ($('.select2-search__field').val().includes("Выполняется поиск...")) {
            $('.select2-results__option--highlighted').mouseup();
        }
    }, 100);
    return container;
}
//HELPERS///////////////////////////////////////////////////////////////////////////////////////////
function RemoveRedirectMark(_href) {
    var urlParts = _href.split("?next=");
    if (urlParts.length > 1) {
        window.history.pushState("", "", urlParts[0]);
        return true;
    }
    else {
        return false;
    }
    return;
}
function CopyTextToClipBoard(_text){
    var inputControl = $('<textarea>').attr("id", "textarea-clipboard").addClass("clipboard-copy").val(_text).appendTo("body");
    $('#textarea-clipboard').select();
    document.execCommand('copy');
    $('#textarea-clipboard').remove();
    return;
}
function RangomGenerator(_min, _max) {
    return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}
function Transliteration(_string, _charsCount) {
    var cyrilic = {
        'А': 'A', 'а': 'a', 'Б': 'B', 'б': 'b', 'В': 'V', 'в': 'v', 'Г': 'G', 'г': 'g',
        'Д': 'D', 'д': 'd', 'Е': 'E', 'е': 'e', 'Ё': 'Yo', 'ё': 'yo', 'Ж': 'Zh', 'ж': 'zh',
        'З': 'Z', 'з': 'z', 'И': 'I', 'и': 'i', 'Й': 'Y', 'й': 'y', 'К': 'K', 'к': 'k',
        'Л': 'L', 'л': 'l', 'М': 'M', 'м': 'm', 'Н': 'N', 'н': 'n', 'О': 'O', 'о': 'o',
        'П': 'P', 'п': 'p', 'Р': 'R', 'р': 'r', 'С': 'S', 'с': 's', 'Т': 'T', 'т': 't',
        'У': 'U', 'у': 'u', 'Ф': 'F', 'ф': 'f', 'Х': 'Kh', 'х': 'kh', 'Ц': 'Ts', 'ц': 'ts',
        'Ч': 'Ch', 'ч': 'ch', 'Ш': 'Sh', 'ш': 'sh', 'Щ': 'Sch', 'щ': 'sch', 'Ъ': '"', 'ъ': '"',
        'Ы': 'Y', 'ы': 'y', 'Ь': "'", 'ь': "'", 'Э': 'E', 'э': 'e', 'Ю': 'Yu', 'ю': 'yu',
        'Я': 'Ya', 'я': 'ya'
    };
    _charsCount = _charsCount || _string.length;
    if (_string.length > 0) {
        if (_charsCount > _string.length) {
            _charsCount = _string.length;
        }
    }
    else {
        _charsCount = 0;
    }

    var newString = "";

    for (i = 0; i < _charsCount; i++) {
        if (cyrilic[_string[i]]) {
            newString += cyrilic[_string[i]];
        } else {
            newString += _string[i]
        }

    }
    return newString;
}
function CloneInputValue(_inputFrom, _inputTo){
    $(_inputTo).val(_inputFrom.val());
    return;
}
function ToLog(_value) {
    console.log(_value);
}
function isFunction(_function) {
    return Object.prototype.toString.call(_function) == '[object Function]';
}
function isDict(_dict) {
    return typeof _dict==='object' && _dict!==null && !(_dict instanceof Array) && !(_dict instanceof Date);
}
function ObjClone(_value) {
    return $.parseJSON(JSON.stringify(_value));
}
function ChangePageTittle(_newTittle) {
    document.title = _newTittle;
    return;
}
function CsrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function AddCsrfToAjaxRequest(_csrftoken) {
    $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!CsrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", _csrftoken);
        }
    }
});
}
function AddErrorAjaxHandler() {
    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
            ShowNotify_LoadDataError();
    });
}
function PrintPagePart(_elemId, _type) {
    if(_type == "modalwindow"){
        $('#' + _elemId).find(".modalWindowBody").printThis();
    }else{
        $('#' + _elemId).printThis();
    }
    return;
}
function GetSelectedText(){
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
    return "";
}
function LoadFileAjax(_response){

    return;
}
function RunAdminScript() {
    var modalWindow = showModalWindow_new("okcancel", "Запустить скрипт?", false, function () {
        $.post("/aj_admin_script/", {}, function (response) {
           if(ResponseToNotify(response) == "success"){
               hideModalWindow(modalWindow);
           }
        });
    }, false, true);
    return;
}
////////////////////////////////////////////////////////////////////////////////////////////////////
function FormatJsonDataSelectionsCompanyPicker(data) {
    return data.name;
}
function FormatJsonDataSelectionsCompanyPickerForTasks(data) {
        ContainerLoadIndicatorShow($('#AddTask_show').next());
        $.post("/aj_manager_allowed_shows_for_company/", {company: data.id}, function (response) {
            var data = ResponseToNotify(response);
            if (response["status"] != "data") {
                return;
            }
            ContainerLoadIndicatorHide();
            var showsSelect = $('#AddTask_show');
            var shows = data["shows"];

            var showListIndex = 0;
            var showId = GetCurrentChoosenShow();

            for (i = 0; i < shows.length; i++) {
                $('<option>').val(shows[i]["id"]).text(shows[i]["name"]).appendTo(showsSelect);
                if(shows[i]["id"] == showId){
                    showListIndex = i;
                }
            }
            if (showId != 0) {
                $("#AddTask_show").val(shows[showListIndex]["id"]).trigger("change");
            }
        });
        return data.name;
}
function FormatJsonDataSelectionCompanyPicker_OtherData(data) {
    $('#AddEvent_companyName').val(data.name);
    $('#AddEvent_companyAdress').val(data.adress);
    $('#AddEvent_companyContacts').val(data.telephone);

    $('#AddEvent_companyName').removeAttr("readonly");
    $('#AddEvent_companyAdress').removeAttr("readonly");
    $('#AddEvent_companyContacts').removeAttr("readonly");


    if ($('#showPickerTittle').attr("data-id") == 0) {
        $("#AddEvent_artist").select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите шоу для отметки звонка.",
            language: "ru"

        });
        $("#AddEvent_artist").removeAttr("title");
        $("#AddEvent_artist").removeAttr("disabled");

        $('#AddEvent_artist').empty();


        ContainerLoadIndicatorShow($('#AddEvent_artist').next($('span')));
        $.post("/aj_manager_allowed_shows_for_company/", {company: $('#AddEvent_company').val()}, function (response) {
            $('#AddEvent_artist').empty();
            ContainerLoadIndicatorHide();
            var data = ResponseToNotify(response);
            if(response["status"] != "data"){
                return;
            }
            var shows = data["shows"];
            for (i = 0; i < shows.length; i++) {
                $('<option>').val(shows[i]["id"]).text(shows[i]["name"]).appendTo($("#AddEvent_artist"));
            }


        });
    }

    return data.name;
}
function FormatJsonDataSelectionCompanyPickerForCompanyAdder(data){
        $("#addCompany_artist").select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите шоу для отметки звонка.",
            language: "ru"

        });
        $("#addCompany_artist").removeAttr("title");
        $("#addCompany_artist").removeAttr("disabled");

        $('#addCompany_artist').empty();


        ContainerLoadIndicatorShow($('#addCompany_artist').next($('span')));
        $.post("/aj_manager_allowed_shows_for_company/", {company: $('#addCompany_company').val()}, function (response) {
            $('#addCompany_artist').empty();
            ContainerLoadIndicatorHide();
            var data = ResponseToNotify(response);
            if(response["status"] != "data"){
                return;
            }
            var shows = data["shows"];
            for (var i = 0; i < shows.length; i++) {
                $('<option>').val(shows[i]["id"]).text(shows[i]["name"]).appendTo($("#addCompany_artist"));
            }

        });
        return;
}