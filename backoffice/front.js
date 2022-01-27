window.onload = function() {
    const password = $("#password");
    $("#togglePassword").on("click", function () {
        password.attr("type", password.attr("type") === "password" ? "text" : "password");
        this.classList.toggle("bi-eye");
    });
    document.addEventListener('keydown', ev => {
        if (ev.code === 'KeyE' && ev.ctrlKey && ev.altKey) {
            window.location.href = '/';
        }
    });
    checkSession();
}

function checkSession() {
    fetch(new Request('/backoffice/api/session.php', {method: 'GET'}))
        .then(response => response.json()).then(data => {
            if (data["active"]) {
                window.location.href = "/backoffice";
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