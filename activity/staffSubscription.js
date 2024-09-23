window.onload = function() {
    loadGlobal();
    addClickListener()
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    $("#member-id").on("change", () => {
        checkSubscriptionState(activityId, $("#member-id").val())
    })
    requireLogin(d => {
        if (d.level > 2) {
            loadProfile(d)
            const memberId = params.get('memberId')
            if (memberId) {
                $("#member-id").val(memberId).change()
            }
        } else {
            window.location = "/403.html";
        }
    });
    initActivity(activityId);
};

function initActivity(id) {
    fetch(`/api/activity/getActivity.php?id=${id}`).then(data => data.json()).then(activity => {
        $("#activity-name").text(activity.name);
    });
}

function returnToActivity() {
    const params = (new URL(document.location)).searchParams;
    window.location = "/activity.html?id=" + params.get('id');
}