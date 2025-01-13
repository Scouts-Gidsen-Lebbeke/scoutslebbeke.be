window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    checkLogin(function (d) {
        loadProfile(d)
        $("#member-id").val(d.sgl_id)
        checkSubscriptionState(activityId, d.sgl_id)
        checkAdmin(d, activityId)
    });
    initActivity(activityId);
};

function initActivity(id) {
    fetch(`${baseApiUrl}/api/activity/getActivity.php?id=${id}`).then(data => data.json()).then(activity => {
        $("#activity-name").html(activity.name);
        $("#activity-when").text(periodToTitle(new Date(Date.parse(activity.start)), new Date(Date.parse(activity.end))))
        $("#activity-location").html(locationToTitle(activity.location, true))
        $("#activity-branches").html(activity.branches.map(b => `<img src="/images/branch/${b.image}" alt="${b.name}" title="${b.name}" class="branch-icon"/>`).join(""))
        $("#activity-info").html(activity.info);
        if (activity.practical_info) {
            $("#activity-practical-info").html(activity.practical_info);
        } else {
            $("#activity-practical-block").hide()
        }
        $("#activity-subscription-deadline").text(printDeadline(activity.close_subscription));
    });
}

function checkAdmin(user, activityId) {
    if (user.level > 2) {
        $("#activity-admin").show();
        $("#overview-button").on("click", function(){
            window.location = "/activity/activityOverview.html?id=" + activityId;
        });
        $("#staff-subscription-button").on("click", function(){
            window.location = "/activity/staffSubscription.html?id=" + activityId;
        });
    }
    if (user.level > 3) {
        $("#edit-button").removeAttr('hidden');
        $("#edit-button").on("click", function(){
            window.location = "/activity/editActivity.html?id=" + activityId;
        });
    }
}