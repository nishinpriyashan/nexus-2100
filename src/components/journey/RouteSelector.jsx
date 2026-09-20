import { motion } from 'motion/react';
import { Zap, Accessibility, Leaf } from 'lucide-react';
import { useJourneyStore } from '../../store/journeyStore';
import { routes } from '../../data/journeyData';

export default function RouteSelector() {
  const { routeType, setRouteType, accessibility, aiApplied } = useJourneyStore();

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
          route={accessibility.stepFree ? routes.accessible : routes.fastest} 
          isSelected={routeType === 'fastest' || (routeType === 'accessible' && accessibility.stepFree)}
          onClick={() => handleSelect('fastest')}
          disabled={aiApplied}
        />
        <RouteOption 
          id="accessible"
          icon={Accessibility} 
          route={routes.accessible} 
          isSelected={routeType === 'accessible' && !accessibility.stepFree}
          onClick={() => handleSelect('accessible')}
          disabled={aiApplied || accessibility.stepFree} // Disable if step-free is on (merged into fastest)
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
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-2 ${isSelected ? 'text-primary-cyan' : 'text-primary-text'}`}>
          <Icon className="w-5 h-5" />
          <span className="font-bold tracking-wide">{route.label}</span>
        </div>
        <span className="text-xl font-mono font-bold">{route.duration} <span className="text-xs">MIN</span></span>
      </div>
      <p className="text-xs text-secondary-text line-clamp-2 h-8">{route.description}</p>
      
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
