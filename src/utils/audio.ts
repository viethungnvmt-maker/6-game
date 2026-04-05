const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playTone = (freq: number, duration: number, type: OscillatorType = 'sine') => {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export const playCorrectSound = () => {
  playTone(523.25, 0.1, 'sine'); // C5
  setTimeout(() => playTone(659.25, 0.2, 'sine'), 100); // E5
};

export const playWrongSound = () => {
  playTone(220, 0.3, 'sawtooth'); // A3 low
};
