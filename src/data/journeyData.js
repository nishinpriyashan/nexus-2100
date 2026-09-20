/**
 * NEXUS 2100 — Journey Data
 *
 * Single source of truth for all route information.
 * All components derive their displayed values from these objects.
 *
 * KEY DATA FIX:
 *   - fastest.arrival = "08:31" (not 08:23)
 *   - aiOptimized.arrival = "08:23" (saves 8 minutes over fastest)
 *   This ensures the PredictiveAI panel message is internally consistent.
 */

export const routes = {
  fastest: {
    id: "fastest",
    label: "FASTEST",
    icon: "zap",
    duration: 49,
    departure: "07:42",
    arrival: "08:31",
    confidence: 98.7,
    modes: 3,
    transfers: 1,
    distance: 45.2,
    description: "Optimal speed path via Maglev Express and AeroLink.",
    nodes: [
      {
        time: "07:42",
        mode: "Autonomous Shuttle",
        id: "NX-S14",
        platform: "Bay 3",
        duration: "9 min",
        description: "Low-floor boarding. Step-free access available.",
        status: "completed",
      },
      {
        time: "07:51",
        mode: "Rotterdam Mobility Hub",
        id: null,
        platform: "Transfer Level B",
        duration: "5 min transfer",
        description: "Transfer to Maglev. Platform 7 via lift.",
        status: "transfer",
      },
      {
        time: "07:56",
        mode: "Maglev Express",
        id: "NX-M7",
        platform: "Platform 7",
        duration: "20 min",
        description: "High-speed magnetic levitation. 312 km/h.",
        status: "active",
      },
      {
        time: "08:16",
        mode: "Amsterdam Mobility Grid",
        id: null,
        platform: "Gate A",
        duration: "3 min transfer",
        description: "Connect to AeroLink terminal.",
        status: "pending",
      },
      {
        time: "08:19",
        mode: "AeroLink",
        id: "A-12",
        platform: "Gate A12",
        duration: "12 min",
        description: "Urban aerial mobility. Autonomous flight path.",
        status: "pending",
      },
      {
        time: "08:31",
        mode: "Destination",
        id: null,
        platform: "Amsterdam Central",
        duration: null,
        description: "Arrival at Amsterdam Central Mobility Hub.",
        status: "end",
      },
    ],
  },

  accessible: {
    id: "accessible",
    label: "ACCESSIBLE",
    icon: "accessibility",
    duration: 47,
    departure: "07:42",
    arrival: "08:29",
    confidence: 99.1,
    modes: 2,
    transfers: 0,
    distance: 42.8,
    description: "100% step-free. Low-floor boarding. Lift availability verified.",
    accessibilityFeatures: [
      "Step-free stations",
      "Lift availability confirmed",
      "Low-floor boarding",
      "Accessible transfer areas",
      "Priority seating available",
    ],
    nodes: [
      {
        time: "07:42",
        mode: "Accessible Shuttle",
        id: "NX-AS4",
        platform: "Bay 1 (Accessible)",
        duration: "19 min",
        description: "Wide-door accessible vehicle. Ramp boarding. Priority seating.",
        status: "completed",
      },
      {
        time: "08:01",
        mode: "Smart Transit Line 4",
        id: "ST-4",
        platform: "Platform 2A (Step-Free)",
        duration: "28 min",
        description: "Full step-free access. Dedicated accessibility coach.",
        status: "active",
      },
      {
        time: "08:29",
        mode: "Destination",
        id: null,
        platform: "Amsterdam Accessibility Hub",
        duration: null,
        description: "Arrival at step-free entrance. Lift access to street level.",
        status: "end",
      },
    ],
  },

  eco: {
    id: "eco",
    label: "ECO",
    icon: "leaf",
    duration: 52,
    departure: "07:42",
    arrival: "08:34",
    confidence: 97.4,
    modes: 2,
    transfers: 1,
    distance: 43.5,
    description: "92% lower projected emissions. Rail transport prioritized.",
    ecoStats: {
      emissionsSaved: "4.2 kg CO₂",
      renewableEnergy: "94%",
    },
    nodes: [
      {
        time: "07:42",
        mode: "Electric Tram",
        id: "T-8",
        platform: "Stop 14",
        duration: "30 min",
        description: "Solar-powered electric tram. Zero direct emissions.",
        status: "completed",
      },
      {
        time: "08:12",
        mode: "The Hague Hub",
        id: null,
        platform: "Transfer Point C",
        duration: "4 min transfer",
        description: "Transfer to Eco-Rail.",
        status: "transfer",
      },
      {
        time: "08:16",
        mode: "Eco-Rail",
        id: "ER-22",
        platform: "Platform 5",
        duration: "18 min",
        description: "Hydrogen-powered rail. 94% renewable energy.",
        status: "pending",
      },
      {
        time: "08:34",
        mode: "Destination",
        id: null,
        platform: "Amsterdam Green Hub",
        duration: null,
        description: "Arrival at Amsterdam Green Mobility Hub.",
        status: "end",
      },
    ],
  },

  aiOptimized: {
    id: "aiOptimized",
    label: "AI OPTIMIZED",
    icon: "cpu",
    duration: 41,
    departure: "07:42",
    arrival: "08:23",
    confidence: 99.8,
    modes: 3,
    transfers: 1,
    distance: 44.1,
    description: "AI congestion avoidance applied. Bypassing Node A17.",
    aiNote: "NEXUS rerouted via AeroLink Alpha, bypassing Mobility Node A17 congestion. 8 minutes saved.",
    nodes: [
      {
        time: "07:42",
        mode: "Autonomous Shuttle",
        id: "NX-S14",
        platform: "Bay 3",
        duration: "9 min",
        description: "Express boarding. AI-optimized departure timing.",
        status: "completed",
      },
      {
        time: "07:51",
        mode: "AeroLink Alpha",
        id: "AA-7",
        platform: "Gate Alpha-7",
        duration: "24 min",
        description: "AI-selected aerial route. Bypasses Node A17 congestion.",
        status: "active",
      },
      {
        time: "08:15",
        mode: "Smart Road Express",
        id: "SR-3",
        platform: "Drop Zone C",
        duration: "8 min",
        description: "Autonomous vehicle final mile delivery.",
        status: "pending",
      },
      {
        time: "08:23",
        mode: "Destination",
        id: null,
        platform: "Amsterdam Central",
        duration: null,
        description: "Arrival — 8 minutes ahead of original schedule.",
        status: "end",
      },
    ],
  },
};

/** All valid route IDs for type checking */
export const ROUTE_IDS = Object.keys(routes);

/** The canonical demo journey */
export const DEMO_JOURNEY = {
  from: "Naaldwijk",
  to: "Amsterdam",
};
