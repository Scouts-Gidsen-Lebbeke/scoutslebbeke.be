tinymce.init({
    selector: 'div#activity-pre-info',
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

tinymce.init({
    selector: 'div#activity-pre-practical',
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
    jsonEditor = CodeMirror.fromTextArea(document.getElementById("activity-additional-pre-form"), {
        mode: { name: "javascript", json: true },
        theme: "idea",
        lineNumbers: true
    });
    requireLogin(d => {
        guardStaff(d)
        loadProfile(d)
        retrieveActivity();
    });
};

function retrieveLocations() {
    fetch("/api/location/getAll.php").then((res) => res.json()).then((locations) => {
        locations.forEach(b => $('#activity-location').append(`<option value="${b.id}">${b.name}</option>`))
    });
}

function retrieveActivity() {
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    if (activityId == null) {
        $(".loader").hide()
        $("#activity-form").show()
        return
    }
    tokenized(`/api/activity/getActivity.php?id=${activityId}`).then(a => {
        if (!params.get('duplicate')) {
            $("#activity-id").val(a.id)
        }
        $("#activity-name-input").val(a.name)
        $("#activity-from").val(a.start)
        $("#activity-to").val(a.end)
        $("#activity-open").val(a.open_subscription)
        $("#activity-closed").val(a.close_subscription)
        $("#activity-price").val(a.price)
        $("#activity-sibling-reduction").val(a.sibling_reduction)
        $("#activity-location").val(ifNotNull(a.location_id, 0))
        let branches = ""
        a.restrictions.forEach(branch =>
            branches += `<img src="/images/branch/${branch.image}" alt="${branch.name}" title="${branch.name}" class="branch-icon"/>`
        )
        $("#activity-branches").html(branches)
        tinymce.get("activity-pre-info").setContent(a.info)
        tinymce.get("activity-pre-practical").setContent(a.practical_info)
        if (a.additional_form) {
            jsonEditor.setValue(JSON.stringify(JSON.parse(a.additional_form), null, 2))
        }
        setTimeout(function() {
            jsonEditor.refresh();
        },1);
        $("#activity-additional-form-rule").val(a.additional_form_rule)
        $(".loader").hide()
        $("#activity-form").show()
    })
}

function editRestrictions() {

}

function postActivity() {
    $("#activity-info").val(tinymce.get("activity-pre-info").getContent());
    $("#activity-practical").val(tinymce.get("activity-pre-practical").getContent());
    const form = document.querySelector("#activity-form");
    const formData = new FormData(form);
    fetch("/api/activity/updateActivity.php", {
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

function cancel() {
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    window.location = params.get('from') === "admin" ? "/admin/admin.html" : `/activity/activity.html?id=${activityId}`;
}