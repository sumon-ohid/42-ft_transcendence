function userProfile(username) {
    if (username) {
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

    // Fetch user profile
    fetch(`/api/user-profile/${username}/`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const avatarUrl = data.profile__photo ? `${data.profile__photo}` : '/../static/images/11475215.jpg';
            const isFriend = data.is_friend;
            const friendButtonText = isFriend ? 'Block' : 'Unblock';
            const friendButtonClass = isFriend ? 'badge text-bg-danger' : 'badge text-bg-primary';

            // Create a new div element and add content
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
                <span id="user-name" class="badge text-bg-secondary">${username}</span>
                <span id="add-friend" class="${friendButtonClass}" onclick="toggleBlock('${username}')">${friendButtonText}</span>
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

function toggleBlock(username) {
    const addFriendButton = document.getElementById('add-friend');
    if (addFriendButton.textContent === 'Unblock') {
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
                addFriendButton.textContent = 'Block';
                addFriendButton.classList.remove('text-bg-primary');
                addFriendButton.classList.add('text-bg-danger');
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
                addFriendButton.textContent = 'Unblock';
                addFriendButton.classList.remove('text-bg-danger');
                addFriendButton.classList.add('text-bg-primary');
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