//* DOM, Constants, States

const root = "http://localhost:3000/";
const socket = io(`${root}`);


const usernameText = document.getElementById("username-input");
const usernameButton = document.getElementById("username-set-button");
const debugButton = document.getElementById("debug");

const roomIdText = document.getElementById("roomId-input");
const roomIdButton = document.getElementById("roomId-set-button");

const roomnameText = document.getElementById("roomname-input");
const roomCreateButton = document.getElementById("roomname-create-button");
const roomDeleteButton = document.getElementById("room-delete-button");
const roomLeaveButton = document.getElementById("room-leave-button");

const messageText = document.getElementById("message-input");
const sendMessageButton = document.getElementById("send-message-button");

const chatbox = document.getElementById("chatbox-info");


let username =  "";
let currentRoomId = "";
let messages = [];


let MAX_NAME_LENGTH = 20;


//* Non-server functions

function renderMessages({ message, username }) {
    // TODO
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';

    const userInfo = document.createElement('div');
    userInfo.className = 'user-info';
    userInfo.textContent = username;

    const messageInfo = document.createElement('div');
    messageInfo.className = 'message-info';
    messageInfo.textContent = message;

    messageDiv.appendChild(userInfo);
    messageDiv.appendChild(messageInfo);
    chatbox.appendChild(messageDiv);

    chatbox.scrollTop = chatbox.scrollHeight;
}


function updateUsername(newName) {
    // validation
    if(!newName) {
        alert('Error: username cannot be empty');
        return;
    };
    if(newName.length > MAX_NAME_LENGTH) {
        alert('Error: username is too long');
        return;
    };
    if(currentRoomId) {
        alert('Error: cannot change username whilst in a room');
        return;
    };

    // logic
    username = newName;
    console.log(`Username changed to '${username}'`);
};

//* Server functions
function createRoom(roomName, roomOwner) {
    // validation
    if(!roomName) {
        alert('Error: room name cannot be empty');
        return;
    };
    if(roomName.length > MAX_NAME_LENGTH) {
        alert('Error: room name is too long');
        return;
    };
    if(!username) {
        alert('Error: username cannot be empty');
        return;
    };
    if(currentRoomId) {
        alert('Error: cannot create a room whilst in a room');
        return;
    }

    // logic
    socket.emit('createRoom', { roomName: roomName, roomOwner: roomOwner });
};

socket.on('createRoomFailure', (message) => {
    alert(`Error: ${message}`);
});
socket.on('createRoomSuccess', (room) => {
    console.log(`Room created at ${room.roomId}:${room.name} with owner ${room.owner}`);
    roomIdText.value = room.roomId;
    currentRoomId = room.roomId;
});


function deleteRoom(roomId, username) {
    // validate 
    if(!roomId) {alert('Error: cannot delete room if not in a room'); return;};
    if(!username) {alert('Error: no username detected'); return;};

    // logic
    socket.emit('deleteRoom', { roomId: roomId, username: username });
};

socket.on('deleteRoomFailure', (data) => {
    alert(`Error: ${data.message}`);
});
socket.on('deleteRoomSuccess', (data) => {
    alert(`Success: ${data.message}`);
});


function joinRoom(roomId, username) {
    // validate
    if(!roomId) {alert('Error: room not found'); return;};
    if(!username) {alert('Error: no username detected'); return;};

    // clear chatbox
    chatbox.innerHTML = '';

    // logic
    socket.emit('joinRoom', { roomId: roomId, username: username });
};

socket.on('joinRoomFailure', (data) => {
    alert(`Error: ${data.message}`);
});
socket.on('joinRoomSuccess', (data) => {
    currentRoomId = data.roomId;
    roomIdText.value = data.roomId;
    roomnameText.value = data.roomName;
    console.log(`Joined room: ${data.roomId}:${data.roomName}`);
});


function leaveRoom(roomId, username) {
    // validate
    if(!roomId) {alert('Error: room not found'); return;};
    if(!username) {alert('Error: no username detected'); return;};

    // logic
    socket.emit('leaveRoom', { roomId: roomId, username: username });
};

socket.on('leaveRoomFailure', (data) => {
    alert(`Error: ${data.message}`);
});
socket.on('leaveRoomSuccess', (data) => {
    roomIdText.value = '';
    roomnameText.value ='';
    currentRoomId = '';
    console.log(`Left room ${data.roomName}`);
});


//* Real-Time in room Texting
function sendMessage(messageData, username) {
    // validate
    if(!currentRoomId) {alert('Error: not currently in a room'); return;};

    messageText.value = '';

    const message = { message: messageData, username: username };

    // local push
    messages.push(message);
    renderMessages(message);

    // socket
    socket.emit('sendMessage', 
        { message: message, roomId: currentRoomId }
    );
};

socket.on('newMessage', (data) => {
    console.log(data.message)
    messages.push(data.message);
    renderMessages(data.message);
});

//* Event listeners.

usernameButton.addEventListener("click", () => {
    updateUsername(usernameText.value);
});

debugButton.addEventListener("click", () => {
});

roomIdButton.addEventListener("click", () => {
    joinRoom(roomIdText.value, username);
});

roomLeaveButton.addEventListener("click", () => {
    leaveRoom(roomIdText.value, username);
})

roomCreateButton.addEventListener("click", () => {
    createRoom(roomnameText.value, username);
});

roomDeleteButton.addEventListener("click", () => {
    deleteRoom(roomIdText.value, username);
})

sendMessageButton.addEventListener("click", () => {
    sendMessage(messageText.value, username);
});