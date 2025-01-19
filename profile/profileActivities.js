window.onload = function() {
    loadGlobal();
    requireLogin(function (d) {
        loadProfile(d);
        loadActivityOverview()
    });
};

function loadActivityOverview() {
    tokenized("/activity/getUserActivities.php").then(activities => {
        activities.forEach(activity =>
            $('#activity-overview tbody').append(`
                <tr>
                    <td>${activity.id}</td>
                    <td>${activity.name}</td>
                    <td>${activity.date}</td>
                    <td>€ ${activity.price}</td>
                    <td>${activity.status}</td>
                    <td class="icon-column">${activity.present === "1" ? `<img src="/images/report.png" class="subscription-icon" alt="report" onclick="getCertificate('${activity.id}')">` : ""}</td>
                    <td class="icon-column">${activity.cancellable ? `<img src="/images/cancel.png" class="subscription-icon" alt="cancel" onclick="cancelSubscription('${activity.id}')">` : ""}</td>
                </tr>
            `)
        )
        $("#activity-loader").hide()
    });
}

function cancelSubscription(subscriptionId) {
    alert("Activiteiten annuleren is momenteel nog niet mogelijk, contacteer de groepsleiding!")
}