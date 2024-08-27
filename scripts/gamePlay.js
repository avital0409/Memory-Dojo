import { initializeBoard } from "./board.js";
import { UIManager } from "./uiManager.js";

export const GamePlay = (() => {
  let totalCards;
  let revealedCards;
  let pairsFound;
  let playerName;
  let gameTimerIntervalID;
  let gameDuration;
  let showMatchedPairsMode = false;

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

      gameDuration = hours + ":" + minutes + ":" + seconds;
      UIManager.navbar.updateGameTime(gameDuration);

      timer++;
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(gameTimerIntervalID);
  };

  const resetGameVariables = () => {
    const configs = UIManager.configs.getConfigs();
    playerName = configs.playerName;
    totalCards = configs.totalCards;
    revealedCards = 0;
    pairsFound = 0;
    gameTimerIntervalID = null;
    gameDuration = "";
  };

  return {
    setTotalCards: (cards) => (totalCards = cards),
    getTotalCards: () => totalCards,
    revealCard: () => revealedCards++,
    unrevealCard: () => revealedCards--,
    unrevealPair: () => (revealedCards -= 2),
    getRevealedCards: () => revealedCards,
    foundPair: () => pairsFound++,
    getPairsFound: () => pairsFound,
    setPlayerName: (name) => (playerName = name),
    getPlayerName: () => playerName,
    setGameTimer: (intervalID) => (gameTimerIntervalID = intervalID),
    getGameTimer: () => gameTimerIntervalID,
    setGameDuration: (duration) => (gameDuration = duration),
    getGameDuration: () => gameDuration,
    isAllRevealed: () => pairsFound * 2 == totalCards,
    toggleShowMatchedPairsMode: () => {
      showMatchedPairsMode = !showMatchedPairsMode;
      return showMatchedPairsMode;
    },
    getShowMatchedPairsMode: () => showMatchedPairsMode,
    setNewGame: () => {
      resetGameVariables();
      UIManager.navbar.renderPlayerName(playerName);
      initializeBoard();
      startTimer();
    },
    stopGame: () => stopTimer()
  };
})();
