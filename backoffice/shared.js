window.onload = function() {
    load(history.state === null ? 'home' : history.state.content);
};

function load(page) {
    history.pushState({content: page}, "", "/backoffice");
    $('#platform-content').load('/backoffice/pages/' + page + '.html');
}

window.onpopstate = function() {
    $('#platform-content').load('/backoffice/pages/' + history.state.content + '.html');
}

function checkSession() {
    fetch(new Request('/backoffice/api/session.php', {method: 'GET'}))
        .then(response => response.json()).then(data => {
            if (!data["active"]) {
                window.location.href = "/backoffice/front.html";
            } else {
                $("#username").text(data["user"]);
                const picDiv = $("#profile-pic");
                if (data["pic"] !== null) {
                    picDiv.css("background", "url(/backoffice/images/users/" + data["pic"] + ")");
                }
                picDiv.css("background-size", "100% 100%");
            }
        });
}

function logout() {
    fetch(new Request('/backoffice/api/logout.php', {method: 'GET'}))
        .then(response => response.json()).then(data => {
            if (data["logout"]) {
                window.location.href = '/backoffice/front.html';
            }
        });
}

function loadPages() {
    fetch(new Request('/backoffice/api/getPages.php', {method: 'GET'}))
        .then(response => response.json()).then(data => {
            if (data["success"]) {
                $.each(data["list"], function (i, item) {
                    $('#page-list').append($('<option>', {
                        value: item["path"],
                        text : item["name"]
                    }));
                });
            }
    });
}

function postSprokkel() {
    const form = new FormData(document.querySelector('#sprokkelData'));
    fetch(new Request('/backoffice/api/postSprokkel.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => $('#error_sprokkel').html(data["message"]));
}

function postPassword() {
    const form = new FormData(document.querySelector('#passwordData'));
    fetch(new Request('/backoffice/api/postPassword.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => $('#error_password').html(data["message"]));
}

function getData(postData, resultFileName) {
    fetch(new Request('/backoffice/api/getData.php', {method: 'POST', body: postData})).then(res => res.blob())
        .then(blob => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = resultFileName + ".csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
}

function getSixtyYearData() {
    getData('{"table": "60_year_contact", "fields": ["email", "firstname", "lastname"]}', "60jaar");
}

function getQuizData() {

}

function getValentineData() {
    //getData('{"table": "valentine_orders", "fields": ["email", "default", "luxury", "firstname", "lastname"]}', "ontbijten");
}

function getWeekendData() {

}

function getCampData() {

}

function loadStaff() {
    fetch(new Request('/backoffice/api/getStaff.php', {method: 'GET'}))
        .then(response => response.json()).then(data => {
            if (data["success"]) {
                $.each(data["list"], function (i, item) {
                    $('#staff-list').append($('<option>', {
                        value: item["username"],
                        text : item["Voornaam"] + " " + item["Achternaam"]
                    }));
                });
            }
    });
}

function updateStaffInfo() {
    const username = $('#staff-list').val();
    $("#save-staff").prop("disabled", !username);
    $("#delete-staff").prop("disabled", !username);
    if (username) {
        fetch(new Request('/backoffice/api/getStaffDetail.php?q=' + username, {method: 'GET'}))
            .then(response => response.json()).then(data => {
                if (data["success"]) {
                    $('#staff-firstname').val(data["Voornaam"]);
                    $('#staff-lastname').val(data["Achternaam"]);
                    $('#staff-nickname-1').val(data["kapoenenbijnaam"]);
                    $('#staff-nickname-2').val(data["welpenbijnaam"]);
                    $('#staff-totem').val(data["Totem"]);
                    $('#staff-mobile').val(data["Gsm"]);
                    $('#staff-pic').attr("src", "/images/profile/" + data["Foto"]);
                    $('#staff-function').val(data["Functie"]);
                    $('#staff-email').val(data["email"]);
                    $('#branch-head').prop("checked", data["Takleiding"]);
                    $('#staff-head').prop("checked", data["Groepsleiding"]);
                    $('#uniform-master').prop("checked", data["uniform"]);
                }
        });
    } else {
        $('#staff-firstname').val(null);
        $('#staff-lastname').val(null);
        $('#staff-nickname-1').val(null);
        $('#staff-nickname-2').val(null);
        $('#staff-totem').val(null);
        $('#staff-mobile').val(null);
        $('#staff-pic').attr("src", "/images/profile/default.png");
        $('#staff-function').val("Geen");
        $('#staff-email').val(null);
        $('#branch-head').prop("checked", false);
        $('#staff-head').prop("checked", false);
        $('#uniform-master').prop("checked", false);
    }
}

function saveStaff() {

}

function deleteStaff() {

}

function newStaff() {

}