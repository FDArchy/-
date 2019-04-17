//NEW CALENDAR FRAME/////////////////////////////////////////////////////////////////////
function SCCalendar(_container, _types, _urls, _functions, _params, _buttons) {

    //Контейнер, содержащий календарь
    var scCalContainer;

    //ССЫЛКИ
    //Ссылка на POST для добавления события
    var addEventUrl = _urls["add"];
    //Ссылка на POST для просмотра события
    var showEventUrl = _urls["show"];
    //Ссылка на POST для получения списка событий
    var listEventsUrl = _urls["all"];
    //Ссылка на POST для получения страниц
    var paginationUrl = _urls["paginator"];

    var myCalFrameDataUrl = _urls["mycal_frame_data"];
    //ФУНКЦИИ
    //Функция для получения даты из события
    var TransformDateFunction = _functions["transformDate"];
    //Функция для добавления мероприятия
    var AddEventFunction = _functions["addEvent"];
    //Функция для просмотра мероприятия
    var ShowEventFunction = _functions["showEvent"];

    //Функции для оформления в списках
    var OldCalDecoration = _functions["oldcal"];
    var ListEventDecoration = _functions["event_in_list"];
    var WeekEventDecoration = _functions["week"];

    var AdditionFunction = _functions["addition"];
    //ПАРАМЕТРЫ
    var addEventParams = _params["add_event"];
    var postVars = _params["post_vars"];
    var cookiePath = _params["cookie_path"] ? _params["cookie_path"] : "/";

    var passedDaysMark = _params["passed_days"];
    //Текущий тип календаря
    var currentCalType = $.cookie("calType") || "oldcal";
    //Текущая опция календаря
    var currentCalOptions = $.cookie("calOption") || "company";
    //Метка только собственных мероприятий
    if (_buttons) {
        if ("only_own" in _buttons) {
            var onlyOwn = $.cookie("onlyOwn") || "false";
        } else {
            var onlyOwn = undefined;
        }
        if ("chat" in _buttons) {
            var chatButton = true;
        } else {
            var chatButton = false;
        }
    } else {
        onlyOwn = undefined;
        chatButton = undefined;
    }


    //Переменные даты:
    var choosenYear;
    var choosenMonth;
    var choosenDate;

    //Инициализаторы
    try {
        //Контейнер календаря
        if (typeof(_container) == "string") {
            scCalContainer = $('#' + _container);
        }
        else {
            scCalContainer = $(_container);
        }

    } catch (e) {
        alert("Ошибка при определении контейнера календаря. (_container - первый аргумент CreateCalendar)");
        return;
    }
    
    var PaginatorPageUpdater = undefined;
    //Геттеры сеттеры
    function ChangeChoosenDate(_year, _month, _date) {
        var year = _year || choosenYear;
        var month = (_month != undefined) ? _month : choosenMonth;
        var date = (_date != undefined) ? _date : choosenDate;

        var jsDate = new Date(year, month - 1, date);
        choosenYear = jsDate.getFullYear();
        choosenMonth = jsDate.getMonth() + 1;
        choosenDate = jsDate.getDate();
        return;
    }

    function CurrentCalOptions(_calOptions) {
        if (arguments.length == 0) {
            return currentCalOptions;
        } else {
            currentCalOptions = _calOptions;
        }
        return;
    }

    function CurrentCalType(_calType) {
        if (arguments.length == 0) {
            return currentCalType;
        } else {
            currentCalType = _calType;
        }
        return;
    }

    function OwnPostVars(_key, _newValue) {
        if (_key in postVars) {
            postVars[_key] = _newValue;
        }
        else {
            alert("Ошибка редактирования добавочной переменной");
        }
        return;
    }

    //Создание календаря
    this.Create = function () {
        $(scCalContainer).empty();
        InitialiseCurrentDate();
        MakeCarcass();
        SwitchCalButtons(currentCalType, currentCalOptions);
        return this;
    };
    this.Update = function () {
        UpdateData();
        return;
    };
    this.UpdateEvents = function () {
        if(PaginatorPageUpdater){
            PaginatorPageUpdater();
        }
        return;
    };
    this.PostVarChange = function (_key, _newValue) {
        OwnPostVars(_key, _newValue);
    };
    this.AddEventParamsChange = function (_vars_list) {
        addEventParams = _vars_list;
    };
    this.CurrentCalType = function () {
        return currentCalType;
    };
    this.CurrentCalOption = function () {
        return currentCalOptions;
    };
    //Создание основого каркаса календаря внутри контейнера
    function MakeCarcass() {
        //Создание обертки фрейма
        //Верхняя обертка

        var topContainer = $('<div>').attr("id", "calFrame").addClass("container-fluid");


        var calendarHeaderContainer = $('<div>').attr("id", "calendarHeader").appendTo(topContainer);
        var calendarContentContainer = $('<div>').attr("id", "calendarContent").css("width", "auto").css("position", "relative").appendTo(topContainer);

        var calendarEventsContainer = $('<div>').attr("id", "calendarEvents").css("margin", "0 auto").css("width", "85%").appendTo(topContainer);

        //Заголовок
        var headerTable = $('<table>').css("width", "100%").appendTo(calendarHeaderContainer);
        var headerTableTr = $('<tr>').appendTo(headerTable);

        var headerTableTd = $('<td>').css("width", "33.33%").css("text-align", "left").appendTo(headerTableTr);
        var optionalButtonsContainer = $('<div>').attr("id", "calendarHeader_optionalButtons").appendTo(headerTableTd);

        var headerTableTd = $('<td>').css("width", "33.33%").css("text-align", "center").appendTo(headerTableTr);
        var middleButtonsContainer = $('<div>').attr("id", "calendarHeader_todayButton").appendTo(headerTableTd);
        var todayButton = $('<button>').attr("title", "Сегодня").addClass("btn btn-primary btn-sm").attr("id", "calendarTodayButton").appendTo(middleButtonsContainer);
        var todayButtonIcon = $('<span>').addClass("glyphicon glyphicon-record").css("margin-bottom", 3).appendTo(todayButton);
        todayButton.click(function () {
            TodayButtonClick();
        });

        var headerTableTd = $('<td>').css("width", "33.33%").css("text-align", "right").appendTo(headerTableTr);
        var calTypeButtonsContainer = $('<div>').attr("id", "calendarHeader_typeButtons").appendTo(headerTableTd);

        if (chatButton) {
            var currentCityChatButton = $('<button>').attr("title", "Чат с артистом текущего города").addClass("btn btn-primary btn-sm").css("margin-right", "3px").appendTo(calTypeButtonsContainer);
            var currentCityChatButtonIcon = $('<span>').addClass("glyphicon glyphicon-list").css("top", "0px").appendTo(currentCityChatButton);
        }

        var printButton = $('<button>').attr("title", "Печать календаря").addClass("btn btn-primary btn-sm").css("background-color", "green").css("margin-right", "30px").appendTo(calTypeButtonsContainer);
        $('<span>').addClass("glyphicon glyphicon-print").appendTo(printButton);
        printButton.click(function () {
            PrintPagePart("calFrame");
        });

        if (onlyOwn != undefined) {
            var onlyOwnEventsChecker = $('<span>').attr("id", "onlyOwnContainer").attr("title", "Только собственные события").css("color", "rgb(66, 139, 202)").css("margin-top", "10px").css("width", "100%").css("text-align", "left").appendTo(calTypeButtonsContainer);
            var onlyOwnEventsCheckBox = $('<input>').attr("type", "checkbox").attr("id", "onlyOwn").appendTo(onlyOwnEventsChecker);
            if (onlyOwn != "false") {
                onlyOwnEventsCheckBox.attr("checked", true);
            }
            onlyOwnEventsCheckBox.click(function () {
                WriteCookie({"onlyOwn": $('#onlyOwn').prop("checked")}, cookiePath);
                UpdateData();
            });

            var onlyOwnEventsCheckBoxLabel = $('<label>').attr("for", "onlyOwn").addClass("header").css("user-select", "none").appendTo(onlyOwnEventsChecker);
            var onlyOwnEventsCheckBoxLabelIcon = $('<span>').addClass("glyphicon glyphicon-lock").css("position", "relative").css("left", "-24px").css("top", "-0.3px").css("font-size", "7px").appendTo(onlyOwnEventsCheckBoxLabel)
            $('<span>').html("&nbsp").appendTo(onlyOwnEventsCheckBoxLabel)
        }

        var changeViewButton = $('<button>').attr("title", "Классический вид").addClass("btn btn-primary btn-sm").attr("data-cal_type", "oldcal").appendTo(calTypeButtonsContainer);
        var changeViewButtonIcon = $('<span>').addClass("glyphicon glyphicon-th").appendTo(changeViewButton);
        changeViewButton.click(function () {
            SwitchCalButtons($(this).attr('data-cal_type'), "company");
        });

        var changeViewButton = $('<button>').attr("title", "MyCal вид").addClass("btn btn-primary btn-sm").attr("data-cal_type", "mycal").appendTo(calTypeButtonsContainer);
        var changeViewButtonIcon = $('<span>').addClass("glyphicon glyphicon glyphicon-calendar").appendTo(changeViewButton);
        changeViewButton.click(function () {
            SwitchCalButtons($(this).attr('data-cal_type'), "month");
        });

        var changeViewButton = $('<button>').attr("title", "Список в диапазоне").addClass("btn btn-primary btn-sm").attr("data-cal_type", "datelist").appendTo(calTypeButtonsContainer);
        var changeViewButtonIcon = $('<span>').addClass("glyphicon glyphicon-transfer").appendTo(changeViewButton);
        changeViewButton.click(function () {
            SwitchCalButtons($(this).attr('data-cal_type'), "month");
        });

        var changeViewButton = $('<button>').attr("title", "Полный список").addClass("btn btn-primary btn-sm").attr("data-cal_type", "fulllist").appendTo(calTypeButtonsContainer);
        var changeViewButtonIcon = $('<span>').addClass("glyphicon glyphicon-list").appendTo(changeViewButton);
        changeViewButton.click(function () {
            SwitchCalButtons($(this).attr('data-cal_type'));
        });

        var eventsPaginatorContainer = $('<div>').addClass("vertical-center").appendTo(calendarEventsContainer);
        var eventsPaginator = $('<ul>').attr("id", "calendarEvents_paginator").addClass("pagination-text-color pagination pagination-sm pagination-text").css("margin-top", "5px").appendTo(eventsPaginatorContainer);
        var eventsContent = $('<div>').attr("id", "calendarEvents_content").css("margin-top", "5px").appendTo(calendarEventsContainer);

        scCalContainer.append(topContainer);
        return;
    }

    function InitialiseCurrentDate() {
        var nowDateTime = new Date();
        ChangeChoosenDate(nowDateTime.getFullYear(), nowDateTime.getMonth() + 1, nowDateTime.getDate());
        return;
    }

    //MYCAL VIEW========================================================================================================================================================
    //Отключение и включение обработчиков кнопок сдвига даты на период и на год на время действия анимации
    function DisableActiveElements() {
        $('#leftArrow').unbind("click");
        $('#rightArrow').unbind("click");
        $('#centralSmallBackArrow').unbind("click");
        $('#centralSmallForwardArrow').unbind("click");
        return;
    }

    function EnableActiveElements(_bindFunction) {
        $('#leftArrow').bind("click", function () {
            _bindFunction($('#leftArrow').attr("data-direction"))
        });
        $('#rightArrow').bind("click", function () {
            _bindFunction($('#rightArrow').attr("data-direction"))
        });
        $('#centralSmallBackArrow').bind("click", function () {
            _bindFunction($('#centralSmallBackArrow').attr("data-direction"))
        });
        $('#centralSmallForwardArrow').bind("click", function () {
            _bindFunction($('#centralSmallForwardArrow').attr("data-direction"))
        });
        return;
    }

//Создание элемента месяца (для вида трех месяцев и для вида года)
    function CreateMonth(_year, _month, _yearClickFunction, _monthClickFunction) {
        //Преобразование месяца в js формат
        _month = _month - 1;
        //Создание каркаса
        var container = $('<div>').css("width", 300).css("height", 325).css("margin-left", "10px").css("margin-right", "10px");
        var header = $('<div>').appendTo(container);
        var headerMonth = $('<span>').attr("title", "Просмотр месяца").addClass("month-header_decoration headerMonth").html(ConvertMonthFromNumberToName(_month, false, true)).appendTo(header);
        var headerYear = $('<span>').attr("title", "Просмотр года").addClass("month-header_decoration headerYear").html(_year).appendTo(header);

        var content = $('<div>').appendTo(container);
        var table = $('<table>').attr("data-year", _year).attr("data-month", _month + 1).css("table-layout", "fixed").css("border-spacing", "3").css("border-collapse", "separate").appendTo(content);
        var tr = $('<tr>').appendTo(table);

        //Элемент даты для заполнения месяца
        var dateForFill = new Date(_year, _month, 1);

        //Сдвиг в зависимости от дня недели (с понедельника)
        if (dateForFill.getDay() == 0) {
            dateForFill.setDate(dateForFill.getDate() - 6);
        } else {
            dateForFill.setDate(dateForFill.getDate() - dateForFill.getDay() + 1);
        }

        //Заполнение дней недели
        for (var i = 1; i < 7; i++) {
            th = $('<th>').text(ConvertWeekDayFromNumberToName(i, true)).addClass("month-day_of_week_decoration").appendTo(tr);
        }
        var th = $('<th>').text(ConvertWeekDayFromNumberToName(0, true)).addClass("month-day_of_week_decoration").appendTo(tr);
        //Заполнение дней
        for (var i = 0; i < 6; i++) {
            tr = $('<tr>').appendTo(table);
            for (var j = 0; j < 7; j++) {
                if (dateForFill.getMonth() == _month) {

                    var td = $('<td>').attr("data-date", dateForFill.getDate()).addClass("month_day-decoration").attr("title", "Показать события").appendTo(tr);

                    if (passedDaysMark) {
                        if (PassedDateChecker(dateForFill)) {
                            td.css("background-color", "#d4d4d452");
                        }
                    }

                    (function (closure) {
                        closure.click(function () {

                            ClearEvents();
                            ChooseDate(closure);
                            UpdateEventsPagination();
                        })
                    }(td));

                    var dayDiv = $('<div>').addClass("month_day-date-decoration").attr("title", "Просмотр недели").attr("data-date", dateForFill.getDate()).html(dateForFill.getDate()).appendTo(td);

                    (function (closure, _td) {
                        dayDiv.click(function (event) {
                            event.stopPropagation();
                            ChooseDate(_td);
                            ChangeFrame(false, "week", _year, _month + 1, closure);
                        });
                    })(dateForFill.getDate(), td);
                    if (dateForFill.getDate() == new Date().getDate() && dateForFill.getMonth() == new Date().getMonth() && dateForFill.getFullYear() == new Date().getFullYear()) {
                        dayDiv.addClass("month_day-date-decoration_today");
                    }
                    if (dateForFill.getDay() == 6 || dateForFill.getDay() == 0) {
                        dayDiv.addClass("month_day-date-decoration_offday").attr("title", "Просмотр недели");
                    }
                    if (dateForFill.getDate() == choosenDate && dateForFill.getMonth() + 1 == choosenMonth && dateForFill.getFullYear() == choosenYear) {

                        ChooseDate(td);
                    }
                } else {
                    td = $('<td>').css("height", "35").css("width", "35").appendTo(tr);

                }

                dateForFill.setDate(dateForFill.getDate() + 1);
            }
        }

        //Обработчик клика на месяц
        if (_monthClickFunction) {
            headerMonth.click(function () {
                CurrentCalOptions("month");
                _monthClickFunction();
            });
        }
        //Обработчик клика на год
        if (_yearClickFunction) {
            headerYear.click(function () {
                CurrentCalOptions("year");
                _yearClickFunction();
            });
        }
        return container;
    }

//Создание элемента дня (для недельного вида)
    function CreateDay(_year, _month, _date) {
        //Преобразование месяца в js формат
        _month = _month - 1;

        var choosenDateInJS = new Date(_year, _month, _date);

        //Создание каркаса
        var container = $('<div>').css("width", 130);

        var divHeader = $('<div>').css("margin-bottom", 7).appendTo(container);
        var divHeaderMonthYear = $('<div>').addClass("week-month_year-decoration").css("text-align", "center").appendTo(divHeader);
        var divHeaderDate = $('<div>').addClass("week-dayofweek_date-decoration").appendTo(divHeader);

        //Особое оформление для сегодняшнего дня
        if (choosenDateInJS.getDate() == new Date().getDate() && choosenDateInJS.getMonth() == new Date().getMonth() && choosenDateInJS.getFullYear() == new Date().getFullYear()) {
            divHeader.addClass("month_day-date-decoration_today");
        }
        var divHeaderDayOfWeek = $('<div>').addClass("week-dayofweek_date-decoration").appendTo(divHeader);

        var spanHeaderDayOfWeek = $('<span>').html(ConvertWeekDayFromNumberToName(new Date(_year, _month, _date).getDay(), false)).appendTo(divHeaderDayOfWeek);
        var spanHeaderDate = $('<span>').addClass("month-header_decoration").html(_date).appendTo(divHeaderDate);

        //Обработчик при клике на день - задание текущей даты и выделение дня в каледаре
        (function (day) {
            day.click(function () {
                ChooseDate(day, true);
            });
        })(spanHeaderDate);

        //Выделение выбранного дня
        if (_date == choosenDate && _month + 1 == choosenMonth && _year == choosenYear) {
            ChooseDate(spanHeaderDate, true);
        }

        //Месяц с обработчиком клика
        var spanHeaderMonth = $('<span>').addClass("month-header_decoration").html(ConvertMonthFromNumberToName(_month, false, true) + " ").data("year", _year).data("month", _month + 1).appendTo(divHeaderMonthYear);
        spanHeaderMonth.click(function () {
            CurrentCalOptions("month");
            CloseWeekFrame(function () {
                ShowThreeMonthFrame(_year, _month + 1);
                UpdateData();
                WriteCookie({"mycal_option": "month"}, cookiePath);
            });
        });
        //Год с обработчиком клика
        var spanHeaderYear = $('<span>').addClass("month-header_decoration").data("year", _year).html(_year).appendTo(divHeaderMonthYear);
        spanHeaderYear.click(function () {
            CurrentCalOptions("year");
            CloseWeekFrame(function () {
                ShowYearFrame(_year);
                UpdateData();
                WriteCookie({"mycal_option": "year"}, cookiePath);
            });
        });

        //Заполнение дня по часам с шагом 1
        var divContent = $('<div>').appendTo(container);
        if (passedDaysMark) {
            if (PassedDateChecker(choosenDateInJS)) {
                divContent.css("background-color", "#d4d4d452");
            }
        }
        var tableContent = $('<table>').css("margin", "0 auto").css("border-collapse", "separate").appendTo(divContent);

        for (var i = 6; i < 21; i++) {
            var trContent = $('<tr>').addClass("week-add_event-decoration").appendTo(tableContent);
            var hourContent = ConvertDateComponentTo2CharsFormat(i);

            var tdContentHour = $('<td>').addClass("week-hour-decoration").html(hourContent + ":00").appendTo(trContent);
            var tdContent = $('<td>').attr("data-hour", ConvertDateComponentTo2CharsFormat(i)).addClass("week-event-decoration").css("width", 100).appendTo(trContent);

            tdContentHour.click(function () {
                var dateComponentsContainer = $(this).parents('[data-date]');
                if (PassedDateChecker(new Date(+dateComponentsContainer.attr("data-year"), +dateComponentsContainer.attr("data-month") - 1, +dateComponentsContainer.attr("data-date"))) && passedDaysMark) {
                    ShowNotify(3, "Невозможно добавить событие на уже прошедшую дату");
                } else {
                    //Функция добавления мероприятия с контекстом - параметрами
                    AddEventFunction.apply(FillDateTimeDict(+dateComponentsContainer.attr("data-year"), +dateComponentsContainer.attr("data-month"), +dateComponentsContainer.attr("data-date"), $(this).next().attr("data-hour"), 0), addEventParams);
                }
            });
        }

        return container;
    }

//Выбор дня в календаре mycal ()
    function ChooseDate(_this, _week, _oldcal) {
        if (_oldcal) {
            var choosenDateComponents = $(_this).attr("data-date").split(".");
            year = choosenDateComponents[0];
            month = choosenDateComponents[1];
            date = choosenDateComponents[2];
        } else if (_week) {
            $('div').removeClass("month_day_choosen-decoration");
            $(_this).parent().parent().parent().addClass("month_day_choosen-decoration");

            var date = $(_this).parent().parent().parent().parent().attr("data-date");
            if (!date) {
                date = choosenDate;
            }
            var month = $(_this).parent().parent().parent().parent().attr("data-month");
            if (!month) {
                month = choosenMonth;
            }
            var year = $(_this).parent().parent().parent().parent().attr("data-year");
            if (!year) {
                choosenYear;
            }
        } else {
            $('td').removeClass("month_day_choosen-decoration");
            $(_this).addClass("month_day_choosen-decoration");

            date = $(_this).attr("data-date");
            month = $(_this).parent().parent().attr("data-month");
            year = $(_this).parent().parent().attr("data-year");
        }
        ChangeChoosenDate(year, month, date);

        return;

    }

//Показ календаря с тремя месяцами
    function ShowThreeMonthFrame(_year, _month) {

        //Задание стандартных значений
        var year = _year || choosenYear;
        var month = _month || choosenMonth;
        //Отметка кнопки подопции в заголовке
        ClickedButtonDecorationChange("calendarHeader_optionalButtons", "month");
        //Заполнение значений даты для трех месяцев
        var dateFiller = new Date(year, +month - 2, 1);
        var leftYear = dateFiller.getFullYear();
        var leftMonth = dateFiller.getMonth() + 1;
        dateFiller.setMonth(dateFiller.getMonth() + 1);
        var middleYear = dateFiller.getFullYear();
        var middleMonth = dateFiller.getMonth() + 1;
        dateFiller.setMonth(dateFiller.getMonth() + 1);
        var rightYear = dateFiller.getFullYear();
        var rightMonth = dateFiller.getMonth() + 1;

        //Создание каркаса для месяцев и стрелок влево вправо
        var tableFrame = $('<table>').attr("id", "contentFrame").css("overflow", "hidden").css("width", "55%").css("text-align", "center").css("margin", "0 auto");
        var trFrame = $('<tr>').appendTo(tableFrame);
        //Стрелка влево
        var td = $('<td>').css("left", -600).css("position", "relative").appendTo(trFrame);
        td.append($('<span>').attr("id", "leftArrow").attr("data-direction", "back").addClass("glyphicon glyphicon-chevron-left change_month_arrow change_month_arrow-left").click(function () {
            ShiftMonth($('#leftArrow').attr("data-direction"));
        }));
        //Стрелки в верхней панели
        $('#centralSmallBackArrow').bind("click", function () {
            ShiftMonth($('#centralSmallBackArrow').attr("data-direction"))
        });
        $('#centralSmallForwardArrow').bind("click", function () {
            ShiftMonth($('#centralSmallForwardArrow').attr("data-direction"))
        });
        //Появление - вылет слева
        td.animate({"left": 0}, 500);
        //Основной контент календаря - 3 месяца
        var td = $('<td>').css("margin-left", 10).css("margin-right", 10).appendTo(trFrame);
        var divContent = $('<div>').css("width", "100%").css("overflow", "hidden").css("position", "relative").appendTo(td);
        var tableContent = $('<table>').css("text-align", "center").css("margin", "0 auto").appendTo(divContent);
        var trContent = $('<tr>').attr("id", "monthFrameContainer").appendTo(tableContent);
        td = $('<td>').css("left", -400).appendTo(trContent);
        td.animate({"left": 0}, 500);
        td.attr("id", "monthFrameLeft").attr("data-month", leftMonth).attr("data-year", leftYear).css("position", "relative").append(CreateMonth(leftYear, leftMonth, function () {
            CloseThreeMonthFrame(function () {
                ShowYearFrame(leftYear);
                UpdateData();
                WriteCookie({"mycal_option": "year"}, cookiePath);
            });
        }, function () {
            ShiftMonth("back");
        }));
        td = $('<td>').css("bottom", -400).appendTo(trContent);
        td.animate({"bottom": 0}, 500);
        td.attr("id", "monthFrameMiddle").attr("data-month", middleMonth).attr("data-year", middleYear).css("position", "relative").append(CreateMonth(middleYear, middleMonth, function () {
            CloseThreeMonthFrame(function () {
                ShowYearFrame(leftYear);
                UpdateData();
                WriteCookie({"mycal_option": "year"}, cookiePath);
            });
        }));
        td = $('<td>').css("left", 400).appendTo(trContent);
        td.animate({"left": 0}, 500);
        td.attr("id", "monthFrameRight").attr("data-month", rightMonth).attr("data-year", rightYear).css("position", "relative").append(CreateMonth(rightYear, rightMonth, function () {
            CloseThreeMonthFrame(function () {
                ShowYearFrame(leftYear);
                UpdateData();
                WriteCookie({"mycal_option": "year"}, cookiePath);
            });
        }, function () {
            ShiftMonth("forward");
        }));

        //Стрелка вправо
        var td = $('<td>').css("left", 600).css("position", "relative").appendTo(trFrame);
        td.append($('<span>').attr("id", "rightArrow").attr("data-direction", "forward").addClass("glyphicon glyphicon-chevron-right change_month_arrow change_month_arrow-right").click(function () {
            ShiftMonth($('#rightArrow').data("direction"));
        }));
        td.animate({"left": 0}, 500);

        //Задание высоты для обрезки полосы прокрутки
        $('#calendarContent').css("height", 326).append(tableFrame);
    }

//Закрытие трехмесячного календаря (с анимацией)
    function CloseThreeMonthFrame(_callBack) {
        if (CurrentCalType() != "mycal") {
            DefaultCloseFrame();
            return;
        }
        //Отключение обработчиков на центральных кнопках
        $('#centralSmallBackArrow').unbind("click");
        $('#centralSmallForwardArrow').unbind("click");
        //Анимационные разлеты кусков фрейма
        $('#monthFrameLeft').animate({"left": -400}, 500);
        $('#monthFrameMiddle').animate({"bottom": -400}, 500);
        $('#monthFrameRight').animate({"left": 400}, 500);
        $('#leftArrow').parent().animate({"left": -600}, 500);
        $('#rightArrow').parent().animate({"left": 600}, 500);
        //Удаление контента
        setTimeout(function () {
            ClearEvents();
            $('#calendarContent').empty();
            if (_callBack) {
                _callBack();
            }

        }, 520);

    }

//Клик на кнопки влево и вправо - сдвиг по одному месяцу
    function ShiftMonth(_direction) {
        //Направление вправо
        if (_direction == "forward") {
            var nextYear = +$('#monthFrameRight').attr("data-year");
            var nextMonth = +$('#monthFrameRight').attr("data-month") + 1;
            if (nextMonth == 13) {
                nextYear += 1;
                nextMonth = 1;
            }
            var monthFrameLeftOld = $('#monthFrameLeft');
            var monthFrameMiddleOld = $('#monthFrameMiddle');
            var monthFrameRightOld = $('#monthFrameRight');

            var monthFrameNew = $('<td>').css("position", "absolute").attr("id", "monthFrameNew").attr("data-month", nextMonth).attr("data-year", nextYear).append(CreateMonth(nextYear, nextMonth, function () {
                CloseThreeMonthFrame(function () {
                    ShowYearFrame(nextYear);
                });
            }, function () {
                ShiftMonth("forward");
            }));

            $('#monthFrameContainer').append(monthFrameNew);

            DisableActiveElements();

            monthFrameLeftOld.animate({left: +$('#monthFrameLeft').css("left").replace("px", "") - $('#monthFrameLeft').outerWidth()}, 500);
            monthFrameMiddleOld.animate({left: +$('#monthFrameMiddle').css("left").replace("px", "") - $('#monthFrameMiddle').outerWidth()}, 500);
            monthFrameRightOld.animate({left: +$('#monthFrameRight').css("left").replace("px", "") - $('#monthFrameRight').outerWidth()}, 500);

            monthFrameNew.animate({left: +$('#monthFrameNew').css("left").replace("px", "") - $('#monthFrameNew').outerWidth()}, 500, false, function () {
                monthFrameMiddleOld.attr("id", "monthFrameLeft");
                monthFrameRightOld.attr("id", "monthFrameMiddle");
                monthFrameNew.attr("id", "monthFrameRight");


                monthFrameLeftOld.attr("id", "monthFrameRemove");

                monthFrameLeftOld.remove();
                monthFrameMiddleOld.css("left", 0);
                monthFrameRightOld.css("left", 0);
                monthFrameNew.css("position", "relative").css("left", 0);

                EnableActiveElements(ShiftMonth);

                $('#monthFrameLeft').children("div").children("div").children("span.headerMonth").click(function () {
                    ShiftMonth("back");
                });
                $('#monthFrameMiddle').children("div").children("div").children("span.headerMonth").unbind("click");

            });


        }
        //Направление влево
        else {
            var prevYear = +$('#monthFrameLeft').data("year");
            var prevMonth = $('#monthFrameLeft').data("month") - 1;
            if (prevMonth == 0) {
                prevYear -= 1;
                prevMonth = 12;
            }
            var monthFrameLeftOld = $('#monthFrameLeft');
            var monthFrameMiddleOld = $('#monthFrameMiddle');
            var monthFrameRightOld = $('#monthFrameRight');

            var monthFrameNew = $('<td>').css("position", "absolute").css("left", -monthFrameRightOld.outerWidth()).attr("id", "monthFrameNew").attr("data-month", prevMonth).attr("data-year", prevYear).append(CreateMonth(prevYear, prevMonth, function () {
                CloseThreeMonthFrame(function () {
                    ShowYearFrame(prevYear);
                });
            }, function () {
                ShiftMonth("back");
            }));

            $('#monthFrameContainer').prepend(monthFrameNew);

            DisableActiveElements();

            monthFrameLeftOld.animate({left: +$('#monthFrameLeft').css("left").replace("px", "") + $('#monthFrameLeft').outerWidth()}, 500);
            monthFrameMiddleOld.animate({left: +$('#monthFrameMiddle').css("left").replace("px", "") + $('#monthFrameMiddle').outerWidth()}, 500);
            monthFrameRightOld.animate({left: +$('#monthFrameRight').css("left").replace("px", "") + $('#monthFrameRight').outerWidth()}, 500);

            monthFrameNew.animate({left: +monthFrameNew.css("left").replace("px", "") + monthFrameNew.outerWidth()}, 500, false, function () {
                monthFrameMiddleOld.attr("id", "monthFrameRight");
                monthFrameLeftOld.attr("id", "monthFrameMiddle");
                monthFrameNew.attr("id", "monthFrameLeft");


                monthFrameRightOld.attr("id", "monthFrameRemove");
                monthFrameRightOld.remove();

                monthFrameMiddleOld.css("left", 0);
                monthFrameLeftOld.css("left", 0);
                monthFrameNew.css("position", "relative").css("left", 0);
                EnableActiveElements(ShiftMonth);
                $('#monthFrameMiddle').children("div").children("div").children("span.headerMonth").unbind("click");
                $('#monthFrameRight').children("div").children("div").children("span.headerMonth").click(function () {
                    ShiftMonth("forward");
                });
            });

        }
        FillMyCalFrameCounters();
        return;

    }

//Показ фрейма с 12 месяцами
    function ShowYearFrame(_year) {
        var year = _year || choosenYear;
        //Отметка кнопки подопции в заголовке
        ClickedButtonDecorationChange("calendarHeader_optionalButtons", "year");

        var yearFrame = ShowYearFrame_GenerateContent(year);
        $('#calendarContent').css("height", 675).append(yearFrame);

        //Делаем высоту контейнера равной высоте таблицы с данными
        $('#calendarInnerContent').children().css("width", $('#calendarInnerContent').children().children().children().css("width"));
        $('#calendarInnerContent').children().css("height", +($('#calendarInnerContent').children().children().children().css("height").replace("px", "")) + 4);
    }

//Генерация основного контента для фрейма с 12 месяцами
    function ShowYearFrame_GenerateContent(_year, _onlyInnerContent) {
        //Контейнер
        var divFrame = $('<div>').attr("id", "contentFrame").attr("data-year", _year);
        //Название года с плавным проявлением
        var spanYearName = $('<div>').css("opacity", "0").attr("id", "yearHeader").css("position", "relative").addClass("year-header_decoration").html(_year).appendTo(divFrame);

        //Фрейм со стрелками влевовправо
        var tableFrame = $('<table>').css("overflow", "hidden").css("width", "900px").css("text-align", "center").css("margin", "0 auto").appendTo(divFrame);
        var trFrame = $('<tr>').appendTo(tableFrame);


        spanYearName.animate({"opacity": 1}, 600);
        var td = $('<td>').css("left", -600).css("position", "relative").appendTo(trFrame);
        td.append($('<span>').attr("id", "leftArrow").attr("data-direction", "back").addClass("glyphicon glyphicon-chevron-left change_month_arrow change_month_arrow-left").click(function () {
            ShiftYear($('#leftArrow').attr("data-direction"));
        }));

        td.animate({"left": 0}, 500);

        //Контейнеры для месяцев
        var innerContentTD = $('<td>').attr("id", "calendarInnerContent").css("position", "relative").appendTo(trFrame);
        var divContent = $('<div>').css("position", "relative").appendTo(innerContentTD);
        var divInner = $('<div>').css("position", "absolute").css("left", "-27%").css("top", "-24%").css("transform", "scale(0.65)").appendTo(divContent);

        var tableContent = $('<table>').css("text-align", "center").css("margin", "0 auto").appendTo(divInner);

        //Заполнение месяцев
        var counter = 1;
        for (var x = 0; x < 3; x++) {
            var trContent = $('<tr>').appendTo(tableContent);
            for (var y = 0; y < 4; y++) {
                td = $('<td>').attr("data-month", counter).attr("data-year", _year).css("position", "relative").appendTo(trContent);
                if (counter <= 4) {
                    td.css("top", -800);
                    td.animate({"top": 0}, 600);
                }
                if (counter > 4 && counter <= 6) {
                    td.css("left", -800);
                    td.animate({"left": 0}, 600);
                }
                if (counter > 6 && counter <= 8) {
                    td.css("left", 800);
                    td.animate({"left": 0}, 600);
                }
                if (counter > 8) {
                    td.css("top", 800);
                    td.animate({"top": 0}, 600);
                }
                (function (counterClosed) {
                    td.append($(CreateMonth(_year, counter, false, function () {
                        CloseYearFrame(function () {
                            ShowThreeMonthFrame(_year, counterClosed);
                            WriteCookie({"mycal_option": "month"}, cookiePath);
                            UpdateData();
                        })
                    })));
                })(counter);
                counter++;
            }
        }

        td = $('<td>').css("left", 600).css("position", "relative").appendTo(trFrame);
        td.append($('<span>').attr("id", "rightArrow").attr("data-direction", "forward").addClass("glyphicon glyphicon-chevron-right change_month_arrow change_month_arrow-right").click(function () {
            ShiftYear($('#rightArrow').data("direction"));
        }));
        $('#centralSmallBackArrow').bind("click", function () {
            ShiftYear($('#centralSmallBackArrow').attr("data-direction"))
        });
        $('#centralSmallForwardArrow').bind("click", function () {
            ShiftYear($('#centralSmallForwardArrow').attr("data-direction"))
        });
        td.animate({"left": 0}, 500);


        //Возврат только контейнера без стрелок для сдвига года влево и вправо
        if (_onlyInnerContent) {
            return innerContentTD;
        }
        else {
            return divFrame;
        }


    }

//Закрытие 12 месячного календаря (с анимацией)
    function CloseYearFrame(_callBack) {
        if (CurrentCalType() != "mycal") {
            DefaultCloseFrame();
            return;
        }
        //Отключение обработчиков на центральных кнопках
        $('#centralSmallBackArrow').unbind("click");
        $('#centralSmallForwardArrow').unbind("click");
        //Анимационные разлеты кусков фрейма
        $('#leftArrow').parent().animate({"left": -800}, 600);
        $('#rightArrow').parent().animate({"left": 800}, 600);

        $('#yearHeader').animate({"opacity": 0}, 600);
        var counter = 1;
        for (var x = 0; x < 3; x++) {
            for (var y = 0; y < 4; y++) {
                var td = $('td [data-month = ' + counter + ']');
                if (counter <= 4) {
                    td.animate({"top": -800}, 600);
                }
                if (counter > 4 && counter <= 6) {
                    td.animate({"left": -800}, 600);
                }
                if (counter > 6 && counter <= 8) {
                    td.animate({"left": 800}, 600);
                }
                if (counter > 8) {
                    td.animate({"top": 800}, 600);
                }
                counter++;
            }
        }
        setTimeout(function () {
            ClearEvents();
            $('#calendarContent').empty();
            if (_callBack) {
                _callBack();
            }

        }, 620);

    }

//Клик на кнопки влево и вправо - сдвиг по одному году
    function ShiftYear(_direction) {
        //Направление вправо
        if (_direction == "forward") {
            var oldFrame = $('#calendarInnerContent');
            var oldYear = choosenYear;
            var newYear = +oldYear + 1;
            ChangeChoosenDate(newYear);
            var newFrame = ShowYearFrame_GenerateContent(newYear, true);
            newFrame.children().css("width", oldFrame.children().children().children().css("width"));
            newFrame.children().css("height", oldFrame.children().children().children().css("height"));

            newFrame.css("position", "relative").css("left", 2000);
            oldFrame.css("position", "absolute");
            oldFrame.animate({"left": -1000}, 600);
            newFrame.animate({"left": 0}, 600);
            $('#yearHeader').animate({"opacity": 0}, 400);
            $('#calendarInnerContent').before(newFrame);
            DisableActiveElements();
            setTimeout(function () {
                oldFrame.remove();
                newFrame.css("position", "relative").css("left", 0);
                $('#yearHeader').html(newYear);
                $('#yearHeader').animate({"opacity": 1}, 600);
            }, 620);
            EnableActiveElements(ShiftYear);

        }
        //Направление влево
        else {
            var oldFrame = $('#calendarInnerContent');
            var oldYear = choosenYear;
            var newYear = +oldYear - 1;
            ChangeChoosenDate(newYear);
            var newFrame = ShowYearFrame_GenerateContent(newYear, true);

            newFrame.children().css("width", oldFrame.children().children().children().css("width"));
            newFrame.children().css("height", oldFrame.children().children().children().css("height"));

            newFrame.css("position", "relative").css("left", -2000);
            oldFrame.css("position", "absolute");
            oldFrame.animate({"left": 2000}, 600);
            newFrame.animate({"left": 0}, 600);
            $('#yearHeader').animate({"opacity": 0}, 600);
            $('#calendarInnerContent').before(newFrame);
            DisableActiveElements();
            setTimeout(function () {
                oldFrame.remove();
                newFrame.css("position", "relative");

                $('#yearHeader').html(newYear);
                $('#yearHeader').animate({"opacity": 1}, 600);
            }, 620);
            EnableActiveElements(ShiftYear);
        }
        $('#calendarHeader').attr("data-year", newYear);
        FillMyCalFrameCounters();
        return;
    }

//Показ фрейма с неделей
    function ShowWeekFrame() {
        //Задание стандартных значений
        var year = choosenYear;
        var month = choosenMonth;
        var date = choosenDate;
        $('#calendarHeader_optionalButtons').children().removeClass("menu-button-pressed");
        $('#calendarHeader_optionalButtons').children('[data-options=week]').addClass("menu-button-pressed");
        //Отметка кнопки подопции в заголовке
        ClickedButtonDecorationChange("calendarHeader_optionalButtons", "week");
        var tableFrame = $('<table>').attr("id", "contentFrame").css("overflow", "hidden").css("width", "75%").css("text-align", "center").css("margin", "0 auto").css("max-width", 1072);
        var trFrame = $('<tr>').appendTo(tableFrame);

        var td = $('<td>').css("left", -600).css("position", "relative").appendTo(trFrame);
        td.append($('<span>').attr("id", "leftArrow").attr("data-direction", "back").addClass("glyphicon glyphicon-chevron-left change_month_arrow change_month_arrow-left").click(function () {
            ShiftDay($('#leftArrow').data("direction"));
        }));

        td.animate({"left": -10}, 500);
        td = $('<td>').appendTo(trFrame);

        var divInnerContent = $('<div>').css("width", "100%").css("overflow", "hidden").css("position", "relative").appendTo(td);
        var tableInnerContent = $('<table>').attr("id", "calendarInnerContent").css("text-align", "center").css("margin", "0 auto").appendTo(divInnerContent);
        var trInnerContent = $('<tr>').appendTo(tableInnerContent);

        var counter = 1;
        for (var x = 0; x < 7; x++) {
            var firstDate = new Date(year, month - 1, date - 3 + x);
            var tdInnerContent = $('<td>').css("position", "relative").appendTo(trInnerContent);
            tdInnerContent.attr("data-date", firstDate.getDate()).attr("data-year", firstDate.getFullYear()).attr("data-month", firstDate.getMonth() + 1).append(CreateDay(firstDate.getFullYear(), firstDate.getMonth() + 1, firstDate.getDate()).css("margin", 3));
            tdInnerContent.attr("data-fulldate", firstDate.getFullYear() + "." + ConvertDateComponentTo2CharsFormat(firstDate.getMonth() + 1) + "." + ConvertDateComponentTo2CharsFormat(firstDate.getDate()));
            if (firstDate.getDate() == +date) {
                tdInnerContent.attr("id", "middleDay");
            }
            //Различия в свойствах для анимации
            if (counter <= 3) {
                tdInnerContent.css("left", -800);
                tdInnerContent.animate({"left": 0}, 600);
            }
            if (counter > 3 && counter <= 4) {
                tdInnerContent.css("top", -800);
                tdInnerContent.animate({"top": 0}, 600);
            }
            if (counter > 4) {
                tdInnerContent.css("left", 800);
                tdInnerContent.animate({"left": 0}, 600);
            }
            counter++;
        }
        td = $('<td>').css("left", 600).css("position", "relative").appendTo(trFrame);
        td.append($('<span>').attr("id", "rightArrow").attr("data-direction", "forward").addClass("glyphicon glyphicon-chevron-right change_month_arrow change_month_arrow-right").click(function () {
            ShiftDay($('#rightArrow').data("direction"));
        }));
        $('#centralSmallBackArrow').bind("click", function () {
            ShiftDay($('#centralSmallBackArrow').attr("data-direction"))
        });
        $('#centralSmallForwardArrow').bind("click", function () {
            ShiftDay($('#centralSmallForwardArrow').attr("data-direction"))
        });
        td.animate({"left": 10}, 500);
        $('#calendarContent').append(tableFrame);

        return;
    }

//Закрытие фрейма с неделей
    function CloseWeekFrame(_callBack) {
        if (CurrentCalType() != "mycal") {
            DefaultCloseFrame();
            return;
        }
        //Отключение обработчиков на центральных кнопках
        $('#centralSmallBackArrow').unbind("click");
        $('#centralSmallForwardArrow').unbind("click");

        //Анимационные разлеты кусков фрейма
        $('#leftArrow').parent().animate({"left": -800}, 600);
        $('#rightArrow').parent().animate({"left": 800}, 600);

        var oldYear = $('#middleDay').data("year");
        var oldMonth = $('#middleDay').data("month") - 1;
        var oldDate = $('#middleDay').data("date");
        var counter = 1;
        for (var x = 0; x < 7; x++) {
            var lastDayDate = new Date(oldYear, oldMonth, oldDate - 3 + x);
            var td = $('td [data-date = ' + lastDayDate.getDate() + ']');
            if (counter <= 3) {
                td.animate({"left": -800}, 600);
            }
            if (counter > 3 && counter <= 4) {
                td.animate({"top": -800}, 600);
            }
            if (counter > 4) {
                td.animate({"left": 800}, 600);
            }
            counter++;

        }
        setTimeout(function () {
            ClearEvents();
            $('#calendarContent').empty();
            if (_callBack) {
                _callBack();
            }

        }, 620);
    }

//Клик на кнопки влево и вправо - сдвиг по одному дню
    function ShiftDay(_direction) {
        if (_direction == "forward") {
            var newDayDate = new Date($('#middleDay').attr("data-year"), +$('#middleDay').attr("data-month") - 1, +$('#middleDay').attr("data-date") + 4);
            var newDay = $('<td>').css("position", "absolute").css("left", $('#middleDay').css("width").replace("px", "") * 7)
                .attr("data-date", newDayDate.getDate()).attr("data-year", newDayDate.getFullYear()).attr("data-month", newDayDate.getMonth() + 1)
                .attr("data-fulldate", newDayDate.getFullYear() + "." + ConvertDateComponentTo2CharsFormat(newDayDate.getMonth() + 1) + "." + ConvertDateComponentTo2CharsFormat(newDayDate.getDate()))
                .append(CreateDay(newDayDate.getFullYear(), newDayDate.getMonth() + 1, (newDayDate.getDate())).css("margin", 3));

            newDay.animate({"left": ($('#middleDay').css("width").replace("px", "") * 6)}, 200);
            $('#middleDay').parent().append(newDay);
            //return
            var dayWidth = $('#middleDay').css("width").replace("px", "");
            var oldYear = $('#middleDay').data("year");
            var oldMonth = $('#middleDay').data("month") - 1;
            var oldDate = $('#middleDay').data("date");
            for (var x = 0; x < 7; x++) {

                var firstDayDate = new Date(oldYear, oldMonth, oldDate - 3 + x);
                var td = $('td [data-date = ' + (firstDayDate.getDate()) + ']');
                td.animate({"left": -dayWidth}, 200);
                //Упреждение на дни недели
                if (x == 0) {
                    var removedDay = $('td [data-date = ' + (firstDayDate.getDate()) + ']');
                }
                if (x == 3) {
                    td.removeAttr("id");
                }
                if (x == 4) {
                    td.attr("id", "middleDay");
                }
            }
            UpdateData();
            DisableActiveElements();
            setTimeout(function () {
                removedDay.remove();
                newDay.css("position", "relative");


                for (x = 0; x < 7; x++) {

                    var middleDayDate = new Date(oldYear, oldMonth, oldDate - 2 + x);

                    td = $('td [data-date = ' + (middleDayDate.getDate()) + ']');
                    td.css("left", 0);
                }
                newDay.css("left", 0);

                EnableActiveElements(ShiftDay);
            }, 220);

        }
        else {
            var newDayDate = new Date($('#middleDay').attr("data-year"), $('#middleDay').attr("data-month") - 1, $('#middleDay').attr("data-date") - 4);

            var newDay = $('<td>').css("position", "absolute").css("left", -$('#middleDay').css("width").replace("px", ""))
                .attr("data-date", newDayDate.getDate()).attr("data-year", newDayDate.getFullYear()).attr("data-month", newDayDate.getMonth() + 1)
                .attr("data-fulldate", newDayDate.getFullYear() + "." + ConvertDateComponentTo2CharsFormat(newDayDate.getMonth() + 1) + "." + ConvertDateComponentTo2CharsFormat(newDayDate.getDate()))
                .append(CreateDay(newDayDate.getFullYear(), newDayDate.getMonth() + 1, (newDayDate.getDate())).css("margin", 3));
            newDay.animate({"left": 0}, 200);
            $('#middleDay').parent().prepend(newDay);

            var dayWidth = $('#middleDay').css("width").replace("px", "");
            var oldYear = $('#middleDay').data("year");
            var oldMonth = $('#middleDay').data("month") - 1;
            var oldDate = $('#middleDay').data("date");
            for (x = 0; x < 7; x++) {

                var firstDayDate = new Date(oldYear, oldMonth, oldDate - 3 + x);
                var td = $('td [data-date = ' + (firstDayDate.getDate()) + ']');
                td.animate({"left": dayWidth}, 200);
                //Упреждение на дни недели
                if (x == 6) {
                    removedDay = $('td [data-date = ' + (firstDayDate.getDate()) + ']');
                }
                if (x == 3) {
                    td.removeAttr("id");
                }
                if (x == 2) {
                    td.attr("id", "middleDay");
                }
            }
            UpdateData();
            DisableActiveElements();

            setTimeout(function () {
                removedDay.remove();
                newDay.css("position", "relative");

                for (x = 0; x < 7; x++) {

                    var middleDayDate = new Date(oldYear, oldMonth, oldDate - 4 + x);
                    td = $('td [data-date = ' + (middleDayDate.getDate()) + ']');
                    td.css("left", 0);
                }
                EnableActiveElements(ShiftDay);

            }, 220);
        }


    }

//========================================================================================================================================================================
//OLDCAL=================================================================================================================================================================
//Показ календаря, тип - oldcal, как в ранней версии сайта шоуконтроль
    function ShowOldCalFrame(_year, _month) {
        var container = $('<div>').attr("id", "contentFrame").css("width", "85%").css("display", "table").css("margin", "0 auto").css("opacity", 0).appendTo($('#calendarContent'));

        var header = $('<div>').addClass("oldcal-header_month_container_decoration").appendTo(container);
        var headerMonth = $('<span>').addClass("oldcal-header_month_decoration").css("position", "relative").css("top", 3).css("margin-left", 10).css("margin-right", 10).css("margin-op", 25).html(ConvertMonthFromNumberToName(_month, false) + ", " + _year).appendTo(header);

        var content = $('<div>').css("position", "relative").appendTo(container);
        var innerContentTable = $('<table>').addClass("table-bordered").css("border-collapse", "separate").css("table-layout", "fixed").css("width", "100%").css("border-radius", "5px").appendTo(content);
        var innerContentTR = $('<tr>').css("border", "1px solid #36BBCE").appendTo(innerContentTable);

        //Заполнение названий дней недели
        for (var i = 1; i < 8; i++) {
            var dayOfWeekNumber = i;
            if (i == 7) {
                dayOfWeekNumber = 0;
            }
            var innerContentTH = $('<th>').css("width", "14.3%").addClass("month-day_of_week_decoration").html(ConvertWeekDayFromNumberToName(dayOfWeekNumber, true)).appendTo(innerContentTR);
            if (i > 5) {
                innerContentTH.addClass("month_day-date-decoration_offday");
            }
        }
        //Объект даты для заполнения календаря с первого дня недели
        var dateFiller = new Date(_year, _month - 1, 1);

        //Текущие дата и время:
        var nowDateTime = new Date();
        //Текущий месяц
        var currentMonth = dateFiller.getMonth();
        //Сдвиг по неделям
        var shift = dateFiller.getDay() - 2;

        //Корректировка в зависимости от дня недели
        if (shift == -2) {
            shift = 5;
        }
        if (shift == -1) {
            shift = 6;
        }


        dateFiller.setDate(-shift);
        var dateChecker = new Date(dateFiller);
        dateChecker.setDate(dateChecker.getDate() + 6);
        //Заполнение фрейма днями
        for (i = 0; i < 6; i++) {
            if (i == 0 && dateChecker.getMonth() == currentMonth - 1) {
                dateFiller.setDate(dateFiller.getDate() + 7);
                continue;
            }
            if ((i == 5) && (currentMonth != dateFiller.getMonth())) {
                continue;
            }

            innerContentTR = $('<tr>').appendTo(innerContentTable);
            for (var j = 0; j < 7; j++) {

                var innerContentTD = $('<td>').addClass("oldcal-day_decoration oldcal-table_td_decoration calendar-day").attr("data-day", dateFiller.getDate()).attr("data-date", dateFiller.getFullYear() + "." + ConvertDateComponentTo2CharsFormat(dateFiller.getMonth() + 1) + "." + ConvertDateComponentTo2CharsFormat(dateFiller.getDate())).appendTo(innerContentTR);
                if (passedDaysMark) {
                    if (PassedDateChecker(dateFiller)) {
                        innerContentTD.css("background-color", "#d4d4d452");
                    }
                }
                var monthDayDiv = $('<div>').addClass("oldcal-month_day_decoration").appendTo(innerContentTD);
                (function (_elem) {
                    _elem.click(function (event) {
                    ChooseDate(_elem.parent(), false, true);
                    SwitchCalButtons("mycal", "week");
                    event.stopPropagation();
                    });
                })(monthDayDiv);

                var monthDaySpan = $('<span>').html(dateFiller.getDate()).css("text-align", "center").appendTo(monthDayDiv);
                if (dateFiller.getFullYear() == nowDateTime.getFullYear() && dateFiller.getMonth() == nowDateTime.getMonth() && dateFiller.getDate() == nowDateTime.getDate()) {
                    monthDayDiv.css("background-color", "#84fe67").attr("title", "Сегодня");
                }
                if (dateFiller.getMonth() != currentMonth) {
                    monthDayDiv.css("background-color", "#c9c9c9");
                    innerContentTD.css("opacity", "0.5");
                }
                if (j == 6) {
                    innerContentTD.css("border-right", "1px solid #36BBCE");
                }
                if (i == 0) {
                    innerContentTD.css("border-top", "1px solid #36BBCE");
                    monthDayDiv.css("border-top", "1px solid #36BBCE");
                }
                if (i == 5) {
                    innerContentTD.css("border-bottom", "1px solid #36BBCE");
                    monthDayDiv.css("border-bottom", "1px solid #36BBCE");
                }
                if (j > 4) {
                    monthDayDiv.addClass("month_day-date-decoration_offday");
                }


                dateFiller.setDate(dateFiller.getDate() + 1);
            }
        }
        //
        $('.calendar-day').click(function () {
            if (PassedDateChecker(new Date(+$(this).attr("data-date").split(".")[0], +$(this).attr("data-date").split(".")[1] - 1, +$(this).attr("data-day"))) && passedDaysMark) {
                ShowNotify(3, "Невозможно добавить событие на уже прошедшую дату");
            } else {
                AddEventFunction.apply(FillDateTimeDict($(this).attr("data-date").split(".")[0], $(this).attr("data-date").split(".")[1], $(this).attr("data-day")), addEventParams);

            }
        });
        container.animate({"opacity": 1}, 300);
        return;
    }


//Закрытие календаря oldcal
    function CloseOldCalFrame(_callback) {

        //Зачистка текущих значений календаря и разбайнд кнопок стрелок
        $('#calendarContent').empty();
        $('#centralSmallBackArrow').unbind("click");
        $('#centralSmallForwardArrow').unbind("click");
        if (_callback) {
            _callback();
        }

    }

//=======================================================================================================================================================================
//DATELIST================================================================================================================================================================
//Отображение текущего выбранного пикера - год, месяц, диапазон дат
    function ShowPickers(_option, _year, _month, _date) {
        //Автовыбор высоты контента, вместо фиксированной в других типах календарей
        $('#calendarContent').css("height", "auto");
        var container = $('<div>').css("opacity", 0).css("margin", "0 auto").appendTo($('#calendarContent'));
        var input = $('<input>').css("user-select", "none").addClass("form-control").css("text-align", "center").attr("type", "text").attr("id", "pickerFrom").attr("readonly", "readonly");
        switch (_option) {
            case "year":
                container.css("width", "20%");
                input.datepicker({
                    format: "yyyy",
                    startView: 2,
                    minViewMode: 2,
                    language: "ru",
                    autoclose: true,
                    todayHighlight: true,
                    defaultViewDate: {year: _year},
                    title: "Выбор года"
                });
                input.appendTo(container);
                input.datepicker('update', new Date(_year, _month - 1, _date));
                break;
            case "month":
                container.css("width", "20%");
                input.datepicker({
                    format: "MM yyyy",
                    startView: 1,
                    minViewMode: 1,
                    language: "ru",
                    autoclose: true,
                    todayHighlight: true,
                    defaultViewDate: {year: _year, month: _month},
                    title: "Выбор месяца"
                });
                input.appendTo(container);
                input.datepicker('update', new Date(_year, _month - 1, _date));

                break;
            case "date":
                container.css("width", "20%");
                input.datepicker({
                    format: "dd MM yyyy",
                    language: "ru",
                    autoclose: true,
                    todayHighlight: true,
                    defaultViewDate: {year: _year, month: _month, day: _date},
                    title: "Выбор дня"
                });
                input.appendTo(container);

                input.datepicker('update', new Date(_year, _month - 1, _date));


                break;
            case "range":
                container.css("width", "50%");
                var dateRangeContainer = $('<div>').addClass("input-group input-daterange").appendTo(container);
                $('<span>').css("padding-right", 5).css("user-select", "none").text("От: ").addClass("input-group-addon").appendTo(dateRangeContainer);
                var inputFrom = $('<input>').css("user-select", "none").attr("type", "text").addClass("form-control").attr("readonly", "readonly").attr("id", "pickerFrom").attr("name", "start").appendTo(dateRangeContainer);
                $('<span>').css("padding-left", 5).css("user-select", "none").css("padding-right", 5).text("до: ").addClass("input-group-addon").appendTo(dateRangeContainer);
                var inputTo = $('<input>').css("user-select", "none").attr("type", "text").addClass("form-control").attr("readonly", "readonly").attr("id", "pickerTo").attr("name", "end").appendTo(dateRangeContainer);

                inputFrom.datepicker({
                    format: "dd MM yyyy",
                    language: "ru",
                    autoclose: true,
                    todayHighlight: true,
                    defaultViewDate: {
                        year: choosenYear,
                        month: choosenMonth,
                        day: 1
                    },
                    title: "Выбор диапазона: от"
                });
                inputTo.datepicker({
                    format: "dd MM yyyy",
                    language: "ru",
                    autoclose: true,
                    todayHighlight: true,
                    defaultViewDate: {
                        year: choosenYear,
                        month: choosenMonth + 1,
                        day: (new Date(choosenYear, choosenMonth, 0)).getDate()
                    },
                    title: "Выбор диапазона: до"
                });
                inputFrom.datepicker('update', new Date(_year, _month - 1, 1));
                inputTo.datepicker('update', new Date(_year, _month, 0));
                inputTo.datepicker()
                    .on("changeDate", function (e) {
                        UpdateEventsPagination();
                    });
                inputFrom.datepicker()
                    .on("changeDate", function (e) {
                        UpdateEventsPagination();
                    });
                break;

        }
        input.datepicker()
            .on("changeDate", function (e) {
                ChangeChoosenDate(input.datepicker('getDate').getFullYear(), input.datepicker('getDate').getMonth() + 1, input.datepicker('getDate').getDate());
                UpdateEventsPagination();
            });
        container.animate({"opacity": 1}, 300);
    }

//Закрытие пикера по датам
    function ClosePicker(_callback) {
        $('#calendarContent').empty();
        ClearEvents();
        $('#centralSmallBackArrow').unbind("click");
        $('#centralSmallForwardArrow').unbind("click");
        if (_callback) {
            _callback();
        }
    }

//================================================================================================================================================================================

//Центральная кнопка - переход к дате сейчас
    function TodayButtonClick() {

        var today = new Date();
        ChangeChoosenDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

        //Отдельный кусок для частного случая - если выбран диапазон дат, тогда устанавливаются условия
        if ($('#pickerFrom').length != 0) {
            if (CurrentCalOptions() == "range") {
                today.setDate(1);
                var toDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

                $('#pickerTo').datepicker().unbind("changeDate");
                $('#pickerTo').datepicker("setDate", toDate);
                $('#pickerTo').datepicker()
                    .on("changeDate", function (e) {
                        UpdateEventsPagination();
                    });
            }
            $('#pickerFrom').datepicker("setDate", today);
        }
        else {
            ChangeFrame();
        }


    }

//Клик на кнопку переключения типа календаря - в правой части хэдера
    function SwitchCalButtons(_calendarType, _calendarOption) {
        //Отметка нажатой кнопки
        ClickedButtonDecorationChange("calendarHeader_typeButtons", _calendarType, "cal_type");

        //Заполнение опциональных кнопок в зависимости от типа календаря
        FillOptionalButtons(_calendarType, _calendarOption);
        //Переключение в зависимости от типа календаря
        $('#onlyOwnContainer').css("visibility", "visible");
        switch (_calendarType) {
            case "oldcal":
                ChangeFrame(_calendarType, _calendarOption);
                break;
            case "mycal":
                _calendarOption = $.cookie("mycal_option") ? $.cookie("mycal_option") : "month";
                $('button[data-options=' + _calendarOption + ']').trigger("click");
                break;
            case "datelist":
                _calendarOption = $.cookie("datelist_option") ? $.cookie("datelist_option") : "month";
                $('button[data-options=' + _calendarOption + ']').trigger("click");
                break;
            case "fulllist":
                $('#onlyOwnContainer').css("visibility", "hidden");
                ChangeFrame(_calendarType, false);
                break;
        }
        CurrentCalType(_calendarType);
        return;
    }

//Добавление кнопок в заголовок календаря слева в зависимости от выбранного типа календаря
    function FillOptionalButtons(_calendarType, _calendarOption) {
        var optButtonsContainer = $('#calendarHeader_optionalButtons');
        var todayButtonContainer = $('#calendarHeader_todayButton');
        optButtonsContainer.empty();
        todayButtonContainer.children(".non-native").remove();
        switch (_calendarType) {
            case "oldcal":
                $('#calendarTodayButton').css("visibility", "visible");
                //Центральные кнопки
                var optButton = $('<button>').attr("title", "Месяц назад").addClass("btn btn-primary non-native  btn-sm").prependTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-chevron-left").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {
                        ChangeChoosenDate(choosenYear, choosenMonth - 1, 1);
                        ChangeFrame();
                    })
                })();
                var optButtonYearBack = $('<button>').attr("title", "Год назад").addClass("btn btn-primary non-native  btn-sm").prependTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-backward").css("margin-bottom", 3).appendTo(optButtonYearBack);
                (function () {
                    optButtonYearBack.click(function () {
                        ChangeChoosenDate(choosenYear - 1, choosenMonth, 1);
                        ChangeFrame();
                    })
                })();
                var optButton = $('<button>').attr("title", "Месяц вперед").addClass("btn btn-primary non-native  btn-sm").appendTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-chevron-right").css("margin-bottom", 3).appendTo(optButton);

                (function () {
                    optButton.click(function () {
                        ChangeChoosenDate(choosenYear, choosenMonth + 1, 1);
                        ChangeFrame();
                    })
                })();
                var optButtonYearForward = $('<button>').attr("title", "Год вперед").addClass("btn btn-primary non-native  btn-sm").appendTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-forward").css("margin-bottom", 3).appendTo(optButtonYearForward);
                (function () {
                    optButtonYearForward.click(function () {
                        ChangeChoosenDate(choosenYear + 1, choosenMonth, 1);
                        ChangeFrame();
                    })
                })();
                //Левые кнопки

                var optButton = $('<button>').attr("data-options", "user").attr("title", "Отобразить имена менеджеров").addClass("btn btn-primary menu-button btn-sm").appendTo(optButtonsContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-user").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {
                        if (CurrentCalOptions() != "user") {
                            CurrentCalOptions("user");
                        }

                        ClickedButtonDecorationChange("calendarHeader_optionalButtons", "user");
                        var calEvents = $('.oldcal-show_in_table-content_container_decoration');
                        for (i = 0; i < calEvents.length; i++) {
                            $(calEvents[i]).text($(calEvents[i]).attr("data-user")).attr("title", $(calEvents[i]).attr("data-user"));
                        }
                        WriteCookie({"oldcal_option": "user"}, cookiePath);

                    })
                })();
                var optButton = $('<button>').attr("data-options", "company").attr("title", "Отобразить названия компаний").addClass("btn btn-primary menu-button btn-sm").appendTo(optButtonsContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-home").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {
                        if (CurrentCalOptions() != "company") {
                            CurrentCalOptions("company");
                        }
                        ClickedButtonDecorationChange("calendarHeader_optionalButtons", "company");
                        var calEvents = $('.oldcal-show_in_table-content_container_decoration');
                        for (i = 0; i < calEvents.length; i++) {
                            $(calEvents[i]).text($(calEvents[i]).attr("data-company")).attr("title", $(calEvents[i]).attr("data-company"));
                        }
                        WriteCookie({"oldcal_option": "company"}, cookiePath);
                    })
                })();

                var optButton = $('<button>').attr("data-options", "show").attr("title", "Отобразить названия шоу").addClass("btn btn-primary menu-button btn-sm").appendTo(optButtonsContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-play-circle").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {
                        if (CurrentCalOptions() != "show") {
                            CurrentCalOptions("show");
                        }
                        ClickedButtonDecorationChange("calendarHeader_optionalButtons", "show");

                        var calEvents = $('.oldcal-show_in_table-content_container_decoration');
                        for (i = 0; i < calEvents.length; i++) {
                            $(calEvents[i]).text($(calEvents[i]).attr("data-show")).attr("title", $(calEvents[i]).attr("data-show"));
                        }
                        WriteCookie({"oldcal_option": "show"}, cookiePath);

                    })
                })();
                var optButton = $('<button>').attr("data-options", "adress").attr("title", "Отобразить адреса").addClass("btn btn-primary menu-button btn-sm").appendTo(optButtonsContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-road").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {
                        if (CurrentCalOptions() != "adress") {
                            CurrentCalOptions("adress");
                        }
                        ClickedButtonDecorationChange("calendarHeader_optionalButtons", "adress");
                        var calEvents = $('.oldcal-show_in_table-content_container_decoration');
                        for (i = 0; i < calEvents.length; i++) {
                            $(calEvents[i]).text($(calEvents[i]).attr("data-adress")).attr("title", $(calEvents[i]).attr("data-adress"));
                        }
                        WriteCookie({"oldcal_option": "adress"}, cookiePath);

                    })
                })();

                break;
            case "mycal":

                $('#calendarTodayButton').css("visibility", "visible");
                //Центральные кнопки
                var optButton = $('<button>').attr("id", "centralSmallBackArrow").attr("title", "Шаг назад").attr("data-direction", "back").addClass("btn btn-primary non-native  btn-sm").prependTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-chevron-left").css("margin-bottom", 3).appendTo(optButton);

                optButton.click(function () {
                    var direction = "back";
                    var option = CurrentCalOptions();
                    switch (option) {
                        case "year":
                            ShiftYear(direction);
                            break;
                        case "month":
                            ShiftMonth(direction);
                            break;
                        case "week":
                            ShiftDay(direction);
                            break;
                    }
                });

                var optButton = $('<button>').attr("title", "Фрейм назад").addClass("btn btn-primary non-native  btn-sm").prependTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-backward").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {
                        var option = CurrentCalOptions();
                        switch (option) {
                            case "year":
                                optButton.attr("title", "Год назад");
                                ChangeChoosenDate(choosenYear - 1, 1, 1);
                                break;
                            case "month":
                                optButton.attr("title", "3 месяца назад");
                                ChangeChoosenDate(choosenYear, choosenMonth - 3, 1);
                                break;
                            case "week":
                                optButton.attr("title", "Неделю назад");
                                ChangeChoosenDate(choosenYear, choosenMonth, choosenDate - 7);
                                break;
                        }
                        ChangeFrame();
                    })
                })();

                var optButton = $('<button>').attr("id", "centralSmallForwardArrow").attr("title", "Шаг вперед").attr("data-direction", "forward").addClass("btn btn-primary non-native  btn-sm").appendTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-chevron-right").css("margin-bottom", 3).appendTo(optButton);
                optButton.click(function () {
                    var direction = "forward";
                    switch (CurrentCalOptions()) {
                        case "year":
                            ShiftYear(direction);
                            break;
                        case "month":
                            ShiftMonth(direction);
                            break;
                        case "week":
                            ShiftDay(direction);
                            break;
                    }
                });

                var optButton = $('<button>').attr("title", "Фрейм вперед").addClass("btn btn-primary non-native  btn-sm").appendTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-forward").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {
                        var option = CurrentCalOptions();
                        switch (option) {
                            case "year":
                                optButton.attr("title", "Год вперед");
                                ChangeChoosenDate(choosenYear + 1, 1, 1);
                                break;
                            case "month":
                                optButton.attr("title", "3 месяца вперед");
                                ChangeChoosenDate(choosenYear, choosenMonth + 3, 1);
                                break;
                            case "week":
                                optButton.attr("title", "Неделю вперед");
                                ChangeChoosenDate(choosenYear, choosenMonth, choosenDate + 7);
                                break;
                        }
                        ChangeFrame();
                    })
                })();
                //Левые кнопки
                var optButton = $('<button>').attr("data-options", "year").addClass("btn btn-primary menu-button ").attr("title", "Год").appendTo(optButtonsContainer);
                (function (b) {
                    optButton.click(function () {
                        ChangeFrame(_calendarType, "year");
                    });
                })(optButton);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-button_with_text").html("Г").appendTo(optButton);

                var optButton = $('<button>').attr("data-options", "month").addClass("btn btn-primary menu-button ").attr("title", "Месяц").appendTo(optButtonsContainer);
                (function (b) {
                    optButton.click(function () {

                        ChangeFrame(_calendarType, "month");
                    });
                })(optButton);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-button_with_text").html("М").appendTo(optButton);

                var optButton = $('<button>').attr("data-options", "week").addClass("btn btn-primary menu-button ").attr("title", "Неделя").appendTo(optButtonsContainer);
                (function (b) {
                    optButton.click(function () {
                        ChangeFrame(_calendarType, "week");
                    });
                })(optButton);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-button_with_text").html("Н").appendTo(optButton);
                break;
            case "datelist":
                $('#calendarTodayButton').css("visibility", "visible");
                //Центральные кнопки
                var optButton = $('<button>').attr("title", "Шаг назад").addClass("btn btn-primary non-native  btn-sm").prependTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-chevron-left").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {
                        var currentDateValue = $('#pickerFrom').datepicker('getDate');
                        switch (CurrentCalOptions()) {
                            case "year":
                                currentDateValue.setYear(currentDateValue.getFullYear() - 1);
                                break;
                            case "month":
                                currentDateValue.setMonth(currentDateValue.getMonth() - 1);
                                break;
                            case "date":
                                currentDateValue.setDate(currentDateValue.getDate() - 1);
                                break;
                            case "range":
                                currentDateValue.setMonth(currentDateValue.getMonth() - 1);
                                var toRangePickerDateValue = $('#pickerTo').datepicker('getDate');
                                toRangePickerDateValue.setDate(0);

                                $('#pickerTo').datepicker().unbind("changeDate");

                                $('#pickerTo').datepicker("setDate", toRangePickerDateValue);

                                $('#pickerTo').datepicker()
                                    .on("changeDate", function (e) {
                                        UpdateEventsPagination();
                                    });
                                break;
                        }

                        $('#pickerFrom').datepicker("setDate", currentDateValue);
                        ChangeChoosenDate(currentDateValue.getFullYear(), currentDateValue.getMonth() + 1, currentDateValue.getDate());

                    })
                })();
                var optButton = $('<button>').attr("title", "Год назад").addClass("btn btn-primary non-native  btn-sm").prependTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-backward").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {

                        var currentDateValue = $('#pickerFrom').datepicker('getDate');

                        currentDateValue.setYear(currentDateValue.getFullYear() - 1);
                        $('#pickerFrom').datepicker("setDate", currentDateValue);

                        ChangeChoosenDate(currentDateValue.getFullYear(), currentDateValue.getMonth() + 1, currentDateValue.getDate());

                        currentDateValue.setYear(currentDateValue.getFullYear() + 1);
                        $('#pickerTo').datepicker("setDate", currentDateValue);

                    })
                })();
                var optButton = $('<button>').attr("title", "Шаг вперед").addClass("btn btn-primary non-native  btn-sm").appendTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-chevron-right").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {
                        var currentDateValue = $('#pickerFrom').datepicker('getDate');
                        switch (CurrentCalOptions()) {
                            case "year":
                                currentDateValue.setYear(currentDateValue.getFullYear() + 1);
                                break;
                            case "month":
                                currentDateValue.setMonth(currentDateValue.getMonth() + 1);
                                break;
                            case "date":
                                currentDateValue.setDate(currentDateValue.getDate() + 1);
                                break;
                            case "range":
                                currentDateValue.setMonth(currentDateValue.getMonth() + 1);
                                var toRangePickerDateValue = $('#pickerFrom').datepicker('getDate');
                                toRangePickerDateValue.setMonth(toRangePickerDateValue.getMonth() + 2);
                                toRangePickerDateValue.setDate(0);
                                $('#pickerTo').datepicker().unbind("changeDate");

                                $('#pickerTo').datepicker("setDate", toRangePickerDateValue);

                                $('#pickerTo').datepicker()
                                    .on("changeDate", function (e) {
                                        UpdateEventsPagination();
                                    });
                                break;
                        }

                        $('#pickerFrom').datepicker("setDate", currentDateValue);
                        ChangeChoosenDate(currentDateValue.getFullYear(), currentDateValue.getMonth() + 1, currentDateValue.getDate());
                    })
                })();
                var optButton = $('<button>').attr("title", "Год вперед").addClass("btn btn-primary non-native  btn-sm").appendTo(todayButtonContainer);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-forward").css("margin-bottom", 3).appendTo(optButton);
                (function () {
                    optButton.click(function () {
                        var currentDateValue = $('#pickerFrom').datepicker('getDate');


                        currentDateValue.setYear(currentDateValue.getFullYear() + 1);
                        $('#pickerFrom').datepicker("setDate", currentDateValue);

                        ChangeChoosenDate(currentDateValue.getFullYear(), currentDateValue.getMonth() + 1, currentDateValue.getDate());

                        currentDateValue.setYear(currentDateValue.getFullYear() + 1);
                        $('#pickerTo').datepicker("setDate", currentDateValue);

                    })
                })();
                //Левые кнопки
                var optButton = $('<button>').addClass("btn btn-primary menu-button").attr("title", "Год").attr("data-options", "year").appendTo(optButtonsContainer);
                (function (b) {

                    optButton.click(function () {
                        ClickedButtonDecorationChange("calendarHeader_optionalButtons", "year");

                        ChangeFrame(_calendarType, b.attr("data-options"));
                    });
                    CurrentCalOptions(b.attr("data-options"));
                })(optButton);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-button_with_text").html("Г").appendTo(optButton);
                var optButton = $('<button>').addClass("btn btn-primary menu-button").attr("title", "Месяц").attr("data-options", "month").appendTo(optButtonsContainer);
                (function (b) {

                    optButton.click(function () {
                        ClickedButtonDecorationChange("calendarHeader_optionalButtons", "month");
                        ChangeFrame(_calendarType, b.attr("data-options"));

                    });
                    CurrentCalOptions(b.attr("data-options"));
                })(optButton);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-button_with_text").html("М").appendTo(optButton);
                var optButton = $('<button>').addClass("btn btn-primary menu-button").attr("title", "День").attr("data-options", "date").appendTo(optButtonsContainer);
                (function (b) {

                    optButton.click(function () {
                        ClickedButtonDecorationChange("calendarHeader_optionalButtons", "date");
                        ChangeFrame(_calendarType, b.attr("data-options"));

                    });
                    CurrentCalOptions(b.attr("data-options"));
                })(optButton);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-button_with_text").html("Д").appendTo(optButton);
                var optButton = $('<button>').addClass("btn btn-primary menu-button").attr("title", "Диапазон").attr("data-options", "range").appendTo(optButtonsContainer);
                (function (b) {

                    optButton.click(function () {
                        $('#calendarHeader_optionalButtons').children().removeClass("menu-button-pressed");
                        $('#calendarHeader_optionalButtons').children('[data-options=range]').addClass("menu-button-pressed");
                        ChangeFrame(_calendarType, b.attr("data-options"));
                    });
                    CurrentCalOptions(b.attr("data-options"));
                })(optButton);
                var optButtonIcon = $('<span>').addClass("glyphicon glyphicon-transfer").appendTo(optButton);
                break;
            case "fulllist":
                $('#calendarTodayButton').css("visibility", "hidden");
                break;
        }
    }

    function ChangeFrame(_newCalType, _newCalOptions) {

        $('#search_panel').find('#search_input').val("");

        _newCalType = _newCalType || currentCalType;
        _newCalOptions = _newCalOptions || currentCalOptions;
        showFrameFunc = function () {
            var dateRange = GetCurrentDateRange(_newCalType, _newCalOptions, choosenYear, choosenMonth, choosenDate);
            ShowFrame(_newCalType, _newCalOptions);
            FillFrameData(_newCalType, _newCalOptions, dateRange.fromConvertedString, dateRange.toConvertedString);
            FillContent(_newCalType, _newCalOptions, dateRange.fromConvertedString, dateRange.toConvertedString);
        };
        CloseFrame(showFrameFunc);
        if (_newCalType != CurrentCalType()) {
            CurrentCalType(_newCalType);
        }
        if (_newCalOptions != CurrentCalOptions()) {
            CurrentCalOptions(_newCalOptions);
        }

        return;
    }

