export interface VocabEntry {
  word: string;
  definition: string;
  example: string;
  category: 'Science Law' | 'Material' | 'Property' | 'Environment' | 'General';
  pronunciation?: string;
  icon?: string;
}

export const vocabulary: VocabEntry[] = [
  // ── Core Textbook Definitions ──
  {
    word: 'Material',
    definition: 'A substance from which physical objects and things can be made — like wood, metal, cloth, or plastic.',
    example: 'A raincoat is made from a waterproof material so the rain slides right off.',
    category: 'Material',
    pronunciation: 'muh-TEER-ee-ul',
  },
  {
    word: 'Natural material',
    definition: 'A substance that occurs naturally on Earth — gathered from plants, animals, trees, or minerals in the ground.',
    example: 'Cotton, wool, silk, and timber wood are all natural materials.',
    category: 'Material',
    pronunciation: 'NACH-ur-ul muh-TEER-ee-ul',
  },
  {
    word: 'Synthetic material',
    definition: 'A man-made substance engineered in laboratories and factories using chemical reactions rather than harvested ready-made from nature.',
    example: 'Nylon and plastic are synthetic materials made from petroleum chemicals.',
    category: 'Material',
    pronunciation: 'sin-THET-ik muh-TEER-ee-ul',
  },
  {
    word: 'Fibre',
    definition: 'A very thin, hair-like strand of material that can be spun and woven together into fabrics, yarns, or strong ropes.',
    example: 'A single nylon fibre is stronger than a steel wire of the same thickness.',
    category: 'Material',
    pronunciation: 'FY-bur',
  },
  {
    word: 'Synthetic fabric',
    definition: 'Cloth or textile woven from man-made synthetic fibres like polyester, nylon, or acrylic.',
    example: 'Synthetic fabrics are wrinkle-free, durable, and dry in minutes.',
    category: 'Material',
    pronunciation: 'sin-THET-ik FAB-rik',
  },
  {
    word: 'Adhesive',
    definition: 'A chemical substance used to stick surfaces and objects tightly together — like glue or sealant gum.',
    example: 'Synthetic adhesives create a permanent waterproof bond to fix leaking water pipes.',
    category: 'Material',
    pronunciation: 'ad-HEE-siv',
  },
  {
    word: 'Non-biodegradable',
    definition: 'Incapable of being broken down naturally by soil bacteria and weather — it stays in the environment for hundreds of years.',
    example: 'Plastic bottles are non-biodegradable, which is why recycling is so important.',
    category: 'Environment',
    pronunciation: 'non-by-oh-dih-GRAY-duh-bul',
  },
  {
    word: 'Biodegradable',
    definition: 'Able to decay and break down naturally into organic soil matter without harming ecosystems.',
    example: 'Cotton and wood are biodegradable materials that return to the earth over time.',
    category: 'Environment',
    pronunciation: 'by-oh-dih-GRAY-duh-bul',
  },
  {
    word: 'Resistant',
    definition: 'Not easily affected, damaged, or changed by something (like heat, water, electricity, or insects).',
    example: 'Kettle handles are made of heat-resistant plastic so they never burn your fingers.',
    category: 'Property',
    pronunciation: 'ree-ZIS-tunt',
  },
  {
    word: 'Latex',
    definition: 'A thick, milky white sap produced naturally by certain rubber trees, harvested as the raw source of natural rubber.',
    example: 'Workers tap the bark of rubber trees to collect latex in small buckets.',
    category: 'Material',
    pronunciation: 'LAY-teks',
  },
  {
    word: 'Plastic',
    definition: 'A synthetic material synthesized from crude petroleum oil that can be moulded into almost any shape under heat and pressure.',
    example: 'Plastic is lightweight, cheap, and acts as an electrical insulator around copper wires.',
    category: 'Material',
    pronunciation: 'PLAS-tik',
  },
  {
    word: 'Nylon',
    definition: 'The very first fully synthetic fibre invented in 1935, synthesized from petroleum, limestone, water, and coal.',
    example: 'Nylon is used for parachutes and climbing ropes because it is stronger than steel.',
    category: 'Material',
    pronunciation: 'NY-lon',
  },
  {
    word: 'Polyester',
    definition: 'A synthetic fibre synthesized from ethylene chemicals that is wrinkle-free, water-repellent, and fast-drying.',
    example: 'Raincoats and sports jerseys are made of polyester to shed water.',
    category: 'Material',
    pronunciation: 'pol-ee-ES-tur',
  },
  {
    word: 'Rayon',
    definition: 'A semi-synthetic fibre made by chemically treating natural cellulose wood pulp to create a smooth fabric like artificial silk.',
    example: 'Rayon sarees are soft and shiny like natural silk but much cheaper.',
    category: 'Material',
    pronunciation: 'RAY-on',
  },
  {
    word: 'Acrylic',
    definition: 'A synthetic fibre made from acrylic acid and alcohol that mimics the warmth, bulk, and softness of sheep wool.',
    example: 'Acrylic blankets and sweaters keep you warm and cannot be eaten by moths.',
    category: 'Material',
    pronunciation: 'uh-KRIL-ik',
  },
  {
    word: 'Tensile strength',
    definition: 'The amount of pulling and stretching force a rope, strand, or material can withstand before it breaks or snaps.',
    example: 'Nylon has incredible tensile strength, holding immense weight in climbing gear.',
    category: 'Property',
    pronunciation: 'TEN-sile strength',
  },
  {
    word: 'Insulator',
    definition: 'A protective material that blocks or slows down heat, electricity, or sound from passing through.',
    example: 'Plastic coating on charging cables acts as an electrical insulator to keep us safe.',
    category: 'Property',
    pronunciation: 'IN-suh-lay-ter',
  },
  {
    word: 'Conductor',
    definition: 'A material that allows electricity or thermal heat energy to flow freely through it — like copper metal.',
    example: 'Copper wires inside cables are electrical conductors.',
    category: 'Property',
    pronunciation: 'kun-DUK-ter',
  },
  {
    word: 'Microplastics',
    definition: 'Tiny microscopic pieces of broken plastic debris that pollute oceans, soil, and aquatic wildlife.',
    example: 'Because plastic does not rot, it breaks down into microplastics over decades.',
    category: 'Environment',
    pronunciation: 'MY-kroh-plas-tiks',
  },
  {
    word: 'Moulded',
    definition: 'Formed or pressed into a specific custom shape using heat, cooling, and high pressure.',
    example: 'Molten plastic is moulded into toy bricks and water bottles in factories.',
    category: 'Science Law',
    pronunciation: 'MOHL-ded',
  },
  {
    word: 'Wrinkle-free',
    definition: 'Resistant to creasing or crumpling, maintaining a crisp smooth shape without needing ironing.',
    example: 'Polyester uniforms are wrinkle-free and easy to wash.',
    category: 'Property',
    pronunciation: 'RING-kul free',
  },
  {
    word: 'Absorbent',
    definition: 'Having tiny porous spaces that readily soak up and hold liquids like water or body sweat.',
    example: 'Cotton towels are highly absorbent.',
    category: 'Property',
    pronunciation: 'ub-ZOR-bunt',
  },
  {
    word: 'Breathable',
    definition: 'Allowing air and body moisture vapour to pass through freely, preventing overheating in hot weather.',
    example: 'Cotton clothing is breathable and keeps you cool during summer heat.',
    category: 'Property',
    pronunciation: 'BREE-thuh-bul',
  },
  {
    word: 'Perspiration',
    definition: 'Sweat produced by the skin to cool the body down through evaporation during exercise or summer heat.',
    example: 'Natural fabrics allow perspiration to evaporate into the air.',
    category: 'General',
    pronunciation: 'pur-spuh-RAY-shun',
  },
  {
    word: 'Chemical',
    definition: 'A distinct compound or substance produced by or used in a chemical process.',
    example: 'Chemists synthesize plastics and nylon by linking chemical molecules together.',
    category: 'Science Law',
    pronunciation: 'KEM-ih-kul',
  },
  {
    word: 'Petroleum',
    definition: 'Naturally occurring crude oil extracted from deep underground, used as fuel and the raw chemical base for plastics.',
    example: 'Crude petroleum is refined to create synthetic polymers and fibres.',
    category: 'Material',
    pronunciation: 'puh-TROH-lee-um',
  },
  {
    word: 'Recycling',
    definition: 'Collecting and processing waste materials into new useful products rather than throwing them into landfills.',
    example: 'Recycling plastic bottles helps keep oceans clean and saves raw energy.',
    category: 'Environment',
    pronunciation: 'ree-SY-kling',
  },
  {
    word: 'Property',
    definition: 'An observable characteristic or superpower quality of a material — such as strength, flexibility, or water resistance.',
    example: 'Hardness is a physical property of diamonds and iron metal.',
    category: 'Science Law',
    pronunciation: 'PROP-ur-tee',
  },
];

