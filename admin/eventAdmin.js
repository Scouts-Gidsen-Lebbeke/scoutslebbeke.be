window.onload = function() {
    loadGlobal();
    requireLogin(function (d) {
        guardAdmin(d)
        loadProfile(d);
        loadEvents();
    });
};

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