window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const eventId = params.get('id')
    checkLogin(function (d) {
        if (params.get('fromlogin') && kc.token) {
            subscribe(eventId)
        } else {
            loadProfile(d)
            if (kc.token) {
                checkSubscriptionState(eventId)
            }
        }
    });
    initActivity(eventId);
};

function initActivity(id) {
    fetch('/api/getActivity.php?id=' + id).then(data => data.json()).then(data => {
        $("#activity-name").text(data.name);
        $("#activity-subscription-deadline").text(printDate(data.close_subscription));
        $("#activity-info").html(data.info);
        $("#activity-location").text("")
        if (new Date(Date.parse(data.open_subscription)) > new Date()) {
            $("#subscribe-button").disable()
            $(".subscription-feedback").text("De inschrijvingen worden pas geopend op " + printDate(data.open_subscription) + ".")
        } else {
            $("#subscribe-button").click(function(){
                subscribe(id)
            });
        }
    });
}

function checkSubscriptionState(id) {
    tokenized('/api/getSubscriptionState.php?id=' + id).then(data => {
        if (data['status'] === 'paid') {
            $(".subscribe-button").hide();
        } else {
            $(".subscribe-button").enable();
        }
        $(".subscription-feedback").text(data['status'])
    })
}

function subscribe(id) {
    tokenized('/api/subscribe.php?id=' + id).then(url => {
        if (url != null) {
            location.href = url
        }
    })
}

function printDate(dateString) {
    let date = new Date(Date.parse(dateString));
    return date.toLocaleDateString('nl-BE', { weekday: 'long', month: 'numeric', day: 'numeric' })
}