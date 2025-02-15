let player1Name = "Player 1";
let player2Name = "Player 2";
let player1Avatar = "./avatars/avatar4.png";
let player2Avatar = "./avatars/avatar5.png";
let gameInterval;

let aiPauseDuration = 60; // Difficulty (0 - hard, 20 - medium, 60 - easy)

function setDifficultyLevel() {
    const difficultySelect = document.getElementById('difficulty-level');
    aiPauseDuration = parseInt(difficultySelect.value);
    // console.log('Difficulty level set to:', aiPauseDuration);
}

function gamePage() {
    saveCurrentPage('gamePage');

    if (!userIsLoggedIn()) {
        navigateTo('#login');
        return;
    }

    if (gameInterval !== null) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    // Load player data from localStorage
    player1Name = localStorage.getItem('player1Name') || "Player 1";
    player1Avatar = localStorage.getItem('player1Avatar') || "./avatars/avatar4.png";
    player2Name = localStorage.getItem('player2Name') || "Player 2";
    player2Avatar = localStorage.getItem('player2Avatar') || "./avatars/avatar5.png";

    const div = document.createElement("div");
    div.className = "gamepage-container";
    div.innerHTML = /*html*/`
        <div class="choose-avatar">
            <h2>Choose Your Avatar</h2>
            <div class="avatar-options">
                <img src="../static/avatars/avatar1.png" alt="Avatar 1" onclick="selectAvatar(1, this)">
                <img src="../static/avatars/avatar2.png" alt="Avatar 2" onclick="selectAvatar(2, this)">
                <img src="../static/avatars/avatar3.png" alt="Avatar 3" onclick="selectAvatar(3, this)">
                <img src="../static/avatars/avatar4.png" alt="Avatar 4" onclick="selectAvatar(4, this)">
                <img src="../static/avatars/avatar5.png" alt="Avatar 5" onclick="selectAvatar(5, this)">
                <img src="../static/avatars/avatar6.png" alt="Avatar 6" onclick="selectAvatar(6, this)">
            </div>
        </div>
        <div class="choose-nickname">
            <h2 class="nickname-title">Nicknames</h2>
            <div class="gamepage-nickname-inputs">
                <input type="text" id="nickname1" placeholder="Enter Player 1 nickname">
                <input type="text" id="nickname2" placeholder="Enter Player 2 nickname">
            </div>
        </div>
        <div class="ready">
            <button id="game-play-button" class="gamepage-button" onclick="startGamePlay()">Ready</button>
        </div>
        <div class="quit-game" onclick="navigateTo('#homePage')">
            <h1>BACK</h1>
        </div>
        <div class="ai-opponent">
        <label for="ai-checkbox">Enable AI Opponent</label>
        <input type="checkbox" id="ai-checkbox" onclick="toggleAI()">
        <select id="difficulty-level" style="display:none" onchange="setDifficultyLevel()">
            <option value="60">Easy</option>
            <option value="20">Medium</option>
            <option value="0">Hard</option>
        </select>
    </div>
    `;
    body.appendChild(div);

    document.getElementById('ai-checkbox').checked = false;
    isAIEnabled = false;
}

let isAIEnabled = false;

function toggleAI() {
    isAIEnabled = document.getElementById('ai-checkbox').checked;
    const difficultySelect = document.getElementById('difficulty-level');
    if (isAIEnabled) {
        player2Name = "AI Gamer";
        document.getElementById('nickname2').value = player2Name;
        document.getElementById('nickname2').disabled = true;
        difficultySelect.disabled = false;
        difficultySelect.style.display = 'inline-block';
    } else {
        player2Name = "Player 2";
        document.getElementById('nickname2').value = player2Name;
        document.getElementById('nickname2').disabled = false;
        difficultySelect.disabled = true;
        difficultySelect.style.display = 'none';
    }
}

function startGamePlay() {
    if (gameInterval !== null) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    startGame();
}

let avatarSelectionCount = 0;

function selectAvatar(avatarNumber, element) {
    avatarSelectionCount++;
    if (avatarSelectionCount === 1) {
        player1Avatar = `./avatars/avatar${avatarNumber}.png`;
        const avatars = document.querySelectorAll('.avatar-options img');
        avatars.forEach(avatar => avatar.classList.remove('selected-avatar-player1'));
        element.classList.add('selected-avatar-player1');
    } else if (avatarSelectionCount === 2) {
        player2Avatar = `./avatars/avatar${avatarNumber}.png`;
        const avatars = document.querySelectorAll('.avatar-options img');
        avatars.forEach(avatar => avatar.classList.remove('selected-avatar-player2'));
        element.classList.add('selected-avatar-player2');
        avatarSelectionCount = 0;
    }
}

