window.onload = function() {
    const password = $("#password-input");
    $("#togglePassword").on("click", function () {
        password.attr("type", password.attr("type") === "password" ? "text" : "password");
        this.classList.toggle("bi-eye");
    });
    const password2 = $("#password-input-repeat");
    $("#togglePassword2").on("click", function () {
        password2.attr("type", password2.attr("type") === "password" ? "text" : "password");
        this.classList.toggle("bi-eye");
    });
    password2.keypress(function(event) {
        if (event.keyCode === 13) {
            register();
        }
    });
}

function register() {
    const form = new FormData(document.querySelector('#register_form'));
    fetch(new Request('/backoffice/api/register.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => {
            if (data["success"]) {
                window.location.href = '/backoffice';
            } else {
                $('#register_error').html(data["message"]);
            }
    });
}