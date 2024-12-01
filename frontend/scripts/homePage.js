function homePage() {
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
      <li><a href="#" title="Account"><i class="fa-solid fa-user-plus"></i><span>Account</span></a></li>
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
        <h1>Sumon</h1>
      </div>
      <div class="round">
          <div class="profile-pic" onclick="document.getElementById('profile-picture-input').click();">
              <img id="profile-picture" src="./images/11475215.jpg" alt="Profile Picture">
          </div>
      </div>
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
}


function handleLogout(event) {
  event.preventDefault(); // Prevent the default anchor behavior

  // Fetch the CSRF token from the meta tag
  const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

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
              chatPage(); // Redirect to the chat page or another page
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
