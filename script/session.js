let session

function checkSession() {
    fetch(new Request('/backoffice/api/session.php', {method: 'GET'}))
        .then(response => response.json()).then(data => {
        if (data["active"]) {
            session = data["session"];
            $("#profile-name").text(session["user_first_name"]);
            $("#profile-pic").css("background-image", "url(/backoffice/images/users/" + session["user_profile_pic"] + ")");
        }
    });
}