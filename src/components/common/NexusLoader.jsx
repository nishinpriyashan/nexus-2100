import { motion } from "motion/react";
import { Activity } from "lucide-react";

export default function NexusLoader({ message = "Initializing NEXUS..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] w-full" role="status" aria-label={message}>
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-4"
      >
        <Activity className="w-8 h-8 text-primary-cyan" />
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary-cyan rounded-full animate-pulse" />
          <span className="text-xs font-mono tracking-widest uppercase text-primary-cyan/80">
            {message}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
