import { motion, AnimatePresence } from 'motion/react';
import { Zap, Accessibility, Leaf, BrainCircuit, Activity } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';
import { routes } from '../../data/journeyData';

export default function RouteSelector() {
  const { passport, aiApplied, routeType, setRouteType } = useJourneyStore();

  const handleSelect = (id) => {
    if (aiApplied) return; // Lock selector if AI route is applied
    setRouteType(id);
  };

  return (
    <div className="flex flex-col gap-3 mb-8">
      <h3 className="text-xs font-bold text-secondary-text tracking-widest uppercase">Route Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RouteOption 
          id="fastest"
          icon={Zap} 
          route={passport.mobility.stepFree ? routes.accessible : routes.fastest} 
          isSelected={routeType === 'fastest' || (routeType === 'accessible' && passport.mobility.stepFree)}
          onClick={() => handleSelect('fastest')}
          disabled={aiApplied}
        />
        <RouteOption 
          id="accessible"
          icon={Accessibility} 
          route={routes.accessible} 
          isSelected={routeType === 'accessible' && !passport.mobility.stepFree}
          onClick={() => handleSelect('accessible')}
          disabled={aiApplied || passport.mobility.stepFree} // Disable if step-free is on (merged into fastest)
        />
        <RouteOption 
          id="eco"
          icon={Leaf} 
          route={routes.eco} 
          isSelected={routeType === 'eco'}
          onClick={() => handleSelect('eco')}
          disabled={aiApplied}
        />
      </div>
    </div>
  );
}

function RouteOption({ id, icon: Icon, route, isSelected, onClick, disabled }) {
  if (disabled && !isSelected && id === 'accessible') return null; // Hide accessible button if merged

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative p-4 rounded-xl text-left transition-all border ${
        isSelected 
          ? 'bg-primary-cyan/10 border-primary-cyan shadow-[0_0_15px_rgba(57,231,255,0.15)]' 
          : 'bg-surface/20 border-surface hover:bg-surface hover:border-primary-cyan/50'
      } ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
    >
      <div className="flex items-center justify-between mb-2 relative z-20">
        <div className={`flex items-center gap-2 ${isSelected ? 'text-primary-cyan' : 'text-primary-text'}`}>
          <Icon className="w-5 h-5" />
          <span className="font-bold tracking-wide">{route.label}</span>
        </div>
        <span className="text-xl font-mono font-bold">{route.duration} <span className="text-xs">MIN</span></span>
      </div>
      
      <p className="text-xs text-secondary-text mb-2 relative z-20">{route.description}</p>
      
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-20 mt-3 pt-3 border-t border-primary-cyan/30 overflow-hidden"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <BrainCircuit className="w-3.5 h-3.5 text-primary-cyan" />
              <span className="text-[9px] font-bold tracking-widest text-primary-cyan uppercase">
                Why This Route?
              </span>
            </div>
            <ul className="space-y-1.5">
              <ExplainPoint icon={Activity} text={`${route.confidence}% AI Reliability Score`} />
              <ExplainPoint icon={Zap} text={`${route.modes} Transit Modes, ${route.transfers} Transfers`} />
              {route.accessibilityFeatures && (
                <ExplainPoint icon={Accessibility} text="Verified 100% Step-Free" />
              )}
              {route.ecoStats && (
                <ExplainPoint icon={Leaf} text={`${route.ecoStats.emissionsSaved} Saved`} />
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isSelected && (
        <motion.div
          layoutId="activeRoute"
          className="absolute inset-0 border-2 border-primary-cyan rounded-xl z-10"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
}

function ExplainPoint({ icon: Icon, text }) {
  return (
    <li className="flex items-center gap-2 text-[10px] text-primary-text">
      <Icon className="w-3 h-3 text-secondary-text" />
      <span>{text}</span>
    </li>
  );
}