//Заполнение данных в головной фрейм. В данный момент заполняются oldcal и mycal-week фреймы
    function FillFrameData(_calType, _calOption, _from, _to) {
        //Если не oldcal или не mycal фрейм - выйти из функции
        switch (_calType) {
            case "oldcal":
                ContainerLoadIndicatorShow(scCalContainer);
                break;
            case "mycal":
                if (_calOption == "week") {
                    $('#calendarEvents_content').empty();
                    ContainerLoadIndicatorShow(scCalContainer);
                    break;
                } else {
                    FillMyCalFrameCounters();
                    return;
                }
            case "datelist":
                return;
            case "fulllist":
                return;
        }

        var postData = {
            from: _from,
            to: _to,
            cal_type: _calType,
            cal_option: _calOption
        };
        if (onlyOwn != undefined) {
            postData["only_own"] = $('#onlyOwn').is(':checked');
        }
        for (var postVar in postVars) {
            postData[postVar] = postVars[postVar];

        }
        //Подгрузка данных

        $.post(listEventsUrl, postData, function (response) {
            ContainerLoadIndicatorHide();
            var data = ResponseToNotify(response);

            if (response["status"] != "data") {
                $('.oldcal-show_in_table-container_decoration').remove();
                return;
            }
            var items = data["events"];

            $('.oldcal-show_in_table-container_decoration').remove();
            switch (_calType) {
                case "oldcal":
                    //Очистка текущих элементов таблицы
                    for (var i = 0; i < items.length; i++) {
                        var curCalType = CurrentCalType();
                        var curCalOption = $.cookie("oldcal_option") ? $.cookie("oldcal_option") : CurrentCalOptions();
                        ClickedButtonDecorationChange("calendarHeader_optionalButtons", curCalOption);
                        var OldCalDecorateElemFunction = OldCalDecoration;
                        //Добавление элементов, поиск - по атрибуду data-date в формате dd.mm.yyyy
                        //TransformDateFunction - задается индивидуально, возвращает дату в отформатированном формате для каждого конкретного запроса
                        var tdContainer = $('td[data-date=\"' + TransformDateFunction(items[i], "strdate") + '\"]');
                        //Задание функции оформления элементов в календаре
                        var eventDecorationItem = OldCalDecorateElemFunction(items[i], curCalType, curCalOption);
                        tdContainer.append(eventDecorationItem);

                        //Обработка кликов
                        (function (x, _item) {
                            eventDecorationItem.click(function (event) {
                                event.stopPropagation();
                                ShowEventFunction(x, _item);
                            })
                        })($(eventDecorationItem).attr("data-id"), $(eventDecorationItem));
                        (function () {
                            eventDecorationItem.contextmenu(function (event) {
                                event.preventDefault();
                            })
                        })();
                    }
                    break;
                case "mycal":
                    if (CurrentCalOptions() == "week") {
                        for (i = 0; i < items.length; i++) {
                            //Добавление элементов, поиск - по атрибуду data-date в формате dd.mm.yyyy
                            var tdContainer = $('td[data-fulldate=\"' + TransformDateFunction(items[i], "strdate") + '\"]').find('td[data-hour=' + TransformDateFunction(items[i], "h") + ']');
                            //Задание функции оформления элементов в календаре
                            var MyCalDecorateElemFunction = WeekEventDecoration;

                            var eventDecorationItem = MyCalDecorateElemFunction(items[i], curCalType, curCalOption);
                            tdContainer.append(eventDecorationItem);

                            if ($(tdContainer).children().length > 0) {
                                eventDecorationItem.css("float", "right");
                                eventDecorationItem.css("width", (100 / (($(tdContainer).children().length)) - 2) + "%").css("margin-right", 1);
                                $(tdContainer).children().css("width", ((100 / ($(tdContainer).children().length)) - 2) + "%");
                            }
                            //Обработка кликов
                            (function (x, _item) {
                                eventDecorationItem.click(function (event) {
                                    event.stopPropagation();
                                    ShowEventFunction(x, _item);
                                })
                            })($(eventDecorationItem).attr("data-id"), $(eventDecorationItem));
                        }
                        break;
                    }
            }
            if (AdditionFunction) {
                AdditionFunction(data, $('#contentFrame'), _calType, _calOption);
            }
        });

        return;
    }

