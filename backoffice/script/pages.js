loadPages();
$("#page-list").on('change', (event) => {
    if (event.target.value) {
        $.get('/pages/' + event.target.value + '.html', data => tinymce.get("page-content").setContent(data));
    } else {
        tinymce.get("page-content").setContent("")
    }
});
tinymce.remove("#page-content");
tinymce.init({
    selector: 'div#page-content',
    plugins: 'codesample table autosave code',
    toolbar: 'undo redo | styleselect | bold italic underline | outdent indent | code table',
    menu: {
        edit: { title: 'Edit', items: 'undo redo | cut copy paste | selectall | searchreplace' },
        view: { title: 'View', items: 'visualaid visualchars visualblocks | preview fullscreen' },
        insert: { title: 'Insert', items: 'image link media template codesample inserttable | charmap emoticons hr | pagebreak nonbreaking anchor toc | insertdatetime' },
        format: { title: 'Format', items: 'bold italic underline strikethrough superscript subscript codeformat | formats blockformats fontformats fontsizes align lineheight | forecolor backcolor | removeformat' },
        table: { title: 'Table', items: 'inserttable | cell row column | tableprops deletetable' }
    },
    codesample_languages: [
        { text: 'JavaScript', value: 'javascript' },
    ],
    toolbar_mode: 'floating',
    tinycomments_mode: 'embedded',
    height: 800,
    width: 1000,
    content_css: '/backoffice/style/center-site.css',
    automatic_uploads: true,
    images_upload_url: 'postAcceptor.php',
    images_reuse_filename: true,
    extended_valid_elements: 'script[language|type|src],a[onclick,href]'
});

function saveContent() {
    $("#page-content-copy").val(tinymce.activeEditor.getContent());
    const form = new FormData(document.querySelector('#page-edit'));
    fetch(new Request('/backoffice/api/postPageContent.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => changeAndTimeout("#error-page-content", data["message"]));
}

function updateSaveButton() {
    $("#save-page").prop("disabled", !$('#page-list').val());
}