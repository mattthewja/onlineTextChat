# CHANGELOG

## Commit Types
- feat
- fix 
- docs
- style
- refactor
- perf
- test
- build
- ci 
- chore 
- revert

---

## [v0.4.0]
### Features
- feat: Add logic for Sockets disconnecting
- feat: Add userlist logic

### Fixes
- fix: test room 456 having the incorrect roomId

## [v0.3.1]
### Chores & Refactors
- chore: Improve COMMITLOG.md

## [v0.3.0]
### Breaking
- IMPORTANT: Complete codebase rewrite. Deleted most REST logic; Socket.IO integration is now prioritized.

### Features
- feat: Socket integration for all major functions (createRoom, joinRoom, leaveRoom, sendMessage, deleteRoom)
- feat: Add deleteRoom button separate from debug
- feat: Allow updating username via socket
- feat: Moved roomId generation to frontend function

### Fixes
- fix: Prevent users from creating a room while already in one
- fix: Users unable to change username after leaving rooms

### Chores & Refactors
- refactor: Move generateId logic to backend
- refactor: Reorganize script.js for clarity
- chore: Add frontend/.env to .gitignore

---

## [v0.2.0]
### Features
- feat: Add socket.io library (npm install socket.io)
- feat: Basic socket.io server connection via localhost:3000
- feat: Add basic HTML to index.html

### Testing
- test: Add .test.js files for all current routes in /test folder

---

## [v0.1.0]
### Features
- feat: Add route /leaveRoom
- feat: Add route /kickUser

### Fixes
- fix: Improve invalid input handling across routes

### Chores
- chore: Add .gitignore and remove node_modules from version control

### Testing
- test: Add supertest and chai setup

---

## [v0.0.1]
### Initial
- initial commit
