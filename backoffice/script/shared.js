window.onload = function() {
    load(history.state === null ? 'home' : history.state.content);
};

function load(page) {
    history.pushState({content: page}, "", "/backoffice");
    $('#platform-content').load('/backoffice/pages/' + page + '.html?q=' + new Date().getTime());
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
                        text : item["name"] + " - " + item["group_name"]
                    }));
                });
            }
    });
}

function toggleNav() {
    $(".icon-menu-item").toggle()
    $(".text-menu-item").toggle()
}