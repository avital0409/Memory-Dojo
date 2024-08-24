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

export const isMusicOn = () => music;
export const isSoundOn = () => sound;
export const toggleMusic = () => {
  music = !music;
};
export const toggleSound = () => {
  sound = !sound;
};
export const playFXSound = (audio) => {
  if (isSoundOn()) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }
};
export const playFXSoundAndDimMusic = (soundAudio, musicAudio) => {
  if (isSoundOn()) {
    if (isMusicOn()) {
      musicAudio.volume = 0.5;
    }
    soundAudio.play();
  }
  soundAudio.addEventListener('ended', () => {
    fadeInSound(musicAudio, 1000);
  });
};
export const playMusic = (audio) => {
  if (isMusicOn() && audio.paused) {
    audio.play();
  }
};
export const pauseMusic = (audio) => {
  audio.pause();
};
