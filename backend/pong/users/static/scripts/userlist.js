function userList() {
    saveCurrentPage('userList');
    history.pushState({ page: 'userList' }, '', '#userList');

    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "leaderboard-container";

    // Fetch leaderboard data
    fetch('/api/leaderboard/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                div.innerHTML = `
                    <div class="inside-wel">
                        <div class="temp">
                            <p>Empty user list</p>
                        </div>
                    </div>
                    <div class="quit-game" onclick="homePage()">
                        <h1>BACK</h1>
                    </div>
                `;
                body.appendChild(div);

                const tempElement = document.querySelector('.inside-wel');
                if (tempElement) {
                    tempElement.style.display = 'flex';
                    tempElement.style.justifyContent = 'center';
                    tempElement.style.alignItems = 'center';
                    tempElement.style.height = '450px';
                    tempElement.style.width = '400px';
                    tempElement.style.position = 'fixed';
                    tempElement.style.left = '90px';
                    tempElement.style.top = '150px';
                }

                const tempElement2 = document.querySelector('.temp');
                if (tempElement2) {
                    tempElement2.style.position = 'fixed';
                    tempElement2.style.right = '20%';
                }
                
                const tempElement3 = document.querySelector('.temp p');
                if (tempElement3) {
                    tempElement3.style.position = 'fixed';
                    tempElement3.style.right = '20%';
                }  
                return;
            }
            data.sort((a, b) => b.score - a.score);
                        const currentUsername = localStorage.getItem('currentUsername') || 'Guest';
            
            const filteredData = data.filter(player => player.name !== currentUsername);
            
            div.innerHTML = `
                <div class="title-all-rank">
                    <h2>User List</h2>
                </div>
                <div class="all-players">
                    ${filteredData.map((player, index) => `
                        <div class="player">
                            <img onclick="userProfile('${player.name}')" src="${player.avatar}" alt="${player.name}'s avatar">
                            <span class="player-name">${formatPlayerName(player.name, 11)}</span>
                            <span onclick="userProfile('${player.name}')" class="badge text-bg-warning">View Profile</span>
                            <span class="badge text-bg-light" onclick="chatPage(); startChat('${player.name}', '${player.avatar}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat" viewBox="0 0 16 16">
                                    <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                                </svg>
                            </span>
                        </div>
                    `).join('')}
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


function formatPlayerName(name) {
    if (name.length > 11) {
        return name.substring(0, 11) + '.';
    } else {
        return name.padEnd(11, ' ');
    }
}
