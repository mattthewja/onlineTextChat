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

const messageText = document.getElementById("message-input");
const sendMessageButton = document.getElementById("send-message-button");

const chatbox = document.getElementById("chatbox-info");


let username =  "";
let currentRoomId = "";


let MAX_NAME_LENGTH = 20;

//* Non-server functions
function generateRoomId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
};

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
        alert('Error: username cannot be empty')
        return;
    }

    // logic
    const roomId = generateRoomId();
    socket.emit('createRoom', { roomName: roomName, roomOwner: roomOwner, roomId: roomId});
}

socket.on('createRoomFailure', (message) => {
    alert(`Error: ${message}`);
});
socket.on('createRoomSuccess', (data) => {
    console.log(`Room created at ${data.roomId}:${data.roomName}`);
    alert(`Room created at ${data.roomId}:${data.roomName}`);
    roomIdText.innerHTML = data.roomId;
});


function deleteRoom(roomId, username) {
    // validate 
    if(!roomId) {alert('Error: cannot delete room if not in a room'); return;};
    if(!username) {alert('Error: no username detected'); return;};

    // logic
    socket.emit('deleteRoom', { roomId: roomId, username: username });
}

//* Event listeners.

usernameButton.addEventListener("click", () => {
    updateUsername(usernameText.value);
});

debugButton.addEventListener("click", () => {
});

roomIdButton.addEventListener("click", () => {
});

roomCreateButton.addEventListener("click", () => {
    createRoom(roomnameText.value, username);
})

sendMessageButton.addEventListener("click", () => {
})