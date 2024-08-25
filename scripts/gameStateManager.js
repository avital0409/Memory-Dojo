import { GamePlay } from "./gamePlay.js";

export const GameState = {
  MAIN_SCREEN: "MAIN_SCREEN",
  PLAYING: "PLAYING",
  GAME_CONFIGS: "GAME_CONFIGS",
  WIN_SCREEN: "WIN_SCREEN",
};

const setGameModal = $("#set-game-modal");
const winModal = $("#win-modal");
const mainScreen = $("#main-screen");

export const GameStateManager = (() => {
  let currentState = GameState.MAIN_SCREEN;

  const renderState = () => {
    $("#main-screen, #board, #timer").addClass("d-none");
    setGameModal.modal("hide");
    winModal.modal("hide");

    switch (currentState) {
      case GameState.MAIN_SCREEN:
        mainScreen.removeClass("d-none");
        break;

      case GameState.PLAYING:
        $("#board, #timer").removeClass("d-none");
        GamePlay.setNewGame();
        break;

      case GameState.GAME_CONFIGS:
        setGameModal.modal("show");
        break;

      case GameState.WIN_SCREEN:
        winModal.modal("show");
        break;

      default:
        console.error("Unknown game state:", currentState);
    }
  };

  return {
    setState: (newState) => {
      currentState = newState;
      renderState();
    },
    getState: () => currentState,
  };
})();
