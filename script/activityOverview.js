window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    let branches = initBranches();
    let activities = loadActivities();
    requireLogin(async d => {
        if (d.level > 2) {
            loadProfile(d)
            await branches
            await activities
            if (activityId) {
                $("#activities").val(activityId).change()
            }
        } else {
            window.location = "/403.html";
        }
    });
};

async function initBranches() {
    return fetch("/api/branch/getActive.php").then((res) => res.json()).then((branches) => {
        branches.forEach(b => $('#branches').append(`<option value="${b.id}">${b.name}</option>`))
    });
}

async function loadActivities() {
    return fetch("/api/activity/getAllActivities.php").then(d => d.json()).then(d => {
        d.forEach(a => $('#activities').append(`<option value="${a.id}">${a.name}</option>`))
    })
}

function retrieveActivity() {
    let id = $("#activities").val(), branch = $("#branches").val()
    $("#subscription-overview tr:not(:first)").remove();
    if (id === "0") return
    $("#subscription-loader").show()
    tokenized(`/api/activity/getActivityOverview.php?id=${id}&branch=${branch}`).then(subscriptions => {
        let index = 0;
        subscriptions.forEach(s => {
            index++;
            $('#subscription-overview tr:last').after(
                `<tr>
                    <td>${index}</td>
                    <td>${s.first_name}</td>
                    <td>${s.name}</td>
                    <td>${s.branch_name}</td>
                    <td>€ ${s.price}</td>
                    <td><input type="checkbox" onclick="markPresent(this.checked, '${s.id}', '${s.user_id}')" ${s.present === "1" ? "checked" : ""}></td>
                </tr>`
            )
        })
        $("#subscription-loader").hide()
    })
}

function markPresent(present, activityId, userId) {
    tokenized(`/api/activity/markPresent.php?activityId=${activityId}&userId=${userId}&present=${present}`).then(d => {

    })
}