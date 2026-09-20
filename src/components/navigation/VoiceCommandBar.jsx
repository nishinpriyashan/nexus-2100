import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useVoiceCommands } from '../../hooks/useVoiceCommands';

/**
 * Voice Command Assistant Component
 * Provides a floating microphone button in the header bar and displays real-time speech transcription.
 */
export default function VoiceCommandBar() {
  const { isListening, transcript, lastCommand, toggleListening } = useVoiceCommands();

  return (
    <div className="flex items-center gap-2">
      {/* Microphone Toggle Button */}
      <button
        onClick={toggleListening}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer shadow-md ${
          isListening
            ? 'bg-ai-violet/20 border-ai-violet text-ai-violet animate-pulse ring-2 ring-ai-violet/50'
            : 'bg-surface/80 hover:bg-surface border-surface/80 text-secondary-text hover:text-primary-cyan'
        }`}
        title="Activate Voice Commands (e.g. Speak 'Start 3D Journey' or 'Falcon View')"
      >
        {isListening ? <Mic className="w-4 h-4 text-ai-violet animate-bounce" /> : <MicOff className="w-4 h-4" />}
        <span className="hidden lg:inline text-[10px] font-bold tracking-widest uppercase">
          {isListening ? 'Voice Active' : 'Voice Command'}
        </span>
      </button>

      {/* Real-time speech transcription banner */}
      {isListening && (
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background/90 border border-ai-violet/50 rounded-xl text-xs font-mono text-ai-violet shadow-xl animate-fadeIn">
          <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          <span className="truncate max-w-[180px]">{transcript || "Speak 'Start 3D Journey'..."}</span>
        </div>
      )}
    </div>
  );
}
