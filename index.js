/* eslint-disable max-len */
const fs = require("fs");
const _ = require("lodash");
const wiki = require("wikipedia");
const convert = require("convert-units");
const { lowerCase } = require("lower-case");
const { capitalCase } = require("change-case");
const extractValues = require("extract-values");
const stringSimilarity = require("string-similarity");
const { upperCaseFirst } = require("upper-case-first");

const cors = require("cors");
const path = require("path");
const axios = require("axios");
const morgan = require("morgan");
const dotenv = require("dotenv");
const express = require("express");
const compression = require("compression");
const serveStatic = require("serve-static");
const formidable = require('formidable');
const flash = require('connect-flash');
const session = require('express-session');
const multer = require("multer");

const pkg = require("./package.json");
const mainChat = require("./intents/Main_Chat.json");
const supportChat = require("./intents/support.json");
const wikipediaChat = require("./intents/wikipedia.json");
const welcomeChat = require("./intents/Default_Welcome.json");
const fallbackChat = require("./intents/Default_Fallback.json");
const unitConverterChat = require("./intents/unit_converter.json");

dotenv.config();

const standardRating = 0.6;
const botName = process.env.BOT_NAME || pkg.name;
const developerName = process.env.DEVELOPER_NAME || pkg.author.name;
const developerEmail = process.env.DEVELOPER_EMAIL || pkg.author.email;
const bugReportUrl = process.env.DEVELOPER_NAME || pkg.bugs.url;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/src/images/events')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
})
const upload = multer({ storage: storage });

let allQustions = [];

allQustions = _.concat(allQustions, wikipediaChat);
allQustions = _.concat(allQustions, unitConverterChat);
allQustions = _.concat(
  allQustions,
  _.flattenDeep(_.map(supportChat, "questions")),
);
allQustions = _.concat(
  allQustions,
  _.flattenDeep(_.map(mainChat, "questions")),
);

allQustions = _.uniq(allQustions);
allQustions = _.compact(allQustions);

const changeUnit = (amount, unitFrom, unitTo) => {
  try {
    const convertValue = convert(amount).from(unitFrom).to(unitTo);
    const returnMsg = `${amount} ${convert().describe(unitFrom).plural}(${convert().describe(unitFrom).abbr
      }) is equle to ${convertValue} ${convert().describe(unitTo).plural}(${convert().describe(unitTo).abbr
      }).`;

    return returnMsg;
  } catch (error) {
    return error.message;
  }
};

const sendAllQuestions = (req, res) => {
  const humanQuestions = [];

  try {
    allQustions.forEach((qus) => {
      if (qus.length >= 15) {
        if (
          /^(can|are|may|how|what|when|who|do|where|your|from|is|will|why)/gi.test(
            qus,
          )
        ) {
          humanQuestions.push(`${upperCaseFirst(qus)}?`);
        } else {
          humanQuestions.push(`${upperCaseFirst(qus)}.`);
        }
      }
    });
    res.json(_.shuffle(humanQuestions));
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error!", code: 500 });
    console.log(error);
  }
};

const sendWelcomeMessage = (req, res) => {
  res.json({
    responseText: _.sample(welcomeChat),
  });
};

