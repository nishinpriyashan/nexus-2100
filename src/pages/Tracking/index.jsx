import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJourneyStore } from '../../store/journeyStore';
import TrackingWorld from '../../scenes/tracking/TrackingWorld';
import TrackingHUD from '../../components/tracking/TrackingHUD';

export default function Tracking() {
  const { activeJourney } = useJourneyStore();
  const navigate = useNavigate();
  
  // Local tracking simulation state
  const [progress, setProgress] = useState(0.05); // Start at 5%
  const [aiWarningActive, setAiWarningActive] = useState(false);
  const animationRef = useRef(null);
  
  useEffect(() => {
    // If user accesses /tracking directly without planning, redirect to home
    if (!activeJourney) {
      navigate('/');
    }
  }, [activeJourney, navigate]);

  // Run the tracking simulation loop
  useEffect(() => {
    let lastTime = performance.now();
    
    const animate = (time) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Extremely slow progress: takes ~60 seconds to complete
      setProgress(prev => {
        const next = prev + (deltaTime * 0.00001);
        if (next >= 1) return 1;
        return next;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  if (!activeJourney) return null;

  const journeySimulation = {
    triggerAiAlert: () => setAiWarningActive(true),
    aiWarningActive,
  };

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* 3D Tracking World */}
      <div className="absolute inset-0 z-0">
        <TrackingWorld progress={progress} />
      </div>

      {/* DOM Overlay */}
      <TrackingHUD progress={progress} journeySimulation={journeySimulation} />
    </div>
  );
}
