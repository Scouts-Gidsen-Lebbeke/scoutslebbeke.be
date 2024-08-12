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
                    <td><a onclick="mailto:${member.email}">${member.email}</a></td>
                    <td><a onclick="callto:${member.mobile}">${member.mobile}</td>
                    <td>${printDDMMYYYY(member.membership_date)}</td>
                    <td class="multi-icon-column">${retrieveExtraIcons(member)}</td>
                    <td><img src="/images/${member.medical_attention ? 'cross-red' : 'cross'}.png" class="subscription-icon" alt="pill" onclick="showMedicalOverview('${member.sgl_id}')"></td>
                    <td><img src="/images/report.png" class="subscription-icon" title="Download inschrijvingsbewijs" alt="report" onclick="getCertificate('${member.id}')"></td>
                </tr>
            `)
        )
        $(".loader").hide();
    })
}