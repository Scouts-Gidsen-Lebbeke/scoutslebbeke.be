window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const orderId = params.get('order_id');
    checkLogin(loadProfile);
    retrieveRegistration(orderId);
};

function retrieveRegistration(orderId) {
    fetch(`${baseApiUrl}/event/getRegistration.php?id=${orderId}`).then(data => data.json()).then(r => {
        if (r.status === "paid") {
            $("#registration-id").text(r.id)
            $("#registration-first-name").text(r.first_name)
            $("#confirmation").show()
            $("#status-loader").hide()
        } else if (r.status === "canceled" || r.status === "failed") {
            $("#cancel").show()
            $("#status-loader").hide()
        } else {
            new Promise(r => setTimeout(r, 1000)).then(() => { retrieveRegistration(orderId) });
        }
    });
}

function returnToEvent() {
    const params = (new URL(document.location)).searchParams;
    window.location = "/event/event.html?id=" + params.get('id');
}