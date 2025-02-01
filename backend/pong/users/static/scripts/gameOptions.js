function gameOptions() {
    saveCurrentPage('gameOptions');

    if (!userIsLoggedIn()) {
        navigateTo('#login');
        return;
    }

    if (gameInterval !== null) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    if (multiGameInterval !== null) {
        clearInterval(multiGameInterval);
        multiGameInterval = null;
    }

    const body = document.body;

    // Remove all child elements of the body
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "settings-container";
    div.innerHTML = `
        <div class="pong-container-options"></div>
        <div class="pong-options"></div>
        <h2>Choose Option</h2>
        <div class="quit-game" onclick="navigateTo('#homePage')">
            <h1>BACK</h1>
        </div>
        <div class="game-options">
            <div class="form-check1" onclick="navigateTo('#gamePage')">
                <p>2 Players Game</p>
            </div>
            <div class="form-check2" onclick="navigateTo('#multiGamePage')">
                <p>4 Players Game</p>
            </div>
            <div class="form-check3" onclick="navigateTo('#tournamentPage')">
                <p>Tournament</p>
            </div>
        </div>
    `;
    body.appendChild(div);
}


// Game Customization Page
// Change ball speed, paddle speed, and paddle size
// Choose different ball and paddle colors

// function gameCustomization() {
//     saveCurrentPage('gameCustomization');
//     history.pushState({ page: 'gameCustomization' }, '', '#gameCustomization');
//     const body = document.body;

//     // Remove all child elements of the body
//     while (body.firstChild) {
//         body.removeChild(body.firstChild);
//     }

//     const div = document.createElement("div");
//     div.className = "settings-container";
//     div.innerHTML = `
//         <div class="pong-container-options"></div>
//         <h2>Customization</h2>
//         <div class="quit-game" onclick="gameOptions()">
//             <h1>BACK</h1>
//         </div>
//         <div class="game-options">
//             <div class="form-check1" onclick="gamePage()">
//                 <p>Easy</p>
//             </div>
//             <div class="form-check2">
//                 <p>Medium</p>
//             </div>
//             <div class="form-check3">
//                 <p>Difficult</p>
//             </div>
//         </div>
//     `;
    
//     body.appendChild(div);
// }


// Check if the user is logged in
function userIsLoggedIn() {
    if (localStorage.getItem('loggedInUser') === null || localStorage.getItem('jwtToken') === null || localStorage.getItem('loggedInUser') === 'Guest') {
        return false;
    } else {
        return true;
    }
}
