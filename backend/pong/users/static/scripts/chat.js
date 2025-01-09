function chatPage() {
    saveCurrentPage('chatPage');
    history.pushState({ page: 'chatPage' }, '', '#chatPage');

    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "chatpage-container";
    div.innerHTML = ` 
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
            <i class="fa-solid fa-face-smile"></i>
            <input  style="pointer-events: none;" type="text" class="chat-box disabled" id="chat-input" placeholder="type a message">
            <div class="attachment"><i class="fa-solid fa-paperclip"></i></div>
        </div>
        <div class="send-button" id="send-button" >
            <i class="fa-solid fa-paper-plane"></i>
        </div>
        <div class="quit-game" onclick="homePage()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);

    // Display all users
    fetch('/api/users/')
        .then(response => response.json())
        .then(users => {
            const friendsContainer = document.querySelector('.active-friends');
            friendsContainer.innerHTML = ''; 

            users.forEach(user => {
                const friendDiv = document.createElement('div');
                friendDiv.className = 'friend';
                const avatarUrl = user.profile__photo ? `/media/${user.profile__photo}` : '/../static/images/11475215.jpg';
                friendDiv.innerHTML = `
                    <img onclick="startChat('${user.username}', '${avatarUrl}')" src="${avatarUrl}" alt="${user.username}">
                    <span onclick="userProfile('${user.username}')" class="badge text-bg-light">${formatPlayerName(user.username)}</span>
                    <p id="last-action" class="badge rounded-pill text-bg-info">Last Active: active</p>
                `;
                friendsContainer.appendChild(friendDiv);
            });
        })
        .catch(error => console.error('Error fetching users:', error));

    // Event listeners for sending messages both click and enter
    const chatInput = document.getElementById("chat-input");
    const sendButton = document.getElementById("send-button");
    const chatMessages = document.getElementById("chat-messages");

    sendButton.addEventListener("click", function() {
        sendMessage();
    });

    chatInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    let selectedUser = null; // Track selected user for chat
    let lastTimestamp = null; // Track last message timestamp

    async function sendMessage() {
        if (!selectedUser) {
            error("Select a user to chat with first.");
            return;
        }
        
        const messageText = chatInput.value.trim();

        console.log(messageText);
        
        if (messageText !== "") {
            fetch('/chat/send-message/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCSRFToken(),
                },
                body: JSON.stringify({
                    receiver: selectedUser.username,
                    message: messageText,
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    chatInput.value = "";
                } else {
                    console.error("Error sending message:", data);
                }
            });
        }
    }

    function formatTimestamp(date) {
        return date.toISOString().replace('T', ' ').replace('Z', '');
    }

    async function fetchMessages() {
        if (!selectedUser) return;

        const timestamp = formatTimestamp(new Date());
        const url = `/chat/long-poll/?receiver=${selectedUser.username}&last_timestamp=${timestamp}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error("Error fetching messages:", data.error);
                    return;
                }

                const messages = data.messages || [];

                if (messages.length > 0) {
                    messages.forEach(msg => {
                        const messageElement = document.createElement("div");
                        messageElement.className = "chat-message";
                        messageElement.innerHTML = `
                            <strong>${msg.sender}:</strong> ${msg.message}
                        `;
                        chatMessages.appendChild(messageElement);
                    });

                    chatMessages.scrollTop = chatMessages.scrollHeight;

                    // Update lastTimestamp to the latest message
                    lastTimestamp = messages[messages.length - 1].timestamp;
                }

                // Continue long polling
                fetchMessages();
            })
            .catch(error => {
                console.error("Error fetching messages:", error);

                // Retry after a delay
                setTimeout(fetchMessages, 5000);
            });
    }

    window.startChat = function(username, avatarUrl) {
        selectedUser = { username, avatarUrl }; // Set selected user
        lastTimestamp = null; // Reset timestamp for new chat

        const chatTopBar = document.querySelector('.chat-top-bar');
        chatTopBar.innerHTML = `
            <div onclick="userProfile('${username}')" class="chating-with">
                <div class="friend-name">
                    <h1>${username.substring(0, 6)}.</h1>
                    <span id="active-now" class="badge rounded-pill text-bg-warning">active now</span>
                </div>
                <div class="p-pic-back"></div>
                <img src="${avatarUrl}" alt="${username}">
            </div>
        `;

        const chatInput = document.getElementById("chat-input");
        chatInput.classList.remove('disabled');
        chatInput.style.pointerEvents = 'auto';

        // Fetch and display previous messages between the users
        fetch(`/chat/get-chat-history/?receiver=${username}`)
        .then(response => response.json())
        .then(data => {
            if (data.messages) {
                const chatMessages = document.getElementById("chat-messages");
                data.messages.forEach(msg => {
                    const messageElement = document.createElement("div");
                    messageElement.className = "chat-message";
                    messageElement.innerHTML = `
                        <strong>${msg.sender}:</strong> ${msg.message}
                    `;
                    chatMessages.appendChild(messageElement);
                });
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        })
        .catch(error => console.error("Error loading chat history:", error));

        fetchMessages(); // Start fetching messages
    };
}
