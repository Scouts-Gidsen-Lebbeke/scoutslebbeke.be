tinymce.init({
    selector: 'div#item-pre-content',
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

window.onload = function() {
    loadGlobal();
    retrieveLocations()
    requireLogin(d => {
        guardStaff(d)
        loadProfile(d)
        retrieveItem()
    });
};

function retrieveLocations() {
    fetch(`${baseApiUrl}/api/location/getAll.php`).then((res) => res.json()).then((locations) => {
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
        $("#item-loader").hide()
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
        $("#item-image").val(item.image)
        if (item.image) {
            $("#item-image-pic").attr("src", `/images/calendar/${item.image}`);
        }
        tinymce.get("item-pre-content").setContent(item.content)
        $("#item-loader").hide()
        $("#item-form").show()
    })
}

function toggleUpload() {
    $("#item-image-upload").trigger("click")
}

function postImage() {
    const form = new FormData(document.querySelector('#item-form'));
    fetch("/api/postImage.php?dir=calendar", {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
        method: "POST",
        body: form
    }).then(response => response.json()).then(data => {
        if (data.succes) {
            $("#item-image").val(data.name)
            $("#item-image-pic").attr("src", data.location);
        } else {
            $("#form-feedback").html(data.message);
        }
    });
}

function cancel() {
    window.location = "calendar.html"
}

function postItem() {
    $("#item-content").val(tinymce.activeEditor.getContent());
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