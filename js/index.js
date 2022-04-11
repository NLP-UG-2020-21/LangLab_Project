let messages = [], //array that hold the record of each string in chat
    lastUserMessage = '', //keeps track of the most recent input string from the user
    botMessage = '', //var keeps track of what the chatbot is going to say
    botName = 'Eva'; //name of the chatbot

const sendButton = document.getElementById('send-button'); 
const submitButton = document.getElementById('submit-button');

//edit this function to change what the chatbot says
const chatbotResponse = () => {
    let userName = document.getElementById('name-box').value;
    let urlUserMessage = lastUserMessage.replace('/s/g', '%20');
    for (let i = 1; i < 8; i++) {
        if (messages[messages.length - i]) {
            document.getElementById('chatlog' + i).innerHTML =
                messages[messages.length - i];
        }
    }
    Promise.all([
        fetch(
            'https://ai-chatbot.p.rapidapi.com/chat/free?message=' +
                urlUserMessage +
                '%3F&uid=' +
                userName,
            {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': 'ai-chatbot.p.rapidapi.com',
                    'x-rapidapi-key':
                        'c78749d9f1msh0f8f753e4481a33p1d4b75jsn9fb4ac975528',
                },
            }
        ),
        new Promise((resolve) =>
            setTimeout(() => resolve(''), Math.random() * 1000 + 1000)
        ),
    ])
        .then((response) => response[0].json())
        .then((response) => {
            //outputs the last few array elements of messages to html

            botMessage = response['chatbot']['response'];
            //add the chatbot's name and message to the array messages

            messages.push('<b>' + botName + ':</b> ' + botMessage);
            //outputs the last few array elements of messages to html
            for (let i = 1; i < 8; i++) {
                if (messages[messages.length - i]) {
                    document.getElementById('chatlog' + i).innerHTML =
                        messages[messages.length - i];
                }
            }
        });
};

//this runs each time enter is pressed.
//It controls the overall input and output
const newEntry = () => {
    let userName = document.getElementById('name-box').value;
    if (userName === '') {
        alert('You need to input your name!');
    } else {
        //if the message from the user isn't empty then run
        if (document.getElementById('chatbox').value !== '') {
            //pulls the value from the chatbox ands sets it to lastUserMessage
            lastUserMessage = document.getElementById('chatbox').value;
            //sets the chat box to be clear
            document.getElementById('chatbox').value = '';
            //adds the value of the chatbox to the array messages
            messages.push(lastUserMessage);
            //sets the variable botMessage in response to lastUserMessage
            chatbotResponse();
        }
    }
};

// if the key pressed is 'enter' runs the function newEntry()
const keyPress = (event) => {
    const x = event || window.event;
    const key = x.keyCode || x.which;
    if (key === 13 || key === 3) {
        //runs this function when enter is pressed
        newEntry();
    }
    if (key === 38) {
        document.getElementById('chatbox').value = lastUserMessage;
    }
};

sendButton.onclick = (event) => newEntry();

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
    document.getElementById('chatbox').placeholder = '';
}

// hides text input upon clicking on submit button
function toggle() {
    let element = document.getElementById('name-box');
  
    if ( element.style.display!='none' ) {
      element.style.display='none';
    } else {
      element.style.display='';
    }
  }
// disables submit button on click
  submitButton.addEventListener('click', function(event) {
      event.target.disabled = true;
  });
// runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
