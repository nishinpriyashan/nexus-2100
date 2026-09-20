import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Rocket, Bot, Mic, ChevronRight, Radio, Sparkles, Cpu } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';
import { queryGeminiAI } from '../../utils/geminiApi';
import { speakText } from '../../hooks/useVoiceCommands';

/**
 * Conversational AI Mobility Concierge (Falcon AI Powered by Google Gemini)
 * Communicates in real time with the user using Google Gemini API & Web Speech Synthesis.
 */
export default function AIAgentVideoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [userVoiceInput, setUserVoiceInput] = useState("");
  const [geminiReply, setGeminiReply] = useState("Hi Master, I am Falcon AI powered by Google Gemini. How may I assist your journey today?");

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const { setActiveJourney } = useJourneyStore();

  const handleDestinationSelect = useCallback(async (toLocation, userPrompt = toLocation) => {
    setIsThinking(true);
    setUserVoiceInput(userPrompt);

    // Call real Google Gemini API
    const aiResponse = await queryGeminiAI(userPrompt);
    setIsThinking(false);

    if (aiResponse) {
      setGeminiReply(aiResponse);
      speakText(aiResponse, () => {
        setActiveJourney({ from: "Colombo Fort Station", to: toLocation });
        setIsOpen(false);
        navigate('/tracking');
      });
    } else {
      setActiveJourney({ from: "Colombo Fort Station", to: toLocation });
      setIsOpen(false);
      navigate('/tracking');
    }
  }, [navigate, setActiveJourney]);

  const startVoiceRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setUserVoiceInput("Web Speech API not supported. Select destination below.");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setUserVoiceInput("Gemini Voice Listening... Speak your destination command");
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setUserVoiceInput(text);

        if (event.results[current].isFinal) {
          const lower = text.toLowerCase();

          if (lower.includes('kandy')) {
            handleDestinationSelect("Kandy Central Hub", text);
          } else if (lower.includes('galle')) {
            handleDestinationSelect("Galle Fort Coast", text);
          } else if (lower.includes('jaffna')) {
            handleDestinationSelect("Jaffna Central Terminal", text);
          } else if (lower.includes('negombo')) {
            handleDestinationSelect("Negombo Coastal Terminal", text);
          } else if (lower.includes('gampaha')) {
            handleDestinationSelect("Gampaha Mobility Hub", text);
          } else if (lower.includes('nuwara') || lower.includes('eliya')) {
            handleDestinationSelect("Nuwara Eliya Express", text);
          } else {
            handleDestinationSelect("Kandy Central Hub", text);
          }
        }
      };

      recognition.onerror = (err) => {
        console.warn("SpeechRec error:", err);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Recognition start failed:", e);
      setIsListening(false);
    }
  }, [handleDestinationSelect]);


  // 4-Second timer trigger to show modal & turn ON microphone automatically
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      // Automatically activate system microphone for the user to speak
      startVoiceRecognition();
    }, 4000);

    return () => clearTimeout(timer);
  }, [startVoiceRecognition]);

  const handleManualMicClick = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      startVoiceRecognition();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-black overflow-hidden flex flex-col justify-between animate-fadeIn">
      {/* ── Live AI Agent Stream (100% Fullscreen Background Video) ── */}
      <video
        ref={videoRef}
        src="/nexus-2100/intro.mp4"
        autoPlay
        playsInline
        muted={isMuted}
        className="absolute inset-0 w-full h-full object-cover z-0 filter brightness-105 contrast-110 pointer-events-none"
      />

      {/* Futuristic Matrix Holographic Grid Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-background/80 pointer-events-none bg-[radial-gradient(#39E7FF_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* ── Top Header: AI Agent Status & Voice Controls ── */}
      <div className="relative z-20 flex items-center justify-between p-6 md:p-10 pointer-events-auto">
        <div className="flex items-center gap-3 glass-card-dark px-5 py-3 rounded-2xl shadow-2xl">
          <Bot className="w-5 h-5 text-cyan-400 animate-bounce" />
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
              <span>FALCON AI // Powered by Google Gemini</span>
              <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Real-Time Gemini API Connected
            </span>
          </div>
        </div>

        {/* Audio Mute Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 glass-card-dark hover:border-cyan-400 text-cyan-400 hover:text-white rounded-xl transition-all cursor-pointer shadow-xl text-xs font-bold uppercase tracking-wider"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-cyan-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span>{isMuted ? "Unmute Audio" : "Mute Audio"}</span>
          </button>
        </div>
      </div>

      {/* ── Bottom HUD: System Microphone Live Input & Direct Route Generator ── */}
      <div className="relative z-20 p-6 md:p-12 flex flex-col lg:flex-row items-end lg:items-center justify-between gap-6 pointer-events-auto">
        {/* User Microphone Status & Live Gemini Voice Subtitle */}
        <div className="w-full lg:max-w-2xl glass-card-dark p-6 rounded-3xl text-sm font-mono text-white shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              Gemini AI Output
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/40">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              {isThinking ? "Gemini Thinking..." : "Live Gemini Stream"}
            </span>
          </div>

          <p className="text-lg md:text-xl text-white leading-relaxed font-semibold font-mono" style={{ fontFamily: 'Space Grotesk' }}>
            "{geminiReply}"
          </p>

          <div className="flex items-center gap-3 p-3 bg-slate-950/90 rounded-2xl border border-cyan-500/30 shadow-inner">
            <div className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Mic className="w-5 h-5" />
            </div>
            <p className="text-xs md:text-sm text-cyan-200 leading-relaxed font-mono truncate">
              {userVoiceInput || "Speak now e.g. 'I want to travel to Kandy' or 'Take me to Galle'"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-300 font-mono">Speak to communicate in real time with Google Gemini AI</span>
            <button
              onClick={handleManualMicClick}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                isListening 
                  ? 'bg-red-600/90 hover:bg-red-600 text-white animate-pulse shadow-red-500/30' 
                  : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-400/20'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isListening ? "Listening Active" : "Enable Mic"}</span>
            </button>
          </div>
        </div>

        {/* Preset Destination Route Generator Buttons */}
        <div className="w-full lg:w-auto flex flex-wrap lg:flex-col gap-3">
          <button
            onClick={() => handleDestinationSelect("Kandy Central Hub", "I want to travel to Kandy")}
            className="flex-1 lg:flex-initial px-6 py-4 bg-gradient-to-r from-cyan-500 via-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs md:text-sm uppercase tracking-widest rounded-2xl shadow-2xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 cursor-pointer animate-pulse border border-cyan-300/40"
          >
            <Rocket className="w-5 h-5" />
            <span>Generate Colombo ➔ Kandy Route</span>
          </button>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => handleDestinationSelect("Galle Fort Coast", "I want to travel to Galle")}
              className="flex-1 px-4 py-3 glass-card-dark hover:border-cyan-400 text-cyan-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Galle Coast</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            <button
              onClick={() => handleDestinationSelect("Jaffna Central Terminal", "I want to travel to Jaffna")}
              className="flex-1 px-4 py-3 glass-card-dark hover:border-cyan-400 text-cyan-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Jaffna Hub</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



