const maze = document.getElementById("maze");
let playerPosition = { x: 4, y: 4 }; // 플레이어 시작 
let applePosition = { x: 3, y: 2 }; // 사과 위치
const rockPosition = { x: 4, y: 2 }; // 바위 위치
const targetPosition = { x: 0, y: 0 }; // 목표 위치
// 사이드 길 
const rightPathPosition = [
    { x: 4, y: 1 },
    { x: 4, y: 2 },
    { x: 4, y: 3 }
  ];  
const leftPathPosition = [
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 }
];  
const downwardPathPosition = [
    { x: 1, y: 4 },
    { x: 2, y: 4 },
    { x: 3, y: 4 }
];  
const upwardPathPosition = [
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 3, y: 0 }
];  
// 모퉁이 
const sidePosition1 = { x: 4, y: 4 }; // 오른쪽 아래
const sidePosition2 = { x: 0, y: 4 }; // 왼쪽 아래
const sidePosition3 = { x: 4, y: 0 }; // 오른쪽 위 

let score = 0; // 점수
let moveCount = 0; // 이동 횟수
let moveCounts = {
    left: 0,
    right: 0,
    up: 0,
    down: 0
 };
let isGameOver = false; // 종료를 위한 체크

// 이동 점수 시스템 
function updateScore(points) {
    // points가 숫자인지 확인
    if (typeof points !== 'number' || isNaN(points)) {
        console.error('잘못된 점수 입력:', points);
        return;
    }

    score += points;
    document.getElementById('scoreboard').innerText = `${score}`;
}

// 이동횟수 카운트 
function updateMoveCount() {
    document.getElementById('moveCount').innerText = `${moveCount}`;
}

// 추가 보너스 점수 시스템 
function checkGameState() {
    if (applePosition && playerPosition.x === applePosition.x && playerPosition.y === applePosition.y) {
        updateScore(5); // 사과를 먹으면 5점 추가
        applePosition = null; // 사과가 먹혔으니 위치를 null로 설정

        applePopup();
    }
    // 목표 지점에 도달했는지 체크
    if (playerPosition.x === targetPosition.x && playerPosition.y === targetPosition.y) {
        updateScore(10); // 목표 지점에 도착하면 10점 추가
        // 여기에 게임을 재시작하거나 다음 레벨로 진행하는 로직을 추가 예정 
    }
}

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

            // 왼쪽 길 위치
            leftPathPosition.forEach(position => {
                if (position.x === j && position.y === i) {
                    const leftPath = document.createElement('div');
                    leftPath.className = 'left-path'; 
                    cell.appendChild(leftPath);
                }
            });
            // 오른쪽 길 위치
            rightPathPosition.forEach(position => {
                if (position.x === j && position.y === i) {
                    const rightPath = document.createElement('div');
                    rightPath.className = 'right-path'; 
                    cell.appendChild(rightPath);
                }
            });
            // 위쪽 길 위치
            upwardPathPosition.forEach(position => {
                if (position.x === j && position.y === i) {
                    const upwardPath = document.createElement('div');
                    upwardPath.className = 'upward-path'; 
                    cell.appendChild(upwardPath);
                }
            });
            // 아래쪽 길 위치
            downwardPathPosition.forEach(position => {
                if (position.x === j && position.y === i) {
                    const downwardPath = document.createElement('div');
                    downwardPath.className = 'downward-path'; 
                    cell.appendChild(downwardPath);
                }
            });

            // 모퉁이 길 위치 1 
            if (sidePosition1.x === j && sidePosition1.y === i) {
                const side1 = document.createElement('div');
                side1.className = 'side-path-1';
                cell.appendChild(side1);
            }

            // 모퉁이 길 위치 2
            if (sidePosition2.x === j && sidePosition2.y === i) {
                const side2 = document.createElement('div');
                side2.className = 'side-path-2';
                cell.appendChild(side2);
            }

            // 모퉁이 길 위치 3
            if (sidePosition3.x === j && sidePosition3.y === i) {
                const side3 = document.createElement('div');
                side3.className = 'side-path-3';
                cell.appendChild(side3);
            }

            maze.appendChild(cell);
        }
    }
}

