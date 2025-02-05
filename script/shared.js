let currentIndex = 0, intervalID, backgrounds = [], kc;

function loadGlobal() {
    getImages();
    const branchUrl = phpServer ? "/branch/getActive.php" : "/branches"
    fetch(`${baseApiUrl}${branchUrl}`).then((res) => res.json()).then(branches => {
        if (branches.length > 0) {
            $("#branch-menu").css("display", "inline-block");
            $("#main-branch-menu").toggle();
            Object.values(branches).forEach(b => {
                $("#branch-menu .dropdown").append(`<div class="dropdown-item" onclick="load('branch/branch.html?id=${b.id}')">${b.name}</div>`)
                $("#branch-mobile-menu").append(`<a onclick="load('branch/branch.html?id=${b.id}')">${b.name}</div>`)
            })
        }
    });
    const activityUrl = phpServer ? "/activity/getActive.php" : "/activities/visible"
    fetch(`${baseApiUrl}${activityUrl}`).then((res) => res.json()).then(activities => {
        if (activities.length > 0) {
            $("#activity-menu").css("display", "inline-block");
            $("#main-activity-menu").toggle();
            Object.values(activities).forEach(a => {
                $("#activity-menu .dropdown").append(`<div class="dropdown-item" onclick="load('activity/activity.html?id=${a.id}')">${a.name}</div>`)
                $("#activity-mobile-menu").append(`<a onclick="load('activity/activity.html?id=${a.id}')">${a.name}</div>`)
            })
        }
    });
    const eventUrl = phpServer ? "/event/getActive.php" : "/events/visible"
    fetch(`${baseApiUrl}${eventUrl}`).then((res) => res.json()).then(events => {
        if (events.length > 0) {
            $("#event-menu").css("display", "inline-block");
            $("#main-event-menu").toggle();
            Object.values(events).forEach(e => {
                $("#event-menu .dropdown").append(`<div class="dropdown-item" onclick="load('event/event.html?id=${e.id}')">${e.name}</div>`)
                $("#event-mobile-menu").append(`<a onclick="load('event/event.html?id=${e.id}')">${e.name}</div>`)
            })
        }
    });
    $("#current-year").text(new Date().getFullYear());
    const orgUrl = phpServer ? "/organization/getOrganization.php" : "/organizations/owner"
    fetch(`${baseApiUrl}${orgUrl}`).then((res) => res.json()).then(org => {
        $(".organization-name").html(org.name);
        document.title = org.name;
        $(".organization-address").html(`${org.address.street} ${org.address.number}${ifNotNull(org.address.subPremise)}<br/>${org.address.zipcode} ${org.address.town}`);
        $(".organization-address-nowrap").html(`${org.address.street} ${org.address.number}${ifNotNull(org.address.subPremise)}, ${org.address.zipcode} ${org.address.town}`);
        org.contactMethods.forEach(c => $(".organization-contacts").append(translateType(c)));
        $("#organization-description").html(org.description);
        $('#min-year').text(new Date().getFullYear() - (new Date().getMonth() > 6 ? 6 : 7))
    });
}

function translateType(contact) {
    switch (contact.type) {
        case "WHATSAPP": return `<a href="${contact.value}" target="_blank"><img class="link-icon" src="/images/whatsapp.png" alt="WhatsApp"></a>`
        case "MOBILE": return `<a href="callto:${contact.value}"><img class="link-icon" src="/images/phone.png" alt="mobile"></a>`
        case "EMAIL": return `<a href="mailto:${contact.value}"><img class="link-icon" src="/images/email.ico" alt="e-mail"></a>`
        case "FACEBOOK": return `<a href="${contact.value}" target="_blank"><img class="link-icon" src="/images/facebook.png" alt="Facebook"></a>`
        case "INSTAGRAM": return `<a href="${contact.value}" target="_blank"><img class="link-icon" src="/images/instagram.png" alt="Instagram"></a>`
    }
}

function load(page) {
    window.location = page.includes(".html") ? `/${page}` : `/${page}.html`;
}

function getImages() {
    fetch(`/api/backgrounds.json`).then(response => response.json()).then(data => {
        backgrounds = Object.values(data);
        backgrounds.forEach(url => {
            const img = new Image();
            img.src = "/images/background/" + url;
        })
        resetAndChangeImage();
    })
}

