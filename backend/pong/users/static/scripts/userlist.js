function userList() {
    saveCurrentPage('userList');
    history.pushState({ page: 'userList' }, '', '#userList');

    const body = document.body;

    // Clear existing content
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "leaderboard-container";

    // Fetch leaderboard data
    fetch('/api/users/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(users => {
            if (!users || users.length === 0) {
                // Render empty user list message
                div.innerHTML = `
                    <div class="inside-wel" style="display: flex; justify-content: center; align-items: center; height: 450px; width: 400px; position: fixed; left: 90px; top: 150px;">
                        <div class="temp" style="text-align: center;">
                            <p>Empty user list</p>
                        </div>
                    </div>
                    <div class="quit-game" onclick="homePage()">
                        <h1>BACK</h1>
                    </div>
                `;
                body.appendChild(div);
                return;
            }

            // Filter out the logged-in user
            const filteredData = users.filter(user => user.username !== loggedInUser);

            // Render user list
            div.innerHTML = `
                <div class="title-all-rank">
                    <h2>User List</h2>
                </div>
                <div class="all-players">
                    ${filteredData.map(user => {
                        const avatarUrl = user.profile__photo 
                            ? `/media/${user.profile__photo}` 
                            : '/../static/images/11475215.jpg';

                        return `
                            <div class="player">
                                <img onclick="userProfile('${user.username}')" src="${avatarUrl}" alt="${user.username}'s avatar">
                                <span class="player-name">${formatPlayerName(user.username)}</span>
                                <span onclick="userProfile('${user.username}')" class="badge text-bg-warning">View Profile</span>
                                <span class="badge text-bg-light" onclick="chatPage(); startChat('${user.username}', '${avatarUrl}')">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                                    </svg>
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="quit-game" onclick="homePage()">
                    <h1>BACK</h1>
                </div>
            `;
            body.appendChild(div);
        })
        .catch(error => {
            console.error('Error fetching leaderboard data:', error);
            div.innerHTML = `<p>Failed to load leaderboard data. Please try again later.</p>`;
            body.appendChild(div);
        });
}

// Format player names
function formatPlayerName(name) {
    if (name.length > 11) {
        return name.substring(0, 11) + '.';
    } else {
        return name.padEnd(11, ' ');
    }
}
