window.onload = function() {
    loadGlobal();
    checkLogin(function (d) {
        loadProfile(d);
        loadProfileData(d);
    });
};

function loadProfileData(d) {
    $("#profile-full-name").text(d.first_name + " " + d.name)
    $("#profile-member-id").text(d.member_id)
    $("#profile-functions").text(d.roles.map(f => f.name).join(', '))
    $("#profile-email").text(d.email)
    $("#profile-image").attr("src", "/images/profile/" + d.image);
}