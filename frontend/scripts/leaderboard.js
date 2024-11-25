function leaderboard() {
    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    // Sample data for leaderboard
    const players = [
        { name: "Player 1", score: 100, avatar: "./avatars/avatar1.png" },
        { name: "Player 2", score: 90, avatar: "./avatars/avatar2.png" },
        { name: "Player 3", score: 80, avatar: "./avatars/avatar3.png" },
        { name: "Player 4", score: 70, avatar: "./avatars/avatar4.png" },
        { name: "Player 5", score: 60, avatar: "./avatars/avatar5.png" },
        { name: "Player 6", score: 50, avatar: "./avatars/avatar6.png" },
        { name: "Player 7", score: 40, avatar: "./avatars/avatar2.png" },
        { name: "Player 8", score: 30, avatar: "./avatars/avatar1.png" },
        { name: "Player 9", score: 20, avatar: "./avatars/avatar4.png" },
        { name: "Player 10", score: 10, avatar: "./avatars/avatar5.png" }
    ];

    // Sort players by score in descending order
    players.sort((a, b) => b.score - a.score);

    // Create a new div element and add content to it
    const div = document.createElement("div");
    div.className = "leaderboard-container";
    div.innerHTML = `
        <div class="top-player">
            <div class="top-badge"></div>
            <h2>Rank 1</h2>
            <div class="player">
                <img src="${players[0].avatar}" alt="${players[0].name}'s avatar">
                <span class="badge text-bg-warning">${players[0].name}</span>
                <span class="badge text-bg-light">${players[0].score}</span>
            </div>
        </div>
        <div class="title-all-rank">
            <h2>All Ranking</h2>
        </div>
        <div class="all-players">
            ${players.map((player, index) => `
                <div class="player">
                    <span class="rank-number">Rank ${index + 1}</span>
                    <img src="${player.avatar}" alt="${player.name}'s avatar">
                    <span class="badge text-bg-warning">${player.name}</span>
                    <span class="badge text-bg-light">${player.score}</span>
                </div>
            `).join('')}
        </div>
            <div class="quit-game" onclick="homePage()">
                <h1>BACK</h1>
            </div>
            </div>
        </div>
    `;
    body.appendChild(div);
}

// <div class="player-header">
//     <span>Rank</span>
//     <span>Photo</span>
//     <span>Name</span>
//     <span>Score</span>
// </div>