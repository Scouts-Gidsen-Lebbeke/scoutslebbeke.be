window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    initBranches();
    requireLogin(async d => {
        guardStaff(d)
        loadProfile(d)
        if (activityId) {
            retrieveActivity(activityId)
        }
    });
};

async function initBranches() {
    return fetch(`${baseApiUrl}/api/branch/getActive.php`).then((res) => res.json()).then((branches) => {
        branches.forEach(b => $('#branches').append(`<option value="${b.id}">${b.name}</option>`))
    });
}

function retrieveActivity(id) {
    tokenized(`/api/activity/getActivityOverview.php?id=${id}`).then(result => {
        result.registrations.forEach((s, i) => {
            $('#overview-table tbody').append(
                `<tr>
                    <td>${i + 1}</td>
                    <td>${s.user.first_name}</td>
                    <td>${s.user.name}</td>
                    <td class="address-column hidden">${s.user.address.straat} ${s.user.address.nummer}${s.user.address.bus != null ? " " + s.user.address.bus : ""}, ${s.user.address.postcode} ${s.user.address.gemeente}</td>
                    <td class="branch-column hidden">${s.user.branch != null ? s.user.branch.name : "temp branch"}</td>
                    <td class="from-column hidden">${printDate(s.start)}</td>
                    <td class="until-column hidden">${printDate(s.end)}</td>
                    <td class="price-column hidden">€ ${s.price}</td>
                    <td class="present-column hidden"><input id="${s.id}-present" type="checkbox" onclick="markPresent(this.checked, '${result.activity.id}', '${s.id}')" ${s.present === "1" ? "checked" : ""}></td>
                    ${parseAdditionalData(s.additional_data)}
                    <td class="multi-icon-column">${retrieveExtraIcons(s.user)}</td>
                    <td><img src="/images/${s.user.medical_attention ? 'cross-red' : 'cross'}.png" class="subscription-icon" alt="pill" onclick="showMedicalOverview('${s.user.sgl_id}')"></td>
                    <td><img src="/images/report.png" class="subscription-icon ${s.present === "1" ? "" : "hidden"}" alt="report" id="report-${s.id}" onclick="getCertificate('${s.id}')"></td>
                    <td>${s.cancellable ? `<img src="/images/cancel.png" class="subscription-icon" alt="cancel" onclick="cancelSubscription('${s.id}')">` : ""}</td>
                </tr>`
            )
        })
        if (result.registrations.length !== 0) {
            let data = result.registrations[0].additional_data;
            if (data) {
                Object.keys(JSON.parse(data)).forEach(d => {
                    $('#overview-table thead tr:nth-last-child(3)').insertBefore(`<th class="additional ${d}-column hidden">${capitalize(d)}</th>`)
                    $("#checks").append(`
                        <div class="additional">
                            <input type="checkbox" id="${d}-column" onclick="toggleVisible(this)">
                            <label for="${d}-column">${capitalize(d)}</label>
                        </div>
                    `)
                    let sum = sumTableValues(`${d}-column`)
                    $('#overview-table tfoot tr:nth-last-child(3)').insertBefore(`<th class="additional ${d}-column hidden">${sum !== -1 ? sum : ""}</th>`)
                })
            }
            let sum = sumTableValues("price-column")
            $("#price-total").html(`€ ${sum}`)
        }
        $("#overview-loader").hide()
        $("#export-button").prop('disabled', false);
        $("#mail-button").prop('disabled', false);
    })
}

function printDate(date) {
    return new Date(Date.parse(date)).toLocaleDateString('nl-BE', { year: '2-digit', month: '2-digit', day: '2-digit' });
}

function markPresent(present, activityId, id) {
    tokenized(`/api/activity/markPresent.php?activityId=${activityId}&id=${id}&present=${present}`).then(result => {
        if (result.error) {
            alert(result.error)
            $(`#${id}-present`).prop('checked', !present);
        } else {
            $(`#report-${id}`).css('display', present ? "initial" : "none");
        }
    })
}

function toggleVisible(cb) {
    if (cb.checked) {
        $(`.${cb.id}`).css("display", "table-cell");
    } else {
        $(`.${cb.id}`).hide();
    }
}

function sumTableValues(id) {
    let sum = -1;
    $("#overview-table tbody tr").each(function() {
        $(this).find(`.${id}`).each(function() {
            let numericValue = parseFloat($(this).text().replace("€ ", ""));
            if (!isNaN(numericValue)) {
                if (sum === -1) {
                    sum = 0;
                }
                sum += numericValue;
            }
        });
    });
    return sum;
}

function mail() {
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id');
    window.location = `mail.html?id=${activityId}`;
}

function filterBranch(input) {
    const rows = $("#overview-table tr");
    if (input.value === "0") {
        Array.from(rows).forEach((row, index) => row.style.display = "");
        return;
    }
    const filter = input.options[input.selectedIndex].text;
    let visibleIndex = 1
    Array.from(rows).forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const cells = row.getElementsByTagName("td");
        const rowText = row.getElementsByClassName("branch-column")[0].textContent;
        if (rowText.includes(filter)) {
            row.style.display = "";
            if (cells.length > 0) {
                cells[0].innerText = visibleIndex++
            }
        } else {
            row.style.display = "none";
        }
    });
}

function goBack() {
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    window.location = params.get('from') === "admin" ? "/admin/admin.html" : `/activity/activity.html?id=${activityId}`;
}