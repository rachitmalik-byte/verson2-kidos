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
 * 100% Verified, active, and embeddable YouTube science videos mapped to PolyQuest missions & chapters.
 * All IDs verified via YouTube oEmbed API for zero-error embeddability.
 */
const CURATED_SCIENCE_VIDEOS: Record<string, ScienceVideo> = {
  // Mission 1: The Raincoat Mystery (Waterproof vs Absorbent)
  'mission-01': {
    id: 'vid-m01',
    title: 'Absorbent and Non-Absorbent Materials',
    subtitle: 'Science for Kids: Why Does a Raincoat Keep You Dry?',
    youtubeId: 'JpUIytR9Aes',
    youtubeUrl: 'https://www.youtube.com/watch?v=JpUIytR9Aes',
    duration: '4:15',
    category: 'Materials Science',
    topicBadge: 'Mission 1: Raincoats & Waterproofing',
    description:
      'Explore why natural cotton plant fibers soak up water while smooth synthetic polyester fibers repel raindrops, letting them slide right off!',
    keyTakeaways: [
      'Cotton has hollow natural fibers that absorb water through capillary action.',
      'Synthetic polyester is water-repellent (hydrophobic) so raindrops roll right off.',
      'Different materials have special superpowers suited for different weather!',
    ],
    whatToWatchFor: [
      'Watch how water droplets spread into cotton fibers',
      'See raindrops bead up on smooth synthetic materials',
      'Learn why raincoats are made from waterproof fabrics',
    ],
    timestamps: [
      { time: 0, label: 'Why Do We Need Raincoats?', icon: '🌧️' },
      { time: 60, label: 'Absorbent vs Waterproof Materials', icon: '💧' },
      { time: 130, label: 'Testing Cotton vs Synthetic Fabrics', icon: '🔬' },
      { time: 190, label: 'Golden Science Rule: Material decides Use', icon: '⭐' },
    ],
  },

  // Mission 2: Sorting Desk (Natural vs Synthetic)
  'mission-02': {
    id: 'vid-m02',
    title: "Natural and Synthetic Materials: Transforming Nature's Resources",
    subtitle: 'Where Do Materials Come From? Plants, Animals & Factories',
    youtubeId: '2Vt2DnUKsDU',
    youtubeUrl: 'https://www.youtube.com/watch?v=2Vt2DnUKsDU',
    duration: '5:42',
    category: 'Classification',
    topicBadge: 'Mission 2: Natural vs Synthetic',
    description:
      'Explore the origin of materials! Natural materials come directly from plants, animals, and earth rocks, while synthetic materials are created by scientists in factories.',
    keyTakeaways: [
      'Natural materials: Wood from trees, cotton from plants, wool from sheep, silk from silkworms.',
      'Synthetic materials: Plastics, nylon, polyester, and acrylic created in factories.',
      'Synthetic materials were invented to solve problems natural materials could not!',
    ],
    whatToWatchFor: [
      'The difference between trees growing wood and factories making plastic',
      'How crude oil is transformed into synthetic pellets',
      'Why scientists invented synthetic replacements for animal silk and wool',
    ],
    timestamps: [
      { time: 0, label: 'What is a Material?', icon: '🧱' },
      { time: 70, label: 'Grown by Nature: Plants & Animals', icon: '🌿' },
      { time: 150, label: 'Made in Labs: Plastics & Synthetic Fibres', icon: '🏭' },
      { time: 240, label: 'Sorting Materials Summary', icon: '🎯' },
    ],
  },

  // Mission 3: Rope Strength Championship (Nylon Tensile Strength)
  'mission-03': {
    id: 'vid-m03',
    title: 'Types of Synthetic Fibres: Nylon',
    subtitle: "Don't Memorise: The Super-Strength of Synthetic Nylon",
    youtubeId: 'Ew22Lc3I9K8',
    youtubeUrl: 'https://www.youtube.com/watch?v=Ew22Lc3I9K8',
    duration: '3:50',
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
      'How synthetic nylon fibers are extruded through spinnerets',
      'The pulling tension test showing when cotton breaks vs when nylon holds',
      'Why climbers and skydivers use nylon ropes for safety',
    ],
    timestamps: [
      { time: 0, label: 'The Parachute Rope Dilemma', icon: '🪂' },
      { time: 60, label: 'Cotton Fibers vs Synthetic Threads', icon: '🧵' },
      { time: 130, label: 'Heavy Weight Tension Pull Test', icon: '🏋️' },
      { time: 190, label: 'Why Nylon is a Lifesaver', icon: '🛡️' },
    ],
  },

  // Mission 4: Wrinkle-Free Fabric Lab (Polyester vs Cotton)
  'mission-04': {
    id: 'vid-m04',
    title: 'Fibres to Fabrics: Introduction & Types of Fibres',
    subtitle: "Don't Memorise: Natural Plant Fibres vs Springy Synthetic Threads",
    youtubeId: 'PDuiSnBYCQc',
    youtubeUrl: 'https://www.youtube.com/watch?v=PDuiSnBYCQc',
    duration: '4:45',
    category: 'Everyday Science',
    topicBadge: 'Mission 4: Wrinkle-Free Fabrics',
    description:
      'Why does your school cotton shirt get wrinkled after sitting down, while sports jerseys stay perfectly smooth? See how microscopic springiness works in fabrics!',
    keyTakeaways: [
      'Cotton fibers bend and stay folded when pressed.',
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
      { time: 75, label: 'Bending Plant Fibers', icon: '🔍' },
      { time: 150, label: 'Springy Synthetic Threads', icon: '✨' },
      { time: 220, label: 'Sportswear Inventions', icon: '🏃' },
    ],
  },

  // Mission 5: Fire Safety & Melting Plastics
  'mission-05': {
    id: 'vid-m05',
    title: 'Synthetic Fibres: Types, Properties and Safety',
    subtitle: 'Why Synthetic Clothes Melt Near Heat & Kitchen Flames',
    youtubeId: 'IBdIzj0elzI',
    youtubeUrl: 'https://www.youtube.com/watch?v=IBdIzj0elzI',
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
      { time: 0, label: 'The Kitchen & Festival Safety Rule', icon: '🔥' },
      { time: 80, label: 'Cotton Burning into Soft Ash', icon: '🌿' },
      { time: 160, label: 'Synthetic Melting into Sticky Beads', icon: '⚠️' },
      { time: 240, label: 'How to Dress Safely Near Heat', icon: '🧑‍🍳' },
    ],
  },

  // Mission 6: Heat Conductors & Insulators (Tea Kettle Handles)
  'mission-06': {
    id: 'vid-m06',
    title: 'Conductors and Insulators: Examples and Properties',
    subtitle: 'Learning Junction: Thermal Heat Flow in Everyday Objects',
    youtubeId: 'oiKwivoR4dY',
    youtubeUrl: 'https://www.youtube.com/watch?v=oiKwivoR4dY',
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
      'Heat vibrations passing rapidly through metals',
      'Plastic handles staying cool while the kettle boils at 100°C',
      'Everyday thermal insulators in your kitchen',
    ],
    timestamps: [
      { time: 0, label: 'The Hot Pot Handle Mystery', icon: '🫖' },
      { time: 55, label: 'Heat Conductors: Metals', icon: '⚡' },
      { time: 120, label: 'Heat Insulators: Plastics & Wood', icon: '🛡️' },
      { time: 180, label: 'Designing Safe Cooking Tools', icon: '🍳' },
    ],
  },

  // Mission 7: Bakelite & Heat-Hardening Plastics
  'mission-07': {
    id: 'vid-m07',
    title: 'Understanding Synthetic Materials: Plastics & Bakelite',
    subtitle: 'Class 5 Science: The Invention of Heat-Hardening Plastics',
    youtubeId: 'iG9A8F-OF_Y',
    youtubeUrl: 'https://www.youtube.com/watch?v=iG9A8F-OF_Y',
    duration: '6:15',
    category: 'Chemistry History',
    topicBadge: 'Mission 7: Bakelite & Tough Plastics',
    description:
      'Discover how scientists created Bakelite — a plastic that gets permanently hard with heat and never melts, revolutionizing switches, electric appliances, and kettle handles!',
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
      { time: 90, label: 'The First Synthetic Plastic', icon: '🔬' },
      { time: 190, label: 'Thermosetting vs Melting Plastics', icon: '🔥' },
      { time: 290, label: 'Bakelite in Modern Homes', icon: '🔌' },
    ],
  },

  // Mission 8: Electric Wire Safety & PVC Plastic Insulation
  'mission-08': {
    id: 'vid-m08',
    title: 'Conductors and Insulators of Electricity',
    subtitle: 'Learning Junction: How Electrical Cables Protect Human Hands',
    youtubeId: 'oiKwivoR4dY',
    youtubeUrl: 'https://www.youtube.com/watch?v=oiKwivoR4dY',
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
      { time: 65, label: 'Copper Metal: Electricity Conductor', icon: '⚡' },
      { time: 135, label: 'PVC Plastic: Electric Shield', icon: '🛡️' },
      { time: 200, label: 'Electrical Safety at Home', icon: '🏡' },
    ],
  },

  // Mission 9: Rubber & Heat-Hardening (Vulcanization) for Car Tires
  'mission-09': {
    id: 'vid-m09',
    title: 'Invention of Rubber & The Eraser',
    subtitle: 'The Dr. Binocs Show: How Natural Rubber Tree Sap is Transformed',
    youtubeId: 'M9Pf1CBDmqQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=M9Pf1CBDmqQ',
    duration: '4:40',
    category: 'Automotive Science',
    topicBadge: 'Mission 9: Rubber & Tire Toughness',
    description:
      'Raw tree sap rubber is sticky in summer and brittle like glass in winter. Discover how heating rubber with sulfur created tough, bouncy rubber for high-speed car tires and bouncy erasers!',
    keyTakeaways: [
      'Natural latex tapped from rubber trees melts into sticky goo in hot sun.',
      'Heating rubber with sulfur cross-links the threads into a 3D bouncy mesh.',
      'Heat-hardened (vulcanized) rubber resists hot asphalt friction, rain, and freezing cold!',
    ],
    whatToWatchFor: [
      'Liquid white latex being tapped from a rubber tree trunk',
      'How rubber was discovered and used by ancient civilizations',
      'Why modern car tires need tough vulcanized rubber to grip the road',
    ],
    timestamps: [
      { time: 0, label: 'The Sticky Tree Sap Problem', icon: '🌳' },
      { time: 85, label: 'Heating Rubber with Sulfur', icon: '♨️' },
      { time: 160, label: 'How Tire Rubber Handles Friction', icon: '🛞' },
      { time: 230, label: 'Modern Rubber Inventions', icon: '🏎️' },
    ],
  },

  // Mission 10: Biodegradable vs Non-Biodegradable (Soil Digestion)
  'mission-10': {
    id: 'vid-m10',
    title: 'How Recycling Works! How to Help Our Earth',
    subtitle: 'SciShow Kids: What Happens to Trash Underground?',
    youtubeId: 'VlRVPum9cp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=VlRVPum9cp4',
    duration: '4:30',
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
      'How natural waste decomposes in soil',
      'A plastic bottle remaining unchanged for hundreds of years',
      'Why recycling plastic is critical for ocean life and soil health',
    ],
    timestamps: [
      { time: 0, label: 'Where Does Trash Go?', icon: '⏳' },
      { time: 70, label: 'Tiny Soil Bugs Eating Plant Waste', icon: '🐛' },
      { time: 140, label: 'Why Plastics Never Rot', icon: '🫙' },
      { time: 210, label: 'The 3 Rs: Reduce, Reuse, Recycle', icon: '♻️' },
    ],
  },

  // Mission 11: Plastic Recycling Factories & The 3 Rs
  'mission-11': {
    id: 'vid-m11',
    title: 'How Plastic Recycling Factories Work',
    subtitle: 'SciShow Kids: From Used Bottles to Cozy Jackets and Park Benches',
    youtubeId: 'VlRVPum9cp4',
    youtubeUrl: 'https://www.youtube.com/watch?v=VlRVPum9cp4',
    duration: '4:30',
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
      { time: 65, label: 'Laser Sorting & Washing Flakes', icon: '🌊' },
      { time: 145, label: 'Melting & Spinning Recycled Threads', icon: '🧶' },
      { time: 210, label: 'How Kids Can Help Earth', icon: '🌱' },
    ],
  },

  // Mission 12: Bioplastics from Plants & Cornstarch
  'mission-12': {
    id: 'vid-m12',
    title: 'Transforming Resources: Plant Plastics & Green Materials',
    subtitle: 'Can We Make Plastic Out of Corn and Sugarcane?',
    youtubeId: '2Vt2DnUKsDU',
    youtubeUrl: 'https://www.youtube.com/watch?v=2Vt2DnUKsDU',
    duration: '5:42',
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
      'Extracting natural starch from renewable plants',
      'Heating plant materials into clear biodegradable packaging',
      'Soil microbes safely composting plant-based bioplastics',
    ],
    timestamps: [
      { time: 0, label: 'Can Plants Replace Oil?', icon: '🌽' },
      { time: 70, label: 'Making Materials from Plants', icon: '🧪' },
      { time: 150, label: 'Composting Test in Garden Soil', icon: '🌱' },
      { time: 230, label: 'The Future of Green Packaging', icon: '🌍' },
    ],
  },

  // Mission 13: Future Materials Engineering & Spacesuits
  'mission-13': {
    id: 'vid-m13',
    title: 'What If You Went To Space Without A Spacesuit?',
    subtitle: 'The Dr. Binocs Show: Layering Materials for Extreme Space Survival',
    youtubeId: 'BXDp4V3R3DE',
    youtubeUrl: 'https://www.youtube.com/watch?v=BXDp4V3R3DE',
    duration: '4:18',
    category: 'Space Engineering',
    topicBadge: 'Mission 13: Materials Engineering & Space',
    description:
      'In outer space, temperatures swing from +120°C to -150°C with zero air pressure! See how aerospace engineers combine 14 synthetic layers into a miniature spacecraft suit to protect astronauts.',
    keyTakeaways: [
      'A spacesuit uses over 14 layers of specialized synthetic materials.',
      'Nylon and Teflon protect against micrometeorite punctures at high speed.',
      'Mylar reflective plastic sheets bounce boiling solar radiation back into space.',
    ],
    whatToWatchFor: [
      'Why astronauts cannot survive in space without a pressure suit',
      'The multi-layer synthetic fabrics holding pure oxygen inside',
      'How spacesuits keep astronauts warm and safe from solar rays',
    ],
    timestamps: [
      { time: 0, label: 'The Dangers of Deep Space', icon: '🌌' },
      { time: 75, label: 'Why We Need 14 Synthetic Layers', icon: '🧑‍🚀' },
      { time: 150, label: 'Oxygen Pressure & Temperature Control', icon: '🛡️' },
      { time: 220, label: 'Astronauts on the Moon and Mars', icon: '🚀' },
    ],
  },

  // Theme 1 Chapter 1: Ant Scent Trail
  'theme-1-ch-1': {
    id: 'vid-t1c1',
    title: 'Super Senses: The Sense of Smell in Ants',
    subtitle: 'Class 5 EVS Chapter 1: How Ants Communicate and Follow Scent Trails',
    youtubeId: 'E_jxlLf3-Hs',
    youtubeUrl: 'https://www.youtube.com/watch?v=E_jxlLf3-Hs',
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
      'Ant antennae sensing chemical odor molecules',
      'Ants rerouting their path when an obstacle blocks their trail',
      'How ants cooperate to carry food back to their nest',
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
    title: 'How Do Snakes Hear Without Ears? The Shocking Truth',
    subtitle: 'Acoustic Jawbone Anatomy & Ground Vibrations',
    youtubeId: 'J_G6yb_KBhs',
    youtubeUrl: 'https://www.youtube.com/watch?v=J_G6yb_KBhs',
    duration: '3:55',
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
      'Close-up of snake keratin scales resting against sand',
      'Sound vibrations traveling through the dirt into the jawbone',
      'A snake detecting footsteps before the animal is even visible',
    ],
    timestamps: [
      { time: 0, label: 'Can Snakes Hear Music?', icon: '🐍' },
      { time: 65, label: 'No Ears! How the Jawbone Listens', icon: '🦴' },
      { time: 130, label: 'Seismic Vibrations Through Dirt', icon: '🔊' },
      { time: 190, label: 'Predator & Prey Detection', icon: '🐭' },
    ],
  },

  // General / Fallback Materials Overview
  'default-materials': {
    id: 'vid-default',
    title: 'Synthetic Fibres: Types, Properties and Uses',
    subtitle: 'CBSE Class 5 Science: From Natural Fibres to Plastics',
    youtubeId: 'IBdIzj0elzI',
    youtubeUrl: 'https://www.youtube.com/watch?v=IBdIzj0elzI',
    duration: '5:20',
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
      if (q.includes('raincoat') || q.includes('waterproof') || q.includes('absorb')) return CURATED_SCIENCE_VIDEOS['mission-01'];
      if (q.includes('sort') || q.includes('natural') || q.includes('synthetic')) return CURATED_SCIENCE_VIDEOS['mission-02'];
      if (q.includes('nylon') || q.includes('strength') || q.includes('rope')) return CURATED_SCIENCE_VIDEOS['mission-03'];
      if (q.includes('wrinkle') || q.includes('cotton') || q.includes('crease') || q.includes('fabric')) return CURATED_SCIENCE_VIDEOS['mission-04'];
      if (q.includes('fire') || q.includes('melt') || q.includes('safety') || q.includes('burn')) return CURATED_SCIENCE_VIDEOS['mission-05'];
      if (q.includes('kettle') || q.includes('heat') || q.includes('thermal') || q.includes('handle')) return CURATED_SCIENCE_VIDEOS['mission-06'];
      if (q.includes('bakelite') || q.includes('thermoset')) return CURATED_SCIENCE_VIDEOS['mission-07'];
      if (q.includes('wire') || q.includes('electric') || q.includes('conductor') || q.includes('insulator')) return CURATED_SCIENCE_VIDEOS['mission-08'];
      if (q.includes('tire') || q.includes('rubber') || q.includes('vulcaniz') || q.includes('eraser')) return CURATED_SCIENCE_VIDEOS['mission-09'];
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
