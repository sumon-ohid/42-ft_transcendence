function leaderboard() {
    saveCurrentPage('leaderboard');
    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "leaderboard-container";

    // Fetch leaderboard data
    fetch('/users/api/leaderboard/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data || data.length === 0) {
                div.innerHTML = `<p>No leaderboard data available.</p>`;
                body.appendChild(div);
                return;
            }
            data.sort((a, b) => b.score - a.score);
            const topPlayer = data[0];
            div.innerHTML = `
                <div class="top-player">
                    <div class="top-badge"></div>
                    <h2>Rank 1</h2>
                    <div class="player-top">
                        <img src="/users${topPlayer.avatar}" alt="${topPlayer.name}'s avatar">
                        <span class="badge text-bg-warning">${topPlayer.name}</span>
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
                            <img src="/users${player.avatar}" alt="${player.name}'s avatar">
                            <span class="badge text-bg-warning">${player.name}</span>
                            <span class="badge text-bg-light">${player.score}</span>
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