//Заполнение контента - событий календаря
    function FillContent(_calType, _calOption, _from, _to) {
        //В зависимости от типа календаря, заполняются события. Различия только по диапазонам
        switch (_calType) {
            case "oldcal":
                return;
            case "mycal":
                if (_calOption != "week") {
                    UpdateEventsPagination(_from, _to, _calType, _calOption);
                }else{
                    return;
                }
                break;
            case "datelist":
                UpdateEventsPagination(_from, _to, _calType, _calOption);
                break;
            case "fulllist":
                UpdateEventsPagination(false, false, _calType, _calOption);
                break;
        }
        return;
    }

//Заполнение каунтеров событий в MyCal фрейме
    function FillMyCalFrameCounters() {
        var postData = {};
        for (var postVar in postVars) {
            postData[postVar] = postVars[postVar];

        }
        if (onlyOwn != undefined) {
            postData["only_own"] = $('#onlyOwn').is(':checked');
        }
        if (myCalFrameDataUrl) {
            ContainerLoadIndicatorShow($('#calendarContent'));

            $.post(myCalFrameDataUrl, postData, function (response) {
                $('.events_count_calendar_label_container').remove();
                ContainerLoadIndicatorHide();
                var data = ResponseToNotify(response);
                if (response["status"] != "data") {
                    return;
                }
                var items = data["counters"];

                var lastMonth = false;
                var lastYear = false;
                var haveYear = false;

                var monthContainer = false;
                for (var i = 0; i < items.length; i++) {
                    var currentYear = GetDateTimeFromString(items[i]["day"])["year"];
                    var currentMonth = GetDateTimeFromString(items[i]["day"])["month"];
                    var currentDay = GetDateTimeFromString(items[i]["day"])["date"];

                    if (lastYear != currentYear) {
                        haveYear = false;
                    }
                    if (!haveYear) {
                        if (currentYear != lastYear) {
                            if ($('table[data-year=' + currentYear + "]").length == 0) {
                                lastYear = currentYear;
                                continue;
                            } else {
                                haveYear = true;
                                lastMonth = false;
                            }
                        } else {
                            continue;
                        }
                    }

                    if (lastMonth != currentMonth) {
                        monthContainer = $('table[data-year=' + currentYear + "][data-month=" + (+currentMonth) + "]");
                    }
                    lastYear = currentYear;
                    lastMonth = currentMonth;

                    var dayContainer = monthContainer.find("td[data-date=" + (+currentDay) + "]");

                    var div = $('<div>').addClass("events_count_calendar_label_container").attr("title", "Количество событий").appendTo(dayContainer);
                    var span = $('<div>').addClass("events_count_calendar_label").text(items[i]["pk__count"]).appendTo(div);
                }

                if("busy_marks" in data) {
                    $('#contentFrame').find("td[data-date]").css("background-color", "white");
                    var busy_marks = data["busy_marks"];

                    var lastMonth = false;
                    var lastYear = false;
                    var haveYear = false;

                    var monthContainer = false;
                    for (var i = 0; i < busy_marks.length; i++) {
                        var currentYear = GetDateTimeFromString(busy_marks[i]["date"])["year"];
                        var currentMonth = GetDateTimeFromString(busy_marks[i]["date"])["month"];
                        var currentDay = GetDateTimeFromString(busy_marks[i]["date"])["date"];

                        if (lastYear != currentYear) {
                            haveYear = false;
                        }
                        if (!haveYear) {
                            if (currentYear != lastYear) {
                                if ($('table[data-year=' + currentYear + "]").length == 0) {
                                    lastYear = currentYear;
                                    continue;
                                } else {
                                    haveYear = true;
                                    lastMonth = false;
                                }
                            } else {
                                continue;
                            }
                        }

                        if (lastMonth != currentMonth) {
                            monthContainer = $('table[data-year=' + currentYear + "][data-month=" + (+currentMonth) + "]");
                        }
                        lastYear = currentYear;
                        lastMonth = currentMonth;

                        var dayContainer = monthContainer.find("td[data-date=" + (+currentDay) + "]");
                        if(busy_marks[i]["fullday"]){
                            dayContainer.css("background-color", "#fff7007d").attr("title", "День занят");
                        }else{
                            dayContainer.css("background-color", "#00ff088c").attr("title", "Есть занятое время");
                        }
                    }
                }
            });

        }

        return;
    }

    //Функция обновления страниц мероприятий
    function UpdateEventsPagination(_from, _to, _calType, _calOption) {

        var urls = {};
        var params = {};
        var containers = {};
        var functions = {};
        var options = {};
        urls["pages_count"] = paginationUrl;
        urls["content"] = listEventsUrl;

        var dateRange = GetCurrentDateRange();
        params['from'] = _from || dateRange.fromConvertedString;
        params['to'] = _to || dateRange.toConvertedString;
        params['cal_type'] = _calType || currentCalType;
        params["cal_option"] = _calOption || currentCalOptions;
        for (var postVar in postVars) {
            params[postVar] = postVars[postVar];
        }
        if (onlyOwn != undefined) {
            params["only_own"] = $('#onlyOwn').is(':checked');
        }

        containers["paginator"] = $('#calendarEvents_paginator');
        containers["content"] = $('#calendarEvents_content');

        functions["get_page_data"] = FillEventsPage;

        options["owndatastructure"] = true;
        options["noeventsexecute"] = true;

        var paginator = new Paginator(containers, urls, params, functions, options);
        paginator.Create();
        
        PaginatorPageUpdater = paginator.Update;
        
        return paginator;
    }

    //Функция показа мероприятий
    function FillEventsPage(_container, _data) {

        //ListEventDecoration
        var container = _container;
        var eventsFrameContainer = $('<div>').addClass("events_frame_container-decoration").appendTo(container);

        var eventsFrameHeader = $('<div>').addClass("events_frame_header-decoration").css("opacity", 0).appendTo(eventsFrameContainer);
        var addEventButton = $('<div>').css("float", "right").addClass("events_add_event_button-decoration").attr("title", "Добавить мероприятие").appendTo(eventsFrameHeader);


        addEventButton.click(function () {
            AddEventFunction.apply(FillDateTimeDict(choosenYear, choosenMonth, choosenDate, 12, 0), addEventParams);
        });
        addEventButton.append($('<span>').addClass("glyphicon glyphicon-plus"));
        var eventsDate = $('<div>').addClass("events_date_label-decoration").text(GetCurrentDateLabel()).appendTo(eventsFrameHeader);
        eventsFrameHeader.animate({"opacity": 1}, 300);

        var events = _data["events"];
        var userData = _data["user"];
        for (var i = 0; i < events.length; i++) {
            var eventData = {};
            eventData["user"] = _data["user"];
            eventData["event"] = events[i];
            var eventsContainer = $('<div>').addClass("events_frame-decoration").appendTo(eventsFrameContainer);
            var eventsTable = $('<table>').addClass("event_table-decoration").appendTo(eventsContainer);
            ListEventDecoration(eventData, CurrentCalType(), CurrentCalOptions()).appendTo(eventsTable);
        }
        $('html, body').animate({
            scrollTop: $("#calendarEvents_content").offset().top
        }, 300);

        if (AdditionFunction) {
            AdditionFunction(_data, _container, CurrentCalType(), CurrentCalOptions());
        }
        return;
    }

