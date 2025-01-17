
let tournamentMode = false;

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
    if (numberOfPlayers < 3 || numberOfPlayers > 6) {
        error('Please choose between 3 and 6 players.');
        return;
    }
    const players = generateRandomPlayers(numberOfPlayers);

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
    // saveCurrentPage('roundRobinStage');
    // history.pushState({ page: 'roundRobinStage' }, '', '#roundRobinStage');
    // const body = document.body;

    // while (body.firstChild) {
    //     body.removeChild(body.firstChild);
    // }

    // const div = document.createElement("div");
    // div.className = "gamepage-container";
    // div.innerHTML = `
    //     <h2>Round Robin Stage</h2>
    //     <div class="match-list-container">
    //         <div class="match-list">
    //             ${generateRoundRobinMatches(players).map(match => `
    //                 <div class="match-item">
    //                     <p>${match[0].name} vs ${match[1].name}</p>
    //                     <button onclick="recordMatchResult('${match[0].name}', '${match[1].name}', 'win')">Win</button>
    //                     <button onclick="recordMatchResult('${match[0].name}', '${match[1].name}', 'lose')">Lose</button>
    //                 </div>
    //             `).join('')}
    //         </div>
    //     </div>
    //     <div class="ready">
    //         <button class="gamepage-button" onclick="proceedToSemiFinals()">Pre-Finals</button>
    //     </div>
    //     <div class="quit-game" onclick="tournamentPage()">
    //         <h1>BACK</h1>
    //     </div>
    // `;
    // body.appendChild(div);

    let matchList = generateRoundRobinMatches(players);

    // For each pair call start game and before setName to player name
    matchList.forEach(match => {
        let player1 = match[0];
        let player2 = match[1];

        setPlayerNames(player1.name, player2.name);

        tournamentMode = true;
        if (gameInterval) {
            clearInterval(gameInterval);
        }
        startGame(player1, player2);
    });
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

    const sortedPlayers = Object.keys(playerPoints).sort((a, b) => playerPoints[b] - playerPoints[a]);
    semiFinalPlayers = sortedPlayers.slice(0, 4);

    console.log('Proceeding to semi-finals with players:', semiFinalPlayers);
    semiFinalStage(semiFinalPlayers);
}

function semiFinalStage(players) {
    saveCurrentPage('semiFinalStage');
    history.pushState({ page: 'semiFinalStage' }, '', '#semiFinalStage');
    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "gamepage-container";
    div.innerHTML = `
        <h2>Semi-Finals</h2>
        <div class="match-list">
            <div class="match-item">
                <p>${players[0]} vs ${players[3]}</p>
                <button onclick="recordMatchResult('${players[0]}', '${players[3]}', 'win')">Win</button>
                <button onclick="recordMatchResult('${players[0]}', '${players[3]}', 'lose')">Lose</button>
            </div>
            <div class="match-item">
                <p>${players[1]} vs ${players[2]}</p>
                <button onclick="recordMatchResult('${players[1]}', '${players[2]}', 'win')">Win</button>
                <button onclick="recordMatchResult('${players[1]}', '${players[2]}', 'lose')">Lose</button>
            </div>
        </div>
        <div class="ready">
            <button class="gamepage-button" onclick="proceedToFinal()">Final</button>
        </div>
        <div class="quit-game" onclick="tournamentPage()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);
}

function proceedToFinal() {
    const semiFinalMatches = matchResults.filter(match => 
        (match.player1 === semiFinalPlayers[0] && match.player2 === semiFinalPlayers[3]) ||
        (match.player1 === semiFinalPlayers[3] && match.player2 === semiFinalPlayers[0]) ||
        (match.player1 === semiFinalPlayers[1] && match.player2 === semiFinalPlayers[2]) ||
        (match.player1 === semiFinalPlayers[2] && match.player2 === semiFinalPlayers[1])
    );

    const semiFinalWinners = semiFinalMatches.filter(match => match.result === 'win').map(match => match.player1);
    if (semiFinalWinners.length !== 2) {
        error('Please complete all semi-final matches.');
        return;
    }

    console.log('Proceeding to final with players:', semiFinalWinners);
    finalStage(semiFinalWinners);
}

function finalStage(players) {
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
                <p>${players[0]} vs ${players[1]}</p>
                <button onclick="recordMatchResult('${players[0]}', '${players[1]}', 'win')">Win</button>
                <button onclick="recordMatchResult('${players[0]}', '${players[1]}', 'lose')">Lose</button>
            </div>
        </div>
        <div class="ready">
            <button class="gamepage-button" onclick="declareWinner()">Winner</button>
        </div>
        <div class="quit-game" onclick="tournamentPage()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);
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
