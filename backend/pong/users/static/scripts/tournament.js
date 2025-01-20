
let tournamentMode = false;

let currentMatchIndex = 0;
let roundRobinMatches = [];

let currentSemiFinalMatchIndex = 0;
let semiFinalMatches = [];

function tournamentPage() {
    saveCurrentPage('tournamentPage');
    history.pushState({ page: 'tournamentPage' }, '', '#tournamentPage');
    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "settings-container";
    div.innerHTML = `
        <div class="pong-container-options"></div>
        <div class="pong-options"></div>
        <h2>Pong Tournament</h2>
        <div class="game-options">
            <!-- choose players for tournment -->
            <!-- from 3 to 6 players -->
            <div id="number_of_plyers">
                <p>Choose Number of players</p>
                <p>(min 3 max 6)</p>
                <input type="number" id="players" min="3" max="6" value="3">
            </div>
            <div class="form-check3" onclick="choosePlayersForTournamentPage()">
                <p>Create Tournament</p>
            </div>
        </div>
        <div class="quit-game" onclick="gameOptions()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);
}

function choosePlayersForTournamentPage() {
    saveCurrentPage('choosePlayersForTournamentPage');
    history.pushState({ page: 'choosePlayersForTournamentPage' }, '', '#choosePlayersForTournamentPage');

    // NOTE: There is an error here. when page is reloaded, the selected players are not saved.
    // Check if the number of players is valid
    const numberOfPlayers = document.getElementById('players').value;
    console.log("numberOfPlayers: ");
    console.log(numberOfPlayers);
    if (numberOfPlayers < 3 || numberOfPlayers > 6) {
        error('Please choose between 3 and 6 players.');
        return;
    }
    const players = generateRandomPlayers(numberOfPlayers);

    // printout the players in console
    console.log("Players for the tournament:");
    console.log(players);
    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "settings-container";
    div.innerHTML = `
        <h2>All Players</h2>
        <div class="player-container">
            <p>These players will play against each other <br> in the tournament</p>
            <div class="player-list" id="player-list">
            ${players.map(player => `
                <div class="player-item" onclick="selectPlayer(this)">
                    <img src="${player.avatar}" alt="${player.name}'s avatar">
                    <p>${player.name}</p>
                </div>
            `).join('')}
        </div>
        </div>
        <div class="ready">
            <button class="gamepage-button" onclick="startTournament()">Start</button>
        </div>
        <div class="quit-game" onclick="tournamentPage()">
            <h1>BACK</h1>
        </div>
    `;

    const playerList = div.querySelector('#player-list');
    const playerItems = playerList.children;

    if (playerItems.length > 3)
        playerList.classList.add('grid');
    
    body.appendChild(div);
}

function selectPlayer(element) {
    element.classList.toggle('selected-player');
}

function generateRandomPlayers(number) {
    const playerNames = [
        { name: 'Alice', avatar: '../static/avatars/avatar1.png' },
        { name: 'Bob', avatar: '../static/avatars/avatar2.png' },
        { name: 'Charlie', avatar: '../static/avatars/avatar3.png' },
        { name: 'David', avatar: '../static/avatars/avatar4.png' },
        { name: 'Frank', avatar: '../static/avatars/avatar5.png' },
        { name: 'Eve', avatar: '../static/avatars/avatar6.png' }
    ];
    const shuffled = playerNames.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, number);
}

function startTournament() {
    const selectedPlayers = document.querySelectorAll('.selected-player');
    console.log("Selected players: ");
    console.log(selectedPlayers);
    if (selectedPlayers.length < 3) {
        error('Please select at least 3 players.');
        return;
    }

    const players = Array.from(selectedPlayers).map(player => ({
        name: player.querySelector('p').innerText,
        avatar: player.querySelector('img').src
    }));

    roundRobinStage(players);
}

function roundRobinStage(players) {
    saveCurrentPage('roundRobinStage');
    history.pushState({ page: 'roundRobinStage' }, '', '#roundRobinStage');

    roundRobinMatches = generateRoundRobinMatches(players);
    console.log("Round Robin Matches: ");
    console.log(roundRobinMatches);

    currentMatchIndex = 0;
    displayCurrentMatch();
}

function generateRoundRobinMatches(players) {
    const matches = [];
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            matches.push([players[i], players[j]]);
        }
    }
    return matches;
}

let matchResults = [];

function recordMatchResult(player1, player2, result) {
    const match = matchResults.find(m => (m.player1 === player1 && m.player2 === player2) || (m.player1 === player2 && m.player2 === player1));
    if (match) {
        match.result = result;
    } else {
        matchResults.push({ player1, player2, result });
    }
    console.log(`${player1} ${result === 'win' ? 'won' : 'lost'} against ${player2}`);

    // Update player scores
    const winner = result === 'win' ? player1 : player2;
    const playerScore = playerScores.find(p => p.name === winner);
    if (playerScore) {
        playerScore.score += 3;
    }

    console.log('Match results:', matchResults);
    console.log('Player scores:', playerScores);
    
    // Ensure score table exists before updating
    createScoreTableIfNotExists();
    updateScoreTable();

    // Move to the next match
    console.log('Moving to the next match...');
    currentMatchIndex++;
    console.log('Current match index after increment:', currentMatchIndex);
    if (currentMatchIndex < roundRobinMatches.length) {
        console.log('Proceeding to the next match in round robin stage...');
        displayCurrentMatch();
    } else if (currentMatchIndex === roundRobinMatches.length) {
        console.log('Proceeding to semi-finals stage after round robin...');
        proceedToSemiFinals();
        displayCurrentSemiFinalMatch();
    } else {
        console.log('Proceeding to finals stage after semi-finals...');
        proceedToFinal();
    }
}

let playerScores = [
    { name: 'Alice', score: 0 },
    { name: 'Bob', score: 0 },
    { name: 'Charlie', score: 0 },
    { name: 'David', score: 0 },
    { name: 'Frank', score: 0 },
    { name: 'Eve', score: 0 }
];

function createScoreTableIfNotExists() {
    if (!document.getElementById('score-table-body')) {
        const table = document.createElement('table');
        table.className = 'score-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Player</th>
                    <th>Wins</th>
                </tr>
            </thead>
            <tbody id="score-table-body"></tbody>
        `;
        const container = document.createElement('div');
        container.className = 'score-table-container';
        container.innerHTML = `
            <h3>Tournament Standings</h3>
            ${table.outerHTML}
        `;
        document.body.appendChild(container);
    }
}