//Стандартная функция для закрытия фрейма - на случай отсутствия CloseFrame функции
    function DefaultCloseFrame(_callback) {
        $('#calendarContent').empty();
        ClearEvents();
        if (_callback) {
            _callback();
        }
    }

//Общая функция закрытия фрейма - пикер
    function CloseFrame(_callBack) {
        var calType = CurrentCalType();
        var option = CurrentCalOptions();
        switch (calType) {
            case "oldcal":
                CloseOldCalFrame(_callBack);
                break;
            case "mycal":
                switch (option) {
                    case "year":
                        CloseYearFrame(_callBack);
                        break;
                    case "month":
                        CloseThreeMonthFrame(_callBack);
                        break;
                    case "week":
                        CloseWeekFrame(_callBack);
                        break;
                    default :
                        DefaultCloseFrame(_callBack);
                }
                break;
            case "datelist":
                ClosePicker(_callBack);
                break;
            case "fulllist":
                DefaultCloseFrame(_callBack);
                break;
            default:
                DefaultCloseFrame(_callBack);
        }
        ClearEvents();
        $('#calendarContent').css("height", "auto");
    }

//Общая функция показа фрейма - пикер
    function ShowFrame(_calType, _calOption) {
        var frameYear = choosenYear;
        var frameMonth = choosenMonth;
        var frameDate = choosenDate;

        switch (_calType) {
            case "oldcal":
                ShowOldCalFrame(frameYear, frameMonth);
                break;
            case "mycal":
                WriteCookie({"mycal_option": _calOption}, cookiePath);
                switch (_calOption) {
                    case "year":
                        ShowYearFrame(frameYear);
                        break;
                    case "month":
                        ShowThreeMonthFrame(frameYear, frameMonth);
                        break;
                    case "week":
                        ShowWeekFrame();
                        break;
                }
                break;
            case "datelist":
                CurrentCalType(_calType);
                WriteCookie({"datelist_option": _calOption}, cookiePath);
                ShowPickers(_calOption, frameYear, frameMonth, frameDate);
                break;
            case "fulllist":
                CurrentCalType("fulllist");
                break;
        }
        WriteCookie({"calType": _calType, "calOption": _calOption}, cookiePath);
    }