function resetAndChangeImage() {
    clearInterval(intervalID);
    changeImage();
    intervalID = setInterval(changeImage, 5000);
}

function changeImage() {
    currentIndex = (currentIndex + 1) % backgrounds.length;
    $("#title-wrapper").css("background-image", `url(/images/background/${backgrounds[currentIndex]})`);
}

function toggleNav() {
    $("#mobile-profile").hide();
    let mobileNav = $("#mobile-navigation");
    mobileNav.toggle();
    $("body").css({"overflow": mobileNav.is(":visible") ? "hidden" : "visible"});
}

function toggleProfile() {
    $("#mobile-navigation").hide();
    $(".burger").removeClass("opened")
    let profileNav = $("#mobile-profile");
    profileNav.toggle();
    $("body").css({"overflow": profileNav.is(":visible") ? "hidden" : "visible"});
}

function toggleSub(sub) {
    $(`#${sub}-mobile-menu`).toggle();
    $("#main-mobile-menu").toggle();
}

function mailto(location) {
    switch (location) {
        case "webmaster":
            window.location.href = atob("bWFpbHRvOndlYm1hc3RlckBzY291dHNsZWJiZWtlLmJl");
            break;
        case "vzw":
            window.location.href = atob("bWFpbHRvOnZ6d0BzY291dHNsZWJiZWtlLmJl");
            break;
    }
}

async function tokenized(url, optional = false, abort = null, method = "GET") {
    if (!kc.token && optional) {
        if (abort) {
            return fetch(baseApiUrl + url, {
                signal: abort.signal,
                method: method
            }).then(data => data.json());
        } else {
            return fetch(baseApiUrl + url, {
                method: method
            }).then(data => data.json());
        }
    }
    await kc.updateToken(30);
    if (kc.token) {
        if (abort) {
            return fetch(baseApiUrl + url, {
                headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
                signal: abort.signal,
                method: method
            }).then(data => data.json());
        } else {
            return fetch(baseApiUrl + url, {
                headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
                method: method
            }).then(data => data.json());
        }
    }
    if (optional) {
        if (abort) {
            return fetch(baseApiUrl + url, {
                signal: abort.signal,
                method: method
            }).then(data => data.json());
        } else {
            return fetch(baseApiUrl + url, {
                method: method
            }).then(data => data.json());
        }
    }
    return null;
}

function postForm(path, formId, method = "POST") {
    const form = new FormData(document.querySelector(`#${formId}`));
    return fetch(baseApiUrl + path, {
        headers: new Headers({
            'Authorization': `Bearer ${kc.token}`
        }),
        method: method,
        body: form
    }).then(response => response.json())
}

function toggleLogin() {
    kc.login({ redirectUri: document.location });
}

function toggleLogout() {
    const newPage = document.location.href.includes("profile") || document.location.href.includes("admin")
    kc.logout({ redirectUri: newPage ? window.location.origin : document.location })
}

async function loadKeycloak() {
    kc = new Keycloak("/script/keycloak.json");
    return kc.init({
        onLoad: 'check-sso',
        silentCheckSsoFallback: false,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    });
}

async function checkLogin(onFulfilled) {
    const authenticated = await loadKeycloak();
    if (authenticated) {
        const url = phpServer ? "/getLogin.php" : "/users/profile";
        tokenized(url).then(onFulfilled);
    }
}

async function requireLogin(onFulfilled) {
    const authenticated = await loadKeycloak();
    if (authenticated) {
        const url = phpServer ? "/getLogin.php" : "/users/profile";
        tokenized(url).then(onFulfilled);
    } else {
        toggleLogin();
    }
}

