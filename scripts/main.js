import { images } from './assets.js';

const DEFAULT_CARD_SIZE = 150;
const NAMES = ['Knight Titus', ' Tropical Breeze', 'Sandy Waves', 'Sunny Splash', 'Beach Bliss', 'Mango Twist', 'Coral Sunset', 'Ocean Chill', 'Pineapple Fizz'];

let playerName;
let cards;
let revealedCards = 0;
let pairsFound = 0;
let gameTimerIntervalID;
let gameTime;
let cardSize;
let activeGame = false;
let music = true;
const board = $("#board");

const startGame = () => {
	revealedCards = 0;
	pairsFound = 0;
	activeGame = true;
	$(".cards").remove();
	$(".modal").hide();
	initializeBoard();
	startTimer();
}

const initializeBoard = () => {
	let imagesArr = chooseImages();
	shuffle(imagesArr);
	createCards(imagesArr);
	calculateOptimalCardSize();
	adjustCardSize();
}

const createCards = (chosenImages) => {
	for (let cardId = 1; cardId <= cards; cardId++) {
		let cardScene = $("<div></div>").attr({
			"class": "cards m-0",
			"id": "cardScene" + cardId
		});

		let card = $("<div></div>").attr({
			"class": "card w-100 h-100",
			"id": "card" + cardId
		});

		let cardFront = $("<div></div>").attr({
			"class": "card-front",
			"id": "card" + cardId + "Front"
		}).css("background-image", "url(" + chosenImages[cardId-1] + ")")
		.css("background-size", "contain");

		let cardBack = $("<div></div>").attr({
			"class": "card-back position-relative",
			"id": "card" + cardId + "Back"
		});

		let cardBackDrawing = $("<div></div>").attr({
			"class": "card-back-drawing position-absolute top-50 start-50 translate-middle",
			"id": "card-back-drawing" + cardId
		});

		let questionMark = $("<div></div>").attr({
			"class": "qm position-absolute top-50 start-50 translate-middle",
			"id": "qm" + cardId
		}).text("?");

		cardBackDrawing.append(questionMark);
		cardBack.append(cardBackDrawing);
		card.append(cardBack);
		card.append(cardFront);
		cardScene.append(card);
		board.append(cardScene);

		card.hover(onCardHover);
		card.click(onCardClick);
	}
}

const onCardHover = (e) => {
	var hoveredCard = $("#" + e.target.id).parentsUntil(".cards").last();
	$(hoveredCard).css("cursor", "pointer");
}

const onCardClick = (e) => {
	var clickedCard = $("#" + e.target.id).parentsUntil(".cards").last();
	console.log("revealed cards: " + revealedCards);
	// in case the clicked card is already revealed, we need to unreveal it
	if ($(clickedCard).attr("class").includes("revealed")) {
		unreveal(clickedCard);
	} else if (revealedCards < 2) { //the card is not revealed yet, we need to reveal it
		reveal(clickedCard);
	}

	if (revealedCards == 2) {
		if (!isAMatch()) {
			setTimeout(() => {
				getRevealedCards().each(function () {
					unreveal($(this))
				});
			}, 500);
		} else {
			if (pairsFound * 2 == cards)
				setTimeout(onWinning, 500);
		}
  }
}

const chooseImages = () => {
	let imagesLeftToChooseFrom = images.slice();
	let imagesChosen = new Array(cards/2);

	for (let i = 0; i < cards/2; i++) {
		let randomIndex = (Math.floor(Math.random() * imagesLeftToChooseFrom.length));
		imagesChosen[i] = imagesLeftToChooseFrom[randomIndex].slice();
		imagesLeftToChooseFrom.splice(randomIndex, 1);
	}

	console.log("Chosen images for the game!");
	return imagesChosen.concat(imagesChosen);
}

const shuffle = (array)=> {
	let currentIndex = array.length, randomIndex;

	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	console.log("Shuffeled the cards!");

	return array;
}

const isAMatch = () => {
	let revealedCardEls = getRevealedCards();
	let card1Img = $(revealedCardEls).eq(0).find(".card-front").css("background-image");
	let card2Img = $(revealedCardEls).eq(1).find(".card-front").css("background-image");

	if (card1Img === card2Img) {
		revealedCards -= 2;
		pairsFound++;
		console.log("We found a pair!");
		for (let i = 0; i < 2; i++) {
			revealedCardEls.eq(i).toggleClass("revealed");
		}

		setTimeout(() => {
			for (let i = 0; i < 2; i++) {
				revealedCardEls.eq(i).css('visibility', 'hidden');
			}
		}, 1000);
		return true;
	} else {
		return false;
    }
}

const unreveal = (card) => {
	revealedCards--;
	$(card).toggleClass("revealed").css("transform", "rotateY(0deg)");
	console.log("Unrevealed card: " + $(card).attr("id"));
}

const reveal = (card) => {
	revealedCards++;
	$(card).toggleClass("revealed").css("transform", "rotateY(180deg)");
	console.log("Revealed card: " + $(card).attr("id"));
}

const onWinning = () => {
	activeGame = false;
	console.log("We have a winner!");
	confetti({
		particleCount: 150,
		spread: 100,
		origin: {
			y: 0.75
		}
	});
	setTimeout(showWinDialog);
}

