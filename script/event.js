function initEvent(id) {
    fetch('/api/getEvent.php?id=' + id).then(data => data.json()).then(data => {
        let openSubscription = new Date(Date.parse(data.open_subscription));
        if (openSubscription > new Date()) {
            $(".subscription-feedback").text("De inschrijvingen worden pas geopend op " + printDate(openSubscription) + ".")
        } else {
            checkSubscriptionState(id)
        }
    });
}

function checkSubscriptionState(id) {
    const params = (new URL(document.location)).searchParams;
    if (params.get('fromlogin')) {
        tokenized('/api/subscribe.php?id=' + id)
    } else if (kc.token) {
        tokenized('/api/getSubscriptionState.php?id=' + id).then(data => data.json()).then(data => {
            console.log(data)
            if (data['status'] === 'paid') {
                $(".subscribe-button").hide();
            } else {
                $(".subscribe-button").enable();
            }
            $(".subscription-feedback").text(data['status'])
        })
    }
}

function subscribe(id) {
    if (kc.token) {
        tokenized('/api/subscribe.php?id=' + id)
    } else {
        kc.login({
            redirectUri: document.location + "?q=activity/" + id +"&fromlogin=true"
        })
    }
}

function printDate(date) {
    return date.toLocaleDateString('nl-BE', { weekday: 'long', month: 'numeric', day: 'numeric' })
}