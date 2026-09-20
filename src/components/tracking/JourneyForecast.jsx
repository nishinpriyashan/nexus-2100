import { motion } from "motion/react";
import { AlertTriangle, Clock, MapPin } from "lucide-react";
import { useJourneyStore } from "../../store/journeyStore";

export default function JourneyForecast({ progress }) {
  const { aiDisruption, aiApplied } = useJourneyStore();

  // Create a stylized timeline for the forecast
  const milestones = [
    { label: "NOW", pos: 0, status: "passed" },
    { label: "+5m", pos: 20, status: progress > 0.1 ? "passed" : "future" },
    { label: "+10m", pos: 40, status: progress > 0.25 ? "passed" : "future" },
    { 
      label: "+18m", 
      pos: 65, 
      status: aiApplied ? "resolved" : (aiDisruption ? "risk" : "future"),
      icon: aiDisruption && !aiApplied ? AlertTriangle : null
    },
    { label: "+25m", pos: 90, status: "future" },
    { label: "ARR", pos: 100, status: "future", icon: MapPin },
  ];

  return (
    <div className="bg-surface/30 backdrop-blur-md border border-surface rounded-2xl p-4 mb-4" role="region" aria-label="Journey Risk Forecast">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-4 h-4 text-primary-cyan" />
        <span className="text-[10px] font-bold tracking-widest uppercase text-primary-text">
          Predictive Horizon
        </span>
      </div>

      <div className="relative h-1 mb-6">
        {/* Base line */}
        <div className="absolute inset-0 bg-surface rounded-full" />
        
        {/* Progress line */}
        <div 
          className="absolute inset-y-0 left-0 bg-primary-cyan rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />

        {/* Risk segment indicator */}
        {aiDisruption && !aiApplied && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-y-0 bg-warning rounded-full"
            style={{ left: "55%", width: "15%" }}
          />
        )}

        {/* AI Route segment indicator */}
        {aiApplied && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-y-0 bg-success rounded-full"
            style={{ left: "55%", width: "45%" }}
          />
        )}

        {/* Milestones */}
        {milestones.map((ms, i) => {
          let dotColor = "bg-surface border-surface/50";
          let labelColor = "text-secondary-text";
          
          if (ms.status === "passed") {
            dotColor = "bg-primary-cyan border-primary-cyan";
            labelColor = "text-primary-cyan";
          } else if (ms.status === "risk") {
            dotColor = "bg-warning border-warning animate-pulse";
            labelColor = "text-warning font-bold";
          } else if (ms.status === "resolved") {
            dotColor = "bg-success border-success";
            labelColor = "text-success";
          }

          const Icon = ms.icon;

          return (
            <div 
              key={i} 
              className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${ms.pos}%`, transform: `translate(-50%, -50%)` }}
            >
              <div className={`w-2.5 h-2.5 rounded-full border-[3px] ${dotColor} relative z-10 transition-colors duration-500`} />
              <div className="absolute top-4 flex flex-col items-center min-w-max">
                {Icon && <Icon className={`w-3 h-3 mb-0.5 ${labelColor}`} />}
                <span className={`text-[9px] uppercase tracking-wider ${labelColor}`}>
                  {ms.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {aiDisruption && !aiApplied && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8 text-[10px] font-bold text-warning tracking-wider uppercase"
        >
          High Risk of Delay Detected at +18m
        </motion.div>
      )}
    </div>
  );
}
