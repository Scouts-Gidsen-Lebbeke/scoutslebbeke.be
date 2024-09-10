window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const id = params.get('id');
    checkLogin(loadProfile);
    retrieveMembership(id);
};

function retrieveMembership(id) {
    fetch(`/api/user/getMembership.php?id=${id}`).then(data => data.json()).then(r => {
        if (r.status === "paid") {
            $("#membership-period").text(`${printY(r.start)} - ${printY(r.end)}`)
            $("#membership-first-name").text(r.user.first_name)
            $("#confirmation").show()
            $("#status-loader").hide()
        } else if (r.status === "canceled" || r.status === "failed") {
            $("#cancel").show()
            $("#status-loader").hide()
        } else {
            new Promise(r => setTimeout(r, 1000)).then(() => { retrieveMembership(id) });
        }
    });
}

function returnToMembershipOverview() {
    window.location = "/profile/membership.html";
}