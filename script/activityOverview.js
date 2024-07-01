window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    let branches = initBranches();
    let activities = loadActivities();
    requireLogin(async d => {
        if (d.level > 2) {
            loadProfile(d)
            await branches
            await activities
            if (activityId) {
                $("#activities").val(activityId).change()
            }
        } else {
            window.location = "/403.html";
        }
    });
};

async function initBranches() {
    return fetch("/api/branch/getActive.php").then((res) => res.json()).then((branches) => {
        branches.forEach(b => $('#branches').append(`<option value="${b.id}">${b.name}</option>`))
    });
}

async function loadActivities() {
    return fetch("/api/activity/getAllActivities.php").then(d => d.json()).then(d => {
        d.forEach(a => $('#activities').append(`<option value="${a.id}">${a.name}</option>`))
    })
}

function retrieveActivity() {
    let id = $("#activities").val(), branch = $("#branches").val()
    $("#export-button").prop('disabled', true);
    $("#overview-table tbody").empty();
    $(".additional").remove();
    if (id === "0") return
    $("#overview-loader").show()
    $("#checks input[type=checkbox]").prop('checked', false);
    tokenized(`/api/activity/getActivityOverview.php?id=${id}&branch=${branch}`).then(result => {
        result.registrations.forEach((s, i) => {
            $('#overview-table tbody').append(
                `<tr>
                    <td>${i + 1}</td>
                    <td>${s.user.first_name}</td>
                    <td>${s.user.name}</td>
                    <td class="address-column hidden">${s.user.address.straat} ${s.user.address.nummer}${ifNotNull(s.user.address.bus)}, ${s.user.address.postcode} ${s.user.address.gemeente}</td>
                    <td class="branch-column hidden">${s.user.branch.name}</td>
                    <td class="from-column hidden">${printDate(s.start)}</td>
                    <td class="until-column hidden">${printDate(s.end)}</td>
                    <td class="price-column hidden">€ ${s.price}</td>
                    <td class="present-column hidden"><input id="${s.user.id}-present" type="checkbox" onclick="markPresent(this.checked, '${result.activity.id}', '${s.user.id}')" ${s.present === "1" ? "checked" : ""}></td>
                    ${parseAdditionalData(s.additional_data)}
                </tr>`
            )
        })
        if (result.registrations.length !== 0) {
            let data = result.registrations[0].additional_data;
            if (data) {
                Object.keys(JSON.parse(data)).forEach(d => {
                    $('#overview-table thead tr').append(`<th class="additional ${d}-column hidden">${capitalize(d)}</th>`)
                    $("#checks").append(`
                        <div class="additional">
                            <input type="checkbox" id="${d}-column" onclick="toggleVisible(this)">
                            <label for="${d}-column">${capitalize(d)}</label>
                        </div>
                    `)
                    let sum = sumTableValues(`${d}-column`)
                    $('#overview-table tfoot tr').append(`<th class="additional ${d}-column hidden">${sum !== -1 ? sum : ""}</th>`)
                })
            }
            let sum = sumTableValues("price-column")
            $("#price-total").html(`€ ${sum}`)
        }
        $("#overview-loader").hide()
        $("#export-button").prop('disabled', false);
    })
}

function printDate(date) {
    return new Date(Date.parse(date)).toLocaleDateString('nl-BE', { year: '2-digit', month: '2-digit', day: '2-digit' });
}

function markPresent(present, activityId, memberId) {
    tokenized(`/api/activity/markPresent.php?activityId=${activityId}&memberId=${memberId}&present=${present}`).then(result => {
        if (result.error) {
            alert(result.error)
            $(`#${memberId}-present`).prop('checked', !present);
        }
    })
}

function toggleVisible(cb) {
    $(`.${cb.id}`).toggle()
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