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

// ��l�ƵP��
function initDeck() {
  const suits = ['?', '?', '?', '?'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

// �~�P
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// �o�P
function dealCard(hand) {
  const card = deck.pop();
  hand.push(card);
  const cardElement = document.createElement('div');
  cardElement.innerText = `${card.value}${card.suit}`;
  hand === playerCards ? playerHand.appendChild(cardElement) : dealerHand.appendChild(cardElement);
}

// �p���P�I��
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

// �ˬd�O�_�z�P
function checkBust(cards) {
  return calculatePoints(cards) > 21;
}

// ��s�C�����A
function updateGame() {
  if (gameOver) return;

  const playerPoints = calculatePoints(playerCards);
  const dealerPoints = calculatePoints(dealerCards);

  if (playerCards.length === 2 && playerPoints === 21) {
    message.innerText = '���a 21 �I�I�AĹ�F�I';
    gameOver = true;
  } else if (checkBust(playerCards)) {
    message.innerText = '���a�z�P�I���aĹ�F�I';
    gameOver = true;
  } else if (dealerCards.length === 2 && dealerPoints === 21) {
    message.innerText = '���a 21 �I�I���aĹ�F�I';
    gameOver = true;
  } else if (checkBust(dealerCards)) {
    message.innerText = '���a�z�P�I���aĹ�F�I';
    gameOver = true;
  } else if (gameOver) {
    if (playerPoints > dealerPoints) {
      message.innerText = '���aĹ�F�I';
    } else if (dealerPoints > playerPoints) {
      message.innerText = '���aĹ�F�I';
    } else {
      message.innerText = '����I';
    }
  }
}

// �}�l�C��
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

// �o�P���s�I���ƥ�
dealButton.addEventListener('click', startGame);

// �n�P���s�I���ƥ�
hitButton.addEventListener('click', () => {
  if (!gameOver) {
    dealCard(playerCards);
    updateGame();
  }
});

// ���P���s�I���ƥ�
standButton.addEventListener('click', () => {
  if (!gameOver) {
    while (calculatePoints(dealerCards) < 17) {
      dealCard(dealerCards);
    }
    updateGame();
  }
});

// ��l�ƹC��
startGame();