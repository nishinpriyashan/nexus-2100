import { useJourneyStore } from '../../store/journeyStore';
import { routes } from '../../data/journeyData';
import JourneyProgress from './JourneyProgress';
import NexusLiveMonitor from './NexusLiveMonitor';
import LiveIndicator from './LiveIndicator';
import { ArrowRight, Activity, Clock, Zap } from 'lucide-react';

export default function TrackingHUD({ progress, journeySimulation }) {
  const { activeJourney, routeType, accessibility, aiApplied } = useJourneyStore();
  const from = activeJourney?.from || 'Naaldwijk';
  const to = activeJourney?.to || 'Amsterdam';

  let currentRoute = routes[routeType];
  if (routeType === 'fastest' && accessibility.stepFree) {
    currentRoute = routes.accessible;
  }

  // Derived simulation data
  const currentSpeed = (300 + Math.sin(progress * 10) * 12).toFixed(0);
  const remainingMin = Math.max(1, Math.ceil((1 - progress) * currentRoute.duration));
  const themeColor = aiApplied ? 'text-ai-violet' : 'text-primary-cyan';

  return (
    <div className="absolute inset-0 z-10 pointer-events-none p-6 md:p-12 flex flex-col justify-between">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2 pointer-events-auto">
            <span className="text-xs font-mono text-primary-cyan tracking-widest uppercase">Live Journey // NX-8407</span>
            <LiveIndicator />
          </div>
          
          <div className="flex items-center gap-4 text-2xl md:text-5xl font-bold tracking-tight">
            <span className="text-primary-text">{from}</span>
            <ArrowRight className="w-6 h-6 md:w-10 md:h-10 text-secondary-text" />
            <span className="text-primary-text">{to}</span>
          </div>
        </div>

        {/* Top Right Live Stats */}
        <div className="flex gap-4 md:gap-8 bg-surface/30 backdrop-blur-md border border-surface p-4 rounded-xl pointer-events-auto">
          <Stat label="ETA" value={currentRoute.arrival} icon={Clock} highlight={themeColor} />
          <Stat label="REMAINING" value={`${remainingMin} M`} icon={Activity} />
          <Stat label="SPEED" value={`${currentSpeed} KM/H`} icon={Zap} />
        </div>
      </div>

      {/* Bottom Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 pointer-events-auto">
        <div className="w-full md:w-1/2 lg:w-2/3">
          <JourneyProgress progress={progress} route={currentRoute} themeColor={themeColor} />
        </div>

        <div className="w-full md:w-96">
          <NexusLiveMonitor route={currentRoute} onAiTriggered={journeySimulation.triggerAiAlert} aiWarningActive={journeySimulation.aiWarningActive} />
        </div>
      </div>

    </div>
  );
}

function Stat({ label, value, icon: Icon, highlight }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-secondary-text mb-1 flex items-center gap-1">
        <Icon className="w-3 h-3" /> {label}
      </span>
      <span className={`text-xl font-mono font-bold ${highlight || 'text-primary-text'}`}>{value}</span>
    </div>
  );
}
