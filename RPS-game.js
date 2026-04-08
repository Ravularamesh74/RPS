// ========================
// STATE MANAGEMENT
// ========================
const score = JSON.parse(localStorage.getItem('score')) || {
  wins: 0,
  losses: 0,
  ties: 0
};

const moves = ['rock', 'paper', 'scissors'];

let isAutoplaying = false;
let intervalId = null;


// ========================
// INIT
// ========================
updateScore();


// ========================
// EVENT LISTENERS
// ========================
document.querySelector('.js-rock-btn').onclick = () => playGame('rock');
document.querySelector('.js-paper-btn').onclick = () => playGame('paper');
document.querySelector('.js-scissors-btn').onclick = () => playGame('scissors');

document.querySelector('.js-reset-btn').onclick = resetGame;

document.querySelector('.js-autoplay').onclick = toggleAutoplay;

document.body.addEventListener('keydown', (e) => {
  const keyMap = { r: 'rock', p: 'paper', s: 'scissors' };
  if (keyMap[e.key]) playGame(keyMap[e.key]);
});


// ========================
// GAME LOGIC
// ========================
function playGame(playerMove) {
  const limit = 3;
  if (score.wins >= limit || score.losses >= limit) return;

  const computerMove = pickComputerMove();

  const result = getResult(playerMove, computerMove);

  updateScoreState(result);
  saveScore();
  updateUI(result, playerMove, computerMove);

  checkWinner();
}


// RULE ENGINE (CLEAN 🔥)
function getResult(player, computer) {
  if (player === computer) return 'tie';

  const winMap = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };

  return winMap[player] === computer ? 'win' : 'lose';
}


// ========================
// SCORE HANDLING
// ========================
function updateScoreState(result) {
  if (result === 'win') score.wins++;
  else if (result === 'lose') score.losses++;
  else score.ties++;
}

function saveScore() {
  localStorage.setItem('score', JSON.stringify(score));
}


// ========================
// UI UPDATE
// ========================
function updateUI(result, player, computer) {
  const resultText = {
    win: '🔥 You WON!',
    lose: '💀 You Lost!',
    tie: '🤝 Tie!'
  };

  document.querySelector('.js-result').innerHTML = resultText[result];

  document.querySelector('.js-moves').innerHTML = `
    You 
    <img src="assets/${player}.jpg" class="move-icon1">
    <img src="assets/${computer}.jpg" class="move-icon1">
    Computer
  `;

  updateScore();

  // Add glow effect
  document.querySelector('.js-result').classList.add('winner');
  setTimeout(() => {
    document.querySelector('.js-result').classList.remove('winner');
  }, 500);
}


function updateScore() {
  const userScoreEl = document.querySelector('.js-user-score');
  if (userScoreEl) userScoreEl.innerHTML = score.wins;

  const computerScoreEl = document.querySelector('.js-computer-score');
  if (computerScoreEl) computerScoreEl.innerHTML = score.losses;
}


// ========================
// AUTOPLAY SYSTEM
// ========================
function toggleAutoplay() {
  const btn = document.querySelector('.js-autoplay');

  isAutoplaying = !isAutoplaying;

  if (isAutoplaying) {
    intervalId = setInterval(() => {
      const randomMove = moves[Math.floor(Math.random() * 3)];
      playGame(randomMove);
    }, 800);

    btn.innerText = 'Stop Play';
    btn.classList.add('stop-play');

  } else {
    clearInterval(intervalId);

    btn.innerText = 'Auto Play';
    btn.classList.remove('stop-play');
  }
}


// ========================
// RESET
// ========================
function resetGame() {
  score.wins = 0;
  score.losses = 0;
  score.ties = 0;

  localStorage.removeItem('score');

  updateScore();

  document.querySelector('.js-result').innerHTML = 'Make your move';
  document.querySelector('.js-moves').innerHTML = '';
  document.querySelector('.js-moves').style.display = '';
  document.querySelector('.js-autoplay').style.display = '';
}


// ========================
// WIN CONDITION
// ========================
function checkWinner() {
  const limit = 3;

  if (score.wins >= limit || score.losses >= limit) {
    stopGame();

    const message = score.wins >= limit
      ? '🏆 PLAYER WINS MATCH!'
      : '💻 COMPUTER WINS MATCH!';

    document.querySelector('.js-result').innerHTML = message;
  }
}


function stopGame() {
  clearInterval(intervalId);
  isAutoplaying = false;

  document.querySelector('.js-autoplay').style.display = 'none';
  document.querySelector('.js-moves').style.display = 'none';
}


// ========================
// UTIL
// ========================
function pickComputerMove() {
  return moves[Math.floor(Math.random() * 3)];
}