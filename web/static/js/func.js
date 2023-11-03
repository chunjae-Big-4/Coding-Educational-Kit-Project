const maze = document.getElementById("maze");
let playerPosition = { x: 2, y: 2 }; // 플레이어 시작 위치
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

            maze.appendChild(cell);
        }
    }
}


function movePlayer(direction, number) {
    const numberOfSteps = parseInt(number, 10);
    console.log(`Moving player ${numberOfSteps} steps to the ${direction}`);
    for (let i = 0; i < numberOfSteps; i++) {
        switch (direction) {
            case 'left':
                if (playerPosition.x > 0) playerPosition.x--;
                break;
            case 'right':
                if (playerPosition.x < 4) playerPosition.x++;
                break;
            case 'up':
                if (playerPosition.y > 0) playerPosition.y--;
                break;
            case 'down':
                if (playerPosition.y < 4) playerPosition.y++;
                break;
        }
    }
    console.log(`New player position: (${playerPosition.x}, ${playerPosition.y})`);
    drawMaze();
}

// MAP 그림 
window.onload = drawMaze;

// 서버로부터 받은 방향과 숫자만큼 움직임 
async function getDirectionFromServer() {
    try {
        console.log('Requesting direction from server...');
        const response = await fetch('/get-direction');
        const data = await response.json();
        console.log('Data received from server:', data);
        if (data.direction && data.number) {
            movePlayer(data.direction, data.number);
        } else {
            console.log('Missing direction or number in response');
        }
    } catch (error) {
        console.error('Error fetching direction:', error);
    }
}

getDirectionFromServer();
// 일정 시간마다 서버로부터 방향을 가져옴 
setInterval(getDirectionFromServer, 1000);