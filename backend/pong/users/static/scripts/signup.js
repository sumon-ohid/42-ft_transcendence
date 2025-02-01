function signup() {
    saveCurrentPage('signup');

    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "login-container";
    div.innerHTML = ` 
        <div class="login-text">
            <p>Register</p>
        </div>
        <form id="signup-form" class="form">
            <input type="text" id="email" name="email" placeholder="email" class="form-box" required><br>
            <input type="text" id="username" name="username" placeholder="username" class="form-box" required><br>
            <input type="password" id="password" name="password" placeholder="Password" class="form-box" autocomplete="current-password" required>
                <span id="toggle-password-signup" class="toggle-password-signup">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                </span>
            <br><br>
            <button type="button" id="signup-button" class="login-button">Signup</button>
            <button type="button" id="login-button" class="login-button2" onclick="navigateTo('#login')"><i class="fa-solid fa-arrow-left-long"></i> back</button>
        </form>
        <div class="image"></div>
    `;
    body.appendChild(div);

    const signupButton = document.getElementById("signup-button");
    const signupForm = document.getElementById("signup-form");

    signupButton.addEventListener("click", handleSignup);

    signupForm.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSignup();
        }
    });

    // For password toggle eye, view and hide password
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("toggle-password-signup");

    togglePassword.addEventListener("click", function() {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.querySelector("i").classList.toggle("fa-eye");
        this.querySelector("i").classList.toggle("fa-eye-slash");
    });
}

function handleErrors(errors) {
    let errorMessage = "Errors: ";
    for (const [field, messages] of Object.entries(errors)) {
        errorMessage += `${field}: ${messages.join(', ')}; `;
    }
    return errorMessage;
}

function handleSignup() {
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !username || !password) {
        error("All fields are required!", "error");
        return;
    }

    const csrfToken = getCSRFToken();

    fetch('/api/signup/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ email, username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                error(data.message, "success");
                setTimeout(function() {
                    login();
                }, 1000);
            } else if (data.errors) {
                const errorMessage = handleErrors(data.errors);
                error(errorMessage, "error");
            } else {
                error(data.message, "error");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            error("An error occurred. Please try again.", "error");
        });
}


function error(msg, type) {
    var errorDiv = document.createElement('div');

    errorDiv.className = "error-div";
    if (type === "success") {
        errorDiv.innerHTML = `
            <span class="badge rounded-pill bg-success">
            <i class="fa-solid fa-check-circle"></i>
            ${msg}
            </span>
        `;
    } else {
        errorDiv.innerHTML = `
            <span class="badge rounded-pill bg-danger">
            <i class="fa-solid fa-exclamation-circle"></i>
            ${msg}
            </span>
        `;
    }

    document.body.appendChild(errorDiv);
    
    setTimeout(function() {
        if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
        }
    }, 4000);
}