function loadProfile(d) {
    $("#profile-name").text(d.firstName);
    $("#profile-pic").css("background-image", `url(/images/profile/${d.image ? d.image : 'default.png'})`);
    $(".login-item").remove()
    $("#profile-dropdown").append(`<div class="dropdown-item" onclick="load('profile/profile.html')">Profiel</div>`)
    $("#mobile-profile").append(`<a onclick="load('profile/profile.html')">Profiel</a>`)
    $("#profile-dropdown").append(`<div class="dropdown-item" onclick="load('profile/membership.html')">Mijn lidmaatschap</div>`)
    $("#mobile-profile").append(`<a onclick="load('profile/membership.html')">Mijn lidmaatschap</a>`)
    $("#profile-dropdown").append(`<div class="dropdown-item" onclick="load('profile/activities.html')">Mijn activiteiten</div>`)
    $("#mobile-profile").append(`<a onclick="load('profile/activities.html')">Mijn activiteiten</a>`)
    if (isStaff(d)) {
        $("#profile-dropdown").append(`<div class="dropdown-item" onclick="load('staff/members.html')">Mijn leden</div>`)
        $("#mobile-profile").append(`<a onclick="load('staff/members.html')">Mijn leden</a>`)
    }
    if (isAdmin(d)) {
        $("#profile-dropdown").append(`<div class="dropdown-item" onclick="load('admin/member.html')">Ledenbeheer</div>`)
        $("#mobile-profile").append(`<a onclick="load('admin/member.html')">Ledenbeheer</a>`)
        $("#profile-dropdown").append(`<div class="dropdown-item" onclick="load('admin/activity.html')">Activiteitenbeheer</div>`)
        $("#mobile-profile").append(`<a onclick="load('admin/activity.html')">Activiteitenbeheer</a>`)
        $("#profile-dropdown").append(`<div class="dropdown-item" onclick="load('admin/event.html')">Evenementenbeheer</div>`)
        $("#mobile-profile").append(`<a onclick="load('admin/event.html')">Evenementenbeheer</a>`)
        $("#profile-dropdown").append(`<div class="dropdown-item" onclick="load('admin/organisation.html')">Organisatiebeheer</div>`)
        $("#mobile-profile").append(`<a onclick="load('admin/organisation.html')">Organisatiebeheer</a>`)
        $("#profile-dropdown").append(`<div class="dropdown-item" onclick="load('admin/admin.html')">Sitebeheer</div>`)
        $("#mobile-profile").append(`<a onclick="load('admin/admin.html')">Sitebeheer</a>`)
    }
    $("#profile-dropdown").append(`<div class="dropdown-item" onclick="toggleLogout()">Log uit</div>`)
    $("#mobile-profile").append(`<a onclick="toggleLogout()">Log uit</a>`)
}

function isAdmin(d) {
    return d.level === "ADMIN" || d.level === 4
}

function guardAdmin(d) {
    if (!isAdmin(d)) {
        window.location = "/403.html";
    }
}

function isStaff(d) {
    return isAdmin(d) || d.level === "STAFF" || d.level === 3
}

function guardStaff(d) {
    if (!isStaff(d)) {
        window.location = "/403.html";
    }
}

function periodToTitle(from, to) {
    if (from.getDate() === to.getDate()) {
        return capitalize(`${printDate(from)}, ${printTime(from)} - ${printTime(to)}`);
    }
    return capitalize(`${printDate(from)}, ${printTime(from)} - ${printDate(to)}, ${printTime(to)}`);
}

function printDate(date) {
    return date.toLocaleDateString('nl-BE', { weekday: 'short', month: 'numeric', day: 'numeric' });
}

function printTime(date) {
    return date.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit' });
}

function printY(dateString) {
    const date = new Date(Date.parse(dateString))
    return date.toLocaleDateString('nl-BE', { year: 'numeric' });
}

function locationToTitle(location, full) {
    if (location == null) {
        return "Scoutsterrein";
    }
    let title
    let address = printAddress(location)
    if (location.name && full) {
        title = `${location.name} (${address})`;
    } else if (location.name) {
        title = location.name;
    } else {
        title = address;
    }
    if (location.url != null) {
        return `<a href="${location.url}" target="_blank">${title}</a>`;
    }
    return title;
}

