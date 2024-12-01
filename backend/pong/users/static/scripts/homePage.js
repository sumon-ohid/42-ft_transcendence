let loggedInUser = "Guest";

function homePage() {
  saveCurrentPage('homePage');
  const body = document.body;

  // Remove all child elements of the body
  while (body.firstChild) {
      body.removeChild(body.firstChild);
  }

  // Create nav bar and add content
  const nav = document.createElement("nav");
  nav.className = "navbar";
  nav.innerHTML = ` 
    <ul class="nav-menu">
      <li><a href="#" title="Home" onclick="homePage()"><i class="fa-solid fa-house"></i><span>Home</span></a></li>
      <li><a href="#" title="Account"><i class="fa-solid fa-clock-rotate-left"></i><span>History</span></a></li>
      <li><a href="#" title="Settings" onclick="settingsPage()"><i class="fa-solid fa-gear"></i><span>Settings</span></a></li>
      <li><a href="#" title="Game" onclick="gamePage()"><i class="fa-solid fa-gamepad"></i><span>Game</span></a></li>
      <li><a href="#" title="Leaderboard" onclick="leaderboard()"><i class="fa-solid fa-trophy"></i><span>Leaderboard</span></a></li>
      <li><a href="https://github.com/sumon-ohid/42-Ft_transcendence" title="Github Star"><i class="fa-solid fa-star"></i><span>Github Star</span></a></li>
      <li><a href="#" title="Chat" onclick="chatPage()"><i class="fa-solid fa-message"></i><span>Chat</span></a></li>
      <li><a href="#" title="logout" onclick="handleLogout(event)"><i class="fa-solid fa-right-from-bracket"></i><span>Logout</span></a></li>
    </ul>
  `;
  body.appendChild(nav);

  // Create a new div element and add content
  const div = document.createElement("div");
  div.className = "main";
  div.innerHTML = ` 
    <div class="wel-container">
      <div class="edit-pic">
        <span class="badge text-bg-primary">change</span>
      </div>
      <div class="wel-user">
        <p>welcome</p>
        <h1>Guest</h1>
      </div>
      <div class="round">
          <div class="profile-pic" onclick="document.getElementById('profile-picture-input').click();">
              <img id="profile-picture" src="/users/../static/images/11475215.jpg" alt="Picture">
          </div>
      </div>
      <input type="file" id="profile-picture-input" name="profile_picture" accept="image/*" style="display: none;">
      <div class="inside-wel">
        <div class="temp">
          <p>coming soon..</p>
        </div>
      </div>
    </div>
    <div class="play-container" onclick="gamePage()">
      <div class="yellow-badge">
        <span class="badge rounded-pill text-bg-warning">🔥 popular</span>
      </div >
      <div class="rocket">
        <span class="badge text-bg-light">🚀 42k+ played</span>
      </div>
      <div class="ball-bat">🏓</div>
      <h1 class="play">PLAY</h1>
      <div class="play-pic"></div>
    </div>
    <div class="account-container" onclick="settingsPage()">
      <h1 class="settings">SETTINGS</h1>
      <div class="settings-pic"></div>
      <div class="settings-3d"></div>
    </div>
    <div class="leader-container" onclick="leaderboard()">
      <div class="leader-pic"></div>
      <h1 class="leaderboard">LEADERBOARD</h1>
      <div class="leader-div"></div>
    </div>
    <div class="chat-container" onclick="chatPage()">
      <div class="in-chat"> </div>
      <h1 class="chat">CHAT</h1>
      <div class="chat-pic"></div>
      <p>with <br> friends</p>
    </div>
  `;
  body.appendChild(div);

  // GET USERNAME
  fetch('/users/api/get-username/', {
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

  fetch('/users/api/get-profile-picture/')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const profilePicture = document.getElementById('profile-picture');
    if (data.photo) {
      profilePicture.src = "/users" + data.photo;
    } else {
      profilePicture.src = '/users/../static/images/11475215.jpg';
    }
  })
  .catch(error => {
    console.error('Error fetching profile picture:', error);
    const profilePicture = document.getElementById('profile-picture');
    profilePicture.src = '/users/../static/images/11475215.jpg';
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

        fetch('/users/api/upload-profile-picture/', {
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


function getCSRFToken() {
  // Retrieve the CSRF token from cookies
  const csrfCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='));
  return csrfCookie ? csrfCookie.split('=')[1] : null;
}


function handleLogout(event) {
  event.preventDefault();
  // Get the CSRF token from the cookie
  const csrfToken = getCSRFToken();

  if (!csrfToken) {
      alert("CSRF token not found. Logout request cannot be sent.");
      return;
  }
  // Send a logout request to the backend
  fetch('/users/api/logout/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
      },
  })
      .then(response => {
          if (response.ok) {
              alert("You have been logged out.");
              login();
          } else {
              return response.json().then(data => {
                  alert("Logout failed: " + (data.error || "Unknown error."));
              });
          }
      })
      .catch(error => {
          console.error("Error during logout:", error);
          alert("An error occurred while logging out.");
      });
}

function getLoggedInUser () {
  return loggedInUser;
}

// Reload should keep on the same page
function saveCurrentPage(page) {
  localStorage.setItem('currentPage', page);
}

document.addEventListener('DOMContentLoaded', () => {
  const currentPage = localStorage.getItem('currentPage');
  if (currentPage) {
    switch (currentPage) {
      case 'homePage':
        homePage();
        break;
      case 'settingsPage':
        settingsPage();
        break;
      case 'gamePage':
        gamePage();
        break;
      case 'leaderboard':
        leaderboard();
        break;
      case 'chatPage':
        chatPage();
        break;
      case 'login':
        login();
        break;
      case 'signup':
        signup();
        break;
      default:
        login();
      }
  }
});
