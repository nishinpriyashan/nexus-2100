import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export default function AIAnalysisSequence() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl rounded-xl border border-primary-cyan/20 overflow-hidden"
    >
      <div className="text-center mb-6">
        <div className="text-xs font-bold text-ai-violet tracking-[0.3em] mb-2 uppercase">Nexus Intelligence</div>
        <div className="text-lg font-medium text-primary-cyan animate-pulse">ANALYZING MOBILITY NETWORK</div>
      </div>
      
      <div className="flex flex-col gap-3 w-48">
        <AnalysisStage text="GROUND NETWORK" delay={0.2} />
        <AnalysisStage text="RAIL NETWORK" delay={0.8} />
        <AnalysisStage text="AERIAL NETWORK" delay={1.4} />
      </div>

      <Loader2 className="w-8 h-8 text-ai-violet animate-spin mt-8 opacity-50" />
    </motion.div>
  );
}

function AnalysisStage({ text, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 text-sm text-primary-text"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: 'spring' }}
        className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(66,255,180,0.6)]"
      />
      <span className="tracking-wide">{text}</span>
    </motion.div>
  );
}
