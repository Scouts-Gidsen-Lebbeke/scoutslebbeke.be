function getData(postData, resultFileName) {
    fetch(new Request('/backoffice/api/getData.php', {method: 'POST', body: postData})).then(res => res.blob())
        .then(blob => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = resultFileName + ".csv";
            document.body.appendChild(a);
            a.click();
            a.remove();
        });
}

function getSixtyYearData() {
    getData('{"table": "60_year_contact", "fields": ["email", "firstname", "lastname"]}', "60jaar");
}

function getQuizData() {

}

function getValentineData() {
    //getData('{"table": "valentine_orders", "fields": ["email", "default", "luxury", "firstname", "lastname"]}', "ontbijten");
}

function getWeekendData() {

}

function getCampData() {

}