//Функция для зачистки показанных событий
    function ClearEvents() {
        $('#calendarEvents_content').empty();
        $('#calendarEvents_paginator').empty();
        $('#noEventsExclamation_container').remove();
    }

//ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ КАЛЕНДАРЯ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Установка метки даты события календаря в зависимости от типа текущего календаря
    function GetCurrentDateLabel() {
        var calType = CurrentCalType();
        var option = CurrentCalOptions();
        switch (calType) {
            case "oldcal":
                break;
            case "mycal":
                //Для mycal кроме подопции week - вывод полной даты в метке
                return choosenDate + " " + ConvertMonthFromNumberToName(choosenMonth) + " " + choosenYear;
                break;
            case "datelist":
                //Для выборочной даты - настройки в завимимости от подопции
                switch (option) {
                    case "year":
                        return choosenYear;
                        break;
                    case "month":
                        return ConvertMonthFromNumberToName(choosenMonth) + " " + choosenYear;
                        break;
                    case "date":
                        return choosenDate + " " + ConvertMonthFromNumberToName(choosenMonth) + " " + choosenYear;
                        break;
                    case "range":
                        return "Диапазон"
                        break;
                }
                break;
            case "fulllist":
                return "Полный список";
                break;
        }
    }

//Получение диапазона даты в зависимости от текущих выбранных опций и подопций календаря. Формат вывода - компоненты даты, либо настроенные под встроенные
//Python Django парсеры даты, можно переписать под свой язык
    function GetCurrentDateRange(_calType, _option, _fromYear, _fromMonth, _fromDate, _toYear, _toMonth, _toDate) {

        _calType = _calType || CurrentCalType();
        _option = _option || CurrentCalOptions();
        _fromYear = _fromYear || choosenYear;
        _fromMonth = _fromMonth || choosenMonth;
        _fromDate = _fromDate || choosenDate;
        _toYear = _toYear || choosenYear;
        _toMonth = _toMonth || choosenMonth;
        _toDate = _toDate || choosenDate;

        var container = {};

        switch (_calType) {
            //Для старого календаря - диапазон от первого числа выбранного месяца и года до последнего числа
            case "oldcal":
                var dateFiller = new Date(_fromYear, _fromMonth - 1, 1);

                var shift = dateFiller.getDay() - 2;
                if (shift == -2) {
                    shift = 5;
                }
                if (shift == -1) {
                    shift = 6;
                }
                dateFiller.setDate(-shift);

                var from_year = dateFiller.getFullYear();
                var from_month = dateFiller.getMonth() + 1;
                var from_date = dateFiller.getDate();
                //41 - магическое число элементов на странице (6x7 = 42)
                dateFiller.setDate(dateFiller.getDate() + 41);

                var to_year = dateFiller.getFullYear();
                var to_month = dateFiller.getMonth() + 1;
                var to_date = dateFiller.getDate();

                break;
            case "mycal":
                //Для недели в mycal - 3 дня до и после от выбранной даты
                if (_option == "week") {
                    if ($('#middleDay').length == 0) {
                        dateFiller = new Date(_fromYear, _fromMonth - 1, _fromDate);
                        dateFiller.setDate(dateFiller.getDate() - 3);
                    } else {
                        dateFiller = new Date(+$('#middleDay').attr("data-year"), +$('#middleDay').attr("data-month") - 1, +$('#middleDay').attr("data-date"));
                        dateFiller.setDate(dateFiller.getDate() - 3);
                    }

                    from_year = dateFiller.getFullYear();
                    from_month = dateFiller.getMonth() + 1;
                    from_date = dateFiller.getDate();

                    dateFiller.setDate(dateFiller.getDate() + 6);

                    to_year = dateFiller.getFullYear();
                    to_month = dateFiller.getMonth() + 1;
                    to_date = dateFiller.getDate();
                }
                else {
                    from_year = _fromYear;
                    from_month = _fromMonth;
                    from_date = _fromDate;

                    to_year = _fromYear;
                    to_month = _fromMonth;
                    to_date = _fromDate;
                }

                break;

            case "datelist":
                switch (_option) {
                    //для года - начиная от первого дня первого месяца до последнего дня последнего месяца
                    case "year":
                        if ($('#pickerFrom').length != 0) {
                            from_year = $('#pickerFrom').datepicker('getDate').getFullYear();
                            from_month = 1;
                            from_date = 1;

                            dateFiller = $('#pickerFrom').datepicker('getDate');
                            dateFiller.setMonth(12);
                            dateFiller.setDate(0);

                            to_year = dateFiller.getFullYear();
                            to_month = dateFiller.getMonth() + 1;
                            to_date = dateFiller.getDate();
                        } else {
                            from_year = _fromYear;
                            from_month = 1;
                            from_date = 1;

                            dateFiller = new Date(_fromYear, 0, 1);
                            dateFiller.setYear(dateFiller.getFullYear() + 1);
                            dateFiller.setDate(0);
                            to_year = dateFiller.getFullYear();
                            to_month = dateFiller.getMonth() + 1;
                            to_date = dateFiller.getDate();
                        }


                        break;
                    //для месяца - диапазон от первого числа выбранного месяца и года до последнего числа
                    case "month":

                        if ($('#pickerFrom').length != 0) {
                            from_year = $('#pickerFrom').datepicker('getDate').getFullYear();
                            from_month = $('#pickerFrom').datepicker('getDate').getMonth() + 1;
                            from_date = 1;

                            dateFiller = $('#pickerFrom').datepicker('getDate');
                            dateFiller.setMonth(dateFiller.getMonth() + 1);
                            dateFiller.setDate(0);
                            to_year = dateFiller.getFullYear();
                            to_month = dateFiller.getMonth() + 1;
                            to_date = dateFiller.getDate();
                        } else {
                            from_year = _fromYear;
                            from_month = _fromMonth;
                            from_date = 1;

                            dateFiller = new Date(_fromYear, _fromMonth - 1, 1);
                            dateFiller.setMonth(dateFiller.getMonth() + 1);
                            dateFiller.setDate(0);

                            to_year = dateFiller.getFullYear();
                            to_month = dateFiller.getMonth() + 1;
                            to_date = dateFiller.getDate();
                        }

                        break;
                    //Для даты - диапазон выбранного дня
                    case "date":
                        if ($('#pickerFrom').length != 0) {
                            from_year = $('#pickerFrom').datepicker('getDate').getFullYear();
                            from_month = $('#pickerFrom').datepicker('getDate').getMonth() + 1;
                            from_date = $('#pickerFrom').datepicker('getDate').getDate();

                            to_year = $('#pickerFrom').datepicker('getDate').getFullYear();
                            to_month = $('#pickerFrom').datepicker('getDate').getMonth() + 1;
                            to_date = $('#pickerFrom').datepicker('getDate').getDate();
                            to_date = $('#pickerFrom').datepicker('getDate').getDate();

                        } else {
                            from_year = _fromYear;
                            from_month = _fromMonth;
                            from_date = _fromDate;

                            to_year = _fromYear;
                            to_month = _fromMonth;
                            to_date = _fromDate;
                        }

                        break;
                    //Диапазон - выбранный диапазон от дня до дня
                    case "range":
                        if ($('#pickerTo').length == 1) {
                            from_year = $('#pickerFrom').datepicker('getDate').getFullYear();
                            from_month = $('#pickerFrom').datepicker('getDate').getMonth() + 1;
                            from_date = $('#pickerFrom').datepicker('getDate').getDate();

                            to_year = $('#pickerTo').datepicker('getDate').getFullYear();
                            to_month = $('#pickerTo').datepicker('getDate').getMonth() + 1;
                            to_date = $('#pickerTo').datepicker('getDate').getDate();
                        } else {

                            from_year = _fromYear;
                            from_month = _fromMonth;
                            from_date = 1;

                            dateFiller = new Date(_fromYear, _fromMonth - 1, 1);
                            dateFiller.setMonth(dateFiller.getMonth() + 1);
                            dateFiller.setDate(0);

                            to_year = dateFiller.getFullYear();
                            to_month = dateFiller.getMonth() + 1;
                            to_date = dateFiller.getDate();
                        }

                        break;
                }
                break;
            case "fulllist":
                container.from = false;
                container.to = false;
                container.fromConvertedString = false;
                container.toConvertedString = false;
                return container;
                break;
        }


        container.from = {year: from_year, month: from_month, date: from_date};
        container.to = {year: to_year, month: to_month, date: to_date};
        container.fromConvertedString = from_year + "-" + ConvertDateComponentTo2CharsFormat(from_month) + "-" + ConvertDateComponentTo2CharsFormat(from_date) + "T" + "00" + ":" + "00";
        container.toConvertedString = to_year + "-" + ConvertDateComponentTo2CharsFormat(to_month) + "-" + ConvertDateComponentTo2CharsFormat(to_date) + "T" + "23" + ":" + "59";

        return container;
    }

    function PassedDateChecker(_date) {
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        _date.setHours(23, 59, 0, 0);
        if (_date > currentDate) {
            return false;
        } else {
            return true;
        }
    }

