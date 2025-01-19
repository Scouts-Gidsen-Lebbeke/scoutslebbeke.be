window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    checkLogin(loadProfile);
    retrieveSubscription(params.get('order_id'));
};

function retrieveSubscription(orderId) {
    fetch(`${baseApiUrl}/activity/getSubscription.php?id=${orderId}`).then(data => data.json()).then(r => {
        if (r.status === "paid") {
            $("#subscription-id").text(r.id)
            $("#subscription-first-name").text(r.first_name)
            $("#confirmation").show()
            $("#status-loader").hide()
        } else if (r.status === "canceled" || r.status === "failed") {
            $("#cancel").show()
            $("#status-loader").hide()
        } else {
            new Promise(r => setTimeout(r, 1000)).then(() => { retrieveSubscription(orderId) });
        }
    });
}

function returnToActivity() {
    const params = (new URL(document.location)).searchParams;
    window.location = "/activity/activity.html?id=" + params.get('id');
}