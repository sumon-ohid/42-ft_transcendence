let loggedInUser = "Guest";

async function fetchUsername() {
    try {
        const response = await fetch('/api/get-username/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('meta[name="csrf-token"]').content
            }
        });
        const data = await response.json();
        loggedInUser = data.username;
        if (data.username.length > 6)
          data.username = data.username.substring(0, 6) + '.';
        return data.username || "Guest";
    } catch (error) {
        console.error('Error fetching username:', error);
        return "Guest";
    }
}

async function fetchProfilePicture() {
    try {
        const response = await fetch('/api/get-profile-picture/');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.photo || '/../static/images/11475215.jpg';
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        return '/../static/images/11475215.jpg';
    }
}

async function homePage() {
    saveCurrentPage('homePage');
    history.replaceState({ page: 'homePage' }, '', '#homePage');
    
    const body = document.body;
    
    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
    
    // Fetch username and profile picture asynchronously
    // This solves the reload problem which was showing 
    // default value first the fetch value from user.
    const [username, profilePicture] = await Promise.all([fetchUsername(), fetchProfilePicture()]);
    
    if (loggedInUser === 'Guest') {
        saveCurrentPage('login');
        login();
        return;
    }
    
    // nav bar and add content for navigation
    const nav = document.createElement("nav");
    nav.className = "navbar";
    nav.innerHTML = ` 
        <ul class="nav-menu">
            <li><a href="#" title="Home" onclick="homePage()"><i class="fa-solid fa-house"></i><span>Home</span></a></li>
            <li><a href="#" title="Other Users" onclick="userList()" ><i class="fa-solid fa-users"></i><span>Users</span></a></li>
            <li><a href="#" title="Settings" onclick="settingsPage()"><i class="fa-solid fa-gear"></i><span>Settings</span></a></li>
            <li><a href="#" title="Game" onclick="gameOptions()"><i class="fa-solid fa-gamepad"></i><span>Game</span></a></li>
            <li><a href="#" title="Leaderboard" onclick="leaderboard()"><i class="fa-solid fa-trophy"></i><span>Leaderboard</span></a></li>
            <li><a href="https://github.com/sumon-ohid/42-Ft_transcendence" title="Github Star"><i class="fa-solid fa-star"></i><span>Github Star</span></a></li>
            <li><a href="#" title="Chat" onclick="chatPage()"><i class="fa-solid fa-message"></i><span>Chat</span></a></li>
            <li><a href="#" title="logout" onclick="handleLogout(event)"><i class="fa-solid fa-right-from-bracket"></i><span>Logout</span></a></li>
        </ul>
    `;
    body.appendChild(nav);

    // a new div element and add content , this is the left side 4 conatiners.
    const div = document.createElement("div");
    div.className = "main";
    div.innerHTML = ` 
        <div class="wel-container">
            <div class="edit-pic">
                <span class="badge text-bg-primary">change</span>
            </div>
            <div class="wel-user">
                <p>welcome</p>
                <h1>${username}</h1>
            </div>
            <div class="round">
                <div class="profile-pic" onclick="document.getElementById('profile-picture-input').click();">
                    <img id="profile-picture" src="${profilePicture}" alt="Picture">
                </div>
            </div>
            <input type="file" id="profile-picture-input" name="profile_picture" accept="image/*" style="display: none;">
            <div class="inside-wel">
                <div class="temp">
                    <p>No history...</p>
                </div>
            </div>
        </div>
        <div class="play-container" onclick="gameOptions()">
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
                    error('Profile picture uploaded successfully');
                } else {
                    error('Error uploading profile picture');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    });

    //Get Player history for logged it user.
    fetch(`/api/get-play-history/${loggedInUser}`)
        .then(response => response.json())
        .then(data => {
            const historyContainer = document.querySelector('.inside-wel');
            
            if (data.length != 0) {
                historyContainer.innerHTML = '';
                data.slice(-5).forEach(record => {
                    const recordElement = document.createElement('div');
                    recordElement.className = 'history-record';
                    let result = record.win ? 'Win' : 'Lose';
                    const resultClass = result === 'Win' ? 'badge text-bg-info' : 'badge text-bg-warning';
                    recordElement.innerHTML = `
                    <div>
                        <span class="badge text-bg-light">
                            <p>Date: ${new Date(record.date).toLocaleDateString()}</p>
                        </span>
                    </div>
                    <div>
                        <span class="badge text-bg-primary">
                            <p>Score: ${record.score}</p>
                        </span>
                    </div>
                    <div>
                        <span class="${resultClass}">
                            <p>Result: ${result}</p>
                        </span>
                    </div>
                    `;
                    historyContainer.appendChild(recordElement);
                });

                const welContainer = document.querySelector('.wel-container');
                const recent = document.createElement('h2');
                recent.innerText = "recent history";
                welContainer.appendChild(recent);
            }
        })
        .catch(error => {
            console.error('Error fetching play history:', error);
        });
}

function getCSRFToken() {
    const metaToken = document.querySelector('meta[name="csrf-token"]');
    if (metaToken) {
        return metaToken.content;
    }
    const csrfCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
}

function handleLogout(event) {
    event.preventDefault();
    const csrfToken = getCSRFToken();

    if (!csrfToken) {
        error("CSRF token not found. Logout request cannot be sent.");
        return;
    }
    fetch('/api/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
    })
        .then(response => {
            if (response.ok) {
                error("You have been logged out.");
                login();
            } else {
                return response.json().then(data => {
                    error("Logout failed: " + (data.error || "Unknown error."));
                });
            }
        })
        .catch(error => {
            console.error("Error during logout:", error);
            error("An error occurred while logging out.");
        });
}

function getLoggedInUser() {
    return loggedInUser;
}

// Reload should keep on the same page
// NOTE: If someone knows a better way to do it,
// please let me know. SMN
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
            case '2fa':
                show2FAPage();
                break;
            case 'userProfile':
                userProfile();
                break;
            case 'userList':
                userList();
                break; 
            case 'gameOptions':
                gameOptions();
                break;              
            // default:
            //   window.location.href = '';
        }
    }
});

// Handle back and forward button, push, pop, replace states in the history.
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        switch (event.state.page) {
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
            case '2fa':
                show2FAPage();
                break;
            case 'userList':
                userList();
                break;
            case 'userProfile':
                userProfile()
                break;
            case 'gameOptions':
                gameOptions();
                break;
            // default:
            //   window.location.href = '/index.html';
        }
    }
});
