let playerOneName = "Player 1";
let playerTwoName = "Player 2";
let player3Name = "Player 3";
let player4Name = "Player 4";
let playerOneAvatar = "./avatars/avatar4.png";
let playerTwoAvatar = "./avatars/avatar5.png";
let player3Avatar = "./avatars/avatar6.png";
let player4Avatar = "./avatars/avatar1.png";
let multiGameInterval;
let lastPaddleHit = null;

function multiGamePage() {
    saveCurrentPage('multiGamePage');
    history.pushState({ page: 'multiGamePage' }, '', '#multiGamePage');
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
                <img src="../static/avatars/avatar1.png" alt="Avatar 1" onclick="handleAvatarSelection(1, this)">
                <img src="../static/avatars/avatar2.png" alt="Avatar 2" onclick="handleAvatarSelection(2, this)">
                <img src="../static/avatars/avatar3.png" alt="Avatar 3" onclick="handleAvatarSelection(3, this)">
                <img src="../static/avatars/avatar4.png" alt="Avatar 4" onclick="handleAvatarSelection(4, this)">
                <img src="../static/avatars/avatar5.png" alt="Avatar 5" onclick="handleAvatarSelection(5, this)">
                <img src="../static/avatars/avatar6.png" alt="Avatar 6" onclick="handleAvatarSelection(6, this)">
            </div>
        </div>
        <div class="choose-nickname">
            <h2>Nickname</h2>
            <input class="gamepage-input" type="text" id="nickname" placeholder="Enter your nickname">
        </div>
        <div class="ready">
            <button class="gamepage-button" onclick="initializeGameScreen()">Ready</button>
        </div>
        <div class="quit-game" onclick="gameOptions()">
            <h1>BACK</h1>
        </div>
    `;
    body.appendChild(div);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if (multiGameInterval) {
                clearInterval(multiGameInterval);
            }
            initializeGameScreen();
        }
    });
}

function handleAvatarSelection(avatarNumber, element) {
    playerOneAvatar = `./avatars/avatar${avatarNumber}.png`;
    const avatars = document.querySelectorAll('.avatar-options img');
    avatars.forEach(avatar => avatar.classList.remove('selected-avatar'));
    element.classList.add('selected-avatar');
}

function initializeGameScreen() {
    const nicknameInput = document.getElementById("nickname");
    playerOneName = nicknameInput.value || "Player 1";

    if (playerOneName.length > 8) {
        playerOneName = playerOneName.substring(0, 8) + '.';
    }

    const body = document.body;

    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    const div = document.createElement("div");
    div.className = "multi-maingame-container";
    div.innerHTML = `
        <div class="multi-middle-line"></div>
        <div class="multi-score-board">
            <div class="top-left-player">
                <img id="top-left-player" src="../static/${playerOneAvatar}" alt="player1">
                <h3>${playerOneName}</h3>
                <h1 id="top-left-score">0</h1>
            </div>
            <div class="top-right-player">
                <img id="top-right-player" src="../static/${playerTwoAvatar}" alt="player2">
                <h3>${playerTwoName}</h3>
                <h1 id="top-right-score">0</h1>
            </div>
            <div class="bottom-left-player">
                <img id="bottom-left-player" src="../static/${player3Avatar}" alt="player3">
                <h3>${player3Name}</h3>
                <h1 id="bottom-left-score">0</h1>
            </div>
            <div class="bottom-right-player">
                <img id="bottom-right-player" src="../static/${player4Avatar}" alt="player4">
                <h3>${player4Name}</h3>
                <h1 id="bottom-right-score">0</h1>
            </div>
            <div class="multi-score-line"></div>
            <div class="quit-game" onclick="displayQuitPrompt()">
                <h1>QUIT</h1>
            </div>
        </div>
        <canvas id="pongCanvas" width="400" height="400"></canvas>
        <div id="countdown" class="countdown"></div>
        <div id="multi-quit-confirmation" class="multi-confirmation-to-quit hidden">
            <p>Are you sure you want to quit?</p>
            <button onclick="handleQuitConfirmation()">Yes</button>
            <button onclick="cancelQuitPrompt()">No</button>
        </div>
    `;
    body.appendChild(div);
    
    //-- Reset scores to 0 before starting the game
    document.getElementById("top-left-score").innerText = 0;
    document.getElementById("top-right-score").innerText = 0;
    document.getElementById("bottom-left-score").innerText = 0;
    document.getElementById("bottom-right-score").innerText = 0;

    displayGameCountdown();
}

function displayGameCountdown() {
    const countdownElement = document.getElementById("countdown");
    const middleLineElement = document.querySelector(".multi-middle-line");
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
                startGameLogic();
            }, 1000);
        }
    }, 1000);
}

function startGameLogic() {
    const canvas = document.getElementById("pongCanvas");
    const ctx = canvas.getContext("2d");

    const paddleWidth = 80;
    const paddleHeight = 8;
    const ballRadius = 8;

    let topLeftScore = 0;
    let topRightScore = 0;
    let bottomLeftScore = 0;
    let bottomRightScore = 0;

    //- Position of paddles and ball
    let topPaddleX = (canvas.width - paddleWidth) / 2;
    let bottomPaddleX = (canvas.width - paddleWidth) / 2;
    let leftPaddleY = (canvas.height - paddleHeight) / 2;
    let rightPaddleY = (canvas.height - paddleHeight) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 1.5;
    let ballSpeedY = 1.5;

    const paddleSpeed = 20;

    function renderPaddle(x, y, isVertical = false) {
        ctx.fillStyle = "#FFFFFF";
        if (isVertical) {
            ctx.fillRect(x, y, paddleHeight, paddleWidth);
        } else {
            ctx.fillRect(x, y, paddleWidth, paddleHeight);
        }
    }

    function renderBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();
        ctx.closePath();
    }

    function updateGameFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        renderPaddle(topPaddleX, 0); //-- Top paddle
        renderPaddle(bottomPaddleX, canvas.height - paddleHeight); //-- Bottom paddle
        renderPaddle(0, leftPaddleY, true); //-- Left paddle
        renderPaddle(canvas.width - paddleHeight, rightPaddleY, true); //-- Right paddle
        
        renderBall();

        ballX += ballSpeedX;
        ballY += ballSpeedY;

        //-- Ball collision with left and right walls
        //-- If ball hits left or right wall, reverse the x direction
        //-- Score points for the opposite side
        // if (ballX + ballSpeedX > canvas.width - ballRadius || ballX + ballSpeedX < ballRadius) {
        //     ballSpeedX = -ballSpeedX;
        // }

        // Ball collision with paddles
        // Top paddle
        if (ballY - ballRadius < paddleHeight && ballX > topPaddleX && ballX < topPaddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
            ballY = paddleHeight + ballRadius; // Prevent ball from getting stuck
            lastPaddleHit = 'top';
        }
        // Bottom paddle
        if (ballY + ballRadius > canvas.height - paddleHeight && 
            ballX > bottomPaddleX && ballX < bottomPaddleX + paddleWidth) {
            ballSpeedY = -ballSpeedY;
            ballY = canvas.height - paddleHeight - ballRadius;
            lastPaddleHit = 'bottom';
        }
        // Left paddle
        if (ballX - ballRadius < paddleHeight && ballY > leftPaddleY && ballY < leftPaddleY + paddleWidth) {
            ballSpeedX = -ballSpeedX;
            ballX = paddleHeight + ballRadius;
            lastPaddleHit = 'left';
        }
        // Right paddle
        if (ballX + ballRadius > canvas.width - paddleHeight && 
            ballY > rightPaddleY && ballY < rightPaddleY + paddleWidth) {
            ballSpeedX = -ballSpeedX;
            ballX = canvas.width - paddleHeight - ballRadius;
            lastPaddleHit = 'right';
        }

        //-- Scoring
        //-- If ball hits top, bottom, left, or right wall, score points for the opposite side
        //-- Reset ball position
        //-- Example: If ball hits top wall, bottom player scores a point
        //-- He has to hit the ball at least once to score a point
        if (ballY < 0 || ballY > canvas.height || ballX < 0 || ballX > canvas.width) {
            if (lastPaddleHit === 'top') {
                topLeftScore++;
                document.getElementById("top-left-score").innerText = topLeftScore;
            } else if (lastPaddleHit === 'bottom') {
                bottomLeftScore++;
                document.getElementById("bottom-left-score").innerText = bottomLeftScore;
            } else if (lastPaddleHit === 'left') {
                topRightScore++;
                document.getElementById("top-right-score").innerText = topRightScore;
            } else if (lastPaddleHit === 'right') {
                bottomRightScore++;
                document.getElementById("bottom-right-score").innerText = bottomRightScore;
            }
            resetBallPosition();
        }

        //-- Check for winner
        const scores = [topLeftScore, topRightScore, bottomLeftScore, bottomRightScore];
        if (scores.some(score => score === 3)) {
            showGameOverScreen();
        }
    }

    function resetBallPosition() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 1.5;
        ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 1.5;
        lastPaddleHit = null;
    }

    function handlePlayerInput(e) {
        //- Player 1 (Top paddle) - A/D
        if (e.key == "a" || e.key == "A") {
            topPaddleX = Math.max(topPaddleX - paddleSpeed, 0);
        } else if (e.key == "d" || e.key == "D") {
            topPaddleX = Math.min(topPaddleX + paddleSpeed, canvas.width - paddleWidth);
        }
        //- Player 2 (Bottom paddle) - Left/Right arrows
        else if (e.key == "ArrowLeft") {
            bottomPaddleX = Math.max(bottomPaddleX - paddleSpeed, 0);
        } else if (e.key == "ArrowRight") {
            bottomPaddleX = Math.min(bottomPaddleX + paddleSpeed, canvas.width - paddleWidth);
        }
        //- Player 3 (Left paddle) - W/S
        else if (e.key == "w" || e.key == "W") {
            leftPaddleY = Math.max(leftPaddleY - paddleSpeed, 0);
        } else if (e.key == "s" || e.key == "S") {
            leftPaddleY = Math.min(leftPaddleY + paddleSpeed, canvas.height - paddleWidth);
        }
        //- Player 4 (Right paddle) - Up/Down arrows
        else if (e.key == "ArrowUp") {
            rightPaddleY = Math.max(rightPaddleY - paddleSpeed, 0);
        } else if (e.key == "ArrowDown") {
            rightPaddleY = Math.min(rightPaddleY + paddleSpeed, canvas.height - paddleWidth);
        }
    }

    document.addEventListener("keydown", handlePlayerInput);

    multiGameInterval = setInterval(updateGameFrame, 20);
}

function showGameOverScreen() {
    clearInterval(multiGameInterval);
    const scores = {
        topLeft: parseInt(document.getElementById("top-left-score").innerText),
        topRight: parseInt(document.getElementById("top-right-score").innerText),
        bottomLeft: parseInt(document.getElementById("bottom-left-score").innerText),
        bottomRight: parseInt(document.getElementById("bottom-right-score").innerText)
    };

    let winnerName = playerOneName;
    if (scores.topRight === 3) {
        winnerName = "Player 2";
    } else if (scores.bottomLeft === 3) {
        winnerName = "Player 3";
    } else if (scores.bottomRight === 3) {
        winnerName = "Player 4";
    } else {
        winnerName = playerOneName;
    }


    const confirmationElement = document.querySelector('.multi-confirmation-to-quit');
    if (confirmationElement) {
        confirmationElement.classList.remove('hidden');
        let countdown = 3;
        confirmationElement.innerHTML = `
            <span>Game Over</span><br>
            <span style="font-size: 2em; color: #007bff">${winnerName} Wins!</span><br>
            Returning to game page in ${countdown}s...
        `;
        
        const countdownInterval = setInterval(() => {
            countdown -= 1;
            confirmationElement.innerHTML = `
                <span>Game Over</span><br>
                <span style="font-size: 2em; color: #007bff">${winnerName} Wins!</span><br>
                Returning to game page in ${countdown}s...
            `;

            if (countdown === 0) {
                clearInterval(countdownInterval);
                multiGamePage();
            }
        }, 1000);
    }
}

function displayQuitPrompt() {
    const confirmationDialog = document.getElementById("multi-quit-confirmation");
    confirmationDialog.classList.remove("hidden");
}

function handleQuitConfirmation() {
    clearInterval(multiGameInterval);
    multiGamePage();
}

function cancelQuitPrompt() {
    const confirmationDialog = document.getElementById("multi-quit-confirmation");
    confirmationDialog.classList.add("hidden");
}