window.onload = function() {
    loadGlobal();
    let branches = initBranches();
    requireLogin(async d => {
        loadProfile(d)
        await branches
        $("#member-branches").val(d.staff_branch).trigger('change')
    });
};

async function initBranches() {
    return fetch("/api/branch/getActiveWithRole.php").then((res) => res.json()).then((branches) => {
        branches.forEach(b => $('#member-branches').append(`<option value="${b.id}">${b.name}</option>`))
    });
}

function loadMembers() {
    $(".loader").show();
    $('#member-overview tbody').empty();
    let branchId = $("#member-branches").val();
    tokenized(`/api/user/findActiveMembers.php?branch=${branchId}`).then(result => {
        $("#current-period").html(` (${printY(result.period.start)} - ${printY(result.period.end)})`)
        result.members.forEach(member =>
            $('#member-overview tbody').append(`
                <tr>
                    <td>${member.first_name}</td>
                    <td>${member.name}</td>
                    <td>${member.email}</td>
                    <td>${member.mobile}</td>
                    <td>${member.membership_date}</td>
                    <td class="icon-column"></td>
                    <td class="icon-column"><img src="/images/report.png" class="subscription-icon" alt="report" onclick="getCertificate('${member.id}')"></td>
                </tr>
            `)
        )
        $(".loader").hide();
    })
}