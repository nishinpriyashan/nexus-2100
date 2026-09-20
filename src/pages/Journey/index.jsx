import { Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { useJourneyStore } from '../../store/journeyStore';
import { routes } from '../../data/journeyData';
import JourneyHeader from '../../components/journey/JourneyHeader';
import RouteSummary from '../../components/journey/RouteSummary';
import RouteSelector from '../../components/journey/RouteSelector';
import RouteTimeline from '../../components/journey/RouteTimeline';
import PredictiveAI from '../../components/journey/PredictiveAI';
import JourneyRouteScene from '../../scenes/journey/JourneyRouteScene';

export default function Journey() {
  const { activeJourney, routeType, accessibility } = useJourneyStore();
  const navigate = useNavigate();

  useEffect(() => {
    // If user accesses /journey directly without planning, redirect to home
    if (!activeJourney) {
      navigate('/');
    }
  }, [activeJourney, navigate]);

  if (!activeJourney) return null;

  // Determine which route object to use based on store state
  let currentRoute = routes[routeType];
  if (routeType === 'fastest' && accessibility.stepFree) {
    currentRoute = routes.accessible;
  }

  return (
    <div className="relative min-h-screen w-full bg-background pt-24 px-6 md:px-12 pb-12 overflow-x-hidden">
      
      {/* Background WebGL Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Suspense fallback={null}>
            <JourneyRouteScene />
          </Suspense>
        </Canvas>
      </div>

      {/* DOM UI Layer */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <JourneyHeader />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Route Setup & Timeline */}
          <div className="lg:col-span-8 flex flex-col">
            <RouteSummary route={currentRoute} />
            <RouteSelector />
            
            <div className="flex-1 min-h-[400px]">
              <RouteTimeline route={currentRoute} />
            </div>
          </div>

          {/* Right Column: Predictive AI Panel */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-[400px]">
            <PredictiveAI />
          </div>

        </div>
      </div>
    </div>
  );
}
