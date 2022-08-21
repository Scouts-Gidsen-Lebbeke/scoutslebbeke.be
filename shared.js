let width, currentIndex = 0, intervalID, backgrounds = [];
const BACKGROUND_FADING_LIMIT = 1200;

window.onload = function() {
    const q = (new URL(document.location)).searchParams.get('q');
    if (q) {
        window.history.replaceState(null, "", "/");
    }
    load(q ? q : history.state ? history.state.content : 'nieuwtjes');
    getImages();
    getNavigation();
    $('#curr_year').text(new Date().getFullYear())
};

window.onpopstate = function() {
    $('#content').load('/pages/' + history.state.content + '.html?q=' + new Date().getTime());
}

function load(page) {
    history.pushState({content: page}, "", "/");
    $('#content').load('/pages/' + page + '.html?q=' + new Date().getTime());
    if (width <= BACKGROUND_FADING_LIMIT) {
        closeNav();
    }
}

window.onresize = function () {
    let newWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
    if (width <= BACKGROUND_FADING_LIMIT && newWidth > BACKGROUND_FADING_LIMIT) {
        intervalID = setInterval(changeImage, 5000);
    } else if (width > BACKGROUND_FADING_LIMIT && newWidth <= BACKGROUND_FADING_LIMIT) {
        clearInterval(intervalID);
    }
    width = newWidth;
};

function getImages() {
    fetch(new Request('/api/getBackgrounds.php')).then(response => response.json()).then(data => {
        backgrounds = Object.values(data);
        backgrounds.forEach(url => {
            const img = new Image();
            img.src = "/background/" + url;
        })
        width = window.innerWidth > 0 ? window.innerWidth : screen.width;
        if (width > BACKGROUND_FADING_LIMIT) {
            resetAndChangeImage()
        }
    })
}

function resetAndChangeImage() {
    clearInterval(intervalID);
    intervalID = setInterval(changeImage, 5000);
}

function changeImage() {
    currentIndex = currentIndex % backgrounds.length + 1
    $("#title-wrapper").css("background-image", "url(/background/" + backgrounds[currentIndex] + ")");
}

function getGroepsleiding() {
    fetch("/api/getGroepsleiding.php").then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            $("#leiding").append("<div class='staff-item'>" +
                "<img src='/images/profile/" + item["Foto"] + "' alt='groepsleiding' class='fotoLeiding'/><br>" +
                "<b>Naam:</b> " + item["Voornaam"] + " " + item["Achternaam"] + "<br>" +
                "<b>Totem:</b> " + item["Totem"] + "<br>" +
                "<b>Gsm:</b> " + formatGsm(item["Gsm"]) + "<br>" +
                "<b>Email:</b> groepsleiding@scoutslebbeke.be<br></div>");
        });
    });
}

function getLeiding(tak) {
    fetch("/api/getLeiding.php?q=" + tak).then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            let bijnaam = "";
            if (tak === 'Kapoenenleiding' || (tak === 'Stam' && item['kapoenenbijnaam'])) {
                bijnaam += ' &bull; ' + item['kapoenenbijnaam'];
            }
            if (tak === 'Welpenleiding' || (tak === 'Stam' && item['welpenbijnaam'])) {
                bijnaam += ' &bull; ' + item['welpenbijnaam'];
            }
            const takleiding = item['Takleiding'] === '1' ? " (takleiding)" : '';
            $("#leiding").append("<div class='staff-item'>" +
                "<img src='/images/profile/" + item["Foto"] + "' alt='" + tak + "' class='fotoLeiding'/><br>" +
                "<b>Naam:</b> " + item["Voornaam"] + " " + item["Achternaam"] + bijnaam + takleiding + "<br>" +
                "<b>Totem:</b> " + (item["Totem"] ? item["Totem"] : "(geen)") + "<br>" +
                (takleiding ? "<b>Gsm:</b> " + formatGsm(item["Gsm"]) + "<br>" +
                    "<b>Email:</b> " + item["E-mail"] + "<br>" : "") + "</div>");
        });
    });
}

