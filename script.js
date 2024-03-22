const playerHand = document.getElementById('player-hand');
const dealerHand = document.getElementById('dealer-hand');
const dealButton = document.getElementById('deal-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const message = document.getElementById('message');

let deck = [];
let playerCards = [];
let dealerCards = [];
let gameOver = false;

// 初始化牌堆
function initDeck() {
  const suits = ['♣', '♦', '♥', '♠'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

// 洗牌
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// 發牌
function dealCard(hand) {
  const card = deck.pop();
  hand.push(card);
  const cardElement = document.createElement('div');
  cardElement.innerText = `${card.value}${card.suit}`;
  hand === playerCards ? playerHand.appendChild(cardElement) : dealerHand.appendChild(cardElement);
}

// 計算手牌點數
function calculatePoints(cards) {
  let points = 0;
  let hasAce = false;
  for (let card of cards) {
    if (card.value === 'A') {
      hasAce = true;
    }
    if (['J', 'Q', 'K'].includes(card.value)) {
      points += 10;
    } else if (card.value !== 'A') {
      points += parseInt(card.value);
    }
  }
  if (hasAce && points + 11 <= 21) {
    points += 11;
  } else {
    points += hasAce ? 1 : 0;
  }
  return points;
}

// 檢查是否爆牌
function checkBust(cards) {
  return calculatePoints(cards) > 21;
}

// 更新遊戲狀態
function updateGame() {
  if (gameOver) return;

  const playerPoints = calculatePoints(playerCards);
  const dealerPoints = calculatePoints(dealerCards);

  if (playerCards.length === 2 && playerPoints === 21) {
    message.innerText = '玩家 21 點！你贏了！';
    gameOver = true;
  } else if (checkBust(playerCards)) {
    message.innerText = '玩家爆牌！莊家贏了！';
    gameOver = true;
  } else if (dealerCards.length === 2 && dealerPoints === 21) {
    message.innerText = '莊家 21 點！莊家贏了！';
    gameOver = true;
  } else if (checkBust(dealerCards)) {
    message.innerText = '莊家爆牌！玩家贏了！';
    gameOver = true;
  } else if (gameOver) {
    if (playerPoints > dealerPoints) {
      message.innerText = '玩家贏了！';
    } else if (dealerPoints > playerPoints) {
      message.innerText = '莊家贏了！';
    } else {
      message.innerText = '平手！';
    }
  }
}

// 開始遊戲
function startGame() {
  initDeck();
  shuffleDeck();

  playerCards = [];
  dealerCards = [];
  gameOver = false;
  message.innerText = '';

  while (playerHand.firstChild) {
    playerHand.removeChild(playerHand.firstChild);
  }
  while (dealerHand.firstChild) {
    dealerHand.removeChild(dealerHand.firstChild);
  }

  dealCard(playerCards);
  dealCard(dealerCards);
  dealCard(playerCards);
  dealCard(dealerCards);

  updateGame();
}

// 發牌按鈕點擊事件
dealButton.addEventListener('click', startGame);

// 要牌按鈕點擊事件
hitButton.addEventListener('click', () => {
  if (!gameOver) {
    dealCard(playerCards);
    updateGame();
  }
});

// 停牌按鈕點擊事件
standButton.addEventListener('click', () => {
  if (!gameOver) {
    while (calculatePoints(dealerCards) < 17) {
      dealCard(dealerCards);
    }
    updateGame();
  }
});

// 初始化遊戲
startGame();
