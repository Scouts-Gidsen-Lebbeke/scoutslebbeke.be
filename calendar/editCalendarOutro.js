tinymce.init({
    selector: 'div#pre-outro',
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
    requireLogin(d => {
        guardStaff(d)
        loadProfile(d)
        retrieveOutro()
    });
};
function retrieveOutro() {
    const id = (new URL(document.location)).searchParams.get('id')
    tokenized(`/calendar/getById.php?id=${id}`).then(item => {
        $("#id").val(item.id)
        if (item.outro) {
            tinymce.get("pre-outro").setContent(item.outro)
        }
        $("#outro-loader").hide()
        $("#outro-form").show()
    })
}

function cancel() {
    window.location = "calendar.html"
}

function postOutro() {
    $("#outro").val(tinymce.activeEditor.getContent());
    postForm(`/calendar/updateOutro.php`, "outro-form").then(result => {
        if (result.error != null) {
            $("#form-feedback").html(result.error)
        } else {
            cancel()
        }
    });
}