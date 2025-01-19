window.onload = function() {
    loadGlobal();
    requireLogin((d) => {
        loadProfile(d);
        loadProfileData(d);
    });
};

function loadProfileData(d) {
    $("#profile-full-name").text(d.first_name + " " + d.name)
    $("#profile-member-id").text(d.member_id)
    $("#profile-functions").text(d.roles.map(f => f.name).join(', '))
    $("#profile-email").text(d.email)
    $("#profile-image-pic").attr("src", "/images/profile/" + d.image);
    $("#profile-logout").prop('disabled', false);
}

function toggleUpload() {
    $("#profile-image-upload").trigger("click")
}

function postImage() {
    postForm(`/user/uploadProfilePicture.php`, "profile-form").then(data => {
        if (data.succes) {
            $("#profile-image-pic").attr("src", data.location);
        } else {
            alert(data.message);
        }
    });
}