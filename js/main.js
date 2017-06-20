$sideForm = $(".side__form");
$mainForm = $(".main__form");

getCountries();
getPagination();
getUsers("1");

$($sideForm).click(function (e) {
    e.preventDefault();

    var $element = $(e.target);

    if ($element[0].className === "side__pagination") {
        var $pag = $(".side__pagination");
        $pag.parent().removeClass("active");
        $element.parent().addClass("active");

        clearUsers();
        getUsers($element[0].text);
    }

    else if ($element.parents().hasClass("list-group-item")) {
        for (var i = 0; i < $element.parents().length; i++) {
            if ($element.parents()[i].className === "list-group-item") {
                getUser($element.parents()[i].id);
            }
        }
    }

    else if ($element[0].id === "remove") {
        var $remove = $("#id");
        deleteUser($remove[0].value);

        clearUsers();
        getUsers("1");
        clearPagination();
        getPagination();
        fillForm({});
    }
});

$($mainForm).submit(function (e) {
    e.preventDefault();

    var id = $("#id");

    if (id.val() === "") {
        postUser();
    }

    else {
        putUser(id.val());
    }
});

$($mainForm).click(function (e) {

    var $element = $(e.target);

    if ($element[0].id === "cancel") {
        fillForm({});
    }
});

function getCountries() {
    $.getJSON("/api/countries", function (data) {
        for (var i = 0; i < data.length; i++) {
            var option = $("<option></option>")
                .text(data[i]);
            $("#country").append(option);
        }
    });
}

function getPagination() {
    $.getJSON("/api/users/1/10/preview", function (object) {
        var $span = $("<span></span>")
            .attr("aria-hidden", "true")
            .text("<");
        createPagination($span.text(), "#", "Previous");

        for (var i = 1; i <= object.totalPages; i++) {
            createPagination(i, "/api/users/" + i + "/10", i);
        }

        var $span = $("<span></span>")
            .attr("aria-hidden", "true")
            .text(">");
        createPagination($span.text(), "#", "Previous");
    });
}

function getUsers(page) {
    $.getJSON("/api/users/" + page + "/10/preview", function (object) {
        for (var i = 1; i <= object.limit; i++) {
            createUser(object.data[i - 1].id, object.data[i - 1].country, object.data[i - 1].fullName, object.data[i - 1].photo, "#");
        }
    });
}

function getUser(id) {
    $.getJSON("/api/users/" + id, function (object) {
        fillForm(object);
    });
}

function postUser() {
    var $user = {
        id: $("#id").val(),
        fullName: $("#fullname").val(),
        birthday: $("#birthday").val(),
        profession: $("#profession").val(),
        email: $("#email").val(),
        address: $("#address").val(),
        country: $("#country").val(),
        shortInfo: $("#short-info").val(),
        fullInfo: $("#full-info").val()
    };

    var $options = {
        url: "/api/users",
        type: "post",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify($user)
    };

    $.ajax($options).done(function () {
        clearUsers();
        clearPagination();
        getPagination();
        getUsers("1");
        fillForm({});
    });
}

function putUser(id) {
    var $user = {
        id: $("#id").val(),
        fullName: $("#fullname").val(),
        birthday: $("#birthday").val(),
        profession: $("#profession").val(),
        email: $("#email").val(),
        address: $("#address").val(),
        country: $("#country").val(),
        shortInfo: $("#short-info").val(),
        fullInfo: $("#full-info").val()
    };

    var $options = {
        url: "/api/users",
        type: "put",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify($user)
    };

    $.ajax($options).done(function () {
        clearUsers();
        clearPagination();
        getPagination();
        getUsers("1");
        fillForm({});
    });
}

function clearPagination() {
    $(".side__pag")
        .empty();
}

function clearUsers() {
    $(".side__list")
        .empty();
}

function fillForm(info) {
    $("#id").val(info.id);
    $("#fullname").val(info.fullName);
    $("#birthday").val(info.birthday);
    $("#profession").val(info.profession);
    $("#email").val(info.email);
    $("#address").val(info.address);
    $("#country").val(info.country);
    $("#short-info").val(info.shortInfo);
    $("#full-info").val(info.fullInfo);
}

function createPagination(counter, href, label) {
    var $list = $(".side__pag");

    var $li = $("<li></li>")
        .appendTo($list);

    var $a = $("<a></a>")
        .attr("href", href)
        .attr("class", "side__pagination")
        .attr("aria-label", label)
        .text(counter)
        .appendTo($li);

    if ($a[0].text === "1") {
        $a.parent().addClass("active");
    }
}

function createUser(id, country, name, image, href) {
    var $list = $(".side__list");

    var $btn = $("<button></button>")
        .attr("type", "button")
        .attr("class", "list-group-item")
        .attr("id", id)
        .appendTo($list);

    $("<span></span>")
        .attr("class", "badge")
        .text(country)
        .appendTo($btn);
    var $row = $("<div></div>")
        .attr("class", "row")
        .appendTo($btn);

    var $img = $("<div></div>")
        .attr("class", "col-xs-4")
        .appendTo($row);
    $("<div></div>")
        .attr("class", "col-xs-8 side__text--bold")
        .text(name)
        .appendTo($row);

    var $a = $("<a></a>")
        .attr("class", "thumbnail side__img")
        .attr("href", href)
        .appendTo($img);
    $("<img>")
        .attr("src", image)
        .attr("alt", "Avatar")
        .appendTo($a);
}

function deleteUser(id) {
    $.ajax({
        url: "/api/users/" + id,
        type: "delete",
        success: function (result) {
            $("#" + id)
                .remove();
        }
    });
}