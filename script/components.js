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
}

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

customElements.define('burger-component', Burger);
customElements.define('title-wrapper', TitleWrapper);
customElements.define('header-component', Header);
customElements.define('footer-component', Footer);