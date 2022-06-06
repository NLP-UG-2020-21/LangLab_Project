const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const submitButton = document.getElementById('submit-button');
const BOT_IMG = "images/chatbot_icon.png";
const PERSON_IMG = "images/user_icon.png";
const BOT_NAME = "Eva";
const patterns = [/i(\s\w*){0,3}feel(\s\w*){0,3}(exhausted|tired|depressed)/, /i cannot deal with (\w\s?)+/];

let stageStatus = 0;
let currentScenarioArr = [];

const resetCalmebotConversation = () => {
    stageStatus = 0;
    currentScenarioArr = [];
}

const preprocessing = (msgText) => {
    msgText = msgText.replace(/[!\.@#$%^&,*`~()}:;\|{"<>/?\\]/g,'')
        .replace(/'m/g,' am').replace(/'s/g,' is').replace(/'re/g,' are').replace(/'ve/g,' have').toLowerCase()
    return msgText
}

const messageManage = () => {
    let msgText = msgerInput.value;
    let msgTextPreprocessed = preprocessing(msgText)
    if (!msgText) return;
    let userName = document.getElementById('name-box').value;
    if (userName === '') {
        alert('You need to input your name!');
    } else {
        appendMessage(userName, PERSON_IMG, "right", msgText);
        msgerInput.value = "";
        if (stageStatus > 0) {
            handleCalmebotStage(stageStatus, msgTextPreprocessed);
        } else {
            const isMatch = patterns.some(rx => rx.test(msgTextPreprocessed));
            if (isMatch) {
                calmebotResponse();
            } else {
                apiResponse(msgTextPreprocessed);
            }
        }
    }
}

const handleCalmebotStage = (stage, msgText) => {
    if (stage !== 0 && !msgText.match(/(yes|yep|yup|yeah|ok|okay|great|agreed|yo|absolutely|indeed|yes please|good|fine|sure|definitely|right|(that is right)|alright|mhm|yea|true|(all right)|allright|surely|(sure thing)|naturally|(why not)|(we can)|(we can do that)|(that would be great)|(that would be amazing)|(great idea))/i)) {
        setTimeout(() => {
            const answerDecline = ["Is there anything you'd like to talk about?",
                "Would you like to talk about something else?", "Maybe there is something you want to share with me.",
                "Is there something you want to discuss?",
                "Feel free to tell me more about your feelings when you're ready.",
                "What would you like to talk about?", "I'm sure we'll find another topic to discuss.",
                "Write me if you feel ready to share your feelings, I really could help you.",
                "Would you like to change the topic?", "I'm always there for you, remember that."]
            let randomAnswerDecline = random_scenario(0, (answerDecline.length) - 1);
            appendMessage(BOT_NAME, BOT_IMG, "left", answerDecline[randomAnswerDecline]);
        }, 2000);
        resetCalmebotConversation();
        return;
    }
    const messageToAppend = currentScenarioArr[stage];
    setTimeout(() => {
        appendMessage(BOT_NAME, BOT_IMG, "left", messageToAppend);
    }, 2000);
    stageStatus++;
    if (stage >= currentScenarioArr.length - 1) resetCalmebotConversation();
}

msgerForm.addEventListener("submit", event => {
    event.preventDefault();
    messageManage();
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
    fetch("js/corpora.json")
    .then(response => response.json())
    .then(json => {
        let scenario_num = random_scenario(0, (json['main']['calming_scenarios'].length) - 1);
        const scenario_arr = json['main']['calming_scenarios'][scenario_num];
        currentScenarioArr = [].concat(scenario_arr);
        handleCalmebotStage(0, "");
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
        appendMessage(BOT_NAME, BOT_IMG, "left", "Hello, I'm Eva! Feel free to write what's on your mind. " +
            "I'll do my best to help you.");
        element.style.display='none';
    } else {
        element.style.display='';
    }
}
