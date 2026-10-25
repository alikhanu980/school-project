// All copy below is taken from thinkwellinternational.com (scraped 2026-10-19).

export const school = {
  name: "Think Well International",
  motto: ["Knowledge", "Character", "Leadership"],
  hero: "A School Built Around the Child",
  positioning: ["Pre-School to O / A Level", "Cambridge Pathway", "Admissions Open 2026–2027"],
  heroLede: "Academics matter — and so does the person behind the achievement. Real-world capability, creative courage and the drive to lead.",
  address: "14 – Shahrah-e-Fatima Jinnah Road (Queen's Road), Lahore",
  hours: [
    ["Monday – Friday", "8:00 am – 3:00 pm"],
    ["Saturday", "9:00 am – 1:00 pm"],
  ],
  regFee: "Rs. 5,000/–",
};

export const ceo = {
  name: "Mr. Umar Khan Dawar",
  role: "CEO & Principal, Think Well International",
  photo: "/img/ceo-principal-umar-khan-dawar.jpg",
  quote:
    "Academic success is only the starting point. Our children need real-world capability, creative courage and the drive to lead. Perhaps education today needs the courage to take the road less travelled — and that is the road we have chosen.",
};

export const aim = {
  eyebrow: "Our aim",
  title: "Thinkers. People of purpose. Future leaders.",
  body: "We pair a rigorous Cambridge pathway with hands-on enterprise, farm life and future skills — so that every child leaves us able to think clearly, act with integrity and lead others. Small classes, individual attention and a close parent partnership at every stage.",
  pillars: [
    { name: "Knowledge", tag: "Cambridge pathway", body: "Strong academics, a clear Cambridge progression and real-world learning that makes lessons stick.", icon: "📘", color: "#5AB4F0" },
    { name: "Character", tag: "Ethics & manners", body: "Respect, responsibility, honesty and service are practised — not merely displayed on a wall.", icon: "🤝", color: "#3CC8A0" },
    { name: "Leadership", tag: "Initiative & service", body: "Clubs, public speaking, arts and community projects give every student the chance to lead.", icon: "🦁", color: "#C9A24B" },
  ],
};

export const vision =
  "To raise a generation that is academically excellent, morally grounded and practically capable — young people who can think for themselves, build things of value and serve the community they belong to.";
export const mission =
  "To deliver the Cambridge curriculum with unusual care, and to surround it with four pillars — Islamic character, entrepreneurship, skills and farm education — so that learning always has somewhere real to land.";

export type Stage = {
  n: string;
  name: string;
  ages: string;
  motto: string;
  blurb: string;
  color: string;
  emoji: string;
  pillars: { name: string; focus: string; items: string[] }[];
};

