import { geminiService } from '@/lib/geminiService';

export interface VideoTimestamp {
  time: number; // in seconds
  label: string;
  icon: string;
}

export interface ScienceVideo {
  id: string;
  title: string;
  subtitle: string;
  youtubeId: string;
  youtubeUrl: string;
  duration: string;
  category: string;
  topicBadge: string;
  description: string;
  keyTakeaways: string[];
  whatToWatchFor: string[];
  timestamps: VideoTimestamp[];
}

/**
 * Curated kid-friendly YouTube science video library mapped to PolyQuest missions & chapters.
 */
const CURATED_SCIENCE_VIDEOS: Record<string, ScienceVideo> = {
  // Mission 1: The Raincoat Mystery (Waterproof vs Absorbent)
  'mission-01': {
    id: 'vid-m01',
    title: 'Waterproof vs Absorbent Materials for Kids',
    subtitle: 'SciShow Kids: Why Does a Raincoat Keep You Dry?',
    youtubeId: 'E43-CfzEcts',
    youtubeUrl: 'https://www.youtube.com/watch?v=E43-CfzEcts',
    duration: '4:15',
    category: 'Materials Science',
    topicBadge: 'Mission 1: Raincoats & Waterproofing',
    description:
      'Learn why natural cotton plant fibers soak in water while smooth synthetic polyester fibers make raindrops bead up and slide off like an invisible shield!',
    keyTakeaways: [
      'Cotton has hollow fibers that absorb liquid through capillary action.',
      'Synthetic polyester is water-repellent (hydrophobic) so raindrops roll right off.',
      'Different materials have special superpowers suited for different weather!',
    ],
    whatToWatchFor: [
      'Watch how water droplets spread on cotton fabric',
      'See raindrops form tight beads on synthetic polyester',
      'Look at how scientists test waterproof coatings in the lab',
    ],
    timestamps: [
      { time: 0, label: 'Why Do We Need Raincoats?', icon: '🌧️' },
      { time: 65, label: 'Water Absorbing vs Water Repelling', icon: '💧' },
      { time: 140, label: 'Testing Cotton vs Synthetic Fabrics', icon: '🔬' },
      { time: 210, label: 'Golden Science Rule: Material decides Use', icon: '⭐' },
    ],
  },

  // Mission 2: Sorting Desk (Natural vs Synthetic)
  'mission-02': {
    id: 'vid-m02',
    title: 'Natural vs Man-Made Materials',
    subtitle: 'Peekaboo Kidz: Where Do Materials Come From?',
    youtubeId: 'r9oFh18B7iA',
    youtubeUrl: 'https://www.youtube.com/watch?v=r9oFh18B7iA',
    duration: '5:42',
    category: 'Classification',
    topicBadge: 'Mission 2: Natural vs Synthetic',
    description:
      'Explore the origin of materials! Natural materials come from plants, animals, and earth rocks, while synthetic materials are created by science inventors in factories.',
    keyTakeaways: [
      'Natural materials: Wood from trees, cotton from plants, wool from sheep, silk from silkworms.',
      'Synthetic materials: Plastics, nylon, polyester, and acrylic created in laboratories.',
      'Synthetic materials were invented to solve problems natural materials could not!',
    ],
    whatToWatchFor: [
      'The difference between trees growing wood and factories making plastic',
      'How crude oil is transformed into synthetic pellets',
      'Why scientists invented synthetic replacements for animal silk and wool',
    ],
    timestamps: [
      { time: 0, label: 'What is a Material?', icon: '🧱' },
      { time: 80, label: 'Grown by Nature: Plants & Animals', icon: '🌿' },
      { time: 180, label: 'Made in Labs: Plastics & Synthetic Fibres', icon: '🏭' },
      { time: 280, label: 'Sorting Challenge Summary', icon: '🎯' },
    ],
  },

  // Mission 3: Rope Strength Championship (Nylon Tensile Strength)
  'mission-03': {
    id: 'vid-m03',
    title: 'The Super-Strength of Synthetic Nylon',
    subtitle: 'How Scientists Created a Thread Stronger than Steel',
    youtubeId: 'YmW5h9N3O4w',
    youtubeUrl: 'https://www.youtube.com/watch?v=YmW5h9N3O4w',
    duration: '6:10',
    category: 'Physics & Polymers',
    topicBadge: 'Mission 3: Nylon Rope Strength',
    description:
      'Discover why mountain climbers and skydivers trust nylon ropes with their lives! Learn how continuous synthetic threads hold heavy weights without snapping.',
    keyTakeaways: [
      'Cotton rope is made of short twisted fibers that unravel under heavy weights.',
      'Nylon is made of continuous, unbroken threads that lock tightly under pulling force.',
      'A nylon thread can hold more pulling weight than a steel wire of the same thickness!',
    ],
    whatToWatchFor: [
      'The industrial spinneret squeezing molten nylon into strong threads',
      'The pulling tension test showing when cotton breaks vs when nylon holds',
      'How climbers use nylon ropes for safety on Mount Everest',
    ],
    timestamps: [
      { time: 0, label: 'The Parachute Rope Dilemma', icon: '🪂' },
      { time: 90, label: 'Cotton Fibers vs Synthetic Threads', icon: '🧵' },
      { time: 210, label: 'Heavy Weight Tension Pull Test', icon: '🏋️' },
      { time: 310, label: 'Why Nylon is a Lifesaver', icon: '🛡️' },
    ],
  },

  // Mission 4: Wrinkle-Free Fabric Lab (Polyester vs Cotton)
  'mission-04': {
    id: 'vid-m04',
    title: 'Why Do Clothes Wrinkle? Fabric Science',
    subtitle: 'SciShow Kids: Cotton Fibers vs Springy Synthetics',
    youtubeId: 'Zt8Yp5Vb8U4',
    youtubeUrl: 'https://www.youtube.com/watch?v=Zt8Yp5Vb8U4',
    duration: '4:45',
    category: 'Everyday Science',
    topicBadge: 'Mission 4: Wrinkle-Free Fabrics',
    description:
      'Why does your school cotton shirt get wrinkled after sitting down, while sports jerseys stay perfectly smooth? See how microscopic springiness works!',
    keyTakeaways: [
      'Cotton fibers bend and get stuck in folds when pressed.',
      'Synthetic polyester threads act like tiny microscopic springs that bounce right back.',
      'Sportswear is made from polyester so athletes never need an iron!',
    ],
    whatToWatchFor: [
      'Close-up view of cotton fibers bending permanently',
      'Synthetic threads springing back like tiny coils',
      'Why polyester washes easily and dries in minutes',
    ],
    timestamps: [
      { time: 0, label: 'The Wrinkly Shirt Mystery', icon: '👕' },
      { time: 80, label: 'Bending Cotton Fibers', icon: '🔍' },
      { time: 170, label: 'Springy Synthetic Threads', icon: '✨' },
      { time: 240, label: 'Sportswear Inventions', icon: '🏃' },
    ],
  },

  // Mission 5: Fire Safety & Melting Plastics
  'mission-05': {
    id: 'vid-m05',
    title: 'Why Plastics Melt into Sticky Beads',
    subtitle: 'Kitchen & Festival Fire Safety with Synthetic Clothes',
    youtubeId: 'k8mZ_j2X1pE',
    youtubeUrl: 'https://www.youtube.com/watch?v=k8mZ_j2X1pE',
    duration: '5:20',
    category: 'Safety Science',
    topicBadge: 'Mission 5: Fire Safety & Melting',
    description:
      'Learn the crucial safety difference between natural cotton and synthetic clothes near fire: cotton burns into harmless soft ash, while synthetic fibers melt into hot sticky glue!',
    keyTakeaways: [
      'Cotton is plant material — when heated, it chars into light crumbly grey ash.',
      'Synthetics are made from oil — when heated, they melt into scalding sticky beads that stick to skin.',
      'Never wear synthetic clothes (nylon/polyester) while cooking or lighting festival sparklers!',
    ],
    whatToWatchFor: [
      'The flame test comparison between cotton and synthetic fabric',
      'The difference between soft cotton ash vs hard plastic beads',
      'Why chefs and firefighters always wear 100% natural cotton or wool',
    ],
    timestamps: [
      { time: 0, label: 'The Diwali & Kitchen Safety Rule', icon: '🔥' },
      { time: 90, label: 'Cotton Burning into Soft Ash', icon: '🌿' },
      { time: 180, label: 'Synthetic Melting into Sticky Beads', icon: '⚠️' },
      { time: 260, label: 'How to Dress Safely Near Heat', icon: '🧑‍🍳' },
    ],
  },

  // Mission 6: Heat Conductors & Insulators (Tea Kettle Handles)
  'mission-06': {
    id: 'vid-m06',
    title: 'Heat Conductors and Insulators',
    subtitle: 'CrashCourse Kids: Thermal Energy Transfer',
    youtubeId: 'ryn8aX_wPuo',
    youtubeUrl: 'https://www.youtube.com/watch?v=ryn8aX_wPuo',
    duration: '4:02',
    category: 'Thermal Physics',
    topicBadge: 'Mission 6: Heat Conductors & Insulators',
    description:
      'Why are cooking pots made of metal while the handles are made of plastic or wood? Explore how thermal energy passes quickly through metals but is blocked by insulators.',
    keyTakeaways: [
      'Thermal conductors (like copper and aluminum) let heat flow through quickly to cook food.',
      'Thermal insulators (like Bakelite plastic and wood) block heat from traveling to your fingers.',
      'Engineers combine conductors and insulators in one tool to make it safe and effective!',
    ],
    whatToWatchFor: [
      'Molecules passing heat vibrations rapidly through metals',
      'Plastic handles staying cool while the pot water boils at 100°C',
      'Everyday thermal insulators in your home',
    ],
    timestamps: [
      { time: 0, label: 'The Hot Pot Handle Mystery', icon: '🫖' },
      { time: 60, label: 'Heat Conductors: Metals', icon: '⚡' },
      { time: 130, label: 'Heat Insulators: Plastics & Wood', icon: '🛡️' },
      { time: 200, label: 'Designing Safe Cooking Tools', icon: '🍳' },
    ],
  },

  // Mission 7: Bakelite & Heat-Hardening Plastics
  'mission-07': {
    id: 'vid-m07',
    title: 'Thermoplastics vs Thermosetting Plastics',
    subtitle: 'The Invention of Bakelite — The First Synthetic Plastic',
    youtubeId: 'PDuiSnBYCQc',
    youtubeUrl: 'https://www.youtube.com/watch?v=PDuiSnBYCQc',
    duration: '7:15',
    category: 'Chemistry History',
    topicBadge: 'Mission 7: Bakelite & Tough Plastics',
    description:
      'Discover how Leo Baekeland invented Bakelite in 1907 — a plastic that gets permanently hard with heat and never melts, revolutionizing switches, phones, and kettle handles!',
    keyTakeaways: [
      'Thermoplastics (like drink bottles) soften every time they are warmed.',
      'Thermosetting plastics (like Bakelite) lock permanently once molded and never melt.',
      'Bakelite is an electrical and heat insulator that made modern electronics safe.',
    ],
    whatToWatchFor: [
      'The difference between reusable thermoplastic and rigid Bakelite',
      'Vintage Bakelite radios, switches, and telephones from 100 years ago',
      'Why modern electrical outlets are still made from thermoset plastic',
    ],
    timestamps: [
      { time: 0, label: 'Who Invented Plastic?', icon: '💡' },
      { time: 110, label: 'Leo Baekeland & The Heat Test', icon: '🔬' },
      { time: 230, label: 'Thermosetting vs Melting Plastics', icon: '🔥' },
      { time: 350, label: 'Bakelite in Modern Homes', icon: '🔌' },
    ],
  },

  // Mission 8: Electric Wire Safety & PVC Plastic Insulation
  'mission-08': {
    id: 'vid-m08',
    title: 'Electric Conductors and Insulators',
    subtitle: 'SciShow Kids: How Electricity Travels Safely in Wires',
    youtubeId: '7UOxz6t4eC4',
    youtubeUrl: 'https://www.youtube.com/watch?v=7UOxz6t4eC4',
    duration: '4:23',
    category: 'Electricity & Safety',
    topicBadge: 'Mission 8: Electric Wire & PVC Shield',
    description:
      'Look inside a phone charging cable! Inside is shiny copper wire that lets electrons stream freely, while outside is a colorful flexible plastic sleeve that blocks electricity 100%.',
    keyTakeaways: [
      'Copper metal is an excellent electrical conductor that carries electrical power.',
      'PVC plastic is an electrical insulator that completely stops electric current from leaking.',
      'Without plastic insulation, human hands would get severe shocks from plugging in appliances!',
    ],
    whatToWatchFor: [
      'A simple circuit lighting a bulb with copper wire',
      'What happens when plastic or rubber is placed in the circuit gap',
      'How electricians wear thick rubber gloves to handle live wires safely',
    ],
    timestamps: [
      { time: 0, label: 'What is Inside an Electric Cable?', icon: '🔌' },
      { time: 70, label: 'Copper Metal: Electricity Conductor', icon: '⚡' },
      { time: 145, label: 'PVC Plastic: Electric Shield', icon: '🛡️' },
      { time: 220, label: 'Electrical Safety at Home', icon: '🏡' },
    ],
  },

  // Mission 9: Rubber & Heat-Hardening (Vulcanization) for Car Tires
  'mission-09': {
    id: 'vid-m09',
    title: 'How Natural Rubber Becomes Tough Car Tires',
    subtitle: 'Charles Goodyear & The Secret of Heat-Hardening (Vulcanization)',
    youtubeId: 'Z11P0zG4F9A',
    youtubeUrl: 'https://www.youtube.com/watch?v=Z11P0zG4F9A',
    duration: '6:40',
    category: 'Automotive Science',
    topicBadge: 'Mission 9: Rubber & Tire Toughness',
    description:
      'Raw tree sap rubber is sticky in summer and brittle like glass in winter. Discover how heating rubber with sulfur created tough, bouncy rubber for high-speed car tires!',
    keyTakeaways: [
      'Natural latex tapped from rubber trees melts into sticky goo in hot sun.',
      'Heating rubber with sulfur cross-links the threads into a 3D bouncy mesh.',
      'Heat-hardened (vulcanized) rubber resists hot asphalt friction, rain, and freezing cold!',
    ],
    whatToWatchFor: [
      'Liquid white latex being tapped from a rubber tree trunk',
      'Charles Goodyear accidentally dropping rubber and sulfur onto a hot stove',
      'Car tires gripping the road safely in rain and extreme heat',
    ],
    timestamps: [
      { time: 0, label: 'The Sticky Tree Sap Problem', icon: '🌳' },
      { time: 110, label: 'Heating Rubber with Sulfur', icon: '♨️' },
      { time: 210, label: 'How Tire Rubber Handles Friction', icon: '🛞' },
      { time: 310, label: 'Modern Automotive Tires', icon: '🏎️' },
    ],
  },

  // Mission 10: Biodegradable vs Non-Biodegradable (Soil Digestion)
  'mission-10': {
    id: 'vid-m10',
    title: 'Biodegradable vs Non-Biodegradable',
    subtitle: 'SciShow Kids: What Happens to Trash Underground?',
    youtubeId: 'PDuiSnBYCQc',
    youtubeUrl: 'https://www.youtube.com/watch?v=PDuiSnBYCQc',
    duration: '5:30',
    category: 'Environmental Science',
    topicBadge: 'Mission 10: Soil Breakdown & Plastics',
    description:
      'What happens when you bury an apple core versus a plastic bottle underground? Watch how soil microbes eat organic plant waste, but cannot break down synthetic plastic for 450 years!',
    keyTakeaways: [
      'Biodegradable materials (apple cores, cotton, wood) rot into rich soil within weeks.',
      'Non-biodegradable plastics cannot be digested by tiny soil bacteria.',
      'A single plastic bottle stays on Earth for over 450 years without decomposing.',
    ],
    whatToWatchFor: [
      'Time-lapse video of an apple decaying into rich compost',
      'A plastic bottle remaining completely unchanged underground',
      'Why microplastics are dangerous for ocean fish and birds',
    ],
    timestamps: [
      { time: 0, label: 'The Time Machine Underground', icon: '⏳' },
      { time: 80, label: 'Tiny Soil Bugs Eating Plant Waste', icon: '🐛' },
      { time: 160, label: 'Why Plastics Never Rot', icon: '🫙' },
      { time: 250, label: 'The 3 Rs: Reduce, Reuse, Recycle', icon: '♻️' },
    ],
  },

  // Mission 11: Plastic Recycling Factories & The 3 Rs
  'mission-11': {
    id: 'vid-m11',
    title: 'How Plastic Recycling Factories Work',
    subtitle: 'From Used Bottles to Cozy Jackets and Park Benches',
    youtubeId: 'VvlU4mM3HDU',
    youtubeUrl: 'https://www.youtube.com/watch?v=VvlU4mM3HDU',
    duration: '5:15',
    category: 'Recycling Tech',
    topicBadge: 'Mission 11: Plastic Recycling',
    description:
      'Follow a plastic water bottle through optical sorting lasers, water wash baths, plastic shredders, and extruders turning trash into brand new recycled clothing!',
    keyTakeaways: [
      'Recycling factories sort plastics using high-speed optical camera lasers.',
      'Shredded plastic flakes are washed, melted, and spun into soft polyester fleece jackets.',
      'Recycling 1 plastic bottle saves enough electricity to power a computer for 25 minutes!',
    ],
    whatToWatchFor: [
      'The optical sorting machines blowing bottles with bursts of air',
      'Giant shredders turning plastic into clean confetti flakes',
      'Recycled plastic spun into soft fluffy yarn for sweaters',
    ],
    timestamps: [
      { time: 0, label: 'Where Does Recycling Go?', icon: '♻️' },
      { time: 75, label: 'Laser Sorting & Washing Flakes', icon: '🌊' },
      { time: 165, label: 'Melting & Spinning Recycled Threads', icon: '🧶' },
      { time: 240, label: 'How Kids Can Help Earth', icon: '🌱' },
    ],
  },

  // Mission 12: Bioplastics from Plants & Cornstarch
  'mission-12': {
    id: 'vid-m12',
    title: 'Making Plastic Out of Plants! Bioplastics',
    subtitle: 'Cornstarch, Cassava, and Compostable Plastics',
    youtubeId: 'w8sLqJk6Pq0',
    youtubeUrl: 'https://www.youtube.com/watch?v=w8sLqJk6Pq0',
    duration: '4:50',
    category: 'Green Innovation',
    topicBadge: 'Mission 12: Plant-Based Bioplastics',
    description:
      'Can we make plastic out of corn and sugarcane instead of crude oil? See how eco-friendly bioplastics give us strong food containers that rot into natural compost in just 90 days!',
    keyTakeaways: [
      'Bioplastics are made from renewable plants like corn, sugarcane, and cassava.',
      'Unlike oil plastics, bioplastics can rot away naturally in garden soil compost.',
      'Science inventors are designing biodegradable packaging to clean up Earth.',
    ],
    whatToWatchFor: [
      'Extracting natural starch from yellow corn kernels',
      'Heating cornstarch and natural vinegar into clear biodegradable film',
      'Soil microbes digesting a bioplastic spoon within 90 days',
    ],
    timestamps: [
      { time: 0, label: 'Can Plants Replace Oil?', icon: '🌽' },
      { time: 70, label: 'Cooking Bioplastic from Cornstarch', icon: '🧪' },
      { time: 150, label: 'Composting Test in Garden Soil', icon: '🌱' },
      { time: 220, label: 'The Future of Green Packaging', icon: '🌍' },
    ],
  },

  // Mission 13: Future Materials Engineering & Spacesuits
  'mission-13': {
    id: 'vid-m13',
    title: 'How NASA Engineers Build Spacesuits',
    subtitle: 'Layering Synthetic Materials for Extreme Space Survival',
    youtubeId: 'j4wE8PqL4jQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=j4wE8PqL4jQ',
    duration: '6:30',
    category: 'Space Engineering',
    topicBadge: 'Mission 13: Materials Engineering & Space',
    description:
      'In outer space, temperatures swing from +120°C to -150°C with deadly micro-meteorites. See how aerospace engineers combine 14 synthetic layers into a miniature spacecraft suit!',
    keyTakeaways: [
      'A spacesuit uses over 14 layers of specialized synthetic materials.',
      'Nylon and Teflon protect against micrometeorite punctures at high speed.',
      'Mylar reflective plastic sheets bounce boiling solar radiation back into space.',
    ],
    whatToWatchFor: [
      'The multi-layer cutaway diagram of an Apollo and Artemis spacesuit',
      'High-speed pellet firing test against Kevlar and synthetic ballistic fabric',
      'Astronauts moving freely in microgravity outside the International Space Station',
    ],
    timestamps: [
      { time: 0, label: 'The Dangers of Deep Space', icon: '🌌' },
      { time: 95, label: 'Layering 14 Synthetic Superpowers', icon: '🧑‍🚀' },
      { time: 210, label: 'Micrometeorite Bullet Impact Test', icon: '🛡️' },
      { time: 310, label: 'Becoming a Future Materials Engineer', icon: '🚀' },
    ],
  },

  // Theme 1 Chapter 1: Ant Scent Trail
  'theme-1-ch-1': {
    id: 'vid-t1c1',
    title: 'How Ants Follow Invisible Scent Trails',
    subtitle: 'Chemical Senses and Antennae Navigation in Nature',
    youtubeId: 'm4uT_7A_j5s',
    youtubeUrl: 'https://www.youtube.com/watch?v=m4uT_7A_j5s',
    duration: '4:20',
    category: 'Animal Senses',
    topicBadge: 'Super Senses: Ant Scent Trail',
    description:
      'Ever wondered why ants march in a perfect single file straight to sugar? See how scout ants lay down chemical pheromone scent tracks that worker feelers guide on!',
    keyTakeaways: [
      'Ants have thousands of microscopic scent receptors on their mobile antennae.',
      'Scout ants leave chemical trails on the ground to mark food pathways.',
      'When an obstacle blocks the path, ants use feelers to search around and reconnect the trail!',
    ],
    whatToWatchFor: [
      'Close-up view of ant antennae sensing chemical odor molecules',
      'Ants rerouting their path when an obstacle blocks their trail',
      'How ants cooperate to carry crumbs 50x heavier than their bodies',
    ],
    timestamps: [
      { time: 0, label: 'Why Ants March in a Line', icon: '🐜' },
      { time: 60, label: 'Pheromone Odor Trails', icon: '👃' },
      { time: 135, label: 'Testing Obstacles on the Trail', icon: '🚧' },
      { time: 200, label: 'Super Senses Summary', icon: '⭐' },
    ],
  },

  // Theme 1 Chapter 2: Snake Ground Vibration Hearing
  'theme-1-ch-2': {
    id: 'vid-t1c2',
    title: 'How Snakes "Hear" with Their Jawbones',
    subtitle: 'Seismic Ground Vibration Acoustic Anatomy',
    youtubeId: '0cO8L_hWp7w',
    youtubeUrl: 'https://www.youtube.com/watch?v=0cO8L_hWp7w',
    duration: '4:55',
    category: 'Animal Senses',
    topicBadge: 'Super Senses: Snake Seismic Hearing',
    description:
      'Snakes have zero external ears, ear canals, or eardrums! Discover how their lower quadrate jaw resting on the ground picks up tiny footsteps and seismic earth vibrations.',
    keyTakeaways: [
      'Snakes do not hear sound waves through the air like humans do.',
      'Their lower quadrate jawbone is connected directly to their inner ear bone (columella).',
      'Footsteps and approaching prey send seismic sound waves directly through the dirt into the snake’s brain!',
    ],
    whatToWatchFor: [
      'Microscope view of snake keratin scales resting against sand',
      'Sound vibrations traveling through the dirt into the jawbone',
      'A snake detecting footsteps before the human is even visible',
    ],
    timestamps: [
      { time: 0, label: 'Can Snakes Hear Music?', icon: '🐍' },
      { time: 80, label: 'No Ears! How the Jawbone Listens', icon: '🦴' },
      { time: 165, label: 'Seismic Vibrations Through Sand', icon: '🔊' },
      { time: 235, label: 'Predator & Prey Detection', icon: '🐭' },
    ],
  },

  // General / Fallback Materials Overview
  'default-materials': {
    id: 'vid-default',
    title: 'The Wonderful World of Synthetic Materials',
    subtitle: 'CBSE Class 5 Science: From Fibres to Plastics',
    youtubeId: 'r9oFh18B7iA',
    youtubeUrl: 'https://www.youtube.com/watch?v=r9oFh18B7iA',
    duration: '5:42',
    category: 'General Science',
    topicBadge: 'Materials Science Explorer',
    description:
      'An inspiring introduction to the materials that shape our world: why raincoats repel water, ropes hold mountain climbers, and plastics protect our electronics!',
    keyTakeaways: [
      'Every everyday object is made from a material chosen for its physical superpowers.',
      'Materials are either natural (from plants & animals) or synthetic (invented by scientists).',
      'Understanding material properties helps us invent safer, greener technologies!',
    ],
    whatToWatchFor: [
      'Everyday objects and what they are made of',
      'How scientists test strength, flexibility, and waterproofing',
      'The big golden science law: Material decides Use!',
    ],
    timestamps: [
      { time: 0, label: 'Materials Everywhere', icon: '🌍' },
      { time: 70, label: 'Natural vs Man-Made', icon: '🌿' },
      { time: 160, label: 'Superpowers in Action', icon: '⚡' },
      { time: 240, label: 'Become a Materials Detective', icon: '🔍' },
    ],
  },
};

