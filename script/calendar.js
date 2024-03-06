window.onload = function() {
    loadGlobal();
    checkLogin(loadProfile);
    initCalendars()
};

function initCalendars() {
    fetch("/api/getCalendarBranches.php").then((res) => res.json()).then((data) => {
        let branchButtons = ""
        data.forEach(branch => {
            branchButtons += `<button type="button" class="branch-button" onClick="loadCalendar(${branch.id})">${branch.name}</button>`
        })
        $("#calendar-branches").html(branchButtons);
    });
}

function loadCalendar(branch) {
    $("#calendars").html(`<div class="loader"></div>`)
    fetch("/api/getCalendars.php?branch=" + branch).then((res) => res.json()).then((data) => {
        if (!data) {
            $("#calendars").html("");
            return;
        }
        let calendarGroup = ""
        data['items'].forEach(item => {
            let from = new Date(Date.parse(item['fromDate']));
            let to = new Date(Date.parse(item['toDate']));
            calendarGroup +=
                `<div class="calendar-item ${from < new Date() ? 'hidden' : ''}">
                    ${item['image'] ? `<img class="calendar-item-image" src="/uploads/calendar/${item['image']}" alt="${item['image']}">` : ''}
                    <div class="calendar-item-content">
                        <h2 class="calendar-item-title">${item['title']}</h2>
                        <span class="calendar-item-details">
                            <img src="images/calendar.png" class="span-icon" alt="calendar">
                            ${periodToTitle(from, to)}
                            <img src="images/marker.png" class="span-icon calendar-marker" alt="marker">
                            ${locationToTitle(item.location, false)}
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