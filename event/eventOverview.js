window.onload = function() {
    loadGlobal();
    const params = (new URL(document.location)).searchParams;
    const eventId = params.get('id')
    let events = loadEvents();
    requireLogin(async d => {
        if (d.level > 2) {
            loadProfile(d)
            await events
            if (eventId) {
                $("#events").val(eventId).change()
            }
        } else {
            window.location = "/403.html";
        }
    });
};

async function loadEvents() {
    return fetch("/api/event/getAllEvents.php").then(d => d.json()).then(d => {
        d.forEach(a => $('#events').append(`<option value="${a.id}">${a.name}</option>`))
    })
}

function retrieveEvent(id) {
    $("#export-button").prop('disabled', true);
    $("#overview-table tbody").empty();
    $(".additional").remove();
    if (id === "0") return
    $("#overview-loader").show()
    tokenized(`/api/event/getEventOverview.php?id=${id}`).then(result => {
        result.forEach((r, i) => {
            $('#overview-table tbody').append(
                `<tr>
                    <td>${i + 1}</td>
                    <td>${r.first_name}</td>
                    <td>${r.last_name}</td>
                    <td class="price-column">€ ${r.price}</td>
                    ${parseAdditionalData(r.additional_data)}
                </tr>`
            )
        })
        if (result.length !== 0) {
            let data = result[0].additional_data;
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