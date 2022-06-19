loadPages();
loadGroups();

function loadGroups() {
    fetch(new Request('/backoffice/api/getPageGroups.php', {method: 'GET'}))
        .then(response => response.json()).then(data => {
            if (data["success"]) {
                $.each(data["list"], function (i, item) {
                    $('#group-list').append($('<option>', {
                        value: item["id"],
                        text : item["name"]
                    }));
                    $('#item-group').append($('<option>', {
                        value: item["id"],
                        text : item["name"]
                    }));
                });
            }
    });
}

function initGroupContent(selected) {
    if (selected !== "") {
        fetch(new Request('/backoffice/api/getPageGroupDetails.php?q=' + selected, {method: 'GET'}))
            .then(response => response.json()).then(res => {
            if (res["success"]) {
                const data = res["data"];
                const rank = parseInt(data["rank"]);
                $('#group-id').val(data["id"]);
                $('#group-name').val(data["name"]);
                $('#group-rank').text(rank);
                $('#group-rank-down').prop('disabled', rank === 1);
                $('#group-rank-up').prop('disabled', rank === $('#group-list option').length - 1);
                $('#group-content').show();
                $('#delete-group').prop('disabled', false);
            }
        });
    } else {
        $('#group-content').hide();
        $('#delete-group').prop('disabled', true);
    }
}

function updateGroupName() {
    const form = new FormData(document.querySelector('#group-data'));
    fetch(new Request('/backoffice/api/postPageGroup.php', {method: 'POST', body: form}))
        .then(r => r.json()).then(d => $('#group-name-error').html(d["error"]));
    loadGroups()
}

function updateGroupRank(change) {
    const rankSpan = $('#group-rank');
    const rank = parseInt(rankSpan.text()) + change;
    rankSpan.text(rank);
    $('#group-rank-down').prop('disabled', rank === 1);
    $('#group-rank-up').prop('disabled', rank === $('#group-list option').length - 1);
}

function deleteGroup() {
    const selected = $('#group-list').val();
    fetch(new Request('/backoffice/api/deletePageGroup.php?q=' + selected, {method: 'GET'}))
    loadGroups()
}

function newGroup() {
    $('#group-id').val(null);
    $('#group-name').val("Nieuwe groep");
    updateGroupName()
    loadGroups();
    $('#group-list').val($('#group-list option:last').val())
}

function initNavContent(selected) {
    if (selected != null) {
        $('#page-content').show();
        fetch(new Request('/backoffice/api/getPageDetails.php?q=' + selected, {method: 'GET'}))
            .then(response => response.json()).then(res => {
            if (res["success"]) {
                const data = res["data"];
                const rank = parseInt(data["rank"]);
                $('#item-id').val(data["path"]);
                $('#item-name').val(data["name"]);
                $('#item-group').val(data["group_id"]);
                $('#item-visible').prop('checked', data["visible"] === "1");
                $('#item-rank').text(rank);
                $('#item-rank-down').prop('disabled', rank === 1);
                $('#item-rank-up').prop('disabled', rank === $('#page-list option').length - 1);
            }
        });
    } else {
        $('#page-content').hide();
    }
}

function updateItemRank(change) {
    const rankSpan = $('#item-rank');
    const rank = parseInt(rankSpan.text()) + change;
    rankSpan.text(rank);
    $('#item-rank-down').prop('disabled', rank === 1);
    $('#item-rank-up').prop('disabled', rank === $('#item-list option').length - 1);
}