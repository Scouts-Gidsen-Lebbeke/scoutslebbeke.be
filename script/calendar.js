loadCalendar()

function loadCalendar() {
    fetch("/api/getCalendars.php").then((res) => res.json()).then((data) => {
        Object.values(data).forEach((n, index) => {
            let calendarGroup = ""
            Object.values(n).forEach((c) => {
                let scrollTo = new Date(Date.parse(c['toDate'])).setUTCHours(23, 59, 59, 999) < Date.now() ? "hidden" : ""
                calendarGroup +=
                    `<div class='calendar-item ${scrollTo}' id='calendar-item-${c['id']}'>
                        ${c['image'] ? `<img class='calendar-item-image' src='/uploads/calendar/${c['period']}/${index + 1}/${c['image']}' alt='${c['image']}'>` : '' }
                        <div class='calendar-item-content'>
                            <h2 class='calendar-item-title'>${periodToTitle(c['fromDate'], c['toDate'])} > ${c['title']}</h2>
                            <p class='calendar-item-description'>${c['content']}</p>
                        </div>
                    </div>`
            })
            $("#calendars").append(`<div class='calendar-group' id='calendar-group-${index + 1}'>${calendarGroup}</div>`);
            showCalendar(1)
        });
    });
}

function periodToTitle(from, to) {
    if (from === to) {
        return capitalize(parseDateString(from))
    }
    return capitalize(`${parseDateString(from)} - ${parseDateString(to)}`)
}

function parseDateString(s) {
    return new Date(Date.parse(s)).toLocaleDateString('nl-BE',{ weekday: 'long', month: 'numeric', day: 'numeric' })
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function edit(item) {
    $("#modal-label").text(`Bewerk item ${item['id']} (periode ${item['period']}, groep ${item['group']})`)
    $("#calendar-item-edit-from").val(item['fromDate'])
    $("#calendar-item-edit-to").val(item['toDate'])
    $("#calendar-item-edit-title").val(item['title'])
    $("#calendar-item-edit-content").val(item['content'])
    let image = item['image'] ? `/uploads/calendar/${item['period']}/${item['group']}/${item['image']}` : '/images/no-image.png'
    $("#calendar-item-edit-image").attr("src",image);
    $('#trigger-modal').click()
}

function showCalendar(i) {
    $('.calendar-group').hide()
    $(`#calendar-group-${i}`).show()
}