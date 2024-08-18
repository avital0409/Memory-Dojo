import { images } from './assets.js';

const DEFAULT_CARD_SIZE = 150;

let playerName;
let cards;
let revealedCards = 0;
let pairsFound = 0;
let intervalHandler;
let intervalId;
let cardSize;

const startGame = (e) => {
	if (e != null) {
		$(".cards").remove();
		$(".modal").hide();
	}
	revealedCards = 0;
	pairsFound = 0;
	initializeBoard();
	intervalHandler = setInterval(intervalsHandler, 2000);
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
	const board = $("#board");

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

	// in case the clicked card is already revealed, we need to unreveal it
	if ($(clickedCard).attr("class").includes("revealed")) {
		unreveal(clickedCard);
	} else { //the card is not revealed yet, we need to reveal it
		reveal(clickedCard);
	}

	if (revealedCards == 2) {
		if (!isAMatch()) {
			let revealedCardEls = getRevealedCards();
			setTimeout(function () {
				unreveal($(revealedCardEls).eq(0));
				unreveal($(revealedCardEls).eq(1));
			}, 500);
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

		setTimeout(function () {
			for (let i = 0; i < 2; i++) {
				revealedCardEls.eq(i).css('visibility', 'hidden');
			}
			if (pairsFound * 2 == cards)
				setTimeout(onWinning, 500);
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
	clearInterval(intervalHandler);
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

const intervalsHandler = () => {
	let revealedCardEls = getRevealedCards();
	if (revealedCardEls.length != revealedCards) {
		revealedCards = revealedCardEls.length;
		if (revealedCards == 2) {
			if (!isAMatch()) {
				setTimeout(function () {
					unreveal($(revealedCardEls).eq(0));
					unreveal($(revealedCardEls).eq(1));
				}, 500);
			}
		}

	}
}

const getRevealedCards = () => {
	return $(".cards").find(".revealed");
}

const showWinDialog = () => {
	$(".modal").toggle();
	stopTimer();
}

const setGame = () => {
	playerName = $("#playerName").val();
	cards =  $("#cards").val();
	$('#welcome-modal').modal('hide');
	$('#player').html(playerName);
	startGame();
}

const startTimer = () => {
	const timerElement = $('#timer');
	let timer = 0, hours, minutes, seconds;
	intervalId = setInterval(() => {
	  hours = parseInt(timer / 3600, 10);
	  minutes = parseInt((timer % 3600) / 60, 10);
	  seconds = parseInt(timer % 60, 10);

	  hours = hours < 10 ? "0" + hours : hours;
	  minutes = minutes < 10 ? "0" + minutes : minutes;
	  seconds = seconds < 10 ? "0" + seconds : seconds;

	  timerElement.html(hours + ":" + minutes + ":" + seconds);

	  timer++;
	}, 1000);
  }

  const stopTimer = () => {
	clearInterval(intervalId);
  }

  const adjustCardSize = () => {
	const cardElements = document.querySelectorAll('.cards');
	const qms = document.querySelectorAll(".qm");

    cardElements.forEach(card => {
		card.style.setProperty('width', `${cardSize}px`, 'important');
		card.style.setProperty('height', `${cardSize}px`, 'important'); // Maintain aspect ratio, for example 4:3
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
    // Iterate over possible numbers of columns (from 1 up to n)
    for (let columns = 1; columns <= cards; columns++) {
        rows = Math.ceil(cards / columns); // Calculate the corresponding number of rows

        // Calculate the size of each card for this configuration
        const cardSizeByWidth = boardWidth / columns;
        const cardSizeByHeight = boardHeight / rows;

        // The card size is the minimum of these two dimensions
        const cardSize = Math.min(cardSizeByWidth, cardSizeByHeight);

        // Check if this configuration is better than the previous best
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
	const button = document.querySelector('.btn');
	button.addEventListener('click', setGame);
});