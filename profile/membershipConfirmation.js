window.onload = function() {
    loadGlobal();
    const id = (new URL(document.location)).searchParams.get('id');
    checkLogin(loadProfile);
    retrieveMembership(id);
};

function retrieveMembership(id) {
    fetch(`${baseApiUrl}/api/user/getMembership.php?id=${id}`).then(data => data.json()).then(r => {
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
    const external_id = (new URL(document.location)).searchParams.get('memberId');
    if (external_id === "") {
        window.location = "/info/subscribe.html";
    } else {
        window.location = "/profile/membership.html";
    }
}