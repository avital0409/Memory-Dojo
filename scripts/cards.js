import { audio } from "./assets.js";
import { SoundManager } from "./soundManager.js";
import { onWinning } from "./main.js";
import { GamePlay } from "./gamePlay.js";
import { UIManager } from "./uiManager.js";

const CARD_ACTIONS = {
  reveal: "reveal",
  unreveal: "unreveal"
};

export const createCards = (chosenImages) => {
  for (let cardId = 1; cardId <= GamePlay.getTotalCards(); cardId++) {
    const card = UIManager.cards.new(cardId, chosenImages);
    UIManager.getBoard().append(card);
    card.click(onCardClick);
  }
};

const onCardClick = (e) => {
  e.stopPropagation();
  SoundManager.playFXSound(audio.flip);

  const clickedCard = UIManager.cards.getPlaceholder(e.target.id);

  if (UIManager.cards.isRevealed(clickedCard)) {
    unreveal(clickedCard);
  } else if (GamePlay.getRevealedCards() < 2) {
    reveal(clickedCard);
  }

  if (GamePlay.getRevealedCards() == 2) {
    if (isAMatch()) {
      handleMatch();
    }
    if (GamePlay.isAllRevealed()) {
      setTimeout(onWinning, 500);
    } else {
      setTimeout(
        () =>
          UIManager.cards.getRevealedCardEls()
            .toArray()
            .forEach((el) => unreveal($(el))),
        500
      );
    }
  }
};

const unreveal = (card) => {
  GamePlay.unrevealCard();
  UIManager.cards.flip(card, CARD_ACTIONS.unreveal);
};

const reveal = (card) => {
  GamePlay.revealCard();
  UIManager.cards.flip(card, CARD_ACTIONS.reveal);
};

const hideMatchedCards = (revealedCardEls) => {
  setTimeout(() => {
    for (let i = 0; i < 2; i++) {
      UIManager.cards.hide(revealedCardEls.eq(i));
    }
  }, 1000);
};

const isAMatch = () => {
  const revealedCardEls = UIManager.cards.getRevealedCardEls();
  const card1Img = UIManager.cards.getImage($(revealedCardEls).eq(0));
  const card2Img = UIManager.cards.getImage($(revealedCardEls).eq(1));
  return card1Img === card2Img;
};

const handleMatch = () => {
  const revealedCardEls = UIManager.cards.getRevealedCardEls();

  SoundManager.playFXSound(audio.match);
  GamePlay.foundPair();
  GamePlay.unrevealPair();

  for (let i = 0; i < 2; i++) {
    revealedCardEls.eq(i).toggleClass("revealed");
  } 

  if (GamePlay.getShowMatchedPairsMode()) {
    for (let i = 0; i < 2; i++) {
      revealedCardEls.eq(i).off("click");
    }
  } else {
    hideMatchedCards(revealedCardEls);
  }
};
