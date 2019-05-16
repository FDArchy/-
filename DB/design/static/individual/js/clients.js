//COMMON

function EditCompany(_onSuccess, _id, _showOnly, _fromEvent) {
    //Если идентификатор передан, то загружаем данные компании
    var modalWindowHeader = "";
    var coreFrame = EditCompany_Core();
    var requestAdress = "";
    var requestParams = {};
    if (_id) {
        if(_showOnly){
            modalWindowHeader = "Просмотр учреждения";
        }else{
            modalWindowHeader = "Редактирование учреждения";
        }

        requestAdress = "/aj_company_company_data_content/";
        requestParams["id"] = _id;
        requestParams["from_event"] = _fromEvent;
    } else {
        modalWindowHeader = "Добавление учреждения";
        requestAdress = "/aj_api_all/";
        requestParams["allowed_cities"] = true;
    }
    $.post(requestAdress, requestParams, function (response) {
        var data = ResponseToNotify(response);
        if (response["status"] != "data") {
            return;
        }
        //При редактировании заполнение данных, при добавлении заполнение шоу

        if (_id) {
            $(coreFrame).find("#companyEdit_ctype").val(data["company"]["ctype"]).attr("title", data["company"]["ctype"]);
            $(coreFrame).find("#companyEdit_city").val(data["company"]["city_id"]);
            $(coreFrame).find("#companyEdit_name").val(data["company"]["name"]).attr("title", data["company"]["name"]);
            $(coreFrame).find("#companyEdit_adress").val(data["company"]["adress"]).attr("title", data["company"]["adress"]);
            $(coreFrame).find("#companyEdit_telephone").val(data["company"]["telephone"]).attr("title", data["company"]["telephone"]);
            $(coreFrame).find("#companyEdit_contacts").val(data["company"]["contacts"]).attr("title", data["company"]["contacts"]);
            $(coreFrame).find("#companyEdit_site").val(data["company"]["site"]).attr("title", data["company"]["site"]);
            $(coreFrame).find("#companyEdit_email").val(data["company"]["email"]).attr("title", data["company"]["email"]);
            $(coreFrame).find("#companyEdit_comment").val(data["company"]["comment"]).attr("title", data["company"]["comment"]);

            if(_showOnly || data["user_type"] == "admin"){
                var divContainer = $('<div>').addClass("form-group").prependTo(coreFrame);
                var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_city").text("Город").appendTo(divContainer);
                var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
                var selectCompanyCity = $('<select>').attr("id", "companyEdit_city").attr("required", true).addClass("form-control input-sm").appendTo(controlContainer);

                if(_showOnly){
                    $('<option>').text(data["city_name"]).val(data["company"]["city_id"]).appendTo(selectCompanyCity);
                    $(coreFrame).find('select').attr("disabled", "disabled").removeAttr("placeholder");
                    $(coreFrame).find('input').attr("readonly", "readonly").removeAttr("placeholder");
                    $(coreFrame).find('textarea').attr("readonly", "readonly").removeAttr("placeholder");
                }else{
                    for (var i = 0; i < data["cities"].length; i++) {
                        var option = $('<option>').val(data["cities"][i]["id"]).text(data["cities"][i]["name"]).appendTo(selectCompanyCity);
                        if(data["cities"][i]["id"] == data["company"]["city_id"]){
                            option.attr("selected", "selected");
                        }
                    }
                }

            }
        } else {
            //Заполнение городов
            var divContainer = $('<div>').addClass("form-group").prependTo(coreFrame);
            var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_shows").text("Шоу").appendTo(divContainer);
            var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
            var selectArtists = $('<select>').attr("id", "companyEdit_shows").attr("required", true).attr("multiple", "multiple").addClass("form-control input-sm").appendTo(controlContainer);
            var divContainer = $('<div>').addClass("form-group").prependTo(coreFrame);
            var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_city").text("Город").appendTo(divContainer);
            var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
            var selectCompanyCity = $('<select>').attr("id", "companyEdit_city").attr("required", true).addClass("form-control input-sm").appendTo(controlContainer);
            selectCompanyCity.change(function(){
                var artistsSelect = $('#companyEdit_shows');
                artistsSelect.empty();
                if(!$('#companyEdit_city').val()){
                    return;
                }

                ContainerLoadIndicatorShow(artistsSelect.next());
                $.post("/aj_api_all/", {id: $('#companyEdit_city').val(), city: 1, allowed_city_shows: 1}, function (response) {
                    ContainerLoadIndicatorHide();
                    var data = ResponseToNotify(response);
                    if(response["status"] != "data"){
                        return;
                    }

                    var shows = data["list"];
                    for(var i = 0; i < shows.length; i++){
                        $('<option>').val(shows[i]["id"]).text(shows[i]["name"]).appendTo(artistsSelect);
                    }
                    $("#companyEdit_shows").select2({//Преобразует элемент управления к Select2 виду
                        placeholder: "Выберите доступные шоу",
                        allowClear: true,
                        language: "ru",
                        multiple: true
                    });
                });
            });
            var cities = data["allowed_cities"];
            $('<option>').attr("disabled", "true").attr("hidden", "true").attr("selected", "true").text("Выберите город").appendTo(selectCompanyCity);
            for (var i = 0; i < cities.length; i++) {
                $('<option>').val(cities[i]["id"]).text(cities[i]["name"]).appendTo(selectCompanyCity);
            }


        }
        var modalButtonTypes = "";
        if(_id){
            if(_showOnly) {
                modalButtonTypes = "customcancel";
            }else {
                modalButtonTypes = "custom";
            }
        }else{
            modalButtonTypes = "okcancel";
        }
        var controlButtons = {};
        controlButtons["Перейти к учреждению"] = {
            "button": $('<button>').css("background-color", "#5cb85c").css("color", "white").append($('<span>').addClass("glyphicon glyphicon-share-alt").css("top", "-1px")),
            "function": function () {
                GoToCompanyPage(_id);
            }
        };
        var modalWindow = showModalWindow_new(modalButtonTypes, modalWindowHeader, coreFrame, function () {
            if (TotalInputsValidator(modalWindow)) {
                $.post("/aj_company_edit_or_add/", {
                    id: _id,
                    changed: GetVariablesFromModalToDict("modalWindow", "companyEdit")
                }, function (response) {
                    if(ResponseToNotify(response) == "success"){
                        UpdateData(true);
                    }
                });
                hideModalWindow(modalWindow);
            }
        }, controlButtons);
        $("#companyEdit_ctype").select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите тип учреждения.",
            allowClear: true,
            language: "ru"
        });
        $("#companyEdit_city").select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите город.",
            allowClear: true,
            language: "ru"
        });
        $("#companyEdit_shows").select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите город, для загрузки доступных шоу.",
            allowClear: true,
            language: "ru"
        });
        return;
    });
}

function EditCompany_Core() {
    var mainForm = $('<form>').addClass("form-horizontal");
    var divContainer = $('<div>').addClass("form-group").appendTo(mainForm);
    var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_ctype").text("Тип").appendTo(divContainer);
    var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
    var selectCompanyType = $('<select>').attr("id", "companyEdit_ctype").attr("required", true).addClass("form-control input-sm").appendTo(controlContainer);
    $('<option>').attr("disabled", "true").attr("hidden", "true").attr("selected", "true").text("Выберите тип учреждения").appendTo(selectCompanyType);
    var option = $('<option>').text("ДС").val("ДС").appendTo(selectCompanyType);
    var option = $('<option>').text("ШК").val("ШК").appendTo(selectCompanyType);
    var option = $('<option>').text("ДК").val("ДК").appendTo(selectCompanyType);
    var option = $('<option>').text("ДО").val("ДО").appendTo(selectCompanyType);
    var divContainer = $('<div>').addClass("form-group").appendTo(mainForm);
    var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_name").text("Название").appendTo(divContainer);
    var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
    var inputCompanyName = $('<input>').attr("placeholder", "Укажите название компании").attr("required", true).attr("autocomplete", "off").attr("type", "text").attr("id", "companyEdit_name").addClass("form-control input-sm").appendTo(controlContainer);
    var divContainer = $('<div>').addClass("form-group").appendTo(mainForm);
    var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_adress").text("Адрес").appendTo(divContainer);
    var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
    var inputCompanyAdress = $('<input>').attr("placeholder", "Укажите адрес компании").attr("required", true).attr("autocomplete", "off").attr("type", "text").attr("id", "companyEdit_adress").addClass("form-control input-sm").appendTo(controlContainer);
    var divContainer = $('<div>').addClass("form-group").appendTo(mainForm);
    var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_telephone").text("Телефоны").appendTo(divContainer);
    var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
    var inputCompanyTelephone = $('<input>').attr("placeholder", "Укажите телефоны, разделяя их символом ';'").attr("autocomplete", "off").attr("type", "text").attr("id", "companyEdit_telephone").addClass("form-control input-sm").appendTo(controlContainer);
    var divContainer = $('<div>').addClass("form-group").appendTo(mainForm);
    var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_contacts").text("Контакты").appendTo(divContainer);
    var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
    var inputCompanyContacts = $('<input>').attr("placeholder", "Укажите контакты").attr("autocomplete", "off").attr("type", "text").attr("id", "companyEdit_contacts").addClass("form-control input-sm").appendTo(controlContainer);
    var divContainer = $('<div>').addClass("form-group").appendTo(mainForm);
    var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_site").text("Сайт").appendTo(divContainer);
    var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
    var inputCompanySite = $('<input>').attr("placeholder", "Укажите сайт").attr("autocomplete", "off").attr("id", "companyEdit_site").addClass("form-control input-sm").appendTo(controlContainer);
    var divContainer = $('<div>').addClass("form-group").appendTo(mainForm);
    var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_email").text("Почта").appendTo(divContainer);
    var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
    var inputCompanyEMail = $('<input>').attr("placeholder", "Укажите адрес электронной почты").attr("autocomplete", "off").attr("id", "companyEdit_email").addClass("form-control input-sm").appendTo(controlContainer);
    var divContainer = $('<div>').addClass("form-group").appendTo(mainForm);
    var label = $('<label>').addClass("col-md-3 small text-primary control-label text-left").attr("for", "companyEdit_comment").text("Комментарий").appendTo(divContainer);
    var controlContainer = $('<div>').addClass("col-md-9").appendTo(divContainer);
    var textAreaCompanyComment = $('<textarea>').attr("placeholder", "Укажите примечание к компании").attr("autocomplete", "off").attr("rows", "3").css("resize", "none").attr("id", "companyEdit_comment").addClass("form-control input-sm").appendTo(controlContainer);

    return mainForm;
}

