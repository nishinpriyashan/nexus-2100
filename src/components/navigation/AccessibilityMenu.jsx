import { motion, AnimatePresence } from 'motion/react';
import { useJourneyStore } from '../../store/journeyStore';
import { Check } from 'lucide-react';

export default function AccessibilityMenu({ isOpen }) {
  const { accessibility, toggleAccessibility } = useJourneyStore();

  const options = [
    { id: 'standard', label: 'Standard', isDefault: true },
    { id: 'stepFree', label: 'Step-free' },
    { id: 'visualAssistance', label: 'Visual assistance' },
    { id: 'simplifiedInterface', label: 'Simplified interface' },
    { id: 'reducedMotion', label: 'Reduced motion' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-6 md:right-12 w-64 bg-surface/90 backdrop-blur-xl border border-primary-cyan/20 rounded-xl shadow-2xl z-50 overflow-hidden"
        >
          <div className="p-4 border-b border-surface">
            <h3 className="text-xs font-bold text-primary-cyan tracking-widest uppercase mb-1">Adaptive Experience</h3>
            <p className="text-xs text-secondary-text">NEXUS AI can adapt the journey to your needs.</p>
          </div>
          
          <div className="flex flex-col py-2">
            {options.map((opt) => {
              const isChecked = opt.isDefault ? !Object.values(accessibility).some(Boolean) : accessibility[opt.id];
              return (
                <button
                  key={opt.id}
                  onClick={() => !opt.isDefault && toggleAccessibility(opt.id)}
                  className={`flex items-center justify-between px-4 py-2 hover:bg-surface/50 transition-colors ${opt.isDefault && isChecked ? 'text-primary-cyan cursor-default' : 'text-primary-text'}`}
                >
                  <span className="text-sm">{opt.label}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isChecked ? 'border-primary-cyan bg-primary-cyan/20' : 'border-secondary-text/50'}`}>
                    {isChecked && <Check className="w-3 h-3 text-primary-cyan" />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
