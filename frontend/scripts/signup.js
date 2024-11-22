function signup() {
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    // Create a new div element and add content to it
    const div = document.createElement("div");
    div.className = "login-container";
    div.innerHTML = ` 
        <div class="login-text">
            <p>Register</p>
        </div>
        <form action="#" class="form">
            <input type="text" id="email" name="email" placeholder="email" class="form-box"><br>
            <input type="text" id="username" name="username" placeholder="username" class="form-box"><br>
            <input type="text" id="password" name="password" placeholder="password" class="form-box"><br><br>
            <input type="submit" value="signup" class="login-button" onclick="homepage(event)">
        </form>
        <div class="image"></div>
    `;
    body.appendChild(div);
}
