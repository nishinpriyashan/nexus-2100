import { motion } from 'motion/react';

export default function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 bg-success-green/10 border border-success-green/20 px-3 py-1 rounded-full">
      <motion.div 
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-2 h-2 rounded-full bg-success-green shadow-[0_0_8px_rgba(66,255,180,0.8)]" 
      />
      <span className="text-[10px] font-bold text-success-green tracking-widest uppercase mt-0.5">Live</span>
      <span className="hidden md:inline text-[10px] text-success-green/60 uppercase ml-2 border-l border-success-green/30 pl-2">Sync 2s ago</span>
    </div>
  );
}