function updateScoreTable() {
    createScoreTableIfNotExists();
    const scoreTableBody = document.getElementById('score-table-body');
    if (!scoreTableBody) {
        console.error('Score table body not found');
        return;
    }
    
    scoreTableBody.innerHTML = ''; // Clear existing rows

    playerScores.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${player.name}</td>
            <td>${player.score}</td>
        `;
        scoreTableBody.appendChild(row);
    });
}

function displayCurrentMatch() {
    if (currentMatchIndex >= roundRobinMatches.length) {
        console.log('Invalid match index:', currentMatchIndex);
        return;
    }

    const match = roundRobinMatches[currentMatchIndex];
    if (!match) {
        console.log('Match is undefined at index:', currentMatchIndex);
        return;
    }

    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "gamepage-container";
    div.innerHTML = `
        <h2>Round Robin Stage</h2>
        <div class="match-list-container">
            <div class="match-item">
                <p>${match[0].name} vs ${match[1].name}</p>
                <button onclick='startTournamentGame(${JSON.stringify(match[0])}, ${JSON.stringify(match[1])})'>Play</button>
            </div>
        </div>
        <div class="score-table-container">
            <table class="score-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody id="score-table-body">
                    <!-- Score rows will be dynamically generated here -->
                </tbody>
            </table>
        </div>
        <div class="quit-game" onclick="tournamentPage()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);

    // Update the score table with current scores
    updateScoreTable();
}