function printAddress(address) {
    return `${address.street} ${address.number}${ifNotNull(address.addition)}, ${address.zip} ${address.town}${address.country !== "BE" ? ` (${address.country})` : ""}`
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function ifNotNull(i, orElse = "") {
    return i == null ? orElse : i;
}

function ifNotNullOrEmpty(i, orElse = "") {
    return (i == null || i === "") ? orElse : i;
}

function printDeadline(dateString) {
    let date = new Date(Date.parse(dateString));
    return date.toLocaleDateString('nl-BE', { weekday: 'long', month: 'numeric', day: 'numeric' })
}

function sanitizeData(data) {
    let obj = Object.fromEntries(data)
    for(const prop in obj){
        if(obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])){
            obj[prop] = +obj[prop];
        }
    }
    return JSON.parse(JSON.stringify(obj));
}

function parseAdditionalData(data) {
    if (!data) {
        return "";
    }
    let jsonData = JSON.parse(data);
    return Object.keys(jsonData).map(key => `<td class="hidden ${key}-column">${jsonData[key]}</td>`).join("")
}


function exportTableToExcel(tableID, filename = 'output.xlsx'){
    let tableSelect = document.getElementById(tableID);
    let rows = tableSelect.rows;
    let exportData = [];
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].cells;
        for (let j = 0; j < cols.length; j++) {
            if (window.getComputedStyle(cols[j]).display !== 'none') {
                row.push(cols[j].innerText);
            }
        }
        exportData.push(row);
    }
    let worksheet = XLSX.utils.aoa_to_sheet(exportData);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    let excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    let blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    let downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename ? filename : 'excel_data.xlsx';
    downloadLink.click();
}

function sortTable(tableID, n) {
    const table = document.getElementById(tableID);
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);

    let asc = table.rows[0].cells[n].classList.contains('sort-asc');

    // Remove sort classes from all headers
    Array.from(table.rows[0].cells).forEach(header => {
        header.classList.remove('sort-asc', 'sort-desc');
    });

    // Add the appropriate class to the header
    table.rows[0].cells[n].classList.add(asc ? 'sort-desc' : 'sort-asc');

    // Sort rows based on the cell value
    rows.sort((row1, row2) => {
        const cell1 = row1.cells[n].textContent;
        const cell2 = row2.cells[n].textContent;

        if (!isNaN(cell1) && !isNaN(cell2)) {
            return asc ? cell1 - cell2 : cell2 - cell1;
        }

        return asc
            ? cell1.localeCompare(cell2)
            : cell2.localeCompare(cell1);
    });

    // Append the sorted rows to the table body
    rows.forEach(row => tbody.appendChild(row));
}

function filterTable(tableID, input) {
    const filter = input.value.toLowerCase();
    const table = document.getElementById(tableID);
    const rows = table.getElementsByTagName("tr");
    let visibleIndex = 1
    Array.from(rows).forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const cells = row.getElementsByTagName("td");
        const rowText = Array.from(cells).map(cell => cell.textContent.toLowerCase()).join(" ");
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

function showMedicalOverview(userId) {
    window.open(`https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/frontend/lid/individuelesteekkaart/${userId}`, '_blank');
}

function retrieveExtraIcons(user) {
    let result = "";
    if (user.no_picture) {
        result += `<img src="/images/no-camera.png" class="multi-icon" alt="no-picture" title="Deze persoon mag niet gefotografeerd worden!">`;
    }
    if (user.no_painkillers) {
        result += `<img src="/images/no-painkillers.png" class="multi-icon" alt="no-painkillers" title="Deze persoon mag geen pijnstillende en/of koortswerende medicatie krijgen!">`;
    }
    if (user.activity_restriction) {
        result += `<img src="/images/activity-restriction.png" class="multi-icon" alt="activity-restriction" title="Bij deze persoon is extra aandacht nodig bij bepaalde activiteiten!">`;
    }
    if (user.family_remarks) {
        result += `<img src="/images/family.png" class="multi-icon" alt="family" title="${user.family_remarks}">`;
    }
    if (user.food_anomalies) {
        result += `<img src="/images/food-anomalies.png" class="multi-icon" alt="food-anomalies" title="${user.food_anomalies}">`;
    }
    return result;
}

function printDDMMYYYY(date) {
    return date.toLocaleDateString('nl-BE', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

async function initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'));
    autocomplete.setTypes(['address']);
    autocomplete.addListener('place_changed', function() {
        let place = autocomplete.getPlace();
        $("#place_id").val(place["place_id"]);
    });
}