const getRevealedCards = () => {
	return $(".cards").find(".revealed");
}

const showWinDialog = () => {
	stopTimer();
	activeGame = false;
	generateWinDialogContent();
	$("#win-modal").modal('show');
	$('#board').toggleClass('d-none');
}

const generateWinDialogContent = () => {
	const title = '🎉 Congratulations, ' + playerName + '! 🎉';
	const subtitle = 'You\'ve completed the round in ' + gameTime + '!'

	const $modal = $('#win-modal');
	$modal.find('.modal-title').text(title);
	$modal.find('.modal-subtitle').text(subtitle);
}

const setGame = () => {
	playerName = $("#playerName").val();
	cards =  $("#cards").val();
	activeGame = true;
	$('#board').toggleClass('d-none');
	$('#welcome-modal').modal('hide');
	$('#player').html(playerName);
	startGame();
}

const startTimer = () => {
	const timerElement = $('#timer');
	let timer = 0, hours, minutes, seconds;
	gameTimerIntervalID = setInterval(() => {
	  hours = parseInt(timer / 3600, 10);
	  minutes = parseInt((timer % 3600) / 60, 10);
	  seconds = parseInt(timer % 60, 10);

	  hours = hours < 10 ? "0" + hours : hours;
	  minutes = minutes < 10 ? "0" + minutes : minutes;
	  seconds = seconds < 10 ? "0" + seconds : seconds;

		gameTime = hours + ":" + minutes + ":" + seconds;
	  timerElement.html(gameTime);

	  timer++;
	}, 1000);
  }

  const stopTimer = () => {
	clearInterval(gameTimerIntervalID);
  }

  const adjustCardSize = () => {
	const cardElements = document.querySelectorAll('.cards');
	const qms = document.querySelectorAll(".qm");

    cardElements.forEach(card => {
		card.style.setProperty('width', `${cardSize}px`, 'important');
		card.style.setProperty('height', `${cardSize}px`, 'important');
	  });

	  qms.forEach(qm => {
		qm.style.setProperty('font-size', `${cardSize * 0.6}px`);
		qm.style.setProperty('line-height', `${cardSize * 0.6 * 1.11}px`);
		qm.style.setProperty('height', `${cardSize * 0.6}px`);
	  });
	  console.log("Adjusted card size!");
	
  }

const calculateOptimalCardSize = () => {
	const boardElement = document.getElementById('board');
	const boardHeight = boardElement.clientHeight;
	const boardWidth = boardElement.clientWidth;

    let optimalCardSize = 0;
	let rows;
    for (let columns = 1; columns <= cards; columns++) {
        rows = Math.ceil(cards / columns);
        const cardSizeByWidth = boardWidth / columns;
        const cardSizeByHeight = boardHeight / rows;
        const cardSize = Math.min(cardSizeByWidth, cardSizeByHeight);

        if (cardSize * columns <= boardWidth && cardSize * rows <= boardHeight) {
            optimalCardSize = Math.max(optimalCardSize, cardSize);
        }
    }
	console.log("Found the optimal card size!");

    cardSize = Math.min(optimalCardSize - 16 - (16/rows), DEFAULT_CARD_SIZE);
}

window.addEventListener('resize', () => {
	calculateOptimalCardSize();
	adjustCardSize();
});

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('playerName').value = NAMES[Math.floor(Math.random() * NAMES.length)];
	document.getElementById('start').addEventListener('click', () => {
		$('#welcome-modal').modal('show');
		$('#start').toggleClass('d-none');
	});
	document.querySelector('#btn-start-game').addEventListener('click', (event) => {
		'use strict'

		var form = document.querySelectorAll('.needs-validation')[0];
		event.preventDefault();
		if (!form.checkValidity()) {
			event.stopPropagation()
		} else {
			setGame();
		}

		form.classList.add('was-validated')
	});

	document.querySelector('#btn-close-modal').addEventListener('click', () => {
		$('#start').toggleClass('d-none');
		$('#board').toggleClass('d-none');
	});
	document.querySelector('#btn-next-game').addEventListener('click', () => {
		$('#board').toggleClass('d-none');
		setGame();
	});
	document.querySelector('#btn-next-game-configs').addEventListener('click', () =>	{
		$('#board').toggleClass('d-none');
		$("#win-modal").hide();
		$('#welcome-modal').modal('show');
	});
	document.querySelector('#music-toggle').addEventListener('click', () => {
		music = !music;
		const musicToggle = document.querySelector('#music-toggle');
		const backgroundSound = document.getElementById('background-sound');
		if (music) {
			musicToggle.innerHTML = 'music_note';
			backgroundSound.play();
		} else {
			musicToggle.innerHTML = 'music_off';
			backgroundSound.pause();
		}
	});

	document.getElementById('welcome-modal').addEventListener('hidden.bs.modal', () => {
			if (!activeGame) {
				$('#start').toggleClass('d-none');
			}
	});

	document.getElementById('win-modal').addEventListener('hidden.bs.modal', () => {
		if (!activeGame) {
			$('#board').toggleClass('d-none');
		}
});

});