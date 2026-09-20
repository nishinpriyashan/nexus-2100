import { motion, AnimatePresence } from 'motion/react';
import { Clock, Route as RouteIcon, Navigation, Activity } from 'lucide-react';

export default function RouteSummary({ route }) {
  if (!route) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <SummaryItem icon={Clock} value={`${route.duration} MIN`} label="Duration" />
      <SummaryItem icon={RouteIcon} value={`${route.modes} MODES`} label="Transport" />
      <SummaryItem icon={Navigation} value={`${route.transfers} TRANSFER${route.transfers !== 1 ? 'S' : ''}`} label="Connections" />
      <SummaryItem icon={Activity} value={`${route.confidence}%`} label="AI Confidence" />
    </div>
  );
}

function SummaryItem({ icon: Icon, value, label }) {
  return (
    <div className="bg-surface/30 border border-surface rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-secondary-text text-xs uppercase tracking-wider">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <div className="relative h-8 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-xl font-bold font-mono text-primary-text absolute"
          >
            {value}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
