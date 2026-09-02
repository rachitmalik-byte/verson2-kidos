export interface VocabEntry {
  word: string;
  definition: string;
  example: string;
  category: 'Science Law' | 'Material' | 'Property' | 'Environment' | 'General';
  pronunciation?: string;
  icon?: string;
}

export const vocabulary: VocabEntry[] = [
  // ── Core Materials & Chemistry (Simple 5th-Grade Words) ──
  {
    word: 'Polymer',
    definition: 'A long chain of tiny beads linked together, like a toy train. Plastics, nylon, and rubber are all polymers!',
    example: 'Plastics and nylon are polymers made of long, flexible molecular chains.',
    category: 'Material',
    pronunciation: 'POL-ih-mur',
  },
  {
    word: 'Polymer chains',
    definition: 'Long flexible strands linked together that give plastics and nylon their springy stretch and strength.',
    example: 'In polyester shirts, springy polymer chains bounce right back to keep clothes wrinkle-free!',
    category: 'Material',
    pronunciation: 'POL-ih-mur chaynz',
  },
  {
    word: 'Monomer',
    definition: 'A single bead that links together with others to build a long polymer chain.',
    example: 'Sugar units are the single beads that join together to make natural plant starch.',
    category: 'Material',
    pronunciation: 'MON-oh-mur',
  },
  {
    word: 'Cross-linking',
    definition: 'Tiny molecular bridges that tie chains together to make rubber tough, springy, and heat-proof.',
    example: 'Sulfur bridges tie rubber chains together so car tires do not melt on hot highways.',
    category: 'Science Law',
    pronunciation: 'KROSS-ling-king',
  },
  {
    word: 'Sulfur bridges',
    definition: 'Strong chemical links made of sulfur that lock rubber chains into a tough, heat-proof web.',
    example: 'Sulfur bridges in car tires keep the rubber firm and safe at high speeds.',
    category: 'Science Law',
    pronunciation: 'SUL-fur BRIJ-ez',
  },
  {
    word: 'Thermosetting plastic',
    definition: 'Heat-proof plastic that hardens once and NEVER melts again, like pan handles and electric switches.',
    example: 'Bakelite frying pan handles are heat-proof plastics that stay cool on hot stoves.',
    category: 'Material',
    pronunciation: 'THUR-moh-set-ing PLAS-tik',
  },
  {
    word: 'Thermoplastic',
    definition: 'Plastic that softens when heated and hardens when cooled, so it can be melted and molded into new bottles.',
    example: 'Water bottles and LEGO bricks are meltable plastics that can be recycled into new shapes.',
    category: 'Material',
    pronunciation: 'THUR-moh-plas-tik',
  },
  {
    word: 'Bakelite',
    definition: 'The first heat-proof plastic ever made (1907). It blocks heat and electricity to keep our hands safe.',
    example: 'Kettle handles and switchboards are made from heat-proof Bakelite.',
    category: 'Material',
    pronunciation: 'BAY-kuh-lyt',
  },
  {
    word: 'Vulcanization',
    definition: 'Heating natural rubber with sulfur to make it tough, bouncy, and heat-proof for car tires.',
    example: 'Car tires are vulcanized so they do not wear out quickly on rough roads.',
    category: 'Science Law',
    pronunciation: 'vul-kuh-ny-ZAY-shun',
  },
  {
    word: 'Epoxy resin',
    definition: 'A super-strong waterproof glue made by mixing two liquids that harden into solid rock.',
    example: 'Epoxy glue is used to seal leaking water pipes and fix airplane parts.',
    category: 'Material',
    pronunciation: 'ee-POK-see REZ-in',
  },
  {
    word: 'Material',
    definition: 'What something is made of — like wood, metal, cloth, or plastic.',
    example: 'A raincoat is made of a waterproof material so rain slides right off.',
    category: 'Material',
    pronunciation: 'muh-TEER-ee-ul',
  },
  {
    word: 'Natural material',
    definition: 'A material from nature — from plants, animals, or the earth (like wood, wool, and cotton).',
    example: 'Cotton from plants and wool from sheep are natural materials.',
    category: 'Material',
    pronunciation: 'NACH-ur-ul muh-TEER-ee-ul',
  },
  {
    word: 'Synthetic material',
    definition: 'A material made by scientists in labs using chemicals (like plastic and nylon).',
    example: 'Nylon ropes and plastic bottles are synthetic materials made in factories.',
    category: 'Material',
    pronunciation: 'sin-THET-ik muh-TEER-ee-ul',
  },
  {
    word: 'Property',
    definition: 'What a material can do — like being waterproof, stretchy, soft, or super strong.',
    example: 'Being waterproof is a property of rubber and plastic.',
    category: 'Property',
    pronunciation: 'PROP-er-tee',
  },
  {
    word: 'Tensile strength',
    definition: 'Pulling strength: how much heavy pulling a rope can take before snapping.',
    example: 'Nylon rope has huge pulling strength, so it can lift heavy rescue cages.',
    category: 'Property',
    pronunciation: 'TEN-syl strength',
  },
  {
    word: 'Biodegradable',
    definition: 'Materials (like wood and apple cores) that tiny soil bugs can eat and rot away naturally.',
    example: 'Cotton clothes and dry leaves rot away in garden soil within weeks.',
    category: 'Environment',
    pronunciation: 'by-oh-dee-GRAY-duh-bul',
  },
  {
    word: 'Non-biodegradable',
    definition: 'Materials (like plastic) that soil bugs cannot eat, so they stay on Earth for hundreds of years.',
    example: 'Plastic bottles stay in soil for over 450 years without rotting.',
    category: 'Environment',
    pronunciation: 'non by-oh-dee-GRAY-duh-bul',
  },
  {
    word: 'Electrical conductor',
    definition: 'A material (like copper or steel) that lets electricity flow through to power lightbulbs.',
    example: 'Copper wires are good conductors that carry power to school computers.',
    category: 'Property',
    pronunciation: 'kuhn-DUK-tur',
  },
  {
    word: 'Electrical insulator',
    definition: 'A material (like plastic or rubber) that blocks electricity to protect your hands from shocks.',
    example: 'Plastic wrapping on electric cords protects you from getting shocked.',
    category: 'Property',
    pronunciation: 'IN-suh-lay-tur',
  },
  {
    word: 'Thermal insulator',
    definition: 'A material (like wood or Bakelite) that blocks heat so you do not burn your fingers.',
    example: 'Wooden spoons and Bakelite pot handles block heat on hot stoves.',
    category: 'Property',
    pronunciation: 'THUR-mul IN-suh-lay-tur',
  },
  {
    word: 'Waterproof',
    definition: 'Water cannot pass through — raindrops slide right off like water off a duck!',
    example: 'Polyester raincoats and plastic umbrellas are completely waterproof.',
    category: 'Property',
    pronunciation: 'WAH-ter-proof',
  },
  {
    word: 'Breathable',
    definition: 'Lets fresh air and sweat pass through easily to keep you cool on hot days.',
    example: 'Cotton kurtas are breathable and feel cool under the hot summer sun.',
    category: 'Property',
    pronunciation: 'BREETH-uh-bul',
  },
];

export function findVocabWord(word: string): VocabEntry | undefined {
  const clean = word.toLowerCase().trim();
  return vocabulary.find((v) => v.word.toLowerCase() === clean);
}
