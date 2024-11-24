let player1Name = "Player 1";
let player2Name = "Player 2";
let player1Avatar = "./avatars/avatar4.png";
let player2Avatar = "./avatars/avatar5.png";

function gamePage() {
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
                <img src="./avatars/avatar1.png" alt="Avatar 1" onclick="selectAvatar(1)">
                <img src="./avatars/avatar2.png" alt="Avatar 2" onclick="selectAvatar(2)">
                <img src="./avatars/avatar3.png" alt="Avatar 3" onclick="selectAvatar(3)">
                <img src="./avatars/avatar4.png" alt="Avatar 4" onclick="selectAvatar(4)">
                <img src="./avatars/avatar5.png" alt="Avatar 5" onclick="selectAvatar(5)">
                <img src="./avatars/avatar6.png" alt="Avatar 6" onclick="selectAvatar(6)">
            </div>
        </div>
        <div class="choose-nickname">
            <h2>Nickname</h2>
            <input class="gamepage-input" type="text" id="nickname" placeholder="Enter your nickname">
        </div>
        <div class="ready">
            <button class="gamepage-button" onclick="startGame()">Ready</button>
        </div>
    `;
    body.appendChild(div);
}

function selectAvatar(avatarNumber) {
    player1Avatar = `./avatars/avatar${avatarNumber}.png`;
}

function startGame() {
    const nicknameInput = document.getElementById("nickname");
    player1Name = nicknameInput.value || "Player 1";

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
                <img id="left-player" src="${player1Avatar}" alt="player1">
                <h3>${player1Name}</h3>
                <h1 id="left-score">0</h1>
            </div>
            <div class="right-player">
                <img id="right-player" src="${player2Avatar}" alt="player2">
                <h3>${player2Name}</h3>
                <h1 id="right-score">0</h1>
            </div>
            <div class="score-line"></div>
        </div>
        <canvas id="pongCanvas" width="700" height="400"></canvas>
    `;
    body.appendChild(div);

    // Initialize the game after the canvas is added to the DOM
    initializeGame();
}

function initializeGame() {
    const canvas = document.getElementById("pongCanvas");
    const ctx = canvas.getContext("2d");

    const paddleWidth = 10;
    const paddleHeight = 100;
    const ballRadius = 10;

    let paddle1Y = (canvas.height - paddleHeight) / 2;
    let paddle2Y = (canvas.height - paddleHeight) / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 5;

    const paddleSpeed = 20;

    let leftScore = 0;
    let rightScore = 0;

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

    setInterval(draw, 20);
}
