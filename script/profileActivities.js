window.onload = function() {
    loadGlobal();
    requireLogin(function (d) {
        loadProfile(d);
        loadActivityOverview(d.id)
    });
};

function loadActivityOverview(id) {
    fetch("/api/activity/getUserActivities.php?id=" + id).then(data => data.json()).then(activities => {
        activities.forEach(activity =>
            $('#activity-overview tbody').append(`<tr><td>${activity.id}</td><td>${activity.name}</td><td>${activity.date}</td><td>${activity.status}</td></tr>`)
        )
    });
}