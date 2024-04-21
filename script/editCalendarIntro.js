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
        $("#intro").val(item.intro)
        $(".loader").hide()
        $("#intro-form").show()
    })
}

function cancel() {
    window.location = "/calendar/calendar.html"
}

function postIntro() {
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