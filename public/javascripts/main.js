const currentUsername = document.querySelector('.users-name').textContent.trim();
let currentChatUser = 'slackbot';
const loader = document.querySelector('.loader');

socket.emit('online', currentUsername);
socket.emit('enterChatroom');
socket.emit('enterConversation', currentUsername, currentChatUser);

socket.on('getUserInfo', (socketOn_userInfo) => {
    loader.classList.add('loader_hide');
    renderUserInfo(socketOn_userInfo);
});

socket.on('updateUserInfo', () => {
    socket.emit('enterChatroom');
});

socket.on('newMessage', () => {
    socket.emit('enterConversation', currentUsername, currentChatUser);
});

socket.on('getConversationInfo', (socketOn_conversationInfo) => {
    loader.classList.add('loader_hide');
    renderConversation(socketOn_conversationInfo);
});

function renderUserInfo(userInfo) {
    const contact_container_node = document.querySelector('.contact-container');
    contact_container_node.innerHTML = '';
    contact_container_node.appendChild(returnSingleContactNode('slackbot', true));
    userInfo.forEach(({ username, isOnline }) => {
        if (username !== currentUsername) {
            contact_container_node.appendChild(returnSingleContactNode(username, isOnline));
        }
    });
}

function returnSingleContactNode(username, isOnline) {
    const contact_node = document.createElement('div');
    contact_node.className = isOnline ? 'contact' : 'contact inactive';

    const status_node = document.createElement('div');
    status_node.className = 'status';
    status_node.textContent = '●';

    const name_node = document.createElement('div');
    name_node.className = 'name';
    name_node.textContent = username;

    contact_node.appendChild(status_node);
    contact_node.appendChild(name_node);
    contact_node.addEventListener('click', enterConversation);
    return contact_node;
}

function enterConversation() {
    loader.classList.remove('loader_hide');
    const chatUsername = this.querySelector('.name').textContent;
    currentChatUser = chatUsername;
    const isOnline = this.classList.contains('inactive') ? false : true;
    renderChatHeader(chatUsername, isOnline);

    socket.emit('enterConversation', currentUsername, currentChatUser);
}

function renderChatHeader(chatUsername, isOnline) {
    document.querySelector('.chat-name').textContent = chatUsername;
    document.querySelector('.chat-status').textContent = isOnline ? '● | active' : '● | away';
    if (!isOnline) {
        document.querySelector('.chat-status').classList.add('chat-away');
    } else {
        document.querySelector('.chat-status').classList.remove('chat-away');
    }
}

function renderConversation(conversationInfo) {
    document.querySelector('.chat-content-list').innerHTML = conversationInfo
        .map(({ fromName, toName, msg, time }) => {
            return `
        <div class="msg-item">
            <img class="msg-pic" src="http://icons.iconarchive.com/icons/iconsmind/outline/512/Cat-icon.png" />
            <div class="msg-row">
                <div class="msg-header">
                    <div class="msg-name">${fromName}</div>
                    <div class="msg-time">${moment(time).fromNow()}</div>
                </div>
                <div class="msg-content">${msg}</div>
            </div>
        </div>
        `;
        })
        .join('');
    scrollWindow();
}

document.querySelector('.send-button').addEventListener('click', sendMessage);
document.querySelector('.send-content').addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        sendMessage();
    }
});
function sendMessage() {
    let msgContent = document.querySelector('.send-content').value;
    if (msgContent.length < 1) {
        return;
    }
    socket.emit('sendMessage', currentUsername, currentChatUser, msgContent);
    document.querySelector('.send-content').value = '';
}

function scrollWindow() {
    let chatContentList = document.querySelector('.chat-content-list');
    chatContentList.scrollTo(0, chatContentList.scrollHeight);
}

setTimeout(() => document.querySelector('.noti-container').remove(), 3000);
