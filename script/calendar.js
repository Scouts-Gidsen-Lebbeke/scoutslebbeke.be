initCalendars()

function initCalendars() {
    fetch("/api/getCalendarBranches.php").then((res) => res.json()).then((data) => {
        let branchButtons = ""
        data.forEach(branch => {
            branchButtons += `<button type="button" class="btn btn-secondary" onClick="loadCalendar(${branch.id})">${branch.name}</button>`
        })
        $("#calendar-branches").html(branchButtons);
    });
}

function loadCalendar(branch) {
    $("#calendars").html(`<div class="loader"></div>`)
    fetch("/api/getCalendars.php?branch=" + branch).then((res) => res.json()).then((data) => {
        let calendarGroup = ""
        data['items'].forEach(item => {
            let from = new Date(Date.parse(item['fromDate']));
            let to = new Date(Date.parse(item['toDate']));
            let location = ifNotNull(item['location'], "Scoutsterrein");
            calendarGroup +=
                `<div class="calendar-item ${from < new Date() ? 'hidden' : ''}">
                    ${item['image'] ? `<img class="calendar-item-image" src="/uploads/calendar/${item['image']}" alt="${item['image']}">` : ''}
                    <div class="calendar-item-content">
                        <h2 class="calendar-item-title">${item['title']}</h2>
                        <span class="calendar-item-details">
                            <img src="images/calendar.png" class="span-icon" alt="calendar">
                            ${periodToTitle(from, to)}
                            <img src="images/marker.png" class="span-icon calendar-marker" alt="marker">
                            ${location}
                        </span>
                        <p class="calendar-item-description">${item['content']}</p>
                    </div>
                </div>`
        });
        $("#calendars").html(
            `<div class="calendar" id="calendar-${data['id']}">
                <div class="calendar-intro">${ifNotNull(data['intro'])}</div>
                <div class="calendar-group">${calendarGroup}</div>
                <div class="calendar-outro">${ifNotNull(data['outro'])}</div>
            </div>`
        )
    });
}

function periodToTitle(from, to) {
    if (from.getDate() === to.getDate()) {
        return capitalize(`${printDate(from)}, ${printTime(from)} - ${printTime(to)}`)
    }
    return capitalize(`${printDate(from)}, ${printTime(from)} - ${printDate(to)}, ${printTime(to)}`)
}

function printDate(date) {
    return date.toLocaleDateString('nl-BE', { weekday: 'short', month: 'numeric', day: 'numeric' })
}

function printTime(date) {
    return date.toLocaleTimeString('nl-BE', { hour: '2-digit', minute:'2-digit' })
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function ifNotNull(i, orElse = "") {
    return i == null ? orElse : i;
}