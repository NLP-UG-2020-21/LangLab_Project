const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const submitButton = document.getElementById('submit-button');

// Icons made by Freepik from www.flaticon.com
const BOT_IMG = "images/chatbot_icon.png";
const PERSON_IMG = "images/user_icon.png";
const BOT_NAME = "BOT";
const PERSON_NAME = "Sajad";

msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;
    let userName = document.getElementById('name-box').value;
    if (userName === '') {
        alert('You need to input your name!');
    } else {
        appendMessage(PERSON_NAME, PERSON_IMG, "right", msgText);
        msgerInput.value = "";

        botResponse(msgText);
    }
});

function appendMessage(name, img, side, text) {
    //   Simple solution for small apps
    const msgHTML = `
    <div class="msg ${side}-msg">
        <div class="msg-img" style="background-image: url(${img})"></div>

        <div class="msg-bubble">
        <div class="msg-info">
            <div class="msg-info-name">${name}</div>
            <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>
        <div class="msg-text">${text}</div>
        </div>
    </div>
    `;
    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}


const patterns = [/i feel\s?\w+\s(exhausted|tired|depressed)/, /i can not deal with/, /dasdasd/]


function botResponse(userMessage) {
    // const r = random(0, BOT_MSGS.length - 1);
    let userName = document.getElementById('name-box').value;
    let urlUserMessage = userMessage.replace(/\s/g, '%20');


    fetch('https://ai-chatbot.p.rapidapi.com/chat/free?message=' + urlUserMessage + '%3F&uid=' + userName,
        {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'ai-chatbot.p.rapidapi.com',
                'x-rapidapi-key':
                    'c78749d9f1msh0f8f753e4481a33p1d4b75jsn9fb4ac975528',
            },
        }
    )
    .then((response) => response.json())
    .then((response) => {
        //outputs the last few array elements of messages to html
        const msgText = response['chatbot']['response'];
        const delay = msgText.split(" ").length * 100;
        setTimeout(() => {
            appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
        }, delay);
    })
}

// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

function formatDate(date) {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();

    return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// disables submit button on click
submitButton.addEventListener('click', function(event) {
    event.target.disabled = true;
});

// hides text input upon clicking on submit button
function toggle() {
    let element = document.getElementById('name-box');

    if ( element.style.display!=='none' ) {
      element.style.display='none';
    } else {
      element.style.display='';
    }
}
