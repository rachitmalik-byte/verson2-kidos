export interface VocabEntry {
  word: string;
  definition: string;
  example: string;
  category: 'Science Law' | 'Material' | 'Property' | 'Environment' | 'General';
  pronunciation?: string;
  icon?: string;
}

export const vocabulary: VocabEntry[] = [
  // ── Core Materials & Chemistry ──
  {
    word: 'Polymer',
    definition: 'A large chemical structure made of many small repeating molecular units (monomers) linked together like train carriages.',
    example: 'Plastics, nylon, and rubber are all polymers made of long chemical chains.',
    category: 'Material',
    pronunciation: 'POL-ih-mur',
  },
  {
    word: 'Polymer chains',
    definition: 'Long repeating molecular strands linked together that give synthetic materials like plastics and nylon their elasticity and strength.',
    example: 'In polyester, flexible polymer chains slide and snap back like microscopic springs, keeping fabric wrinkle-free!',
    category: 'Material',
    pronunciation: 'POL-ih-mur chaynz',
  },
  {
    word: 'Monomer',
    definition: 'A small single molecule that bonds together with other monomers to create a giant polymer chain.',
    example: 'Glucose molecules are the single monomers that join together to form natural starch.',
    category: 'Material',
    pronunciation: 'MON-oh-mur',
  },
  {
    word: 'Cross-linking',
    definition: 'Chemical bridges and bonds that tie parallel polymer chains together to make a material much stronger and heat-proof.',
    example: 'Sulfur bridges cross-link rubber chains during vulcanization so car tires do not melt at high speed.',
    category: 'Science Law',
    pronunciation: 'KROSS-ling-king',
  },
  {
    word: 'Sulfur bridges',
    definition: 'Strong chemical bonds formed with sulfur atoms that lock polymer chains into a permanent 3D heat-resistant network.',
    example: 'Sulfur bridges in vulcanized rubber keep race car tires firm on hot racing tracks.',
    category: 'Science Law',
    pronunciation: 'SUL-fur BRIJ-ez',
  },
  {
    word: 'Thermosetting plastic',
    definition: 'A rigid plastic that permanently sets into shape upon heating and can NEVER be melted or reshaped again.',
    example: 'Bakelite pan handles and electric wall switches are thermosetting plastics that resist extreme heat.',
    category: 'Material',
    pronunciation: 'THUR-moh-set-ing PLAS-tik',
  },
  {
    word: 'Thermoplastic',
    definition: 'A plastic that softens and melts when heated and hardens when cooled, allowing it to be remoulded and recycled repeatedly.',
    example: 'PET water bottles and LEGO bricks are thermoplastics that can be melted and reshaped.',
    category: 'Material',
    pronunciation: 'THUR-moh-plas-tik',
  },
  {
    word: 'Bakelite',
    definition: 'The very first fully synthetic thermoset plastic invented in 1907, famous for high heat resistance and electrical insulation.',
    example: 'Kettle handles and vintage telephone casings were crafted from heat-proof Bakelite.',
    category: 'Material',
    pronunciation: 'BAY-kuh-lyt',
  },
  {
    word: 'Vulcanization',
    definition: 'A chemical process invented by Charles Goodyear where natural rubber is heated with sulfur to make it tough, elastic, and heat-proof.',
    example: 'Car tires and shoe soles undergo vulcanization to withstand friction and weather.',
    category: 'Science Law',
    pronunciation: 'vul-kuh-ny-ZAY-shun',
  },
  {
    word: 'Epoxy resin',
    definition: 'A high-strength 2-part synthetic adhesive that cures through a chemical reaction into a waterproof, rock-hard structural bond.',
    example: 'Epoxy resin is used to seal leaking high-pressure water pipes and repair aeroplane parts.',
    category: 'Material',
    pronunciation: 'ee-POK-see REZ-in',
  },
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
    definition: 'A synthetic fibre made from acrylic chemicals that mimics the warmth, bulk, and softness of sheep wool.',
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
    word: 'Pashmina',
    definition: 'An ultra-fine, ultra-warm luxury wool collected from the underbelly fur of Changthangi goats living at 5,000m in Ladakh.',
    example: 'A pure Pashmina shawl is 6 times warmer than sheep wool and as thin as 12 micrometers!',
    category: 'Material',
    pronunciation: 'pash-MEE-nuh',
  },
  {
    word: 'Barometer',
    definition: 'A scientific instrument that measures atmospheric air pressure, used to forecast weather and calculate altitude.',
    example: 'Mountaineers on Mt. Everest use a barometer to track dropping air pressure as they climb.',
    category: 'Science Law',
    pronunciation: 'buh-ROM-ih-tur',
  },
  {
    word: 'Atmospheric pressure',
    definition: 'The physical weight and downward force of air molecules in the atmosphere pressing down on surfaces.',
    example: 'Atmospheric pressure is highest at sea level and drops thin on high mountain peaks.',
    category: 'Science Law',
    pronunciation: 'at-mus-FEER-ik PRESH-ur',
  },
  {
    word: 'Pheromone trail',
    definition: 'Invisible scent chemicals laid down by ants and insects to communicate pathways and food locations to their colony.',
    example: 'Ants follow a pheromone trail in a single line towards sweet sugar granules.',
    category: 'Science Law',
    pronunciation: 'FAIR-uh-mohn trayl',
  },
  {
    word: 'Pit organs',
    definition: 'Specialized thermal sensing facial cavities in snakes that detect infrared heat radiation emitted by warm-blooded prey.',
    example: 'Pit vipers hunt field mice in pitch-black darkness using their heat-sensing pit organs.',
    category: 'Science Law',
    pronunciation: 'PIT OR-gunz',
  },
  {
    word: 'Seismic structure',
    definition: 'A building engineered with flexible joints, shock dampers, and deep foundations to survive earthquake ground tremors.',
    example: 'Modern seismic structures sway gently during earthquakes without collapsing.',
    category: 'Science Law',
    pronunciation: 'SYZ-mik STRUK-chur',
  },
  {
    word: 'Persian wheel',
    definition: 'An ancient mechanical gear-and-pot water wheel powered by oxen to lift groundwater uphill into forts and irrigation canals.',
    example: 'The Persian wheel at Golconda Fort lifted water to roof gardens 400 years ago!',
    category: 'Science Law',
    pronunciation: 'PUR-zhun weel',
  },
  {
    word: 'Property',
    definition: 'An observable characteristic or superpower quality of a material — such as strength, flexibility, or water resistance.',
    example: 'Hardness is a physical property of diamonds and iron metal.',
    category: 'Science Law',
    pronunciation: 'PROP-ur-tee',
  },
];

// Smart lookup function with plural, tense, and multi-word normalization
export function findVocabWord(rawQuery: string): VocabEntry | undefined {
  if (!rawQuery) return undefined;

  const clean = rawQuery.trim().toLowerCase().replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
  if (!clean) return undefined;

  // 1. Direct match
  const direct = vocabulary.find((v) => v.word.toLowerCase() === clean);
  if (direct) return direct;

  // 2. Singularize / Plural rules
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

  // 3. Multi-word phrase matching (e.g. "polymer chains" or "polymer chain")
  const phraseMatch = vocabulary.find((v) => {
    const vLower = v.word.toLowerCase();
    return clean === vLower || clean.startsWith(vLower) || vLower.startsWith(clean);
  });
  if (phraseMatch) return phraseMatch;

  // 4. Substring component match
  const partial = vocabulary.find((v) => clean.includes(v.word.toLowerCase()) || v.word.toLowerCase().includes(clean));
  if (partial) return partial;

  return undefined;
}
