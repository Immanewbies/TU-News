const submitForm = () => {
    const typeInp = $(".selectbox").val();
    const eventInp = $(".event-box").val();
    const detailInp = $(".detail-box").val();
    const dateInp = $("input#event-date").val();
    const outdateInp = $("input#event-outdate").val();
    const imgInp = $("input#myfile").val().replace(/C:\\fakepath\\/i, '');
    var dataJson = { "type": typeInp, "event": eventInp, "detail": detailInp, "date": dateInp, "outdate": outdateInp, "img": "./src/images/events/" + imgInp }
    
    $.ajax({
        url: `./api/save`,
        method: "POST",
        cache: false,
        data: myJSON = JSON.stringify(dataJson),
    }).done(function (result) {
        if (result.status == 200) {
            //redirecting to main page from here.
            window.location.href = result.Location;
        }
    }).fail(function (result) {
        if (result.status == 404) {
            document.getElementById("errorName").textContent = "Please enter all information";
        }
    });
    var form = $('#event-form')[0];
    var formData = new FormData(form);
    console.log(formData)
    $.ajax({
        url: `./api/upload`,
        method: "POST",
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        success: function (r) {
            console.log("result", r)
        },
        error: function (e) {
            console.log("some error", e);
        }
    });
};

$("#event-form").submit((e) => {
    e.preventDefault();
    submitForm();
});
