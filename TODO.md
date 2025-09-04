[TO-DO]
- improve frontend-ui visual experience
    - add structure to textboxes and buttons
- add list of users in room
    - use socket to emit full user list to new user when joining
    - use socket to emit newUsername to all other connected sockets
- have frontend users be notified on room closures
    - currently, they only know after trying to do actions in a now non-existant space
- actually implement the testing logic
- problems in disconnect logic
    - need to add userlist updating into disconnect logic

[DONE]
- add disconnect logic. 
    - Sockets disconnecting does not delete meta data
    - Use socket.data.[dataname] to fix?