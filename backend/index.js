// backend/index.js
const express = require('express'); // Import express library. Framework for creating servers and routes
const app = express(); // Create an express instance called app. Used to define routes, middleware, and configure server
const PORT = 3000; // Defines port number for server. In this case: http://localhost:3000

//* Dev Tools
const devMode = true;

//* Storage
const rooms = devMode ? require('./seed') : {}; // This is where we store our rooms

app.use(express.json()); // Tells app to automatically parse JSON in incoming requests. 

app.get('/', (req, res) => { 
    res.json({ message: 'Backend is working' }); 
});

//* Room routes

// Create room
app.post('/createRoom', (req, res) => { 
    const { name, owner } = req.body;
    const roomId = Math.random().toString(36).substring(2, 10); 

    // Validate input
    if (!name || !owner) {
        return res.status(400).json({ error: 'Room name and existing username are required'});
    }
    
    rooms[roomId] = { 
        name: name,
        owner: owner,
        users: new Set(),
        messages: []
    }; 
    rooms[roomId].users.add(owner);

    res.status(201).json({ roomId });
});

// Join room
app.post('/joinRoom', (req, res) => {
    const { roomId, username } = req.body;

    // Validate input
    if (!roomId || !username) {
        return res.status(400).json({ error: 'roomId and username are required'});
    }
    
    const room = rooms[roomId];

    if (!room) {
        return res.status(404).json({ error: 'room not found'});
    }

    if (room.users.has(username)) {
        return res.status(409).json({ error: 'username already taken'});
    }

    room.users.add(username);

    res.status(200).json( {message: `Joined room ${roomId} as ${username}`});
})

// Delete room
app.delete('/deleteRoom', (req, res) => {
    const { roomId, username } = req.body;

    // Validate input
    if (!roomId || !username) {
        return res.status(400).json({ error: 'roomId is required'});
    }
    const room = rooms[roomId];

    if (!room) {
        return res.status(404).json({ error: 'Room not found'});
    }
    const owner = rooms[roomId].owner;

    if (owner != username) {
        return res.status(403).json({ error: 'Only room owner can delete'});
    }

    delete(rooms[roomId]);
    return res.status(200).json({ message: `Successfully deleted room ${room.name}`})
})

// Get room info
app.get('/getRoom', (req, res) => {
    const { roomId } = req.body;

    // Validate input
    if (!roomId) {
        return res.status(400).json({ error: 'roomId is required'});
    }

    const room = rooms[roomId];

    if (!room) {
        return res.status(404).json( {error: 'Room not found'})
    }

    return res.json({ ...room, users: Array.from(room.users)});
})

// Get all roomId:Name //* WIP
app.get('/getAllRooms', (req, res) => {
    const roomSummaries = Object.entries(rooms).map(([roomId, room]) => ({
        roomId,
        name: room.name
    }))

    return res.json(roomSummaries);
})

//* Message routes

// Send message to a room
app.post('/sendMessage', (req, res) => {
    const { roomId, message, username } = req.body;

    // Validate input
    if (!roomId || !message) {
        return res.status(400).json({ error: 'roomId and message are required' });
    }

    if (!rooms[roomId]) {
        return res.status(404).json({ error: 'Room not found'});
    }
    const room = rooms[roomId];

    // extreme case of user sending messages in a room without joining
    if (!room.users.has(username)) {
        return res.status(403).json({ error: `You are not allowed to send messages in ${roomId}:${room.name}`});
    }

    // add message to room
    rooms[roomId].messages.push({ sender: username, message: message});

    res.status(201).json({ success: true });
});

// Get messages
app.get('/getMessages', (req, res) => {
    const roomId = req.query.roomId;

    // Validate input
    if(!roomId) {
        return res.status(400).json({ error: 'roomId is required'});
    }

    if(!rooms[roomId]) {
        return res.status(404).json({ error: 'room not found'});
    }

    res.status(200).json({ messages: rooms[roomId].messages })
})





//* Required for app to run. This opens the express app to be contactable.

app.listen(PORT, () => { // Starts Express server and has it listen at port 3000.
    console.log(`Backend is running at http://localhost:${PORT}`);
});

