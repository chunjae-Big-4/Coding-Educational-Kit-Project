const maze = document.getElementById("maze");
let playerPosition = { x: 4, y: 4 }; // 플레이어 시작 
let applePosition = { x: 3, y: 2 }; // 사과 위치
const rockPosition = { x: 4, y: 2 }; // 바위 위치
const targetPosition = { x: 0, y: 0 }; // 목표 위치


function drawMaze() {
    maze.innerHTML = ''; 
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            
            // 셀 배경 이미지 요소 생성 
            const cellBackground = document.createElement('div');
            cellBackground.className = 'cell-background';
            cell.appendChild(cellBackground);

            // 플레이어 위치에 플레이어 요소 추가 
            if (playerPosition.x === j && playerPosition.y === i) {
                const player = document.createElement('div');
                player.className = 'player';
                cell.appendChild(player);
            }

            // 목표 위치에 목표 요소 추가 
            if (targetPosition.x === j && targetPosition.y === i) {
                const target = document.createElement('div');
                target.className = 'target';
                cell.appendChild(target);
            }

            // 사과 위치에 사과 요소 추가
            if (applePosition && applePosition.x === j && applePosition.y === i) {
                const apple = document.createElement('div');
                apple.className = 'apple';
                cell.appendChild(apple);
            }

            // 바위 위치에 바위 요소 추가
            if (rockPosition.x === j && rockPosition.y === i) {
                const rock = document.createElement('div');
                rock.className = 'rock';
                cell.appendChild(rock);
            }

            maze.appendChild(cell);
        }
    }
}

function movePlayer(direction, number) {
    const numberOfSteps = parseInt(number, 10);
    console.log(`받아온 방향과 숫자: ${numberOfSteps} steps to the ${direction}`);
    switch (direction) {
        case 'left':
            if (playerPosition.x > 0) {
                playerPosition.x -= numberOfSteps
            }
            break;
        case 'right':
            if (playerPosition.x < 4) {
                playerPosition.x += numberOfSteps
            }
            break;
        case 'up':
            if (playerPosition.y > 0) {
                playerPosition.y -= numberOfSteps
            }
            break;
        case 'down':
            if (playerPosition.y < 4) {
                playerPosition.x += numberOfSteps
            }
            break;
        }
    eatApple();
    console.log(`캐릭터 위치: : (${playerPosition.x}, ${playerPosition.y})`);
    drawMaze(); // 최종 위치를 화면에 표시 
}

// 사과 먹으면 팝업 띄우기 
function applePopup() {
    const a_popup = document.getElementById('apple_popup');
    a_popup.style.display = 'block'; 

    setTimeout(function() {
        a_popup.style.display = 'none'; 
    }, 3000); 
}

// 사과 먹는지 검사 
function eatApple() {
    if (applePosition && playerPosition.x === applePosition.x && playerPosition.y === applePosition.y) {
        applePosition = null; 

        applePopup();
    }
}

// 장애물 만나면 팝업 띄우기 
function rockPopup() {
    const r_popup = document.getElementById('rock_popup');
    r_popup.style.display = 'block'; 

    setTimeout(function() {
        r_popup.style.display = 'none'; 
    }, 3000); 
}

// 장애물 만났는지 검사 
function CrashRock() {
    if (rockPosition && playerPosition.x === rockPosition.x && playerPosition.y === rockPosition.y) {

        rockPopup();
    }
}

// 도착하면 팝업 띄우기
function Popup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block'; 

    setTimeout(function() {
        popup.style.display = 'none'; 
    }, 3000); 
}

// 도착했는지 검사 
function Target() {
    if (targetPosition && playerPosition.x === targetPosition.x && playerPosition.y === targetPosition.y) {

        Popup();
    }
}


// MAP 그림 
window.onload = drawMaze;

async function getDirectionFromServer() {
    try {
        const response = await fetch('/get-direction');
        const data = await response.json();
        console.log('Data received from server:', data);
        if (data.direction && data.number) {
            movePlayer(data.direction, data.number);
        } else {
            console.log('[문제발생] 방향과 숫자가 이상함');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

getDirectionFromServer();
// 일정 시간마다 서버로부터 방향을 가져옴 
setInterval(getDirectionFromServer, 1000);