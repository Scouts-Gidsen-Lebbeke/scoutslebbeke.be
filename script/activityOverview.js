window.onload = function() {
    loadGlobal();
    requireLogin(d => {
        if (d.level > 2) {
            loadProfile(d)
            loadEvents()
        } else {
            window.location = "/";
        }
    });
};

function loadEvents() {
    const params = (new URL(document.location)).searchParams;
    const eventId = params.get('id')
    fetch("/api/getAllActivities.php").then(d => d.json()).then(d => {
        d.forEach(a => $('#activities').append(`<option value="${a.id}">${a.name}</option>`))
        if (eventId != null) {
            $('#activities').val(eventId)
            retrieveEvent(eventId)
        }
    })
}

function retrieveEvent(id) {
    $("#subscription-overview tr:not(:first)").remove();
    if (id === "0") return
    $("#subscription-loader").show()
    tokenized("/api/getActivityOverview.php?id=" + id).then(subscriptions => {
        subscriptions.forEach(subscription =>
            $('#subscription-overview tr:last').after(`<tr><td>${subscription.first_name}</td><td>${subscription.name}</td><td>${subscription.branch_name}</td></tr>`)
        )
        $("#subscription-loader").hide()
    })
}