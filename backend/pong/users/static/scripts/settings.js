function settingsPage() {
    saveCurrentPage('settingsPage');
    history.pushState({ page: 'settingsPage' }, '', '#settingsPage');
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
            <p style>Hello</p>
            <h1>Guest</h1>
        </div>
        <div class="round">
            <div class="profile-pic" onclick="document.getElementById('profile-picture-input').click();">
                <img id="profile-picture" src="/../static/images/11475215.jpg" alt="Picture">
            </div>
        </div>
        <input type="file" id="profile-picture-input" name="profile_picture" accept="image/*" style="display: none;">
        <div class="inside-wel"></div>
        <div class="quit-game" onclick="homePage()">
            <h1>BACK</h1>
            </div>
        <div class="username-container">
            <input type="text" id="username" placeholder="new username">
            <div class="change-username" onclick="changeUserName()">
                <p>change username</p>
                <i class="fa-solid fa-circle-arrow-right"></i>
            </div>
        </div>
        <div class="password-container">
            <input type="password" id="current-password" placeholder="current password">
            <input type="password" id="new-password" placeholder="new password">
            <input type="password" id="confirm-password" placeholder="confirm password">
            <div class="change-password" onclick="changePassword()">
                <p>change password</p>
                <i class="fa-solid fa-circle-arrow-right"></i>
            </div>
        </div>
        <div class="authentication">
            <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
                <label class="form-check-label" for="flexSwitchCheckDefault">2FA Authentication</label>
            </div>
        </div>
    `;
    body.appendChild(div);

    document.querySelector('.wel-user').style.textAlign = 'center';

    // GET USERNAME
    fetch('/api/get-username/', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
        }
    })
        .then(response => response.json())
        .then(data => {
        const usernameElement = document.querySelector('.wel-user h1');
        if (usernameElement) {
            let username = data.username || "Guest";
            loggedInUser = username;
            if (username.length > 6) {
            username = username.substring(0, 6) + '.';
            }
            usernameElement.textContent = username;
        }
        })
        .catch(error => {
        console.error('Error fetching username:', error);
        });

    fetch('/api/get-profile-picture/')
    .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const profilePicture = document.getElementById('profile-picture');
        if (data.photo) {
        profilePicture.src = "" + data.photo;
        } else {
        profilePicture.src = '/../static/images/11475215.jpg';
        }
    })
    .catch(error => {
        console.error('Error fetching profile picture:', error);
        const profilePicture = document.getElementById('profile-picture');
        profilePicture.src = '/../static/images/11475215.jpg';
    });

    document.getElementById('profile-picture-input').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector('.profile-pic').style.backgroundImage = `url(${e.target.result})`;
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append('profile_picture', file);

            const csrfToken = getCSRFToken();

            fetch('/api/upload-profile-picture/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert('Profile picture uploaded successfully');
                } else {
                    alert('Error uploading profile picture');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
}

function changeUserName() {
    const newUsername = document.getElementById('username').value;
    const currentUsername = loggedInUser;

    if (!newUsername) {
        alert('Please enter a new username.');
        return;
    }

    const csrfToken = getCSRFToken();

    fetch('/api/change-username/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({
        current_username: currentUsername,
        new_username: newUsername
        })
    })
    .then(response => response.json())
    .then(data => {
    if (data.status === 'success') {
        alert('Username changed successfully!');
        loggedInUser = newUsername;
    } else {
        alert(`Error: ${data.error}`);
    }
    })
    .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while changing the username.');
    });
}


function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
  
    const csrfToken = getCSRFToken();
  
    fetch('/api/change-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Password changed successfully!');
          login();
        } else {
          alert(`Error: ${data.error}`);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while changing the password.');
      });
 }
