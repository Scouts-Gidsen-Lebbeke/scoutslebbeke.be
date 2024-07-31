window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const orderId = params.get('order_id');
    checkLogin(loadProfile);
    retrieveRegistration(orderId);
};

function retrieveRegistration(orderId) {
    fetch(`/api/event/getRegistration.php?id=${orderId}`).then(data => data.json()).then(r => {
        $("#registration-id").text(r.id)
        $("#registration-first-name").text(r.first_name)
        $(".loader").hide()
        $("#confirmation").show()
    });
}

function returnToEvent() {
    const params = (new URL(document.location)).searchParams;
    window.location = "/event/event.html?id=" + params.get('id');
}