function RemoveCompany(_id, _container) {
    var frame = $('<form>').addClass("form-horizontal");
    var exclamation = $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 15).text("ВНИМАНИЕ!").appendTo(frame);

    var exclamation = $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 55).text("Удаление компании затронет также все связанные с ними звонки, задачи, логи и мероприятия").appendTo(frame);

    var removeConfirmToggle = $('<div>').appendTo(frame);
    var labelContainer = $('<div>').addClass("col-md-10").css("text-align", "right").appendTo(removeConfirmToggle);
    var toggleContainer = $('<div>').addClass("col-md-2").css("text-align", "right").appendTo(removeConfirmToggle);
    var removeConfirmToggle = $('<input>').attr("id", "removeConfirmToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
    $('<label>').attr("for", "removeConfirmToggle").addClass("text-primary control-label").text("Подтверждение удаления").css("user-select", "none").appendTo(labelContainer);

    var currentModalWindow = showModalWindow_new("okcancel", "Удаление компании", frame, function () {
        $.post("/aj_company_remove/", {
            id: _id,
            remove_confirm: $(removeConfirmToggle).prop("checked")
        }, function (response) {
            var responseStatus = ResponseToNotify(response);
            if (responseStatus == "success" || responseStatus == "info") {
                hideModalWindow(currentModalWindow);
                if (response["status"] == "success") {
                    ContainerLoadIndicatorShow(_container);
                    setTimeout(function () {
                        (window.location = "clients/")
                    }, 5000);
                }
            } else {
                return;
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

}//Удаление учреждения
function Companies_Paginator() {
    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};
    var options = {};

    urls["pages_count"] = "/aj_clients_list/";
    urls["content"] = "/aj_clients_list/";

    params["search"] = $('#search_panel').find("input").val();
    params["city_id"] = $('#cityPickerTittle').attr("data-id");
    params["show_id"] = $('#showPickerTittle').attr("data-id");
    params["companies_count"] = $('#selectCompaniesCount').val();
    params["sort_by"] = $('#selectSortBy').val();
    params["filter_type"] = $('#selectFilterType').val();


    containers["paginator"] = $('#clientsPaginator');
    containers["content"] = $('#clientsContent');
    containers["paginator_bottom"] = $('#clientsBottomPaginator');

    options["owndatastructure"] = true;

    functions["get_page_data"] = Companies_Content;

    paginator = new Paginator(containers, urls, params, functions, options);
    paginator.Create();

    return paginator.Update;
}

function Companies_Content(_container, _data) {
    var table = $('<table>').attr("id", "clientsTable").addClass("table clients-list text-in-clients-table table-bordered").appendTo(_container);
    if(LargeFontNeed()){
        $(table).css("font-size", "13px");
    }
    var tbody = $('<tbody>').appendTo(table);
    var tr = $('<tr>').addClass("clients-table-header-row-decoration").appendTo(tbody);
    var td = $('<td>').css("width", "4%").text("Код").appendTo(tr);
    var td = $('<td>').css("width", "4%").text("Тип").appendTo(tr);
    var td = $('<td>').css("width", "17%").text("Название").appendTo(tr);
    var td = $('<td>').css("width", "14%").text("Город").appendTo(tr);
    var td = $('<td>').css("width", "14%").text("Адрес").appendTo(tr);
    var td = $('<td>').css("width", "14%").text("Последний звонок").appendTo(tr);
    var td = $('<td>').css("width", "110px").text("Данные").appendTo(tr);
    var td = $('<td>').css("width", "10%").text("Звонок").appendTo(tr);
    var td = $('<td>').css("width", "10%").text("Задача").appendTo(tr);
    var td = $('<td>').css("width", "10%").text("Мероприятие").appendTo(tr);


    var companies = _data["companies"];
    var managerId = _data["manager__siteuser__id"];
    for (var i = 0; i < companies.length; i++) {
        var trElement = $('<tr>').attr("data-company-id", companies[i]["id"]).addClass("little-selection").appendTo(tbody);

        var tdElement = $('<td>').text(companies[i]["id"]).attr("title", companies[i]["id"]).addClass("active_content").appendTo(trElement);
        (function (f) {
            tdElement.click(function () {
                EditCompany(function () {
                    UpdateData(true)
                }, companies[f]["id"])
            });
        })(i);

        var tdElement = $('<td>').text(companies[i]["type"]).addClass("active_content").attr("title", companies[i]["type"]).appendTo(trElement);
        (function (f) {
            tdElement.click(function () {
                LogsHistory_Paginator("companies_history", companies[f]["id"]);
            });
        })(i);
        var tdElement = $('<td>').text(companies[i]["name"]).attr("title", companies[i]["name"]).addClass("active_content").attr("data-company_name", "true").appendTo(trElement);
        tdElement.on("click", (function () {
            GoToCompanyPage($(this).parent().attr("data-company-id"));
        }));

        var tdElement = $('<td>').text(companies[i]["city_name"]).attr("title", companies[i]["city_name"]).appendTo(trElement);
        var tdElement = $('<td>').text(companies[i]["adress"]).addClass("active_content").attr("title", companies[i]["adress"]).appendTo(trElement);
        (function (x) {
            tdElement.click(function () {
                GoToYaAdress(companies[x]["city_name"], companies[x]["adress"]);
            });
        })(i);
        var tdElement = $('<td>').text(companies[i]["call_comment"]).attr("title", companies[i]["call_comment"]).addClass("active_content").appendTo(trElement);
        (function (x) {
            if(companies[x]["last_call"]["id"]){
                tdElement.on("click", function (event) {
                ShowCall(companies[x]["last_call"]["id"]);
            });
            }else{
                tdElement.on("click", function (event) {
                    ShowNotify("3", "Нет последнего звонка в этом учреждении");
                });
            }
        })(i);
        var tdElement = $('<td>').appendTo(trElement);
        if (!companies[i]["is_have_contacts"]) {
            tdElement.append($('<span>').addClass("glyphicon glyphicon-user text-primary icon-clients-list icon-clients-list-unactive").attr("title", "Контактные данные не указаны").attr("data-field_name", "contacts").attr("data-field_verbose", "Контакты").on("click", function (event) {
                ChangeCompanyField(this, event);
            }));
        } else {
            tdElement.append($('<span>').addClass("glyphicon glyphicon-user text-primary icon-clients-list").attr("title", "Контакты").attr("data-field_name", "contacts").attr("data-field_verbose", "Контакты").on("click", function (event) {
                ChangeCompanyField(this, event);
            }));
        }
        if (!companies[i]["is_have_telephone"]) {
            tdElement.append($('<span>').addClass("glyphicon glyphicon-phone text-primary icon-clients-list icon-clients-list-unactive").attr("title", "Телефоны не указаны").attr("data-field_verbose", "Телефоны").attr("data-field_name", "telephone").on("click", function (event) {
                ChangeCompanyField(this, event);
            }));
        } else {
            tdElement.append($('<span>').addClass("glyphicon glyphicon-phone text-primary icon-clients-list").attr("title", "Телефоны").attr("data-field_name", "telephone").attr("data-field_verbose", "Телефоны").on("click", function (event) {
                ChangeCompanyField(this, event);
            }));
        }
        if (!companies[i]["is_have_comment"]) {
            tdElement.append($('<span>').addClass("glyphicon glyphicon-comment text-primary icon-clients-list icon-clients-list-unactive").attr("title", "Комментарии не указаны").attr("data-field_name", "comment").attr("data-field_verbose", "Комментарии").on("click", function (event) {
                ChangeCompanyField(this, event);
            }));
        } else {
            tdElement.append($('<span>').addClass("glyphicon glyphicon-comment text-primary icon-clients-list").attr("title", "Комментарии").attr("data-field_name", "comment").attr("data-field_verbose", "Комментарии").on("click", function (event) {
                ChangeCompanyField(this, event);
            }));
        }
        if (!companies[i]["is_have_site"]) {
            tdElement.append($('<span>').addClass("glyphicon glyphicon-globe text-primary icon-clients-list icon-clients-list-unactive").attr("title", "Сайт не указан").attr("data-field_name", "site").attr("data-field_verbose", "Сайт").on("click", function (event) {
                ChangeCompanyField(this, event);
            }));
        } else {
            tdElement.append($('<span>').addClass("glyphicon glyphicon-globe text-primary icon-clients-list").attr("title", "Сайт").attr("data-field_name", "site").attr("data-field_verbose", "Сайт").on("click", function (event) {
                ChangeCompanyField(this, event);
            }));
        }
        if (!companies[i]["is_have_email"]) {
            tdElement.append($('<span>').addClass("glyphicon glyphicon-envelope text-primary icon-clients-list icon-clients-list-unactive").attr("title", "Почта не указана").attr("data-field_name", "email").attr("data-field_verbose", "Почта").on("click", function (event) {
                ChangeCompanyField(this, event);
            }));
        } else {
            tdElement.append($('<span>').addClass("glyphicon glyphicon-envelope text-primary icon-clients-list").attr("title", "Почта").attr("data-field_name", "email").attr("data-field_verbose", "Почта").on("click", function (event) {
                ChangeCompanyField(this, event);
            }));
        }
        //Last Call
        if (companies[i]["last_call"]["datetime"])
            var last_call_date_countdown = ConvertDateToCountDownValue(ConvertDateToJSFormat(companies[i]["last_call"]["datetime"]));
        else
            var last_call_date_countdown = "";

        var tdElement = $('<td>').attr("data-elem_id", companies[i]["last_call"]["id"]).attr("data-elem_type", "c").attr("data-show_id", companies[i]["last_call"]["artist__id"]).appendTo(trElement);
        if (last_call_date_countdown != "") {
            tdElement.append(($('<div>').addClass("square").css("background", companies[i]["last_call"]["artist__color"]))).append(last_call_date_countdown);
            tdElement.attr("title", last_call_date_countdown.text() + " : " + companies[i]["last_call"]["artist__name"] + " - " + companies[i]["last_call"]["manager__siteuser__alias"]);
            if (managerId != companies[i]["last_call"]["manager__siteuser__id"]) {
                tdElement.css("opacity", "0.5");
                tdElement.attr("data-own", false);
            } else {
                tdElement.attr("data-own", true);
            }

        }
        tdElement.on("mouseenter", function () {
            ShowWorkBlock(this);
        });
        tdElement.on("mouseleave", function () {
            HideWorkBlock(this);
        });
        //Last Task
        if (companies[i]["last_task"]["datetime"])

            var last_task_date_countdown = ConvertDateToCountDownValue(ConvertDateToJSFormat(companies[i]["last_task"]["datetime"]));
        else
            var last_task_date_countdown = "";

        var tdElement = $('<td>').attr("data-elem_id", companies[i]["last_task"]["id"]).attr("data-elem_type", "t").attr("data-show_id", companies[i]["last_task"]["artist__id"]).appendTo(trElement);
        if (last_task_date_countdown != ""){
            tdElement.append(ReturnTaskStatusIconSpan(companies[i]["last_task"]["datetime"], companies[i]["last_task"]["done"]).css("margin-right", "4px"));
            tdElement.append(($('<span>').addClass("square").css("background", companies[i]["last_task"]["artist__color"]))).append(last_task_date_countdown);

            if(companies[i]["last_task"]["done"]){
                tdElement.attr("title", "Выполнена: " + last_task_date_countdown.text() + " : " + companies[i]["last_task"]["artist__name"] + " - " + companies[i]["last_task"]["manager__siteuser__alias"]);
            }else{
                tdElement.attr("title", "Не выполнена. Должна быть выполнена: " + last_task_date_countdown.text() + " : " + companies[i]["last_task"]["artist__name"] + " - " + companies[i]["last_task"]["manager__siteuser__alias"]);
            }
            if (managerId != companies[i]["last_task"]["manager__siteuser__id"]) {
                tdElement.css("opacity", "0.5");
                tdElement.attr("data-own", false);
            } else {
                tdElement.attr("data-own", true);
            }
        }
        tdElement.on("mouseenter", function () {
            ShowWorkBlock(this);
        });
        tdElement.on("mouseleave", function () {
            HideWorkBlock(this);
        });
        //Last Event
        if (companies[i]["last_event"]["datetime"])
            var last_event_date_countdown = ConvertDateToCountDownValue(ConvertDateToJSFormat(companies[i]["last_event"]["datetime"]));
        else
            var last_event_date_countdown = "";

        var tdElement = $('<td>').attr("data-elem_id", companies[i]["last_event"]["id"]).attr("data-elem_type", "e").attr("data-show_id", companies[i]["last_event"]["artist__id"]).appendTo(trElement);
        if (last_event_date_countdown != "") {
            tdElement.append(EventStatusIconPick(companies[i]["last_event"]["status"]).css("margin-right", "4px"));
            tdElement.append(($('<span>').addClass("square").css("background", companies[i]["last_event"]["artist__color"]))).append(last_event_date_countdown);
            tdElement.attr("title", EventStatusIconPick(companies[i]["last_event"]["status"], true) + ": " + last_event_date_countdown.text() + " : " + companies[i]["last_event"]["artist__name"] + " - " + companies[i]["last_event"]["manager__siteuser__alias"]);
            if (managerId != companies[i]["last_event"]["manager__siteuser__id"]) {
                tdElement.css("opacity", "0.5");
                tdElement.css("data-alien", "true");
                tdElement.attr("data-own", false);
            } else {
                tdElement.attr("data-own", true);
            }
        }
        tdElement.on("mouseenter", function () {
            ShowWorkBlock(this);
        });
        tdElement.on("mouseleave", function () {
            HideWorkBlock(this);
        });
    }
    $('#clientsTable').css("display", "table");
    return;
}

function Companies_FullList_Paginator() {
    var urls = {};
    var params = {};
    var containers = {};
    var functions = {};
    var options = {};

    urls["pages_count"] = "/aj_full_list/";
    urls["content"] = "/aj_full_list/";

    if ($('#selectManagers')) {
        params["manager"] = $('#selectManagers').val();
    }
    params["search"] = $('#search_panel').find("input").val();
    params["city_id"] = $('#cityPickerTittle').attr("data-id");
    params["show_id"] = $('#showPickerTittle').attr("data-id");
    params["companies_count"] = $('#selectCompaniesCount').val();
    params["sort_by"] = $('#selectSortBy').val();
    params["filter_type"] = $('#selectFilterType').val();
    params["only_own"] = $('#onlyOwn').is(':checked');
    params["only_free"] = $('#onlyFree').is(':checked');
    params["only_busy"] = $('#onlyBusy').is(':checked');

    containers["paginator"] = $('#clientsPaginator');
    containers["content"] = $('#clientsContent');
    containers["paginator_bottom"] = $('#clientsBottomPaginator');

    options["owndatastructure"] = true;

    functions["get_page_data"] = Companies_FullList_Content;

    paginator = new Paginator(containers, urls, params, functions, options);
    paginator.Create();

    return paginator.Update;
}

function Companies_FullList_Content(_container, _data) {
    var table = $('<table>').attr("id", "clientsList").addClass("table clients-list text-in-clients-table table-bordered").appendTo(_container);
    if(LargeFontNeed()){
        $(table).css("font-size", "13px");
    }
    var tbody = $('<tbody>').appendTo(table);
    var tr = $('<tr>').addClass("clients-table-header-row-decoration").appendTo(tbody);

    var td = $('<td>').addClass("td-with-checker").css("width", "2%").appendTo(tr);
    var span = $('<span>').attr("title", "Выбрать все").css("color", "rgb(66, 139, 202)").css("text-align", "left").appendTo(td);
    var input = $('<input>').attr("type", "checkbox").attr("id", "chooseAll").appendTo(span);
    var label = $('<label>').attr("for", "chooseAll").addClass("header").css("user-select", "none").appendTo(span);
    span.click(function (event) {
        event.preventDefault();
    });
    td.click(function () {
        var elems = $('#clientsList').find("td :checkbox[id!=\'chooseAll\']");
        if ($(this).find('input').prop('checked')) {
            $(this).find('input').prop('checked', false);
            elems.prop('checked', false);
            $(elems).parents('tr').removeClass("tr-checked");
        } else {
            $(this).find('input').prop('checked', true);
            elems.prop('checked', true);
            $(elems).parents('tr').addClass("tr-checked");
        }
        event.stopPropagation();
    });

    var td = $('<td>').css("width", "4%").text("Код").appendTo(tr);
    var td = $('<td>').css("width", "18%").text("Название").appendTo(tr);
    var td = $('<td>').css("width", "10%").text("Город").appendTo(tr);
    var td = $('<td>').css("width", "15%").text("Адрес").appendTo(tr);
    var td = $('<td>').css("width", "18%").text("Последний звонок").appendTo(tr);
    var td = $('<td>').css("width", "15%").text("Последняя активность").appendTo(tr);
    var td = $('<td>').css("width", "20%").text("Менеджеры").appendTo(tr);


    var companies = _data["companies"];
    var managerId = _data["manager__siteuser__id"];
    var counters = _data["counters"];
    for (i = 0; i < companies.length; i++) {
        var trElement = $('<tr>').attr("data-company-id", companies[i]["id"]).addClass("little-selection").appendTo(tbody);

        var tdElement = $('<td>').text(companies[i]["type"]).addClass("td-with-checker").appendTo(trElement);
        var span = $('<span>').attr("title", "Выбрать все").css("color", "rgb(66, 139, 202)").css("text-align", "left").appendTo(tdElement);
        var input = $('<input>').attr("type", "checkbox").attr("id", "choose" + companies[i]["id"]).appendTo(span);
        var label = $('<label>').attr("for", "choose" + companies[i]["id"]).addClass("header").css("user-select", "none").appendTo(span);
        span.click(function (event) {
            event.preventDefault();
        });
        tdElement.click(function () {
            event.preventDefault();
            if ($(this).find('input').prop('checked')) {
                $(this).find('input').prop('checked', false);
                $(this).parent().removeClass("tr-checked");

            } else {
                $(this).find('input').prop('checked', true);
                $(this).parent().addClass("tr-checked");
            }
            if ($('#clientsList').find("td :checkbox[id!=\'chooseAll\']:checked").length == $('#clientsList').find("td :checkbox[id!=\'chooseAll\']").length) {
                $('#clientsList').find("td :checkbox[id=\'chooseAll\']").prop('checked', true);
            } else {
                $('#clientsList').find("td :checkbox[id=\'chooseAll\']").prop('checked', false);
            }
            event.stopPropagation();
        });
        tdElement.mouseenter(function (event) {
            if (event.which == 1) {
                $(this).trigger('click');
            }
        });

        var tdElement = $('<td>').text(companies[i]["id"]).attr("title", companies[i]["id"]).addClass("active_content").appendTo(trElement);
        (function (f) {
            tdElement.click(function () {
                EditCompany(function () {
                    UpdateData(true)
                }, companies[f]["id"]);
            });
        })(i);

        var tdElement = $('<td>').text(companies[i]["name"]).attr("title", companies[i]["name"]).addClass("active_content").attr("data-company_name", "true").appendTo(trElement);
        tdElement.on("click", (function () {
            GoToCompanyPage($(this).parent().attr("data-company-id"));
        }));


        var tdElement = $('<td>').text(companies[i]["city_name"]).attr("title", companies[i]["city_name"]).appendTo(trElement);

        var tdElement = $('<td>').text(companies[i]["adress"]).addClass("active_content").attr("title", companies[i]["adress"]).appendTo(trElement);
        (function (x) {
            tdElement.click(function () {
                GoToYaAdress(companies[x]["city_name"], companies[x]["adress"]);
            });
            trElement.append(tdElement);
        })(i);


        var tdElement = $('<td>').text(companies[i]["call_comment"]).attr("title", companies[i]["call_comment"]).addClass("active_content").appendTo(trElement);
        (function (x) {
            if(companies[x]["last_call"]["id"]){
                tdElement.on("click", function (event) {
                    ShowCall(companies[x]["last_call"]["id"]);
                });
            }
            else{
                tdElement.on("click", function (event) {
                    ShowNotify("3", "Нет последнего звонка в этом учреждении");
                });
            }
        })(i);

        var tdElement = $('<td>').addClass("active_content").appendTo(trElement);

        if (companies[i]["last_event"]) {
            var actionDescription  = "";
            var eventInfoDiv = $('<div>').appendTo(tdElement);

            switch (companies[i]["last_event"]["table__name"]){
                case "Company":
                    actionDescription = "Редактирование. ";
                    $('<span>').addClass("glyphicon glyphicon-pencil text-primary").attr("title", "Редактирование").appendTo(eventInfoDiv);
                    $('<span>').text(" ").appendTo(eventInfoDiv);
                    break;
                case "Call":
                    actionDescription = "Звонок. ";
                    $('<span>').addClass("glyphicon glyphicon-earphone text-primary").attr("title", "Звонок").appendTo(eventInfoDiv);
                    $('<span>').text(" ").appendTo(eventInfoDiv);
                    break;
                case "Task":
                    actionDescription = "Задача. ";
                    $('<span>').addClass("glyphicon glyphicon-flag  text-primary").attr("title", "Задача").appendTo(eventInfoDiv);
                    $('<span>').text(" ").appendTo(eventInfoDiv);

                    break;
                case "Event":
                    actionDescription = "Мероприятие. ";
                    $('<span>').addClass("glyphicon glyphicon-play-circle  text-primary ").attr("title", "Мероприятие").appendTo(eventInfoDiv);
                    $('<span>').text(" ").appendTo(eventInfoDiv);

                    break;
                default:
                    break;
            }

            if (companies[i]["last_event"]["show"]) {
                actionDescription += companies[i]["last_event"]["show"]["name"];
                $('<span>').addClass("square").attr("title", companies[i]["last_event"]["show"]["name"]).css("background-color", companies[i]["last_event"]["show"]["color"]).appendTo(eventInfoDiv);
            }
            if (companies[i]["last_event"]["datetime"]) {
                ConvertDateToCountDownValue(ConvertDateFromStringValue(companies[i]["last_event"]["datetime"])).appendTo(eventInfoDiv);
            }
            actionDescription += ": " + companies[i]["last_event"]["whoChange__alias"];
            eventInfoDiv.attr("title", actionDescription);
            $('<span>').text(": " + companies[i]["last_event"]["whoChange__alias"]).appendTo(eventInfoDiv);
            tdElement.html(eventInfoDiv);
        } else {
            tdElement.attr("title", "Нет последнего события");
        }
        (function (x) {
            tdElement.click(function () {
                LogsHistory_Paginator("companies_history", companies[x]["id"]);
            });
        })(i);

        var tdElement = $('<td>').addClass("active_content").appendTo(trElement);
        for (var j = 0; j < companies[i]["managers"].length; j++) {
            var div = $('<div>').css("padding", 2).appendTo(tdElement);
            var textDiv = $('<div>').addClass("manager-shows-labels").attr("title", companies[i]["managers"][j]["name"]).text(companies[i]["managers"][j]["name"]).appendTo(div);
            for (var k = 0; k < companies[i]["managers"][j]["shows"].length; k++) {
                $('<span>').addClass("square").attr("title", companies[i]["managers"][j]["shows"][k]["show__name"]).css("background", companies[i]["managers"][j]["shows"][k]["show__color"]).appendTo(textDiv);
            }
        }
        (function (x) {
            tdElement.click(function () {
                CompanyManagers(companies[x]["id"]);
            });
        })(i);
    }
    UpdateFullListCounters(counters["all"], counters["free"], counters["busy"]);

    $('#clientsTable').css("display", "table");

    return;
}

function FullListMakeCompaniesFree() {
    var choosenCompanies = $('#clientsList').find("td :checkbox[id!=\'chooseAll\']:checked");
    if (choosenCompanies.length == 0) {
        ShowNotify(3, "Необходимо выбрать требуемые компании в левой части таблицы");
        return;
    }
    var companiesList = [];
    for (var i = 0; i < choosenCompanies.length; i++) {
        companiesList[i] = $(choosenCompanies[i]).parents("tr").attr("data-company-id");
    }
    var currentModalWindow = showModalWindow_new("okcancel", "Освободить выбранные компании?", "", function () {
        $.post("/aj_make_companies_free/", {
            companies: JSON.stringify(companiesList),
            show_id: $('#showPickerTittle').attr("data-id"),
            siteuser_id: $('#selectManagers').val()
        }, function (response) {
            var responseStatus = ResponseToNotify(response);
            if (responseStatus == "success" || responseStatus == "info") {
                UpdateData(true);
            } else {
                return;
            }
            hideModalWindow(currentModalWindow);
        });
    }, false, true);
    return;
}

function FullListTransferCompaniesTo(_choosenManager, _choosenShow, _pickYourself) {
    var choosenCompanies = $('#clientsList').find("td :checkbox[id!=\'chooseAll\']:checked");
    if (choosenCompanies.length == 0) {
        ShowNotify(3, "Необходимо выбрать требуемые компании в левой части таблицы");
        return;
    }
    var companiesList = [];
    for (var i = 0; i < choosenCompanies.length; i++) {
        companiesList[i] = $(choosenCompanies[i]).parents("tr").attr("data-company-id");
    }

    var loadDataLink = "";
    var dataLinkVars = {};
    var modalWindowTitle = "";
    if (_pickYourself) {
        loadDataLink = "/aj_api_all/";
        modalWindowTitle = "Забрать себе компании";
        dataLinkVars = {
            allowed_artists: 1,
            companies_for_check: JSON.stringify(companiesList)
        };
    } else {
        loadDataLink = "/aj_api_admin/";
        modalWindowTitle = "Передача компаний менеджеру";
        dataLinkVars = {
            allowed_artists: 1,
            managers: 1,
            managers_active: 1,
            companies_for_check: JSON.stringify(companiesList)
        };
    }
    //Подгрузка данных по менеджерам и шоу
    $.post(loadDataLink, dataLinkVars, function (response) {
        var data = ResponseToNotify(response);
        if (response["status"] != "data") {
            return;
        }

        var shows = data["allowed_shows"];
        if(shows.length == 0){
            ShowNotify("3", "Нет совпадающих шоу в выбранных компаниях, попробуйте выбрать компании одного города");
            return;
        }

        //Создание фрейма выбора менеджера и шоу
        var frame = $('<form>').addClass("form-horizontal");

        if (!_pickYourself) {
            var makeFreeToggle = $('<div>').css("height", "35px").appendTo(frame);
            var labelContainer = $('<div>').addClass("col-md-10").css("text-align", "right").appendTo(makeFreeToggle);
            var toggleContainer = $('<div>').addClass("col-md-2").css("text-align", "right").appendTo(makeFreeToggle);
            var makeFreeToggle = $('<input>').attr("id", "makeFreeToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
            $('<label>').attr("for", "makeFreeToggle").addClass("text-primary control-label").text("Освободить перед передачей").css("user-select", "none").appendTo(labelContainer);


            var managers = data["managers"];
            var innerDiv = $('<div>').addClass("form-group").css("margin-top", "35px").appendTo(frame);
            var header = $('<span>').addClass("medium-info-header").text("Менеджер").appendTo(innerDiv);
            var outerDiv = $('<div>').css("margin-bottom", "7px").appendTo(frame);
            var managerSelector = $('<select>').attr("id", "currentManagerSelector").attr("required", "required").css("width", "100%").appendTo(outerDiv)
            for (var manager in managers) {
                $('<option>').val(managers[manager]["id"]).text(managers[manager]["alias"]).appendTo(managerSelector);
            }

        }
        var innerDiv = $('<div>').addClass("form-group").css("margin-top", "35px").appendTo(frame);
        var header = $('<span>').addClass("medium-info-header").text("Доступные шоу").appendTo(innerDiv);
        var outerDiv = $('<div>').css("margin-bottom", "7px").appendTo(frame);
        var showsSelector = $('<select>').attr("id", "currentShowsSelector").attr("required", "required").css("width", "100%").appendTo(outerDiv)
        for (var show in shows) {
            $('<option>').val(shows[show]["id"]).text(shows[show]["name"]).appendTo(showsSelector);
        }
        var currentModalWindow = showModalWindow_new("okcancel", modalWindowTitle, frame, function () {
            if (!TotalInputsValidator(currentModalWindow)) {
                return;
            }
            var transferParams = {
                companies: JSON.stringify(companiesList),
                shows: JSON.stringify($('#currentShowsSelector').select2("val")),
                make_free: $('#makeFreeToggle').prop("checked")
            };
            if (!_pickYourself) {
                transferParams["siteuser_id"] = $('#currentManagerSelector').val();
            }
            $.post("/aj_transfer_companies_to/", transferParams, function (response) {
                var responseStatus = ResponseToNotify(response);
                if (responseStatus == "success" || responseStatus == "info") {
                    UpdateData(true);
                } else {
                    return;
                }
                hideModalWindow(currentModalWindow);
            });
        });
        $(managerSelector).select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите менеджера",
            language: "ru",
            allowClear: true
        });
        $(showsSelector).select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите доступные шоу",
            language: "ru",
            multiple: true,
            allowClear: true
        });
        $(makeFreeToggle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
        if (!_pickYourself) {
            managerSelector.val(0).trigger("change");
        }
        if (_choosenShow != +0) {
            showsSelector.val(_choosenShow).trigger("change");
        } else {
            showsSelector.val(0).trigger("change");
        }

    });


    return;
}

function FullListDistributeCity(_choosenCity, _choosenShow, _choosenManager) {
    //Подгрузка данных по менеджерам и шоу
    $.post("/aj_api_admin/", {
        artists: 1,
        managers: 1,
        cities: 1
    }, function (response) {
        var data = ResponseToNotify(response);
        if (response["status"] != "data") {
            return;
        }
        var shows = data["artists"];
        var cities = data["cities"];
        var managers = data["managers"];

        //Создание фрейма выбора менеджера и шоу
        var frame = $('<form>').addClass("form-horizontal");

        var countersContainer = $('<div>').css("padding-bottom", 5).appendTo(frame);
        var allCompaniesCounterContainer = $('<div>').addClass("col-md-6").appendTo(countersContainer);
        $('<span>').addClass("small text-primary control-label").text("Всего компаний:").appendTo(allCompaniesCounterContainer);
        $('<span>').addClass("small text-primary control-label").attr("id", "distributeCityAllCompaniesCounter").appendTo(allCompaniesCounterContainer);
        var freeCompaniesCounterContainer = $('<div>').addClass("col-md-6").appendTo(countersContainer);
        $('<span>').addClass("small text-primary control-label").text("Свободных компаний:").appendTo(freeCompaniesCounterContainer);
        $('<span>').addClass("small text-primary control-label").attr("id", "distributeCityFreeCompaniesCounter").appendTo(freeCompaniesCounterContainer);

        var innerDiv = $('<div>').addClass("form-group").css("margin-top", "35px").appendTo(frame);
        var header = $('<span>').addClass("medium-info-header").text("Распределяемые данные").appendTo(innerDiv);
        var outerDiv = $('<div>').css("margin-bottom", "7px").appendTo(frame);
        var citySelector = $('<select>').attr("id", "currentCitySelector").attr("required", "required").css("width", "100%").appendTo(outerDiv);
        for (var city in cities) {
            $('<option>').val(cities[city]["id"]).text(cities[city]["name"]).appendTo(citySelector);
        }

        var outerDiv = $('<div>').css("margin-bottom", "7px").appendTo(frame);
        var managerSelector = $('<select>').attr("id", "currentManagerSelector").attr("required", "required").css("width", "100%").appendTo(outerDiv);
        for (var manager in managers) {
            $('<option>').val(managers[manager]["id"]).text(managers[manager]["alias"]).appendTo(managerSelector);
        }

        var outerDiv = $('<div>').css("margin-bottom", "7px").appendTo(frame);
        var showsSelector = $('<select>').attr("id", "currentShowsSelector").attr("required", "required").css("width", "100%").appendTo(outerDiv);


        var innerDiv = $('<div>').addClass("form-group").css("margin-top", "35px").appendTo(frame);
        var header = $('<span>').addClass("medium-info-header").text("Число компаний").appendTo(innerDiv);
        var outerDiv = $('<div>').css("margin-bottom", "7px").appendTo(frame);
        var counterSelector = $('<select>').attr("id", "counterSelector").attr("required", "required").css("width", "100%").appendTo(outerDiv);
        for (var i = 1; i < 6; i++) {
            $('<option>').val(i * 10).text(i * 10).appendTo(counterSelector);
        }
        var allCompaniesContainer = $('<div>').appendTo(frame);
        var labelContainer = $('<div>').addClass("col-md-10").css("text-align", "right").appendTo(allCompaniesContainer);
        var toggleContainer = $('<div>').addClass("col-md-2").css("text-align", "right").appendTo(allCompaniesContainer);
        var allCitiesToggle = $('<input>').attr("id", "allCitiesToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
        $('<label>').attr("for", "allCitiesToggle").addClass("text-primary control-label").text("Все свободные в городе").css("user-select", "none").appendTo(labelContainer);

        var currentModalWindow = showModalWindow_new("okcancel", "Распределение города", frame, function () {
            if (!TotalInputsValidator(currentModalWindow)) {
                return;
            }
            if (+$('#distributeCityFreeCompaniesCounter').text() == 0) {
                ShowNotify(3, "Нет свободных компаний для указанных данных, выберите другие шоу и города")
                return;
            }
            $.post("/aj_distribute_city/", {
                city: $('#currentCitySelector').val(),
                shows: JSON.stringify($('#currentShowsSelector').select2("val")),
                siteusers: JSON.stringify($('#currentManagerSelector').select2("val")),
                all_city: $('#allCitiesToggle').prop("checked"),
                companies_count: $('#counterSelector').val()
            }, function (response) {
                var responseStatus = ResponseToNotify(response);
                if (responseStatus == "success" || responseStatus == "info") {
                    UpdateData(true);
                } else {
                    return;
                }
                hideModalWindow(currentModalWindow);
            });
        });
        $(managerSelector).select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите менеджера",
            language: "ru",
            allowClear: true,
            multiple: true
        });
        $(citySelector).select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите город",
            language: "ru",
            allowClear: true

        });
        $(citySelector).change(function () {
           if($('#currentCitySelector').val() != null){
               //Подгрузка доступных шоу
               ContainerLoadIndicatorShow(showsSelector.next());
               $.post("/aj_api_admin/", {
                   city: 1,
                   id: $('#currentCitySelector').val()
                }, function (response) {
                   data = ResponseToNotify(response);
                   if(response["status"] != "data"){
                       return;
                   }
                   $('#currentShowsSelector').empty();
                   for(var i = 0; i < data["allowed_shows"].length; i++){
                       $('#currentShowsSelector').append($('<option>').val(data["allowed_shows"][i]["id"]).text(data["allowed_shows"][i]["name"]));

                   }
                   $('#currentShowsSelector').val(data["allowed_shows"][0]["id"]).trigger("change");
               });
           }
           else {
               $('#currentShowsSelector').empty();
               $('#distributeCityAllCompaniesCounter').text("");
               $('#distributeCityFreeCompaniesCounter').text("");
           }


        });
        $(showsSelector).change(function () {
            if ($('#currentCitySelector').val() != null && $('#currentShowsSelector').val().length != 0) {
                ContainerLoadIndicatorShow(countersContainer);
                $.post("/aj_api_admin/", {
                    companies_counters: 1,
                    city: $('#currentCitySelector').val(),
                    shows: JSON.stringify($('#currentShowsSelector').select2("val"))
                }, function (response) {
                    var data = ResponseToNotify(response);
                    if (response["status"] != "data") {
                        return;
                    }

                    $('#distributeCityAllCompaniesCounter').text(data["all_companies_count"]);
                    $('#distributeCityFreeCompaniesCounter').text(data["free_companies_count"]);
                });
            } else {
                $('#distributeCityAllCompaniesCounter').text("");
                $('#distributeCityFreeCompaniesCounter').text("");
            }
        });
        $(showsSelector).select2({//Преобразует элемент управления к Select2 виду
            placeholder: "Выберите доступные шоу",
            language: "ru",
            allowClear: true,
            multiple: true
        });
        $(counterSelector).select2({
            placeholder: "Выберите число компаний",
            language: "ru"
        });
        $(allCitiesToggle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
        allCitiesToggle.change(function () {
            if ($('#allCitiesToggle').prop("checked")) {
                $(counterSelector).attr("disabled", "disabled");
            } else {
                $(counterSelector).removeAttr("disabled");
            }

        });
        if (_choosenCity != +0) {
            citySelector.val(_choosenCity).trigger("change");
        } else {
            citySelector.val(0).trigger("change");
        }
        if (_choosenShow != +0) {
            showsSelector.val(_choosenShow).trigger("change");
        } else {
            showsSelector.val(0).trigger("change");
        }
        if (_choosenManager != +0) {
            managerSelector.val(_choosenManager).trigger("change");
        } else {
            managerSelector.val(0).trigger("change");
        }
    });
}