//Отметка кнопки в меню нажатой
    function ClickedButtonDecorationChange(_containerId, _newClickedOptionsAttr, _menuType) {
        //Добавочные либо основные кнопки
        _menuType = _menuType || "options";
        var buttonsContainer = $('#' + _containerId);
        buttonsContainer.children().removeClass("menu-button-pressed");
        var tester = buttonsContainer.children('[data-options=datelist]');
        if (_menuType == "options") {
            buttonsContainer.find('[data-options=\"' + _newClickedOptionsAttr + "\"]").addClass("menu-button-pressed");
        } else {
            buttonsContainer.find('[data-cal_type=\"' + _newClickedOptionsAttr + "\"]").addClass("menu-button-pressed");
        }

    }

    function FillDateTimeDict(_year, _month, _date, _hour, _minute) {
        var dict = {};
        if (_year) {
            dict["year"] = _year;
        }
        if (_year) {
            dict["month"] = _month;
        }
        if (_year) {
            dict["date"] = _date;
        }
        if (_year) {
            dict["hour"] = _hour;
        }
        if (_year) {
            dict["minute"] = _minute;
        }
        return dict;
    }

    function GetDateTimeFromString(_str) {
        var dateComponents = _str.split("-");
        return {
            "year": dateComponents[0],
            "month": dateComponents[1],
            "date": dateComponents[2]
        }
    }

    function UpdateData(_onlyEvents, _notify) {
        $('#noEventsExclamation_container').remove();
        if (_onlyEvents) {
            FillEvents($('#calendarEvents_paginator').attr("data-current_page"));
        }
        else {
            var dateRange = GetCurrentDateRange();
            var calType = CurrentCalType();
            var calOption = CurrentCalOptions();
            FillFrameData(calType, calOption, dateRange.fromConvertedString, dateRange.toConvertedString);
            FillContent(calType, calOption, dateRange.fromConvertedString, dateRange.toConvertedString);
        }
        if (_notify) {
            ShowNotify_LoadDataSuccess();
        }
        return;
    }
}
