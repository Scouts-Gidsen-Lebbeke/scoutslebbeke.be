let width, images = 13, previousPhoto = 0, intervalID, content;

window.onload = function () {
    const q = (new URL(window.location.href)).searchParams.get('q');
    if (q) {
        window.history.replaceState(null, "", "/");
    }
    const q2 = q ? q : localStorage.getItem("content");
    content = q2 ? q2 : 'nieuwtjes/nieuwtjes.html';
    $('#content').load(content);
    getNavigation();

    width = window.innerWidth > 0 ? window.innerWidth : screen.width;
    if (width > 1200){
        // start background fading
        changeImage();
        intervalID = setInterval(changeImage, 5000);
    }

    document.addEventListener('keydown', ev => {
        if (ev.code === 'KeyE' && ev.ctrlKey && ev.altKey) {
            window.location.replace("https://www.scoutslebbeke.be/leidingsplatform/front.php");
        }
    });
};

// handles background fading on window resize
window.onresize = function () {
    let newwidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width <= 1200 && newwidth > 1200){
        changeImage();
        intervalID = setInterval(changeImage, 5000);
    } else if (width > 1200 && newwidth <= 1200) {
        clearInterval(intervalID);
    }
    width = newwidth;
};

// remember the current page for a possible reload
window.onbeforeunload = function() {
    localStorage.setItem("content", content);
};

// changes background of wrapper
function changeImage() {
    let i = Math.floor(Math.random() * images) + 1;
    if (i === previousPhoto) {
        i = (i + 1) % images + 1;
    }
    $("#wrapper1").css("background-image", "url(backgroundimages/" + i + ".jpg)");
    previousPhoto = i;
}

function getGroepsleiding() {
    fetch("getGroepsleiding.php").then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            $("#leiding").append("<img src='../images/" + item["Foto"] + "' alt='groepsleiding' class='fotoLeiding'/><br>" +
                "<b>Naam:</b> " + item["Voornaam"] + " " + item["Achternaam"] + "<br>" +
                "<b>Totem:</b> " + item["Totem"] + "<br>" +
                "<b>Gsm:</b> " + formatGsm(item["Gsm"]) + "<br>" +
                "<b>Email:</b> groepsleiding@scoutslebbeke.be<br>");
        });
    }).catch((error) => console.log(error))
}

function getLeiding(tak) {
    fetch("getLeiding.php?q="+tak).then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            const bijnaam = tak === 'Kapoenenleiding' || tak === 'Welpenleiding' ? ' &bull; ' + item['Bijnaam'] : '';
            const takleiding = item['Takleiding'] === '1' ? " (takleiding)" : '';
            $("#leiding").append("<img src='../images/" + item["Foto"] + "' alt='" + tak + "' class='fotoLeiding'/><br>" +
                "<b>Naam:</b> " + item["Voornaam"] + " " + item["Achternaam"] + bijnaam + takleiding + "<br>" +
                "<b>Totem:</b> " + item["Totem"] + "<br>" +
                "<b>Gsm:</b> " + formatGsm(item["Gsm"]) + "<br>" +
                "<b>Email:</b> " + item["Email"] + "<br>");
        });
    }).catch((error) => console.log(error));
}

function formatGsm(str) {
    if (str === null) {
        return '-';
    }
    return str.substr(0, 4) + '/' + str.substr(4, 2) + '.' + str.substr(6, 2) + '.' + str.substr(8);
}

function getGrlContact() {
    fetch("getGroepsleidingContact.php").then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            $("#grlnumbers").append("<p>" + formatGsm(item["Gsm"]) + " (" + item["Voornaam"] + " " + item["Achternaam"] + ")</p>");
        });
    }).catch((error) => console.log(error))
}

function initMap() {
    let adres = {lat: 50.9841, lng: 4.144500};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: adres
    });
    let marker = new google.maps.Marker({
        position: adres,
        map: map
    });
}

function load(path) {
    content = path;
    $('#content').load(content);
    if (width <= 1200) {
        closeNav();
    }
}

//open mobile navigation bar
function openNav() {
    $("#mobilemenu").css("width", "60%");
    document.body.style.overflow = "hidden";
    $("#overlay").show();
}

//close mobile navigation bar
function closeNav() {
    for (let el of document.getElementsByClassName("mobilemenu")) {
        el.style.width = "0"
    }
    document.body.style.overflow = "visible";
    $("#overlay").hide();
}

//load submenu in mobile navigation bar
function loadsub(sub) {
    let subname = '#' + sub + 'mobilemenu';
    $(subname).css("width","60%");
    $("#mobilemenu").css("width","0");
}

//return to main menu in mobile navigation bar
function returnside(sub) {
    let subname = '#' + sub + 'mobilemenu';
    $('#mobilemenu').css("width","60%");
    $(subname).css("width","0");
}

function getNavigation() {
    fetch("getNavigation.php").then((res) => res.json()).then((data) => {
        $('#nav').html(getBrowserNav(data));
        $('#mobilenav').html(getMobileNav(data));
    }).catch((error) => console.log(error));
}

function getBrowserNav(data) {
    let result = [], menuitem;
    Object.keys(data).forEach((item) => {
        menuitem = "";
        if (data[item].length === 1) {
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
        if (data[item].length === 1) {
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

function setPeriod() {
    const month = new Date().getMonth();
    let title;
    if (month <= 3) {
        title = "Sprokkel januari - april";
    } else if (month <= 7) {
        title = "Sprokkel april - juni";
    } else {
        title = "Sprokkel september - december";
    }
    $("#period").html(title);
}

function test() {

}