// Web Audio API programmatically synthesized beautiful, warm, golden chime notifications
// Bypasses network loading errors, file assets and external dependency risks in sandbox environments.

let audioCtx: AudioContext | null = null;

export const initAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch((err) => console.log('Audio context resume failed:', err));
  }
  
  return audioCtx;
};

// Safe gesture binder
if (typeof window !== 'undefined') {
  const resumeAudioOnGesture = () => {
    initAudioContext();
    // Remove listeners once active
    if (audioCtx && audioCtx.state === 'running') {
      window.removeEventListener('click', resumeAudioOnGesture);
      window.removeEventListener('touchstart', resumeAudioOnGesture);
    }
  };
  window.addEventListener('click', resumeAudioOnGesture, { passive: true });
  window.addEventListener('touchstart', resumeAudioOnGesture, { passive: true });
}

export const playNotificationSound = (type: 'new_order' | 'status_update') => {
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    if (type === 'new_order') {
      // Ascending rich warm attention chime: C5 (523Hz) then E5 (659Hz) then G5 (784Hz) then C6 (1046Hz)
      const playTone = (freq: number, startDelay: number, duration: number, volume: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Use 'triangle' wave for high presence/clarity so it is loud and easily heard on phone speakers
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + startDelay);

        gain.gain.setValueAtTime(0, now + startDelay);
        gain.gain.linearRampToValueAtTime(volume, now + startDelay + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startDelay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + startDelay);
        osc.stop(now + startDelay + duration);
      };

      // Play rich loud arpeggio
      playTone(523.25, 0, 0.5, 0.45); // C5
      playTone(659.25, 0.10, 0.5, 0.45); // E5
      playTone(783.99, 0.20, 0.6, 0.45); // G5 
      playTone(1046.50, 0.30, 0.8, 0.35); // C6 (high crisp ring)
    } else {
      // Soft gentle bubble double success chime (F5 (698Hz) then A5 (880Hz))
      const playTone = (freq: number, startDelay: number, duration: number, volume: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // High quality triangle waveform for status update
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + startDelay);

        gain.gain.setValueAtTime(0, now + startDelay);
        gain.gain.linearRampToValueAtTime(volume, now + startDelay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startDelay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + startDelay);
        osc.stop(now + startDelay + duration);
      };

      playTone(698.46, 0, 0.25, 0.30); // F5 (higher volume for responsiveness)
      playTone(880.00, 0.08, 0.35, 0.30); // A5
    }
  } catch (err) {
    console.warn('Notification sound failed or was blocked by browser policies:', err);
  }
};
