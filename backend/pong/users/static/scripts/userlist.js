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
                            <span class="badge text-bg-danger">Block</span>
                            <span class="badge text-bg-info" onclick="chatPage(); startChat('${player.name}', '${player.avatar}')">Chat</span>
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
