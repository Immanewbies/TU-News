// submit form
var BooImg = 0;
var chatimg = "";

function B_IMG() {
  BooImg = 1;
}
function preview_2(obj) {
  if (FileReader) {
    var reader = new FileReader();
    reader.readAsDataURL(obj.files[0]);
    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        chatimg = image.src
      };
    }
  }
  else {
    // Not supported
  }
}

const submitForm = () => {
  const chatInput = $(".chat-input").val();
  if (chatInput != "" || BooImg == 1) {
    if (BooImg == 1) {
      $("#inner").append(`
    <div class="chat-msg-box clint">
      <img src="${chatimg}" style="max-height: 200;max-width: 200px;">
    </div>`);
      BooImg = 0;
    } else {
      $("#inner").append(`
    <div class="chat-msg-box clint">
      <p>${chatInput}</p>
    </div>`);
    }



    $.ajax({
      url: `./api/question/?q=${encodeURIComponent(chatInput)}`,
      method: "GET",
      cache: false,
      beforeSend: () => {
        $(".chat-input").val("");
        $(".typing").show();
        $("#inner").append(`
        <div class="chat-msg-box bot">
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
        </div>
        `);
        if ($(".chat-msg-box").length >= 10) {
          $([document.documentElement, document.body]).animate({
            scrollTop: $(".chat-msg-box.bot:last-child").offset().top,
          }, { duration: 500 });
        }
      },
      success: (data) => {
        const response = (data.responseText).replace(/\n/gm, "</br>");
        $(".chat-msg-box.bot:last-child").html(`<p>${response}</p>`);
      },
      error: () => {
        $(".chat-msg-box.bot:last-child").remove();
      },
      complete: () => {
        $(".typing").hide();
      },
    });
  };
}

var count1 = 0;
var count2 = 0;
var datajson;
let datalength;

window.onload = () => {
  setTimeout(() => {
    if (document.querySelectorAll(".chat-msg-box").length == 0) {
      $.ajax({
        url: "./api/welcome",
        beforeSend: () => {
          $(".typing").show();
          $("#inner").append(`
            <div class="chat-msg-box bot">
              <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
              </div>
            </div>
            `);
        },
        success: (data) => {
          const response = (data.responseText).replace(/\n/gm, "</br>");
          $(".chat-msg-box.bot:last-child").html(`<p>${response}</p>`);
        },
        error: () => {
          $(".chat-msg-box.bot:last-child").remove();
        },
        complete: () => {
          $(".typing").hide();
        },
      });
    }
  }, 3000);

  $.ajax({
    url: "./api/allquestions",
    success: (data) => {
      data.forEach((qus) => {
        $(".questions.container").append(`
        <div class="question">
          <p>${qus}</p>
        </div>
        `);
      });
    },
  });

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
                  `            <p>วันเวลา: ${datajson[i].date}</p>\n` +
                  `            <button type="submit" class="popupBtn" onclick="openPopup(${i})" id="o${i}">อ่านเพิ่มเติม</button>\n`
                             

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
                  `            <p>วันเวลาที่เริ่ม: ${datajson[i].date}</p>\n` +
                  `            <p>วันเวลาที่จบ: ${datajson[i].outdate}</p>\n` +
                  `            <button type="submit" class="popupBtn" onclick="openPopup(${i})" id="o${i}">อ่านเพิ่มเติม</button>\n`
                  
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
};

const toogleShowSuggestions = () => {
  if ($("#inner").css("display") == "none") {
    $(".all-questions").hide();
    $("header img").attr("src", "./src/images/chat_icon.png");
    $("#inner").show();
    $("footer").show();
  } else {
    $(".all-questions").show();
    $("header img").attr("src", "./src/images/close.png");
    $("#inner").hide();
    $("footer").hide();
  }
};

$("#toogle-chat").on("click", () => {
  toogleShowSuggestions();
});

window.onresize = () => {
  if (window.innerHeight < 580) {
    $("header").css("top", "-4em");
  } else {
    $("header").css("top", "0vh");
  }
};

$("#chat-form").submit((e) => {
  e.preventDefault();
  submitForm();
});

// const typed = new Typed(".chat-input", {
//   strings: [
//     "how many mm in 1 cm",
//     "change 10 l into ml",
//     "what is computer",
//     "what is Javascript",
//     "what is HTML",
//     "tell me about ChatBot",
//     "who is Mahatma Gandhi",
//     "who is Nelson Mandela",
//     "who is Narendra Modi",
//     "When do you have birthday?",
//     "Tell me about your personality.",
//     "I want a funny joke.",
//     "Can you tell me a joke please?",
//     "Can you tell me something about your creators?",
//     "Are you just a bot?",
//     "Date of your birthday.",
//     "search for pythagoras theorem",
//     "How are you today?",
//     "could you be my friend",
//     "where are you from",
//   ],
//   typeSpeed: 60,
//   backSpeed: 30,
//   backDelay: 1500,
//   showCursor: true,
//   cursorChar: "|",
//   attr: "placeholder",
//   loop: true,
//   bindInputFocusEvents: false,
//   shuffle: true,
// });

function openForm() {
  if (document.getElementById("myForm").style.display == "block")
    closeForm()
  else
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}