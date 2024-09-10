class Burger extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <button class="burger" onclick="this.classList.toggle('opened');this.setAttribute('aria-expanded', this.classList.contains('opened'));toggleNav()" aria-label="Main Menu">
                <svg width="30" height="30" viewBox="0 0 100 100">
                    <path class="line line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
                    <path class="line line2" d="M 20,50 H 80" />
                    <path class="line line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
                </svg>
            </button>
        `;
    }
}

class TitleWrapper extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="title-wrapper" onclick="resetAndChangeImage()">
                <div id="title" class="organisation-name">Scouts & Gidsen Lebbeke</div>
            </div>
        `;
    }

    insertAdjacentHTML(position, text) {
        super.insertAdjacentHTML(position, text);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    class Loader extends HTMLElement {
        constructor() {
            super();
        }

        connectedCallback() {
            this.innerHTML = `
                <div class="loader"></div>
                <div class="loader-message">${this.innerText}</div>
            `;
        }
    }
    customElements.define('loader-component', Loader);
});

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div id="header">
                <burger-component></burger-component>
                <div id="navigation"></div>
                <div id="profile" class="dropdown-block">
                    <div class="navigation-item">
                        <span id="profile-name">Niet ingelogd</span>
                        <div id="profile-pic" onclick="toggleProfile()"></div>
                    </div>    
                    <div class="dropdown" id="profile-dropdown">
                        <div class="dropdown-item login-item" onclick="toggleLogin()">Log in</div>
                    </div>
                </div>
            </div>
            <div id="mobile-navigation"></div>
            <div id="mobile-profile" class="mobile-menu">
                <a class="login-item" onclick="toggleLogin()">Log in</a>
            </div>
            <title-wrapper></title-wrapper>
        `;
    }
}

class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div>
                <a href="https://www.scoutsengidsenvlaanderen.be" target="_blank"><img id="sgv-icon" src="/images/s&gv.png" alt="Scouts & Gidsen Vlaanderen"></a>
                Scouts & Gidsen Lebbeke<br/>
                Lange Minnestraat 65<br/>
                9280 Lebbeke<br/>
                <a href="https://goo.gl/maps/7UEjJM1XQagH2y9NA" target="_blank"><img class="link-icon" src="/images/maps.png" alt="maps"></a>
                <a onclick="mailto('info')"><img class="link-icon" src="/images/email.ico" alt="email"></a>
                <a href="callto:32469237995"><img class="link-icon" src="/images/phone.png" alt="phone"></a>
                <a href="https://www.facebook.com/ScoustenGidsenLebbeke/" target="_blank"><img class="link-icon" src="/images/facebook.png" alt="facebook"></a>
                <a href="https://www.instagram.com/scoutsengidsenlebbeke/" target="_blank"><img class="link-icon" src="/images/instagram.png" alt="instagram"></a>
                <a href="https://wa.me/32469237995" target="_blank"><img class="link-icon" src="/images/whatsapp.png" alt="whatsapp"></a>
            </div>
            <div id="footer-tech">
                v 2.3.5<br/>
                © <span id="current-year"></span> Robin Keppens<br/>
                Made with ❤️ (and lots of ☕)
            </div>
            <span id="fork-repo"><a href="https://github.com/Scouts-Gidsen-Lebbeke/scoutslebbeke.be" target="_blank">Fork me on <img class="link-icon" src="/images/gh.png" alt="GitHub"></a></span>
        `;
    }
}

class LegendDialog extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add("dialog-wrapper")
        this.innerHTML = `
            <div class="dialog">
                <h4>Legende</h4>
                <span>De kleur van het kruisje geeft aan of er relevante medische opmerkingen zijn:</span>
                <div class="icon-list">
                    <img src="/images/cross-red.png" class="subscription-icon" alt="pill"><span>Geen relevante info beschikbaar.</span><br/>
                    <img src="/images/cross.png" class="subscription-icon" alt="pill"><span>Medicatie- of ziekte-info beschikbaar, klik om te openen.</span>
                </div>
                <span>Verder verschijnen er voor bepaalde andere velden in de medische fiche extra icoontjes:</span>
                <div class="icon-list">
                    <img src="/images/no-camera.png" class="subscription-icon" alt="no-picture"><span>Het lid mag niet gefotografeerd worden.</span><br/>
                    <img src="/images/no-painkillers.png" class="subscription-icon" alt="no-painkillers"><span>Het lid mag geen pijnstillende en/of koortswerende medicatie krijgen.</span><br/>
                    <img src="/images/activity-restriction.png" class="subscription-icon" alt="activity-restriction"><span>Het lid kan aan bepaalde activiteiten enkel met extra zorg deelnemen.</span><br/>
                    <img src="/images/family.png" class="subscription-icon" alt="family"><span>Er zijn bepaalde familiale omstandigheden om mee rekening te houden.</span><br/>
                    <img src="/images/food-anomalies.png" class="subscription-icon" alt="food-anomalies"><span>Het lid volgt een bepaald dieet of heeft een allergie.</span>
                </div>
                <button class="close-btn" onclick="closeLegend()">Sluit</button>
            </div>
        `;
    }
}

function showLegend() {
    $("legend-dialog").show()
}

function closeLegend() {
    $("legend-dialog").hide()
}

class LocationDialog extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add("dialog-wrapper")
        this.innerHTML = `
            <div class="dialog">
                <h4>Voeg een locatie toe</h4>
                <form id="location-form">
                    <label for="location-name">Naam</label>
                    <input type="text" id="location-name" name="name"><br/>
                    <label for="location-address">Adres</label>
                    <input type="text" id="location-address" name="address"><br/>
                    <label for="location-url">Link</label>
                    <input type="url" id="location-url" name="url">
                </form>
                <button class="close-btn" onclick="saveAndClose()">Sla op</button>
                <button class="close-btn" onclick="closeDialog()">Annuleer</button><br/>
                <span class="form-feedback" id="location-form-feedback"></span>
            </div>
        `;
    }
}

function createLocation() {
    $("location-dialog").css("display", "flex")
}

function saveAndClose() {
    const form = document.querySelector("#location-form");
    const formData = new FormData(form);
    fetch("/api/location/postLocation.php", {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
        method: "POST",
        body: formData
    }).then(data => data.json()).then(result => {
        if (result.error != null) {
            $("#location-form-feedback").html(result.error);
        } else {
            fetch("/api/location/getAll.php").then((res) => res.json()).then((locations) => {
                $('.location-list').empty()
                locations.forEach(b => $('.location-list').append(`<option value="${b.id}">${b.name}</option>`))
            });
            closeDialog();
        }
    });
}

function closeDialog() {
    $("location-dialog").hide()
}

customElements.define('burger-component', Burger);
customElements.define('title-wrapper', TitleWrapper);
customElements.define('header-component', Header);
customElements.define('footer-component', Footer);
customElements.define('location-dialog', LocationDialog);
customElements.define('legend-dialog', LegendDialog);