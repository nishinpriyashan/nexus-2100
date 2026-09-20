export const routes = {
  fastest: {
    id: 'fastest',
    label: 'FASTEST',
    duration: 41,
    arrival: "08:23",
    confidence: 98.7,
    modes: 3,
    transfers: 1,
    description: "Optimal speed path.",
    nodes: [
      { time: '07:42', mode: 'Autonomous Shuttle', status: 'completed' },
      { time: '07:51', mode: 'Maglev Express', status: 'active' },
      { time: '08:24', mode: 'AeroLink', status: 'pending' },
      { time: '08:23', mode: 'Destination', status: 'end' } // Arrival
    ]
  },
  accessible: {
    id: 'accessible',
    label: 'ACCESSIBLE',
    duration: 47,
    arrival: "08:29",
    confidence: 99.1,
    modes: 2,
    transfers: 0,
    description: "100% step-free. Low-floor boarding. Lift availability verified.",
    nodes: [
      { time: '07:42', mode: 'Accessible Shuttle', status: 'completed' },
      { time: '08:01', mode: 'Smart Transit', status: 'active' },
      { time: '08:29', mode: 'Destination', status: 'end' }
    ]
  },
  eco: {
    id: 'eco',
    label: 'ECO',
    duration: 52,
    arrival: "08:34",
    confidence: 97.4,
    modes: 2,
    transfers: 1,
    description: "92% lower projected emissions. Rail prioritized.",
    nodes: [
      { time: '07:42', mode: 'Electric Tram', status: 'completed' },
      { time: '08:12', mode: 'Eco-Rail', status: 'active' },
      { time: '08:34', mode: 'Destination', status: 'end' }
    ]
  },
  aiOptimized: {
    id: 'aiOptimized',
    label: 'AI OPTIMIZED',
    duration: 33, // 8 min saved
    arrival: "08:23", // Assuming current arrival was 08:31, wait, brief says current arrival 08:31, ai alternative 08:23, 8 min saved. So duration was 49, now 41? Let's use 41 min for AI route, and current fastest was 49 min... Wait, the prompt says fastest is 41 min. If fastest is 41, and AI alternative saves 8 mins, it would be 33 mins.
    confidence: 99.8,
    modes: 3,
    transfers: 1,
    description: "AI congestion avoidance applied.",
    nodes: [
      { time: '07:42', mode: 'Autonomous Shuttle', status: 'completed' },
      { time: '07:51', mode: 'AeroLink Alpha', status: 'active' },
      { time: '08:15', mode: 'Smart Road Network', status: 'pending' },
      { time: '08:23', mode: 'Destination', status: 'end' }
    ]
  }
};
