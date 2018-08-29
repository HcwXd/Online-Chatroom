const currentUsername = document.querySelector('.users-name').textContent.trim();
let currentChatUsername = 'slackbot';
const loader = document.querySelector('.loader');

// Tell server this user is online, server will
// 1. Update the status of this user in DB and
// 2. Tell other online users to update their contact status
socket.emit('online', currentUsername);

// Tell server to emit all user's status
socket.emit('getUserInfo');

// Tell server to emit the conversation with currentChatUser
socket.emit('getConversationInfo', currentUsername, currentChatUsername);

socket.on('getUserInfo', (socketOn_userInfo) => {
    loader.classList.add('loader_hide');
    renderUserInfo(socketOn_userInfo);
});

socket.on('getConversationInfo', (socketOn_conversationInfo) => {
    loader.classList.add('loader_hide');
    renderConversation(socketOn_conversationInfo);
});

socket.on('updateUserInfo', () => {
    socket.emit('getUserInfo');
});

socket.on('newMessage', () => {
    socket.emit('getConversationInfo', currentUsername, currentChatUsername);
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
    currentChatUsername = chatUsername;
    const isOnline = this.classList.contains('inactive') ? false : true;
    renderChatHeader(chatUsername, isOnline);

    socket.emit('getConversationInfo', currentUsername, currentChatUsername);
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
        .map(({ fromName, msg, time }) => {
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
    socket.emit('newMessage', currentUsername, currentChatUsername, msgContent);
    document.querySelector('.send-content').value = '';
}

function scrollWindow() {
    let chatContentList = document.querySelector('.chat-content-list');
    chatContentList.scrollTo(0, chatContentList.scrollHeight);
}

// Remove notification after 3 secs
setTimeout(() => document.querySelector('.noti-container').remove(), 3000);
