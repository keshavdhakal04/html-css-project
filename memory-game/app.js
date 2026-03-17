'use strict';

// =====================
// CONFIG
// =====================
const EMOJIS = ['🐶','🐱','🦊','🐸','🦁','🐼','🦄','🐙'];
 
// =====================
// STATE
// =====================
let cards = [];
let flipped = [];
let matched = [];
let moves = 0;
let seconds = 0;
let timerInterval = null;
let lockBoard = false;
 
// =====================
// DOM REFS
// =====================
const board      = document.getElementById('game-board');
const movesEl    = document.getElementById('moves-count');
const matchesEl  = document.getElementById('matches-count');
const timerEl    = document.getElementById('timer');
const modal      = document.getElementById('win-modal');
const modalStats = document.getElementById('modal-stats');
const restartBtn = document.getElementById('restart-btn');
const playAgain  = document.getElementById('play-again-btn');
 
// =====================
// INIT
// =====================
function init() {
  flipped = [];
  matched = [];
  moves = 0;
  seconds = 0;
  lockBoard = false;
 
  movesEl.textContent = '0';
  matchesEl.textContent = '0 / 8';
  timerEl.textContent = '0s';
  modal.classList.add('hidden');
 
  clearInterval(timerInterval);
  timerInterval = null;
 
  cards = shuffle([...EMOJIS, ...EMOJIS]);
  renderBoard();
}
 
// =====================
// RENDER
// =====================
function renderBoard() {
  board.innerHTML = '';
 
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.style.animationDelay = `${index * 40}ms`;
 
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front">${emoji}</div>
      </div>
    `;
 
    card.addEventListener('click', onCardClick);
    board.appendChild(card);
  });
}
 
// =====================
// CARD CLICK
// =====================
function onCardClick(e) {
  const card = e.currentTarget;
 
  if (lockBoard) return;
  if (card.classList.contains('flipped')) return;
  if (card.classList.contains('matched')) return;
 
  if (!timerInterval) startTimer();
 
  card.classList.add('flipped');
  flipped.push(card);
 
  if (flipped.length === 2) checkMatch();
}
 
// =====================
// CHECK MATCH
// =====================
function checkMatch() {
  lockBoard = true;
  const [a, b] = flipped;
  const isMatch = a.dataset.emoji === b.dataset.emoji;
 
  if (isMatch) {
    a.classList.add('matched');
    b.classList.add('matched');
    matched.push(a, b);
    flipped = [];
    lockBoard = false;
    incrementMoves();
    updateMatches();
    if (matched.length === cards.length) setTimeout(showWin, 500);
  } else {
    incrementMoves();
    setTimeout(() => {
      a.classList.add('shake');
      b.classList.add('shake');
      setTimeout(() => {
        a.classList.remove('flipped', 'shake');
        b.classList.remove('flipped', 'shake');
        flipped = [];
        lockBoard = false;
      }, 400);
    }, 600);
  }
}
 
// =====================
// HELPERS
// =====================
function incrementMoves() {
  moves++;
  movesEl.textContent = moves;
}
 
function updateMatches() {
  const count = matched.length / 2;
  matchesEl.textContent = `${count} / 8`;
}
 
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    timerEl.textContent = `${seconds}s`;
  }, 1000);
}
 
function showWin() {
  clearInterval(timerInterval);
  modalStats.textContent = `Completed in ${moves} moves · ${seconds}s`;
  modal.classList.remove('hidden');
}
 
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
 
// =====================
// EVENTS
// =====================
restartBtn.addEventListener('click', init);
playAgain.addEventListener('click', init);
 
// =====================
// START
// =====================
init();
 