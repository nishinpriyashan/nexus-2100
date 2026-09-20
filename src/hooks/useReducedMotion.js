import { useEffect, useState } from "react";
import { useJourneyStore } from "../store/journeyStore";

/**
 * Returns true if reduced motion is active (either via OS preference or user toggle).
 * Also syncs OS preference into the Zustand store on mount.
 */
export function useReducedMotion() {
  const { passport, updatePassport } = useJourneyStore();
  const [osPrefersReduced, setOsPrefersReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => {
      setOsPrefersReduced(e.matches);
      // Sync OS preference into store only if store does not already override it
      if (e.matches && !passport.mobility.reducedMotion) {
        updatePassport({ mobility: { reducedMotion: true } });
      }
    };
    mq.addEventListener("change", handler);
    // Sync on mount
    if (mq.matches && !passport.mobility.reducedMotion) {
      updatePassport({ mobility: { reducedMotion: true } });
    }
    return () => mq.removeEventListener("change", handler);
  }, [passport.mobility.reducedMotion, updatePassport]);

  return passport.mobility.reducedMotion || osPrefersReduced;
}