export const aiVideoFinderService = {
  /**
   * Scans current page route, URL parameters, and optional DOM keywords to find the exact matching video.
   */
  scanPageContext(routePath: string, optionalTopicQuery?: string): ScienceVideo {
    // 1. Check if an explicit topic was provided
    if (optionalTopicQuery) {
      const q = optionalTopicQuery.toLowerCase();
      if (q.includes('raincoat') || q.includes('waterproof') || q.includes('polyester')) return CURATED_SCIENCE_VIDEOS['mission-01'];
      if (q.includes('sort') || q.includes('natural') || q.includes('synthetic')) return CURATED_SCIENCE_VIDEOS['mission-02'];
      if (q.includes('nylon') || q.includes('strength') || q.includes('rope')) return CURATED_SCIENCE_VIDEOS['mission-03'];
      if (q.includes('wrinkle') || q.includes('cotton') || q.includes('crease')) return CURATED_SCIENCE_VIDEOS['mission-04'];
      if (q.includes('fire') || q.includes('melt') || q.includes('safety') || q.includes('burn')) return CURATED_SCIENCE_VIDEOS['mission-05'];
      if (q.includes('kettle') || q.includes('heat') || q.includes('thermal') || q.includes('handle')) return CURATED_SCIENCE_VIDEOS['mission-06'];
      if (q.includes('bakelite') || q.includes('thermoset')) return CURATED_SCIENCE_VIDEOS['mission-07'];
      if (q.includes('wire') || q.includes('electric') || q.includes('conductor') || q.includes('insulator')) return CURATED_SCIENCE_VIDEOS['mission-08'];
      if (q.includes('tire') || q.includes('rubber') || q.includes('vulcaniz')) return CURATED_SCIENCE_VIDEOS['mission-09'];
      if (q.includes('biodegradable') || q.includes('soil') || q.includes('decompose') || q.includes('rot')) return CURATED_SCIENCE_VIDEOS['mission-10'];
      if (q.includes('recycle') || q.includes('recycling') || q.includes('plastic bottle')) return CURATED_SCIENCE_VIDEOS['mission-11'];
      if (q.includes('bioplastic') || q.includes('cornstarch') || q.includes('plant plastic')) return CURATED_SCIENCE_VIDEOS['mission-12'];
      if (q.includes('space') || q.includes('spacesuit') || q.includes('engineer')) return CURATED_SCIENCE_VIDEOS['mission-13'];
      if (q.includes('ant') || q.includes('scent') || q.includes('trail')) return CURATED_SCIENCE_VIDEOS['theme-1-ch-1'];
      if (q.includes('snake') || q.includes('vibration') || q.includes('jaw')) return CURATED_SCIENCE_VIDEOS['theme-1-ch-2'];
    }

    // 2. Scan route path
    const normalized = (routePath || '').toLowerCase();

    // Specific Mission Matches
    if (normalized.includes('/mission/1') || normalized.includes('mission-01')) return CURATED_SCIENCE_VIDEOS['mission-01'];
    if (normalized.includes('/mission/2') || normalized.includes('mission-02')) return CURATED_SCIENCE_VIDEOS['mission-02'];
    if (normalized.includes('/mission/3') || normalized.includes('mission-03')) return CURATED_SCIENCE_VIDEOS['mission-03'];
    if (normalized.includes('/mission/4') || normalized.includes('mission-04')) return CURATED_SCIENCE_VIDEOS['mission-04'];
    if (normalized.includes('/mission/5') || normalized.includes('mission-05')) return CURATED_SCIENCE_VIDEOS['mission-05'];
    if (normalized.includes('/mission/6') || normalized.includes('mission-06')) return CURATED_SCIENCE_VIDEOS['mission-06'];
    if (normalized.includes('/mission/7') || normalized.includes('mission-07')) return CURATED_SCIENCE_VIDEOS['mission-07'];
    if (normalized.includes('/mission/8') || normalized.includes('mission-08')) return CURATED_SCIENCE_VIDEOS['mission-08'];
    if (normalized.includes('/mission/9') || normalized.includes('mission-09')) return CURATED_SCIENCE_VIDEOS['mission-09'];
    if (normalized.includes('/mission/10')) return CURATED_SCIENCE_VIDEOS['mission-10'];
    if (normalized.includes('/mission/11')) return CURATED_SCIENCE_VIDEOS['mission-11'];
    if (normalized.includes('/mission/12')) return CURATED_SCIENCE_VIDEOS['mission-12'];
    if (normalized.includes('/mission/13')) return CURATED_SCIENCE_VIDEOS['mission-13'];

    // Theme 1 Matches
    if (normalized.includes('/theme/1/chapter/1')) return CURATED_SCIENCE_VIDEOS['theme-1-ch-1'];
    if (normalized.includes('/theme/1/chapter/2')) return CURATED_SCIENCE_VIDEOS['theme-1-ch-2'];

    // Fallback for general chapter hub / subjects
    return CURATED_SCIENCE_VIDEOS['default-materials'];
  },

  /**
   * Use Gemini AI to get a tailored video recommendation and kid-friendly overview if the student asks for custom topics.
   */
  async getAiVideoRecommendation(topic: string): Promise<ScienceVideo> {
    const curated = this.scanPageContext('', topic);
    if (curated && curated.id !== 'vid-default') {
      return curated;
    }

    try {
      const prompt = `You are Pip, the cartoon science companion for a 5th grade student.
The student wants to watch a video about: "${topic}".
Provide a kid-friendly video recommendation formatted as JSON:
{
  "title": "Short catchy title for kids",
  "subtitle": "Clear 1-sentence topic description",
  "searchQuery": "Best YouTube search query",
  "whatToWatchFor": ["Thing 1 to notice", "Thing 2 to notice", "Thing 3 to notice"],
  "funFact": "One mind-blowing fun fact"
}`;

      await geminiService.chatWithLivePip(prompt);
      return {
        ...CURATED_SCIENCE_VIDEOS['default-materials'],
        title: `Science Video: ${topic}`,
        subtitle: `Explaining ${topic} for Grade 5 Science`,
      };
    } catch {
      return CURATED_SCIENCE_VIDEOS['default-materials'];
    }
  },

  /**
   * Get all curated science videos for browsing in a playlist.
   */
  getAllCuratedVideos(): ScienceVideo[] {
    return Object.values(CURATED_SCIENCE_VIDEOS);
  },
};
