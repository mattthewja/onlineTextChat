const root = "http://localhost:3000/"

// frontend functions
function setUsername() {
    username = usernameText.value;
};

function resetUsername() {
    username = "";
    usernameText.value = "";
    usernameButton.disabled = false;
    usernameText.disabled = false;
};

function updateMessages() {
    const messages = fetch(`${root}getMessages`, {
        method: "GET",
        body: JSON.stringify({
            roomId: currentRoomId
        })
    });

    chatbox.innerHTML = "";
    messages.array.forEach(messageData => {
        const chatbox = document.getElementById("chatbox-info");

        const { sender, message } = messageData;
        const messageDiv = document.createElement("div");
        messageDiv.className = "message";

        const userInfo = document.createElement("div");
        userInfo.className = "user-info";
        userInfo.innerHTML = sender;

        const messageInfo = document.createElement("div");
        messageInfo.className = "message-info";
        messageInfo.innerHTML = message;

        messageDiv.appendChild(userInfo);
        messageDiv.appendChild(messageInfo);
        chatbox.appendChild(messageDiv);
    });
};

// backend integration functions
async function createRoom() {
    const res = await fetch(`${root}createRoom`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: roomnameText.value,
            owner: username
        })
    });
    console.log(res.json());
    currentRoomId = res.body.roomId;
    console.log(currentRoomId);
};

async function joinRoom() {
    const res = await fetch(`${root}joinRoom`, {
        method: "POST",
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomId: roomIdText.value,
            username: username
        })
    });

    currentRoomId = res.body.roomId;
}

async function deleteRoom() {
    const res = await fetch(`${root}deleteRoom`, {
        method: "POST", 
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomId: currentRoomId,
            username: username
        })
    });

    currentRoomId = "";
}

async function sendMessage() {
    const res = await fetch(`${root}sendMessage`, {
        method: "POST",
        header: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomId: currentRoomId,
            message: messageText.value,
            username: username
        })
    });

    messageText.value = "";
};

// basic setup
const usernameText = document.getElementById("username-input");
const usernameButton = document.getElementById("username-set-button");
const debugButton = document.getElementById("debug");

const roomIdText = document.getElementById("roomId-input");
const roomIdButton = document.getElementById("roomId-set-button");

const roomnameText = document.getElementById("roomname-input");
const roomCreateButton = document.getElementById("roomname-create-button");

const messageText = document.getElementById("message-input");
const sendMessageButton = document.getElementById("send-message-button");

const chatbox = document.getElementById("chatbox-info");
let username =  "";
let currentRoomId = ""

debugButton.addEventListener("click", () => {
    createRoom();
});

usernameButton.addEventListener("click", () => {
    setUsername();
    console.log(`username set to ${username}`);
    usernameButton.disabled = true;
    usernameText.disabled = true;
});

roomIdButton.addEventListener("click", () => {
    joinRoom();
});

roomCreateButton.addEventListener("click", () => {
    createRoom();
})

sendMessageButton.addEventListener("click", () => {
    sendMessage();
})