function formatGsm(str) {
    if (str === null) {
        return '-';
    }
    return str.substring(0, 4) + '/' + str.substring(4, 6) + '.' + str.substring(6, 8) + '.' + str.substring(8);
}

function getGrlContact() {
    fetch("/api/getGroepsleidingContact.php").then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            $("#grlnumbers").append("<p>" + formatGsm(item["Gsm"]) + " (" + item["Voornaam"] + " " + item["Achternaam"] + ")</p>");
        });
    });
}

function initMap() {
    let adres = {lat: 50.9841, lng: 4.144500};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: adres
    });
    new google.maps.Marker({position: adres, map: map});
}

function openNav() {
    $("#mobilemenu").css("width", "60%");
    document.body.style.overflow = "hidden";
    $("#overlay").show();
}

function closeNav() {
    for (let el of document.getElementsByClassName("mobilemenu")) {
        el.style.width = "0";
    }
    document.body.style.overflow = "visible";
    $("#overlay").hide();
}

function loadsub(sub) {
    $('#' + sub + 'mobilemenu').css("width","60%");
    $("#mobilemenu").css("width","0");
}

function returnside(sub) {
    $('#mobilemenu').css("width","60%");
    $('#' + sub + 'mobilemenu').css("width","0");
}

function getNavigation() {
    fetch("/api/getNavigation.php").then((res) => res.json()).then((data) => {
        $('#nav').html(getBrowserNav(data));
        $('#mobilenav').html(getMobileNav(data));
    });
}

function getBrowserNav(data) {
    let result = [], menuitem;
    Object.keys(data).forEach((item) => {
        menuitem = "";
        if (data[item].length === 1 && item === data[item][0].name) {
            menuitem += "<a onclick=\"load('" + data[item][0].path + "');\"><div class=\"navitem\">" + item + "</div></a>";
        } else {
            menuitem += "<div class=\"navdropdown\"><a><div class=\"navitem\">" + item + " <i class=\"arrow down\"></i></div></a><div class=\"navdropdowncontent\">";
            data[item].forEach((page) => {
                menuitem += "<a onclick=\"load('" + page.path + "')\">" + page.name + "</a>";
            });
            menuitem += "</div></div>";
        }
        result.push(menuitem);
    });
    return result.join("<div class=\"navslash\">|</div>");
}

function getMobileNav(data) {
    let subitems = '', result = '';
    Object.keys(data).forEach((item) => {
        if (data[item].length === 1 && item === data[item][0].name) {
            subitems += "<a onclick=\"load('" + data[item][0].path + "')\">" + item + "</a>";
        } else {
            subitems += "<a onclick=\"loadsub('" + item + "')\">" + item + "</a>";
            result += "<div class=\"mobilemenu text-white\" id=\"" + item + "mobilemenu\">";
            result += "<a href=\"javascript:void(0)\" class=\"closebtn\" onclick=\"closeNav()\">×</a>";
            data[item].forEach((page) => {
                result += "<a onclick=\"load('" + page.path + "')\">" + page.name + "</a>";
            });
            result += "<a onclick=\"returnside('" + item + "')\">←</a></div>"
        }
    });
    subitems = "<div class=\"mobilemenu text-white\" id=\"mobilemenu\"><a href=\"javascript:void(0)\" class=\"closebtn\" onclick=\"closeNav()\">×</a>" + subitems + "</div>";
    return "<div id=\"mobilemenuspan\"><a onclick=\"openNav()\">☰</a></div>" + subitems + result + "<div id=\"overlay\"></div>";
}

function post60YearData() {
    const form = new FormData(document.querySelector('#SixtyYearData'));
    fetch(new Request('/api/postSixtyYear.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => {
            const error = $('#60year_error');
            error.css('color', data["error"] ? 'red' : 'black');
            error.html(data["message"]);
        });
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