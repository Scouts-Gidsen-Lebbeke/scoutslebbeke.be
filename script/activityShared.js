function checkSubscriptionState(activityId, memberId) {
    $("#subscription-disabled").show();
    $("#subscription-feedback").empty();
    $("#subscription-block").hide();
    if (!memberId) return
    tokenized(`/api/activity/getSubscriptionState.php?id=${activityId}&memberId=${memberId}`).then(result => {
        if (result == null) return; // user is not logged in, keep original feedback
        $("#subscription-disabled").hide();
        if (result.error != null) {
            $("#subscription-feedback").html(result.error).css('color', 'red')
        } else if (result.registration != null) {
            $("#subscription-feedback").html(result.registration.feedback);
        } else if (result.open_subscription != null) {
            $("#subscription-feedback").html("De inschrijvingen worden pas geopend op <b>" + printOpen(result.open_subscription) + "</b>.")
        } else {
            result.options.forEach(o =>
                $("#options").append(`<input type="radio" id="${o.id}" name="option" value="${o.id}"><label for="${o.id}">${o.name} (€ ${o.price})</label>`)
            )
            if (result.options.length !== 1) {
                $("#multiple-options").show()
            }
            if (result.activity.additional_form) {
                $("#additional-form").dform(JSON.parse(result.activity.additional_form));
            }
            $("#subscription-form input").on("change", async function () {
                let formData = sanitizeData(new FormData(document.querySelector("#subscription-form")));
                let additional_price = Number(await jsonata(result.activity.additional_form_rule).evaluate(formData));
                let chosen_option = $('input[name="option"]:checked').val()
                let total_price = additional_price + Number(result.options.find(o => o.id === chosen_option).price);
                $("#activity-price-field").val(total_price);
                $("#activity-price").text(`€ ${total_price}`);
            } );
            $("#options input:radio:first").attr('checked', true).trigger("change");
            $("#subscribe-button").click(() => subscribe(result.activity.id))
            $("#subscription-block").show()
        }
    })
}

function sanitizeData(data) {
    let obj = Object.fromEntries(data)
    for(const prop in obj){
        if(obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])){
            obj[prop] = +obj[prop];
        }
    }
    return JSON.parse(JSON.stringify(obj));
}

function finishPayment(id) {
    fetch('/api/getCheckout.php?id=' + id).then(result => result.json()).then(result => {
        if (result.error != null) {
            alert(result.error)
        } else if (result.feedback != null) {
            $("#subscription-feedback").html(result.feedback)
        } else if (result.checkout != null) {
            location.href = result.checkout
        }
    })
}

function subscribe(id) {
    $("#subscribe-button").prop("disabled", true);
    const form = new FormData(document.querySelector("#subscription-form"));
    fetch(`/api/activity/subscribe.php?id=${id}`, {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
        method: "POST",
        body: form
    }).then(response => response.json()).then(result => {
        if (result.error != null) {
            alert(result.error)
            $("#subscribe-button").prop("disabled", false);
        } else if (result.checkout != null) {
            location.href = result.checkout
        }
    })
}

function printOpen(dateString) {
    let date = new Date(Date.parse(dateString));
    let day = date.toLocaleDateString('nl-BE', { weekday: 'long', month: 'numeric', day: 'numeric' })
    return `${day} (${date.toLocaleTimeString('nl-BE', { hour: 'numeric' })}u)`
}