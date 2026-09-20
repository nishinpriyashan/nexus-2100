import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useJourneyStore } from '../../store/journeyStore';

export default function RouteTimeline({ route }) {
  const navigate = useNavigate();
  const { aiApplied } = useJourneyStore();
  const themeColor = aiApplied ? 'text-ai-violet' : 'text-primary-cyan';
  const bgColor = aiApplied ? 'bg-ai-violet' : 'bg-primary-cyan';
  const borderColor = aiApplied ? 'border-ai-violet' : 'border-primary-cyan';

  return (
    <div className="bg-surface/30 backdrop-blur-md border border-surface rounded-2xl p-6 h-full flex flex-col">
      <h3 className="text-xs font-bold text-secondary-text tracking-widest uppercase mb-6">Route Timeline</h3>
      
      <div className="relative flex-1 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-8 relative z-10"
          >
            {route.nodes.map((node, index) => {
              const isLast = index === route.nodes.length - 1;
              return (
                <div key={index} className="flex items-start gap-6 group">
                  <div className="relative flex flex-col items-center">
                    {/* Node Dot */}
                    <div className={`w-4 h-4 rounded-full border-2 bg-background flex items-center justify-center z-10 transition-colors ${
                      node.status === 'completed' ? `${borderColor} ${bgColor}` :
                      node.status === 'active' ? `${borderColor}` : 'border-secondary-text'
                    }`}>
                      {node.status === 'active' && <div className={`w-1.5 h-1.5 rounded-full ${bgColor} animate-pulse`} />}
                    </div>
                    
                    {/* Connecting Line */}
                    {!isLast && (
                      <div className="absolute top-4 bottom-[-32px] w-0.5 bg-surface z-0 overflow-hidden">
                         {node.status !== 'pending' && (
                           <motion.div 
                             initial={{ height: 0 }}
                             animate={{ height: '100%' }}
                             transition={{ duration: 1, delay: 0.2 }}
                             className={`w-full ${bgColor}`} 
                           />
                         )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col pt-0.5">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono text-lg font-bold ${node.status === 'active' ? themeColor : 'text-primary-text'}`}>
                        {node.time}
                      </span>
                    </div>
                    <span className={`text-sm ${node.status === 'pending' ? 'text-secondary-text' : 'text-primary-text/80'}`}>
                      {node.mode}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between pt-6 border-t border-surface/50">
        <div className="flex flex-col">
          <span className="text-xs text-secondary-text tracking-wider uppercase">Arrival</span>
          <AnimatePresence mode="popLayout">
            <motion.span 
              key={route.arrival}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-2xl font-bold font-mono ${themeColor}`}
            >
              {route.arrival}
            </motion.span>
          </AnimatePresence>
        </div>
        <button 
          onClick={() => navigate('/tracking')}
          className="px-6 py-3 bg-primary-cyan text-background font-bold tracking-wider rounded hover:bg-primary-cyan/90 transition-colors shadow-[0_0_15px_rgba(57,231,255,0.4)]"
        >
          START JOURNEY
        </button>
      </div>
    </div>
  );
}
