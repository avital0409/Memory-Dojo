export const SoundManager = (() => {
  let music = true;
  let sound = true;

  const fadeInSound = (audio, duration) => {
    const step = 0.01;
    const interval = duration / (1 / step);
    const fadeInInterval = setInterval(() => {
      if (audio.volume < 1.0) {
        audio.volume = Math.min(audio.volume + step, 1.0);
      } else {
        clearInterval(fadeInInterval);
      }
    }, interval);
    audio.play();
  };

  return {
    isMusicOn: () => music,
    isSoundOn: () => sound,
    toggleMusic: () => {
      music = !music;
      return music;
    },
    toggleSound: () => {
      sound = !sound;
      return sound;
    },
    handleMusicStateChange: (audio) => {
      const musicAction = music ? "playMusic" : "pauseMusic";
      SoundManager[musicAction](audio);
    },
    playFXSound: (audio) => {
      if (sound) {
        audio.pause();
        audio.currentTime = 0;
        audio.play();
      }
    },
    playFXSoundAndDimMusic: (soundAudio, musicAudio) => {
      if (sound) {
        if (music) {
          musicAudio.volume = 0.5;
        }
        soundAudio.play();
      }
      soundAudio.addEventListener("ended", () => {
        if (music) {
          fadeInSound(musicAudio, 1000);
        }
      });
    },
    playMusic: (audio) => {
      if (music && audio.paused) {
        audio.play();
      }
    },
    pauseMusic: (audio) => audio.pause(),
  };
})();
