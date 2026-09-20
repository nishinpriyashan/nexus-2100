import { create } from 'zustand'

export const useJourneyStore = create((set) => ({
  activeJourney: null, // { from: string, to: string }
  journeyStatus: 'idle', // idle, tracking
  
  routeType: 'fastest', // fastest, accessible, eco, aiOptimized
  aiDisruption: false, // true when AI warning is shown and can be applied
  aiApplied: false, // true when AI route is applied
  
  accessibility: {
    stepFree: false,
    visualAssistance: false,
    simplifiedInterface: false,
    reducedMotion: false,
  },

  setActiveJourney: (journey) => set({ activeJourney: journey, journeyStatus: 'tracking', routeType: 'fastest', aiDisruption: true, aiApplied: false }),
  clearJourney: () => set({ activeJourney: null, journeyStatus: 'idle' }),
  
  setRouteType: (type) => set({ routeType: type }),
  applyAiRoute: () => set({ routeType: 'aiOptimized', aiApplied: true, aiDisruption: false }),
  
  toggleAccessibility: (key) => set((state) => {
    const updated = { ...state.accessibility, [key]: !state.accessibility[key] };
    
    // Auto-switch to accessible route if step-free is toggled on
    let routeOverride = {};
    if (key === 'stepFree' && updated.stepFree && state.routeType === 'fastest') {
      routeOverride = { routeType: 'accessible' };
    }
    
    return { accessibility: updated, ...routeOverride };
  }),
}))
