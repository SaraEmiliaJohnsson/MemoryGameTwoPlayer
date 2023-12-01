document.addEventListener("DOMContentLoaded", function () {
	const playerNames = [];
	let currentPlayer = 0;
	let playerScores = [0, 0];
	let isComparing = false;
	let flippedCards = [];
	const flipSound = new Audio("shooting-sound.mp3");
	const matchSound = new Audio("success_bell.mp3");

	const overlayButtons = document.querySelectorAll(".meny");
	const gameBoard = document.querySelector(".main-container");

	gameBoard.style.display = "none";

	//**********************
	// Start meny on an overlay
	overlayButtons.forEach(function (button) {
		button.addEventListener("click", function () {
			const targetOverlayId = button.dataset.target;
			toggleOverlay(targetOverlayId);
		});
	});

	const initialOverlay = document.querySelector(".overlay");
	initialOverlay.style.display = "block";

	function toggleOverlay(targetOverlayId) {
		const overlays = document.querySelectorAll(".overlay");

		overlays.forEach(function (overlay) {
			if (overlay.id === targetOverlayId) {
				overlay.style.display =
					overlay.style.display === "block" ? "none" : "block";
				gameBoard.style.display =
					overlay.style.display === "block" ? "none" : "grid";

				if (overlay.id === "overlay4" && overlay.style.display === "block") {
					displayGameOverMessage(); // Display the game over message
				}
			} else {
				overlay.style.display = "none";
			}
		});
	}

	// Winner message overlay
	function displayGameOverMessage() {
		const winnerMessage = document.getElementById("winner-message");
		const overlayFour = document.getElementById("overlay4");

		if (playerScores[0] > playerScores[1]) {
			winnerMessage.textContent = `${playerNames[0]} är vinnaren!`;
		} else if (playerScores[1] > playerScores[0]) {
			winnerMessage.textContent = `${playerNames[1]} är vinnaren!`;
		} else {
			winnerMessage.textContent = "Det blev oavgjort!";
		}

		// Set the display property explicitly
		overlayFour.style.display = "block";
	}
	// ******************
	// Start two-player game button
	const startTwoPlayerGameButton = document.querySelector(
		".start-game-two-player"
	);

	startTwoPlayerGameButton.addEventListener("click", function () {
		const player1Name = document.getElementById("player1").value;
		const player2Name = document.getElementById("player2").value;

		playerNames.push(player1Name, player2Name);
		localStorage.setItem("playerNames", JSON.stringify(playerNames));

		initializeGame();
	});

	//Function to update the player's turn display
	function updatePlayerTurn() {
		const playersTurnElement = document.querySelector(".players-turn h2");
		playersTurnElement.textContent = `Nu är det din tur, ${playerNames[currentPlayer]}`;
	}

	// Function to start the game
	function initializeGame() {
		currentPlayer = 0;
		const overlayTwo = document.querySelector(".overlay-two");
		overlayTwo.style.display = "none";
		gameBoard.style.display = "grid";
		shuffleCards();
		updatePlayerTurn();
	}

	// Start new match button
	const startNewMatchButton = document.querySelector(".start-new-match");

	startNewMatchButton.addEventListener("click", function () {
		localStorage.removeItem("playerNames");
		location.reload(); // Reload the page
	});

	// Start new match button after someone wins
	const startNewMatchFromWin = document.querySelector(".open-meny");

	startNewMatchFromWin.addEventListener("click", function () {
		localStorage.removeItem("playerNames");
		location.reload();
	});

	// Shuffling the cards
	function shuffleCards() {
		let flipCards = document.querySelectorAll(".flip-card");

		let flipCardsArray = Array.from(flipCards);

		flipCardsArray.sort(() => 0.5 - Math.random());

		let gameContainer = document.querySelector(".game-container");

		flipCardsArray.forEach(function (card) {
			gameContainer.appendChild(card);

			card.addEventListener("click", function () {
				if (
					!isComparing &&
					!card.classList.contains("flipped") &&
					flippedCards.length < 2
				) {
					card.classList.add("flipped");
					flippedCards.push(card);

					if (flippedCards.length === 2) {
						isComparing = true;
						checkForMatch();
						checkGameOver();
					}
				}
			});
		});
	}
	function checkForMatch() {
		let card1 = flippedCards[0];
		let card2 = flippedCards[1];

		if (card1.dataset.name === card2.dataset.name) {
			const eventField = document.querySelector(".event-field");
			eventField.innerHTML += `<p>${playerNames[currentPlayer]} hittade två ${card1.dataset.name}</p>`;
			playerScores[currentPlayer]++;

			// Sound when finding a match
			matchSound.play();
			updateScores();

			isMatch = true;
		} else {
			setTimeout(function () {
				card1.classList.remove("flipped");
				card2.classList.remove("flipped");
				currentPlayer = (currentPlayer + 1) % playerNames.length;
				isComparing = false; // Set isComparing to false before updating the player turn

				// Sound when not finding a match
				flipSound.play();
				updatePlayerTurn();

				isMatch = false;
			}, 850);
		}

		resetFlippedCards();
	}

	// Updating scores
	function updateScores() {
		const scorePlayerOneElement = document.querySelector(".score-player-one");
		const scorePlayerTwoElement = document.querySelector(".score-player-two");

		scorePlayerOneElement.textContent = ` ${playerScores[0]}`;
		scorePlayerTwoElement.textContent = ` ${playerScores[1]}`;

		setTimeout(function () {
			isComparing = false;
			updatePlayerTurn();
		}, 850);
	}

	function resetFlippedCards() {
		flippedCards = [];
	}

	function checkGameOver() {
		console.log("Checking for game over...");
		const totalMatches = document.querySelectorAll(".flip-card").length / 2;
		console.log("Total Matches:", totalMatches);
		console.log("Player Scores:", playerScores);

		if (playerScores[0] + playerScores[1] === totalMatches) {
			console.log("Game over condition met!");
			const winnerMessage = document.getElementById("winner-message");
			const overlayFour = document.getElementById("overlay4");

			if (playerScores[0] > playerScores[1]) {
				winnerMessage.textContent = `${playerNames[0]} är vinnaren!`;
			} else if (playerScores[1] > playerScores[0]) {
				winnerMessage.textContent = `${playerNames[1]} är vinnaren!`;
			} else {
				winnerMessage.textContent = "Det är oavgjort!";
			}

			overlayFour.style.display = "block";
			gameBoard.style.display = "none";
		}
	}

	// Check for game over on each match
	document.querySelectorAll(".flip-card").forEach(function (card) {
		card.addEventListener("click", function () {
			if (flippedCards.length === 2) {
				isComparing = true;
				checkForMatch();
				checkGameOver(); // Check for game over after each match
			}
		});
	});

	// Reset game button
	const resetGame = document.querySelector(".reset-button");
	// Function to reset the game state
	resetGame.addEventListener("click", function () {
		playerScores = [0, 0];
		flippedCards = [];
		currentPlayer = 0;
		resetFlippedState();
		shuffleCards();
		updateScores();

		const eventField = document.querySelector(".event-field");
		eventField.innerHTML = "";
	});

	function resetFlippedState() {
		document.querySelectorAll(".flip-card").forEach(function (card) {
			card.classList.remove("flipped");
		});
	}

	// End game button
	const endGameButton = document.querySelector(".end-game-btn");

	endGameButton.addEventListener("click", function () {
		const gameBoard = document.querySelector(".main-container");
		const overlayFive = document.querySelector(".overlay-five");

		gameBoard.style.display = "none";
		overlayFive.style.display = "block";
	});

	// Start new match button fromend game overlay
	const restartMeny = document.querySelector(".open-meny-from-end-game");

	restartMeny.addEventListener("click", function () {
		localStorage.removeItem("playerNames");
		location.reload();
	});
});
