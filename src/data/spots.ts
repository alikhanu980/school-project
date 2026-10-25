// Hotspots on the 3D campus. Descriptions use wording from the school's curriculum pages.
export type Spot = { id: string; name: string; emoji: string; pos: [number, number, number]; body: string };

export const SPOTS: Spot[] = [
  { id: "school", name: "Main building & classrooms", emoji: "🏫", pos: [0, 2.6, -0.6], body: "Small classes, individual attention and teachers as mentors." },
  { id: "labs", name: "Science & robotics labs", emoji: "🔭", pos: [-3.3, 1.9, -1.4], body: "Weekly lab sessions: block coding into text coding, hands-on robotics builds and engineering design." },
  { id: "farm", name: "On-campus farm & eco-zone", emoji: "🐇", pos: [3.2, 1.1, 1.8], body: "Feeding rabbits and parrots, garden beds, crop harvesting, composting and hydroponics." },
  { id: "sport", name: "Athletic grounds", emoji: "⚽", pos: [-2.6, 0.9, 2.6], body: "Daily games, inter-house sport, team captaincy and school tournaments." },
  { id: "market", name: "Entrepreneurship hub", emoji: "🛍️", pos: [3.4, 1.2, -1.9], body: "Termly market days: pricing, budgeting, selling and reinvesting, run by students." },
  { id: "library", name: "Library & reading rooms", emoji: "📚", pos: [0.6, 1.4, 2.8], body: "Moral storytelling in the early years through to research methodology at O Level." },
];

