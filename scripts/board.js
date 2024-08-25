import { createCards } from './cards.js'
import { images } from "./assets.js";
import { GamePlay } from "./gamePlay.js";

const DEFAULT_CARD_SIZE = 150;

let cardSize;

export const initializeBoard = () => {
  $(".card-placeholder").remove();
  let imagesArr = chooseImages();
  shuffle(imagesArr);
  createCards(imagesArr);
  calculateOptimalCardSize();
  adjustCardSize();
};

const chooseImages = () => {
  let imagesLeftToChooseFrom = [...images];
  let imagesChosen = new Array(GamePlay.getTotalCards() / 2);

  for (let i = 0; i < GamePlay.getTotalCards() / 2; i++) {
    let randomIndex = Math.floor(Math.random() * imagesLeftToChooseFrom.length);
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
  const cardElements = document.querySelectorAll(".card-placeholder");
  const qms = document.querySelectorAll(".qm");

  cardElements.forEach((card) => {
    card.style.setProperty("width", `${cardSize / 16}rem`, "important");
    card.style.setProperty("height", `${cardSize / 16}rem`, "important");
  });

  qms.forEach((qm) => {
    qm.style.setProperty("font-size", `${(cardSize * 0.6) / 16}rem`);
    qm.style.setProperty("line-height", `${(cardSize * 0.6 * 1.11) / 16}rem`);
    qm.style.setProperty("height", `${(cardSize * 0.6) / 16}rem`);
  });
};

const calculateOptimalCardSize = () => {
  const boardElement = document.getElementById("board");
  const boardHeight = boardElement.clientHeight;
  const boardWidth = boardElement.clientWidth;

  let optimalCardSize = 0;
  let rows;
  for (let columns = 1; columns <= GamePlay.getTotalCards(); columns++) {
    rows = Math.ceil(GamePlay.getTotalCards() / columns);
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