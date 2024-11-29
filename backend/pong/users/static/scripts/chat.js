function chatPage() {
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    // Create a new div element and add content to it
    const div = document.createElement("div");
    div.className = "chatpage-container";
    div.innerHTML = ` 
        <div class="chat-title">
            <h1>chat</h1>
        </div>
        <div class="chat-top-bar">
            <div class="chating-with">
                <div class="friend-name">Sumon
                    <span class="badge rounded-pill text-bg-success">active now</span>
                </div>
                <div class="p-pic-back"></div>
                <img src="../static/avatars/avatar4.png" alt="user">
            </div>
        </div>
        <div class="friends">
            <div class="active-friends">
                <div class="friend">
                    <img src="../static/avatars/avatar1.png" alt="Avatar 1">
                    <span class="badge text-bg-light">Friend 1</span>
                </div>
                <div class="friend">
                    <img src="../static/avatars/avatar2.png" alt="Avatar 2">
                    <span class="badge text-bg-light">Friend 2</span>
                </div>
                <div class="friend">
                    <img src="../static/avatars/avatar3.png" alt="Avatar 3">
                    <span class="badge text-bg-light">Friend 3</span>
                </div>
                <div class="friend">
                    <img src="../static/avatars/avatar4.png" alt="Avatar 4">
                    <span class="badge text-bg-light">Friend 4</span>
                </div>
                <div class="friend">
                    <img src="../static/avatars/avatar5.png" alt="Avatar 5">
                    <span class="badge text-bg-light">Friend 5</span>
                </div>
                <div class="friend">
                    <img src="../static/avatars/avatar6.png" alt="Avatar 6">
                    <span class="badge text-bg-light">Friend 6</span>
                </div>
            </div>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="chat-box-holder">
            <i class="fa-solid fa-face-smile"></i>
            <input type="text" class="chat-box" id="chat-input" placeholder="type a message">
            <div class="attachment"><i class="fa-solid fa-paperclip"></i></div>
        </div>
        <div class="send-button" id="send-button">
            <i class="fa-solid fa-paper-plane"></i>
        </div>
        <div class="quit-game" onclick="homePage()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);

    // Add event listeners for sending messages
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

    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText !== "") {
            const messageElement = document.createElement("div");
            messageElement.classList.add("chat-message");
    
            const profilePic = document.createElement("img");
            profilePic.src = "../static/images/11475215.jpg"; // Should change later, put user picture
            profilePic.alt = "Profile Picture";
    
            const messageContent = document.createElement("span");
            messageContent.textContent = messageText;
    
            messageElement.appendChild(profilePic);
            messageElement.appendChild(messageContent);
    
            chatMessages.appendChild(messageElement);
            chatInput.value = "";
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        }
    }
}
