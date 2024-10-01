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
    tokenized(`/api/user/getActiveMembership.php?memberId=${memberId}`).then(result => {
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
    tokenized(`/api/user/createMembership.php?memberId=${memberId}`).then(result => {
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