export const stages: Stage[] = [
  {
    n: "01",
    name: "Early Years",
    ages: "Ages 3–5 · Pre-School",
    motto: "Discover • Explore • Belong",
    blurb: "Play-based learning, foundational character and the individual attention a strong start requires — with the farm, the market and the classroom all in reach from day one.",
    color: "#FF8FA3",
    emoji: "🧸",
    pillars: [
      { name: "Islamic Character Development", focus: "Foundational Adab & values", items: ["Moral storytelling", "Daily routines and etiquette (Adab)", "Simple Duas and their meanings", "Kindness towards others", "Sharing and taking turns", "Practising gratitude"] },
      { name: "Entrepreneurship Education", focus: "Understanding choices & exchange", items: ["Play-store activities", "Sharing classroom resources", "Buying and selling play games", "Recognising fair exchange"] },
      { name: "Skills Education", focus: "Communication & early development", items: ["Communication and expression", "Sensory play", "Motor and emotional skills", "Storytelling", "Art and movement", "Group interaction"] },
      { name: "Farm Education", focus: "Sensory exploration", items: ["Planting seeds", "Soil sensory play", "Safely feeding farm animals", "Observing growth and nature"] },
    ],
  },
  {
    n: "02",
    name: "Primary Level",
    ages: "Ages 6–10 · Class I–V",
    motto: "Learn • Question • Create",
    blurb: "Strong academic foundations enriched by financial literacy, digital skills and real responsibility for the garden beds and the classroom market.",
    color: "#FFC83D",
    emoji: "✏️",
    pillars: [
      { name: "Islamic Character Development", focus: "Quranic moral stories & Seerah", items: ["Quranic moral stories", "Seerah examples", "Role-play of ethical situations", "Classroom responsibilities", "Building honesty (Amanah)", "Developing empathy"] },
      { name: "Entrepreneurship Education", focus: "Financial literacy", items: ["Budget games", "Mini classroom markets", "Team projects", "Saving and spending concepts", "Solution-focused thinking"] },
      { name: "Skills Education", focus: "Foundational academic & digital skills", items: ["Creative writing", "Teamwork", "Presentations", "Analytical activities", "Safe and confident digital use"] },
      { name: "Farm Education", focus: "Life cycles & gardening", items: ["Managing garden beds", "Plant and animal life cycle observation", "Crop harvesting", "Nutrition and where food comes from"] },
    ],
  },
  {
    n: "03",
    name: "Middle School",
    ages: "Ages 11–13 · Class VI–VIII",
    motto: "Think • Investigate • Understand",
    blurb: "Critical research, coding, design thinking and sustainable systems — with growing independence and a clear expectation of accountability.",
    color: "#3CC8A0",
    emoji: "🔬",
    pillars: [
      { name: "Islamic Character Development", focus: "Accountability & ethical decision making", items: ["Muhasabah (self-reflection)", "Discussions on digital behaviour", "Friendship ethics", "Social responsibility", "Weighing consequences before acting"] },
      { name: "Entrepreneurship Education", focus: "Innovation & business foundations", items: ["Design thinking", "Simple market research", "Social entrepreneurship", "Business models", "Basic financial planning"] },
      { name: "Skills Education", focus: "Critical & media literacy", items: ["Coding basics", "Research tasks", "Media analysis", "Structured problem solving", "Public speaking"] },
      { name: "Farm Education", focus: "Sustainable systems & agricultural science", items: ["Composting", "Drip-irrigation design", "Soil pH testing", "Biodiversity studies", "Water conservation projects"] },
    ],
  },
  {
    n: "04",
    name: "O Level",
    ages: "Ages 14–16 · Cambridge",
    motto: "Achieve • Lead • Contribute",
    blurb: "The rigorous Cambridge pathway alongside real enterprise, research methodology and agribusiness — building independent, capable young leaders.",
    color: "#5AB4F0",
    emoji: "🎓",
    pillars: [
      { name: "Islamic Character Development", focus: "Contemporary ethics, leadership & civic responsibility", items: ["Ethical dilemmas", "Social justice projects", "Debate", "Islamic reflection", "Leading by example"] },
      { name: "Entrepreneurship Education", focus: "Practical enterprise & strategic thinking", items: ["Business plan creation", "Pitching", "Micro-enterprises", "Digital marketing", "Risk management", "Business ethics"] },
      { name: "Skills Education", focus: "Research methodology & data literacy", items: ["Advanced leadership", "Presentation skills", "Career readiness", "Complex multidisciplinary projects"] },
      { name: "Farm Education", focus: "Agribusiness & agricultural technology", items: ["Hydroponics and aquaponics", "Crop-yield data analysis", "Farm budgeting", "Supply-chain studies", "Farm-to-market projects"] },
    ],
  },
];

export const AGE_GROUPS = ["Early Years", "Primary & Middle", "O / A Levels"] as const;

