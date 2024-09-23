window.onload = function() {
    loadGlobal();
    requireLogin(function (d) {
        guardAdmin(d)
        loadProfile(d);
        loadActivities();
    });
};

function loadActivities() {
    tokenized("/api/activity/getAllActivities.php").then(d => {
        d.activities.forEach(a => {
            $('#activity-overview tbody').append(
                `<tr>
                    <td><a href="/activity/activity.html?id=${a.id}">${a.name}</a></td>
                    <td>${printActivityPeriod(a.start, a.end)}</td>
                    <td>${a.subscriptions}</td>
                    <td>${a.status}</td>
                    <td class="icon-column"><img src="/images/edit.png" class="subscription-icon" alt="edit" title="Bewerk deze activiteit" onclick="editActivity('${a.id}')"></td>
                    <td class="icon-column"><img src="/images/copy.png" class="subscription-icon" alt="duplicate" title="Dupliceer deze activiteit" onclick="duplicateActivity('${a.id}')"></td>
                    <td class="icon-column"><img src="/images/list.png" class="subscription-icon" alt="overview" title="Ga naar het inschrijvingsoverzicht" onclick="showActivityOverview('${a.id}')"></td>
                </tr>`
            )
        })
        $("#activity-overview-loader").hide()
    });
}

function printActivityPeriod(fromStr, toStr) {
    let from = new Date(Date.parse(fromStr));
    let to = new Date(Date.parse(toStr));
    if (from.getDate() === to.getDate()) {
        return printDDMMYYYY(from)
    }
    return `${printDDMMYYYY(from)} - ${printDDMMYYYY(to)}`;
}

function createActivity() {
    window.location = "/activity/editActivity.html?from=admin"
}

function editActivity(id) {
    window.location = `/activity/editActivity.html?id=${id}&from=admin`
}

function duplicateActivity(id) {
    window.location = `/activity/editActivity.html?id=${id}&duplicate=true&from=admin`
}

function showActivityOverview(id) {
    window.location = `/activity/activityOverview.html?id=${id}&from=admin`
}