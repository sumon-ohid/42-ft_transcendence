function settingsPage() {
    saveCurrentPage('settingsPage');
    history.pushState({ page: 'settingsPage' }, '', '#settingsPage');
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "settings-container";
    div.innerHTML = `
        <div class="delete-account" onclick="deleteAccount()">
            <div class="icon"><i class="fa-solid fa-trash"></i></div>
            <div class="tooltiptext">⚠️ Delete Account</div>
        </div>
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
            <input type="text" id="username" placeholder="new username" required>
            <div class="change-username" onclick="changeUserName()">
                <p>change username</p>
                <i class="fa-solid fa-circle-arrow-right"></i>
            </div>
        </div>
        <div class="password-container">
            <input type="password" id="current-password" placeholder="current password" required>
            <input type="password" id="new-password" placeholder="new password" required>
            <input type="password" id="confirm-password" placeholder="confirm password" required>
            <div class="change-password" onclick="changePassword()">
                <p>change password</p>
                <i class="fa-solid fa-circle-arrow-right"></i>
            </div>
        </div>
        <div class="auth-hold">
            <div class="authentication" onclick="authentication()">
                <label>two factor authentication</label>
                <i class="fa-solid fa-circle-arrow-right"></i>
            </div>
        </div>
        <div id="quit-confirmation" class="confirmation-to-delete hidden">
            <p>Are you sure you want to Delete your Account?</p>
            <button id="yesDelete" onclick="confirmDeletation()">Yes</button>
            <button id="noDelete" onclick="cancelDeletation()">No</button>
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
                    error('Profile picture uploaded successfully', 'success');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    error('Error uploading profile picture', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });
}

function authentication() {
    const usernameContainer = document.querySelector('.username-container');
    const passwordContainer = document.querySelector('.password-container');
    const authenticationContainer = document.querySelector('.auth-hold');

    usernameContainer.innerHTML = '';
    passwordContainer.innerHTML = '';
    authenticationContainer.innerHTML = '';

    const div = document.createElement('div');
    div.className = 'authentication-page';
    div.innerHTML = `
        <div class="authentication-Inpage">
            <h3>Authentication</h3>
            <p id="2fa-status">Status: Not Enabled</p>
            <div id="2fa-setup-container">
                <button id="enable-2fa-btn" onclick="setup2FA()">Enable 2FA</button>
                <input type="text" id="2fa-code-input" placeholder="Enter 2FA code" style="display: none;">
                <button id="verify-2fa-btn" onclick="verify2FA()" style="display: none;">Verify</button>
            </div>
            <button id="disable-2fa-btn" onclick="disable2FA()" style="display: none;">Disable 2FA</button>
        </div>
    `;
    
    document.querySelector('.settings-container').appendChild(div);
    fetch2FAStatus();
}

function fetch2FAStatus() {
    fetch('/api/get-2fa-status/', { method: 'GET', headers: { 'X-CSRFToken': getCSRFToken() } })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const statusElement = document.getElementById('2fa-status');
        const enableBtn = document.getElementById('enable-2fa-btn');
        const disableBtn = document.getElementById('disable-2fa-btn');
        const codeInput = document.getElementById('2fa-code-input');
        const verifyBtn = document.getElementById('verify-2fa-btn');
        const qrCodeContainer = document.getElementById('qr-code-container');

        if (data.enabled === true) {
            console.log('2FA is enabled');
            statusElement.textContent = 'Status: Enabled';
            enableBtn.style.display = 'none';
            disableBtn.style.display = 'inline-block';
            codeInput.style.display = 'none';
            verifyBtn.style.display = 'none';
            if (qrCodeContainer) {
                qrCodeContainer.remove();
            }
        } else {
            console.log('2FA is not enabled');
            statusElement.textContent = 'Status: Not Enabled';
            enableBtn.style.display = 'inline-block';
            disableBtn.style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error fetching 2FA status:', error);
        const statusElement = document.getElementById('2fa-status');
        if (statusElement) {
            statusElement.textContent = 'Error: Unable to fetch 2FA status';
        }
    });
}


function setup2FA() {
    fetch('/api/setup-2fa/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.qr_code_url) {
                // Create and update the QR code display
                let qrCodeContainer = document.getElementById('qr-code-container');
                if (!qrCodeContainer) {
                    qrCodeContainer = document.createElement('div');
                    qrCodeContainer.id = 'qr-code-container';
                    qrCodeContainer.style.textAlign = 'center';
                    qrCodeContainer.style.margin = '20px 0';
                    qrCodeContainer.style.zIndex = '2';
                    qrCodeContainer.style.position = 'fixed';
                    qrCodeContainer.style.top = '390px';
                    qrCodeContainer.style.left = '50%';
                    qrCodeContainer.style.transform = 'translate(-50%, -50%)';
                    document.body.appendChild(qrCodeContainer);
                }
                qrCodeContainer.innerHTML = `
                    <img src="${data.qr_code_url}" alt="2FA QR Code" style="width: 150px; height: 150px;">
                    <p style="color: white; ">Scan in authenticator app!</p>
                `;

                document.getElementById('2fa-code-input').style.display = 'inline-block';
                document.getElementById('verify-2fa-btn').style.display = 'inline-block';
            } else {
                error('Error setting up 2FA: ' + data.error);
            }
        })
        .catch(error => console.error('Error setting up 2FA:', error));
}

function verify2FA() {
    const code = document.getElementById('2fa-code-input').value;

    if (!code) {
        error('Please enter the verification code.', 'error');
        return;
    }
    const csrfToken = getCSRFToken();
    fetch('api/verify-2fa/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ code })
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                error('2FA successfully enabled.', 'success');
                document.getElementById('2fa-status').textContent = 'Status: Enabled';
                document.getElementById('enable-2fa-btn').style.display = 'none';
                document.getElementById('disable-2fa-btn').style.display = 'inline-block';
                document.getElementById('qr-code-container').remove();
                document.getElementById('2fa-code-input').style.display = 'none';
                
                // Go to the settings page
                // settingsPage();
            } else {
                error('Error verifying 2FA: ' + data.error, 'error');
            }
        })
        .catch(error => console.error('Error verifying 2FA:', error));
}


function disable2FA() {
    fetch('/api/disable-2fa/', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                error('2FA successfully disabled.', 'success');
                document.getElementById('2fa-status').textContent = 'Status: Not Enabled';
                document.getElementById('enable-2fa-btn').style.display = 'inline-block';
                document.getElementById('disable-2fa-btn').style.display = 'none';
            } else {
                error('Error disabling 2FA: ' + data.error, 'error');
            }
        })
        .catch(error => console.error('Error disabling 2FA:', error));
}

function changeUserName() {
    const newUsername = document.getElementById('username').value;
    const currentUsername = loggedInUser;

    if (!newUsername) {
        error('Please enter a new username.', 'error');
        return;
    }

    const csrfToken = getCSRFToken();

    fetch('/api/change-username/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({
        current_username: currentUsername,
        new_username: newUsername
        })
    })
    .then(response => response.json())
    .then(data => {
    if (data.status === 'success') {
        error('Username changed successfully!', 'success');
        loggedInUser = newUsername;
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        error(`Error: ${data.error}`, 'error');
    }
    })
    .catch(error => {
    console.error('Error:', error);
    error('An error occurred while changing the username.', 'error');
    });
}


function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    if (!currentPassword || !newPassword || !confirmPassword) {
      error('Please fill in all password fields.', 'error');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      error('New password and confirm password do not match.', 'error');
      return;
    }
  
    const csrfToken = getCSRFToken();
  
    fetch('/api/change-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
      },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword
      })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          error('Password changed successfully!', 'success');
          login();
        } else {
          error(`Error: ${data.error}`, 'error');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        error('An error occurred while changing the password.', 'error');
      });
 }

 function deleteAccount() {
    const confirmationModal = document.getElementById('quit-confirmation');
    confirmationModal.classList.remove('hidden');
}

function cancelDeletation() {
    const confirmationModal = document.getElementById('quit-confirmation');
    confirmationModal.classList.add('hidden');
}

function confirmDeletation() {
    fetch('/api/delete-account/', {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCSRFToken(),
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            error('Account deleted successfully!', 'success');
            setTimeout(() => {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('gdpr');
                localStorage.removeItem('currentPage');
                window.location.href = "https://localhost:8000/";
            }, 1000);
        } else {
            error(`Error: ${data.error || 'Unknown error occurred'}`, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        error(error.message || 'An error occurred while deleting the account. Please try again later.', 'error');
    });
}
