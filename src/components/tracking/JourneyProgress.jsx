import { motion } from 'motion/react';
import { useJourneyStore } from '../../store/journeyStore';

export default function JourneyProgress({ progress, route, themeColor }) {
  const { passport } = useJourneyStore();
  const percentage = Math.round(progress * 100);

  // Derive current node based on progress
  const activeIndex = Math.floor(progress * (route.nodes.length - 1));
  const activeNode = route.nodes[Math.min(activeIndex, route.nodes.length - 1)];
  const nextNode = route.nodes[Math.min(activeIndex + 1, route.nodes.length - 1)];

  return (
    <div className="bg-surface/30 backdrop-blur-md border border-surface rounded-2xl p-6">
      
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-secondary-text tracking-widest uppercase mb-1">Current Mode</h3>
          <div className={`text-xl font-bold tracking-wider ${themeColor}`}>{activeNode.mode}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono font-bold text-primary-text">{percentage}%</div>
        </div>
      </div>

      <div className="relative h-2 bg-surface/50 rounded-full overflow-hidden mb-4">
        <motion.div 
          className="absolute top-0 left-0 bottom-0 bg-primary-text"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ ease: "linear", duration: 0.5 }}
        />
        <motion.div 
          className={`absolute top-0 left-0 bottom-0 opacity-50 ${themeColor.replace('text-', 'bg-')}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ ease: "linear", duration: 0.5, delay: 0.1 }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-secondary-text">
        <span>{route.nodes[0].time}</span>
        
        {passport.mobility.stepFree && (
          <span className="flex items-center gap-1 text-primary-cyan">
            ✓ Step-free Route
          </span>
        )}

        {nextNode && activeNode !== nextNode && (
          <span className="opacity-60">Next: {nextNode.mode}</span>
        )}
        <span>{route.arrival}</span>
      </div>

    </div>
  );
}