function startGame() {    
    const nicknameInput1 = document.getElementById("nickname1");
    const nicknameInput2 = document.getElementById("nickname2");
    player1Name = nicknameInput1.value || "Player 1";
    player2Name = nicknameInput2.value || "Player 2";

    if (player1Name.length > 8) {
        player1Name = player1Name.substring(0, 8) + '.';
    }
    if (player2Name.length > 8) {
        player2Name = player2Name.substring(0, 8) + '.';
    }

    // player name should be at least 1 alphabet
    if (!player1Name.match(/[a-zA-Z]/)) {
        error("Player 1 nickname should contain at least 1 alphabet", "error");
        return;
    }
    if (!player2Name.match(/[a-zA-Z]/)) {
        error("Player 2 nickname should contain at least 1 alphabet", "error");
        return;
    }

    // Save player data to localStorage
    localStorage.setItem('player1Name', player1Name);
    localStorage.setItem('player1Avatar', player1Avatar);
    localStorage.setItem('player2Name', player2Name);
    localStorage.setItem('player2Avatar', player2Avatar);

    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "maingame-container";
    div.innerHTML = /*html*/ `
        <div class="middle-line"></div>
        <div class="info-player" hidden>
            <span class="badge rounded-pill bg-warning text-dark">
            <i class="fa-solid fa-circle-info"></i>
            info: on reload or quit game you may lose the current game!
            </span>
        </div>
        <div class="score-board">
            <div class="left-player">
                <img id="left-player" src="../static/${player1Avatar}" alt="player1">
                <h3>${player1Name}</h3>
                <p>Control: W, S</p>
                <h1 id="left-score">0</h1>
            </div>
            <div class="right-player">
                <img id="right-player" src="../static/${player2Avatar}" alt="player2">
                <h3>${player2Name}</h3>
                <p>Control: Up, Down arrows</p>
                <h1 id="right-score">0</h1>
            </div>
            <div class="quit-game" onclick="showQuitConfirmation()">
                <h1>QUIT</h1>
            </div>
        </div>
        <canvas id="pongCanvas" width="700" height="400"></canvas>
        <div id="countdown" class="countdown"></div>
        <div id="quit-confirmation" class="confirmation-to-quit hidden">
            <p>Are you sure you want to quit?</p>
            <button onclick="confirmQuit()">Yes</button>
            <button onclick="cancelQuit()">No</button>
        </div>
        <div class="pause-game" onclick="pauseGame()">
            <i class="fa-solid fa-pause"></i>
            PAUSE
        </div> 
    `;
    body.appendChild(div);
    // Reset scores
    leftScore = 0;
    rightScore = 0;
    document.getElementById("left-score").innerText = leftScore;
    document.getElementById("right-score").innerText = rightScore;

    // Show info player for 10 seconds
    const infoPlayer = document.querySelector('.info-player');
    infoPlayer.hidden = false;
    setTimeout(() => {
        infoPlayer.hidden = true;
    }, 10000);

    // Show count down before starting game.
    showCountdown();
}

function pauseGame() {
    alert("Game Paused");
}

function showCountdown() {
    if (gameInterval !== null) {
        clearInterval(gameInterval);
        gameInterval = null;
    }
    const countdownElement = document.getElementById("countdown");
    const middleLineElement = document.querySelector(".middle-line");
    middleLineElement.classList.add("hidden");

    let countdown = 3;

    const countdownInterval = setInterval(() => {
        if (gameInterval !== null) {
            clearInterval(gameInterval);
            gameInterval = null;
        }
        if (countdown > 0) {
            if (gameInterval !== null) {
                clearInterval(gameInterval);
                gameInterval = null;
            }
            countdownElement.innerHTML = countdown;
            countdown--;
        } else {
            countdownElement.innerHTML = "GO!";
            clearInterval(countdownInterval);
            setTimeout(() => {
                countdownElement.style.display = "none";
                middleLineElement.classList.remove("hidden");
                leftScore = 0;
                rightScore = 0;
                initializeGame();
            }, 1000);
        }
    }, 1000);
}