function displayCurrentSemiFinalMatch() {
    if (currentSemiFinalMatchIndex >= semiFinalMatches.length) {
        console.log('Invalid semi-final match index:', currentSemiFinalMatchIndex);
        return;
    }

    const match = semiFinalMatches[currentSemiFinalMatchIndex];
    if (!match) {
        console.log('Semi-final match is undefined at index:', currentSemiFinalMatchIndex);
        return;
    }

    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "gamepage-container";
    div.innerHTML = `
        <h2>Semi-Finals</h2>
        <div class="match-list-container">
            <div class="match-item">
                <p>${match[0].name} vs ${match[1].name}</p>
                <button onclick='startTournamentGame(${JSON.stringify(match[0])}, ${JSON.stringify(match[1])})'>Play</button>
            </div>
        </div>
        <div class="score-table-container">
            <h3>Score Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody id="score-table-body">
                    <!-- Score rows will be dynamically generated here -->
                </tbody>
            </table>
        </div>
        <div class="quit-game" onclick="tournamentPage()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);

    // Update the score table with current scores
    updateScoreTable();
}

let semiFinalPlayers = [];

function proceedToSemiFinals() {
    const playerPoints = {};

    matchResults.forEach(match => {
        if (!playerPoints[match.player1]) playerPoints[match.player1] = 0;
        if (!playerPoints[match.player2]) playerPoints[match.player2] = 0;

        if (match.result === 'win') {
            playerPoints[match.player1] += 3;
        } else {
            playerPoints[match.player2] += 3;
        }
    });

    console.log('Player points:', playerPoints);

    const sortedPlayers = Object.keys(playerPoints).sort((a, b) => playerPoints[b] - playerPoints[a]);
    
    console.log('Sorted players:', sortedPlayers);
    
    if (sortedPlayers.length < 4) {
        console.log('Not enough players for semi-finals. Proceeding to finals with top players.');
        const topPlayers = sortedPlayers.slice(0, 2).map(playerName => {
            const match = matchResults.find(match => match.player1 === playerName || match.player2 === playerName);
            return {
                name: playerName,
                avatar: match.player1 === playerName ? match.player1.avatar : match.player2.avatar
            };
        });
        finalStage(topPlayers);
        return;
    }
    
    semiFinalPlayers = sortedPlayers.slice(0, 4).map(playerName => {
        const match = matchResults.find(match => match.player1 === playerName || match.player2 === playerName);
        return {
            name: playerName,
            avatar: match.player1 === playerName ? match.player1.avatar : match.player2.avatar
        };
    });
    
    console.log('Proceeding to semi-finals with players:', semiFinalPlayers);
    semiFinalStage(semiFinalPlayers);
}

function generateSemiFinalMatches(players) {
    return [
        [players[0], players[3]],
        [players[1], players[2]]
    ];
}

function semiFinalStage(players) {
    saveCurrentPage('semiFinalStage');
    history.pushState({ page: 'semiFinalStage' }, '', '#semiFinalStage');
    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    semiFinalMatches = generateSemiFinalMatches(players);
    currentSemiFinalMatchIndex = 0;
    displayCurrentSemiFinalMatch();
}

function proceedToFinal() {
    if (semiFinalPlayers.length < 4) {
        console.log('Not enough players for semi-finals. Proceeding to finals with top players.');
        finalStage(semiFinalPlayers.slice(0, 2));
        return;
    }

    const semiFinalMatches = matchResults.filter(match => 
        (match.player1 === semiFinalPlayers[0].name && match.player2 === semiFinalPlayers[3].name) ||
        (match.player1 === semiFinalPlayers[3].name && match.player2 === semiFinalPlayers[0].name) ||
        (match.player1 === semiFinalPlayers[1].name && match.player2 === semiFinalPlayers[2].name) ||
        (match.player1 === semiFinalPlayers[2].name && match.player2 === semiFinalPlayers[1].name)
    );

    const semiFinalWinners = semiFinalMatches.filter(match => match.result === 'win').map(match => match.player1);
    if (semiFinalWinners.length !== 2) {
        error('Please complete all semi-final matches.');
        return;
    }

    const finalPlayers = semiFinalWinners.map(playerName => {
        const match = matchResults.find(match => match.player1 === playerName || match.player2 === playerName);
        return {
            name: playerName,
            avatar: match.player1 === playerName ? match.player1.avatar : match.player2.avatar
        };
    });

    console.log('Semi-final winners:', finalPlayers);

    console.log('Proceeding to final with players:', finalPlayers);
    finalStage(finalPlayers);
}

function finalStage(players) {
    console.log('Final stage with players:', players);

    if (players.length < 2) {
        console.log('Not enough players for the final.');
        return;
    }

    saveCurrentPage('finalStage');
    history.pushState({ page: 'finalStage' }, '', '#finalStage');
    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "gamepage-container";
    div.innerHTML = `
        <h2>Final</h2>
        <div class="match-list">
            <div class="match-item">
                <p>${players[0].name} vs ${players[1].name}</p>
                <button onclick="startTournamentGame(${JSON.stringify(players[0])}, ${JSON.stringify(players[1])})">Play</button>
            </div>
        </div>
        <div class="score-table-container">
            <h3>Score Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>Player</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody id="score-table-body">
                    <!-- Score rows will be dynamically generated here -->
                </tbody>
            </table>
        </div>
        <div class="quit-game" onclick="tournamentPage()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);

    // Update the score table with current scores
    updateScoreTable();
}

