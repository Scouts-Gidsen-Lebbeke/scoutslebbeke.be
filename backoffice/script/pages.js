loadPages();
$("#page-list").on('change', (event) => {
    $.get('/pages/' + event.target.value + '.html', data => tinymce.get("page-content").setContent(data));
});
tinymce.init({
    selector: 'div#page-content',
    plugins: 'codesample table autosave code powerpaste',
    toolbar: 'undo redo restoredraft | styleselect | bold italic underline | outdent indent | code table',
    menu: {
        file: { title: 'File', items: 'restoredraft | preview' },
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
    height: 1000,
    content_css: '/scoutslebbeke.css',
    automatic_uploads: true,
    images_upload_url: 'postAcceptor.php',
    images_reuse_filename: true
});