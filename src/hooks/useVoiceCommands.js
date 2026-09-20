import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourneyStore } from '../store/journeyStore';

/**
 * Text-To-Speech Synthesis helper
 */
export function speakText(text, onEndCallback) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEndCallback) onEndCallback();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('David'))) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    if (onEndCallback) {
      utterance.onend = onEndCallback;
      utterance.onerror = onEndCallback;
    }
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('TTS Error:', e);
    if (onEndCallback) onEndCallback();
  }
}

/**
 * App-Wide Web Speech API Voice Command Hook.
 * Supports natural speech destination queries, vehicle selection, and camera controls.
 */
export function useVoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const navigate = useNavigate();
  const { setActiveJourney, setRouteType } = useJourneyStore();

  const handleCommandIntent = useCallback((text) => {
    const lower = text.toLowerCase();
    setLastCommand(text);

    // 1. Destination Commands
    if (lower.includes('kandy')) {
      speakText('Understood Master! Generating 3D route trajectory to Kandy Central Hub now.');
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Kandy Central Hub' });
      navigate('/tracking');
    } else if (lower.includes('galle')) {
      speakText('Understood Master! Routing high-speed Maglev to Galle Fort Coast.');
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Galle Fort Coast' });
      navigate('/tracking');
    } else if (lower.includes('jaffna')) {
      speakText('Routing to Jaffna Central Terminal.');
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Jaffna Central Terminal' });
      navigate('/tracking');
    } else if (lower.includes('gampaha')) {
      speakText('Routing to Gampaha Mobility Hub.');
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Gampaha Mobility Hub' });
      navigate('/tracking');
    } else if (lower.includes('negombo')) {
      speakText('Routing to Negombo Coastal Hub.');
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Negombo Coastal Terminal' });
      navigate('/tracking');
    } else if (lower.includes('nuwara') || lower.includes('eliya')) {
      speakText('Routing to Nuwara Eliya Sky Station.');
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Nuwara Eliya Express' });
      navigate('/tracking');
    } 
    // 2. Navigation & View Controls
    else if (lower.includes('start') || lower.includes('3d') || lower.includes('map') || lower.includes('launch') || lower.includes('travel')) {
      speakText('Launching 3D interactive map telemetry.');
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Kandy Central Hub' });
      navigate('/tracking');
    } else if (lower.includes('home') || lower.includes('back')) {
      speakText('Returning to main landing dashboard.');
      navigate('/');
    }
    // 3. Vehicle Selection
    else if (lower.includes('air') || lower.includes('aero') || lower.includes('taxi')) {
      speakText('Selecting AeroLink Air Taxi.');
      setRouteType('aiOptimized');
      navigate('/tracking');
    } else if (lower.includes('maglev') || lower.includes('bullet') || lower.includes('train')) {
      speakText('Selecting high-speed Maglev Express.');
      setRouteType('fastest');
      navigate('/tracking');
    } else if (lower.includes('tram') || lower.includes('eco')) {
      speakText('Selecting Eco Tram.');
      setRouteType('eco');
      navigate('/tracking');
    } else {
      speakText(`Searching transit options for ${text}`);
      setActiveJourney({ from: 'Colombo Fort Station', to: text.toUpperCase() });
      navigate('/tracking');
    }
  }, [navigate, setActiveJourney, setRouteType]);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      handleCommandIntent('kandy');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('Listening... Speak destination e.g. "I want to travel to Kandy"');
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        if (event.results[current].isFinal) {
          handleCommandIntent(text);
        }
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition init failed:', e);
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    lastCommand,
    isSupported,
    toggleListening,
    handleCommandIntent
  };
}