function declareWinner() {
    const finalMatch = matchResults.find(match => 
        (match.player1 === semiFinalPlayers[0] && match.player2 === semiFinalPlayers[1]) ||
        (match.player1 === semiFinalPlayers[1] && match.player2 === semiFinalPlayers[0])
    );

    if (!finalMatch) {
        error('Please complete the final match.');
        return;
    }

    const winner = finalMatch.result === 'win' ? finalMatch.player1 : finalMatch.player2;
    error(`The tournament winner is ${winner}!`);
    console.log(`The tournament winner is ${winner}!`);
}

// Copy of main game functions from pong.js, adjusted for tournament

let tournamentPlayer1Name = "Player 1";
let tournamentPlayer2Name = "Player 2";
let tournamentPlayer1Avatar = "../static/avatars/avatar4.png";
let tournamentPlayer2Avatar = "../static/avatars/avatar5.png";
let tournamentGameInterval;

function tournamentGamePage() {
    saveCurrentPage('tournamentGamePage');
    history.pushState({ page: 'tournamentGamePage' }, '', '#tournamentGamePage');
    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "gamepage-container";
    div.innerHTML = `
        <div class="choose-avatar">
            <h2>Choose Your Avatar</h2>
            <div class="avatar-options">
                <img src="../static/avatars/avatar1.png" alt="Avatar 1" onclick="selectTournamentAvatar(1, this)">
                <img src="../static/avatars/avatar2.png" alt="Avatar 2" onclick="selectTournamentAvatar(2, this)">
                <img src="../static/avatars/avatar3.png" alt="Avatar 3" onclick="selectTournamentAvatar(3, this)">
                <img src="../static/avatars/avatar4.png" alt="Avatar 4" onclick="selectTournamentAvatar(4, this)">
                <img src="../static/avatars/avatar5.png" alt="Avatar 5" onclick="selectTournamentAvatar(5, this)">
                <img src="../static/avatars/avatar6.png" alt="Avatar 6" onclick="selectTournamentAvatar(6, this)">
            </div>
        </div>
        <div class="ready">
            <button class="gamepage-button" onclick="startTournamentGame()">Ready</button>
        </div>
        <div class="quit-game" onclick="tournamentPage()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (tournamentGameInterval) {
                clearInterval(tournamentGameInterval);
            }
            startTournamentGame();
        }
    });
}

function selectTournamentAvatar(avatarNumber, element) {
    tournamentPlayer1Avatar = `../static/avatars/avatar${avatarNumber}.png`;
    const avatars = document.querySelectorAll('.avatar-options img');
    avatars.forEach(avatar => avatar.classList.remove('selected-avatar'));
    element.classList.add('selected-avatar');
}

function startTournamentGame(player1, player2) {
    if (!player1 || !player2) {
        console.error('Player objects are undefined');
        return;
    }

    tournamentPlayer1Name = player1.name || "Player 1";
    tournamentPlayer2Name = player2.name || "Player 2";
    tournamentPlayer1Avatar = player1.avatar || "../static/avatars/avatar1.png";
    tournamentPlayer2Avatar = player2.avatar || "../static/avatars/avatar2.png";

    if (tournamentPlayer1Name.length > 8) {
        tournamentPlayer1Name = tournamentPlayer1Name.substring(0, 8) + '.';
    }
    if (tournamentPlayer2Name.length > 8) {
        tournamentPlayer2Name = tournamentPlayer2Name.substring(0, 8) + '.';
    }

    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "maingame-container";
    div.innerHTML = `
        <div class="middle-line"></div>
        <div class="score-board">
            <div class="left-player">
                <img id="left-player" src="${tournamentPlayer1Avatar}" alt="player1">
                <h3>${tournamentPlayer1Name}</h3>
                <h1 id="left-score">0</h1>
            </div>
            <div class="right-player">
                <img id="right-player" src="${tournamentPlayer2Avatar}" alt="player2">
                <h3>${tournamentPlayer2Name}</h3>
                <h1 id="right-score">0</h1>
            </div>
            <div class="score-line"></div>
            <div class="quit-game" onclick="showTournamentQuitConfirmation()">
                <h1>QUIT</h1>
            </div>
        </div>
        <canvas id="tournamentPongCanvas" width="700" height="400"></canvas>
        <div id="tournamentCountdown" class="countdown"></div>
        <div id="tournamentQuitConfirmation" class="confirmation-to-quit hidden">
            <p>Are you sure you want to quit?</p>
            <button onclick="confirmTournamentQuit()">Yes</button>
            <button onclick="cancelTournamentQuit()">No</button>
        </div>
    `;
    body.appendChild(div);

    // Reset scores
    leftScore = 0;
    rightScore = 0;
    document.getElementById("left-score").innerText = leftScore;
    document.getElementById("right-score").innerText = rightScore;

    // Show count down before starting game.
    showTournamentCountdown();
}

function showTournamentCountdown() {
    const countdownElement = document.getElementById("tournamentCountdown");
    const middleLineElement = document.querySelector(".middle-line");
    middleLineElement.classList.add("hidden");

    let countdown = 3;

    const countdownInterval = setInterval(() => {
        if (countdown > 0) {
            countdownElement.innerHTML = countdown;
            countdown--;
        } else {
            countdownElement.innerHTML = "GO!";
            clearInterval(countdownInterval);
            setTimeout(() => {
                countdownElement.style.display = "none";
                middleLineElement.classList.remove("hidden");
                initializeTournamentGame();
            }, 1000);
        }
    }, 1000);
}

function initializeTournamentGame() {
    const canvas = document.getElementById("tournamentPongCanvas");
    const ctx = canvas.getContext("2d");

    const paddleWidth = 8;
    const paddleHeight = 80;
    const ballRadius = 8;

    let leftScore = 0;
    let rightScore = 0;

    // Position of paddles and balls
    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 3;
    let ballSpeedY = 3;

    const paddleSpeed = 20;

    function drawPaddle(x, y) {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(x, y, paddleWidth, paddleHeight);
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPaddle(0, paddle1Y);
        drawPaddle(canvas.width - paddleWidth, paddle2Y);
        drawBall();

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY + ballSpeedY > canvas.height - ballRadius || ballY + ballSpeedY < ballRadius) {
            ballSpeedY = -ballSpeedY;
        }

        if (ballX + ballSpeedX > canvas.width - ballRadius) {
            if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            } else {
                leftScore++;
                document.getElementById("left-score").innerText = leftScore;
                resetBall();
            }
        } else if (ballX + ballSpeedX < ballRadius) {
            if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
                ballSpeedX = -ballSpeedX;
            } else {
                rightScore++;
                document.getElementById("right-score").innerText = rightScore;
                resetBall();
            }
        }

        // Check if the game has ended
        if (leftScore === 3 || rightScore === 3) {
            clearInterval(tournamentGameInterval); // Stop the game loop
            const winner = leftScore === 3 ? tournamentPlayer1Name : tournamentPlayer2Name;
            const confirmationElement = document.querySelector('.confirmation-to-quit');
            if (confirmationElement) {
                confirmationElement.classList.remove('hidden');
                let countdown = 3;
                const countdownInterval = setInterval(() => {
                    countdown -= 1;
                    confirmationElement.innerHTML = `<span>Game Over</span><br><span style="font-size: 2em; color: #007bff">${winner} Wins!</span><br>Returning to game page in ${countdown}s...`;

                    if (countdown === 0) {
                        clearInterval(countdownInterval);
                        recordMatchResult(tournamentPlayer1Name, tournamentPlayer2Name, leftScore === 3 ? 'win' : 'lose');
                    }
                }, 1000);
            }
        }
    }

    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }

    function keyDownHandler(e) {
        if (e.key == "w" || e.key == "W") {
            paddle1Y = Math.max(paddle1Y - paddleSpeed, 0);
        } else if (e.key == "s" || e.key == "S") {
            paddle1Y = Math.min(paddle1Y + paddleSpeed, canvas.height - paddleHeight);
        } else if (e.key == "ArrowUp") {
            paddle2Y = Math.max(paddle2Y - paddleSpeed, 0);
        } else if (e.key == "ArrowDown") {
            paddle2Y = Math.min(paddle2Y + paddleSpeed, canvas.height - paddleHeight);
        }
    }

    document.addEventListener("keydown", keyDownHandler);

    tournamentGameInterval = setInterval(draw, 20);
}

function showTournamentQuitConfirmation() {
    const confirmationDialog = document.getElementById("tournamentQuitConfirmation");
    confirmationDialog.classList.remove("hidden");
}

function confirmTournamentQuit() {
    clearInterval(tournamentGameInterval);
    tournamentPage();
}

function cancelTournamentQuit() {
    const confirmationDialog = document.getElementById("tournamentQuitConfirmation");
    confirmationDialog.classList.add("hidden");
}
