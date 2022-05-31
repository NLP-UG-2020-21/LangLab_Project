const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const submitButton = document.getElementById('submit-button');
const BOT_IMG = "images/chatbot_icon.png";
const PERSON_IMG = "images/user_icon.png";
const BOT_NAME = "Eva";
const patterns = [/i(\s\w*){0,3}feel(\s\w*){0,3}(exhausted|tired|depressed)/, /i cannot deal with (\w\s?)+/];

let stageStatus = 0;

const messageManage = () => {
    console.log("CALLED!");
    const msgText = msgerInput.value;
    if (!msgText || stageStatus !== 0) return;
    let userName = document.getElementById('name-box').value;
    if (userName === '') {
        alert('You need to input your name!');
    } else {
        appendMessage(userName, PERSON_IMG, "right", msgText);
        msgerInput.value = "";
        const isMatch = patterns.some(rx => rx.test(msgText));
        if (isMatch) {
            calmebotResponse();
        } else {
            apiResponse(msgText);
        }
    }
}

const handleLaterStage = (arr, stage) => {
    console.log("LATER STAGE called");
    console.log(arr);
    console.log(stage);
    const msgText = msgerInput.value;
    // if (!msgText || stageStatus === 0) return;
    let userName = document.getElementById('name-box').value;
    if (userName === '') {
        alert('You need to input your name!');
        return;
    } else {
        appendMessage(userName, PERSON_IMG, "right", msgText);
        if (msgText === "yes" || stageStatus === 1) {
            msgerInput.value = "";
            return arr[stage];
        } else {
            return false;
        }
    }

}

msgerForm.addEventListener("submit", event => {
    event.preventDefault();
    if (stageStatus === 0) {
        messageManage();
    };
});

function appendMessage(name, img, side, text) {
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

const calmebotResponse = () => {
    let delay = 1000
    fetch("js/corpora.json")
    .then(response => response.json())
    .then(json => {
        let scenario_num = random_scenario(0, (json['main']['calming_scenarios'].length) - 1);
        const scenario_arr = json['main']['calming_scenarios'][scenario_num];
        for (const msg of scenario_arr) {
            console.log(msg);
            if (stageStatus === 0) {
                stageStatus++;
                setTimeout(() => {
                    appendMessage(BOT_NAME, BOT_IMG, "left", msg);
                }, delay);
                delay = delay += 2000;
                console.log("In the condition", stageStatus);
            }
            const answer = handleLaterStage(scenario_arr, stageStatus);
            console.log(answer);
            if (answer) {
                console.log("In the second condition", stageStatus);
                stageStatus++;
                setTimeout(() => {
                    appendMessage(BOT_NAME, BOT_IMG, "left", answer);
                }, delay);
                delay = delay += 2000;
            } else {
                stageStatus = 0;
                return;
            }

        }
    });
}

const apiResponse = (userMessage) => {
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
        const msgText = response['chatbot']['response'];
        setTimeout(() => {
            appendMessage(BOT_NAME, BOT_IMG, "left", msgText);
        }, 2000);
    })
}

// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}

const formatDate = (date) => {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
}

const random_scenario = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

// disables submit button on click
submitButton.addEventListener('click', function(event) {
    event.target.disabled = true;
});

// hides header upon clicking on submit button
const toggle = () => {
    let element = document.getElementById('msger-header');
    if ( element.style.display!=='none' ) {
        appendMessage(BOT_NAME, BOT_IMG, "left", "Hello, I'm Eva! Enter your identification and feel free " +
            "to write what's on your mind. I'll do my best to help you.");
        element.style.display='none';
    } else {
        element.style.display='';
    }
}
