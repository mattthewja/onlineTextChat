// seed.js

const rooms = {
    123: {
        name: 'Dev Room',
        owner: 'Dev Owner',
        users: new Set(['Dev Owner', 'Dev User']),
        messages: [
            { user: 'Dev Owner', message: 'This is the start of the room'},
            { user: 'Dev User', message: 'Hi, "the start of the room"'}
        ]
    }
};

module.exports = rooms;