function FullListRemoveCompanies() {
    var choosenCompanies = $('#clientsList').find("td :checkbox[id!=\'chooseAll\']:checked");
    if (choosenCompanies.length == 0) {
        ShowNotify(3, "Необходимо выбрать требуемые компании в левой части таблицы");
        return;
    }
    var companiesList = [];
    for (var i = 0; i < choosenCompanies.length; i++) {
        companiesList[i] = $(choosenCompanies[i]).parents("tr").attr("data-company-id");
    }
    var frame = $('<form>').addClass("form-horizontal");
    var exclamation = $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 15).text("ВНИМАНИЕ!").appendTo(frame);

    var exclamation = $('<div>').addClass("datestamp").css("text-align", "center").css("margin-bottom", 55).text("Удаление компаний затронет также все связанные с ними звонки, задачи, логи и мероприятия").appendTo(frame);

    var removeConfirmToggle = $('<div>').appendTo(frame);
    var labelContainer = $('<div>').addClass("col-md-10").css("text-align", "right").appendTo(removeConfirmToggle);
    var toggleContainer = $('<div>').addClass("col-md-2").css("text-align", "right").appendTo(removeConfirmToggle);
    var removeConfirmToggle = $('<input>').attr("id", "removeConfirmToggle").attr("type", "checkbox").attr("data-toggle", "toggle").appendTo(toggleContainer);
    $('<label>').attr("for", "removeConfirmToggle").addClass("text-primary control-label").text("Подтверждение удаления").css("user-select", "none").appendTo(labelContainer);


    var currentModalWindow = showModalWindow_new("okcancel", "Подтверждение удаления", frame, function () {
        $.post("/aj_company_remove/", {
            companies: JSON.stringify(companiesList),
            remove_confirm: $(removeConfirmToggle).prop("checked")
        }, function (response) {
            var responseStatus = ResponseToNotify(response);
            if (responseStatus == "success" || responseStatus == "info") {
                UpdateData();
            } else {
                return;
            }
            hideModalWindow(currentModalWindow);
        });
    });
    $(removeConfirmToggle).bootstrapToggle({
            on: "Да",
            off: "Нет",
            size: "small",
            offstyle: "danger",
            onstyle: "success"
        });
}

