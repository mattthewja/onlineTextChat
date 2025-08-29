// backend/index.js
const express = require('express'); // Import express from library. Framework for creating servers and routes
const http = require('http'); // For socket.io
const { join } = require('node:path'); // For socket.io
const { Server } = require('socket.io'); // Import Server from socket.io for our Server

const app = express(); // Create an express instance called app. Used to define routes, middleware, and configure server
const server = http.createServer(app);
const io = new Server(server); // Create socket.io

const PORT = 3000; // Defines port number for server. In this case: http://localhost:3000
app.locals.io = io;

//* Dev Tools
const devMode = true;

//* Storage
const rooms = devMode ? require('./seed') : {}; // This is where we store our rooms
app.locals.rooms = rooms;

//* io
app.use(express.json()); // Tells app to automatically parse JSON in incoming requests. 
app.use(express.static('../frontend'));

app.get('/', (req, res) => { 
    res.json({ message: 'Backend is working' }); 
});

//* HTTP polling



//* Real-time * Socket

io.on('connection', (socket) => {
    console.log('a user connected to the network');
    socket.on('disconnect', () => {
        console.log('a user disconnected from the network');
    });

    // Socket integration
    socket.on('createRoom', (data) => {
        const room = {
            roomId: data.roomId,
            name: data.roomName,
            owner: data.roomOwner,
            users: new Set([data.roomOwner])
        };
        // validate collision
        if(rooms[data.roomId]) {
            socket.emit('createRoomFailure', { message: 'ID Collision, please try again'});
            return;
        }
        rooms[data.roomId] = room;
        socket.emit('createRoomSuccess', room);
        socket.join(data.roomId);
    })

    socket.on('deleteRoom', (data) => {
        // validate
        if(!rooms[data.roomId]) {
            socket.emit('deleteRoomFailure', 
                { message: 'no room with roomId found'}
            );
            return;
        };
        const room = rooms[data.roomId];
        if(data.username != room.owner) {
            socket.emit('deleteRoomFailure', 
                { message: `you are not the room owner. The owner is ${room.owner} and you are ${data.username}` }
            );
            return;
        }

        // logic
        delete rooms[data.roomId];
        socket.emit('deleteRoomSuccess',
            { message: `Deleted room: ${room.roomId}:${room.name}` }
        );
        socket.leave(room.roomId);
    });


    socket.on('joinRoom', (data) => {
        // validate
        if(!rooms[data.roomId]) {
            socket.emit('joinRoomFailure', 
                { message: 'no room with roomId found'}
            );
            return;
        };
        const room = rooms[data.roomId];
        if(room.users.has(data.username)) {
            socket.emit('joinRoomFailure', 
                { message: 'username already taken'}
            );
            return;
        };

        // logic
        room.users.add(data.username);
        socket.join(room.roomId);
        socket.emit('joinRoomSuccess', { roomId: room.roomId, roomName: room.name });
        socket.to(room.roomId).emit('userJoinedRoom', { message: `user ${data.username} has joined the room`});
    })


    socket.on('leaveRoom', (data) => {
        // validate
        if(!rooms[data.roomId]) {
            socket.emit('leaveRoomFailure', 
                { message: 'no room with roomId found'}
            );
            return;
        };
        const room = rooms[data.roomId];
        
        // logic --- combine logic with validation by checking for user in room
        if(room.users.has(data.username)) {
            socket.leave(room.roomId);
            socket.emit('leaveRoomSuccess', { roomName: room.name });
            socket.to(room.roomId).emit('userLeftRoom', { message: `user ${data.username} has left the room`});
            room.users.delete(data.username);
            return;
        }

        socket.emit('leaveRoomFailure', 
            { message: `you cannot leave a room you are not a part of`}
        );
    });


    socket.on('sendMessage', (data) => {
        socket.to(data.roomId).emit('newMessage', data);
    })
});



//* Required for server to run. This opens the express app to be contactable.

// used to be app.listen...
server.listen(PORT, () => { // Starts Express server and has it listen at port 3000.
    console.log(`Backend is running at http://localhost:${PORT}`);
});