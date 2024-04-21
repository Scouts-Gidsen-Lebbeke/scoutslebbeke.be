window.onload = function() {
    loadGlobal();
    requireLogin(d => {
        if (d.level > 2) {
            loadProfile(d)
            retrieveOutro()
        } else {
            window.location = "/403.html";
        }
    });
};
function retrieveOutro() {
    const id = (new URL(document.location)).searchParams.get('id')
    tokenized(`/api/calendar/getById.php?id=${id}`).then(item => {
        $("#id").val(item.id)
        $("#outro").val(item.outro)
        $(".loader").hide()
        $("#outro-form").show()
    })
}

function cancel() {
    window.location = "/calendar/calendar.html"
}

function postOutro() {
    const form = document.querySelector("#outro-form");
    const formData = new FormData(form);
    fetch("/api/calendar/updateOutro.php", {
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