// Smart lookup function with plural & tense normalization
export function findVocabWord(rawQuery: string): VocabEntry | undefined {
  if (!rawQuery) return undefined;

  const clean = rawQuery.trim().toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '');
  if (!clean) return undefined;

  // 1. Direct match
  const direct = vocabulary.find((v) => v.word.toLowerCase() === clean);
  if (direct) return direct;

  // 2. Singularize rules
  const singularForms = [
    clean.endsWith('s') ? clean.slice(0, -1) : null,
    clean.endsWith('es') ? clean.slice(0, -2) : null,
    clean.endsWith('ies') ? clean.slice(0, -3) + 'y' : null,
    clean.endsWith('ing') ? clean.slice(0, -3) : null,
    clean.endsWith('ed') ? clean.slice(0, -2) : null,
  ].filter(Boolean) as string[];

  for (const s of singularForms) {
    const match = vocabulary.find((v) => v.word.toLowerCase() === s);
    if (match) return match;
  }

  // 3. Substring match for phrases (e.g. "synthetic material" matches "synthetic")
  const partial = vocabulary.find((v) => clean.includes(v.word.toLowerCase()) || v.word.toLowerCase().includes(clean));
  if (partial) return partial;

  return undefined;
}

// Fallback explainer for any general word selected by a student
export function generateSmartDefinition(rawWord: string): VocabEntry {
  const clean = rawWord.trim().replace(/^[^\w]+|[^\w]+$/g, '');
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);

  return {
    word: capitalized,
    definition: `In science, "${capitalized}" refers to a specific concept or object discussed in your science investigation.`,
    example: `Explore how ${capitalized.toLowerCase()} is used across materials and science experiments!`,
    category: 'General',
  };
}
