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
            <!-- from 6 to 3 players -->
            <div class="form-check1" id="number_of_plyers">
                <p>Choose Players</p>
                <input type="number" id="players" min="3" max="6" value="3">
            </div>
            <div class="form-check3" onclick="createTournamentPage()">
                <p>Create Tournament</p>
            </div>
        </div>
        <div class="quit-game" onclick="gameOptions()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);
}

function createTournamentPage() {
    saveCurrentPage('createTournamentPage');
    history.pushState({ page: 'createTournamentPage' }, '', '#createTournamentPage');
    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "settings-container";
    div.innerHTML = `
        <h2>New Tournament</h2>
        <div class="form-group">
            <input type="text" id="tournamentName" placeholder="Enter tournament name" class="gamepage-input">
        </div>
        <div class="ready">
            <button class="gamepage-button" onclick="createTournament()">Create</button>
        </div>
        <div class="quit-game" onclick="tournamentPage()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);
}

function joinTournamentPage() {
    saveCurrentPage('joinTournamentPage');
    history.pushState({ page: 'joinTournamentPage' }, '', '#joinTournamentPage');
    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "settings-container";
    div.innerHTML = `
        <h2>Join Tournament</h2>
        <div class="form-group">
            <input type="text" id="tournamentId" placeholder="Enter tournament ID" class="gamepage-input">
        </div>
        <div class="ready">
            <button class="gamepage-button" onclick="joinTournament()">Join</button>
        </div>
        <div class="quit-game" onclick="tournamentPage()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);
}

function createTournament() {
    const tournamentName = document.getElementById("tournamentName").value;
    // choose players for tournment
    // from 6 to 3 players
    gamePage();
}

