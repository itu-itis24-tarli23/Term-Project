const word = "CHEST";
let score = 0;
let lives = 3;
let guessedLetters = [];
let gameOver = false;
let firstPredictionMade = false;

document.getElementById('submit-prediction').addEventListener('click', makePrediction);
document.getElementById('reset-game').addEventListener('click', resetGame);

function initializeGame() {
    guessedLetters = [];
    score = 0;
    lives = 3;
    gameOver = false;
    firstPredictionMade = false;

    updateScore();
    updateLives();
    document.getElementById('prediction').value = "";
    document.getElementById('reset-game').style.display = "none"; // Reset button is hidden initially
    createCards();
}

function createCards() {
    const container = document.getElementById('word-container');
    container.innerHTML = ''; 

    word.split('').forEach((letter, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-index', index);

        const front = document.createElement('img');
        front.src = "images/question-mark.svg"; 
        front.alt = "Question Mark";
        front.classList.add('front');
        card.appendChild(front);

        const back = document.createElement('img');
        back.src = `images/${letter}.svg`; 
        back.alt = letter;
        back.classList.add('back', 'hidden'); 
        card.appendChild(back);

        container.appendChild(card);
    });
}

function makePrediction() {
    if (gameOver) return;

    const userInput = document.getElementById('prediction').value.toUpperCase();
    if (!userInput || userInput.length === 0) return;

    if (!firstPredictionMade) {
        document.getElementById('reset-game').style.display = "block"; // Show reset button after the first prediction
        firstPredictionMade = true;
    }

    if (userInput.length === 1) {
        handleLetterPrediction(userInput);
    } else if (userInput.length === word.length) {
        if (userInput === word) {
            score = 100;
            updateScore();
            revealAllCards();
            setTimeout(() => {
                alert("Congratulations! You've guessed the correct word!");
                endGame(true);
            }, 100); 
        } else {
            alert("Incorrect full word guess! You lost the game.");
            loseGame(); 
        }
    } else {
        alert("Please enter a valid guess (either a letter or the full word).");
    }
}

function handleLetterPrediction(letter) {
    if (guessedLetters.includes(letter)) {
        alert("This letter has already been guessed!");
        return;
    }

    if (word.includes(letter)) {
        guessedLetters.push(letter);
        score += 20;
        if (score > 100) score = 100;
        updateScore();
        revealLetter(letter);
    } else {
        handleIncorrectGuess();
    }
}

function revealLetter(letter) {
    const cards = document.querySelectorAll('.card');
    word.split('').forEach((char, index) => {
        if (char === letter) {
            const card = cards[index];
            const back = card.querySelector('.back');
            back.classList.remove('hidden');
        }
    });

    if (guessedLetters.length === word.length) {
        revealAllCards();
        setTimeout(() => {
            alert("Congratulations! You've guessed all letters!");
            endGame(true);
        }, 100);
    }
}

function revealAllCards() {
    const cards = document.querySelectorAll('.card .back');
    cards.forEach(card => card.classList.remove('hidden'));
}

function handleIncorrectGuess() {
    lives--;
    updateLives();
    if (lives <= 0) {
        alert("Game over! You've run out of lives.");
        endGame(false);
    }
}

function loseGame() {
    lives = 0;
    updateLives();
    gameOver = true;
    alert("You lost the game!");
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

function updateLives() {
    const lifeIcons = document.querySelectorAll('.life-icon');
    lifeIcons.forEach((icon, index) => {
        icon.style.visibility = index < lives ? "visible" : "hidden";
    });
}

function endGame(won) {
    gameOver = true;
    alert(won ? "You win!" : "You lose. Try again!");
}

function resetGame() {
    initializeGame();
}

initializeGame();
