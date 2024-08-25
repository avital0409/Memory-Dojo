import { audio } from "./assets.js";
import { SoundManager } from "./soundManager.js"
import { GameState, GameStateManager } from "./gameStateManager.js";
import { GamePlay } from "./gamePlay.js";

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

export const onWinning = () => {
  GamePlay.endGame();
  SoundManager.playFXSoundAndDimMusic(audio.win, audio.background);
  confetti({
    particleCount: 150,
    spread: 100,
    origin: {
      y: 0.75,
    },
  });
  setTimeout(showWinDialog);
};

const showWinDialog = () => {
  const winModal = $("#win-modal");
  const title = `🎉 Congratulations, ${GamePlay.getPlayerName()}! 🎉`;
  const subtitle = `You've completed the round in ${GamePlay.getGameDuration()}!`;

  winModal.find(".modal-title").text(title);
  winModal.find(".modal-subtitle").text(subtitle);

  GameStateManager.setState(GameState.WIN_SCREEN);
};

$(() => {
  GameStateManager.setState(GameState.MAIN_SCREEN);

  document.getElementById("playerName").value =
    NAME_SUGGESTIONS[Math.floor(Math.random() * NAME_SUGGESTIONS.length)];

  $(document).on("click", "#play-btn", () => {
    SoundManager.playFXSound(audio.click);
    SoundManager.playMusic(audio.background);
    GameStateManager.setState(GameState.GAME_CONFIGS);
  });

  $(document).on("click", "#close-configs-btn", () => {
    GameStateManager.setState(GameState.MAIN_SCREEN);
  });

  $(document).on("click", "#music-toggle", () => {
    SoundManager.toggleMusic();
    const musicToggle = document.querySelector("#music-toggle");
    if (SoundManager.isMusicOn()) {
      musicToggle.innerHTML = "music_note";
      SoundManager.playMusic(audio.background);
    } else {
      musicToggle.innerHTML = "music_off";
      SoundManager.pauseMusic(audio.background);
    }
  });

  $(document).on("click", "#sound-toggle", () => {
    SoundManager.toggleSound();
    const soundToggle = document.querySelector("#sound-toggle");
    if (SoundManager.isSoundOn()) {
      soundToggle.innerHTML = "volume_up";
    } else {
      soundToggle.innerHTML = "volume_off";
    }
  });

  $(document).on("click", ".btn", (event) => {
    SoundManager.playFXSound(audio.click);

    switch (event.target.id) {
      case "start-game-btn": {
        ("use strict");
        const form = document.querySelectorAll(".needs-validation")[0];
        event.preventDefault();
        if (!form.checkValidity()) {
          event.stopPropagation();
        } else {
          GameStateManager.setState(GameState.PLAYING);
        }
        form.classList.add("was-validated");
        break;
      }
      case "close-win-modal-btn": {
        GameStateManager.setState(GameState.MAIN_SCREEN);
        break;
      }
      case "play-win-modal-btn": {
        GameStateManager.setState(GameState.PLAYING);
        break;
      }
      case "play-with-new-configs-win-modal-btn": {
        GameStateManager.setState(GameState.GAME_CONFIGS);
        break;
      }
      default:
        break;
    }
  });
});

audio.background.loop = true;
