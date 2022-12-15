var count1 = 1;
var count2 = 0;
var datajson;
let datalength;
function loadDoc() {
    console.log("Loaded")

    $.ajax({
        url: `./api/getJson`,
        method: "GET",
        cache: false,
        beforeSend: () => {
            $.get("/api/getJson", function (responseText) {
                datajson = responseText;
                datalength = responseText.length;
                let table1 = document.getElementById("divtable1");

                for (let i = datalength - 1; i >= 0; i--) {
                    let addtable = document.createElement('div');
                    addtable.id = `add${i}`;
                    if (datajson[i].type == "news") {
                        addtable.innerHTML = `<div class="eventbox1">\n` +
                            `            <h3>${datajson[i].type}</h3><br>\n` +
                            `            <h4>${datajson[i].event}</h4>\n` +
                            `            <p>รายละเอียด: ${datajson[i].detail}</p><br>\n` +
                            `            <p>วันเวลา: ${datajson[i].date}</p>\n` +
                            `            <a href="./info?id=${i}" id="o${i}">แก้ไข</a></li>\n`
                        table1.appendChild(addtable);
                    }
                }
            });
        },
        success: () => {
        },
        error: () => {
            console.log(error);
        }
    })

}
