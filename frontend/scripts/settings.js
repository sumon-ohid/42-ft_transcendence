function settingsPage() {
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    // Create a new div element and add content to it
    const div = document.createElement("div");
    div.className = "settings-container";
    div.innerHTML = `
        <h2>Settings</h2>
        <div class="edit-pic">
            <span class="badge text-bg-primary">change</span>
        </div>
        <div class="wel-user">
            <p>Hello</p>
            <h1>Sumon</h1>
        </div>
        <div class="round">
            <div class="profile-pic"></div>
        </div>
        <div class="inside-wel"></div>
        <div class="quit-game" onclick="homePage()">
               <h1>BACK</h1>
            </div>
        <div class="change-username">
            <input type="text" id="username" placeholder="new username">
            <p>change username</p>
            <i class="fa-solid fa-circle-arrow-right"></i>
        </div>
        <div class="change-password">
            <input type="password" id="current-password" placeholder="current password">
            <input type="password" id="new-password" placeholder="new password">
            <input type="password" id="confirm-password" placeholder="confirm password">
            <p>change password</p>
            <i class="fa-solid fa-circle-arrow-right"></i>
        </div>
        <div class="save-change">
            <p>save changes</p>
        </div>
    `;
    body.appendChild(div);
}

