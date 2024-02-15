function initEvent(id) {
    const params = (new URL(document.location)).searchParams;
    if (params.get('fromlogin')) {
        tokenized('/api/subscribe.php?id=' + id)
    } else if (kc.token) {
        tokenized('/api/getSubscriptionState.php?id=' + id).then(data => data.json()).then(data => {
            console.log(data)
            if (data['status'] === 'paid') {
                $("#subscribe-button").hide();
            }
            $("#subscription-feedback").text(data['status'])
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