const sendAnswer = async (req, res) => {
  let isFallback = false;
  let responseText = null;
  let rating = 0;
  let action = null;

  try {
    const query = decodeURIComponent(req.query.q).replace(/\s+/g, " ").trim() || "Hello";
    const humanInput = lowerCase(query.replace(/(\?|\.|!)$/gim, ""));

    const regExforUnitConverter = /(convert|change|in).{1,2}(\d{1,8})/gim;
    const regExforWikipedia = /(search for|tell me about|what is|who is)(?!.you) (.{1,30})/gim;
    const regExforSupport = /(invented|programmer|teacher|create|maker|who made|creator|developer|bug|email|report|problems)/gim;

    let similarQuestionObj;

    if (regExforUnitConverter.test(humanInput)) {
      action = "unit_converter";
      similarQuestionObj = stringSimilarity.findBestMatch(
        humanInput,
        unitConverterChat,
      ).bestMatch;
    } else if (regExforWikipedia.test(humanInput)) {
      action = "wikipedia";
      similarQuestionObj = stringSimilarity.findBestMatch(
        humanInput,
        wikipediaChat,
      ).bestMatch;
    } else if (regExforSupport.test(humanInput)) {
      action = "support";
      similarQuestionObj = stringSimilarity.findBestMatch(
        humanInput,
        _.flattenDeep(_.map(supportChat, "questions")),
      ).bestMatch;
    } else {
      action = "main_chat";
      similarQuestionObj = stringSimilarity.findBestMatch(
        humanInput,
        _.flattenDeep(_.map(mainChat, "questions")),
      ).bestMatch;
    }

    const similarQuestionRating = similarQuestionObj.rating;
    const similarQuestion = similarQuestionObj.target;

    if (action == "unit_converter") {
      const valuesObj = extractValues(humanInput, similarQuestion, {
        delimiters: ["{", "}"],
      });

      rating = 1;
      try {
        const { amount, unitFrom, unitTo } = valuesObj;

        responseText = changeUnit(amount, unitFrom, unitTo);
      } catch (error) {
        responseText = "One or more units are missing.";
        console.log(error);
      }
    } else if (action == "wikipedia") {
      const valuesObj = extractValues(humanInput, similarQuestion, {
        delimiters: ["{", "}"],
      });

      let { topic } = valuesObj;
      topic = capitalCase(topic);

      try {
        const wikipediaResponse = await wiki.summary(topic);
        const wikipediaResponseText = wikipediaResponse.extract;

        if (wikipediaResponseText == undefined || wikipediaResponseText == "") {
          responseText = `Sorry, I can't find any article related to "${topic}".`;
          isFallback = true;
        } else {
          responseText = wikipediaResponseText;
        }
      } catch (error) {
        responseText = `Sorry, we can't find any article related to "${topic}".`;
        console.log(error);
      }
    } else if (action == "support") {
      rating = similarQuestionRating;

      if (similarQuestionRating > standardRating) {
        for (let i = 0; i < supportChat.length; i++) {
          for (let j = 0; j < supportChat[i].questions.length; j++) {
            if (similarQuestion == supportChat[i].questions[j]) {
              responseText = _.sample(supportChat[i].answers);
            }
          }
        }
      }
    } else if (
      /(?:my name is|I'm|I am) (?!fine|good)(.{1,30})/gim.test(humanInput)
    ) {
      const humanName = /(?:my name is|I'm|I am) (.{1,30})/gim.exec(humanInput);
      responseText = `Nice to meet you ${humanName[1]}.`;
      rating = 1;
    } else {
      action = "main_chat";

      if (similarQuestionRating > standardRating) {
        for (let i = 0; i < mainChat.length; i++) {
          for (let j = 0; j < mainChat[i].questions.length; j++) {
            if (similarQuestion == mainChat[i].questions[j]) {
              responseText = _.sample(mainChat[i].answers);
              rating = similarQuestionRating;
            }
          }
        }
      } else {
        isFallback = true;
        action = "Default_Fallback";
        if (
          humanInput.length >= 5
          && humanInput.length <= 20
          && !/(\s{1,})/gim.test(humanInput)
        ) {
          responseText = "คุณพิมพ์สุ่มมาใช่ไหม :)";
        } else {
          responseText = _.sample(fallbackChat);
        }
      }
    }

    if (responseText == null) {
      responseText = _.sample(fallbackChat);
      isFallback = true;
    } else if (action != "wikipedia") {
      responseText = responseText
        .replace(/(\[BOT_NAME\])/g, botName)
        .replace(/(\[DEVELOPER_NAME\])/g, developerName)
        .replace(/(\[DEVELOPER_EMAIL\])/g, developerEmail)
        .replace(/(\[BUG_URL\])/g, bugReportUrl);
    }

    res.json({
      responseText,
      query,
      rating,
      action,
      isFallback,
      similarQuestion,
    });
  } catch (error) {
    console.log(error);
    if (error.message.includes("URI")) {
      res.status(500).send({ error: error.message, code: 500 });
    } else {
      res.status(500).send({ error: "Internal Server Error!", code: 500 });
    }
  }
};

const saveJson = async (req, res) => {
  req.on('data', chunk => {
    let body = [];
    body.push(chunk);
    body = Buffer.concat(body).toString();
    let json = JSON.parse(body);

    let outputJson = [];
    // let data = fs.readFileSync('./data.js', { encoding: 'utf-8' });
    // outputJson = JSON.parse(data);
    let datajs = fs.readFileSync('./public/src/json/data.json', 'utf-8');
    outputJson = JSON.parse(datajs);
    outputJson.push(json);
    outputJson = JSON.stringify(outputJson);

    fs.writeFileSync('./public/src/json/data.json', outputJson)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('บันทึกสำเร็จ');
    res.end();
  })
};

const updateJson = async (req, res) => {
  req.on('data', chunk => {
    let body = [];
    body.push(chunk);
    body = Buffer.concat(body).toString();
    var sbody = body.split('+');
    var json = JSON.parse(sbody[0]);
    var num = parseInt(sbody[1]);
    // json = JSON.stringify(json);

    let outputJson = [];
    let spliceJson = [];
    // let data = fs.readFileSync('./data.js', { encoding: 'utf-8' });
    // outputJson = JSON.parse(data);
    let datajs = fs.readFileSync('./public/src/json/data.json', 'utf-8');
    outputJson = JSON.parse(datajs);
    spliceJson = outputJson.splice(num, 1, json);
    outputJson = JSON.stringify(outputJson);

    fs.writeFileSync('./public/src/json/data.json', outputJson)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('อัพเดทสถานะเรียบร้อย');
    res.end();
  })
};

const getJson = async (req, res) => {
  let datajs = fs.readFileSync('./public/src/json/data.json', 'utf-8');
  var dataJsonp = JSON.parse(datajs);
  // console.log(datajs)
  res.type('application/json') // =>'application/json'
  res.send(dataJsonp);
  // res.send(datajs);
};

const mainP = async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}

const loginP = async (req, res) => {
  try {
    const loginHtml = await fs.readFileSync(path.join(__dirname, "public/AdminLogin.html"), "utf8",)
    res.status(200).send(loginHtml);
  } catch (err) {
    const pageNotFoundHtml = await fs.readFileSync(
      path.join(__dirname, "public/404.html"), "utf8",);
    res.status(404).send(pageNotFoundHtml);
    console.log(err);
  }
}

const adminP = async (req, res) => {
  try {
    const mpHtml = await fs.readFileSync(path.join(__dirname, "public/mainpage.html"), "utf8",)
    res.status(200).send(mpHtml);
  } catch (err) {
    const pageNotFoundHtml = await fs.readFileSync(
      path.join(__dirname, "public/404.html"), "utf8",);
    res.status(404).send(pageNotFoundHtml);
    console.log(err);
  }
}

const eventP = async (req, res) => {
  try {
    const mpHtml = await fs.readFileSync(path.join(__dirname, "public/eventpage.html"), "utf8",)
    res.status(200).send(mpHtml);
  } catch (err) {
    const pageNotFoundHtml = await fs.readFileSync(
      path.join(__dirname, "public/404.html"), "utf8",);
    res.status(404).send(pageNotFoundHtml);
    console.log(err);
  }
}

const eventE = async (req, res) => {
  try {
    const mpHtml = await fs.readFileSync(path.join(__dirname, "public/editevent.html"), "utf8",)
    res.status(200).send(mpHtml);
  } catch (err) {
    const pageNotFoundHtml = await fs.readFileSync(
      path.join(__dirname, "public/404.html"), "utf8",);
    res.status(404).send(pageNotFoundHtml);
    console.log(err);
  }
}

const infoP = async (req, res) => {
  try {
    const mpHtml = await fs.readFileSync(path.join(__dirname, "public/info.html"), "utf8",)
    res.status(200).send(mpHtml);
  } catch (err) {
    const pageNotFoundHtml = await fs.readFileSync(
      path.join(__dirname, "public/404.html"), "utf8",);
    res.status(404).send(pageNotFoundHtml);
    console.log(err);
  }
}

const seeAllN = async (req, res) => {
  try {
    const mpHtml = await fs.readFileSync(path.join(__dirname, "public/seeallnews.html"), "utf8",)
    res.status(200).send(mpHtml);
  } catch (err) {
    const pageNotFoundHtml = await fs.readFileSync(
      path.join(__dirname, "public/404.html"), "utf8",);
    res.status(404).send(pageNotFoundHtml);
    console.log(err);
  }
}

const seeAllE = async (req, res) => {
  try {
    const mpHtml = await fs.readFileSync(path.join(__dirname, "public/seeallevents.html"), "utf8",)
    res.status(200).send(mpHtml);
  } catch (err) {
    const pageNotFoundHtml = await fs.readFileSync(
      path.join(__dirname, "public/404.html"), "utf8",);
    res.status(404).send(pageNotFoundHtml);
    console.log(err);
  }
}

const seeAllNa = async (req, res) => {
  try {
    const mpHtml = await fs.readFileSync(path.join(__dirname, "public/sallnewsad.html"), "utf8",)
    res.status(200).send(mpHtml);
  } catch (err) {
    const pageNotFoundHtml = await fs.readFileSync(
      path.join(__dirname, "public/404.html"), "utf8",);
    res.status(404).send(pageNotFoundHtml);
    console.log(err);
  }
}

const seeAllEa = async (req, res) => {
  try {
    const mpHtml = await fs.readFileSync(path.join(__dirname, "public/salleventsad.html"), "utf8",)
    res.status(200).send(mpHtml);
  } catch (err) {
    const pageNotFoundHtml = await fs.readFileSync(
      path.join(__dirname, "public/404.html"), "utf8",);
    res.status(404).send(pageNotFoundHtml);
    console.log(err);
  }
}

const notFound = async (req, res) => {
  try {
    const pageNotFoundHtml = await fs.readFileSync(
      path.join(__dirname, "public/404.html"),
      "utf8",
    );
    res.status(404).send(pageNotFoundHtml);
  } catch (err) {
    res.status(404).send("Page Not Found!");
    console.log(err);
  }
};

const uploadImg = async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('อัพเดทสถานะเรียบร้อย');
  res.end();
};

