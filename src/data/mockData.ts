// Mock data for Prime Esports website

export const teams = [
  {
    id: "1",
    name: "Prime Valorant",
    game: "VALORANT",
    category: "FPS",
    logo: "🎯",
    description: "Our flagship tactical shooter team competing in VCT circuits.",
    achievements: ["VCT Champions 2024", "Masters Tokyo Runner-up"],
    roster: [
      { id: "1", name: "AceShot", role: "Duelist", country: "USA", image: "" },
      { id: "2", name: "SmokeScreen", role: "Controller", country: "Canada", image: "" },
      { id: "3", name: "IronWall", role: "Sentinel", country: "UK", image: "" },
      { id: "4", name: "FlashPoint", role: "Initiator", country: "Germany", image: "" },
      { id: "5", name: "Commander", role: "IGL", country: "France", image: "" },
    ],
  },
  {
    id: "2",
    name: "Prime League",
    game: "League of Legends",
    category: "MOBA",
    logo: "⚔️",
    description: "Dominating the Rift with strategic gameplay and team synergy.",
    achievements: ["LCS Spring Split Champions", "Worlds Quarter-finals"],
    roster: [
      { id: "6", name: "TopKing", role: "Top Lane", country: "Korea", image: "" },
      { id: "7", name: "JungleMaster", role: "Jungler", country: "China", image: "" },
      { id: "8", name: "MidGod", role: "Mid Lane", country: "Denmark", image: "" },
      { id: "9", name: "ADCarry", role: "Bot Lane", country: "USA", image: "" },
      { id: "10", name: "SupportKing", role: "Support", country: "Canada", image: "" },
    ],
  },
  {
    id: "3",
    name: "Prime CS",
    game: "Counter-Strike 2",
    category: "FPS",
    logo: "💥",
    description: "Tactical excellence and precision aim in every round.",
    achievements: ["ESL Pro League Season 18", "IEM Katowice Finalist"],
    roster: [
      { id: "11", name: "HeadHunter", role: "AWPer", country: "Sweden", image: "" },
      { id: "12", name: "EntryKing", role: "Entry Fragger", country: "Russia", image: "" },
      { id: "13", name: "Lurker", role: "Lurk", country: "Poland", image: "" },
      { id: "14", name: "Strat", role: "IGL", country: "Denmark", image: "" },
      { id: "15", name: "Anchor", role: "Support", country: "Germany", image: "" },
    ],
  },
  {
    id: "4",
    name: "Prime Fighters",
    game: "Street Fighter 6",
    category: "Fighting",
    logo: "👊",
    description: "The best fighting game players under one banner.",
    achievements: ["EVO 2024 Champion", "Capcom Cup Finalist"],
    roster: [
      { id: "16", name: "ComboKing", role: "Main", country: "Japan", image: "" },
      { id: "17", name: "Footsies", role: "Analyst", country: "USA", image: "" },
    ],
  },
  {
    id: "5",
    name: "Prime Apex",
    game: "Apex Legends",
    category: "FPS",
    logo: "🎮",
    description: "Battle royale excellence with unmatched teamwork.",
    achievements: ["ALGS Championship 2024", "Split 1 Champions"],
    roster: [
      { id: "18", name: "FragMachine", role: "Fragger", country: "USA", image: "" },
      { id: "19", name: "ScanMaster", role: "Recon", country: "Brazil", image: "" },
      { id: "20", name: "Captain", role: "IGL", country: "UK", image: "" },
    ],
  },
  {
    id: "6",
    name: "Prime Dota",
    game: "Dota 2",
    category: "MOBA",
    logo: "🏰",
    description: "Strategic masterminds conquering The International.",
    achievements: ["TI12 Top 4", "DPC Major Champions"],
    roster: [
      { id: "21", name: "Carry1", role: "Position 1", country: "China", image: "" },
      { id: "22", name: "MidMaster", role: "Position 2", country: "Russia", image: "" },
      { id: "23", name: "Offlaner", role: "Position 3", country: "Philippines", image: "" },
      { id: "24", name: "Support4", role: "Position 4", country: "USA", image: "" },
      { id: "25", name: "Captain5", role: "Position 5", country: "Europe", image: "" },
    ],
  },
];

