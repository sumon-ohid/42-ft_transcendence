function leaderboard() {
    saveCurrentPage('leaderboard');

    if (!userIsLoggedIn()) {
        navigateTo('#login');
        return;
    }

    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "leaderboard-container";

    fetch('/api/leaderboard/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                div.innerHTML = /*html*/ `
                    <div class="title-all-rank">
                        <h2>Leaderboard</h2>
                    </div>
                    <div class="inside-wel2">
                        <div class="temp">
                            <p>No data available...</p>
                        </div>
                    </div>
                    <div class="quit-game" onclick="navigateTo('#homePage')">
                        <h1>BACK</h1>
                    </div>
                `;
                body.appendChild(div);

                // const tempElement = document.querySelector('.inside-wel');
                // if (tempElement) {
                //     tempElement.style.display = 'flex';
                //     tempElement.style.justifyContent = 'center';
                //     tempElement.style.alignItems = 'center';
                //     tempElement.style.height = '450px';
                //     tempElement.style.width = '400px';
                //     tempElement.style.position = 'fixed';
                //     tempElement.style.left = '90px';
                //     tempElement.style.top = '150px';
                // }

                // const tempElement2 = document.querySelector('.temp');
                // if (tempElement2) {
                //     tempElement2.style.position = 'fixed';
                //     tempElement2.style.right = '20%';
                // }
                
                // const tempElement3 = document.querySelector('.temp p');
                // if (tempElement3) {
                //     tempElement3.style.position = 'fixed';
                //     tempElement3.style.right = '20%';
                // }  
                return;
            }
            data.sort((a, b) => b.score - a.score);
            const topPlayer = data[0];
            div.innerHTML = /*html*/ `
                 <div class="top-player">
                        <div class="top-badge"></div>
                        <h2>Rank 1</h2>
                        <div class="player-top">
                            <img src="${topPlayer.avatar}" alt="${topPlayer.name}'s avatar">
                            <span class="badge text-bg-warning">${formatPlayerName(topPlayer.name)}</span>
                            <span class="badge text-bg-light">${topPlayer.score}</span>
                        </div>
                    </div>
                    <div class="title-all-rank">
                        <h2>All Rankings</h2>
                    </div>
                    <div class="all-players">
                        ${data.map((player, index) => `
                            <div class="player">
                                <span class="rank-number">Rank ${index + 1}</span>
                                <img onclick="" src="${player.avatar}" alt="${player.name}'s avatar">
                                <span class="player-name">${formatPlayerName(player.name)}</span>
                                <span class="badge text-bg-light">${player.score}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="quit-game" onclick="navigateTo('#homePage')">
                        <h1>BACK</h1>
                    </div>
                `;
            body.appendChild(div);
        })
        .catch(error => {
            console.error('Error fetching leaderboard data:', error);
            div.innerHTML = /*html*/ `<p>Failed to load leaderboard data. Please try again later.</p>`;
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
