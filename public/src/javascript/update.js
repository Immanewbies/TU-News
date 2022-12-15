function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
let i = getParameterByName("id");
var getjsons;

function loadInfo() {
    $.ajax({
        url: `./api/getJson`,
        method: "GET",
        cache: false,
        beforeSend: () => {
            $.get("/api/getJson", function (responseText) {
                getjsons = responseText;
                datajson = getjsons;
                document.getElementById("event-type").value = datajson[i].type;
                document.getElementById("event-name").value = datajson[i].event;
                document.getElementById("event-detail").value = datajson[i].detail;
                document.getElementById("event-date").value = datajson[i].date;
                document.getElementById("event-outdate").value = datajson[i].outdate;
                document.getElementById("myfile").value = datajson[i].img;
            });
        },
        success: () => {
        
        },
        error: () => {
            console.log(error);
        }
    })

}

const submitForm = () => {
    const typeInp = $(".selectbox").val();
    const eventInp = $(".event-box").val();
    const detailInp = $(".detail-box").val();
    const dateInp = $("input#event-date").val();
    const outdateInp = $("input#event-outdate").val();
    const imgInp = $("input#myfile").val().replace(/C:\\fakepath\\/i, '');
    var dataJson = { "type": typeInp, "event": eventInp, "detail": detailInp, "date": dateInp, "outdate": outdateInp, "img": "./src/images/events/"+imgInp }

    var param;

    $.ajax({
        url: `./api/update`,
        method: "POST",
        cache: false,
        beforeSend: () => {
            $.get("/api/getJson", function (responseText) {
                getjsons = responseText;
                datajson = getjsons;
                datajson[i] = dataJson;
                var myJSON = JSON.stringify(datajson[i]);
                param = `${myJSON}+${i}`;
                const xhttp = new XMLHttpRequest();
                xhttp.open("POST", "/api/update", true);
                xhttp.send(param);
            });
        }
    }).done( () => {
        window.location.href = '/AdminPage';
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
