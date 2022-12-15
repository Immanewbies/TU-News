var count1 = 0;
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
                let table2 = document.getElementById("divtable2");

                for (let i = datalength - 1; i >= 0; i--) {
                    let addtable = document.createElement('div');
                    addtable.id = `add${i}`;
                    if (datajson[i].type == "news") {
                        if (count1 < 4) {
                            addtable.innerHTML = `<div class="eventbox1">\n` +
                                `            <h3>${datajson[i].type}</h3><br>\n` +
                                `            <h4>${datajson[i].event}</h4>\n` +
                                `            <p>รายละเอียด: ${datajson[i].detail}</p><br>\n` +
                                `            <p>วันที่เริ่ม: ${datajson[i].date}</p>\n` +
                                `            <p>วันที่จบ: ${datajson[i].outdate}</p>\n` +
                                `            <a href="./info?id=${i}" id="o${i}">แก้ไข</a></li>\n`
                            table1.appendChild(addtable);
                        }
                        count1 = count1 + 1;
                    }
                    if (datajson[i].type == "events") {
                        if (count2 < 4) {
                            addtable.innerHTML = `<div class="eventbox1">\n` +
                                `            <h3>${datajson[i].type}</h3><br>\n` +
                                `            <h4>${datajson[i].event}</h4>\n` +
                                `            <p>รายละเอียด: ${datajson[i].detail}</p><br>\n` +
                                `            <p>วันที่เริ่ม: ${datajson[i].date}</p>\n` +
                                `            <p>วันที่จบ: ${datajson[i].outdate}</p>\n` +
                                `            <a href="./info?id=${i}" id="o${i}">แก้ไข</a></li>\n`
                            table2.appendChild(addtable);
                        }
                        count2 = count2 + 1;
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
