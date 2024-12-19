let username = 'Guest'

function userProfile(userName) {
    if (userName) {
        username = userName;
        localStorage.setItem('currentUsername', username);
    } else {
        username = localStorage.getItem('currentUsername') || 'Guest';
    }
    saveCurrentPage('userProfile');
    history.replaceState({ page: 'userProfile' }, '', '#userProfile');
  
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
    
    let avatarUrl = '/../static/images/11475215.jpg'; // default avatar

    // Fetch and display users
    fetch('/api/users/')
        .then(response => response.json())
        .then(users => {
            // Find the user and set the avatarUrl
            const user = users.find(user => user.username === username);
            if (user) {
                if (user.profile__photo)
                    avatarUrl = "media/" + user.profile__photo; // Set avatarUrl if username matches
            }
            
            // After fetching the user info and avatarUrl, proceed to render the profile page
            renderProfilePage(username, avatarUrl);
        })
        .catch(error => console.error('Error fetching users:', error));

    // Function to render the profile page
    function renderProfilePage(username, avatarUrl) {

        const div = document.createElement("div");
        div.className = "settings-container";
        div.innerHTML = ` 
            <div class="round">
                <div class="profile-pic">
                    <img id="profile-picture" src="${avatarUrl}" alt="Picture">
                </div>
            </div>
            <div class="inside-wel">
                <div class="temp">
                    <p>No history...</p>
                </div>
            </div>
            <div class="quit-game" onclick="homePage()">
                <h1>BACK</h1>
            </div>
            <span id="user-name" class="badge text-bg-secondary">${username.substring(0, 15)}</span>
            <span id="add-friend" class="badge text-bg-primary">Add Friend</span>
            <span id="block" class="badge text-bg-danger">Block</span>
        `;
        body.appendChild(div);

        // Player history
        fetch(`/api/get-play-history/${username}`)
            .then(response => response.json())
            .then(data => {
                const historyContainer = document.querySelector('.inside-wel');
                
                if (data.length !== 0) {
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
                }
            })
            .catch(error => {
                console.error('Error fetching play history:', error);
            });
    }
}

function getCSRFToken() {
    const csrfCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
}
