let currentIndex = 0, kc, intervalID, backgrounds = [];

window.onload = function() {
    kc = new Keycloak("/script/keycloak.json")
    //kc.init({
    //    onLoad: 'check-sso',
    //    silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    //})
    const params = (new URL(document.location)).searchParams;
    const q = params.get('q');
    params.delete('q')
    if (q) {
        window.history.replaceState(null, "", "/");
    }
    load(q ? q : history.state ? history.state.content : 'nieuwtjes', params.toString());
    getImages();
    fetch("/api/getNavigation.php").then((res) => res.json()).then((data) => {
        $('#navigation').html(getBrowserNav(data));
        $("#mobile-navigation").html(getMobileNav(data));
    });
    $('#current-year').text(new Date().getFullYear())
};

window.onpopstate = function() {
    $('#content').load('/pages/' + history.state.content + '.html?q=' + new Date().getTime() + history.state.params);
}

function load(page, rest = "") {
    let urlRest = rest
    let loadRest = rest
    if (rest.length !== 0) {
        urlRest = "?" + urlRest
        loadRest = "&" + loadRest
    }
    history.pushState({content: page, params: loadRest}, "", "/" + urlRest);
    $('#content').load('/pages/' + page + '.html?q=' + new Date().getTime() + loadRest);
    closeNav()
}

function getImages() {
    fetch(new Request('/api/getBackgrounds.php')).then(response => response.json()).then(data => {
        backgrounds = Object.values(data);
        backgrounds.forEach(url => {
            const img = new Image();
            img.src = "/background/" + url;
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
    $("#title-wrapper").css("background-image", "url(/background/" + backgrounds[currentIndex] + ")");
}

function getStaffHead() {
    fetch("/api/getStaffHead.php").then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            $("#staff").append(`
                <div class='staff-item'>
                    <img src='/images/profile/${item["Foto"]}' alt='groepsleiding' class='staffPicture'/><br>
                    <b>Naam:</b> ${item["Voornaam"]} ${item["Achternaam"]}<br>
                    <b>Totem:</b> ${item["Totem"]}<br>
                    <b>Gsm:</b> ${formatGsm(item["Gsm"])}<br>
                    <b>Email:</b> groepsleiding@scoutslebbeke.be<br>
                </div>`
            );
        });
    });
}

function getStaff(tak) {
    fetch("/api/getStaff.php?q=" + tak).then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            let bijnaam = "";
            if (tak === 'Kapoenenleiding' || (tak === 'Stam' && item['kapoenenbijnaam'])) {
                bijnaam += ' &bull; ' + item['kapoenenbijnaam'];
            }
            if (tak === 'Welpenleiding' || (tak === 'Stam' && item['welpenbijnaam'])) {
                bijnaam += ' &bull; ' + item['welpenbijnaam'];
            }
            const takleiding = item['Takleiding'] === '1' ? " (takleiding)" : '';
            $("#staff").append(
                `<div class='staff-item'>
                    <img src='/images/profile/${item["Foto"]}' alt='${tak}' class='staffPicture'/><br>
                    <b>Naam:</b> ${item["Voornaam"]} ${item["Achternaam"]}${bijnaam}${takleiding}<br>
                    <b>Totem:</b> ${item["Totem"] ? item["Totem"] : "(geen)"}<br>
                    ${takleiding ? "<b>Gsm:</b> " + formatGsm(item["Gsm"]) + "<br><b>E-mail:</b> " + item["Email"] + "<br>" : ""}
                </div>`
            );
        });
    });
}

function getStam() {
    fetch("/api/getStaff.php?q=Stam").then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            $("#oldstaff").append(
                `<tr>
                    <td>${item["Voornaam"]} ${item["Achternaam"]}</td>
                    <td>${item["Totem"] ? item["Totem"] : "(geen)"}</td>
                </tr>`
            );
        });
    });
}