function initializeGame() {

    const canvas = document.getElementById("pongCanvas");
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
    let ballSpeedX = 2;
    let ballSpeedY = 2;

    const paddleSpeed = 10;
    const smoothSpeed = 0.2;
    const aiMoveDelay = 2;
    let aiMoveCounter = 0;

    const keysPressed = {};

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

    function linearsmooth(current, target, alpha) {
        return current + (target - current) * alpha;
    }

    function predictBallPosition() {
        let predictedBallY = ballY + ballSpeedY;

        const timeToPredict = 1; // +1 sec
        predictedBallY += ballSpeedY * timeToPredict;

        if (predictedBallY > canvas.height - ballRadius || predictedBallY < ballRadius) {
            ballSpeedY = -ballSpeedY;
            predictedBallY = Math.max(ballRadius, Math.min(predictedBallY, canvas.height - ballRadius));
        }

        return predictedBallY;
    }

    let aiPauseCounter = 0;
    const aiPauseChance = 0.05; // 5%

    function updateAIPaddle() {
        aiMoveCounter++;

        if (aiMoveCounter >= aiMoveDelay) {
            aiMoveCounter = 0;

            if (aiPauseCounter > 0) {
                aiPauseCounter--;
                return;
            }

            const mistakeChance = 0.2; // 20%
            const makeMistake = Math.random() < mistakeChance;

            let predictedBallY = predictBallPosition();

            if (makeMistake) {
                const errorRange = 10;
                predictedBallY += (Math.random() - 0.5) * errorRange;
            }

            const targetY = predictedBallY - paddleHeight / 2;

            paddle2Y = linearsmooth(paddle2Y, targetY, smoothSpeed);

            paddle2Y = Math.max(0, Math.min(paddle2Y, canvas.height - paddleHeight));

            if (Math.random() < aiPauseChance) {
                aiPauseCounter = aiPauseDuration;
            }
        }
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

        // Update player paddle positions based on keys pressed
        if (keysPressed['w']) {
            paddle1Y = Math.max(paddle1Y - paddleSpeed, 0);
        }
        if (keysPressed['s']) {
            paddle1Y = Math.min(paddle1Y + paddleSpeed, canvas.height - paddleHeight);
        }
        if (!isAIEnabled) {
            if (keysPressed['ArrowUp']) {
                paddle2Y = Math.max(paddle2Y - paddleSpeed, 0);
            }
            if (keysPressed['ArrowDown']) {
                paddle2Y = Math.min(paddle2Y + paddleSpeed, canvas.height - paddleHeight);
            }
        } else {
            updateAIPaddle();
        }

        // Check if the game has ended
        const leftPlayerNickname = player1Name;
        const rightPlayerNickname = player2Name;

        if (leftScore === 5 || rightScore === 5) {
            clearInterval(gameInterval); // Stop the game loop
            const winner = leftScore === 5 ? leftPlayerNickname : rightPlayerNickname;
            const confirmationElement = document.querySelector('.confirmation-to-quit');
            if (confirmationElement) {
                confirmationElement.classList.remove('hidden');
                let countdown = 3;
                confirmationElement.innerHTML = /*html*/ `<span>Game Over</span><br><span style="font-size: 2em; color: #007bff">${winner} Wins!</span><br>Returning to game page in ${countdown}s...`;

                const countdownInterval = setInterval(() => {
                    countdown -= 1;
                    confirmationElement.innerHTML = /*html*/ `<span>Game Over</span><br><span style="font-size: 2em; color: #007bff">${winner} Wins!</span><br>Returning to game page in ${countdown}s...`;

                    if (countdown === 0) {
                        clearInterval(countdownInterval);

                        const csrfToken = getCSRFToken();
                        const result = winner === leftPlayerNickname ? 'win' : 'lose';

                        fetch('/api/save-score/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': csrfToken,
                            },
                            body: JSON.stringify({
                                score: leftScore, // Always send player 1's score
                                result: result
                            })
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                console.log('Score saved successfully');
                                error("Score saved successfully", "success");
                            } else {
                                console.error('Error saving score:', data.message);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });

                        // navigateTo('#gameOptions');
                        navigateTo('#gamePage');
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
        keysPressed[e.key] = true;
    }

    function keyUpHandler(e) {
        keysPressed[e.key] = false;
    }

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    gameInterval = setInterval(draw, 20);
}

function showQuitConfirmation() {
    const confirmationDialog = document.getElementById("quit-confirmation");
    confirmationDialog.classList.remove("hidden");
}

function confirmQuit() {
    clearInterval(gameInterval);
    gamePage();
}

function cancelQuit() {
    const confirmationDialog = document.getElementById("quit-confirmation");
    confirmationDialog.classList.add("hidden");
}
