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
            <div class="quit-game" onclick="homePage()">
                <h1>BACK</h1>
            </div>
        </div>
    `;
    body.appendChild(div);
}

