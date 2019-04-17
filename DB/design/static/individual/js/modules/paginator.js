//PAGINATOR FRAME
function Paginator(_containers, _urls, _params, _functions, _options) {
    var paginatorContainer = _containers["paginator"];
    var paginatorBottomContainer = _containers["paginator_bottom"] || false;
    var contentContainer = _containers["content"];
    var getPagesCountUrl = _urls["pages_count"];
    var getPageDataUrl = _urls["content"];
    var getPageDataFunction = _functions['get_page_data'];
    var postParams = _params;
    //options
    _options = _options || {};
    var noBigShiftArrows = _options["nobigshift"] || false;
    var ownDataStructure = _options["owndatastructure"] || false;
    var noEventsExecute = _options["noeventsexecute"] || false;

    var currentPage = 1;
    var pagesCount = 0;
    var pagesCreated = false;
    var allPages = $.cookie(getPagesCountUrl.replace("/", "")) || "false";

    this.Create = function () {
        ClearContainer();
        GetPagesCountAndCreate();
    };
    this.Update = function () {
        FillPageData(currentPage);
    };

    function CreatePages() {
        paginatorContainer.addClass("vertical-center");
        paginatorContainer.empty();
        if (paginatorBottomContainer) {
            paginatorBottomContainer.empty();
        }
        //Контейнеры для элементов -
        var divContainer = $('<div>').addClass("vertical-center").appendTo(paginatorContainer);
        var pagesContainer = $('<ul>').attr("id", "paginator-pagesContainer").addClass("pagination-text-color pagination pagination-sm pagination-text").appendTo(divContainer);
        var divContainer = $('<div>').addClass("vertical-center").css("margin-top", "10").appendTo(paginatorContainer);
        var arrowsContainer = $('<ul>').attr("id", "paginator-arrowsContainer").addClass("pagination-text-color pagination pagination-sm pagination-text").appendTo(divContainer);
        if (pagesCount == 0) {
            $(contentContainer).empty();

            if (noEventsExecute) {
                var fillPagePostParams = {};
                for (var postVar in postParams) {
                    fillPagePostParams[postVar] = postParams[postVar];
                }
                fillPagePostParams["page"] = 1;
                $.post(getPageDataUrl, fillPagePostParams, function (response) {
                    var data = ResponseToNotify(response);
                    if (response["status"] != "data") {
                        return;
                    }
                    contentContainer.empty();
                    if (ownDataStructure) {
                        getPageDataFunction(contentContainer, data, true);
                    } else {
                        getPageDataFunction(contentContainer, data["list"], true);
                    }
                    var noEventsExclamation = $('<div>').addClass("datestamp events_frame-decoration").css("left", 0).text("Нет элементов для указанных фильтров.").css("text-align", "center").appendTo(contentContainer);

                });
            } else {
                var noEventsExclamation = $('<div>').addClass("datestamp").text("Нет элементов для указанных фильтров.").css("text-align", "center").appendTo(contentContainer);

            }
            //Если число страниц  нулевое, добавляем уведомление о том что событий нет
            return;
        }
        //Стрелка влево на одну страницу
        var liElement = $('<li>').attr("title", "Назад на одну страницу").appendTo(arrowsContainer);
        $('<a>').addClass("bootstrap-correct-icons glyphicon glyphicon-chevron-left paginator-buttons").appendTo(liElement);
        $(liElement).on("click", (function () {
            UpdatePagesData(+$(paginatorContainer).find('#paginator-pagesContainer').attr("data-current_page") - 1);
        }));

        if (!noBigShiftArrows) {
            //Стрелка влево на десять страниц
            liElement = $('<li>').attr("title", "Назад на десять страниц").appendTo(arrowsContainer);
            $('<a>').addClass("bootstrap-correct-icons glyphicon glyphicon-fast-backward paginator-buttons").appendTo(liElement);
            $(liElement).on("click", (function () {
                UpdatePagesData(+$(paginatorContainer).find('#paginator-pagesContainer').attr("data-current_page") - 10);

            }));
        }

        if (pagesCount > 9) {
            var liElement = $('<li>').attr("title", "Показать полный список страниц (" + pagesCount + ")").appendTo(arrowsContainer);
            if (allPages == "true") {
                $('<a>').addClass("bootstrap-correct-icons glyphicon glyphicon-resize-small paginator-buttons").appendTo(liElement);
                $(paginatorContainer).find('#paginator-pagesContainer').attr("data-all_pages", "true");
            } else {
                $(paginatorContainer).find('#paginator-pagesContainer').attr("data-all_pages", "false");
                $('<a>').addClass("bootstrap-correct-icons glyphicon glyphicon-resize-full paginator-buttons").appendTo(liElement);
            }
            $(liElement).on("click", (function () {
                if ($(paginatorContainer).find('#paginator-pagesContainer').attr("data-all_pages") == "true") {
                    $(paginatorContainer).find('#paginator-pagesContainer').attr("data-all_pages", "false");
                    $.cookie(getPagesCountUrl.replace("/", ""), "false", {path: '/'});
                    $(this).children().removeClass("glyphicon-resize-small");
                    $(this).children().addClass("glyphicon-resize-full");
                    $(this).attr("title", "Показать полный список страниц (" + pagesCount + ")");
                }
                else {
                    $(paginatorContainer).find('#paginator-pagesContainer').attr("data-all_pages", "true");
                    $.cookie(getPagesCountUrl.replace("/", ""), "true", {path: '/'});
                    $(this).children().removeClass("glyphicon-resize-full");
                    $(this).children().addClass("glyphicon-resize-small");
                    $(this).attr("title", "Свернуть полный список страниц (" + pagesCount + ")");
                }

                UpdatePagesData(+$(paginatorContainer).find('#paginator-pagesContainer').attr("data-current_page"));
            }));
        }
        if (!noBigShiftArrows) {
            //Стрелка вправо на десять страниц
            liElement = $('<li>').attr("title", "Вперед на десять страниц").appendTo(arrowsContainer);
            $('<a>').addClass("bootstrap-correct-icons glyphicon glyphicon-fast-forward paginator-buttons").appendTo(liElement);
            $(liElement).on("click", (function () {
                UpdatePagesData(+$(paginatorContainer).find('#paginator-pagesContainer').attr("data-current_page") + 10);
            }));
        }
        //Стрелка вправо на одну страницу
        liElement = $('<li>').attr("title", "Вперед на одну страницу").appendTo(arrowsContainer);
        $('<a>').addClass("bootstrap-correct-icons glyphicon glyphicon-chevron-right paginator-buttons").appendTo(liElement);
        $(liElement).on("click", (function () {
            UpdatePagesData(+$(paginatorContainer).find('#paginator-pagesContainer').attr("data-current_page") + 1);

        }));
        pagesContainer.attr("data-current_page", 0);
        UpdatePagesData(1);
        if (!pagesCreated) {
            ContainerLoadIndicatorShow(contentContainer.parent());
        }
        pagesCreated = true;
        return;
    }

    function UpdatePagesData(_choosenPage) {
        //Преобразование в число - для безопасности
        _choosenPage = +_choosenPage;
        //Границы для наполнения контента
        var firstPage = 0;
        var lastPage = 0;

        //Выбор текущего ul-контейнера пагинатора в зависимости от раскрытости всех страниц
        var paramsContainer = $(paginatorContainer).find('#paginator-pagesContainer');

        if (paramsContainer.attr("data-all_pages") == "true") {
            var _container = $(paginatorContainer).find('#paginator-pagesContainer');
        } else {
            var _container = $(paginatorContainer).find('#paginator-arrowsContainer');
        }
        //Удаление отметки текущей выделенной страницы
        _container.find(".choosen-page").removeClass("choosen-page");
        //Защита от выбора страницы меньше первой

        if (_choosenPage < 1) {
            _choosenPage = 1;
        }
        //Защита от выбора страницы больше чем общее число страниц
        if (_choosenPage > pagesCount) {
            _choosenPage = pagesCount;
        }
        //Если выбран режим отображения всех страниц
        if (paramsContainer.attr("data-all_pages") == "true" || pagesCount < 10) {
            firstPage = 1;
            lastPage = pagesCount;

        } else {
            //Если выбранная страница больше пятой - поставить ее в середину
            if (_choosenPage > 5) {
                firstPage = _choosenPage - 4;
                lastPage = _choosenPage + 4;

                if (firstPage < 1) {
                    var shift = -firstPage + 1;
                    firstPage = 1;
                    lastPage += shift;
                }
                else if (lastPage > pagesCount) {
                    var shift = lastPage - pagesCount;
                    lastPage = pagesCount;
                    firstPage -= shift;
                }
            }
            else {
                firstPage = 1;
                lastPage = 9;

            }
        }
        var pages = $(_container).find('.page_in_paginator');

        //Переменные для сравнения - либо перерисовать страницы, либо просто выделить выбранную
        var firstPageCompare = +($(pages[0]).children().text());
        var lastPageCompare = +($(pages[pages.length - 1]).children().text());
        //Если страницы не нужно обновлять - только выделяем необходимую страницу
        if (firstPage == firstPageCompare && lastPage == lastPageCompare) {
            pages.removeClass("choosen-page");
            for (var i = 0; i < pages.length; i++) {
                if ((firstPage + i) == _choosenPage) {
                    $(pages[i]).addClass("choosen-page");
                }
            }
        }
        //В ином случае удаляем страницы и перерисовываем заново
        else {

            $(paginatorContainer).find('#paginator-pagesContainer').find('.page_in_paginator').remove();
            $(paginatorContainer).find('#paginator-arrowsContainer').find('.page_in_paginator').remove();
            //Элемент для ориентации при добавлении
            if (noBigShiftArrows) {
                var pointerElement = _container.find(".glyphicon-chevron-left").parent();
            }
            else {
                var pointerElement = _container.find(".glyphicon-fast-backward").parent();
            }

            for (i = lastPage; i > firstPage - 1; i--) {

                var newPageElem = $('<li>').attr("data-page", i).addClass("page_in_paginator");
                if (pointerElement.length != 0) {
                    newPageElem.insertAfter(pointerElement);
                } else {
                    newPageElem.prependTo(_container);
                }
                $('<a>').text(i).appendTo(newPageElem);
                if (i == _choosenPage) {
                    $(newPageElem).addClass("choosen-page");
                }
                (function (x) {
                    newPageElem.click(function () {
                        UpdatePagesData(x);
                    })
                })(i);
            }
        }

        //Задание пагинатору атрибута - номера текущей страницы
        paramsContainer.attr("data-current_page", _choosenPage);
        if (getPageDataFunction) {
            FillPageData(_choosenPage);
        }
        return _choosenPage;

    }

    function FillPageData(_page) {
        currentPage = _page;
        if (paginatorBottomContainer != 0) {
            $(paginatorBottomContainer).empty();
            $(paginatorContainer).clone(true).appendTo($(paginatorBottomContainer));
        }
        //Параметры запроса с параметром - страница
        var fillPagePostParams = {};
        for (var postVar in postParams) {
            fillPagePostParams[postVar] = postParams[postVar];
        }
        fillPagePostParams["page"] = _page;
        if (pagesCreated) {
            ContainerLoadIndicatorShow(contentContainer);
        }
        $.post(getPageDataUrl, fillPagePostParams, function (response) {
            var data = ResponseToNotify(response);
            if (response["status"] != "data") {
                return;
            }
            if (pagesCreated) {
                ContainerLoadIndicatorHide();
            }
            contentContainer.empty();
            if (ownDataStructure) {
                getPageDataFunction(contentContainer, data);
            } else {
                getPageDataFunction(contentContainer, data["list"]);
            }
        });
        return;
    }
    function GetPagesCountAndCreate() {
        var pagesCountParams = ObjClone(postParams);
        pagesCountParams["paginator"] = 1;
        $.post(getPagesCountUrl, pagesCountParams, function (response) {
            var data = ResponseToNotify(response);
            if (response["status"] != "data") {
                return;
            }
            pagesCount = data["page_count"];
            CreatePages();
        });
    }

    function ClearContainer() {
        $(paginatorContainer).empty();
        $(contentContainer).empty();
        if (paginatorBottomContainer) {
            paginatorBottomContainer.empty();
        }
    }
}