// 방향 이동 횟수 카운트
function updateMoveCounts() {
    document.getElementById('leftMoves').innerText = moveCounts.left;
    document.getElementById('rightMoves').innerText = moveCounts.right;
    document.getElementById('upMoves').innerText = moveCounts.up;
    document.getElementById('downMoves').innerText = moveCounts.down;
}

function movePlayer(direction, number) {
    const numberOfSteps = parseInt(number, 10);
    console.log(`받아온 방향과 숫자: ${numberOfSteps} steps to the ${direction}`);

    // 움직이기 전의 위치 저장 
    const originalX = playerPosition.x;
    const originalY = playerPosition.y;

    // 이동 여부를 판단
    let validMove = false;

    // 게임이 종료되면 더이상 움직이지 않음 
    if (isGameOver) {
        return;
      }

    switch (direction) {
        case 'left':
            if (playerPosition.x - numberOfSteps >= 0) {
                playerPosition.x -= numberOfSteps;
                validMove = true;
            }
            else roadPopup();
            break;
        case 'right':
            if (playerPosition.x + numberOfSteps <= 4) {
                playerPosition.x += numberOfSteps;
                validMove = true;
            }
            else roadPopup();
            break;
        case 'up':
            if (playerPosition.y - numberOfSteps >= 0) {
                playerPosition.y -= numberOfSteps;
                validMove = true;
            }
            else roadPopup();
            break;
        case 'down':
            if (playerPosition.y + numberOfSteps <= 4) {
                playerPosition.y += numberOfSteps;
                validMove = true;
            }
            else roadPopup();
            break;
        case 'none' :
            console.log("아직 인식되지않음");
        default:
            console.log("잘못된 방향이 인식됨");
            break;
    }

    if (validMove) {
        moveCounts[direction]++; // 해당 방향의 이동 횟수를 증가
        moveCount += 1; // 이동할 때마다 횟수를 증가
        updateMoveCounts(); // 이동 횟수 업데이트
        updateMoveCount(); // 총 이동 횟수 업데이트 
        updateScore(-1); // 점수 차감
    }

    checkGameState();

    // 만약 바위에 부딪히면 원래 위치로 되돌아감
    if (crashRock()) {  
        playerPosition.x = originalX;
        playerPosition.y = originalY;
        rockPopup();
    }
    Target();
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

// 장애물 만나면 팝업 띄우기 
function rockPopup() {
    const r_popup = document.getElementById('rock_popup');
    r_popup.style.display = 'block'; 

    setTimeout(function() {
        r_popup.style.display = 'none'; 
    }, 3000); 
}

// 장애물 만났는지 검사 
function crashRock() {
    if (rockPosition && playerPosition.x === rockPosition.x && playerPosition.y === rockPosition.y) {
        return true;
    }
    return false;
}

// 도착하면 팝업 띄우기
function popup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'block'; 
}

// 도착했는지 검사 
function Target() {
    if (targetPosition && playerPosition.x === targetPosition.x && playerPosition.y === targetPosition.y) {
        isGameOver = true;
        popup();
    }
}

// 막힌길을 만나면 팝업 띄우기
function roadPopup() {
    const road_popup = document.getElementById('road_popup');
    road_popup.style.display = 'block'; 

    setTimeout(function() {
        road_popup.style.display = 'none'; 
    }, 3000); 
}

// 다음단계 준비중 팝업 
function next_popup() {
    const next_popup = document.getElementById('next_popup');
    next_popup.style.display = 'block'; 
}
  

// MAP 그림 
window.onload = function() {
    drawMaze();
    updateMoveCounts();
};

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