// seed.js

const rooms = {
    123: {
        roomId: '123',
        name: 'Dev Room',
        owner: 'Dev Owner',
        users: new Set(['Dev Owner', 'Dev User']),
    },
    456: {
        roomId: '123',
        name: 'Dev Room 2',
        owner: 'Dev Owner',
        users: new Set(['Dev Owner']),
    }
};

module.exports = rooms;