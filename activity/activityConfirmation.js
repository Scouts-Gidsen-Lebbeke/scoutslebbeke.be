window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const orderId = params.get('order_id');
    checkLogin(loadProfile);
    retrieveSubscription(orderId);
};

function retrieveSubscription(orderId) {
    fetch(`/api/activity/getSubscription.php?id=${orderId}`).then(data => data.json()).then(r => {
        $("#subscription-id").text(r.id)
        $("#subscription-first-name").text(r.first_name)
        $(".loader").hide()
        $("#confirmation").show()
    });
}

function returnToActivity() {
    const params = (new URL(document.location)).searchParams;
    window.location = "/activity/activity.html?id=" + params.get('id');
}