tinymce.init({
    selector: 'div#news-pre-content',
    plugins: 'link code paste emoticons',
    toolbar: 'undo redo | bold italic underline strikethrough subscript superscript | forecolor | link emoticons | code',
    toolbar_mode: 'floating',
    menubar: false,
    paste_as_text: true,
    tinycomments_mode: 'embedded',
    height: 250,
    content_css: '/style/editor.css',
    automatic_uploads: false,
});

window.onload = function() {
    loadGlobal();
    requireLogin(d => {
        guardStaff(d)
        loadProfile(d)
        retrieveNews()
    });
};

function retrieveNews() {
    const params = (new URL(document.location)).searchParams;
    const id = params.get('id')
    if (id == null) {
        $("#news-visible").prop('checked', true)
        $("#news-loader").hide()
        $("#news-form").show()
        return
    }
    tokenized(`/api/news/getById.php?id=${id}`).then(news => {
        $("#news-id").val(news.id)
        $("#news-title").val(news.title)
        $("#news-visible").prop('checked', news.visible === "1")
        $("#news-image").val(news.image)
        if (news.image) {
            $("#news-image-pic").attr("src", `/images/news/${news.image}`);
        }
        tinymce.get("news-pre-content").setContent(news.content)
        $("#news-loader").hide()
        $("#news-form").show()
    })
}

function toggleUpload() {
    $("#news-image-upload").trigger("click")
}

function postImage() {
    const form = new FormData(document.querySelector('#news-form'));
    fetch("/api/postImage.php?dir=news", {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
        method: "POST",
        body: form
    }).then(response => response.json()).then(data => {
        if (data.succes) {
            $("#news-image").val(data.name)
            $("#news-image-pic").attr("src", data.location);
        } else {
            $("#form-feedback").html(data.message);
        }
    });
}

function cancel() {
    window.location = "/index.html"
}

function postNews() {
    $("#news-content").val(tinymce.activeEditor.getContent());
    const form = document.querySelector("#news-form");
    const formData = new FormData(form);
    fetch("/api/news/updateNews.php", {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` }),
        method: "POST",
        body: formData
    }).then(data => data.json()).then(result => {
        if (result.error != null) {
            $("#form-feedback").html(result.error)
        } else {
            cancel()
        }
    });
}