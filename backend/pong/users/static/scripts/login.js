
function login() {
    saveCurrentPage('login');
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    // Create a new div element and add content to it
    const div = document.createElement("div");
    div.className = "login-container";
    div.innerHTML = /*html*/ ` 
        <div class="login-text">
            <p>Login</p>
        </div>
        <form class="form" id="login-form">
            <input type="text" id="username" name="username" placeholder="Username" class="form-box" autocomplete="username" required><br>
            <input type="password" id="password" name="password" placeholder="Password" class="form-box" autocomplete="current-password" required>
            <span id="toggle-password" class="toggle-password">
                <i class="fa fa-eye" aria-hidden="true"></i>
            </span>
            <br><br>
            <button type="submit" class="login-button">Login</button>
        </form>
        <div class="or">or</div>
        <div class="intra-login" onClick="intraLogin()">Login with 
            <img src="https://simpleicons.org/icons/42.svg" alt="42" class="icon"/>
        </div>
        <div class="forgot-passwd">Forgot Password?</div>
        <div class="signup">
            Don't have an account?
            <button onclick="navigateTo('#signup')" class="signup-button">
                <strong id="register">Register</strong>
            </button>
        </div>
        <div class="image"></div>
    `;
    body.appendChild(div);

    // Attach event listener to the form
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", handleLogin);

    // For password toggle eye, view and hide password
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("toggle-password");

    togglePassword.addEventListener("click", function() {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.querySelector("i").classList.toggle("fa-eye");
        this.querySelector("i").classList.toggle("fa-eye-slash");
    });

    // Show GDPR consent message
    const gdpr = localStorage.getItem('gdpr');
    if (!gdpr)
        showGDPRMessage(); 
}

function showGDPRMessage() {
    const body = document.body;
    const div = document.createElement("div");
    div.className = "cookie-container";
    div.innerHTML = /*html*/ `
        <div class="cookie-icon">
            <p>🍪</p>
        </div>
        <div class="gdpr-container">
            <h3>Want some cookies?</h3>
            <p>This website uses cookies to ensure you get the best experience on our website.
            <br>By clicking "Accept" you agree to our use of cookies, data policy and <strong>GDPR Consent. </strong></p>
            <button id="accept" onclick="closeGDPR()">Accept</button>
            <button id="decline" onclick="closeGDPR()">Decline</button>
        </div>
    `;
    body.appendChild(div);
}

function closeGDPR() {
    const body = document.body;
    const gdprContainer = document.querySelector('.cookie-container');
    body.removeChild(gdprContainer);

    //-- Save the user's choice in local storage
    if (event.target.id === 'accept')
        localStorage.setItem('gdpr', 'accepted');
}

function handleLogin(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        error("Username and password are required!", "error");
        return;
    }

    fetch('/api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const token = data.token;
                localStorage.setItem('jwtToken', token);
                if (data.two_factor_enabled) {
                    navigateTo('#2fa');
                    //show2FAPage(); // Show the 2FA page if 2FA is enabled
                } else {
                    error(data.message, "success");
                    setTimeout(function() {
                        navigateTo('#homePage') // Redirect to the home page
                    }, 1000);
                }
            } else if (data.error) {
                error("Error: " + data.error, "error");
            } else {
                error("Something went wrong!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            error("An error occurred. Please try again.", "error");
        });
}

function show2FAPage() {
    saveCurrentPage('2fa');
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "two-fa-container";
    div.innerHTML = /*html*/ ` 
        <div>
            <h1>Enter 2FA Code</h1>
            <p>(eg: Google Authenticator)</p>
        </div>
        <form class="form" id="2fa-form">
            <input type="text" id="2fa-code" name="2fa-code" placeholder="2FA Code" class="form-box"><br><br>
            <button type="submit">Verify</button>
        </form>
    `;
    body.appendChild(div);

    const twoFAForm = document.getElementById("2fa-form");
    twoFAForm.addEventListener("submit", handle2FAVerification);
}

function handle2FAVerification(event) {
    event.preventDefault();

    const code = document.getElementById("2fa-code").value.trim();

    if (!code) {
        error("2FA code is required!", "error");
        return;
    }

    const csrfToken = getCSRFToken();

    fetch('/api/verify-2fa/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ code }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                error("2FA verification successful!", "success");
                const token = data.token;
                localStorage.setItem('jwtToken', token);
                homePage(); // Redirect to the home page
            } else if (data.error) {
                error("Error: " + data.error, "error");
            } else {
                error("Something went wrong!", "error");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            error("An error occurred. Please try again.", "error");
        });
}

function intraLogin() {
    // Redirect to the 42 OAuth login page
    console.log("Redirecting to 42 OAuth login page...");
    window.location.href = 'api/auth/intra42/';
}
