let currentIndex = 0, intervalID, backgrounds = [], kc;

function loadGlobal() {
    getImages();
    fetch("/api/getNavigation.php").then((res) => res.json()).then((data) => {
        $("#navigation").html(getBrowserNav(data));
        $("#mobile-navigation").html(getMobileNav(data));
    });
    $("#current-year").text(new Date().getFullYear());
}

function load(page) {
    window.location = page.includes(".html") ? `/${page}` : `/${page}.html`;
}

function getImages() {
    fetch("/api/getBackgrounds.php").then(response => response.json()).then(data => {
        backgrounds = Object.values(data);
        backgrounds.forEach(url => {
            const img = new Image();
            img.src = url;
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
    $("#title-wrapper").css("background-image", `url(${backgrounds[currentIndex]})`);
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

function getBrowserNav(groups) {
    let result = [], menuitem;
    groups.forEach((group) => {
        menuitem = "";
        if (group.items.length === 1 && group.items[0].name === group.name) {
            menuitem += `<div class="navigation-item" onclick="load('${group.items[0].path}')">${group.name}</div>`;
        } else if (group.items.length > 0) {
            menuitem += `<div class="dropdown-block"><div class="navigation-item">${group.name} <i class="down"></i></div><div class="dropdown">`;
            group.items.forEach((item) => {
                menuitem += `<div class="dropdown-item" onclick="load('${item.path}')">${item.name}</div>`;
            });
            menuitem += "</div></div>";
        }
        result.push(menuitem);
    });
    return result.join("");
}

function getMobileNav(groups) {
    let subitems = '', result = '';
    groups.forEach((group) => {
        if (group.items.length === 1 && group.items[0].name === group.name) {
            subitems += `<a onclick="load('${group.items[0].path}')">${group.name}</a>`;
        } else if (group.items.length > 0) {
            subitems += `<a onclick="toggleSub('${group.id}')">${group.name}</a>`;
            result += `<div class="mobile-menu" id="${group.id}-mobile-menu">`;
            group.items.forEach((item) => {
                result += `<a onclick="load('${item.path}')">${item.name}</a>`;
            });
            result += `<a onclick="toggleSub('${group.id}')">←</a></div>`;
        }
    });
    return `<div class="mobile-menu" id="main-mobile-menu">${subitems}</div>${result}`;
}

function mailto(location) {
    switch (location) {
        case "webmaster":
            window.location.href = atob("bWFpbHRvOndlYm1hc3RlckBzY291dHNsZWJiZWtlLmJl");
            break;
        case "info":
            window.location.href = atob("bWFpbHRvOmluZm9Ac2NvdXRzbGViYmVrZS5iZQ==");
            break;
        case "vzw":
            window.location.href = atob("bWFpbHRvOnZ6d0BzY291dHNsZWJiZWtlLmJl");
            break;
    }
}

async function tokenized(url, optional = false, abort = null) {
    if (!kc.token && optional) {
        if (abort) {
            return fetch(url, { signal: abort.signal }).then(data => data.json());
        } else {
            return fetch(url).then(data => data.json());
        }
    }
    await kc.updateToken(30);
    if (kc.token) {
        if (abort) {
            return fetch(url, {
                headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
                signal: abort.signal
            }).then(data => data.json());
        } else {
            return fetch(url, {
                headers: new Headers({ 'Authorization': `Bearer ${kc.token}` })
            }).then(data => data.json());
        }
    }
    if (optional) {
        if (abort) {
            return fetch(url, { signal: abort.signal }).then(data => data.json());
        } else {
            return fetch(url).then(data => data.json());
        }
    }
    return null;
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
        tokenized("/api/getLogin.php").then(onFulfilled);
    }
}

async function requireLogin(onFulfilled) {
    const authenticated = await loadKeycloak();
    if (authenticated) {
        tokenized("/api/getLogin.php").then(onFulfilled);
    } else {
        toggleLogin();
    }
}

function loadProfile(d) {
    $("#profile-name").text(d.first_name);
    $("#profile-pic").css("background-image", `url(/images/profile/${d.image})`);
    $(".login-item").remove()
    d.pages.forEach(p => {
        $("#profile-dropdown").append(`<div class="dropdown-item" onclick="load('${p.path}')">${p.name}</div>`)
        $("#mobile-profile").append(`<a onclick="load('${p.path}')">${p.name}</a>`)
    })
    $("#profile-dropdown").append(`<div class="dropdown-item" onclick="toggleLogout()">Log uit</div>`)
    $("#mobile-profile").append(`<a onclick="toggleLogout()">Log uit</a>`)
}

function guardAdmin(d) {
    if (d.level < 4) {
        window.location = "/403.html";
    }
}

function guardStaff(d) {
    if (d.level < 3) {
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
    let title = location.name;
    if (full) {
        title = `${title} (${location.address})`;
    }
    if (location.url != null) {
        return `<a href="${location.url}" target="_blank">${title}</a>`;
    }
    return title;
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
        result += `<img src="/images/no-camera.png" class="subscription-icon" alt="no-picture" title="Deze persoon mag niet gefotografeerd worden!">`;
    }
    if (user.no_painkillers) {
        result += `<img src="/images/no-painkillers.png" class="subscription-icon" alt="no-painkillers" title="Deze persoon mag geen pijnstillende en/of koortswerende medicatie krijgen!">`;
    }
    if (user.activity_restriction) {
        result += `<img src="/images/activity-restriction.png" class="subscription-icon" alt="activity-restriction" title="Bij deze persoon is extra aandacht nodig bij bepaalde activiteiten!">`;
    }
    if (user.family_remarks) {
        result += `<img src="/images/family.png" class="subscription-icon" alt="family" title="${user.family_remarks}">`;
    }
    if (user.food_anomalies) {
        result += `<img src="/images/food-anomalies.png" class="subscription-icon" alt="food-anomalies" title="${user.food_anomalies}">`;
    }
    return result;
}

function printDDMMYYYY(date) {
    return date.toLocaleDateString('nl-BE', { year: 'numeric', month: '2-digit', day: '2-digit' });
}