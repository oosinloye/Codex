import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;
/*
* implements loader system indicated by three dots
*/
function loader(element){
  element.textContent = '';

  loadInterval = setInterval(() =>{
    element.textContent +='.';

    // resets when dot reaches 3
    if(element.textContent === '....'){ 
      element.textContent = '.';
    }
  }, 300)
}

/*
* implement real time typing of bot
* acts as if ai is thinking and typing
*/

function typetext(element, text){
  let index =0;

  let interval = setInterval(() => {
    // checks if still typing
    if(index < text.length){
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(index);
    }
    
  }, 20)
}

/*
* Uses current time and data for Unique IDs
*/
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

/*
* implements chat icons showing who is talking
* user icon and AI icon
*/
function chatStripe (isAi, value, uniqueId) {
  return (
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">  
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
              />
            </div>
            <div class="message" id =${uniqueId}>${value}</div>
          </div>
        </div> 
    `
  )
}

/*
* User submit function that triggers AI response
*/

const handleSubmit = async (e) => {
  e.preventDefault(); // defualt is to refresh when form submiited - we dont want this

  const data = new FormData(form); // from the form element in HTML

  //user chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

  form.reset();

// bots chatstripe
const uniqueId = generateUniqueId();
chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

// needs to scroll down as user types message
chatContainer.scrollTop = chatContainer.scrollHeight;  

const messageDiv = document.getElementById(uniqueId);

// turn on loader
loader(messageDiv);

// fetch data from server -> bot's response

const response = await fetch('https://codex-j209.onrender.com', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: data.get('prompt')
  })
})

clearInterval(loadInterval);
messageDiv.innerHTML = '';

if(response.ok){
  const data = await response.json();
  const parsedData = data.bot.trim();

  typetext(messageDiv, parsedData);
} else {
  const err = await response.text();

  messageDiv.innerHTML = "Something went wrong";
  alert(err);
}
}



// params( type of event, method hanlding that event)
form.addEventListener('submit', handleSubmit); // waits for submit event function
// handles submit by using ENTER key 
form.addEventListener('keyup', (e) =>{
  if (e.keyCode === 13) { // ENTER key value is 13
    handleSubmit(e); 
  }
})
