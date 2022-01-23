window.onload = function() {
    checkSession();
    document.addEventListener('keydown', ev => {
        if (ev.code === 'KeyE' && ev.ctrlKey && ev.altKey) {
            window.location.href = '/';
        }
    });
};

function load(page) {
    history.pushState({content: page}, "", "/backoffice");
    $('#content').load('/backoffice/pages/' + page + '.html');
}

window.onpopstate = function() {
    $('#content').load('/backoffice/pages/' + history.state.content + '.html');
}

function checkSession() {
    fetch(new Request('/backoffice/api/session.php', {method: 'GET'}))
        .then(response => response.json()).then(data => {
            if (window.location.pathname === "/backoffice/" && !data["active"]) {
                window.location.href = "/backoffice/front.html";
            } else if (window.location.pathname.endsWith("front.html") && data["active"]) {
                window.location.href = "/backoffice";
            } else if (data["active"]) {
                load(history.state === null ? 'home' : history.state.content);
                $("#username_span").html(data["user"]);
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

function loadUsers() {

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