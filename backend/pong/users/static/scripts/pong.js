let player1Name = "Player 1";
let player2Name = "Player 2";
let player1Avatar = "./avatars/avatar4.png";
let player2Avatar = "./avatars/avatar5.png";
let gameInterval;

// *** NOTE ****
// Change later: Nickname can be max 8 character other wise truncate to 8 chars.
function gamePage() {
    saveCurrentPage('gamePage');
    history.pushState({ page: 'gamePage' }, '', '#gamePage');
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
                <img src="../static/avatars/avatar1.png" alt="Avatar 1" onclick="selectAvatar(1, this)">
                <img src="../static/avatars/avatar2.png" alt="Avatar 2" onclick="selectAvatar(2, this)">
                <img src="../static/avatars/avatar3.png" alt="Avatar 3" onclick="selectAvatar(3, this)">
                <img src="../static/avatars/avatar4.png" alt="Avatar 4" onclick="selectAvatar(4, this)">
                <img src="../static/avatars/avatar5.png" alt="Avatar 5" onclick="selectAvatar(5, this)">
                <img src="../static/avatars/avatar6.png" alt="Avatar 6" onclick="selectAvatar(6, this)">
            </div>
        </div>
        <div class="choose-nickname">
            <h2>Nickname</h2>
            <input class="gamepage-input" type="text" id="nickname" placeholder="Enter your nickname">
        </div>
        <div class="ready">
            <button class="gamepage-button" onclick="startGame()">Ready</button>
        </div>
        <div class="quit-game" onclick="homePage()">
            <h1>BACK</h1>
    `;
    body.appendChild(div);

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // clear previous game interval if exists
            if (gameInterval) {
                clearInterval(gameInterval);
            }
            startGame();
        }
    });
}

function selectAvatar(avatarNumber, element) {
    player1Avatar = `./avatars/avatar${avatarNumber}.png`;
    const avatars = document.querySelectorAll('.avatar-options img');
    avatars.forEach(avatar => avatar.classList.remove('selected-avatar'));
    element.classList.add('selected-avatar');
}

function startGame() {
    const nicknameInput = document.getElementById("nickname");
    player1Name = nicknameInput.value || "Player 1";

    if (player1Name.length > 8) {
        player1Name = player1Name.substring(0, 8) + '.';
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
                <img id="left-player" src="../static/${player1Avatar}" alt="player1">
                <h3>${player1Name}</h3>
                <h1 id="left-score">0</h1>
            </div>
            <div class="right-player">
                <img id="right-player" src="../static/${player2Avatar}" alt="player2">
                <h3>${player2Name}</h3>
                <h1 id="right-score">0</h1>
            </div>
            <div class="score-line"></div>
            <div class="score-line"></div>
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
    `;
    body.appendChild(div);
    // Reset scores
    leftScore = 0;
    rightScore = 0;
    document.getElementById("left-score").innerText = leftScore;
    document.getElementById("right-score").innerText = rightScore;

    // Show count down before starting game.
    showCountdown();
}

function showCountdown() {
    const countdownElement = document.getElementById("countdown");
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

    const paddleWidth = 10;
    const paddleHeight = 100;
    const ballRadius = 10;

    let leftScore = 0;
    let rightScore = 0;

    // Position of paddles and balls
    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;

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
        const leftPlayerNickname = player1Name;
        const rightPlayerNickname = player2Name;

        if (leftScore === 5 || rightScore === 5) {
            clearInterval(gameInterval); // Stop the game loop
            const winner = leftScore === 5 ? leftPlayerNickname : rightPlayerNickname;
            const confirmationElement = document.querySelector('.confirmation-to-quit');
            if (confirmationElement) {
                confirmationElement.classList.remove('hidden');
                let countdown = 5;
                confirmationElement.innerHTML = `<span>Game Over</span><br><span style="font-size: 2em; color: #007bff">${winner} Wins!</span><br>Returning to game page in ${countdown}s...`;
                
                const countdownInterval = setInterval(() => {
                    countdown -= 1;
                    confirmationElement.innerHTML = `<span>Game Over</span><br><span style="font-size: 2em; color: #007bff">${winner} Wins!</span><br>Returning to game page in ${countdown}s...`;
        
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
                            } else {
                                console.error('Error saving score:', data.message);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
        
                        gamePage();
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
