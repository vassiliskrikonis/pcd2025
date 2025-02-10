import { useState, useEffect, useCallback, useRef } from 'react';

// Create a single shared AudioContext instance
let sharedAudioContext: AudioContext | null = null;

function getAudioContext() {
  if (!sharedAudioContext) {
    sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return sharedAudioContext;
}

function createMysteriousSound(pitch = 1) {
  try {
    const audioContext = getAudioContext();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Reset audio context if it's in a closed state
    if (audioContext.state === 'closed') {
      sharedAudioContext = null;
      return Promise.resolve();
    }
    
    const osc = audioContext.createOscillator();
    const subOsc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const subGainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    osc.connect(filterNode);
    subOsc.connect(subGainNode);
    filterNode.connect(gainNode);
    subGainNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    filterNode.type = 'bandpass';
    filterNode.Q.value = 3;
    
    osc.type = 'sawtooth';
    subOsc.type = 'sine';
    gainNode.gain.value = 0;
    subGainNode.gain.value = 0.2;

    osc.start();
    subOsc.start();
    
    const startTime = audioContext.currentTime;
    const syllableDuration = 0.03;
    
    const baseFreq = (120 + Math.random() * 40) * pitch;
    osc.frequency.setValueAtTime(baseFreq, startTime);
    subOsc.frequency.setValueAtTime(baseFreq / 2, startTime);
    
    filterNode.frequency.setValueAtTime(baseFreq * 2, startTime);
    filterNode.frequency.linearRampToValueAtTime(baseFreq * 1.5, startTime + syllableDuration * 0.8);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, startTime + syllableDuration);
    
    // Clean up nodes after they're done
    const cleanup = () => {
      try {
        osc.stop();
        subOsc.stop();
        osc.disconnect();
        subOsc.disconnect();
        gainNode.disconnect();
        subGainNode.disconnect();
        filterNode.disconnect();
      } catch (e) {
        console.warn('Audio cleanup error:', e);
      }
    };

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        cleanup();
        resolve();
      }, (syllableDuration * 1000) + 100);
    });
  } catch (e) {
    console.warn('Audio creation error:', e);
    return Promise.resolve();
  }
}

interface StreamingTextProps {
  text: string;
  speed?: number;
}

const StreamingText = ({ text, speed = 50 }: StreamingTextProps) => {
  const [index, setIndex] = useState(0);
  const lastCharRef = useRef('');
  const isPlayingRef = useRef(false);

  useEffect(() => {
    setIndex(0);
    lastCharRef.current = '';
    // Clean up audio context when component unmounts
    return () => {
      if (sharedAudioContext) {
        sharedAudioContext.close();
        sharedAudioContext = null;
      }
    };
  }, [text]);

  const playCharacterSound = useCallback(async (char: string) => {
    if (char === ' ' || char === '\n' || isPlayingRef.current) return;
    
    isPlayingRef.current = true;
    const charCode = char.charCodeAt(0);
    const pitch = 0.8 + (charCode % 10) * 0.04;
    
    await createMysteriousSound(pitch);
    isPlayingRef.current = false;
  }, []);

  useEffect(() => {
    if (index < text.length) {
      const currentChar = text[index];
      if (currentChar !== lastCharRef.current) {
        lastCharRef.current = currentChar;
        playCharacterSound(currentChar);
      }
      
      const timer = setTimeout(() => {
        setIndex(i => i + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    }
  }, [index, speed, text, playCharacterSound]);

  return <span>{text.substring(0, index)}</span>;
};

export default StreamingText;