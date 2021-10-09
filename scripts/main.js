
var images = [
	"images/cards/Watermelon.png",
	"images/cards/Starfish.png",
	"images/cards/Galgal.png",
	"images/cards/Tree.png",
	"images/cards/Flamingo.png",
	"images/cards/Map.png",
	"images/cards/Leaf.png",
	"images/cards/Snapirim.png",
	"images/cards/Flower.png",
	"images/cards/FlipFlops.png",
	"images/cards/Sunglasses.png",
];

let cards = 4 * 2;
let revealedCards = 0;
let pairsFound = 0;
let intervalHandler;

$(function () {
	startGame();
});

function startGame(e) {
	if (e != null) {
		$(".cards").remove();
		$(".modal").hide();
	}
	revealedCards = 0;
	pairsFound = 0;
	initializeBoard();
	intervalHandler = setInterval(intervalsHandler, 2000);
}

function initializeBoard() {
	let board = $("#board");
	let imagesArr = chooseImages();
	shuffle(imagesArr);

	for (cardId = 1; cardId <= cards; cardId++) {
		let cardScene = $("<div></div>").attr({
			"class": "cards",
			"id": "cardScene" + cardId
		});

		let card = $("<div></div>").attr({
			"class": "card",
			"id": "card" + cardId
		});

		let cardFront = $("<div></div>").attr({
			"class": "card-front",
			"id": "card" + cardId + "Front"
		}).css("background-image", "url(" + imagesArr[cardId-1] + ")");

		let cardBack = $("<div></div>").attr({
			"class": "card-back",
			"id": "card" + cardId + "Back"
		});

		let cardBackDrawing = $("<div></div>").attr({
			"class": "card-back-drawing",
			"id": "card-back-drawing" + cardId
		});

		let questionMark = $("<div></div>").attr({
			"class": "qm",
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

function onCardHover(e) {
	var hoveredCard = $("#" + e.target.id).parentsUntil(".cards").last();
	$(hoveredCard).css("cursor", "pointer");
}

function onCardClick(e) {
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

function chooseImages() {
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

function shuffle(array) {
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

function isAMatch() {
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
				revealedCardEls.eq(i).hide();
			}
			if (pairsFound * 2 == cards)
				setTimeout(onWinning, 500);
		}, 1000);
		return true;
	} else {
		return false;
    }
}

function unreveal(card) {
	revealedCards--;
	$(card).toggleClass("revealed").css("transform", "rotateY(0deg)");
	console.log("Unrevealed card: " + $(card).attr("id"));
}

function reveal(card) {
	revealedCards++;
	$(card).toggleClass("revealed").css("transform", "rotateY(180deg)");
	console.log("Revealed card: " + $(card).attr("id"));
}

function onWinning() {
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

function intervalsHandler() {
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

function getRevealedCards() {
	return $(".cards").find(".revealed");
}

function showWinDialog() {
	$(".modal").toggle();
}