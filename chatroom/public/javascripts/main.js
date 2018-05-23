var socket = io();

const signInContainer = document.querySelector(".signin-background");
const usernameInput = document.querySelector(".username-input");
const passwordInput = document.querySelector(".password-input");
const signInButton = document.querySelector(".signin-button");
const sendButton = document.querySelector(".send-button");

const chatroomContainer = document.querySelector(".chatroom-container");

signInButton.addEventListener("click", () => {
    signInContainer.style.display = "none";
    chatroomContainer.style.display = "flex";
});

socket.on('newConnect', (obj) => {
    console.log(obj);
});

socket.on('history', (obj) => {
    if (obj.length > 0) {
        appendData(obj);
    }
});

socket.on('message', (obj) => {
    console.log(obj);
    appendData([obj]);
});

function appendData(obj) {

    let chatContentList = document.querySelector('.chat-content-list');
    let html = chatContentList.innerHTML;

    obj.forEach(element => {
        html +=
            `
            <div class="msg-item">
                <img class="msg-pic" src="http://icons.iconarchive.com/icons/iconsmind/outline/512/Cat-icon.png" />
                <div class="msg-row">
                    <div class="msg-header">
                        <div class="msg-name">${element.name}</div>
                        <div class="msg-time">${moment(element.time).fromNow()}</div>
                    </div>
                    <div class="msg-content">${element.msg}</div>
                </div>
            </div>
            `;
    });
    chatContentList.innerHTML = html.trim();
    scrollWindow();
}

sendButton.addEventListener('click', () => {
    Send();
});

function Send() {

    let name = "David Hu";
    let msg = document.querySelector('.send-content').value;
    if (!msg && !name) {
        alert('請輸入大名和訊息');
        return;
    }
    let data = {
        name: name,
        msg: msg,
    };
    socket.emit('message', data);
    document.querySelector('.send-content').value = '';
}

function scrollWindow() {
    let chatContentList = document.querySelector('.chat-content-list');
    chatContentList.scrollTo(0, chatContentList.scrollHeight);
}