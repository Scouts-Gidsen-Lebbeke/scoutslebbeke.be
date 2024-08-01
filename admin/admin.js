window.onload = function() {
    loadGlobal();
    requireLogin(function (d) {
        guardAdmin(d)
        loadProfile(d);
        loadActivities();
        loadEvents();
    });
};

function downloadCertificate() {
    getCertificate($("#subscription-id").val())
}

function syncStaff() {
    $("#sync-staff").prop("disabled", true);
    $("#sync-staff-feedback").html("Bezig met ophalen data...");
    tokenized("/api/admin/syncStaff.php").then(d => {
        $("#sync-staff-feedback").html(d.success ? "Synchronisatie gelukt!" : d.message)
        $("#sync-staff").prop("disabled", false);
    });
}

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

function loadEvents() {
    tokenized("/api/event/getAllEvents.php").then(d => {
        d.events.forEach(e => {
            $('#event-overview tbody').append(
                `<tr>
                    <td><a href="/event/event.html?id=${e.id}">${e.name}</a></td>
                    <td>${printActivityPeriod(e.start, e.end)}</td>
                    <td>${e.registrations}</td>
                    <td>${e.status}</td>
                    <td class="icon-column"><img src="/images/edit.png" class="subscription-icon" alt="edit" title="Bewerk dit evenement" onclick="editEvent('${e.id}')"></td>
                    <td class="icon-column"><img src="/images/copy.png" class="subscription-icon" alt="duplicate" title="Dupliceer dit evenement" onclick="duplicateEvent('${e.id}')"></td>
                    <td class="icon-column"><img src="/images/list.png" class="subscription-icon" alt="overview" title="Ga naar het inschrijvingsoverzicht" onclick="showEventOverview('${e.id}')"></td>
                </tr>`
            )
        })
        $("#event-overview-loader").hide()
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

function createNewEvent() {
    window.location = "/event/editEvent.html?from=admin"
}

function editEvent(id) {
    window.location = `/event/editEvent.html?id=${id}&from=admin`
}

function duplicateEvent(id) {
    window.location = `/event/editEvent.html?id=${id}&duplicate=true&from=admin`
}

function showEventOverview(id) {
    window.location = `/event/eventOverview.html?id=${id}&from=admin`
}