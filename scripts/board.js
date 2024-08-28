import { createCards } from './cards.js'
import { images } from "./assets.js";
import { GamePlay } from "./gamePlay.js";
import { UIManager } from './uiManager.js';

const DEFAULT_CARD_SIZE = 150;

let cardSize;
export let chosenImages;

export const initializeBoard = () => {
  UIManager.cards.removeAll();
  chosenImages = chooseImages();
  shuffle(chosenImages);
  createCards(chosenImages);
  calculateOptimalCardSize();
  adjustCardSize();
};

const chooseImages = () => {
  const imagesLeftToChooseFrom = [...images];
  const imagesChosen = new Array(GamePlay.getTotalCards() / 2);

  for (let i = 0; i < GamePlay.getTotalCards() / 2; i++) {
    const randomIndex = Math.floor(Math.random() * imagesLeftToChooseFrom.length);
    imagesChosen[i] = imagesLeftToChooseFrom[randomIndex].slice();
    imagesLeftToChooseFrom.splice(randomIndex, 1);
  }

  return imagesChosen.concat(imagesChosen);
};

const shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const adjustCardSize = () => {
  const cardElements = UIManager.cards.getAll();
  const qms = UIManager.cards.getAllQMs();

  cardElements.each((index, card) => {
    $(card).css({
      width: `${cardSize / 16}rem`,
      height: `${cardSize / 16}rem`
    });
  });

  qms.each((index, qm) => {
    $(qm).css({
      "font-size": `${(cardSize * 0.6) / 16}rem`,
      "line-height": `${(cardSize * 0.6 * 1.11) / 16}rem`,
      height: `${(cardSize * 0.6) / 16}rem`
    });
  });
};

const calculateOptimalCardSize = () => {
  const boardElement = UIManager.getBoard()[0];
  const boardHeight = boardElement.clientHeight;
  const boardWidth = boardElement.clientWidth;
  const totalCards = GamePlay.getTotalCards();

  let optimalCardSize = 0;
  let rows;

  for (let columns = 1; columns <= totalCards; columns++) {
    rows = Math.ceil(totalCards / columns);
    const cardSizeByWidth = boardWidth / columns;
    const cardSizeByHeight = boardHeight / rows;
    const cardSize = Math.min(cardSizeByWidth, cardSizeByHeight);

    if (cardSize * columns <= boardWidth && cardSize * rows <= boardHeight) {
      optimalCardSize = Math.max(optimalCardSize, cardSize);
    }
  }

  cardSize = Math.min(optimalCardSize - 16 - 16 / rows, DEFAULT_CARD_SIZE);
};

$(window).on("resize", () => {
  calculateOptimalCardSize();
  adjustCardSize();
});