import { GamePlay } from "./gamePlay.js";
import { chosenImages } from "./board.js";

export const UIManager = (() => {
  const UI = {
    board: $("#board"),
    winModal: $("#win-modal"),
    configs: {
      playerName: $("#playerName"),
      totalCards: $("#cards"),
    },
    showMatchesToggle: {
      icon: $("#show-matches-icon"),
      label: $("#show-matches-text"),
    },
    navbar: {
      player: $("#player"),
      music: $("#music-toggle"),
      sound: $("#sound-toggle"),
      timer: $("#timer"),
    },
  };

  const NAME_SUGGESTIONS = [
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

  const MATCHED_PAIRS = {
    show: {
      icon: "visibility",
      label: "Keep Showing Matched Pairs",
    },
    hide: {
      icon: "visibility_off",
      label: "Hide Matched Pairs",
    },
  };

  const AUDIO_ICONS = {
    sound: {
      on: "volume_up",
      off: "volume_off",
    },
    music: {
      on: "music_note",
      off: "music_off",
    },
  };

  const CARD_FLIP_DIRECTION = {
    reveal: "rotateY(180deg)",
    unreveal: "rotateY(0deg)",
  };

  const createNewElement = (classes, id) =>
    $("<div></div>").addClass(classes).attr("id", id);

  const newCardPlaceholder = (cardId) =>
    createNewElement(
      "card-placeholder m-0 bg-transparent pointer",
      `card-placeholder${cardId}`
    );
  const newCard = (cardId) =>
    createNewElement(
      "card w-100 h-100 position-relative shadow-sm",
      `card${cardId}`
    );
  const newCardFront = (cardId) =>
    createNewElement(
      "card card-front w-100 h-100 bg-white position-absolute rounded",
      `card-front${cardId}`
    )
      .css("background-image", `url(${chosenImages[cardId - 1]})`)
      .css("background-size", "contain");

  const newCardBack = (cardId) =>
    createNewElement(
      "card-back w-100 h-100 position-relative border border-white border-4 rounded",
      `card-back${cardId}`
    );

  const newCardBackDrawing = (cardId) =>
    createNewElement(
      "card-back-drawing position-absolute w-75 h-75 rounded-circle top-50 start-50 translate-middle",
      `card-back-drawing${cardId}`
    );

  const newQuestionMark = (cardId) =>
    createNewElement(
      "qm position-absolute top-50 start-50 translate-middle text-white comfortaa text-center",
      `qm${cardId}`
    ).text("?");

  const showWinDialog = () => {
    const title = `🎉 Congratulations, ${GamePlay.getPlayerName()}! 🎉`;
    const subtitle = `You've completed the round in ${GamePlay.getGameDuration()}!`;

    UI.winModal.find(".modal-title").text(title);
    UI.winModal.find(".modal-subtitle").text(subtitle);
  };

  return {
    announceWinning: () => {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: {
          y: 0.75,
        },
      });
      setTimeout(showWinDialog);
    },
    configs: {
      reset: () => {
        UI.configs.playerName.val(
          NAME_SUGGESTIONS[Math.floor(Math.random() * NAME_SUGGESTIONS.length)]
        );
        UIManager.configs.renderMatchedPairsToggle(false);
      },
      renderMatchedPairsToggle: (showMatchedPairsMode) => {
        const matchedPairSettings = showMatchedPairsMode
          ? MATCHED_PAIRS.show
          : MATCHED_PAIRS.hide;
        UI.showMatchesToggle.icon.text(matchedPairSettings.icon);
        UI.showMatchesToggle.label.text(matchedPairSettings.label);
      },
      getConfigs: () => {
        return {
          playerName: UI.configs.playerName.val(),
          totalCards: UI.configs.totalCards.val(),
        };
      },
    },
    navbar: {
      renderMusicMode: (isMusicOn) =>
        UI.navbar.music.text(
          isMusicOn ? AUDIO_ICONS.music.on : AUDIO_ICONS.music.off
        ),
      renderSoundMode: (isSoundOn) =>
        UI.navbar.sound.text(
          isSoundOn ? AUDIO_ICONS.sound.on : AUDIO_ICONS.sound.off
        ),
      renderPlayerName: (playerName) => UI.navbar.player.text(playerName),
      updateGameTime: (gameDuration) => UI.navbar.timer.text(gameDuration),
    },
    cards: {
      isRevealed: (card) => $(card).hasClass("revealed"),
      flip: (card, action) =>
        $(card)
          .toggleClass("revealed")
          .css("transform", CARD_FLIP_DIRECTION[action]),
      hide: (card) => $(card).addClass("invisible"),
      getImage: (card) => $(card).find(".card-front").css("background-image"),
      getPlaceholder: (id) =>
        $(`#${id}`).parentsUntil(".card-placeholder").last(),
      getRevealedCardEls: () => $(".card-placeholder").find(".revealed"),
      getAll: () => $(".card-placeholder"),
      removeAll: () => $(".card-placeholder").remove(),
      getAllQMs: () => $(".qm"),
      new: (cardId, chosenImages) => {
        const cardPlaceholder = newCardPlaceholder(cardId);
        const card = newCard(cardId);
        const cardFront = newCardFront(cardId, chosenImages);
        const cardBack = newCardBack(cardId);
        const cardBackDrawing = newCardBackDrawing(cardId);
        const questionMark = newQuestionMark(cardId);

        cardBackDrawing.append(questionMark);
        cardBack.append(cardBackDrawing);
        card.append(cardBack);
        card.append(cardFront);
        cardPlaceholder.append(card);
        return cardPlaceholder;
      },
    },
    getBoard: () => UI.board,
  };
})();