function ShowWorkBlock(_this) {
    //Hide inner
    $(_this).children().css("display", "none");
    $(_this).css("opacity", 1);
    //Create fixed container
    var workSpan = $('<div>').appendTo(_this);
    $(workSpan).attr("id", "workblock").css("text-align", "center").css("position", "relative").css("width", "100%");
    var nowIcon = $('<span>').addClass("glyphicon glyphicon-info-sign text-primary icon-clients-list").appendTo(workSpan).attr("title", "Просмотреть текущее").css("padding-left", "3px").css("padding-right", "3px");
    var addIcon = $('<span>').addClass("glyphicon glyphicon-plus text-primary icon-clients-list").appendTo(workSpan).attr("title", "Добавить").css("padding-left", "3px").css("padding-right", "3px");
    var historyIcon = $('<span>').addClass("glyphicon glyphicon-list text-primary icon-clients-list").appendTo(workSpan).attr("title", "История").css("padding-left", "3px").css("padding-right", "3px");


    switch ($(_this).attr("data-elem_type")) {
        case "c":
            if (!$(_this).attr("data-elem_id") || $(_this).attr("data-alien")) {
                if (!$(_this).attr("data-alien")) {

                    nowIcon.attr("title", "Нет последнего звонка");
                    historyIcon.attr("title", "История звонков пуста");
                    nowIcon.addClass("icon-clients-list-unactive");
                    historyIcon.addClass("icon-clients-list-unactive");
                    nowIcon.click(function () {
                        ShowNotify(3, "В это учреждение еще никто не звонил...", 0, 2000);
                    });
                    historyIcon.click(function () {
                        ShowNotify(3, "История звонков этого учреждения пуста", 0, 2000);
                    });
                }
            } else {
                historyIcon.click(function () {
                    ShowCallsHistory($(_this).parent().attr("data-company-id"), $('#showPickerTittle').attr("data-id"), $(_this).parent().children(('[data-company_name = \"true\"]')).text())
                });
                nowIcon.click(function () {
                    ShowCall($(_this).attr("data-elem_id"), $(_this).parent().children(('[data-company_name = \"true\"]')).text(), UpdateData)
                });

            }
            addIcon.click(function () {
                AddCall($(_this).parent().attr("data-company-id"), $(_this).parent().children(('[data-company_name = \"true\"]')).text())
            });
            break;
        case "t":
            if (!$(_this).attr("data-elem_id")) {
                if (!$(_this).attr("data-alien")) {
                    nowIcon.attr("title", "Нет последней задачи");
                    historyIcon.attr("title", "История задач пуста");
                    nowIcon.addClass("icon-clients-list-unactive");
                    historyIcon.addClass("icon-clients-list-unactive");

                    nowIcon.click(function () {
                        ShowNotify(3, "К этому учреждению еще не добавлено задач...", 0, 2000);
                    });
                    historyIcon.click(function () {
                        ShowNotify(3, "История задач этого учреждения пуста", 0, 2000);
                    });
                }
            }
            else {
                historyIcon.click(function () {
                    ShowTasksHistory($(_this).parent().attr("data-company-id"), GetCurrentChoosenShow(), $(_this).parent().children(('[data-company_name = \"true\"]')).text())
                });
                nowIcon.click(function () {
                    ShowTask($(_this).attr("data-elem_id"), $(_this).parent().children(('[data-company_name = \"true\"]')).text());
                });

            }
            addIcon.click(function () {
                AddNewTask($(_this).parent().attr("data-company-id"), $(_this).parent().children(('[data-company_name = \"true\"]')).text(), UpdateData)
            });
            break;
        case "e":
            if (!$(_this).attr("data-elem_id")) {
                nowIcon.attr("title", "Нет последнего мероприятия");
                historyIcon.attr("title", "История мероприятий пуста");
                nowIcon.addClass("icon-clients-list-unactive");
                historyIcon.addClass("icon-clients-list-unactive");

                nowIcon.click(function () {
                    ShowNotify(3, "В этом учреждении еще не назначено мероприятий...", 0, 2000);
                });
                historyIcon.click(function () {
                    ShowNotify(3, "История мероприятий этого учреждения пуста", 0, 2000);
                });
            }
            else {
                historyIcon.click(function () {
                    ShowEventsHistory($(_this).parent().attr("data-company-id"), GetCurrentChoosenShow(), $(_this).parent().children(('[data-company_name = \"true\"]')).text())
                });
                nowIcon.click(function () {
                    ShowEvent($(_this).attr("data-elem_id"));
                });
            }
            addIcon.click(function () {
                AddEvent($(_this).parent().attr("data-company-id"));
            });
            break;
    }
}

