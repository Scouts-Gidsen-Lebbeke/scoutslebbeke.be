$('#profile-pic-large').css("background-image", "url(/backoffice/images/users/" + session["user_profile_pic"] + ")");
$('#profile-full-name').text(session['user_first_name'] + " " + session['user_name'])
$('#profile-username').text(session['user'])
$('#profile-admin').text(session['user_admin'] === '1' ? 'Ja' : 'Nee')

function postPassword() {
    const form = new FormData(document.querySelector('#passwordData'));
    fetch(new Request('/backoffice/api/postPassword.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => $('#error-password').html(data["message"]));
}