const boxes = document.querySelectorAll(".boxes");
const gameBox = document.querySelector(".gameBox");
const resetBtn = document.querySelector("#reset");
const winnerMsg = document.querySelector(".winner-box");
const players = document.querySelectorAll(".players");
let XorO = "X";
let gameIndex = [];
let gameLength = 0;
let winner;
let isWin = false;

const winningConitions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const clickSound = new Audio('./SOund/switch.wav');
const winSound = new Audio('./SOund/win.mp3');

const toggleTurn = (val1, val2) => {
    players[0].classList[val1]("active");
    players[1].classList[val2]("active");
}

const winningLine = document.querySelector(".winningLine");

const changeLine = (left, top) => {
    winningLine.style.left = `${left}rem`;
    if(top) winningLine.style.top = `${top}rem`;
}

const patternLine = (pattern) => {
    winningLine.classList.remove("hide");
    switch (pattern) {
        case winningConitions[1]:
            changeLine(12.1);
            break;
            
        case winningConitions[2]:
            changeLine(19.7);
            break;
            
        case winningConitions[3]:
            winningLine.style.transform = `rotateZ(90deg)`;
            changeLine(12, -7);
            break;
            
        case winningConitions[4]:
            changeLine(12);
            winningLine.style.transform = `rotateZ(90deg)`;
            break;
            
        case winningConitions[5]:
            changeLine(12, 7.9);
            winningLine.style.transform = `rotateZ(90deg)`;
            break;

        case winningConitions[6]:
            changeLine(12, -1);
            winningLine.style.height = "24rem"
            winningLine.style.transform = `rotateZ(-45deg)`;
            break;

        case winningConitions[7]:
            winningLine.style.height = "24rem";
            winningLine.style.transform = `rotateZ(44deg)`;
            changeLine(12.5, -1);
            break;

        default: console.log("Invalid Pattern"); break;
    }
}

const showWinner = (winner) => {
    winnerMsg.classList.remove("hide");
    winnerMsg.textContent = `Player ${winner} won the game, Press RESET to start again`;
}

const handleXorO = () => {
    XorO = XorO === "X" ? "O" : "X";
    toggleTurn("toggle", "toggle");
}

// Handeling X or O
gameBox.addEventListener('click', (event) => {
    if(!isWin){
        clickSound.play();
        clickSound.currentTime = 0;

        let targetBox = event.target.closest('.boxes');
        let boxId = Number(event.target.getAttribute("id"));

        if(targetBox && targetBox.textContent == ""){
            targetBox.textContent = XorO;
            gameIndex[boxId] = XorO;
            handleXorO();
            gameLength++;
        }
        
        if(gameLength > 2){
            winningConitions.forEach((pattern) => {
                if(gameIndex[pattern[0]] && gameIndex[pattern[0]] === gameIndex[pattern[1]] 
                    && gameIndex[pattern[1]] === gameIndex[pattern[2]]){
                    isWin = true;
                    patternLine(pattern);
                    showWinner(gameIndex[pattern[0]]);
                    toggleTurn("remove", "remove");
                    winSound.play();
                    winSound.currentTime = 0;
                }
            })
        }
    }
});

function reset(){
    XorO = "X";
    winner = "";
    gameIndex = [];
    gameLength = 0;
    winningLine.classList.add("hide");
    winnerMsg.classList.add("hide");
    toggleTurn("add", "remove");
    winningLine.style = "";
    isWin = false;
    boxes.forEach((box) => {
        box.textContent = "";
    })
}

resetBtn.addEventListener("click", () => {
    reset();
});