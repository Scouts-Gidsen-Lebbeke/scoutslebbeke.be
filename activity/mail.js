tinymce.init({
    selector: 'div#email-pre-content',
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
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    requireLogin(async d => {
        if (d.level > 2) {
            loadProfile(d)
            if (activityId) {
                $("#activity-id").val(activityId)
            }
        } else {
            window.location = "/403.html";
        }
    });
};

function mail() {
    $("#email-content").val(tinymce.activeEditor.getContent());
    const form = document.querySelector("#email-form");
    const formData = new FormData(form);
    fetch(`/api/activity/mailSubscribers.php`, {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
        method: "POST",
        body: formData
    }).then(data => data.json()).then(result => {
        console.log(result)
        $("#form-feedback").html(result)
    })
}

function cancel() {
    window.location = `/activity/activityOverview.html?id=${$("#activity-id").val()}`
}