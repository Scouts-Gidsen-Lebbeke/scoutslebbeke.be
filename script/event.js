window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const eventId = params.get('id');
    checkLogin(function (d) {
        loadProfile(d);
        $("#event-last-name").val(d.name);
        $("#event-first-name").val(d.first_name);
        $("#event-email").val(d.email);
        checkAdmin(d, eventId);
    });
    initEvent(eventId);
};

function initEvent(id) {
    fetch(`/api/event/getEvent.php?id=${id}`).then(data => data.json()).then(event => {
        $("#event-name").html(event.name);
        $("#event-when").text(periodToTitle(new Date(Date.parse(event.start)), new Date(Date.parse(event.end))))
        $("#event-location").html(locationToTitle(event.location, true))
        $("#event-info").html(event.info);
        $("#event-registration-deadline").text(printDeadline(event.close_registration));
        if (new Date(Date.parse(event.close_registration)) < new Date()) {
            $("#registration-block").hide()
            $("#registration-feedback").text(result.error)
            return
        }
        if (event.additional_form) {
            $("#additional-form").dform(JSON.parse(event.additional_form));
            $("#registration-form input").on("change", async function () {
                let formData = sanitizeData(new FormData(document.querySelector("#registration-form")));
                let total_price = Number(await jsonata(event.additional_form_rule).evaluate(formData));
                $("#event-price-field").val(total_price);
                $("#event-price").text(`€ ${total_price}`);
            });
        } else {
            $("#additional-form-title").hide()
        }
        $("#register-button").click(() => register(event.id))
    });
}

function checkAdmin(user, eventId) {
    if (user.level > 2) {
        $("#event-admin").show();
        $("#overview-button").on("click", function(){
            window.location = "/event/eventOverview.html?id=" + eventId;
        });
    }
}

function register(id) {
    $("#register-button").prop("disabled", true);
    const form = new FormData(document.querySelector("#registration-form"));
    fetch(`/api/event/register.php?id=${id}`, {
        method: "POST",
        body: form
    }).then(response => response.json()).then(result => {
        if (result.error != null) {
            $("#registration-feedback").text(result.error)
            $("#register-button").prop("disabled", false);
        } else if (result.checkout != null) {
            location.href = result.checkout
        }
    })
}