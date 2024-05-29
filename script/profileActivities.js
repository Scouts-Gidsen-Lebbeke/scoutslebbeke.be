window.onload = function() {
    loadGlobal();
    requireLogin(function (d) {
        loadProfile(d);
        loadActivityOverview()
    });
};

function loadActivityOverview(id) {
    tokenized("/api/activity/getUserActivities.php").then(activities => {
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
        $(".loader").hide()
    });
}

async function getCertificate(subscriptionId) {
    // Fetch an existing PDF document
    const template = fetch('certificates/participation.pdf').then(res => res.arrayBuffer())
    const signature = fetch('certificates/signature.png').then(res => res.arrayBuffer())
    tokenized(`/api/activity/getCertificateData.php?id=${subscriptionId}`).then(async d => {
        const pdfDoc = await PDFLib.PDFDocument.load(await template)
        const form = pdfDoc.getForm()
        form.getTextField('name').setText(d.member.name)
        form.getTextField('first_name').setText(d.member.first_name)
        form.getTextField('birth_date').setText(printDDMMYYYY(new Date(Date.parse(d.member.birth_date))))
        form.getTextField('nis_nr').setText(ifNotNull(d.member.nis_nr, ""))
        form.getTextField('address').setText(ifNotNull(d.member.address, ""))
        form.getTextField('activity_name').setText(d.activity.name)
        form.getTextField('period').setText(`${printDDMMYYYY(new Date(Date.parse(d.registration.start)))} - ${printDDMMYYYY(new Date(Date.parse(d.registration.end)))}`)
        form.getTextField('days').setText(d.registration.days.toString())
        form.getTextField('amount').setText(`€ ${d.registration.price}`)
        form.getTextField('payment_date').setText(printDDMMYYYY(new Date(Date.parse(d.registration.date))))
        form.getTextField('organization_name').setText(d.organization.name)
        form.getTextField('organization_address').setText(d.organization.address)
        form.getTextField('organization_email').setText(d.organization.email)
        form.getTextField('signature_date').setText(printDDMMYYYY(new Date()))
        form.getTextField('signatory').setText(d.organization.signatory)
        form.getTextField('id').setText(btoa(`${d.activity.id}-#${d.registration.id}`))
        form.getTextField('id')
        form.flatten()
        const page = pdfDoc.getPage(0)
        const pngImage = await pdfDoc.embedPng(await signature)
        const pngDims = pngImage.scale(0.1)
        page.drawImage(pngImage, {
            x: 70,
            y: 140,
            width: pngDims.width,
            height: pngDims.height,
        })
        const binary = await pdfDoc.save()
        download(binary, `Deelnamebewijs ${d.activity.name} - ${d.member.name} ${d.member.first_name}`, "application/pdf");
    })
}

function printDDMMYYYY(date) {
    return date.toLocaleDateString('nl-BE', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function cancelSubscription(subscriptionId) {
    alert("Activiteiten annuleren is momenteel nog niet mogelijk, contacteer de groepsleiding!")
}