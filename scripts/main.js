import { audio } from "./assets.js";
import { SoundManager } from "./soundManager.js";
import { GameState, GameStateManager } from "./gameStateManager.js";
import { GamePlay } from "./gamePlay.js";
import { UIManager } from "./uiManager.js";

export const onWinning = () => {
  GamePlay.stopGame();
  UIManager.announceWinning();
  SoundManager.playFXSoundAndDimMusic(audio.win, audio.background);
  GameStateManager.setState(GameState.WIN_SCREEN);
};

const validateForm = () => {
  const form = $(".needs-validation")[0];
  form.classList.add("was-validated");
  return form.checkValidity();
};

const handleCloseWinModal = () => GameStateManager.setState(GameState.MAIN_SCREEN);
const handlePlayAgain = () => GameStateManager.setState(GameState.PLAYING);
const handlePlayWithNewConfigs = () => GameStateManager.setState(GameState.GAME_CONFIGS);
const handleStartGame = (event) => {
  event.preventDefault();
  if (validateForm()) {
    GameStateManager.setState(GameState.PLAYING);
  } else {
    event.stopPropagation();
  }
};

const buttonHandlers = {
  "start-game-btn": handleStartGame,
  "close-win-modal-btn": handleCloseWinModal,
  "play-win-modal-btn": handlePlayAgain,
  "play-with-new-configs-win-modal-btn": handlePlayWithNewConfigs,
};

$(() => {
  GameStateManager.setState(GameState.MAIN_SCREEN);
  UIManager.configs.reset();

  $(document).on("click", "#show-matches-toggle", () => {
    SoundManager.playFXSound(audio.click);
    const showMatchedPairsMode = GamePlay.toggleShowMatchedPairsMode();
    UIManager.configs.renderMatchedPairsToggle(showMatchedPairsMode);
  });

  $(document).on("click", "#play-btn", () => {
    SoundManager.playFXSound(audio.click);
    SoundManager.playMusic(audio.background);
    GameStateManager.setState(GameState.GAME_CONFIGS);
  });

  $(document).on("click", "#close-configs-btn", () => {
    GameStateManager.setState(GameState.MAIN_SCREEN);
  });

  $(document).on("click", "#music-toggle", () => {
    const isMusicOn = SoundManager.toggleMusic();
    SoundManager.handleMusicStateChange(audio.background);
    UIManager.navbar.renderMusicMode(isMusicOn);
  });

  $(document).on("click", "#sound-toggle", () => {
    const isSoundOn = SoundManager.toggleSound();
    UIManager.navbar.renderSoundMode(isSoundOn);
  });

  $(document).on("click", ".btn", (event) => {
    SoundManager.playFXSound(audio.click);

    const handler = buttonHandlers[event.target.id];
    if (handler) {
      handler(event);
    } else {
      console.warn("Unhandled button click:", event.target.id);
    }
  });
});

audio.background.loop = true;
