let loggedInUser = '';

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
        return data.username || "";
    } catch (error) {
        console.error('Error fetching username:', error);
        return "";
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
    
    const body = document.body;
    
    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
    
    // Fetch username and profile picture asynchronously
    // This solves the reload problem which was showing 
    // default value first the fetch value from user.
    const [username, profilePicture] = await Promise.all([fetchUsername(), fetchProfilePicture()]);
    
    localStorage.setItem('loggedInUser', username);

    // if (loggedInUser === 'Guest') {
    //     saveCurrentPage('login');
    //     login();
    //     return;
    // }
    
    // nav bar and add content for navigation
    const nav = document.createElement("nav");
    nav.className = "navbar";
    nav.innerHTML = ` 
        <ul class="nav-menu">
            <li><a title="Home" onclick="navigateTo('#homePage')"><i class="fa-solid fa-house"></i><span>Home</span></a></li>
            <li><a title="Users" onclick="navigateTo('#userList')"><i class="fa-solid fa-users"></i><span>Users</span></a></li>
            <li><a title="Settings" onclick="navigateTo('#settingsPage')"><i class="fa-solid fa-gear"></i><span>Settings</span></a></li>
            <li><a title="Game" onclick="navigateTo('#gameOptions')"><i class="fa-solid fa-gamepad"></i><span>Game</span></a></li>
            <li><a title="Leaderboard" onclick="navigateTo('#leaderboard')"><i class="fa-solid fa-trophy"></i><span>Leaderboard</span></a></li>
            <li><a href="https://github.com/sumon-ohid/42-Ft_transcendence" title="Github Star"><i class="fa-solid fa-star"></i><span>Github Star</span></a></li>
            <li><a title="Chat" onclick="navigateTo('#chatPage')"><i class="fa-solid fa-message"></i><span>Chat</span></a></li>
            <li><a href="" title="logout" onclick="handleLogout(event)"><i class="fa-solid fa-right-from-bracket"></i><span>Logout</span></a></li>
        </ul>
    `;
    body.appendChild(nav);

    // a new div element and add content , this is the left side 4 conatiners.
    const div = document.createElement("div");
    div.className = "main";
    div.innerHTML = ` 
        <div class="wel-container">
            <div class="edit-pic" onclick="document.getElementById('profile-picture-input').click();">
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
        <div class="play-container" onclick="navigateTo('#gameOptions')">
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
        <div class="account-container" onclick="navigateTo('#settingsPage')">
            <h1 class="settings">SETTINGS</h1>
            <div class="settings-pic"></div>
            <div class="settings-3d"></div>
        </div>
        <div class="leader-container" onclick="navigateTo('#leaderboard')">
            <div class="leader-pic"></div>
            <h1 class="leaderboard">LEADERBOARD</h1>
            <div class="leader-div"></div>
        </div>
        <div class="chat-container" onclick="navigateTo('#chatPage')">
            <div class="in-chat"> </div>
            <h1 class="chat">CHAT</h1>
            <div class="chat-pic"></div>
            <p>with <br> friends</p>
        </div>
        <div id="ad-42vienna" style="display: none;">
            <button id="close-ad-btn" title="Close Ad">&times;</button>
            <a href="https://www.42vienna.com/en/" target="_blank">
                <img src="/static/images/42ad.png" alt="42 Vienna Ad" width="100%" height="100%">
            </a>
        </div>
    `;
    
    body.appendChild(div);

    // :: JUST FOR FUN :: //
    // Pop up ad after 5 seconds and hide after 10 seconds
    const adElement = document.getElementById("ad-42vienna");
    const closeButton = document.getElementById("close-ad-btn");

    if (adElement) {
        setTimeout(() => {
            adElement.style.display = "none"; // Change to "block" to show the ad
            setTimeout(() => {
                adElement.style.display = "none";
            }, 10000);
        }, 5000);
    } else {
        console.error("Ad element not found in the DOM.");
    }
    
    if (closeButton) {
        closeButton.addEventListener("click", () => {
            adElement.style.display = "none";
        });
    } else {
        console.error("Close button not found in the DOM.");
    }
    //------------------------------------------------//

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
            const jwtToken = localStorage.getItem('jwtToken');

            fetch('/api/upload-profile-picture/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Authorization': `Bearer ${jwtToken}`
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    error('Profile picture uploaded successfully');
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
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
            // change page to login if user is not logged in
            saveCurrentPage('login');
            // reload the page
            window.location.reload();
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

    // remove saved page
    localStorage.removeItem('currentPage');

    if (!csrfToken) {
        error("CSRF token not found. Logout request cannot be sent.", "error");
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
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('loggedInUser');
                error("You have been logged out.", "success");
                window.location.href = 'https://localhost:8000/';
            } else {
                return response.json().then(data => {
                    error("Logout failed: " + (data.error || "Unknown error."), "error");
                });
            }
        })
        .catch(error => {
            console.error("Error during logout:", error);
            error("An error occurred while logging out.", "error");
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

function showAd() {
    const ad = document.getElementById('ad-42vienna');
    ad.style.display = ad.style.display === 'none' ? 'block' : 'none';
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
            case 'multiGamePage':
                multiGamePage();
                break;
            case 'tournamentPage':
                tournamentPage();
                break;
            case 'createTournamentPage':
                createTournamentPage();
                break;
            case 'choosePlayersForTournamentPage':
                choosePlayersForTournamentPage();
                break;
            case 'roundRobinStage':
                roundRobinStage();
                break;
            case 'semiFinalStage':
                semiFinalStage();
                break;
            case 'finalStage':
                finalStage();
                break;
            case 'tournamentGamePage':
                tournamentGamePage();
                break;
            case 'startGame':
                startGame();
                break;
            default:
                homePage();
        }
    }
});

function navigateTo(path) {
    let newPath = path.replace('#', '');
    history.pushState({ page: newPath }, "", path);
    renderPage(newPath);
}

function renderPage(page) {
    switch (page) {
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
            userProfile();
            break;
        case 'gameOptions':
            gameOptions();
            break;
        case 'multiGamePage':
            multiGamePage();
            break;
        case 'tournamentPage':
            tournamentPage();
            break;
        case 'createTournamentPage':
            createTournamentPage();
            break;
        case 'choosePlayersForTournamentPage':
            choosePlayersForTournamentPage();
            break;
        case 'roundRobinStage':
            roundRobinStage();
            break;
        case 'semiFinalStage':
            semiFinalStage();
            break;
        case 'finalStage':
            finalStage();
            break;
        case 'tournamentGamePage':
            tournamentGamePage();
            break;
        default:
            homePage();
    }
}

// Handle back and forward button, push, pop, replace states in the history.
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        renderPage(event.state.page);
    } else {
        renderPage('homePage');
    }
});
