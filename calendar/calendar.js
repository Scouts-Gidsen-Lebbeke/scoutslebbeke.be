window.onload = function() {
    loadGlobal();
    let periods = initPeriods();
    let branches = initBranches();
    checkLogin(async d => {
        loadProfile(d)
        await periods
        await branches
        if (d.staff_branch || d.branch != null) {
            let branch = d.staff_branch ? d.staff_branch : d.branch;
            $("#calendar-branches").val(branch).trigger('change')
        }
        if (d.staff_branch) {
            $(".staff").show()
        }
    });
};

async function initPeriods() {
    return fetch("/api/calendar/getAll.php").then((res) => res.json()).then((periods) => {
        periods.forEach(p => $('#calendar-periods').append(`<option value="${p.id}">${p.name}</option>`))
        let active = periods.find(p => p.active === "1")
        if (active) {
            $("#calendar-periods").val(active.id)
        }
    });
}

async function initBranches() {
    return fetch("/api/branch/getActiveWithRole.php").then((res) => res.json()).then((branches) => {
        branches.forEach(b => $('#calendar-branches').append(`<option value="${b.id}">${b.name}</option>`))
    });
}

function loadCalendar() {
    let periodId = $("#calendar-periods").val();
    if (periodId === "0") {
        $("#calendars").html("Momenteel hebben we geen werking, we zien je graag in september terug!");
        return;
    }
    let branchId = $("#calendar-branches").val();
    if (branchId === "0") {
        $("#calendars").html("Selecteer hierboven een tak om te zien wat we de komende maanden voor jou in petto hebben!");
        return;
    }
    $("#calendars").html(`<div class="loader"></div>`)
    tokenized(`/api/calendar/getByBranch.php?branch=${branchId}&period=${periodId}`, true).then((calendar) => {
        if (!calendar) {
            $("#calendars").html("Er werd geen kalender gevonden voor deze periode!");
            return;
        }
        let calendarGroup = ""
        calendar.items.forEach(item => {
            let from = new Date(Date.parse(item.fromDate));
            let to = new Date(Date.parse(item.toDate));
            calendarGroup +=
                `<div class="calendar-item ${to < new Date() ? 'passed' : ''}" id="calendar-item-${item.id}">
                    ${item.image ? `<img class="calendar-item-image" src="/images/calendar/${item.image}" alt="${item.image}" onclick="editItem(${item.id})">` : ''}
                    <div class="calendar-item-content">
                        <h2 class="calendar-item-title">
                            ${item.title}
                            ${item.editable && item.id != null ? `
                                <img src="/images/edit.png" alt="edit" class="edit-icon" onclick="editItem('${item.id}')" title="Bewerk dit item">
                                <img src="/images/delete.png" alt="delete" class="edit-icon" onclick="deleteItem('${item.id}')" title="Verwijder dit item">
                            ` : item.editable ? `
                                <img src="/images/edit.png" alt="edit" class="edit-icon" onclick="editDefault('${item.calendar_id}', '${item.fromDate}', '${item.toDate}')" title="Bewerk dit item">
                            ` : ''}
                        </h2>
                        <span class="calendar-item-details">
                            <img src="/images/calendar.png" class="span-icon" alt="calendar" title="Wanneer?">
                            ${periodToTitle(from, to)}
                            <img src="/images/marker.png" class="span-icon calendar-marker" alt="marker" title="Waar?">
                            ${locationToTitle(item.location, false)}
                        </span>
                        <p class="calendar-item-description">${item.content}</p>
                    </div>
                </div>`
        });
        $("#calendars").html(`
            <h4>
                ${calendar.period.name}
                ${calendar.editable ? `<img src="/images/add.png" alt="add" class="edit-icon" onclick="addItem('${calendar.id}')" title="Voeg een item toe">` : ''}
            </h4>
            <div class="calendar" id="calendar-${calendar.id}">
                <div class="calendar-intro">${translateInOutro(calendar, 'intro')}</div>
                ${calendarGroup}
                <div class="calendar-outro">${translateInOutro(calendar, 'outro')}</div>
            </div>
        `)
        toggleHidden($("#show-old").is(":checked"))
    });
}

function translateInOutro(calendar, inOut) {
    if (calendar.editable) {
        let value = ifNotNullOrEmpty(calendar[inOut], `Geen ${inOut} opgegeven, klik om te bewerken.`)
        return `<span onClick="editInOutro('${calendar.id}', '${inOut}')" class="intro-outro-placeholder">${value}</span>`
    }
    return ifNotNull(calendar[inOut])
}

function editInOutro(calendarId, inOut) {
    window.location = `/calendar/editCalendar${capitalize(inOut)}.html?id=${calendarId}`;
}

function editItem(itemId) {
    window.location = `/calendar/editCalendarItem.html?id=${itemId}`;
}

function editDefault(calendarId, from, to) {
    window.location = `/calendar/editCalendarItem.html?calendarId=${calendarId}&from=${from}&to=${to}`;
}

function addItem(calendarId) {
    window.location = `/calendar/editCalendarItem.html?calendarId=${calendarId}`;
}

function deleteItem(itemId) {
    if (confirm("Ben je zeker dat je dit item wil verwijderen?")) {
        tokenized(`/api/calendar/deleteItem.php?id=${itemId}`).then(succes => {
            if (succes) {
                $(`#calendar-item-${itemId}`).remove()
            } else {
                alert("Er ging iets mis bij het verwijderen van dit item!")
            }
        })
    }
}

function toggleHidden(show) {
    if (show) {
        $(".passed").show()
    } else {
        $(".passed").hide()
    }
}