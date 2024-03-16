Realtime Database
|
|-- chats
|   |-- user1__user2
|   |   |-- messageId1: { senderId, timestamp, text, ... }
|   |   |-- messageId2: { senderId, timestamp, text, ... }
|   |   |-- ...
|   |-- user1__user3
|   |   |-- messageId3: { senderId, timestamp, text, ... }
|   |   |-- messageId4: { senderId, timestamp, text, ... }
|   |   |-- ...

|   |-- groupId1 (unique id for group chats)
|   |   |-- messageId1: { senderId, timestamp, text, ... }
|   |   |-- messageId2: { senderId, timestamp, text, ... }
|   |   |-- ...
|   |-- groupId2
|   |   |-- messageId3: { senderId, timestamp, text, ... }
|   |   |-- messageId4: { senderId, timestamp, text, ... }
|   |   |-- ...    
|   |-- ...
|
|
|-- latestMessages
    |-- userId1
    |   |-- user1__user2: { latestMessage }
    |   |-- user1__user3: { latestMessage }
    |   |-- ...
    |   |-- groupId1: { latestMessage }
    |   |-- groupId2: { latestMessage }
    |   |-- ...

    |-- userId2
    |   |-- user1__user2: { latestMessage }
    |   |-- user2__user4: { latestMessage }
    |   |-- ...
    |   |-- groupId1: { latestMessage }
    |   |-- groupId2: { latestMessage }
    |   |-- ...
    |
    |
    |-- ...
    