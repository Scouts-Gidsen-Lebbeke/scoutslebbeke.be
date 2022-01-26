window.onload = function() {
    document.addEventListener('keydown', ev => {
        if (ev.code === 'KeyE' && ev.ctrlKey && ev.altKey) {
            window.location.href = '/';
        }
    });
    load(history.state === null ? 'home' : history.state.content);
};

function load(page) {
    history.pushState({content: page}, "", "/backoffice");
    $('#platform-content').load('/backoffice/pages/' + page + '.html');
}

window.onpopstate = function() {
    $('#platform-content').load('/backoffice/pages/' + history.state.content + '.html');
}

async function checkSession() {
    fetch(new Request('/backoffice/api/session.php', {method: 'GET'}))
        .then(response => response.json()).then(data => {
            if (window.location.pathname === "/backoffice/" && !data["active"]) {
                window.location.href = "/backoffice/front.html";
            } else if (window.location.pathname.endsWith("front.html") && data["active"]) {
                window.location.href = "/backoffice";
            } else if (data["active"]) {
                $("#username").text(data["user"]);
                if (data["pic"] !== null) {
                    const picDiv = $("#profile-pic");
                    picDiv.css("background", "url(/backoffice/images/users/" + data["pic"] + ")");
                    picDiv.css("background-size", "100% 100%");
                }
            }
        });
}

function login() {
    const form = new FormData(document.querySelector('#login_form'));
    fetch(new Request('/backoffice/api/login.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => {
            if (data["error"]) {
                $('#login_error').html(data["message"]);
            } else {
                window.location.href = '/backoffice';
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

}