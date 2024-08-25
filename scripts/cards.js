import { audio } from './assets.js';
import { SoundManager } from './soundManager.js';
import { onWinning } from './main.js'
import { GamePlay } from "./gamePlay.js";

export const createCards = (chosenImages) => {
  for (let cardId = 1; cardId <= GamePlay.getTotalCards(); cardId++) {
    let cardScene = $("<div></div>").attr({
      class: "card-placeholder m-0 bg-transparent",
      id: "card-placeholder" + cardId,
    });

    let card = $("<div></div>").attr({
      class: "card w-100 h-100 position-relative shadow-sm",
      id: "card" + cardId,
    });

    let cardFront = $("<div></div>")
      .attr({
        class: "card-front w-100 h-100 bg-white position-absolute rounded",
        id: "card" + cardId + "Front",
      })
      .css("background-image", "url(" + chosenImages[cardId - 1] + ")")
      .css("background-size", "contain");

    let cardBack = $("<div></div>").attr({
      class:
        "card-back w-100 h-100 position-relative border border-white border-4 rounded",
      id: "card" + cardId + "Back",
    });

    let cardBackDrawing = $("<div></div>").attr({
      class:
        "card-back-drawing position-absolute w-75 h-75 rounded-circle top-50 start-50 translate-middle",
      id: "card-back-drawing" + cardId,
    });

    let questionMark = $("<div></div>")
      .attr({
        class:
          "qm position-absolute top-50 start-50 translate-middle text-white comfortaa text-center",
        id: "qm" + cardId,
      })
      .text("?");

    cardBackDrawing.append(questionMark);
    cardBack.append(cardBackDrawing);
    card.append(cardBack);
    card.append(cardFront);
    cardScene.append(card);
    $("#board").append(cardScene);
    card.hover(onCardHover);
    card.click(onCardClick);
  }
};

const onCardHover = (e) => {
  var hoveredCard = $("#" + e.target.id)
    .parentsUntil(".card-placeholder")
    .last();
  $(hoveredCard).css("cursor", "pointer");
};

const onCardClick = (e) => {
  var clickedCard = $("#" + e.target.id)
    .parentsUntil(".card-placeholder")
    .last();

  SoundManager.playFXSound(audio.flip);

  if ($(clickedCard).attr("class").includes("revealed")) {
    unreveal(clickedCard);
  } else if (GamePlay.getRevealedCards() < 2) {
    reveal(clickedCard);
  }

  if (GamePlay.getRevealedCards() == 2) {
    if (!isAMatch()) {
      setTimeout(() => {
        GamePlay.getRevealedCardEls().each(function () {
          unreveal($(this));
        });
      }, 500);
    } else {
      if (GamePlay.isAllRevealed()) {
        setTimeout(onWinning, 500);
      }
    }
  }
};

const unreveal = (card) => {
  GamePlay.unrevealCard();
  $(card).toggleClass("revealed").css("transform", "rotateY(0deg)");
};

const reveal = (card) => {
  GamePlay.revealCard();
  $(card).toggleClass("revealed").css("transform", "rotateY(180deg)");
};

const isAMatch = () => {
  let revealedCardEls = GamePlay.getRevealedCardEls();
  let card1Img = $(revealedCardEls)
    .eq(0)
    .find(".card-front")
    .css("background-image");
  let card2Img = $(revealedCardEls)
    .eq(1)
    .find(".card-front")
    .css("background-image");

  if (card1Img === card2Img) {
    SoundManager.playFXSound(audio.match);
    GamePlay.foundPair();
    GamePlay.unrevealPair();
    for (let i = 0; i < 2; i++) {
      revealedCardEls.eq(i).toggleClass("revealed");
    }

    setTimeout(() => {
      for (let i = 0; i < 2; i++) {
        revealedCardEls.eq(i).css("visibility", "hidden");
      }
    }, 1000);
    return true;
  } else {
    return false;
  }
};