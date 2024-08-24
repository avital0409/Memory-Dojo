import { images } from "./assets.js";
import {
  isMusicOn,
  isSoundOn,
  toggleMusic,
  toggleSound,
  playFXSound,
  playFXSoundAndDimMusic,
  playMusic,
  pauseMusic,
} from "./sounds.js";

const btnClickSound = new Audio("sounds/mixkit-game-ball-tap-2073.wav");
const matchSound = new Audio("sounds/mixkit-video-game-treasure-2066.wav");
const winSound = new Audio("sounds/mixkit-completion-of-a-level-2063.wav");
const cardFlipSound = new Audio(
  "sounds/420686-Card-Game-Movement-Deal-Single-Whoosh-Light-02.wav"
);
const backgroundMusic = new Audio("sounds/cute-creatures-150622.mp3");

const DEFAULT_CARD_SIZE = 150;
const NAMES = [
  "Knight Titus",
  "Tropical Breeze",
  "Sandy Waves",
  "Sunny Splash",
  "Beach Bliss",
  "Mango Twist",
  "Coral Sunset",
  "Ocean Chill",
  "Pineapple Fizz",
];

let playerName;
let cards;
let revealedCards = 0;
let pairsFound = 0;
let gameTimerIntervalID;
let gameTime;
let cardSize;
let activeGame = false;

const board = $("#board");

const initializeBoard = () => {
  let imagesArr = chooseImages();
  shuffle(imagesArr);
  createCards(imagesArr);
  calculateOptimalCardSize();
  adjustCardSize();
};

