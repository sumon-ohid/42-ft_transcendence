function login() {
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
            <p>login</p>
        </div>
        <form action="#" class="form">
            <input type="text" id="username" name="username" placeholder="username" class="form-box"><br>
            <input type="password" id="password" name="password" placeholder="password" class="form-box"><br><br>
            <input type="submit" value="login" class="login-button" onclick="homepage(event)">
        </form>
        <div class="or">or</div>
        <div class="intra-login">login with 
            <img src="https://simpleicons.org/icons/42.svg" alt="42" class="icon"/>
        </div>
        <div class="forgot-passwd">Forgot Password?</div>
        <div class="signup">
            Don't have an account?
            <button onclick="signup()" class="signup-button">
                <strong id="register"> Register</strong>
            </button>
        </div>
        <div class="image"></div>
    `;
    body.appendChild(div);
}

//--- To test
// function login() {
//     console.log("Login function executed");
//     window.location.href = '../index.html';
// }
