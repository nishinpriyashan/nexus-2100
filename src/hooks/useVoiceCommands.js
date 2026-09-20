import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourneyStore } from '../store/journeyStore';
import { queryGeminiAI } from '../utils/geminiApi';

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
 * App-Wide Web Speech API Voice Command Hook powered by Google Gemini AI.
 */
export function useVoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const navigate = useNavigate();
  const { setActiveJourney, setRouteType } = useJourneyStore();

  const handleCommandIntent = useCallback(async (text) => {
    const lower = text.toLowerCase();
    setLastCommand(text);
    setIsAiThinking(true);

    // Get real-time AI response from Google Gemini API
    const geminiReply = await queryGeminiAI(text);
    setIsAiThinking(false);

    // Speak Gemini's real-time response out loud
    if (geminiReply) {
      speakText(geminiReply);
    }

    // Process destination intent
    if (lower.includes('kandy')) {
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Kandy Central Hub' });
      navigate('/tracking');
    } else if (lower.includes('galle')) {
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Galle Fort Coast' });
      navigate('/tracking');
    } else if (lower.includes('jaffna')) {
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Jaffna Central Terminal' });
      navigate('/tracking');
    } else if (lower.includes('gampaha')) {
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Gampaha Mobility Hub' });
      navigate('/tracking');
    } else if (lower.includes('negombo')) {
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Negombo Coastal Terminal' });
      navigate('/tracking');
    } else if (lower.includes('nuwara') || lower.includes('eliya')) {
      setActiveJourney({ from: 'Colombo Fort Station', to: 'Nuwara Eliya Express' });
      navigate('/tracking');
    } else if (lower.includes('air') || lower.includes('aero') || lower.includes('taxi')) {
      setRouteType('aiOptimized');
      navigate('/tracking');
    } else if (lower.includes('maglev') || lower.includes('bullet') || lower.includes('train')) {
      setRouteType('fastest');
      navigate('/tracking');
    } else if (lower.includes('tram') || lower.includes('eco')) {
      setRouteType('eco');
      navigate('/tracking');
    } else if (lower.includes('home') || lower.includes('back')) {
      navigate('/');
    } else {
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
        setTranscript('Listening for Gemini voice input...');
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
    isAiThinking,
    transcript,
    lastCommand,
    isSupported,
    toggleListening,
    handleCommandIntent
  };
}


