function login() {
    saveCurrentPage('login');
    history.pushState({ page: 'login' }, '', '#login');
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
            <p>Login</p>
        </div>
        <form class="form" id="login-form">
            <input type="text" id="username" name="username" placeholder="Username" class="form-box" autocomplete="username" required><br>
            <input type="password" id="password" name="password" placeholder="Password" class="form-box" autocomplete="current-password" required><br><br>
            <button type="submit" class="login-button">Login</button>
        </form>
        <div class="or">or</div>
        <div class="intra-login">Login with 
            <img src="https://simpleicons.org/icons/42.svg" alt="42" class="icon"/>
        </div>
        <div class="forgot-passwd">Forgot Password?</div>
        <div class="signup">
            Don't have an account?
            <button onclick="signup()" class="signup-button">
                <strong id="register">Register</strong>
            </button>
        </div>
        <div class="image"></div>
    `;
    body.appendChild(div);

    // Attach event listener to the form
    const loginForm = document.getElementById("login-form");
    loginForm.addEventListener("submit", handleLogin);
}

function handleLogin(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Username and password are required!");
        return;
    }

    // Fetch the CSRF token
    const csrfToken = getCSRFToken();

    // Send the POST request to the Django login API
    fetch('/api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Include CSRF token for Django
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                if (data.two_factor_enabled) {
                    show2FAPage(); // Show the 2FA page if 2FA is enabled
                } else {
                    alert(data.message);
                    homePage(); // Redirect to the home page
                }
            } else if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert("Something went wrong!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
}

function show2FAPage() {
    saveCurrentPage('2fa');
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    // Create a new div element and add content to it
    const div = document.createElement("div");
    div.className = "two-fa-container";
    div.innerHTML = ` 
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

    // Attach event listener to the form
    const twoFAForm = document.getElementById("2fa-form");
    twoFAForm.addEventListener("submit", handle2FAVerification);
}

function handle2FAVerification(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    const code = document.getElementById("2fa-code").value.trim();

    if (!code) {
        alert("2FA code is required!");
        return;
    }

    // Fetch the CSRF token
    const csrfToken = getCSRFToken();

    // Send the POST request to the Django 2FA verification API
    fetch('/api/verify-2fa/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Include CSRF token for Django
        },
        body: JSON.stringify({ code }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert("2FA verification successful!");
                homePage(); // Redirect to the home page
            } else if (data.error) {
                alert("Error: " + data.error);
            } else {
                alert("Something went wrong!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
}