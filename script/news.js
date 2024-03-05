window.onload = function() {
    loadGlobal();
    checkLogin(loadProfile);
    getNews();
};

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