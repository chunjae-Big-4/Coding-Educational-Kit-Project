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

// 오디오
const appleSound = new Audio('/static/sound/apple.mp3');
const goalSound = new Audio('/static/sound/goal.mp3');
const rockSound = new Audio('/static/sound/rock.mp3');
const backgroundSound = new Audio('/static/sound/background.mp3');

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

// 이전 코드 백업 (한번에 이동)
function movePlayer(direction, number) {
    const numberOfSteps = parseInt(number, 10);
    console.log(`받아온 방향과 숫자: ${numberOfSteps} steps to the ${direction}`);

    // 움직이기 전의 위치 저장 
    const originalX = playerPosition.x;
    const originalY = playerPosition.y;

    // 이동 여부를 판단
    let validMove = false;
    let step = 0;

    // 게임이 종료되면 더이상 움직이지 않음 
    if (isGameOver) {
        return;
      }

      function moveStep() {
        switch (direction) {
            case 'left':
                if (playerPosition.x > 0) {
                    playerPosition.x -= 1;
                }
                break;
            case 'right':
                if (playerPosition.x < 4) {
                    playerPosition.x += 1;
                }
                break;
            case 'up':
                if (playerPosition.y > 0) {
                    playerPosition.y -= 1;
                }
                break;
            case 'down':
                if (playerPosition.y < 4) {
                    playerPosition.y += 1;
                }
                break;
            default:
                console.log("잘못된 방향이 인식됨");
                return;
        }

        checkGameState();

        if (crashRock()) {  
            playerPosition.x = originalX;
            playerPosition.y = originalY;
            rockPopup();
            drawMaze();
        } else {
            Target();
            drawMaze();
            step++;

            if (step < numberOfSteps) {
                setTimeout(moveStep, 500); // 0.5초 후에 다음 이동 실행
            }
        }
    }

    moveStep(); 

    if (validMove) {
        moveCounts[direction]++; // 해당 방향의 이동 횟수를 증가
        moveCount += 1; // 이동할 때마다 횟수를 증가
        updateMoveCounts(); // 이동 횟수 업데이트
        updateMoveCount(); // 총 이동 횟수 업데이트 
        updateScore(-1); // 점수 차감
    }
}

// 사과 먹으면 팝업 띄우기 
function applePopup() {
    const a_popup = document.getElementById('apple_popup');
    a_popup.style.display = 'block';

    // 사과 효과음 재생
    appleSound.play();

    setTimeout(function() {
        a_popup.style.display = 'none'; 
    }, 2000); 
}

// 장애물 만나면 팝업 띄우기 
function rockPopup() {
    const r_popup = document.getElementById('rock_popup');
    r_popup.style.display = 'block'; 

    rockSound.play();

    setTimeout(function() {
        r_popup.style.display = 'none'; 
    }, 2000); 
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

    goalSound.play();
}

// 도착했는지 검사 
function Target() {
    if (targetPosition && playerPosition.x === targetPosition.x && playerPosition.y === targetPosition.y) {
        isGameOver = true;
        backgroundSound.pause(); // 도착하면 배경음도 끝냄 
        popup();
    }
}

// 막힌길을 만나면 팝업 띄우기
function roadPopup() {
    const road_popup = document.getElementById('road_popup');
    road_popup.style.display = 'block'; 

    setTimeout(function() {
        road_popup.style.display = 'none'; 
    }, 2000); 
}

// 다음단계 준비중 팝업 
function next_popup() {
    const next_popup = document.getElementById('next_popup');
    next_popup.style.display = 'block'; 
}

// 초기 가이드 화면 닫는 함수 
document.addEventListener('DOMContentLoaded', (event) => {
    // 닫기 버튼 요소
    const closeButton = document.querySelector('.start_popup button');
  
    // 닫기 버튼에 클릭 이벤트 리스너를 추가하여 버튼을 누르면 닫히도록 함 
    closeButton.addEventListener('click', function() {
      const startPopup = document.querySelector('.start_popup');
      startPopup.style.display = 'none';
      backgroundSound.play(); // 가이드를 닫으면 바로 배경음이 시작됨 
    });
  });
  
  
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