import type { Material } from '@/types';

export const materials: Material[] = [
  // ── Natural Materials ──
  {
    id: 'cotton',
    name: 'Cotton',
    type: 'natural',
    category: 'fibre',
    image: '🌿',
    color: 'pq-sage',
    properties: [
      { name: 'Breathable & Cool', description: 'Air and sweat pass through easily for natural summer cooling', icon: '💨' },
      { name: 'Absorbent', description: 'Soaks up sweat and moisture effectively', icon: '💧' },
      { name: 'Soft on Skin', description: 'Comfortable, hypoallergenic natural plant weave', icon: '☁️' },
      { name: 'Safe Near Fire', description: 'Burns to harmless powdery ash without melting or sticking', icon: '🛡️' },
    ],
    uses: ['Summer clothes', 'Kurtas', 'Towels', 'Bedsheets', 'Kitchen aprons'],
    funFact: 'Harvested from fluffy white bolls of the cotton plant. Because cotton breathes and turns to ash rather than melting, it is the safest fabric to wear in kitchens and around Diwali lamps!',
    discoveredIn: 'mission-02',
  },
  {
    id: 'wool',
    name: 'Wool',
    type: 'natural',
    category: 'fibre',
    image: '🐑',
    color: 'pq-sage',
    properties: [
      { name: 'Thermal Insulator', description: 'Traps pockets of warm air to keep body heat in', icon: '🔥' },
      { name: 'Soft & Fluffy', description: 'Natural animal protein fibre with crimped texture', icon: '☁️' },
      { name: 'Flame Resistant', description: 'Naturally harder to ignite than most synthetic fibres', icon: '🛡️' },
    ],
    uses: ['Winter sweaters', 'Warm blankets', 'Carpets', 'Woollen shawls'],
    funFact: 'Gently sheared from sheep and goats! Natural wool contains microscopic air pockets that insulate against freezing cold.',
    discoveredIn: 'mission-02',
  },
  {
    id: 'silk',
    name: 'Silk',
    type: 'natural',
    category: 'fibre',
    image: '🪱',
    color: 'pq-sage',
    properties: [
      { name: 'Natural Lustre', description: 'Prism-like triangular fibre structure gives a shimmering shine', icon: '✨' },
      { name: 'High Tensile Strength', description: 'Surprisingly strong for how delicate and fine it feels', icon: '💪' },
      { name: 'Lightweight', description: 'Feather-light with smooth drape', icon: '🪶' },
    ],
    uses: ['Traditional sarees', 'Ties', 'Luxury robes', 'Scarves'],
    funFact: 'Spun by silkworm caterpillars as they weave their protective cocoons! It takes hundreds of cocoons to make a single silk scarf.',
    discoveredIn: 'mission-02',
  },
  {
    id: 'wood',
    name: 'Forest Wood',
    type: 'natural',
    category: 'other',
    image: '🪵',
    color: 'pq-sage',
    properties: [
      { name: 'Rigid & Tough', description: 'High compressive strength from cellulose and lignin', icon: '💪' },
      { name: 'Carpentry Friendly', description: 'Easily cut, carved, and joined into durable structures', icon: '🔨' },
      { name: '100% Biodegradable', description: 'Breaks down naturally in soil without polluting oceans', icon: '🌱' },
    ],
    uses: ['Furniture', 'Building doors', 'Paper pulp', 'Boats and tools'],
    funFact: 'Wood is a renewable natural material from trees. Tree rings reveal both the age of the tree and past climate weather patterns!',
    discoveredIn: 'mission-02',
  },
  {
    id: 'natural-rubber',
    name: 'Natural Rubber',
    type: 'natural',
    category: 'rubber',
    image: '🌳',
    color: 'pq-sage',
    properties: [
      { name: 'Elastic Polymers', description: 'Stretches under tension and springs right back to shape', icon: '🔄' },
      { name: 'Waterproof', description: 'Completely impermeable to liquids and moisture', icon: '💧' },
      { name: 'Flexible', description: 'Bends repeatedly without cracking', icon: '〰️' },
    ],
    uses: ['Erasers', 'Elastic bands', 'Balloons', 'Shoe soles'],
    funFact: 'Natural rubber is harvested by tapping the bark of rubber trees to collect latex — a milky white plant liquid!',
    discoveredIn: 'mission-02',
  },

  // ── Synthetic Materials ──
  {
    id: 'nylon',
    name: 'Nylon',
    type: 'synthetic',
    category: 'fibre',
    image: '🧵',
    color: 'pq-sky',
    properties: [
      { name: 'Stronger Than Steel', description: 'A nylon fibre is stronger than a steel wire of the same thickness', icon: '💪' },
      { name: 'Feather-Light', description: 'Extremely lightweight and easy to carry', icon: '🪶' },
      { name: 'Fast Drying', description: 'Non-absorbent polymer weave dries in minutes', icon: '☀️' },
      { name: 'Moth & Insect Resistant', description: 'Insects and clothes moths cannot eat synthetic chemical fibres', icon: '🛡️' },
    ],
    uses: ['Parachutes', 'Climbing ropes', 'Toothbrush bristles', 'Socks', 'Sleeping bags', 'Curtains'],
    funFact: 'Nylon was the very first fully synthetic fibre invented in 1935 from petroleum, limestone, and coal! During WWII, nylon was reserved for military rescue parachutes.',
    discoveredIn: 'mission-03',
  },
  {
    id: 'polyester',
    name: 'Polyester',
    type: 'synthetic',
    category: 'fibre',
    image: '👕',
    color: 'pq-sky',
    properties: [
      { name: 'Wrinkle-Free', description: 'Retains shape without needing ironing', icon: '✨' },
      { name: 'Water Repellent', description: 'Rain and moisture bead up and roll off the surface', icon: '💧' },
      { name: 'Long-Lasting', description: 'Resists wear, stretching, and fading over years', icon: '🛡️' },
      { name: 'Melt Risk Near Fire', description: 'Melts into scalding sticky plastic beads when exposed to flames', icon: '⚠️' },
    ],
    uses: ['Raincoats', 'Sportswear jerseys', 'Umbrellas', 'Conveyor belts', 'Backpacks'],
    funFact: 'Synthesized from ethylene (petrochemicals). While great for raincoats and sports, polyester does NOT breathe in hot summers and can cause sweat rashes. Never wear near fire!',
    discoveredIn: 'mission-04',
  },
  {
    id: 'rayon',
    name: 'Rayon (Semi-Synthetic)',
    type: 'synthetic',
    category: 'fibre',
    image: '🎋',
    color: 'pq-sky',
    properties: [
      { name: 'Artificial Silk', description: 'Soft, lustrous drape mimicking silk at a fraction of the cost', icon: '✨' },
      { name: 'Moisture Absorbent', description: 'Absorbs sweat better than nylon or polyester', icon: '💧' },
      { name: 'Semi-Synthetic', description: 'Manufactured by chemically regenerating natural wood cellulose', icon: '🌿' },
    ],
    uses: ['Sarees', 'Bed sheets', 'Shirts', 'Furnishing materials'],
    funFact: 'Rayon is called a semi-synthetic fibre because its raw starting material is natural wood pulp/cotton, but it is heavily processed with industrial chemicals.',
    discoveredIn: 'mission-04',
  },
  {
    id: 'acrylic',
    name: 'Acrylic (Synthetic Wool)',
    type: 'synthetic',
    category: 'fibre',
    image: '🧶',
    color: 'pq-sky',
    properties: [
      { name: 'Synthetic Wool', description: 'Replicates the warmth and bulk of natural sheep wool', icon: '🐑' },
      { name: 'Moth-Proof', description: 'Clothes moths cannot digest acrylic chemicals', icon: '🛡️' },
      { name: 'Shrink-Resistant', description: 'Easy to machine wash without shrinking or felting', icon: '🧼' },
    ],
    uses: ['Shawls', 'Cardigans & Sweaters', 'Carpets', 'Blankets', 'Pullovers'],
    funFact: 'Made by reacting acrylic acid with alcohol! It provides cozy winter warmth without the high cost or moth damage of real wool.',
    discoveredIn: 'mission-04',
  },
  {
    id: 'plastic',
    name: 'Plastic (Petroleum Polymer)',
    type: 'synthetic',
    category: 'plastic',
    image: '🫙',
    color: 'pq-sky',
    properties: [
      { name: 'Mouldable by Heat', description: 'Moulded into any shape using heat and hydraulic pressure', icon: '🔄' },
      { name: 'Electrical Insulator', description: 'Blocks electric current to prevent electric shocks', icon: '⚡' },
      { name: 'Non-Corrosive', description: 'Will never rust, rot, or decay from water exposure', icon: '🛡️' },
      { name: 'Non-Biodegradable', description: 'Takes hundreds of years to break down, forming microplastics', icon: '⚠️' },
    ],
    uses: ['Wire insulation', 'Chairs & tables', 'Water bottles', 'Food containers', 'Pipes', 'Toys'],
    funFact: 'Plastics are made from crude petroleum oil. Because plastic is non-biodegradable, never litter! Look for the recycling triangle symbol (PET, HDPE, PVC). Safety tip: Do not microwave plastic containers for over 2 minutes.',
    discoveredIn: 'mission-06',
  },
  {
    id: 'synthetic-rubber',
    name: 'Synthetic Rubber',
    type: 'synthetic',
    category: 'rubber',
    image: '🛞',
    color: 'pq-sky',
    properties: [
      { name: 'Extreme Durability', description: 'Tolerates intense road friction, heat, and heavy loads', icon: '💪' },
      { name: 'Chemical Elasticity', description: 'Cheaper and more abundant than natural forest latex', icon: '💰' },
      { name: 'Water & Gas Tight', description: 'Prevents air leakage in pneumatic tyres', icon: '💨' },
    ],
    uses: ['Vehicle tyres', 'Surgical gloves', 'Doormats', 'Erasers', 'Conveyor belts'],
    funFact: 'Engineered by chemists when natural rubber trees could not meet global demand during WWII! Today, most vehicle tyres are made of synthetic rubber.',
    discoveredIn: 'mission-11',
  },
  {
    id: 'synthetic-adhesive',
    name: 'Synthetic Adhesive (Super Glue)',
    type: 'synthetic',
    category: 'adhesive',
    image: '🧴',
    color: 'pq-sky',
    properties: [
      { name: 'Molecular Bonding', description: 'Creates ultra-strong chemical bonds between surfaces', icon: '🔗' },
      { name: 'Stronger Than Tree Gum', description: 'Far stronger and faster drying than natural pine resin', icon: '💪' },
      { name: 'Waterproof Sealing', description: 'Stops pipe leaks and withstands pressure', icon: '💧' },
    ],
    uses: ['Stopping water pipe leaks', 'Wood joinery', 'Plastic and metal bonding', 'Crafts'],
    funFact: 'Adhesives stick things together! While natural adhesives come from keekar and pine trees, synthetic adhesives create permanent waterproof molecular bonds.',
    discoveredIn: 'mission-12',
  },
];

export function getMaterialById(id: string): Material | undefined {
  return materials.find((m) => m.id === id);
}

export function getNaturalMaterials(): Material[] {
  return materials.filter((m) => m.type === 'natural');
}

export function getSyntheticMaterials(): Material[] {
  return materials.filter((m) => m.type === 'synthetic');
}