function getNews() {
    fetch("/api/getNews.php").then((res) => res.json()).then((data) => {
        Object.values(data).forEach((n) => {
            $("#news-items").append(
                `<div class='news-item'>
                    <img class='news-item-image' src='/uploads/${n['image']}' alt='${n['image']}'>
                    <div class='news-item-content'>
                        <h2 class='news-item-title'>${n['title']}</h2>
                        <p class='news-item-info'>${parseDateString(n['date'])}, door ${n['first_name']} ${n['name']}</p>
                        <p class='news-item-description'>${n['content']}</p>
                    </div>
                </div>`
            );
        });
    });
}

function parseDateString(s) {
    return new Date(Date.parse(s)).toLocaleDateString('nl-BE',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatGsm(str) {
    if (str === null) {
        return '-';
    }
    return str.substring(0, 4) + '/' + str.substring(4, 6) + '.' + str.substring(6, 8) + '.' + str.substring(8);
}

function getContact() {
    fetch("/api/getContact.php").then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            $("#grlnumbers").append(formatGsm(item["Gsm"]) + " (" + item["Voornaam"] + " " + item["Achternaam"] + ")<br>");
        });
    });
}

// noinspection JSUnusedGlobalSymbols (Google API dependency)
function initMap() {
    let address = {lat: 50.9841, lng: 4.144500};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: address
    });
    new google.maps.Marker({position: address, map: map});
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

function getBrowserNav(data) {
    let result = [], menuitem;
    Object.keys(data).forEach((item) => {
        menuitem = "";
        if (data[item].length === 1 && item === data[item][0].name) {
            menuitem += "<div class='navigation-item' onclick=\"load('" + data[item][0].path + "');\">" + item + "</div>";
        } else {
            menuitem += "<div class='dropdown-block'><div class=\"navigation-item\">" + item + " <i class=\"down\"></i></div><div class=\"dropdown\">";
            data[item].forEach((page) => {
                menuitem += "<div class='dropdown-item' onclick=\"load('" + page.path + "')\">" + page.name + "</div>";
            });
            menuitem += "</div></div>";
        }
        result.push(menuitem);
    });
    return result.join("");
}

function getMobileNav(data) {
    let subitems = '', result = '';
    Object.keys(data).forEach((item) => {
        if (data[item].length === 1 && item === data[item][0].name) {
            subitems += "<a onclick=\"load('" + data[item][0].path + "')\">" + item + "</a>";
        } else {
            subitems += "<a onclick=\"toggleSub('" + item + "')\">" + item + "</a>";
            result += "<div class='mobile-menu' id='" + item + "-mobile-menu'>";
            data[item].forEach((page) => {
                result += "<a onclick=\"load('" + page.path + "')\">" + page.name + "</a>";
            });
            result += "<a onclick=\"toggleSub('" + item + "')\">←</a></div>"
        }
    });
    return "<div class='mobile-menu' id='main-mobile-menu'>" + subitems + "</div>" + result;
}

function getSetting(settingId, settingSpanId) {
    fetch("/api/getSetting.php?q=" + settingId).then(res => res.json()).then(data => {
        $('#' + settingSpanId).html(data["setting_value"]);
    });
}

function getUniformStaff() {
    fetch("/api/getUniformStaff.php").then(res => res.json()).then(data => {
        let result = data ? data.join(", ") : "iemand van de leiding";
        const i = result.lastIndexOf(",")
        result = result.substring(0, i) + " of" + result.substring(i + 1);
        $('#uniform-staff').html(result);
    });
}

function mailto(location) {
    switch (location) {
        case "webmaster":
            window.location.href = atob("bWFpbHRvOndlYm1hc3RlckBzY291dHNsZWJiZWtlLmJl")
            break
        case "info":
            window.location.href = atob("bWFpbHRvOmluZm9Ac2NvdXRzbGViYmVrZS5iZQ==")
            break
        case "60":
            window.location.href = atob("bWFpbHRvOjYwamFhckBzY291dHNsZWJiZWtlLmJl")
            break
        case "vzw":
            window.location.href = atob("bWFpbHRvOnZ6d0BzY291dHNsZWJiZWtlLmJl")
            break
    }
}

function downloadPdf() {
    var element = document.getElementById('content');
    var opt = {
        margin:       1,
        filename:     'myfile.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

function tokenized(url) {
    return fetch(url, {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` })
    })
}

function noCors(url) {
    return fetch(url, {
        mode: 'no-cors',
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` })
    })
}