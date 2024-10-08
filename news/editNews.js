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
        $("#news-loader").hide()
        $("#news-form").show()
        return
    }
    tokenized(`/api/news/getById.php?id=${id}`).then(news => {
        $("#news-id").val(news.id)
        $("#news-title").val(news.title)
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
    postForm("/api/postImage.php?dir=news", "news-form").then(data => {
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
    postForm("/api/news/updateNews.php", "news-form").then(result => {
        if (result.error != null) {
            $("#form-feedback").html(result.error)
        } else {
            cancel()
        }
    });
}