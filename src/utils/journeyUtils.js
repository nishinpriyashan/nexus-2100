/**
 * NEXUS 2100 - Journey Utility Functions
 * Central source of derived journey data to ensure consistency across all components.
 */

/**
 * Returns the active transport mode label given a route and a progress [0,1].
 */
export function getActiveMode(route, progress) {
  if (!route || !route.nodes) return "Unknown";
  const idx = Math.min(
    Math.floor(progress * (route.nodes.length - 1)),
    route.nodes.length - 2
  );
  return route.nodes[idx]?.mode || route.nodes[0]?.mode || "Unknown";
}

/**
 * Returns the next transport mode label.
 */
export function getNextMode(route, progress) {
  if (!route || !route.nodes) return null;
  const idx = Math.min(
    Math.floor(progress * (route.nodes.length - 1)),
    route.nodes.length - 2
  );
  const next = route.nodes[idx + 1];
  return next && next.mode !== "Destination" ? next.mode : null;
}

/**
 * Returns remaining minutes based on progress and route duration.
 */
export function getRemainingMinutes(route, progress) {
  if (!route) return 0;
  return Math.max(1, Math.ceil((1 - progress) * route.duration));
}

/**
 * Returns simulated current speed (km/h) with slight natural variance.
 */
export function getSimulatedSpeed(progress) {
  return Math.round(300 + Math.sin(progress * 30) * 15);
}

/**
 * Returns simulated distance remaining (km).
 */
export function getDistanceRemaining(progress, totalDistance = 45.2) {
  return Math.max(0, totalDistance * (1 - progress)).toFixed(1);
}

/**
 * Returns a percentage string from progress [0,1].
 */
export function progressToPercent(progress) {
  return Math.round(Math.min(progress, 1) * 100);
}
