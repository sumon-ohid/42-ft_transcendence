function signup() {
    saveCurrentPage('signup');
    history.pushState({ page: 'signup' }, '', '#signup');
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
            <input type="password" id="password" name="password" placeholder="password" class="form-box" required><br><br>
            <button type="button" id="signup-button" class="login-button">Signup</button>
            <button type="button" id="login-button" class="login-button2" onclick="login()"><i class="fa-solid fa-arrow-left-long"></i> back</button>
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
}

function handleSignup() {
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !username || !password) {
        error("All fields are required!");
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
                error(data.message);
                setTimeout(function() {
                    login();
                }, 1000);
            } else if (data.errors) {
                error("Errors: " + JSON.stringify(data.errors));
            } else {
                error("Something went wrong!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            error("An error occurred. Please try again.");
        });
}


function error(msg) {
    var errorDiv = document.createElement('div');

    errorDiv.innerText = msg;
    
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '40px';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translate(-50%, -50%)';
    errorDiv.style.padding = '10px';
    errorDiv.style.backgroundColor = 'black';
    errorDiv.style.color = 'white';
    errorDiv.style.borderRadius = '5px';
    errorDiv.style.zIndex = '100';
     document.body.appendChild(errorDiv);
    
    setTimeout(function() {
        if (document.body.contains(errorDiv)) {
            document.body.removeChild(errorDiv);
        }
    }, 3000);
}