function HideWorkBlock(_this) {
    $(_this).children('#workblock').remove();
    $(_this).children().css("display", "");
    if ($(_this).attr("data-own") == "false") {
        $(_this).css("opacity", 0.5);
    }
}

function ChangeCompanyField(_thisElem, _event) {
    _event.stopPropagation();
    $.post("/aj_get_one_field/", {
        id: $(_thisElem).parent().parent().attr("data-company-id"),
        "table": "Company",
        "field": $(_thisElem).attr("data-field_name")
    }, function (response) {
        data = ResponseToNotify(response);
        if (response["status"] != "data")
            return;
        ShowSmallChangeWindow(data["value"], $(_thisElem).attr("data-field_verbose"), _thisElem, function () {
            ChangeOneField($(_thisElem).parent().parent().attr("data-company-id"), "Company", $(_thisElem).attr("data-field_name"), $("#changeWindowTextarea").val());
        }, false, false, false, FillGettedValue.bind("null", _thisElem));
    });

}

function FillGettedValue(_thisElem) {
    if ($("#changeWindowTextarea").val() == "") {
        $(_thisElem).addClass("icon-clients-list-unactive");
    }
    else {
        $(_thisElem).removeClass("icon-clients-list-unactive");
    }
}

function FillFilterHeadPanel_companiesCount(_companiesCount) {
    var liElem = $('<li>').appendTo($('#addedNavbarElements'));
    var aElem = $('<a>').appendTo(liElem);
    var label = $('<label>').addClass("small text-primary control-label").css("font-weight", "bold").text("Компании:").appendTo(aElem);
    var selectElem = $('<select>').attr("id", "selectCompaniesCount").appendTo(aElem);
    var companiesCountArray = [
        {
            id: "20",
            text: "20"
        },
        {
            id: "30",
            text: '30'
        },
        {
            id: "50",
            text: '50'
        },
        {
            id: "100",
            text: '100'
        },
        {
            id: "150",
            text: '150'
        }
    ];
    $(selectElem).select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Число компаний",
        language: "ru",
        data: companiesCountArray
    });
    $(selectElem).val(_companiesCount).trigger('change');
    return;
}