export const tryouts = [
  {
    id: "1",
    team: "Prime Valorant",
    game: "VALORANT",
    position: "Substitute Player",
    requirements: "Immortal 3+ rank, 18+, fluent English",
    deadline: "2024-02-15",
    status: "open",
    description: "Looking for a versatile substitute player who can fill multiple roles.",
  },
  {
    id: "2",
    team: "Prime CS",
    game: "Counter-Strike 2",
    position: "Rifler",
    requirements: "Level 10 Faceit, previous team experience",
    deadline: "2024-02-20",
    status: "open",
    description: "Seeking an aggressive rifler with strong entry capabilities.",
  },
  {
    id: "3",
    team: "Prime League",
    game: "League of Legends",
    position: "Academy Top Laner",
    requirements: "Master+ rank, 16-21 years old",
    deadline: "2024-02-10",
    status: "closing_soon",
    description: "Building our academy roster with young talented players.",
  },
  {
    id: "4",
    team: "Prime Apex",
    game: "Apex Legends",
    position: "IGL / Fragger",
    requirements: "Predator rank, tournament experience required",
    deadline: "2024-03-01",
    status: "open",
    description: "Looking for an IGL who can also frag when needed.",
  },
];

export const news = [
  {
    id: "1",
    title: "Prime Valorant Wins VCT Americas!",
    excerpt: "Our VALORANT squad takes home the trophy after an incredible grand finals performance.",
    date: "2024-01-28",
    category: "Victory",
    image: "",
  },
  {
    id: "2",
    title: "New Roster Announcement: Prime CS",
    excerpt: "Welcoming two new players to strengthen our Counter-Strike lineup.",
    date: "2024-01-25",
    category: "Roster",
    image: "",
  },
  {
    id: "3",
    title: "Partnership with TechGear Pro",
    excerpt: "Excited to announce our new partnership with TechGear Pro for peripherals.",
    date: "2024-01-20",
    category: "Partnership",
    image: "",
  },
  {
    id: "4",
    title: "Tryouts Open for Multiple Teams",
    excerpt: "Looking for the next generation of talent. Apply now for open positions.",
    date: "2024-01-18",
    category: "Announcement",
    image: "",
  },
];

export const achievements = [
  { id: "1", title: "VCT Champions 2024", game: "VALORANT", year: "2024" },
  { id: "2", title: "LCS Spring Split", game: "League of Legends", year: "2024" },
  { id: "3", title: "ESL Pro League S18", game: "Counter-Strike 2", year: "2023" },
  { id: "4", title: "EVO 2024 Champion", game: "Street Fighter 6", year: "2024" },
  { id: "5", title: "ALGS Championship", game: "Apex Legends", year: "2024" },
  { id: "6", title: "TI12 Top 4", game: "Dota 2", year: "2023" },
];

export const sponsors = [
  { id: "1", name: "TechGear Pro", tier: "title" },
  { id: "2", name: "EnergyDrink X", tier: "title" },
  { id: "3", name: "GameChair Elite", tier: "premium" },
  { id: "4", name: "StreamSetup Co", tier: "premium" },
  { id: "5", name: "FastInternet ISP", tier: "partner" },
  { id: "6", name: "ProMonitor Inc", tier: "partner" },
];

export const staff = [
  { id: "1", name: "John Prime", role: "CEO & Founder", image: "" },
  { id: "2", name: "Sarah Chen", role: "COO", image: "" },
  { id: "3", name: "Mike Johnson", role: "Head of Esports", image: "" },
  { id: "4", name: "Emily Rodriguez", role: "Marketing Director", image: "" },
];

export const mockApplications = [
  {
    id: "1",
    tryoutId: "1",
    position: "Substitute Player",
    team: "Prime Valorant",
    status: "pending",
    appliedDate: "2024-01-20",
  },
  {
    id: "2",
    tryoutId: "3",
    position: "Academy Top Laner",
    team: "Prime League",
    status: "reviewed",
    appliedDate: "2024-01-15",
  },
];

export const mockAnnouncements = [
  {
    id: "1",
    title: "Practice Schedule Update",
    content: "New practice times starting next week. Check Discord for details.",
    date: "2024-01-28",
    priority: "normal",
  },
  {
    id: "2",
    title: "Upcoming Tournament",
    content: "We're participating in the Winter Championship. Prepare for bootcamp!",
    date: "2024-01-25",
    priority: "high",
  },
];