const login = async (req, res) => {
  req.on('data', chunk => {
    let body = [];
    body.push(chunk);
    body = Buffer.concat(body).toString();
    let json = JSON.parse(body);

    let dataJson = [];
    let datajs = fs.readFileSync('./public/src/json/admin.json', 'utf-8');
    dataJson = JSON.parse(datajs);
    let sta = 0;
    let word;

    for (let i = 0; i < dataJson.length; i++) {
      if (json.username == dataJson[i].username && json.password == dataJson[i].password) {
        sta = 200;
        word = '/AdminPage';
      }
      else {
        sta = 401;
        word = '/AdminLogin';
      }
    }
    return res.status(sta).json({Location : word, status : sta})
  })
};

app.use(cors());
app.use(compression());
app.set("json spaces", 4);
app.use("/api/", morgan("tiny"));
app.get("/api/question", sendAnswer);
app.get("/api/welcome", sendWelcomeMessage);
app.get("/api/allQuestions", sendAllQuestions);
app.use(serveStatic(path.join(__dirname, "public")));
//app.get("*", notFound);
app.get('/', mainP);
app.get("/AdminLogin", loginP);
app.get("/AdminPage", adminP);
app.get("/EventManage", eventP);
app.get("/EventEdit", eventE);
app.get("/seeAllNews", seeAllN);
app.get("/seeAllEvents", seeAllE);
app.get("/seeAllNewsAdmin", seeAllNa);
app.get("/seeAllEventsAdmin", seeAllEa);
app.get("/info", infoP);
app.post("/api/save", saveJson);
app.post("/api/update", updateJson);
app.get("/api/getJson", getJson);
app.post('/api/upload', upload.single('myfile'), uploadImg);
app.post('/api/login', login);

app.listen(port, () => console.log(`app listening on port ${port}!. On http://localhost:${port}`));