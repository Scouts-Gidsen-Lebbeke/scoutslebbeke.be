window.onload = function() {
    loadGlobal();
    checkLogin(d => {
        loadProfile(d)
        toggleEdit(isStaff(d))
    });
    getNews()
};

function getNews() {
    const url = phpServer ? "/news/getAll.php" : "/news"
    fetch(`${baseApiUrl}${url}`).then((res) => res.json()).then((data) => {
        Object.values(data).forEach((n) => {
            $("#news-items").append(
                `<div class="news-item" id="news-item-${n.id}">
                    ${n.image ? `<img class="news-item-image" src="/images/news/${n.image}" alt="${n.image}">` : ""}
                    <div class="news-item-content">
                        <h2 class="news-item-title">
                            ${n.title}
                            <img src="/images/edit.png" alt="edit" class="edit-icon" onclick="editNews('${n.id}')" title="Bewerk dit nieuwtje">
                            <img src="/images/delete.png" alt="delete" class="edit-icon" onclick="deleteNews('${n.id}')" title="Verwijder dit nieuwtje">
                        </h2>
                        <p class="news-item-info">${parseDateString(n.createdDate)}</p>
                        <p class="news-item-description">${n.content}</p>
                    </div>
                </div>`
            );
        });
    });
}

function toggleEdit(editable) {
    if (editable) {
        $("#news-edit-icon").css("display", "inline");
        $(".edit-icon").css("display", "inline");
    }
}

function parseDateString(s) {
    return new Date(Date.parse(s)).toLocaleDateString('nl-BE',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function addNews() {
    window.location = "/news/editNews.html";
}

function editNews(id) {
    window.location = `/news/editNews.html?id=${id}`;
}

function deleteNews(itemId) {
    if (confirm("Ben je zeker dat je dit nieuwtje wil verwijderen?")) {
        const url = phpServer ? `/news/deleteNews.php?id=${itemId}` : `/news/${itemId}`
        tokenized(url, false, null, "DELETE").then(succes => {
            if (succes) {
                $(`#news-item-${itemId}`).remove()
            } else {
                alert("Er ging iets mis bij het verwijderen van dit nieuwtje!")
            }
        })
    }
}