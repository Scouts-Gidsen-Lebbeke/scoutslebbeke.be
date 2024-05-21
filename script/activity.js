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
    fetch(`/api/getActivity.php?id=${id}`).then(data => data.json()).then(activity => {
        $("#activity-name").html(activity.name);
        $("#activity-when").text(periodToTitle(new Date(Date.parse(activity.start)), new Date(Date.parse(activity.end))))
        $("#activity-location").html(locationToTitle(activity.location, true))
        let branches = ""
        activity.restrictions.forEach(branch =>
            branches += `<img src="/images/branch/${branch.image}" alt="${branch.name}" title="${branch.name}" class="branch-icon"/>`
        )
        $("#activity-branches").html(branches)
        $("#activity-info").html(activity.info);
        $("#activity-practical-info").html(activity.practical_info);
        $("#activity-subscription-deadline").text(printDeadline(activity.close_subscription));
    });
}

function printDeadline(dateString) {
    let date = new Date(Date.parse(dateString));
    return date.toLocaleDateString('nl-BE', { weekday: 'long', month: 'numeric', day: 'numeric' })
}

function checkAdmin(user, activityId) {
    if (user.level > 2) {
        $("#activity-admin").show();
        $("#overview-button").on("click", function(){
            window.location = "activityOverview.html?id=" + activityId;
        });
        $("#staff-subscription-button").on("click", function(){
            window.location = "/activity/staffSubscription.html?id=" + activityId;
        });
    }
}