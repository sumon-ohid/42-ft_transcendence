function gameOptions() {
    saveCurrentPage('gameOptions');
    history.pushState({ page: 'gameOptions' }, '', '#gameOptions');
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
        <div class="quit-game" onclick="homePage()">
            <h1>BACK</h1>
        </div>
        <div class="game-options">
            <div class="form-check1" onclick="gamePage()">
                <p>2 Players Game</p>
            </div>
            <div class="form-check2">
                <p>4 Players Game</p>
            </div>
            <div class="form-check3">
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