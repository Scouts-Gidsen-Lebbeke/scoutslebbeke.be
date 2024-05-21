window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const eventId = params.get('id')
    let events = loadEvents();
    requireLogin(async d => {
        if (d.level > 2) {
            loadProfile(d)
            await events
            if (eventId) {
                $("#events").val(eventId).change()
            }
        } else {
            window.location = "/403.html";
        }
    });
};

async function loadEvents() {
    return fetch("/api/event/getAllEvents.php").then(d => d.json()).then(d => {
        d.forEach(a => $('#events').append(`<option value="${a.id}">${a.name}</option>`))
    })
}

function retrieveEvent(id) {
    $("#registration-overview tr:not(:first)").remove();
    if (id === "0") return
    $("#registration-loader").show()
    tokenized(`/api/event/getEventOverview.php?id=${id}`).then(registrations => {
        let index = 0;
        registrations.forEach(s => {
            index++;
            $('#registration-overview tr:last').after(
                `<tr>
                    <td>${index}</td>
                    <td>${s.first_name}</td>
                    <td>${s.last_name}</td>
                    <td>€ ${s.price}</td>
                </tr>`
            )
        })
        $("#registration-loader").hide()
    })
}