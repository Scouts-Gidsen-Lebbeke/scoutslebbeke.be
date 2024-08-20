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
    const eventId = params.get('id');
    requireLogin(async d => {
        guardStaff(d);
        loadProfile(d);
        if (eventId) {
            $("#event-id").val(eventId);
        }
    });
};

function mail() {
    $("#send-button").attr("disabled", true);
    $("#email-error").hide();
    $("#email-feedback").html("Bezig met versturen...");
    $("#email-content").val(tinymce.activeEditor.getContent());
    const form = document.querySelector("#email-form");
    const formData = new FormData(form);
    fetch(`/api/event/mailRegistrations.php`, {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
        method: "POST",
        body: formData
    }).then(data => data.json()).then(result => {
        $("#send-button").attr("disabled", false);
        if (result.error) {
            $("#email-feedback").empty();
            $("#email-error").html(result.error);
            $("#email-error").show();
        } else {
            $("#email-feedback").html(`Mails succesvol verstuurd naar ${result.amount} ontvangers!`);
        }
    })
}

function cancel() {
    window.location = `/event/eventOverview.html?id=${$("#event-id").val()}`;
}