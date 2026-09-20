import { motion } from "motion/react";
import { Globe } from "lucide-react";

/**
 * Shown while a WebGL Canvas is loading (Suspense fallback)
 * or when WebGL is unavailable.
 */
export default function WebGLFallback({ message = "Loading 3D environment..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-full min-h-40 bg-background/50"
      role="status"
      aria-label={message}
    >
      <Globe className="w-8 h-8 text-primary-cyan/40 mb-3 animate-pulse" />
      <div className="text-[11px] text-secondary-text/60 tracking-widest uppercase font-mono">
        {message}
      </div>
    </motion.div>
  );
}
