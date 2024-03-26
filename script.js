const playerHand = document.getElementById('player-hand');
const dealerHand = document.getElementById('dealer-hand');
const dealButton = document.getElementById('deal-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const message = document.getElementById('message');
const playerPointsDisplay = document.getElementById('player-points');
const dealerPointsDisplay = document.getElementById('dealer-points');

let deck = [];
let playerCards = [];
let dealerCards = [];
let gameOver = false;
let firstRound = true; // Boolean variable added to mark if it's the first round of the game
let stand = false;

// Initialize the deck of cards
function initDeck() {
  const suits = ['clubs', 'spades', 'hearts', 'diamonds'];
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
}

// Shuffle the deck
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// Deal a card
function dealCard(hand) {
  const card = deck.pop();
  hand.push(card);
  const cardElement = document.createElement('img');
  cardElement.src = `images/${card.value}_of_${card.suit}.png`;
  cardElement.alt = `${card.value} of ${card.suit}`;
  cardElement.style.maxWidth = '125px'; // Add this line to limit the image width
  hand === playerCards ? playerHand.appendChild(cardElement) : dealerHand.appendChild(cardElement);
  updatePoints();
}

// Calculate the total points of a hand
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

// Check if a hand is busted
function checkBust(cards) {
  return calculatePoints(cards) > 21;
}

// Update the points display
function updatePoints() {
  playerPointsDisplay.innerText = `Your current points: ${calculatePoints(playerCards)}`;
  dealerPointsDisplay.innerText = `Dealer's current points: ${calculatePoints(dealerCards)}`;
}

// Update game result after game ends and fetch updated win counts
async function updateGameResult(result) {
  try {
    const username = document.getElementById('username').textContent; // Get the current username

    // Update game result
    const updateResponse = await fetch('https://21-point-nodejs-production.up.railway.app/update-results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ result, username })
    });
    const updateData = await updateResponse.json();
    console.log(updateData);

    // Fetch updated win counts
    const resultsResponse = await fetch(`https://21-point-nodejs-production.up.railway.app/results?username=${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const resultData = await resultsResponse.json();
    const winSpan = document.getElementById('win');
    const loseSpan = document.getElementById('lose');

    winSpan.textContent = resultData.win;
    loseSpan.textContent = resultData.lose;
    document.getElementById('result').style.display = 'block'; // Show result area
  } catch (error) {
    console.error('Error:', error);
  }
}



// Update game status
function updateGame() {
  

  const playerPoints = calculatePoints(playerCards);
  const dealerPoints = calculatePoints(dealerCards);

  playerPointsDisplay.innerText = `Your current points: ${playerPoints}`;
  dealerPointsDisplay.innerText = `Dealer's current points: ${dealerPoints}`;

  if (gameOver) return;

	if (playerCards.length === 2 && playerPoints === 21) {
	  message.innerText = 'Player has 21 points! You win!';
	  gameOver = true;
	  updateGameResult('win'); 
	} else if (checkBust(playerCards)) {
	  message.innerText = 'Player busts! Dealer wins!';
	  gameOver = true;
	  updateGameResult('lose');
	} else if (dealerCards.length === 2 && dealerPoints === 21) {
	  message.innerText = 'Dealer has 21 points! Dealer wins!';
	  gameOver = true;
	  updateGameResult('lose');
	} else if (checkBust(dealerCards)) {
	  message.innerText = 'Dealer busts! Player wins!';
	  gameOver = true;
	  updateGameResult('win'); 
	} else if (stand != false && firstRound != true && dealerPoints >= 17) {
	  if (playerPoints > dealerPoints) {
		message.innerText = 'Player wins!';
		updateGameResult('win'); 
	  } else if (dealerPoints > playerPoints) {
		message.innerText = 'Dealer wins!';
		updateGameResult('lose');
	  } else {
		message.innerText = 'Tie!';
	  }
	  gameOver = true;
	}

}

// Start the game
function startGame() {
  initDeck();
  shuffleDeck();

  playerCards = [];
  dealerCards = [];
  gameOver = false;
  firstRound = true;
  stand = false;
  message.innerText = '';

  while (playerHand.firstChild) {
    playerHand.removeChild(playerHand.firstChild);
  }
  while (dealerHand.firstChild) {
    dealerHand.removeChild(dealerHand.firstChild);
  }

  // Add titles for player and dealer hands
  const playerTitle = document.createElement('h2');
  playerTitle.innerText = 'Your hand:';
  playerHand.appendChild(playerTitle);

  const dealerTitle = document.createElement('h2');
  dealerTitle.innerText = "Dealer's hand:";
  dealerHand.appendChild(dealerTitle);

  // Display points initially
  updatePoints();

  dealCard(playerCards);
  dealCard(dealerCards);
  dealCard(playerCards);
  dealCard(dealerCards);

  updateGame();
}

// Deal button click event
dealButton.addEventListener('click', startGame);

// Hit button click event
hitButton.addEventListener('click', () => {
	firstRound = false;
  if (!gameOver) {
    dealCard(playerCards);
    updateGame();
  }
});

// Stand button click event
standButton.addEventListener('click', () => {
	firstRound = false;
	stand = true;
  if (!gameOver) {
    while (calculatePoints(dealerCards) < 17) {
      dealCard(dealerCards);
    }
    updateGame();
  }
});

// Initialize the game
startGame();
