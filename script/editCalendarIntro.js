tinymce.init({
    selector: 'div#pre-intro',
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
        if (d.level > 2) {
            loadProfile(d)
            retrieveIntro()
        } else {
            window.location = "/403.html";
        }
    });
};
function retrieveIntro() {
    const id = (new URL(document.location)).searchParams.get('id')
    tokenized(`/api/calendar/getById.php?id=${id}`).then(item => {
        $("#id").val(item.id)
        if (item.intro) {
            tinymce.get("pre-intro").setContent(item.intro)
        }
        $(".loader").hide()
        $("#intro-form").show()
    })
}

function cancel() {
    window.location = "/calendar/calendar.html"
}

function postIntro() {
    $("#intro").val(tinymce.activeEditor.getContent());
    const form = document.querySelector("#intro-form");
    const formData = new FormData(form);
    fetch("/api/calendar/updateIntro.php", {
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