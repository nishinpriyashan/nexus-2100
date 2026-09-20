import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useJourneyStore = create(
  persist(
    (set) => ({
      // ── Journey state ──────────────────────────────────────────────────
      activeJourney: null,       // { from: string, to: string }
      journeyStatus: "idle",     // idle | searching | analyzing | route-ready | active | complete

      // ── Route state ────────────────────────────────────────────────────
      routeType: "fastest",      // fastest | accessible | eco | aiOptimized
      aiDisruption: false,       // true when AI detects disruption (can be applied)
      aiApplied: false,          // true when AI route is accepted and active

      // ── NEXUS Passport (Persisted) ─────────────────────────────────────
      passport: {
        journeyPriority: "fastest", // fastest | accessible | eco
        experience: "standard",     // standard | simplified
        mobility: {
          stepFree: false,
          visualAssistance: false,
          reducedMotion: false,
        },
      },

      // ── Drive & Tracking View state ────────────────────────────────────
      isDriveMode: false,
      driveSpeed: 0,
      steeringAngle: 0,
      drivePos: [0, 0.5, 0],
      gestureStateText: "HAND GESTURE DRIVE READY",
      cameraMode: "falcon",      // falcon | reality
      showGpsMap: false,
      isHudVisible: false,

      // ── Resolved Theme ──────────────────────────────────────────────────
      resolvedTheme: "dark",

      // ── Actions ────────────────────────────────────────────────────────

      toggleDriveMode: () => set((state) => ({ isDriveMode: !state.isDriveMode })),
      setDriveMode: (val) => set({ isDriveMode: val }),
      setDriveState: (updates) => set((state) => ({ ...updates })),
      setCameraMode: (mode) => set({ cameraMode: mode }),
      setShowGpsMap: (val) => set((state) => ({ showGpsMap: typeof val === "boolean" ? val : !state.showGpsMap })),
      setIsHudVisible: (val) => set((state) => ({ isHudVisible: typeof val === "boolean" ? val : !state.isHudVisible })),

      setJourneyStatus: (status) => set({ journeyStatus: status }),


      setActiveJourney: (journey) =>
        set((state) => ({
          activeJourney: journey,
          journeyStatus: "active",
          routeType: state.passport.journeyPriority, // Auto-apply passport priority
          aiDisruption: false,
          aiApplied: false,
        })),

      clearJourney: () =>
        set({
          activeJourney: null,
          journeyStatus: "idle",
          aiDisruption: false,
          aiApplied: false,
        }),

      setRouteType: (type) => set({ routeType: type }),

      triggerAiDisruption: () => set({ aiDisruption: true }),

      applyAiRoute: () =>
        set({ routeType: "aiOptimized", aiApplied: true, aiDisruption: false }),

      setResolvedTheme: (theme) => set({ resolvedTheme: theme }),

      updatePassport: (updates) =>
        set((state) => {
          const newPassport = {
            ...state.passport,
            ...updates,
            mobility: {
              ...state.passport.mobility,
              ...(updates.mobility || {}),
            },
          };

          // If step-free is enabled, auto-set journey priority to accessible
          if (
            updates.mobility &&
            updates.mobility.stepFree &&
            newPassport.journeyPriority === "fastest"
          ) {
            newPassport.journeyPriority = "accessible";
          }

          // If journey priority changes and we have an active journey, update current routeType
          let routeOverride = {};
          if (updates.journeyPriority && state.activeJourney && !state.aiApplied) {
            routeOverride = { routeType: updates.journeyPriority };
          }
          // Also apply auto accessible fallback if step-free was turned on during a journey
          if (updates.mobility && updates.mobility.stepFree && state.activeJourney && !state.aiApplied) {
            routeOverride = { routeType: "accessible" };
          }

          return { passport: newPassport, ...routeOverride };
        }),
    }),
    {
      name: "nexus-passport-storage",
      partialize: (state) => ({ passport: state.passport }), // Only persist passport
    }
  )
);
