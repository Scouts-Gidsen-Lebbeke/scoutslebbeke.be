window.addEventListener("load", initAutocomplete);

window.onload = function() {
    loadGlobal();
    checkLogin(loadProfile);
    let maxDate = new Date(new Date().getFullYear() - 4, 0, 1);
    $('#birthdate').attr('max', maxDate.toISOString().split('T')[0]);
    let validator = $("#subscribe-form").validate({
        rules: {
            mobile: {
                pattern: "^((32|0032|0)?4[0-9]{8}|(32|0032|0)?[2-9][0-9]{7})$"
            },
            zip: {
                pattern: "^[1-9][0-9]{3}$"
            }
        },
        invalidHandler: function(event, validator) {
            if (validator.numberOfInvalids() > 0) {
                $("#subscribe-feedback").html("Gelieve alle verplichte velden in te vullen!");
            }
        },
        success: function(label, element) {
            if (validator.numberOfInvalids() === 0) {
                $("#subscribe-feedback").empty();
            }
        },
        errorPlacement: function(error, element) {},
        highlight: function(element) {
            $(element).css("border", "1px solid red");
        },
        unhighlight: function(element) {
            $(element).css("border", "");
        },
    });
};

async function initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'));
    autocomplete.setTypes(['address']);
    autocomplete.addListener('place_changed', function() {
        let place = autocomplete.getPlace();
        $("#place_id").val(place["place_id"]);
    });
}

function postSubscription() {
    if (!$("#subscribe-form").valid()) return;
    postForm("/api/user/createSubscription.php", "subscribe-form").then(result => {
        if (result.error != null) {
            $("#subscribe-feedback").html(result.error)
        } else if (result.checkout != null) {
            location.href = result.checkout
        }
    })
}