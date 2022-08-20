let backgrounds = [], currentIndex

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
                $("#username").text(capitalize(data["user"]));
                const admin = data["admin"] === "1"
                loadNav(admin)
                const adminImg = $("#admin-img")
                admin ? adminImg.show() : adminImg.hide()
                const picDiv = $("#profile-pic");
                if (data["pic"] !== null) {
                    picDiv.css("background", "url(/backoffice/images/users/" + data["pic"] + ")");
                }
                picDiv.css("background-size", "100% 100%");
            }
        });
}

// yea yea, this is not safe, whatever
function loadNav(admin) {
    let result = ""
    let items = {
        "home": ["Home", false],
        "news": ["Nieuwtjes", false],
        "calendar": ["Kalender", false],
        "uploads": ["Uploads", false],
        "staff": ["Leiding", false],
        "pages": ["Pagina's", true],
        "navigation": ["Navigatie", false],
        "data": ["Data", false],
        "settings": ["Instellingen", false]
    }
    for (const key in items) {
        if (admin || !items[key][1]) {
            result += getNavItem(key, items[key][0])
        }
    }
    $("#menu").html(result + '<div onclick="toggleNav()" class="menubaritem"><img class="text-menu-item" src="/backoffice/images/left-arrow.png" alt="left">' +
        '<img class="icon-menu-item" src="/backoffice/images/right-arrow.png" alt="right"></div>');
}

function getNavItem(id, name) {
    return "<div onclick='load(\"" + id + "\")' class='menubaritem'><div class=\"text-menu-item\">" + name + "</div>" +
        "<img class='icon-menu-item' src='/backoffice/images/" + id + ".png' alt='" + id + "'></div>"
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

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function changeAndTimeout(id, message) {
    $(id).html(message)
    setTimeout(() => $(id).html(""), 2000);
}