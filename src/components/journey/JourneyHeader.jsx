import { useJourneyStore } from '../../store/journeyStore';
import { ArrowRight } from 'lucide-react';

export default function JourneyHeader() {
  const { activeJourney } = useJourneyStore();
  const from = activeJourney?.from || 'Naaldwijk';
  const to = activeJourney?.to || 'Amsterdam';

  return (
    <div className="mb-8 border-b border-surface/50 pb-6">
      <div className="flex items-center gap-4 text-xs font-mono text-primary-cyan/60 tracking-widest uppercase mb-4">
        <span>Journey // 8407-A</span>
        <span className="w-1.5 h-1.5 rounded-full bg-primary-cyan animate-pulse"></span>
        <span>AI ROUTE MODEL</span>
      </div>
      
      <div className="flex items-center justify-between text-2xl md:text-4xl font-bold tracking-tight">
        <span className="text-primary-text">{from}</span>
        <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-secondary-text" />
        <span className="text-primary-text">{to}</span>
      </div>
    </div>
  );
}