function FillFilterHeadPanelCompaniesList_orderBy(_orderBy) {
    var liElem = $('<li>').appendTo($('#addedNavbarElements'));
    var aElem = $('<a>').appendTo(liElem);
    var label = $('<label>').addClass("small text-primary control-label").css("font-weight", "bold").text("Сортировка:").appendTo(aElem);
    var selectElem = $('<select>').attr("id", "selectSortBy").appendTo(aElem);
    var orderByArray = [
        {
            id: "id",
            text: "Код"
        },
        {
            id: "city__name",
            text: "Город"
        },
        {
            id: "ctype",
            text: 'Тип'
        },
        {
            id: "name",
            text: 'Название'
        },
        {
            id: "adress",
            text: 'Адрес'
        },
        {
            id: "call",
            text: 'Звонки'
        }
    ];
    $(selectElem).select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Число компаний",
        language: "ru",
        data: orderByArray
    });
    $(selectElem).val(_orderBy).trigger('change');
    return;
}

function FillFilterHeadPanelFullList_orderBy(_orderBy) {
    var liElem = $('<li>').appendTo($('#addedNavbarElements'));
    var aElem = $('<a>').appendTo(liElem);
    var label = $('<label>').addClass("small text-primary control-label").css("font-weight", "bold").text("Сортировка:").appendTo(aElem);
    var selectElem = $('<select>').attr("id", "selectSortBy").appendTo(aElem);
    var orderByArray = [
        {
            id: "id",
            text: "Код"
        },
        {
            id: "city__name",
            text: "Город"
        }

    ];
    $(selectElem).select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Число компаний",
        language: "ru",
        data: orderByArray
    });
    $(selectElem).val(_orderBy).trigger('change');
    return;
}

