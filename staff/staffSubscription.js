window.onload = function() {
    loadGlobal();
    checkLogin(d => {
        guardStaff(d);
        loadProfile(d);
    });
    $("#member-id").on("change", () => {
        checkMembershipState($("#member-id").val())
    })
};

function checkMembershipState(memberId) {
    if (!memberId) {
        $("#subscription-disabled").show();
        $("#current-membership").hide();
        $("#no-current-membership").hide();
        return
    }
    const url = phpServer ? `/user/getActiveMembership.php?memberId=${memberId}` : `/memberships/user/${memberId}/current`
    tokenized(url).then(result => {
        $("#subscription-disabled").hide();
        if (result) {
            $("#current-membership").show();
        } else {
            $("#no-current-membership").show();
        }
    })
}

function createMembership() {
    let memberId = $("#member-id").val()
    if (!memberId) return;
    const url = phpServer ? `/user/createMembership.php?memberId=${memberId}` : `/memberships/user/${memberId}`
    tokenized(url, false, null, "POST").then(result => {
        if (result.error) {
            alert(result.error)
        } else {
            location.href = result.checkout
        }
    })
}

function returnToMembershipOverview() {
    window.location = "/profile/membership.html";
}