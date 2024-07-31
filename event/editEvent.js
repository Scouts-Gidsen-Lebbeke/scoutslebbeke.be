tinymce.init({
    selector: 'div#event-pre-info',
    plugins: 'link code paste emoticons',
    toolbar: 'undo redo | bold italic underline strikethrough subscript superscript | forecolor | link emoticons | code',
    toolbar_mode: 'floating',
    menubar: false,
    paste_as_text: true,
    tinycomments_mode: 'embedded',
    height: 250,
    content_css: '/style/editor.css',
    automatic_uploads: false,
});

let jsonEditor;
window.onload = function() {
    loadGlobal();
    retrieveLocations();
    jsonEditor = CodeMirror.fromTextArea(document.getElementById("event-additional-pre-form"), {
        mode: { name: "javascript", json: true },
        theme: "idea",
        lineNumbers: true
    });
    requireLogin(d => {
        guardStaff(d)
        loadProfile(d)
        retrieveEvent();
    });
};

function retrieveLocations() {
    fetch("/api/location/getAll.php").then((res) => res.json()).then((locations) => {
        locations.forEach(b => $('#event-location').append(`<option value="${b.id}">${b.name}</option>`))
    });
}

function retrieveEvent() {
    const params = (new URL(document.location)).searchParams;
    const eventId = params.get('id')
    if (eventId == null) {
        $(".loader").hide()
        $("#event-form").show()
        return
    }
    tokenized(`/api/event/getEvent.php?id=${eventId}`).then(e => {
        if (!params.get('duplicate')) {
            $("#event-id").val(e.id)
        }
        $("#event-name-input").val(e.name)
        $("#event-from").val(e.start)
        $("#event-to").val(e.end)
        $("#event-open").val(e.open_registration)
        $("#event-closed").val(e.close_registration)
        $("#event-location").val(ifNotNull(e.location_id, 0))
        tinymce.get("event-pre-info").setContent(e.info)
        if (e.additional_form) {
            jsonEditor.setValue(JSON.stringify(JSON.parse(e.additional_form), null, 2))
        }
        setTimeout(function () {
            jsonEditor.refresh();
        }, 1);
        $("#event-additional-form-rule").val(e.additional_form_rule)
        $(".loader").hide()
        $("#event-form").show()
    })
}

function postEvent() {
    $("#event-info").val(tinymce.get("event-pre-info").getContent());
    const form = document.querySelector("#event-form");
    const formData = new FormData(form);
    fetch("/api/event/updateEvent.php", {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
        method: "POST",
        body: formData
    }).then(data => data.json()).then(result => {
        if (result.error != null) {
            $("#event-form-feedback").html(result.error)
        } else {
            cancel()
        }
    });
}

function cancel() {
    const params = (new URL(document.location)).searchParams;
    const eventId = params.get('id')
    window.location = params.get('from') === "admin" ? "/admin/admin.html" : `/event/event.html?id=${eventId}`;
}