function FillFilterHeadPanelFullList_managers(_managers) {
    var managers = JSON.parse(_managers);
    var liElem = $('<li>').appendTo($('#addedNavbarElements'));
    var aElem = $('<a>').appendTo(liElem);
    var label = $('<label>').addClass("small text-primary control-label").css("font-weight", "bold").text("Менеджер:").appendTo(aElem);
    var selectElem = $('<select>').attr("id", "selectManagers").appendTo(aElem);
    $('<option>').text("Все").val(0).appendTo(selectElem);
    for (var i = 0; i < managers.length; i++) {
        $('<option>').text(managers[i]["alias"]).val(managers[i]["id"]).appendTo(selectElem);
    }
    $(selectElem).select2({//Преобразует элемент управления к Select2 виду
        dropdownAutoWidth: true,
        placeholder: "Число компаний",
        language: "ru",
    });
    return;
}

function FillFilterHeadPanel_companyType() {
    var liElem = $('<li>').appendTo($('#addedNavbarElements'));
    var aElem = $('<a>').appendTo(liElem);
    var label = $('<label>').addClass("small text-primary control-label").css("font-weight", "bold").text("Тип:").appendTo(aElem);
    var selectElem = $('<select>').attr("id", "selectFilterType").appendTo(aElem);
    var companyTypeArray = [
        {
            id: "any",
            text: "Любой"
        },
        {
            id: "ДС",
            text: 'ДС'
        },
        {
            id: "ШК",
            text: 'ШК'
        },
        {
            id: "ДК",
            text: 'ДК'
        },
        {
            id: "ДО",
            text: 'ДО'
        }
    ];

    $(selectElem).select2({//Преобразует элемент управления к Select2 виду
        placeholder: "Тип учреждения",
        language: "ru",
        data: companyTypeArray
    });

    $(selectElem).val("any").trigger('change');
    //Костыль - не помещалась кнопка обновления данных
    var select2elem = $(selectElem).next();
    select2elem.css("max-width", "75px");
    return;
}

function FillFilterHeadPanel(_companiesCount, _orderBy) {
    FillFilterHeadPanel_companiesCount(_companiesCount);
    FillFilterHeadPanelCompaniesList_orderBy(_orderBy);
    FillFilterHeadPanel_companyType();
    return;
}

function FillFilterHeadPanelFullList(_companiesCount, _orderBy, _isAdmin, _managers) {
    if (_isAdmin != "False") {
        FillFilterHeadPanelFullList_managers(_managers);
    }
    FillFilterHeadPanel_companiesCount(_companiesCount);
    FillFilterHeadPanelFullList_orderBy(_orderBy);
    FillFilterHeadPanel_companyType();
    return;
}

function FillCitiesShowsHeadPanelFullList(_cities, _shows) {
    $('#cityPickerContainer').empty();
    $('#cityPickerTittle').attr("data-id", 0);

    $('#showPickerContainer').empty();
    $('#showPickerTittle').attr("data-id", 0);
    var cities = JSON.parse(_cities);
    var shows = JSON.parse(_shows);
    var liElement = $('<li>').appendTo($('#cityPickerContainer'));
    var aElement = $('<a>').attr("href", "#").attr("data-id", 0).text("Все города").appendTo(liElement);//Меняем заголовок списка шоу
    liElement.on("click", {id: "0", name: "Все города"}, ChooseCityFullList);
    liElement = $('<li>').addClass("divider").appendTo($('#cityPickerContainer'));

    for (var i = 0; i < cities.length; i++) {
        var liElement = $('<li>').appendTo($('#cityPickerContainer'));
        var aElement = $('<a>').attr("href", "#").attr("data-id", cities[i]["id"]).text(cities[i]["name"]).appendTo(liElement);//Меняем заголовок списка шоу
        liElement.on("click", {id: cities[i]["id"], name: cities[i]["name"]}, ChooseCityFullList);
    }

    var liElement = $('<li>').appendTo($('#showPickerContainer'));
    var aElement = $('<a>').attr("href", "#").attr("data-id", 0).text("Все шоу").appendTo(liElement);//Меняем заголовок списка шоу
    liElement.on("click", {id: "0", name: "Все города"}, ChooseShowFullList);
    liElement = $('<li>').addClass("divider").appendTo($('#showPickerContainer'));
    if(shows.length == 1){
        $('#showPickerTittle').attr("data-id", shows[0]["id"]);
        $('#showPickerTittle span').text(shows[0]["name"]);

    }else{
        $('#showPickerTittle').attr("data-id", 0)
        $('#showPickerTittle span').text("Все шоу");
    }
    for (var i = 0; i < shows.length; i++) {
        var liElement = $('<li>').appendTo($('#showPickerContainer'));
        var aElement = $('<a>').attr("href", "#").attr("data-id", shows[i]["id"]).text(shows[i]["name"]).appendTo(liElement);//Меняем заголовок списка шоу
        liElement.on("click", {id: shows[i]["id"], name: shows[i]["name"]}, ChooseShowFullList);
    }

    return;
}

function ChooseCityFullList(event) {
    $('#cityPickerTittle span').text(event.data.name);//Заменить заголовок
    $('#cityPickerTittle').attr("data-id", event.data.id);
    $.post("/aj_main_load_allowed_shows_to_header/", {id: event.data.id, full_list: 1}, function (response) {//Загружаем список доступных шоу для города

            var allowedArtists = ResponseToNotify(response)["list"];//Получаем список доступных шоу для города в формате JSON
            var choosenShowId;//Выбранное шоу
            var showsList = {};//Список шоу
            $('#showPickerContainer').empty();//Убираем элементы из списка шоу

            if (allowedArtists.length > 1) {//Если больше 1 шоу в списке - добавляем вначале "Все Шоу" и разделитель
                $('#showPickerTittle span').text("Все шоу");//Заголовком делаем "Все шоу"
                var liElement = $('<li>');
                var aElement = $('<a>').attr("href", "#").attr("data-id", 0).html("Все шоу");
                liElement.append(aElement);
                liElement.on("click", {id: 0, name: "Все шоу"}, ChooseShow);
                $('#showPickerContainer').append(liElement);
                var liElement = $('<li>').addClass("divider");
                $('#showPickerContainer').append(liElement);
                var choosenShowId = 0;//Выбранным шоу делаем "Все шоу"

                showsList[0] = "Все шоу";

            }
            else {//В ином случае:
                $('#showPickerTittle span').text(allowedArtists[0].name);//Заголовком делаем первое шоу
                var choosenShowId = allowedArtists[0].id;//Выбранным шоу делаем первое в этом списке
            }
            $('#showPickerTittle').attr("data-id", choosenShowId);
            for (i = 0; i < allowedArtists.length; i++)//Заполняем список шоу, полученными из запроса
            {
                var liElement = $('<li>');
                var aElement = $('<a>').attr("href", "#").attr("data-id", allowedArtists[i].id).text(allowedArtists[i].name);
                liElement.append(aElement);
                liElement.on("click", {id: allowedArtists[i].id, name: allowedArtists[i].name}, ChooseShow);
                $('#showPickerContainer').append(liElement);

                showsList[allowedArtists[i].id] = allowedArtists[i].name;
            }
            if (UpdateData) {
                UpdateData();
            }
        });
    return;
}

function ChooseShowFullList(event) {
    $('#showPickerTittle span').text(event.data.name);//Заменить заголовок
    $('#showPickerTittle').attr("data-id", event.data.id);
    if (UpdateData) {
        UpdateData();
    }
    return;
}

function FullListMarkAsNoCities() {
    $('#cityPickerContainer').remove();
    $('#cityPickerTittle b').remove();
    $('#cityPickerTittle').click(function () {
        ShowNotify(3, "Для добавления новых учреждений, обратитесь к администратору", 1);
    });
    $('#cityPickerTittle span').text("Нет доступных городов");
    $('#showPickerContainer').remove();
    $('#showPickerTittle').remove();
    $('#search_panel').remove();
    ShowNotify(3, "Для добавления новых учреждений, обратитесь к администратору", 1);
    return;
}

function UpdateFullListCounters(_all, _free, _busy) {
    $('#fullListTotalCompaniesCount').text(_all);
    $('#fullListBusyCompaniesCount').text(_busy);
    $('#fullListFreeCompaniesCount').text(_free);
    return;
}

function FilterHeadPanelAddHandlers() {
    $('#selectCompaniesCount').change(function () {
        UpdateData();
    });
    $('#selectSortBy').change(function () {
        UpdateData();
    });
    $('#selectFilterType').change(function () {
        UpdateData();
    });
    $('#selectManagers').change(function () {
        $('#onlyOwn').prop("checked", false);
        $('#onlyFree').prop("checked", false);
        $('#onlyBusy').prop("checked", false);
        UpdateData();
    });
}

function FullListCheckersAddHandlers() {
    $('#onlyOwn').click(function () {
        $('#onlyFree').prop("checked", false);
        UpdateData();
    });
    $('#onlyFree').click(function () {
        $('#onlyOwn').prop("checked", false);
        $('#onlyBusy').prop("checked", false);
        if ($('#onlyFree').prop("checked")) {
            $('#selectManagers').val(0).trigger('change.select2');
        }
        UpdateData();
    });
    $('#onlyBusy').click(function () {
        $('#onlyFree').prop("checked", false);
        if ($('#onlyBusy').prop("checked")) {
            $('#selectManagers').val(0).trigger('change.select2');
        }
        UpdateData();
    });
    return;
}

