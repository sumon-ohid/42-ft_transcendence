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
        <form id="signup-form" class="form">
            <input type="text" id="email" name="email" placeholder="email" class="form-box"><br>
            <input type="text" id="username" name="username" placeholder="username" class="form-box"><br>
            <input type="password" id="password" name="password" placeholder="password" class="form-box"><br><br>
            <button type="button" id="signup-button" class="login-button">Signup</button>
            <button type="button" id="login-button" class="login-button2" onclick="login()"><i class="fa-solid fa-arrow-left-long"></i> back</button>
        </form>
        <div class="image"></div>
    `;
    body.appendChild(div);

    // Add event listener for the signup button
    const signupButton = document.getElementById("signup-button");
    signupButton.addEventListener("click", handleSignup);
}

function handleSignup() {
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !username || !password) {
        alert("All fields are required!");
        return;
    }

    // Fetch the CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

    // Send the POST request to the Django API
    fetch('/users/api/signup/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken, // Include CSRF token for Django
        },
        body: JSON.stringify({ email, username, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);
                login(); // Redirect to the login
            } else if (data.errors) {
                alert("Errors: " + JSON.stringify(data.errors));
            } else {
                alert("Something went wrong!");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        });
}
