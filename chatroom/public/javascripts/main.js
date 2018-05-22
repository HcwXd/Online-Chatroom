var socket = io();

const signInContainer = document.querySelector(".signin-background");
const usernameInput = document.querySelector(".username-input");
const passwordInput = document.querySelector(".password-input");
const signInButton = document.querySelector(".signin-button");

const chatroomContainer = document.querySelector(".chatroom-container");

signInButton.addEventListener("click", () => {
    signInContainer.style.display = "none";
    chatroomContainer.style.display = "flex";
});

socket.on('newConnect', (obj) => {
    console.log(obj);
});

socket.on('message', (obj) => {
    console.log(obj);
});

let data = {
    name: 'Robby',
    msg: 'Hi~',
};

socket.emit('message', data);