let userMessages = [];
let assistantMessages = [];
let MyData = '';

const chatBox = document.querySelector(".chat-box");

function start(){
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const weight = document.getElementById('weight').value;
  const height = document.getElementById('height').value;

  if(weight ===''){
    alert('몸무게를 입력해주세요.')
    return;
  }

  if(height ===''){
    alert('키를 입력해주세요.')
    return;
  }
  MyData = gender + ", " + height + "cm, " + weight + "kg";
  
  document.getElementById('intro').style.display = "none";
  document.getElementById('chat').style.display = "block";
}

const sendMessage = async () => {
  const chatInput = document.querySelector(".chat-input input");
  const chatMessage = document.createElement("div");
  chatMessage.classList.add("chat-message");
  chatMessage.innerHTML = `<p>${chatInput.value}</p>`;
  chatBox.appendChild(chatMessage);

  //User 메세지 추가
  userMessages.push(chatInput.value);
  chatInput.value = '';

  const response = await fetch("https://pux6485oka.execute-api.ap-northeast-2.amazonaws.com/prod/fortuneTell", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      MyData: MyData,
      userMessages: userMessages,
      assistantMessages: assistantMessages,
    })
  });

  console.log(chatInput.value)

  const data = await response.json();
  document.getElementById('loder').style.display = 'none';

  const astrologerMessage = document.createElement("div");
  astrologerMessage.classList.add("chat-message");
  astrologerMessage.innerHTML = `<p class='assistant'>${data.assistant}</p>`;
  chatBox.appendChild(astrologerMessage);
};

function spiner(){
  document.getElementById('loder').style.display = 'block';
}
    
const sendButton = document.querySelector(".chat-input button");
const chatInput = document.querySelector(".chat-input input");

sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => {
  if (e.key === 'Enter') {
    sendMessage();
    spiner();
  }
});
