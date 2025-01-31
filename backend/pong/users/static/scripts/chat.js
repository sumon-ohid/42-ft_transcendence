let profilePicture = null;
let selectedUser;
let lastTimestamp = null;
let avatarUrl = "../static/images/11475215.jpg";

let chatSockets = {};
let aiChatDetected = false;

let currentUsername = null;
let currentSelectedUser = null;


function connectWebSocket(username) {
    currentSelectedUser = username;
    if (chatSockets[username]) {
        return chatSockets[username];
    }

    const socket = new WebSocket(
        'wss://' + window.location.host + '/ws/chat/' + username + '/'
    );

    socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        const message = data.message;
        displayMessage(message);
    };

    socket.onclose = function(e) {
        console.error(`Chat socket for [${username}] closed unexpectedly`, e);
        delete chatSockets[username];
        setTimeout(() => connectWebSocket(username), 1000);
    };

    chatSockets[username] = socket;
    return socket;
}

function closeWebSocket(username) {
    if (chatSockets[username]) {
        chatSockets[username].close();
        delete chatSockets[username];
    }
}

function closeAllWebSockets() {
    for (let user in chatSockets) {
        if (chatSockets[user]) {
            chatSockets[user].close();
        }
    }
    chatSockets = {};
}

function displayMessage(message) {
    const chatMessages = document.getElementById("chat-messages");

    if (!selectedUser || (message.sender !== selectedUser.username && message.sender !== currentUsername)) {
        console.warn('Message does not belong to the selected chat. Not displayed.');
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.className = "chat-message";

    if (message.sender === selectedUser.username) {
        messageElement.classList.add("other-user-message");
    } else if (message.sender === currentUsername) {
        messageElement.classList.add("your-message");
    }

    const profilePic = document.createElement("img");
    profilePic.src = message.sender === selectedUser.username ? selectedUser.avatarUrl : profilePicture;
    profilePic.alt = "Profile Picture";

    const messageContent = document.createElement("span");
    if (message.sender === selectedUser.username) {
        messageContent.textContent = `${message.sender}: ${message.text}`;
    } else if (message.sender === currentUsername) {
        messageContent.textContent = `you: ${message.text}`;
    }

    messageElement.appendChild(profilePic);
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchLastActiveTime(username) {
    try {
        const response = await fetch(`/api/last-active/?username=${username}`);
        const data = await response.json();
        const lastActive = new Date(data.last_active);

        const now = new Date();
        const isToday = lastActive.toDateString() === now.toDateString();
        const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === lastActive.toDateString();

        if (isToday) {
            return `${lastActive.getHours()}:${lastActive.getMinutes().toString().padStart(2, '0')}`;
        } else if (isYesterday) {
            return 'yesterday';
        } else {
            return lastActive.toLocaleDateString();
        }
    } catch (error) {
        console.error("Error fetching last active time:", error);
        return 'unknown';
    }
}

async function chatPage() {
    saveCurrentPage('chatPage');

    const body = document.body;
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "chatpage-container";
    div.innerHTML = /*html*/`
        <div class="chat-title">
            <h1>chat</h1>
        </div>
        <div class="chat-top-bar">
            <!-- This will be dynamically generated depending on click -->
        </div>
        <div class="friends">
            <div class="active-friends">
                <!-- User list will be dynamically generated here -->
            </div>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-box-holder">
            <i class="fa-solid fa-face-smile" onclick=""></i>
            <input  style="pointer-events: none;" type="text" class="chat-box disabled" id="chat-input" placeholder="type a message">
            <div class="attachment"><i class="fa-solid fa-paperclip"></i></div>
        </div>
        <div class="send-button" id="send-button" >
            <i class="fa-solid fa-paper-plane"></i>
        </div>
        <div class="quit-game" onclick="navigateTo('#homePage')">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);

    async function getUsername() {
        try {
            const response = await fetch('/api/get-username/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
                }
            });
            const data = await response.json();
            loggedInUser = data.username;
            return data.username || "Guest";
        } catch (error) {
            console.error('Error fetching username:', error);
            return "Guest";
        }
    }

    const [username, profile_picture] = await Promise.all([getUsername(), fetchProfilePicture()]);
    currentUsername = username;
    profilePicture = profile_picture;

    fetch('/api/users/')
        .then(response => response.json())
        .then(users => {
            const friendsContainer = document.querySelector('.active-friends');
            friendsContainer.innerHTML = '';

            const aiFriendDiv = document.createElement('div');
            aiFriendDiv.className = 'friend';
            aiFriendDiv.innerHTML = /*html*/`
                <img onclick="aiChatDetector()" src="/static/images/robot.png" alt="AI-Bot">
                <span class="badge text-bg-light">Marvin AI</span>
                <p id="last-action" class="badge rounded-pill text-bg-info">Always Available 🤖</p>
            `;
            friendsContainer.appendChild(aiFriendDiv);

            users.forEach(user => {
                const friendDiv = document.createElement('div');
                friendDiv.className = 'friend';
                const userAvatarUrl = user.profile__photo
                    ? `/media/${user.profile__photo}`
                    : '/../static/images/11475215.jpg';
                friendDiv.innerHTML = /*html*/`
                    <img onclick="startChat('${user.username}', '${userAvatarUrl}')" src="${userAvatarUrl}" alt="${user.username}">
                    <span onclick="userProfile('${user.username}')" class="badge text-bg-light">${formatPlayerName(user.username)}</span>
                    <p id="last-action" class="badge rounded-pill text-bg-info">Say Hello to ${user.username.substring(0, 6)} 👋 </p>
                `;
                friendsContainer.appendChild(friendDiv);
            });
        })
        .catch(error => console.error('Error fetching users:', error));

    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");

    sendButton.addEventListener("click", function() {
        if (aiChatDetected) return;
        sendMessage();
    });

    chatInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            if (aiChatDetected) return;
            sendMessage();
        }
    });

    async function sendMessage() {
        if (!selectedUser) {
            error("Select a user to chat with first.", "warning");
            return;
        }
        
        const messageText = chatInput.value.trim();
        if (messageText !== "") {
            const socket = chatSockets[selectedUser.username];
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    'message': messageText,
                    'receiver': selectedUser.username
                }));
                chatInput.value = "";
            } else {
                error("WebSocket is not open or not available.", "danger");
            }
        }
    }

    async function loadChatHistory(username) {
        fetch(`/chat/get-chat-history/?receiver=${username}`)
            .then(response => response.json())
            .then(data => {
                if (data.messages) {
                    const chatMessages = document.getElementById("chat-messages");
                    chatMessages.innerHTML = '';
                    data.messages.forEach(msg => {
                        displayMessage({
                            sender: msg.sender,
                            text: msg.message,
                            timestamp: msg.timestamp
                        });
                    });
                }
            })
            .catch(error => console.error("Error loading chat history:", error));
    }

    window.startChat = async function(username, avatarUrl) {
        fetch(`/api/user-profile/${username}/`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                const isFriend = data.is_friend;
                if (isFriend) {
                    error("You can't chat with this user.", "warning");
                    return;
                }

                aiChatDetected = false;
                selectedUser = { username, avatarUrl };
                lastTimestamp = null;

                connectWebSocket(username);

                const chatTopBar = document.querySelector('.chat-top-bar');
                fetchLastActiveTime(username).then(lastActiveTime => {
                    chatTopBar.innerHTML = /*html*/`
                        <div onclick="userProfile('${username}')" class="chating-with">
                            <div class="friend-name">
                                <h1>${username.substring(0, 6)}.</h1>
                                <span id="active-now" class="badge rounded-pill text-bg-warning">
                                    Last Active: ${lastActiveTime}
                                </span>
                            </div>
                            <div class="p-pic-back"></div>
                            <img src="${avatarUrl}" alt="${username}">
                        </div>
                    `;
                });

                const chatInput = document.getElementById("chat-input");
                chatInput.classList.remove('disabled');
                chatInput.style.pointerEvents = 'auto';
                chatInput.placeholder = "Type a message...";

                loadChatHistory(username);
            })
            .catch(error => console.error('Error fetching user profile:', error));
    }
}

function aiChatDetector() {
    aiChatDetected = true;
    startAIChat();
}
