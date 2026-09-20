import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ArrowUpDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useJourneyStore } from '../../store/journeyStore';
import AIAnalysisSequence from '../ai/AIAnalysisSequence';

export default function JourneySearch() {
  const [from, setFrom] = useState('Current Location');
  const [to, setTo] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();
  const setActiveJourney = useJourneyStore((state) => state.setActiveJourney);

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setValidationError('');
    
    if (!to.trim()) {
      setValidationError('Please enter a destination to initialize predictive routing.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      setActiveJourney({ from, to });
      setIsAnalyzing(false);
      navigate('/journey');
    }, 2500);
  };

  return (
    <div className="relative mt-8 bg-surface/40 backdrop-blur-md border border-surface rounded-2xl p-6 shadow-2xl">
      <AnimatePresence>
        {isAnalyzing && <AIAnalysisSequence />}
      </AnimatePresence>

      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="relative">
          <label htmlFor="from" className="sr-only">From</label>
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <MapPin className="w-5 h-5 text-secondary-text" />
          </div>
          <input
            id="from"
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-background/50 border border-surface/80 rounded-xl py-3 pl-12 pr-4 text-primary-text focus:outline-none focus:ring-1 focus:ring-primary-cyan focus:border-primary-cyan transition-all placeholder:text-secondary-text/50"
            placeholder="Origin"
            required
          />
        </div>

        <div className="relative flex justify-center -my-3 z-10">
          <button
            type="button"
            onClick={handleSwap}
            className="bg-surface border border-surface/80 p-2 rounded-full text-secondary-text hover:text-primary-cyan hover:border-primary-cyan/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-cyan"
            aria-label="Swap locations"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <label htmlFor="to" className="sr-only">To</label>
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Navigation className="w-5 h-5 text-secondary-text" />
          </div>
          <input
            id="to"
            type="text"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              if (validationError) setValidationError('');
            }}
            className={`w-full bg-background/50 border ${validationError ? 'border-warning-amber' : 'border-surface/80'} rounded-xl py-3 pl-12 pr-4 text-primary-text focus:outline-none focus:ring-1 ${validationError ? 'focus:ring-warning-amber' : 'focus:ring-primary-cyan'} transition-all placeholder:text-secondary-text/50`}
            placeholder="Where do you want to go?"
          />
        </div>
        {validationError && (
          <motion.p 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-warning-amber text-xs tracking-wide px-2 -mt-2"
          >
            {validationError}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="mt-2 w-full bg-primary-cyan/10 hover:bg-primary-cyan/20 border border-primary-cyan/50 text-primary-cyan font-semibold py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-cyan disabled:opacity-50 disabled:cursor-not-allowed"
        >
          PLAN MY JOURNEY
        </motion.button>
      </form>
    </div>
  );
}