export const programmes = [
  {
    n: "01",
    name: "Islamic Values & Spiritual Character",
    tag: "At the heart of Think Well",
    body: "Islamic principles, moral reasoning, respect and community service woven into daily student life at every age.",
    emoji: "🌙",
    color: "#3CC8A0",
    byAge: [
      ["Daily duas and their meanings", "Etiquettes of speech (Adab)", "Moral storytelling", "Basic Islamic manners"],
      ["Seerah workshops", "Understanding Quranic ethics", "Daily congregational prayer etiquette", "Community charity drives"],
      ["Applied Islamic ethics in modern leadership", "Moral reasoning in global debate", "Community mentorship roles"],
    ],
  },
  {
    n: "02",
    name: "Life at the Farm",
    tag: "Outdoor & environmental · All year groups",
    body: "Outdoor and environmental learning: hands-on animal care, growing food and real responsibility for living things.",
    emoji: "🌱",
    color: "#8BC34A",
    byAge: [
      ["Feeding and observing rabbits and parrots", "Tactile soil and sensory play", "Naming and caring for animals"],
      ["Gardening and plant life cycles", "Weekly responsibility schedules", "Maths through animal counting and feed quantities"],
      ["Agricultural science", "Ecology and biodiversity projects", "Campus sustainability management"],
    ],
  },
  {
    n: "03",
    name: "Think Well Market & Entrepreneurship",
    tag: "Enterprise · Termly market days",
    body: "A student-run marketplace where enterprise is learned by doing: pricing, budgeting, selling and reinvesting.",
    emoji: "🛍️",
    color: "#FF9F43",
    byAge: [
      ["Roleplay market stalls", "Counting pretend currency", "Sharing and fair trade"],
      ["Real-world budgeting", "Planning product pricing", "Running actual market stalls", "Basic profit and loss concepts"],
      ["Business plan execution", "Marketing and brand building", "Running campus ventures", "Allocating profits to social impact projects"],
    ],
  },
  {
    n: "04",
    name: "AI, Robotics & Future Skills",
    tag: "Future skills · Weekly lab sessions",
    body: "Digital literacy and computational thinking, introduced progressively and taught with hardware in hand.",
    emoji: "🤖",
    color: "#7C8CFF",
    byAge: [
      ["Screen-light logic games and sequencing", "Cause-and-effect play with simple machines"],
      ["Digital literacy and safe use", "Block coding into text coding", "Hands-on robotics builds", "Age-appropriate AI exposure"],
      ["Computer science pathway", "Applied AI projects and prompt literacy", "Robotics competitions and engineering design"],
    ],
  },
  {
    n: "05",
    name: "Sport & Physical Leadership",
    tag: "Physical leadership · Daily games",
    body: "Structured sport for discipline, fitness, resilience and the everyday leadership that team play demands.",
    emoji: "⚽",
    color: "#FF6B5B",
    byAge: [
      ["Gross motor skill development", "Cooperative games and turn-taking"],
      ["Inter-house competitive sport", "Physical discipline and routine", "Teamwork and fair play"],
      ["Team captaincy and coaching juniors", "Resilience and performance training", "Organising school tournaments"],
    ],
  },
];

export const facilities = [
  { name: "Science & robotics labs", emoji: "🔭" },
  { name: "Art and media spaces", emoji: "🎨" },
  { name: "On-campus farm & eco-zone", emoji: "🐇" },
  { name: "Athletic grounds", emoji: "🏃" },
  { name: "Entrepreneurship hub", emoji: "💡" },
  { name: "Library & reading rooms", emoji: "📚" },
];

export const steps = [
  { name: "Register", body: "Complete and submit the online registration form with the registration fee." },
  { name: "Interview & readiness assessment", body: "Once registered, you receive an interview and assessment date for your child." },
  { name: "Final confirmation", body: "The assessment determines readiness, and we confirm your child's place." },
];

export const documents = ["CNIC copies of both parents", "B-Form of the child", "Vaccination card", "Previous school report, if any"];

export const faqs = [
  { q: "When do admissions for 2026–2027 open?", a: "Registrations are open now. Places are confirmed on a rolling basis as assessments are completed, so early registration is advisable — particularly for the Early Years and O Level entry points." },
  { q: "What does the readiness assessment involve?", a: "It is a short, friendly session appropriate to your child's age — early years is largely observational play, while older applicants complete a brief written assessment in English and Mathematics followed by an interview with parents present." },
  { q: "Is the registration fee refundable?", a: "No. The Rs. 5,000/– registration fee is non-refundable and is separate from tuition. It covers processing, assessment and interview scheduling." },
  { q: "How is Islamic education handled alongside the Cambridge curriculum?", a: "It is integrated rather than bolted on: duas and adab in the early years, Seerah and Quranic ethics through primary and middle school, and applied Islamic ethics in leadership and debate at O and A Level." },
  { q: "How large are the classes?", a: "Classes are deliberately small so that teachers can act as mentors and track each child individually. Exact section sizes vary by year group — our admissions team will confirm the current numbers for your child's entry point." },
];

export const enquiryTopics = ["Admissions & availability", "Fee structure", "Booking a campus visit", "Transport", "Careers at Think Well", "Something else"];

/** Real activities from the curriculum pages, used for the ticker. */
export const ticker = [
  "Planting seeds",
  "Hands-on robotics builds",
  "Termly market days",
  "Seerah workshops",
  "Feeding rabbits & parrots",
  "Public speaking",
  "Hydroponics & aquaponics",
  "Inter-house sport",
  "Block coding",
  "Design thinking",
  "Moral storytelling",
  "Business pitching",
];
