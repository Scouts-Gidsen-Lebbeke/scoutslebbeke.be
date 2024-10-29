jQuery.validator.setDefaults({
    success: "valid"
});

window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const eventId = params.get('id');
    checkLogin(function (d) {
        loadProfile(d);
        $("#event-last-name").val(d.name);
        $("#event-first-name").val(d.first_name);
        $("#event-email").val(d.email);
        $("#event-mobile").val(d.mobile);
        //$("#event-address").val(d.address);
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
        $(".event-registration-deadline").text(printDeadline(event.close_registration));
        if (new Date(Date.parse(event.close_registration)) < new Date()) {
            $("#registration-block").hide()
            $("#registration-feedback").text("De inschrijvingen voor dit evenement zijn afgesloten!")
            return
        }
        if (event.additional_form) {
            $("#registration-form").validate({
                errorLabelContainer: "#registration-feedback",
                wrapper: "span",
                ignore: ".ignore-validation"
            })
            $("#additional-form").dform(JSON.parse(event.additional_form));
            $("#registration-form input, select").on("change", function () { calculatePrice(event.additional_form_rule) });
        } else {
            $("#additional-form-title").hide()
        }
        let isEvent = event.eventType === "EVENT"
        $("#additional-form-title").html(isEvent ? "Evenementsgegevens" : "Bestelgegevens")
        $("#register-button").html(isEvent ? "Registreer" : "Bestel")
        $("#registration-title").html(isEvent ? "Inschrijving" : "Bestelling")
        $(isEvent ? "#registration-info" : "#order-info").show()
        if (event.needsMobile === "1") {
            $("#mobile-block").css("display", "inline-block")
        }
        if (event.needsAddress === "1") {
            $("#address-block").css("display", "inline-block")
        }
        calculatePrice(event.additional_form_rule)
        $("#register-button").click(() => register(event.id))
    });
}

async function calculatePrice(rule) {
    let formData = sanitizeData(new FormData(document.querySelector("#registration-form")));
    let total_price = Number(await jsonata(rule).evaluate(formData));
    $("#event-price-field").val(total_price);
    $("#event-price").text(`€ ${total_price.toFixed(2).replace('.', ',')}`);
}

function checkAdmin(user, eventId) {
    if (user.level > 2) {
        $("#event-admin").show();
        $("#overview-button").on("click", function(){
            window.location = "/event/eventOverview.html?id=" + eventId;
        });
    }
    if (user.level > 3) {
        $("#edit-button").removeAttr('hidden');
        $("#edit-button").on("click", function(){
            window.location = "/event/editEvent.html?id=" + eventId;
        });
    }
}

function register(id) {
    if (!$("#registration-form").valid()) return;
    $("#register-button").prop("disabled", true);
    const form = new FormData(document.querySelector("#registration-form"));
    fetch(`/api/event/register.php?id=${id}`, {
        method: "POST",
        body: form
    }).then(response => response.json()).then(result => {
        if (result.error != null) {
            $("#contact-feedback").text(result.error)
            $("#register-button").prop("disabled", false);
        } else if (result.checkout != null) {
            location.href = result.checkout
        }
    })
    // let xhr = new XMLHttpRequest();
    // xhr.open('POST', `/api/event/register.php?id=${id}`, true);
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4) {
    //         let result = JSON.parse(xhr.responseText);
    //         if (xhr.status === 200) {
    //             location.href = result.checkout
    //         } else {
    //             $("#registration-feedback").text(result.error)
    //             $("#register-button").prop("disabled", false);
    //         }
    //     }
    // };
    // xhr.send(form);
}