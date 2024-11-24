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
            <div class="friends">
            <div class="active-friends">
                <div class="friend">
                    <img src="./avatars/avatar1.png" alt="Avatar 1">
                    <span class="badge text-bg-light">Friend 1</span>
                </div>
                <div class="friend">
                    <img src="./avatars/avatar2.png" alt="Avatar 2">
                    <span class="badge text-bg-light">Friend 2</span>
                </div>
                <div class="friend">
                    <img src="./avatars/avatar3.png" alt="Avatar 3">
                    <span class="badge text-bg-light">Friend 3</span>
                </div>
                <div class="friend">
                    <img src="./avatars/avatar4.png" alt="Avatar 4">
                    <span class="badge text-bg-light">Friend 4</span>
                </div>
                <div class="friend">
                    <img src="./avatars/avatar5.png" alt="Avatar 5">
                    <span class="badge text-bg-light">Friend 5</span>
                </div>
                <div class="friend">
                    <img src="./avatars/avatar6.png" alt="Avatar 6">
                    <span class="badge text-bg-light">Friend 6</span>
                </div>
            </div>
        </div>
        <div class="chat-box-holder">
            <i class="fa-solid fa-face-smile"></i>
            <input type="text" class="chat-box" placeholder="type a message"> </input>
            <div class="attachment"><i class="fa-solid fa-paperclip"></i></div>
        </div>
        <div class="send-button">
            <i class="fa-solid fa-paper-plane"></i>
        </div>
    `;
    body.appendChild(div);
}
