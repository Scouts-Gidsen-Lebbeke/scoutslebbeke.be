window.onload = function() {
    loadGlobal();
    checkLogin(function (d) {
        loadProfile(d);
        loadProfileData(d);
        loadActivityOverview(d.id)
    });
};

function loadProfileData(d) {
    $("#profile-full-name").text(d.first_name + " " + d.name)
    $("#profile-member-id").text(d.member_id)
    $("#profile-functions").text(d.roles.map(f => f.name).join(', '))
    $("#profile-email").text(d.email)
    $("#profile-image").attr("src", "/images/profile/" + d.image);
    $("#profile-logout").prop('disabled', false);
}

function toggleLogout() {
    kc.logout({ redirectUri: window.location.origin })
}

function loadActivityOverview(id) {
    fetch("/api/getUserActivities.php?id=" + id).then(data => data.json()).then(activities => {
        activities.forEach(activity =>
            $('#activity-overview tr:last').after(`<tr><td>${activity.id}</td><td>${activity.name}</td><td>${activity.date}</td><td>${activity.status}</td></tr>`)
        )
    });
}