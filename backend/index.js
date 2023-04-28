const apiKey = config.GPTapikey;
const serverless = require('serverless-http');

const { Configuration, OpenAIApi } = require("openai");
var cors = require("cors");
const express = require("express");
const app = express();

const time = new Date();
const month = time.getMonth() + 1;
const day = time.getDate();

const configuration = new Configuration({
  apiKey: apiKey,
});
const openai = new OpenAIApi(configuration);

let tem

fetch(`https://api.openweathermap.org/data/2.5/weather?q=Daejeon&appid=${config.Wetherapikey}`)
      .then(Response => Response.json())
      .then(data => {
      tem = (data['main']['temp'] - 273.15).toFixed(1);
      console.log(tem);
  })  

// CORS 이슈 해결
let corsOptions = {
  origin: 'https://jaehwis-pj.pages.dev',
  credentials: true
}

app.use(cors(corsOptions));

//POST 요청 받을 수 있게 만듬
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// POST method route
app.post("/fortuneTell", async function (req, res) {
  let { MyData, userMessages, assistantMessages } = req.body;

  let messages = [
    {role: "system",content:"당신은 세계 최고의 패셔니스타입니다. 당신이 답변을 할 수 없는 질문은 없고 모든 질문에 명확한 답변을 해 줄 수 있습니다. 또한, 당신의 이름은 챗셔니스타이며, 당신은 성별과 오늘의 날짜 및 온도에 따라 옷차림을 추천해줄 수 있고 최근 유행을 잘 알고 있으며 어떠한 체형이던지 모든 사람에게 잘 어울릴만한 옷을 추천해 줄 수 있습니다.",},
    {role: "user",content:"당신은 세계 최고의 패셔니스타입니다. 당신이 답변을 할 수 없는 질문은 없고 모든 질문에 명확한 답변을 해 줄 수 있습니다. 또한, 당신의 이름은 챗셔니스타이며, 당신은 성별과 오늘의 날짜 및 온도에 따라 옷차림을 추천해줄 수 있고 최근 유행을 잘 알고 있으며 어떠한 체형이던지 모든 사람에게 잘 어울릴만한 옷을 추천해 줄 수 있습니다. ",},
    {role: "assistant",content:"안녕하세요! 저는 챗셔니스타입니다. 오늘은 뭘 입을지 고민되시나요? 어떤것이든 물어보세요, 최선을 다해 답변해드리겠습니다.",},
    { role: "user", content: `오늘은 ${month}월 ${day}일이고 온도는 ${tem}도야.` },
    {role: "assistant",content:`오늘은 ${month}월 ${day}일이며, 온도는 ${tem}도이고 약간 따뜻한 날씨입니다.`,},
    { role: "user", content: `오늘 뭘 입고 나갈까? 내 성별과 키와 몸무게는 ${MyData}야. 내가 오늘 입고 나갈 전체적인 코디를 알려줘. 아 그리고 코디 정보는 예를 들어 '스트라이프 셔츠'와 같이 옷의 정보와 색감 등을 최근 트렌드에 맞게 자세하게 말해줘. 또 최대한 간결하게 말해줬으면 좋겠어` },
    {role: "assistant",content:`당신의 성별, 키, 몸무게는 ${MyData}인 것을 확인하였습니다. 당신은 조금 마른 체형인 것 같아요. 남성, 마른 체형에 어울릴 만한 옷을 추천해드릴게요!`,},
  ];

  while (userMessages.length != 0 || assistantMessages.length != 0) {
    if (userMessages.length != 0) {
      messages.push(
        JSON.parse('{"role": "user", "content": "' + String(userMessages.shift()).replace(/\n/g, "") +'" }')
      );
    }
    if (assistantMessages.length != 0) {
      console.log(assistantMessages)

      messages.push(
        JSON.parse(
          '{"role": "assistant", "content": "' +
            String(assistantMessages.shift()).replace(/\n/g, "\r\n") +
            '" }'
        )
      );
    }
  }

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages,
  });
  let fortune = completion.data.choices[0].message["content"];
  console.log(fortune);

  res.json({ assistant: fortune });
});


module.exports.handler = serverless(app);
// app.listen(3000);
