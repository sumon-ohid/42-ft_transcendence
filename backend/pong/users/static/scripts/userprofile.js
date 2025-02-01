function userProfile(username) {
    if (username == loggedInUser) {
        navigateTo('#settings');
        return;
    }
    if (username && username != loggedInUser) {
        localStorage.setItem('currentUsername', username);
    } else {
        username = localStorage.getItem('currentUsername') || 'Guest';
    }
    saveCurrentPage('userProfile');
  
    if (!userIsLoggedIn()) {
        navigateTo('#login');
        return;
    }

    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    fetch(`/api/user-profile/${username}/`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const avatarUrl = data.profile__photo ? `${data.profile__photo}` : '/../static/images/11475215.jpg';
            const isFriend = data.is_friend;
            const friendButtonText = isFriend ? 'Unblock' : 'Block';
            const friendButtonClass = isFriend ? 'badge text-bg-primary' : 'badge text-bg-danger';

            const div = document.createElement("div");
            div.className = "settings-container";
            div.innerHTML = ` 
                <div class="user-profile-design"> </div>
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
                <div class="quit-game" onclick="navigateTo('#homePage')">
                    <h1>HOME</h1>
                </div>
                <span id="user-name" class="badge text-bg-light">${username}</span>
                <span id="block" class="${friendButtonClass}" onclick="toggleBlock('${username}')">${friendButtonText}</span>
                <span id="chat-icon" class="chat-icon" onclick="chatPage(); startChat('${username}', '${avatarUrl}'); navigateTo('#chatPage');">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                    </svg>
                    chat
                </span>
            `;
            body.appendChild(div);

            // Player history
            fetch(`/api/get-play-history/${username}/`)
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

                    }
                })
                .catch(error => {
                    console.error('Error fetching play history:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
        });
}

// Handle block, unblock user
function toggleBlock(username) {
    const addFriendButton = document.getElementById('block');
    if (addFriendButton.textContent === 'Block') {
        fetch(`/api/add-block/${username}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Friend added') {
                addFriendButton.textContent = 'Unblock';
                addFriendButton.classList.remove('text-bg-danger');
                addFriendButton.classList.add('text-bg-primary');
                error('User blocked', 'success');
            } else {
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error adding friend:', error));
    } else {
        fetch(`/api/remove-block/${username}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken()
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'Friend removed') {
                addFriendButton.textContent = 'Block';
                addFriendButton.classList.remove('text-bg-primary');
                addFriendButton.classList.add('text-bg-danger');
            } else {
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error removing friend:', error));
    }
}

function getCSRFToken() {
    const csrfCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
}