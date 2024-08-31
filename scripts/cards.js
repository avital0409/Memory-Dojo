import { audio } from "./assets.js";
import { SoundManager } from "./soundManager.js";
import { onWinning } from "./main.js";
import { GamePlay } from "./gamePlay.js";
import { UIManager } from "./uiManager.js";

const CLICK_COOLDOWN = 100;

const CARD_ACTIONS = {
  reveal: "reveal",
  unreveal: "unreveal"
};

let cooldownStartTime;

export const createCards = (chosenImages) => {
  for (let cardId = 1; cardId <= GamePlay.getTotalCards(); cardId++) {
    const card = UIManager.cards.new(cardId, chosenImages);
    UIManager.getBoard().append(card);
    card.find(".card").click(onCardClick);
  }
};

const isInCooldown = () => {
  return performance.now() - cooldownStartTime < CLICK_COOLDOWN;
};

const onCardClick = (e) => {
  if (isInCooldown()) return;

  cooldownStartTime = performance.now();
  e.stopPropagation();
  SoundManager.playFXSound(audio.flip);

  const clickedCard = UIManager.cards.getCard(e.target.id);
  if (UIManager.cards.isRevealed(clickedCard)) {
    unreveal(clickedCard);
  } else if (GamePlay.getRevealedCards() < 2) {
    reveal(clickedCard);
  }

  if (GamePlay.getRevealedCards() == 2) {
    processMatchedPair();
    setTimeout(() => {
      if (GamePlay.isAllRevealed()) {
        onWinning();
      } else {
        unrevealAll();
      }
    }, 500);
  }
};

const unrevealAll = () => {
  UIManager.cards
    .getRevealedCardEls()
    .toArray()
    .forEach((el) => unreveal($(el)));
};

const unreveal = (card) => {
  UIManager.cards.flip(card, CARD_ACTIONS.unreveal);
  GamePlay.unrevealCard();
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

const processMatchedPair = () => {
  if (isAMatch()) {
    const revealedCardEls = UIManager.cards.getRevealedCardEls();

    SoundManager.playFXSound(audio.match);
    GamePlay.foundPair();
    GamePlay.unrevealPair();

    for (let i = 0; i < 2; i++) {
      const cardPlaceholder = revealedCardEls
        .eq(i)
        .closest(".card-placeholder");
      cardPlaceholder.find(".card").off("click");
      cardPlaceholder.removeClass("pointer");
      revealedCardEls.eq(i).removeClass("revealed");
    }

    if (!GamePlay.getShowMatchedPairsMode()) {
      hideMatchedCards(revealedCardEls);
    }
  }
};
