let maze;
let player;
let ai;
let end;
let aiPath = [];
let aiInterval;
let aiSpeed = 200;
let gameStarted = false;

// 🎯 Generate Random Maze
function generateMaze(size) {
    let maze = [];

    for (let y = 0; y < size; y++) {
        let row = [];
        for (let x = 0; x < size; x++) {

            if (x === 0 || y === 0 || x === size - 1 || y === size - 1) {
                row.push(1);
            } else {
                row.push(Math.random() < 0.3 ? 1 : 0);
            }
        }
        maze.push(row);
    }

    maze[1][1] = 0;
    maze[size - 2][size - 2] = 0;

    return maze;
}

// 🧠 BFS Pathfinding
function findPath(start, end) {
    let queue = [[start]];
    let visited = new Set();

    while (queue.length > 0) {
        let path = queue.shift();
        let { x, y } = path[path.length - 1];

        if (x === end.x && y === end.y) return path;

        let key = x + "," + y;
        if (visited.has(key)) continue;
        visited.add(key);

        let directions = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
        ];

        for (let d of directions) {
            let nx = x + d.x;
            let ny = y + d.y;

            if (
                ny >= 0 &&
                ny < maze.length &&
                nx >= 0 &&
                nx < maze[0].length &&
                maze[ny][nx] === 0
            ) {
                queue.push([...path, { x: nx, y: ny }]);
            }
        }
    }
    return [];
}

// 🎮 Initialize Game
function initGame() {
    const size = 10;

    const level = document.getElementById("level").value;

    if (level === "easy") aiSpeed = 400;
    else if (level === "medium") aiSpeed = 200;
    else if (level === "hard") aiSpeed = 80;

    do {
        maze = generateMaze(size);
        end = { x: size - 2, y: size - 2 };
    } while (findPath({ x: 1, y: 1 }, end).length === 0);

    player = { x: 1, y: 1 };
    ai = { x: 1, y: 2 };

    drawMaze();
    startAI();
}

// 🎨 Draw Maze
const mazeDiv = document.getElementById("maze");

function drawMaze() {
    mazeDiv.innerHTML = "";

    maze.forEach((row, y) => {
        row.forEach((cell, x) => {
            const div = document.createElement("div");
            div.classList.add("cell");

            if (cell === 1) div.classList.add("wall");
            else div.classList.add("path");

            if (x === player.x && y === player.y)
                div.classList.add("player");

            if (x === ai.x && y === ai.y)
                div.classList.add("ai");

            if (x === end.x && y === end.y)
                div.classList.add("end");

            mazeDiv.appendChild(div);
        });
    });
}

// 🎯 Player Movement
document.addEventListener("keydown", (e) => {
    if (!gameStarted) return;

    let dx = 0, dy = 0;

    if (e.key === "ArrowUp") dy = -1;
    else if (e.key === "ArrowDown") dy = 1;
    else if (e.key === "ArrowLeft") dx = -1;
    else if (e.key === "ArrowRight") dx = 1;
    else return;

    let newX = player.x + dx;
    let newY = player.y + dy;

    if (
        newY >= 0 &&
        newY < maze.length &&
        newX >= 0 &&
        newX < maze[0].length &&
        maze[newY][newX] === 0
    ) {
        player.x = newX;
        player.y = newY;
        drawMaze();
    }

    if (player.x === end.x && player.y === end.y) {
        alert("🎉 You Win!");
        restartGame();
    }
});

// 🤖 Start AI
function startAI() {
    aiPath = findPath(ai, end);

    aiInterval = setInterval(() => {
        if (aiPath.length > 0) {
            let nextMove = aiPath.shift();
            ai.x = nextMove.x;
            ai.y = nextMove.y;

            if (ai.x === end.x && ai.y === end.y) {
                clearInterval(aiInterval);
                alert("🤖 AI Wins!");
                restartGame();
            }

            drawMaze();
        }
    }, aiSpeed);
}

// ▶️ Start Game
function startGame() {
    gameStarted = true;
    clearInterval(aiInterval);
    initGame();
}

// 🔄 Restart
function restartGame() {
    clearInterval(aiInterval);
    initGame();
}