function GoToCompanyPage(_id) {
    var adress = "/client/";
    adress = adress + _id + "/";
    var currentShow = GetCurrentChoosenShow();
    if (currentShow != 0)
        adress += "?artist=" + currentShow;
    window.open(adress);
    return;
}

function GoToYaAdress(_city, _adress) {
    window.open("https://yandex.ru/maps/?text=" + _city + "%20" + _adress);
    return;
}

//CLIENT PAGE
function ChangeTab(_tab, _companyId, _needCalUpdate) {
    //Подгружаем содержимое вкладки:
    ContainerLoadIndicatorShow($('#company_page_manager_work'));
    $.post("/aj_company_manager_work/", {company: _companyId, artist: _tab}, function (response) {
        $('#company-dinamic-content').html(response);
        ContainerLoadIndicatorHide();
    });
    $('#company-dinamic-content').attr("data-currentArtist", _tab);
    //Дизайн
    //Делаем цвет всех рамок вкладок цветом фона, чтобы они стали неактивны
    $('#tabsNav li a').css("border-left", "1px solid #fff");
    $('#tabsNav li a').css("border-right", "1px solid #fff");
    $('#tabsNav li a').css("border-top", "1px solid #fff");

    //Делаем цвет всех надписей вкладок соответствующим их цвету в базе
    $('.nav li a').each(function (i, elem) {
        $(this).css("color", $(this).parent('li').attr("data-color"));
    });
    //Делаем цвет рамок вкладки соответствующим ее цвету в базе, кроме нижней границы
    $('li[data-tab-id=' + _tab + '] a').css('border-left', '1px solid ' + $('li[data-tab-id=' + _tab + ']').attr("data-color"));
    $('li[data-tab-id=' + _tab + '] a').css('border-right', '1px solid ' + $('li[data-tab-id=' + _tab + ']').attr("data-color"));
    $('li[data-tab-id=' + _tab + '] a').css('border-top', '1px solid ' + $('li[data-tab-id=' + _tab + ']').attr("data-color"));

    //Делаем цвет всех рамок контейнера соответствующим цвету в базе, кроме верхней границы
    $('#company-dinamic-content').css('border-left', '1px solid ' + $('li[data-tab-id=' + _tab + ']').attr("data-color"));
    $('#company-dinamic-content').css('border-right', '1px solid ' + $('li[data-tab-id=' + _tab + ']').attr("data-color"));
    $('#company-dinamic-content').css('border-bottom', '1px solid ' + $('li[data-tab-id=' + _tab + ']').attr("data-color"));

    //Делаем верхнюю границу контейнера данных работы соответствующим цвету в базе
    $('#tabsNav').css("border-bottom", "1px solid" + $('li[data-tab-id=' + _tab + ']').attr("data-color"));

    $('#company_page_manager_work').attr("data-show-id", _tab);
    //Небольшой костыль - проверка наличия календаря, для того чтобы не обновлять при первом запуске
    if (_needCalUpdate) {
        try {
            if (sccal) {
                LoadPresentatorsHeadPanel(true);
            }
        } catch (err) {
        }
    }
    return;
}//Переключение вкладки
function TabUpdate(_showId, _needCalUpdate) {
    if(_showId != "None"){
        $('#tabsNav [data-tab-id=' + _showId +']').trigger("click");
    }else{
        $('#tabsNav li:first').trigger("click");
    }
    return;
}
function UpdateCompanyData(_id) {
    ContainerLoadIndicatorShow($('#company_page_text'));
    $.post('/aj_updated_company_data/', {id: _id}, function (response) {
        var data = ResponseToNotify(response);
        if(response["status"] != "data"){
            return;
        }
        if("managers" in data){
            FillManagersCompanyPage(data["managers"]);
        }
        if(parseInt(data["logs_count"]) != 0){
            $('#logsCountLabel').removeClass("hidden-count");
            $('#logsCountLabel').text(data["logs_count"]);
        }else{
            $('#logsCountLabel').addClass("hidden-count");
        }
        $('#page_ctype').text(data["data"]["ctype"]);
        $('#page_name').html("");
        $('#page_name').append($('<span>').css("margin-right", 20).text(data["data"]["id"]));
        $('#page_name').append($('<span>').text(data["data"]["name"]));

        $('#page_adress').text(data["data"]["adress"]);
        if(data["data"]["telephone"] != ""){
            $('#page_telephone').text(data["data"]["telephone"]);
        }else{
            $('#page_telephone').text("Телефоны не указаны");
        }
        if(data["data"]["contacts"] != ""){
            $('#page_contacts').text(data["data"]["contacts"]);
        }else{
            $('#page_contacts').text("Контактные данные отсутствуют");
        }
        if(data["data"]["email"] != "" || data["data"]["site"] != ""){
            if($('#netContactsDivider').length == 0){
                var divider = $('<hr>').attr("id", "netContactsDivider").addClass("company-primary-divider").insertAfter($('#contactsContainer'));
            }
            if(data["data"]["email"] != ""){
                if($('#emailContainer').length != 0){
                    $('#page_email').text(data["data"]["email"]).attr("href", "mailto:" + data["data"]["email"]);
                }else{
                    var container = $('<div>').addClass("row").attr("id", "emailContainer").insertAfter($('#netContactsDivider'));
                    var row = $('<div>').addClass("col-md-12 text-left").appendTo(container);
                    var icon = $('<span>').attr("title", "Электронная почта").addClass("glyphicon glyphicon-envelope text-primary company-icon").appendTo(row);
                    icon.click(function () {
                        ShowSmallChangeWindow((GetValueElement(this)).children().html(), this.title, (GetValueElement(this)), function(){ChangeOneField(_id, "Company", "email", $("#changeWindowTextarea").val())});
                    });
                    var textContainer = $('<span>').addClass("text-primary").appendTo(row);
                    var text = $('<a>').attr("id", "page_email").addClass("interactive_element").text(data["data"]["email"]).attr("href", "mailto:" + data["data"]["email"]).appendTo(textContainer);
                }
            }else{
                $('#emailContainer').remove();
            }
            if(data["data"]["site"] != ""){
                if($('#siteContainer').length != 0){
                    var siteHref = data["data"]["site"].replace("http://", "");
                    $('#page_site').text(data["data"]["site"]).attr("href", "http://" + siteHref);
                }else{
                    var container = $('<div>').addClass("row").attr("id", "siteContainer").insertAfter($('#netContactsDivider'));
                    var row = $('<div>').addClass("col-md-12 text-left").appendTo(container);
                    var icon = $('<span>').attr("title", "Сайт").addClass("glyphicon glyphicon-globe text-primary company-icon").appendTo(row);
                    icon.click(function () {
                        ShowSmallChangeWindow((GetValueElement(this)).children().html(), this.title, (GetValueElement(this)), function(){ChangeOneField(_id, "Company", "site", $("#changeWindowTextarea").val())});
                    });
                    var textContainer = $('<span>').addClass("text-primary").appendTo(row);
                    var text = $('<a>').attr("id", "page_site").addClass("interactive_element").attr("target", "_blank").text(data["data"]["site"]).attr("href", "http://" + data["data"]["site"]).appendTo(textContainer);
                }
            }else{
                $('#siteContainer').remove();
            }
        }else{
            $('#netContactsDivider').remove();
            $('#emailContainer').remove();
            $('#siteContainer').remove();
        }

        if(data["data"]["comment"] != ""){
                if($('#commentDivider').length != 0){
                    $('#page_comment').text(data["data"]["comment"]);
                }else{
                    var divider = $('<hr>').attr("id", "commentDivider").addClass("company-primary-divider").insertAfter($('#contactsContainer'));
                    var container = $('<div>').addClass("row").attr("id", "commentContainer").insertAfter($('#commentDivider'));
                    var row = $('<div>').addClass("col-md-12 text-left").appendTo(container);
                    var icon = $('<span>').attr("title", "Комментарий").addClass("glyphicon glyphicon-comment text-primary company-icon").appendTo(row);
                    icon.click(function () {
                        ShowSmallChangeWindow((GetValueElement(this)).children().html(), this.title, (GetValueElement(this)), function(){ChangeOneField(_id, "Company", "comment", $("#changeWindowTextarea").val())});
                    });
                    var textContainer = $('<span>').attr("id", "page_comment").text(data["data"]["comment"]).appendTo(row);
                }
            }else{
                $('#commentDivider').remove();
                $('#commentContainer').remove();
            }
    });
    return;
}
function FillManagersCompanyPage(_managers) {
    var container = $('#managersList');
    container.empty();
    for(var i = 0; i < _managers.length; i++){
        var row = $('<div>').addClass("col-md-12 text-left").appendTo(container);
        var elem = $('<button>').addClass("btn btn-default").css("white-space", "normal").css("margin-bottom", "5px").appendTo(row);
        (function (x) {
            elem.click(function () {
                ShowUser(_managers[x]["siteuser__id"]);
            })
        })(i);
        var icon = $('<span>').css("margin-right", "5px").addClass("glyphicon glyphicon-headphones text-primary").appendTo(elem);
        var text = $('<span>').text(_managers[i]["siteuser__alias"]).appendTo(elem);
    }
}

//Получает элемент который находится сразу за иконкой бутстрапа
function GetValueElement(_elem) {
    var got_elem = $(_elem).parent().children("span:nth-child(2)");
    return got_elem;
}