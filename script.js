const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const clickButton = document.getElementById("clickButton");
const startButton = document.getElementById("startButton");
const message = document.getElementById("message");

let score = 0;
let timeLeft = 10;
let interval = null;
let playing = false;

clickButton.disabled = true;

function registerClick() {
    if (!playing) return;

    score++;
    scoreDisplay.textContent = `Score : ${score}`;
}

function startGame() {
    clearInterval(interval);

    score = 0;
    timeLeft = 10;
    playing = true;

    scoreDisplay.textContent = "Score : 0";
    timerDisplay.textContent = timeLeft;
    message.textContent = "Vite ! Clique autant que possible !";

    clickButton.disabled = false;
    startButton.disabled = true;

    interval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(interval);
            playing = false;

            clickButton.disabled = true;
            startButton.disabled = false;
            message.textContent = `Terminé ! Ton score : ${score} clics.`;
        }
    }, 1000);
}

clickButton.addEventListener("click", registerClick);
startButton.addEventListener("click", startGame);