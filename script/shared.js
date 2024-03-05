let currentIndex = 0, intervalID, backgrounds = [], kc;

function loadGlobal() {
    getImages();
    fetch("/api/getNavigation.php").then((res) => res.json()).then((data) => {
        $('#navigation').html(getBrowserNav(data));
        $("#mobile-navigation").html(getMobileNav(data));
    });
    $('#current-year').text(new Date().getFullYear())
}

function load(page) {
    window.location = page.includes(".html") ? page : `/${page}.html`;
}

function getImages() {
    fetch(new Request('/api/getBackgrounds.php')).then(response => response.json()).then(data => {
        backgrounds = Object.values(data);
        backgrounds.forEach(url => {
            const img = new Image();
            img.src = url;
        })
        resetAndChangeImage()
    })
}

function resetAndChangeImage() {
    clearInterval(intervalID);
    changeImage()
    intervalID = setInterval(changeImage, 5000);
}

function changeImage() {
    currentIndex = (currentIndex + 1) % backgrounds.length
    $("#title-wrapper").css("background-image", "url(" + backgrounds[currentIndex] + ")");
}

function toggleNav() {
    let mobileNav = $("#mobile-navigation")
    mobileNav.toggle()
    $("body").css({"overflow": mobileNav.is(":visible") ? "hidden" : "visible"})
}

function closeNav() {
    let mobileNav = $("#mobile-navigation")
    if (mobileNav.is(":visible")) {
        mobileNav.hide()
        $("body").css({"overflow": "visible"})
        $('.burger').toggleClass('opened')
    }
}

function toggleSub(sub) {
    $('#' + sub + '-mobile-menu').toggle()
    $("#main-mobile-menu").toggle()
}

function getBrowserNav(groups) {
    let result = [], menuitem;
    groups.forEach((group) => {
        menuitem = "";
        if (group.items.length === 1 && group.items[0].name === group.name) {
            menuitem += "<div class='navigation-item' onclick=\"load('" + group.items[0].path + "');\">" + group.name + "</div>";
        } else if (group.items.length > 0) {
            menuitem += "<div class='dropdown-block'><div class=\"navigation-item\">" + group.name + " <i class=\"down\"></i></div><div class=\"dropdown\">";
            group.items.forEach((item) => {
                menuitem += "<div class='dropdown-item' onclick=\"load('" + item.path + "')\">" + item.name + "</div>";
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
            subitems += `<a onclick="load('${group.items[0].path}')\">${group.name}</a>`;
        } else if (group.items.length > 0) {
            subitems += `<a onclick="toggleSub('${group.id}')">${group.name}</a>`;
            result += `<div class='mobile-menu' id='${group.id}-mobile-menu'>`;
            group.items.forEach((item) => {
                result += `<a onclick="load('${item.path}')">${item.name}</a>`;
            });
            result += `<a onclick="toggleSub('${group.id}')">←</a></div>`
        }
    });
    return `<div class='mobile-menu' id='main-mobile-menu'>${subitems}</div>${result}`;
}

function mailto(location) {
    switch (location) {
        case "webmaster":
            window.location.href = atob("bWFpbHRvOndlYm1hc3RlckBzY291dHNsZWJiZWtlLmJl")
            break
        case "info":
            window.location.href = atob("bWFpbHRvOmluZm9Ac2NvdXRzbGViYmVrZS5iZQ==")
            break
        case "vzw":
            window.location.href = atob("bWFpbHRvOnZ6d0BzY291dHNsZWJiZWtlLmJl")
            break
    }
}

async function tokenized(url) {
    await kc.updateToken(30)
    if (kc.token) {
        return fetch(url, {
            headers: new Headers({ 'Authorization': `Bearer ${kc.token}` })
        }).then(data => data.json())
    }
    return null
}

function toggleLogin() {
    kc.login({ redirectUri: document.location })
}

async function loadKeycloak() {
    kc = new Keycloak("/script/keycloak.json")
    return kc.init({
        onLoad: 'check-sso',
        silentCheckSsoFallback: false,
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    });
}

async function checkLogin(onFulfilled) {
    const authenticated = await loadKeycloak();
    if (authenticated) {
        tokenized("/api/getLogin.php").then(onFulfilled)
    }
}

function loadProfile(d) {
    $('#profile-name').text(d.first_name)
    $('#profile-pic').css("background-image", "url(/images/profile/" + d.image + ")")
    $("#profile-dropdown-block").click(function(){
        window.location = "/profile.html"
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
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function ifNotNull(i, orElse = "") {
    return i == null ? orElse : i;
}