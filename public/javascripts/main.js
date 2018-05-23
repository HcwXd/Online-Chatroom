var socket = io();

const signInContainer = document.querySelector(".signin-background");


const chatroomContainer = document.querySelector(".chatroom-container");
const signInButton = document.querySelector(".signin-button");


var friendList = [];
var userName = "";
var startPolling = false;

signInButton.addEventListener("click", () => {
    userName = document.querySelector('.username-input').value;
    var exist = friendList.find((element) => {
        return element.name === userName;
    });

    if (!userName) {
        alert('Please Enter username');
    } else if (!exist) {
        alert('Sorry! Only Andy Tsia, Kevin Huang, Steve Jobs, David Hu, Mark Lee are available now');
    } else {
        signInContainer.style.display = "none";
        chatroomContainer.style.display = "flex";

        document.querySelector('.users-name').innerHTML = userName;
        if (friendList.length > 0) {
            renderFriend(friendList, userName);
        }
        var userIndex = friendList.findIndex((element) => {
            return element.name === userName;
        })
        friendList[userIndex].status = "active";
        socket.emit('userLogIn', userName, friendList);
        startPolling = true;
        var contact = document.querySelectorAll(".contact");
        contact.forEach((element) => {
            element.addEventListener("click", renderChatContent)
        });
        renderSlackbotOpening();

    }
});

// setInterval(() => {
//     if (startPolling) {
//         socket.emit('userLogIn', userName, friendList);
//         socket.emit('updateFriendsStatus', userName, friendList);
//         renderFriend(friendList, userName);

//         var contact = document.querySelectorAll(".contact");
//         contact.forEach((element) => {
//             element.addEventListener("click", renderChatContent)
//         });
//     }
// }, 2000);




socket.on('renderFriendList', obj => {
    friendList = obj;
    renderFriend(friendList, userName);
})

socket.on('newConnect', (obj) => {

});

socket.on('history', (obj) => {

    if (obj.length > 0) {
        appendData(obj);
    }
});

socket.on('message', (obj) => {
    appendData([obj]);
});


function renderSlackbotOpening() {
    var chatName = "slackbot";
    var chatIndex = friendList.findIndex((element) => {
        return element.name === chatName;
    })

    let chatroomHTML = '';
    chatroomHTML +=
        `
        <div class="chat-header">
            <div class="chat-name">${chatName}</div>
            <div class="chat-status">● | active</div>
        </div>
        <div class="chat-content-list">
        </div>
        <div class="send-box">
            <input class="send-content" type="text" placeholder="message @ ..." />
            <button class="send-button">></button>
        </div>
        `;
    const contentContainer = document.querySelector(".content-container");
    contentContainer.innerHTML = chatroomHTML.trim();

    socket.emit('loadHistory', userName, chatName);

    var usernameInput = document.querySelector(".username-input");
    var passwordInput = document.querySelector(".password-input");
    var sendButton = document.querySelector(".send-button");
    sendButton.addEventListener('click', () => {
        Send();
    });
}






function renderChatContent() {
    var chatName = this.firstElementChild.nextElementSibling.innerHTML;


    var chatIndex = friendList.findIndex((element) => {
        return element.name === chatName;
    })

    let chatroomHTML = '';
    chatroomHTML +=
        `
        <div class="chat-header">
            <div class="chat-name">${chatName}</div>
        `;
    if (friendList[chatIndex].status === "active") {
        chatroomHTML +=
            `
                <div class="chat-status">● | active</div>
            </div>
            <div class="chat-content-list">
            </div>
            `;
    } else {
        chatroomHTML +=
            `
                <div class="chat-status chat-away">● | away</div>
            </div>
            <div class="chat-content-list">
            </div>
            `;
    }

    chatroomHTML +=
        `
            <div class="send-box">
                <input class="send-content" type="text" placeholder="message @ ..." />
                <button class="send-button">></button>
            </div>
        `;
    const contentContainer = document.querySelector(".content-container");
    contentContainer.innerHTML = chatroomHTML.trim();

    socket.emit('loadHistory', userName, chatName);

    var usernameInput = document.querySelector(".username-input");
    var passwordInput = document.querySelector(".password-input");
    var sendButton = document.querySelector(".send-button");
    sendButton.addEventListener('click', () => {
        Send();
    });
}

function appendData(obj) {
    let chatContentList = document.querySelector('.chat-content-list');
    let html = chatContentList.innerHTML;
    let chatName = document.querySelector(".chat-name").innerHTML;

    obj.forEach(element => {
        if ((element.fromName === userName && element.toName === chatName) || (element.fromName === chatName && element.toName === userName)) {
            html +=
                `
            <div class="msg-item">
                <img class="msg-pic" src="http://icons.iconarchive.com/icons/iconsmind/outline/512/Cat-icon.png" />
                <div class="msg-row">
                    <div class="msg-header">
                        <div class="msg-name">${element.fromName}</div>
                        <div class="msg-time">${moment(element.time).fromNow()}</div>
                    </div>
                    <div class="msg-content">${element.msg}</div>
                </div>
            </div>
            `;

        }

    });
    chatContentList.innerHTML = html.trim();
    scrollWindow();
}

function renderFriend(obj, userName) {
    let friendList = document.querySelector('.dm-contact-list');
    let friendHtml = '';
    friendHtml +=
        `
                <div class="header">Direct Message</div>
                <div class="contact">
                    <div class="status">♥</div>
                    <div class="name">slackbot</div>
                </div>
                <div class="contact">
                    <div class="status">●</div>
                    <div class="name">${userName}</div>
                </div>
            `;

    obj.forEach(element => {
        if (element.name !== userName && element.name !== "slackbot") {
            if (element.status === "active") {
                friendHtml +=
                    `
                    <div class="contact">
                    `;
            } else {
                friendHtml +=
                    `
                    <div class="contact inactive">
                    `;
            }
            friendHtml +=
                `         
                    <div class="status">●</div>
                    <div class="name">${element.name}</div>
                `;
            if (element.notification > 0) {
                friendHtml +=
                    `
                        <div class="notification">${element.notification}</div>
                    </div>
                    `;
            } else {
                friendHtml +=
                    `
                    </div>
                    `;
            }
        }
    });
    friendList.innerHTML = friendHtml;
    // friendList.innerHTML = html.trim();

}

var sendButton = document.querySelector(".send-button");
sendButton.addEventListener('click', () => {
    Send();
});



function Send() {

    let fromName = userName;
    let toName = document.querySelector(".chat-name").innerHTML;
    let msg = document.querySelector('.send-content').value;
    if (!msg) {
        alert('請輸入訊息');
        return;
    }
    let data = {
        fromName: fromName,
        toName: toName,
        msg: msg,
    };
    socket.emit('message', data);
    document.querySelector('.send-content').value = '';
}

function scrollWindow() {
    let chatContentList = document.querySelector('.chat-content-list');
    chatContentList.scrollTo(0, chatContentList.scrollHeight);
}