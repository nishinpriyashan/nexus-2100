import { motion } from 'motion/react';
import JourneySearch from '../../components/journey/JourneySearch';
import TransportModes from '../../components/journey/TransportModes';
import HomeWorld from '../../scenes/environment/HomeWorld';

export default function Home() {
  return (
    <div className="relative w-full h-[calc(100vh-80px)] flex flex-col md:flex-row overflow-hidden">
      
      {/* LEFT COLUMN: UI / Search */}
      <div className="w-full md:w-1/2 lg:w-5/12 h-full flex flex-col justify-center px-6 md:px-12 z-10 bg-background/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none pb-8 md:pb-0 pointer-events-none">
        
        {/* Re-enable pointer events for the interactive area */}
        <div className="pointer-events-auto max-w-md w-full mx-auto md:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="text-xs font-bold text-primary-cyan tracking-[0.3em] uppercase mb-4">
              AI Mobility Network // 2100
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] text-primary-text mb-6">
              MOVE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-text to-secondary-text">
                BEYOND
              </span> <br />
              THE PRESENT.
            </h1>
            
            <p className="text-secondary-text md:text-lg leading-relaxed max-w-sm mb-8">
              An autonomous mobility intelligence connecting ground, rail and aerial transportation into a single predictive network.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <JourneySearch />
            <TransportModes />
          </motion.div>
        </div>
      </div>

      {/* RIGHT COLUMN: WebGL Scene */}
      <div className="absolute inset-0 md:relative w-full h-full md:w-1/2 lg:w-7/12 z-0 pointer-events-none md:pointer-events-auto">
        {/* Pointer events are disabled on mobile so the user can scroll/interact with the form. */}
        <HomeWorld />
      </div>

    </div>
  );
}
