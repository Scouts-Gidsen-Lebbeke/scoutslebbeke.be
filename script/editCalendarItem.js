window.onload = function() {
    loadGlobal();
    retrieveLocations()
    requireLogin(d => {
        if (d.level > 2) {
            loadProfile(d)
            retrieveItem()
        } else {
            window.location = "/403.html";
        }
    });
};

function retrieveLocations() {
    fetch("/api/location/getAll.php").then((res) => res.json()).then((locations) => {
        locations.forEach(b => $('#item-location').append(`<option value="${b.id}">${b.name}</option>`))
    });
}

function retrieveItem() {
    const params = (new URL(document.location)).searchParams;
    const itemId = params.get('id')
    if (itemId == null) {
        $("#calendar-id").val(params.get('calendarId'))
        $("#item-from").val(params.get('from'))
        $("#item-to").val(params.get('to'))
        $(".loader").hide()
        $("#item-form").show()
        return
    }
    tokenized(`/api/calendar/getItem.php?id=${itemId}`).then(item => {
        $("#item-id").val(item.id)
        $("#period-id").val(item.calendar_period_id)
        $("#calendar-id").val(item.calendar_id)
        $("#item-title").val(item.title)
        $("#item-from").val(item.fromDate)
        $("#item-to").val(item.toDate)
        $("#item-location").val(ifNotNull(item.location_id, 0))
        $("#item-closed").prop('checked', item.closed === "1")
        $("#item-content").val(item.content)
        $(".loader").hide()
        $("#item-form").show()
    })
}

function cancel() {
    window.location = "/calendar/calendar.html"
}

function postItem() {
    const form = document.querySelector("#item-form");
    const formData = new FormData(form);
    fetch("/api/calendar/updateItem.php", {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
        method: "POST",
        body: formData
    }).then(data => data.json()).then(result => {
        if (result.error != null) {
            $("#form-feedback").html(result.error)
        } else {
            cancel()
        }
    });
}