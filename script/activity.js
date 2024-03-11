window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const eventId = params.get('id')
    checkLogin(function (d) {
        loadProfile(d)
        checkSubscriptionState(eventId)
        checkAdmin(d, eventId)
    });
    initActivity(eventId);
};

function initActivity(id) {
    fetch('/api/getActivity.php?id=' + id).then(data => data.json()).then(activity => {
        $("#activity-name").html(activity.name);
        $("#activity-when").text(periodToTitle(new Date(Date.parse(activity.start)), new Date(Date.parse(activity.end))))
        $("#activity-location").html(locationToTitle(activity.location, true))
        let branches = ""
        activity.restrictions.forEach(branch =>
            branches += `<img src="/images/branch/${branch.image}" alt="${branch.name}" title="${branch.name}" class="branch-icon"/>`
        )
        $("#activity-branches").html(branches)
        $("#activity-info").html(activity.info);
        $("#activity-practical-info").html(activity.practical_info);
        $("#activity-subscription-deadline").text(printDeadline(activity.close_subscription));
    });
}

function checkSubscriptionState(id) {
    tokenized('/api/getSubscriptionState.php?id=' + id).then(result => {
        if (result == null) return; // user is not logged in, keep original feedback
        if (result.error != null) {
            $("#subscription-feedback").html(result.error)
            $("#subscription-feedback").css('color', 'red')
        } else if (result.registration != null) {
            let status = result.registration.status;
            if (status === "open") {
                $("#subscription-feedback").html(`Je bent reeds ingeschreven voor deze activiteit, maar we hebben jouw betaling nog niet ontvangen. Nog bezig met de betaling? Werk ze <a onclick='finishPayment("${result.registration.payment_id}")'>hier</a> verder af.`)
            } else if (status === "paid") {
                $("#subscription-feedback").text("Je bent reeds ingeschreven voor deze activiteit.")
            }
        } else if (result.open_subscription != null) {
            $("#subscription-feedback").html("De inschrijvingen worden pas geopend op <b>" + printOpen(result.open_subscription) + "</b>.")
        } else {
            $("#subscription-feedback").hide()
            if (result.options.length === 1) {
                let option = result.options[0]
                $("#activity-price").text(`€ ${option.price}`)
                $("#subscribe-buttons").append(`<button class="subscribe-button" onclick="subscribe(id, option.id)">Schrijf me in!</button>`);
            } else {
                let options = result.options.map(o => `€${o.price} (${o.name})`).join(", ")
                $("#activity-price").text(options.replace(/,([^,]*)$/, ' of$1'));
                result.options.forEach(o => $("#subscribe-buttons").append(`<button class="subscribe-button" onclick="subscribe('${id}', '${o.id}')">Schrijf me in voor ${o.name}!</button>`));
                $("#multiple-options").show()
            }
            $("#subscription-block").show()
        }
    })
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

function subscribe(id, option) {
    $(".subscribe-button").prop("disabled", true);
    tokenized(`/api/subscribe.php?id=${id}&option=${option}`).then(result => {
        if (result.error != null) {
            alert(result.error)
            $("#subscribe-button").prop("disabled", false);
        } else if (result.checkout != null) {
            location.href = result.checkout
        }
    })
}

function printDeadline(dateString) {
    let date = new Date(Date.parse(dateString));
    return date.toLocaleDateString('nl-BE', { weekday: 'long', month: 'numeric', day: 'numeric' })
}

function printOpen(dateString) {
    let date = new Date(Date.parse(dateString));
    let day = date.toLocaleDateString('nl-BE', { weekday: 'long', month: 'numeric', day: 'numeric' })
    return `${day} (${date.toLocaleTimeString('nl-BE', { hour: 'numeric' })}u)`
}

function checkAdmin(user, eventId) {
    if (user.level > 2) {
        $("#activity-admin").show();
        $("#overview-button").on("click", function(){
            window.location = "activityOverview.html?id=" + eventId;
        });
    }
}