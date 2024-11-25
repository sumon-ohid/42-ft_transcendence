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
            <h2>Top Player</h2>
            <div class="player">
                <img src="${players[0].avatar}" alt="${players[0].name}'s avatar">
                <span>${players[0].name}</span>
                <span>${players[0].score}</span>
            </div>
        </div>
        <div class="all-players">
            <h2>All Players</h2>
            ${players.map((player, index) => `
                <div class="player">
                    <span>${index + 1}</span>
                    <img src="${player.avatar}" alt="${player.name}'s avatar">
                    <span>${player.name}</span>
                    <span>${player.score}</span>
                </div>
            `).join('')}
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