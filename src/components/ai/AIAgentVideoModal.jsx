import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Rocket, Bot, Mic, ChevronRight, Radio, Sparkles } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';

/**
 * Conversational AI Mobility Concierge (Falcon AI Video Presentation)
 * Plays intro.mp4 video ONCE (no loop) with native video audio.
 * Automatically activates system microphone so user can speak commands like "I want to travel to Kandy".
 * Generates 3D map route on voice command.
 */
export default function AIAgentVideoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userVoiceInput, setUserVoiceInput] = useState("");

  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const { setActiveJourney } = useJourneyStore();

  const handleDestinationSelect = useCallback((toLocation, label = toLocation) => {
    setActiveJourney({ from: "Colombo Fort Station", to: toLocation });
    setIsOpen(false);
    navigate('/tracking');
  }, [navigate, setActiveJourney]);

  const startVoiceRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setUserVoiceInput("Web Speech API not supported. Use buttons below.");
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
        setUserVoiceInput("Microphone active... Speak your destination (e.g. 'I want to travel to Kandy')");
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setUserVoiceInput(text);

        if (event.results[current].isFinal) {
          const lower = text.toLowerCase();

          if (lower.includes('kandy')) {
            handleDestinationSelect("Kandy Central Hub", "Kandy Central Hub");
          } else if (lower.includes('galle')) {
            handleDestinationSelect("Galle Fort Coast", "Galle Fort Coast");
          } else if (lower.includes('jaffna')) {
            handleDestinationSelect("Jaffna Central Terminal", "Jaffna Central Terminal");
          } else if (lower.includes('negombo')) {
            handleDestinationSelect("Negombo Coastal Terminal", "Negombo Coastal");
          } else if (lower.includes('gampaha')) {
            handleDestinationSelect("Gampaha Mobility Hub", "Gampaha Mobility Hub");
          } else if (lower.includes('nuwara') || lower.includes('eliya')) {
            handleDestinationSelect("Nuwara Eliya Express", "Nuwara Eliya");
          } else if (lower.includes('travel') || lower.includes('go') || lower.includes('start') || lower.includes('map') || lower.includes('3d')) {
            handleDestinationSelect("Kandy Central Hub", "Kandy Central Hub");
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
      {/* ── Live AI Agent Stream (100% Fullscreen Background Video - Plays ONCE without loop) ── */}
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
        <div className="flex items-center gap-3 bg-surface/90 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-primary-cyan/50 shadow-2xl">
          <Bot className="w-5 h-5 text-primary-cyan animate-bounce" />
          <div className="flex flex-col">
            <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary-text" style={{ fontFamily: 'Space Grotesk' }}>
              FALCON AI // Year 2100 Mobility Concierge
            </span>
            <span className="text-[10px] text-success font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
              Microphone Active — Speak Destination Command
            </span>
          </div>
        </div>

        {/* Audio Mute & Close Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-surface/80 backdrop-blur-xl border border-primary-cyan/40 hover:border-primary-cyan text-primary-cyan rounded-xl transition-all cursor-pointer shadow-xl text-xs font-bold uppercase tracking-wider"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isMuted ? "Unmute Audio" : "Mute Audio"}</span>
          </button>
        </div>
      </div>

      {/* ── Bottom HUD: System Microphone Live Input & Direct Route Generator ── */}
      <div className="relative z-20 p-6 md:p-12 flex flex-col lg:flex-row items-end lg:items-center justify-between gap-6 pointer-events-auto">
        {/* User Microphone Status & Live Voice Command Subtitle */}
        <div className="w-full lg:max-w-2xl bg-surface/95 backdrop-blur-2xl p-6 rounded-3xl border border-primary-cyan/60 text-sm font-mono text-primary-text shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary-cyan tracking-widest uppercase flex items-center gap-2">
              <Radio className="w-4 h-4 text-primary-cyan animate-pulse" />
              System Microphone Listening
            </span>
            <span className="text-[10px] text-success font-mono flex items-center gap-1.5 bg-success/10 px-2.5 py-1 rounded-full border border-success/30">
              <span className="w-2 h-2 rounded-full bg-success animate-ping" />
              Real-Time Voice Command
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background/80 rounded-2xl border border-primary-cyan/30">
            <div className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-danger text-white animate-pulse' : 'bg-primary-cyan/20 text-primary-cyan'}`}>
              <Mic className="w-5 h-5" />
            </div>
            <p className="text-base md:text-lg text-primary-text leading-relaxed font-mono truncate">
              {userVoiceInput || "Speak now e.g. 'I want to travel to Kandy' or 'Take me to Galle'"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-secondary-text">Say destination name to automatically generate 3D map route</span>
            <button
              onClick={handleManualMicClick}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                isListening 
                  ? 'bg-danger/80 hover:bg-danger text-white animate-pulse' 
                  : 'bg-primary-cyan text-background hover:opacity-90'
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
            onClick={() => handleDestinationSelect("Kandy Central Hub", "Kandy Central Hub")}
            className="flex-1 lg:flex-initial px-6 py-4 bg-gradient-to-r from-primary-cyan via-ai-violet to-primary-cyan hover:opacity-95 text-background font-bold text-xs md:text-sm uppercase tracking-widest rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 cursor-pointer animate-pulse"
          >
            <Rocket className="w-5 h-5" />
            <span>Generate Colombo ➔ Kandy Route</span>
          </button>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => handleDestinationSelect("Galle Fort Coast", "Galle Fort Coast")}
              className="flex-1 px-4 py-3 bg-surface/90 hover:bg-surface border border-primary-cyan/50 hover:border-primary-cyan text-primary-cyan font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Galle Coast</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleDestinationSelect("Jaffna Central Terminal", "Jaffna Central")}
              className="flex-1 px-4 py-3 bg-surface/90 hover:bg-surface border border-primary-cyan/50 hover:border-primary-cyan text-primary-cyan font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Jaffna Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