const createCards = (chosenImages) => {
  for (let cardId = 1; cardId <= cards; cardId++) {
    let cardScene = $("<div></div>").attr({
      class: "card-placeholder m-0 bg-transparent",
      id: "card-placeholder" + cardId,
    });

    let card = $("<div></div>").attr({
      class: "card w-100 h-100 postion-relative shadow-sm",
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
    board.append(cardScene);
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

  playFXSound(cardFlipSound);

  if ($(clickedCard).attr("class").includes("revealed")) {
    unreveal(clickedCard);
  } else if (revealedCards < 2) {
    reveal(clickedCard);
  }

  if (revealedCards == 2) {
    if (!isAMatch()) {
      setTimeout(() => {
        getRevealedCards().each(function () {
          unreveal($(this));
        });
      }, 500);
    } else {
      if (pairsFound * 2 == cards) setTimeout(onWinning, 500);
    }
  }
};

const chooseImages = () => {
  let imagesLeftToChooseFrom = [...images];
  let imagesChosen = new Array(cards / 2);

  for (let i = 0; i < cards / 2; i++) {
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

const isAMatch = () => {
  let revealedCardEls = getRevealedCards();
  let card1Img = $(revealedCardEls)
    .eq(0)
    .find(".card-front")
    .css("background-image");
  let card2Img = $(revealedCardEls)
    .eq(1)
    .find(".card-front")
    .css("background-image");

  if (card1Img === card2Img) {
    playFXSound(matchSound);
    revealedCards -= 2;
    pairsFound++;
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

const unreveal = (card) => {
  revealedCards--;
  $(card).toggleClass("revealed").css("transform", "rotateY(0deg)");
};

const reveal = (card) => {
  revealedCards++;
  $(card).toggleClass("revealed").css("transform", "rotateY(180deg)");
};

const onWinning = () => {
  activeGame = false;
  stopTimer();
  playFXSoundAndDimMusic(winSound, backgroundMusic);
  confetti({
    particleCount: 150,
    spread: 100,
    origin: {
      y: 0.75,
    },
  });
  setTimeout(showWinDialog);
};

const getRevealedCards = () => {
  return $(".card-placeholder").find(".revealed");
};

const toggleGameElements = () => {
  $("#board").toggleClass("d-none");
  $("#timer").toggleClass("d-none");
};

const showWinDialog = () => {
  const title = `🎉 Congratulations, ${playerName}! 🎉`;
  const subtitle = `You've completed the round in ${gameTime}!`;
  const modal = $("#win-modal");

  modal.find(".modal-title").text(title);
  modal.find(".modal-subtitle").text(subtitle);

  $("#win-modal").modal("show");
  toggleGameElements();
};

const setGameSettings = () => {
  playerName = $("#playerName").val();
  cards = $("#cards").val();
  $("#player").html(playerName);
};

const setGame = () => {
  setGameSettings();
  toggleGameElements();
  revealedCards = 0;
  pairsFound = 0;
  activeGame = true;
  $(".card-placeholder").remove();
  $("#set-game-modal").modal("hide");
  initializeBoard();
  startTimer();
};

const startTimer = () => {
  let timer = 0,
    hours,
    minutes,
    seconds;

  gameTimerIntervalID = setInterval(() => {
    hours = parseInt(timer / 3600, 10);
    minutes = parseInt((timer % 3600) / 60, 10);
    seconds = parseInt(timer % 60, 10);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    gameTime = hours + ":" + minutes + ":" + seconds;
    $("#timer").html(gameTime);

    timer++;
  }, 1000);
};

const stopTimer = () => {
  clearInterval(gameTimerIntervalID);
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
  for (let columns = 1; columns <= cards; columns++) {
    rows = Math.ceil(cards / columns);
    const cardSizeByWidth = boardWidth / columns;
    const cardSizeByHeight = boardHeight / rows;
    const cardSize = Math.min(cardSizeByWidth, cardSizeByHeight);

    if (cardSize * columns <= boardWidth && cardSize * rows <= boardHeight) {
      optimalCardSize = Math.max(optimalCardSize, cardSize);
    }
  }

  cardSize = Math.min(optimalCardSize - 16 - 16 / rows, DEFAULT_CARD_SIZE);
};

window.addEventListener("resize", () => {
  calculateOptimalCardSize();
  adjustCardSize();
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("playerName").value =
    NAMES[Math.floor(Math.random() * NAMES.length)];

  document.getElementById("play-btn").addEventListener("click", () => {
    playFXSound(btnClickSound);
    $("#set-game-modal").modal("show");
    $("#main-screen").toggleClass("d-none");
    playMusic(backgroundMusic);
  });

  document.querySelector("#music-toggle").addEventListener("click", () => {
    toggleMusic();
    const musicToggle = document.querySelector("#music-toggle");
    if (isMusicOn()) {
      musicToggle.innerHTML = "music_note";
      playMusic(backgroundMusic);
    } else {
      musicToggle.innerHTML = "music_off";
      pauseMusic(backgroundMusic);
    }
  });

  document.querySelector("#sound-toggle").addEventListener("click", () => {
    toggleSound();
    const soundToggle = document.querySelector("#sound-toggle");
    if (isSoundOn()) {
      soundToggle.innerHTML = "volume_up";
    } else {
      soundToggle.innerHTML = "volume_off";
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn")) {
      playFXSound(btnClickSound);

      if (event.target.matches("#start-game-btn")) {
        ("use strict");
        const form = document.querySelectorAll(".needs-validation")[0];
        event.preventDefault();
        if (!form.checkValidity()) {
          event.stopPropagation();
        } else {
          setGame();
        }
        form.classList.add("was-validated");
      } else if (event.target.matches("#close-win-modal-btn")) {
        toggleGameElements();
        $("#main-screen").toggleClass("d-none");
      } else if (event.target.matches("#play-win-modal-btn")) {
        toggleGameElements();
        setGame();
      } else if (event.target.matches("#play-with-new-configs-win-modal-btn")) {
        toggleGameElements();
        $("#win-modal").modal("hide");
        $("#set-game-modal").modal("show");
      }
    }
  });

  document
    .getElementById("set-game-modal")
    .addEventListener("hidden.bs.modal", () => {
      if (!activeGame) {
        $("#main-screen").toggleClass("d-none");
      }
    });

  document
    .getElementById("win-modal")
    .addEventListener("hidden.bs.modal", () => {
      if (!activeGame) {
        toggleGameElements();
      }
    });
});

backgroundMusic.loop = true;
