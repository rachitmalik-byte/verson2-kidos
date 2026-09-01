// Master Comprehensive Curriculum Definition for PolyQuest (CBSE Class 5 EVS Science Academy)
// Every single chapter across all 4 courses contains 100% unique, in-depth conceptual lessons,
// multi-step visual concept cards taught by Pip with local macro photography, and rich field journals.

export interface VisualConceptStep {
  stepNumber: number;
  conceptTitle: string;
  imageAsset: string;
  pipDialogue: string;
  keyTakeaway: string;
}

export interface ChapterIntro {
  title: string;
  hookScene: string;
  bigGuidingQuestion: string;
  conceptSteps: VisualConceptStep[];
  learningChecklist?: string[];
  learningRoadmap?: string[];
  goldenLaw: string;
  thinkFastChallenge?: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation: string;
  };
  pipThinkFastChallenge?: {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    explanation: string;
  };
}

export interface FieldJournal {
  journalId: string;
  journalTitle: string;
  fieldBrief: string;
  specimenFacts: { icon: string; title: string; detail: string }[];
  handsOnExperiment: {
    title: string;
    materialsNeeded: string[];
    procedure: string;
    expectedObservation: string;
  };
  journalReflectionBadgePrompt?: string;
  journalBadgeQuestion?: string;
}

export interface CourseChapter {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  theme: string;
  syllabusRef: string;
  icon: string;
  accentColor: string;
  chapterIntro: ChapterIntro;
  fieldJournal: FieldJournal;
}

// ═════════════════════════════════════════════════════════════════════════════
// COURSE 1: THINGS WE MAKE & DO — MATERIALS (Theme 6 / CBSE EVS)
// ═════════════════════════════════════════════════════════════════════════════
export const MATERIALS_COURSE_CHAPTERS: CourseChapter[] = [
  {
    chapterId: "mat-ch1",

    chapterNumber: 1,
    chapterTitle: "The Raincoat Mystery & Moisture Mechanics",

    theme: "Things We Make & Do: Materials",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "🧥",

    accentColor: "from-amber-400 to-sky-500",

    chapterIntro: {
      title: "The Raincoat Mystery & Moisture Mechanics",

      hookScene: "A sudden monsoon thunderstorm drenching the schoolyard! You have two raincoats: a beige 100% natural cotton coat and a vibrant blue synthetic polyester jacket.",

      bigGuidingQuestion: "Why does liquid water soak into cotton until it weighs 5 kg, while water droplets bead up and roll off synthetic polyester instantly?",

      goldenLaw: "🧱 The Material a fabric is made from determines its microscopic pore structure and water absorbency!",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Natural Plant Cellulose (Cotton Pores)",

          imageAsset: "raw_cotton_boll.jpg",

          pipDialogue: "Look closely through our 100x digital microscope! Cotton fibers are hollow spiral tubes made of organic plant cellulose. These fibers contain millions of microscopic pores that drink in liquid water through capillary action. That makes cotton the best material for hot summer sweat, but terrible in a torrential monsoon downpour!",

          keyTakeaway: "🌱 Cotton has hollow cellulose fibers with microscopic capillary pores that absorb water rapidly."

        },
        {
          stepNumber: 2,
          conceptTitle: "Engineered Synthetic Polymers (Polyester Barrier)",

          imageAsset: "polyester_raincoat_waterproof.jpg",

          pipDialogue: "Polyester is synthesized from petroleum petrochemical esters. Its molecular polymer chains are woven tightly with ZERO pores! Because it is hydrophobic (\"water-fearing\"), liquid water cannot penetrate the fiber core. Surface tension pulls water molecules into perfect spherical beads that roll right off!",

          keyTakeaway: "💧 Synthetic polyester is hydrophobic and non-porous, forcing water into beads that slide off without soaking."

        },
        {
          stepNumber: 3,
          conceptTitle: "The Golden Triangle of Materials Science",

          imageAsset: "polyester_swatch_clean.jpg",

          pipDialogue: "Everything in science connects together in a Golden Triangle: What an object is MADE FROM (Material) determines what it CAN DO (Physical Properties), which decides what we USE IT FOR (Application)! Never choose a material without checking its properties first!",

          keyTakeaway: "🧱 Golden Law: Material ➔ Physical Property ➔ Practical Real-World Use."

        }
      ],
      learningChecklist: [
        'Differentiate between natural organic plant fibers (cotton) and synthetic petrochemical polymers (polyester).',
        'Understand capillary action absorption vs. hydrophobic contact angle beading.',
        'Apply the Golden Triangle of Materials to real-world engineering challenges.'
      ],
      thinkFastChallenge: {
        question: "If you are designing a summer sports jersey for heavy running in 40°C heat, which material structure works best?",

        options: [
          { text: 'Breathable, moisture-wicking weave with capillary pores to evaporate sweat', isCorrect: true },
          { text: 'Heavy impermeable rubber sheeting to trap all sweat inside', isCorrect: false }
        ],
        explanation: "Capillary pores draw perspiration away from the skin so air currents can evaporate it, cooling the body naturally!"

      }
    },
    fieldJournal: {
      journalId: "journal-mat-01",

      journalTitle: "Explorer Log: Moisture & Capillary Action Lab",

      fieldBrief: "Examine microscopic fiber weaves and record absorption versus beading rates under controlled moisture exposure.",

      specimenFacts: [
        { icon: '🌱', title: 'Cellulose Pores', detail: 'A single cotton boll contains over 500,000 hollow cellulose micro-fibers.' },
        { icon: '💧', title: 'Contact Angle', detail: 'Hydrophobic polyester creates a water contact angle > 90°, creating spherical beads.' },
        { icon: '🪡', title: 'Micro-Weave', detail: 'High-density synthetic weaves stop water drops while letting microscopic vapor escape.' }
      ],
      handsOnExperiment: {
        title: "The 2-Minute Pipette Dropper Test",

        materialsNeeded: ['1 cotton sock or handkerchief', '1 synthetic polyester garment', 'Water dropper / spoon', 'Stopwatch'],
        procedure: "Place 1 drop of room-temperature water on both fabric swatches simultaneously. Time how many seconds it takes for each drop to soak in or bead up.",

        expectedObservation: "The cotton swatch absorbs the water droplet within 2 seconds. The polyester swatch holds the droplet as a round pearl for over 5 minutes!"

      },
      journalReflectionBadgePrompt: "Scientists select materials by matching their microscopic ____________ to the job they must perform."

    }
  },
  {
    chapterId: "mat-ch2",

    chapterNumber: 2,
    chapterTitle: "The Sorting Desk — Natural vs Synthetic Classification",

    theme: "Things We Make & Do: Materials",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "🔬",

    accentColor: "from-emerald-400 to-teal-600",

    chapterIntro: {
      title: "The Sorting Desk — Natural vs Synthetic Classification",

      hookScene: "Our laboratory workbench is covered in mixed specimens: silk cocoons, wooden timbers, sheep fleece, nylon cords, and acrylic yarn!",

      bigGuidingQuestion: "How can you instantly tell whether a material came directly from living nature or was engineered by chemical synthesis?",

      goldenLaw: "🌿 Natural materials come directly from living organisms or minerals; Synthetic materials are created in factories by polymerizing petrochemicals.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Natural Biological Resources (Plants, Animals & Soil)",

          imageAsset: "sheep_wool_fleece.jpg",

          pipDialogue: "Natural materials come directly from living plants, animals, or Earth's minerals! Trees give us cellulose timber, sheep grow keratin fleece wool, silkworms spin fibroin protein, and rubber trees produce sticky latex sap. They grow naturally without chemical polymer factories!",

          keyTakeaway: "🌿 Natural materials originate directly from plants, animals, or geological minerals."

        },
        {
          stepNumber: 2,
          conceptTitle: "Synthesized Petrochemical Polymers (Man-Made)",

          imageAsset: "pet_water_bottle_molding.jpg",

          pipDialogue: "Synthetic materials never exist in raw nature! Human chemical engineers extract crude petroleum oil from deep underground, crack it into small monomer molecules, and link them into long artificial polymer chains like Nylon, Polyester, PVC, and Acrylic!",

          keyTakeaway: "🏭 Synthetic materials are created by chemically linking small monomer molecules into artificial polymer chains."

        }
      ],
      learningChecklist: [
        'Classify everyday items into Natural (Plant/Animal/Mineral) vs. Synthetic (Petrochemical).',
        'Trace raw natural origins (Latex sap ➔ Rubber, Keratin ➔ Wool, Cellulose ➔ Wood).',
        'Understand polymerization: how chemical factories turn liquids into tough solids.'
      ],
      thinkFastChallenge: {
        question: "Which of the following materials is synthesized artificially in a chemical laboratory?",

        options: [
          { text: 'Nylon parachute rope synthesized from petrochemical monomers', isCorrect: true },
          { text: 'Raw silk spun from a silkworm cocoon', isCorrect: false }
        ],
        explanation: "Nylon was invented in 1935 by chemist Wallace Carothers as the world’s first 100% synthetic polymer!"

      }
    },
    fieldJournal: {
      journalId: "journal-mat-02",

      journalTitle: "Explorer Log: Natural vs. Synthetic Specimen Matrix",

      fieldBrief: "Classify 10 household materials into their natural biological or petrochemical polymer origins.",

      specimenFacts: [
        { icon: '🪵', title: 'Lignin & Cellulose', detail: 'Wood grain strength comes from natural cellulose fibers bound by rigid lignin resin.' },
        { icon: '🪱', title: 'Silk Protein', detail: 'A single silkworm cocoon yields an unbroken natural protein strand up to 900 meters long.' },
        { icon: '🧪', title: 'Polymerization', detail: 'Synthetic plastics link thousands of identical carbon-hydrogen monomer units into chains.' }
      ],
      handsOnExperiment: {
        title: "Household Specimen Classification Quest",

        materialsNeeded: ['5 items from around your home (e.g., wooden spoon, plastic pen, cotton shirt, wool cap, nylon bag)'],
        procedure: "Inspect each object under light. Identify whether its source was a plant, an animal, or a chemical factory.",

        expectedObservation: "Objects made from wood and cotton have subtle irregular natural textures; plastic and nylon have smooth, uniform molecular surfaces."

      },
      journalBadgeQuestion: "Materials manufactured by humans using chemical reactions are scientifically classified as ____________."

    }
  },
  {
    chapterId: "mat-ch3",

    chapterNumber: 3,
    chapterTitle: "The Thermal Combustion Lab — Ash vs Plastic Melt Beads",

    theme: "Things We Make & Do: Materials",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "🔥",

    accentColor: "from-orange-500 to-rose-600",

    chapterIntro: {
      title: "The Thermal Combustion Lab — Ash vs Plastic Melt Beads",

      hookScene: "A loose thread hanging from an unknown fabric. In forensic chemistry, scientists use the Burn Test to identify fibers within 5 seconds!",

      bigGuidingQuestion: "Why does burning cotton turn into soft gray powdery ash, while synthetic polyester melts into a burning sticky plastic bead?",

      goldenLaw: "🔥 Natural plant cellulose burns to crushable carbon ash; Synthetic thermoplastics melt into boiling sticky polymer beads.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Cellulose Combustion (Organic Ash)",

          imageAsset: "cotton_burning_ash.jpg",

          pipDialogue: "When natural plant cellulose (cotton or linen) catches fire, it burns with a clean, steady yellow flame. It smells just like burning leaves or paper! When the flame goes out, it leaves behind fine, powdery, crumbly gray ash that breaks apart with a gentle touch.",

          keyTakeaway: "🍂 Natural plant fibers burn with a paper odor and leave soft, crushable carbon ash."

        },
        {
          stepNumber: 2,
          conceptTitle: "Thermoplastic Melting & Kitchen Safety",

          imageAsset: "polyester_melting_bead.jpg",

          pipDialogue: "Synthetic fabrics like Polyester and Nylon are thermoplastics. Instead of burning to ash, heat melts their polymer chains into a boiling, sticky, molten plastic bead! If you wear synthetic clothes near a campfire or kitchen stove, melted plastic can stick to your skin — ALWAYS wear natural cotton in the lab or kitchen!",

          keyTakeaway: "⚠️ Synthetic thermoplastics melt into hot sticky beads that adhere to skin. Never wear synthetics near open flames!"

        }
      ],
      learningRoadmap: [
        'Understand thermal reaction differences: Combustion to Ash vs. Polymer Melting.',
        'Identify fire odors: Burning paper (Cotton/Cellulose) vs. Sweet/Chemical (Polyester) vs. Burning Hair (Wool/Protein).',
        'Master vital kitchen and laboratory fire safety rules.'
      ],
      thinkFastChallenge: {
        question: "Why must chefs, firefighters, and scientists always wear 100% natural cotton aprons instead of synthetic nylon near stoves?",

        options: [
          { text: 'Cotton chars to harmless ash instead of melting into burning sticky plastic against the skin', isCorrect: true },
          { text: 'Cotton makes food taste sweeter automatically', isCorrect: false }
        ],
        explanation: "Natural cotton does not melt into boiling liquid plastic beads, protecting skin from severe contact burns!"

      }
    },
    fieldJournal: {
      journalId: "journal-mat-03",

      journalTitle: "Explorer Log: Thermal Degradation & Fire Safety Log",

      fieldBrief: "Log the scientific characteristics of organic combustion vs. synthetic polymer melting.",

      specimenFacts: [
        { icon: '🔥', title: 'Ignition Point', detail: 'Cotton ignites at ~250°C to ash; Polyester softens and melts at 220°C into liquid resin.' },
        { icon: '👃', title: 'Odor Signatures', detail: 'Wool smells like burning hair (keratin sulfur); cotton smells like burning campfire leaves.' },
        { icon: '🛡️', title: 'Kitchen Rule', detail: 'Chefs wear heavyweight 100% cotton drill jackets for fire flash protection.' }
      ],
      handsOnExperiment: {
        title: "Thermal Safety Observation Lab (Teacher/Parent Demo)",

        materialsNeeded: ['Safe laboratory tweezers', 'Adult supervision', '1 cotton thread', '1 synthetic thread', 'Metal safety tray'],
        procedure: "Under strict adult supervision, touch the tip of a cotton thread to a flame, then a synthetic thread over a metal tray.",

        expectedObservation: "The cotton thread burns steadily leaving gray powdery ash. The synthetic thread shrinks back and hardens into a solid black plastic bead!"

      },
      journalBadgeQuestion: "Synthetic polymers are classified as ____________ because they melt into liquid beads when exposed to high heat."

    }
  },
  {
    chapterId: "mat-ch4",

    chapterNumber: 4,
    chapterTitle: "Tensile Strength & Parachute Canopy Engineering",

    theme: "Things We Make & Do: Materials",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "🪢",

    accentColor: "from-blue-500 to-indigo-600",

    chapterIntro: {
      title: "Tensile Strength & Parachute Canopy Engineering",

      hookScene: "A skydiver jumping out of an airplane at 4,000 meters altitude. When the rip-cord pulls, the parachute canopy snaps open against 200 km/h wind gusts!",

      bigGuidingQuestion: "Why are modern parachute canopies and climbing ropes made of synthetic Nylon instead of natural cotton or silk?",

      goldenLaw: "💪 Tensile pulling strength is maximized when synthetic polymer molecules are drawn into aligned parallel fibers.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Tensile Strength & Molecular Alignment",

          imageAsset: "nylon_rope_heavy_weight.jpg",

          pipDialogue: "Tensile strength is the maximum pulling force a material can withstand without snapping! In nylon fibers, long polyamide molecular chains are pulled and stretched in straight parallel lines during manufacturing. This gives nylon the highest strength-to-weight ratio of any flexible fiber!",

          keyTakeaway: "💪 Tensile strength measures pulling resistance; aligned synthetic polymer chains resist immense stress."

        },
        {
          stepNumber: 2,
          conceptTitle: "Aviation Parachute Canopy Dynamics",

          imageAsset: "parachute_canopy_jump.jpg",

          pipDialogue: "Before 1939, parachutes were made from expensive natural silk. But when World War II arrived, scientists perfected Nylon! Nylon canopies are feather-light, completely rot-proof, resistant to mildew, and strong enough to support an entire armored vehicle dropping from the sky!",

          keyTakeaway: "🪂 Nylon replaced silk because it is lighter, rot-proof, elastic, and has extraordinary tensile strength."

        }
      ],
      learningRoadmap: [
        'Define tensile pulling strength and breaking stress limits.',
        'Compare tensile capabilities: Cotton vs. Jute vs. Silk vs. Nylon vs. Steel.',
        'Discover how aviation engineers design safety parachutes and rock-climbing harnesses.'
      ],
      thinkFastChallenge: {
        question: "Why is natural cotton rope dangerous for deep mountain rock-climbing compared to nylon rope?",

        options: [
          { text: 'Cotton snaps easily under sudden shock loads and rots when wet from rain', isCorrect: true },
          { text: 'Cotton ropes attract mountain bears', isCorrect: false }
        ],
        explanation: "Natural cotton lacks elastic shock absorption and weakens when exposed to rain and environmental mold!"

      }
    },
    fieldJournal: {
      journalId: "journal-mat-04",

      journalTitle: "Explorer Log: Tensile Force & Breaking Point Lab",

      fieldBrief: "Test and measure breaking points across natural and synthetic cordage specimens.",

      specimenFacts: [
        { icon: '🪢', title: '1mm Nylon Power', detail: 'A 1mm micro-cord of nylon can lift over 100 kg without snapping.' },
        { icon: '🕷️', title: 'Spider Dragline', detail: 'Natural spider dragline silk has a tensile strength 5x greater than steel by weight.' },
        { icon: '⚙️', title: 'Elastic Energy', detail: 'Nylon stretches up to 30% under sudden load to absorb shock energy before bouncing back.' }
      ],
      handsOnExperiment: {
        title: "The Hanging Weight Stress Test",

        materialsNeeded: ['1 cotton thread (30 cm)', '1 nylon fishing line or dental floss (30 cm)', 'A small paper cup', 'Coins or marbles as weights'],
        procedure: "Tie each string to the paper cup handle. Add coins one by one into the cup until the string breaks. Count the coins held by each material!",

        expectedObservation: "The cotton thread snaps under the weight of ~15 coins. The nylon cord holds over 100 coins without snapping!"

      },
      journalBadgeQuestion: "The maximum pulling force a rope or cable can endure before breaking is called its ____________ strength."

    }
  },
  {
    chapterId: "mat-ch5",

    chapterNumber: 5,
    chapterTitle: "Electrical & Heat Insulation — Bakelite & PVC Wire Coating",

    theme: "Things We Make & Do: Materials",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "⚡",

    accentColor: "from-amber-400 to-orange-500",

    chapterIntro: {
      title: "Electrical & Heat Insulation — Bakelite & PVC Wire Coating",

      hookScene: "Inside a boiling metal tea kettle at 100°C, the copper kettle is blistering hot — but you can grab the black plastic Bakelite handle with your bare hands without getting burned!",

      bigGuidingQuestion: "Why doesn’t the chef’s black plastic pan handle melt or burn your hand on a red-hot stove?",

      goldenLaw: "⚡ Conductors transmit heat and electrons; Thermosetting Insulators have locked 3D bonds that block current and heat.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Thermosetting Polymers (Bakelite 3D Cross-Links)",

          imageAsset: "bakelite_pan_handle.jpg",

          pipDialogue: "Unlike standard plastics that melt with heat, Bakelite is a Thermosetting polymer! During molding, chemical heat locks its molecules into permanent 3D cross-linked bonds. Once set, Bakelite CANNOT melt or change shape even at 300°C, making it the ultimate thermal insulator for cookware handles and electrical plugs!",

          keyTakeaway: "🍳 Thermosetting Bakelite has rigid 3D molecular cross-links that never melt, insulating hands from high heat."

        },
        {
          stepNumber: 2,
          conceptTitle: "Electrical Conductors vs. PVC Insulating Sheaths",

          imageAsset: "pvc_insulated_cable.jpg",

          pipDialogue: "Copper metal wires are super-conductors that let electric currents flow freely. But to keep humans safe from fatal electric shocks, engineers wrap the copper in flexible PVC (Polyvinyl Chloride) plastic. PVC electrons are tightly locked, preventing electricity from escaping into your fingers!",

          keyTakeaway: "⚡ Conductors (Copper) allow electrons to flow; Insulators (PVC/Rubber) block electrical currents for human safety."

        }
      ],
      learningRoadmap: [
        'Differentiate Thermoplastics (recyclable/meltable) from Thermosets (rigid 3D cross-linked bonds).',
        'Understand free-electron electrical conduction in metals (Copper, Aluminum).',
        'Identify electrical insulation safety standards in home appliances.'
      ],
      thinkFastChallenge: {
        question: "What would happen if an electrician’s screwdriver handle was made of solid copper metal instead of thick plastic insulation?",

        options: [
          { text: 'Electric current from a live wire would flow directly into the electrician’s body causing severe shock', isCorrect: true },
          { text: 'The screwdriver would turn into a chocolate bar', isCorrect: false }
        ],
        explanation: "Copper is an electrical conductor that carries current; insulating plastic blocks the circuit to protect the user!"

      }
    },
    fieldJournal: {
      journalId: "journal-mat-05",

      journalTitle: "Explorer Log: Conduction vs. Insulation Matrix",

      fieldBrief: "Test electrical and thermal conductivity pathways across laboratory and household materials.",

      specimenFacts: [
        { icon: '🔌', title: 'Bakelite 1907', detail: 'Invented by Leo Baekeland in 1907 as the world’s first fully synthetic thermosetting resin.' },
        { icon: '⚡', title: 'PVC Resistivity', detail: 'Polyvinyl chloride provides electrical resistance > 10^12 ohm-meters.' },
        { icon: '🍳', title: 'Thermal Barrier', detail: 'Bakelite pan handles maintain safe touch temperatures < 40°C while pans boil at 100°C.' }
      ],
      handsOnExperiment: {
        title: "The Metal vs. Wood vs. Plastic Spoon Butter Test",

        materialsNeeded: ['1 metal spoon', '1 wooden spoon', '1 plastic spoon', '1 mug of hot water', '3 small pats of butter'],
        procedure: "Place a small dab of butter on the handle tip of all 3 spoons. Place all 3 spoons into a mug of hot water simultaneously. Watch which butter dab melts first!",

        expectedObservation: "Butter on the metal spoon melts within 30 seconds (high thermal conductivity). Butter on wood and plastic stays solid for minutes (thermal insulators)!"

      },
      journalBadgeQuestion: "Materials that completely block the flow of electric current and heat energy are called ____________."

    }
  },
  {
    chapterId: "mat-ch6",

    chapterNumber: 6,
    chapterTitle: "The Long Sleep — 450-Year Biodegradation & Soil Microbes",

    theme: "Things We Make & Do: Materials",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "⏳",

    accentColor: "from-teal-400 to-emerald-600",

    chapterIntro: {
      title: "The Long Sleep — 450-Year Biodegradation & Soil Microbes",

      hookScene: "An apple core, a cotton rag, and a plastic soda bottle are buried side-by-side in garden soil for 3 months.",

      bigGuidingQuestion: "Why does the apple core disappear completely in 2 weeks, while the plastic bottle looks brand new 450 years later?",

      goldenLaw: "🌱 Soil bacteria have biological enzymes to digest organic matter; Synthetic plastics lack natural enzymes and persist for 450+ years.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Biological Decomposition & Microbial Enzymes",

          imageAsset: "soil_apple_rotted.jpg",

          pipDialogue: "Soil is alive with billions of microscopic bacteria, fungi, and earthworms! These microorganisms have evolved enzymes over millions of years to break down natural organic matter (apple pectin, wood cellulose, animal proteins) into rich fertile soil humus!",

          keyTakeaway: "🍎 Biodegradable natural materials are consumed by soil microbes in weeks to enrich plant life."

        },
        {
          stepNumber: 2,
          conceptTitle: "Petrochemical Plastic Persistence (450+ Years)",

          imageAsset: "soil_plastic_450yrs.jpg",

          pipDialogue: "Synthetic plastics were only invented 100 years ago! Soil bacteria have NO enzymes that recognize artificial carbon-carbon polymer bonds. Instead of rotting, plastic slowly fragments into microscopic microplastics that pollute waterways for over 450 years!",

          keyTakeaway: "🚯 Non-biodegradable plastics persist for over 450 years because nature has no enzymes to digest synthetic polymers."

        }
      ],
      learningRoadmap: [
        'Understand the biological decomposition cycle and enzyme specificity.',
        'Compare biodegradation timelines: Fruit (2 weeks) ➔ Cotton (3 months) ➔ Plastic Bottle (450 years).',
        'Learn the 5 R’s of Environmental Action: Refuse, Reduce, Reuse, Repurpose, and Recycle.'
      ],
      thinkFastChallenge: {
        question: "Why are biodegradable cornstarch and cassava-based bioplastics better for the planet than standard petroleum plastic bags?",

        options: [
          { text: 'Soil microbes can digest organic starch molecules into natural compost within 90 days', isCorrect: true },
          { text: 'Bioplastics can be eaten as dinner snacks', isCorrect: false }
        ],
        explanation: "Bioplastics use natural plant starches that soil microorganisms can digest cleanly without toxic microplastics!"

      }
    },
    fieldJournal: {
      journalId: "journal-mat-06",

      journalTitle: "Explorer Log: Soil Decomposition & 450-Year Persistence",

      fieldBrief: "Monitor decomposition rates of organic waste vs. synthetic materials over time.",

      specimenFacts: [
        { icon: '🍎', title: 'Apple Core', detail: 'Decomposes completely in 2 to 4 weeks under active garden compost conditions.' },
        { icon: '👕', title: 'Cotton Rag', detail: 'Cellulose fibers biodegrade fully into soil carbon within 1 to 5 months.' },
        { icon: '🧴', title: 'PET Plastic', detail: 'Takes 450 to 500 years to break down, breaking only into microplastics.' }
      ],
      handsOnExperiment: {
        title: "The Backyard Soil Decomposition Jar Lab",

        materialsNeeded: ['1 glass jar filled with damp garden soil', '1 banana peel strip', '1 small piece of plastic bag'],
        procedure: "Bury the banana peel on the left side of the jar and the plastic strip on the right side. Keep soil moist and observe every 5 days for 3 weeks.",

        expectedObservation: "The banana peel turns brown, shrinks, and dissolves into dark rich soil. The plastic piece remains 100% unchanged!"

      },
      journalBadgeQuestion: "Materials that can be naturally broken down by bacteria and fungi in the soil are called ____________."

    }
  }
];

// ═════════════════════════════════════════════════════════════════════════════
// COURSE 2: SUPER SENSES & LIVING WORLD (Theme 1 / CBSE EVS)
// ═════════════════════════════════════════════════════════════════════════════
export const SUPER_SENSES_COURSE_CHAPTERS: CourseChapter[] = [
  {
    chapterId: "senses-ch1",

    chapterNumber: 1,
    chapterTitle: "Super Senses in Animals (Smell, Sight & Sound)",

    theme: "Super Senses & Living World",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 1",

    icon: "🐾",

    accentColor: "from-amber-400 to-emerald-500",

    chapterIntro: {
      title: "Super Senses in Animals (Smell, Sight & Sound)",

      hookScene: "You drop a single drop of sugar syrup on the veranda floor. Within minutes, a scout ant locates it and soon fifty worker ants march in an unbroken straight line!",

      bigGuidingQuestion: "How do tiny ants communicate navigation routes without spoken words or maps, and how do eagles spot mice from 2 kilometers high?",

      goldenLaw: "🐜 Animals possess specialized sensory adaptations: Ants communicate via chemical pheromones, and eagles use 4x telescopic foveal vision.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Pheromone Chemical Highways in Ants",

          imageAsset: "ants_trail_sugar.jpg",

          pipDialogue: "Ants do not use road signs! When a scout ant finds food, it rubs its abdominal scent gland against the earth, leaving an invisible chemical trail called a Pheromone. Other ants follow this scent using thousands of chemoreceptors on their jointed antennae!",

          keyTakeaway: "🐜 Ants secrete pheromone scent trails that the entire colony follows with their antenna chemoreceptors."

        },
        {
          stepNumber: 2,
          conceptTitle: "Telescopic 4x Foveal Vision in Birds of Prey",

          imageAsset: "eagle_view_mouse.jpg",

          pipDialogue: "Eagles and hawks have two foveae (sharp focal centers) per eye, packed with 4 times more photoreceptor cone cells than human eyes! From 2 kilometers high in the sky, an eagle can see a small field mouse twitching in the grass with built-in optical zoom!",

          keyTakeaway: "🦅 Eagles have 4x the photoreceptor density of humans, giving them telescopic zoom vision from high altitudes."

        },
        {
          stepNumber: 3,
          conceptTitle: "Male Silkworm Moth Scent Radar",

          imageAsset: "silkworm_silk_cocoon.jpg",

          pipDialogue: "A male silkworm moth has feathery antennae with over 40,000 microscopic olfactory receptors! He can detect a single pheromone molecule released by a female moth from more than 5 kilometers away through dense forests!",

          keyTakeaway: "🦋 Silkworm moths have ultra-sensitive feathery antennae capable of tracking mates from kilometers away."

        }
      ],
      learningChecklist: [
        'Understand chemical pheromone trails and social insect communication.',
        'Explore 4x telescopic zoom vision in birds of prey vs. human eyesight.',
        'Discover how silkworm moths and dogs detect airborne scent molecules.'
      ],
      thinkFastChallenge: {
        question: "What happens if you gently place a clean ruler across a moving line of ants?",

        options: [
          { text: 'They pause, wave antennae to detect the scent boundary, and climb around the obstacle to re-find the pheromone path', isCorrect: true },
          { text: 'They immediately forget they are ants', isCorrect: false }
        ],
        explanation: "Ants rely on antenna chemoreceptors to scan the air and surface until they reconnect with the pheromone trail!"

      }
    },
    fieldJournal: {
      journalId: "journal-senses-01",

      journalTitle: "Explorer Log: Animal Sensory Radar & Adaptations",

      fieldBrief: "Log animal sensory superpowers across insect, avian, and mammalian species.",

      specimenFacts: [
        { icon: '🐜', title: 'Ant Chemosensors', detail: 'Over 400 specialized odorant receptors are packed into ant antenna joints.' },
        { icon: '🦅', title: 'Eagle Fovea', detail: 'Eagle retinas feature dual foveae for simultaneous panoramic and 4x zoom vision.' },
        { icon: '🐕', title: 'Canine Olfaction', detail: 'A dog’s nose possesses 300 million olfactory receptors (compared to 6 million in humans).' }
      ],
      handsOnExperiment: {
        title: "Scent Direction Blindfold Challenge",

        materialsNeeded: ['A cotton ball with lemon/vanilla essence', 'A blindfold', 'A family partner'],
        procedure: "Blindfold your partner. Hold the scented cotton ball 1 meter away to their left, right, or behind them. Test how many tries it takes for human ears/noses to pinpoint scent direction compared to animals!",

        expectedObservation: "Humans struggle to pinpoint exact scent direction without visual cues, proving our reliance on vision over olfaction!"

      },
      journalBadgeQuestion: "Invisible chemical scent markers left by insects to guide their colony are called ____________."

    }
  },
  {
    chapterId: "senses-ch2",

    chapterNumber: 2,
    chapterTitle: "A Snake Charmer's Story & Reptiles",
    theme: "Super Senses & Living World",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 2",

    icon: "🐍",

    accentColor: "from-emerald-400 to-teal-600",

    chapterIntro: {
      title: "A Snake Charmer's Story & Reptiles",
      hookScene: "A snake charmer (Kalbeliya) plays a musical gourd flute (been). A cobra inside the wicker basket raises its hood and sways in rhythm with the instrument.",

      bigGuidingQuestion: "If snakes have NO external ears and cannot hear airborne music, why do they sway when the flute moves?",

      goldenLaw: "🐍 Snakes detect seismic ground vibrations through their lower jawbone resting against the earth.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Seismic Jawbone Acoustic Transmission",

          imageAsset: "eagle_view_landscape.jpg",

          pipDialogue: "Snakes have no eardrums or ear holes! Instead, their lower quadrate jawbone touches the ground continuously. Soundwaves and footsteps travel as seismic waves through the soil, vibrating the jawbone which conducts sound directly into their inner ear bones!",

          keyTakeaway: "🐍 Snakes hear footsteps as seismic ground vibrations transmitted through their lower jawbone."

        },
        {
          stepNumber: 2,
          conceptTitle: "The 4 Venomous Indian Snakes & Antivenom Medicine",

          imageAsset: "persian_wheel.jpg",

          pipDialogue: "Out of over 300 snake species in India, only 4 are dangerously venomous: the Spectacled Cobra, Common Krait, Russell’s Viper, and Saw-scaled Viper. All other snakes are non-venomous and protect our food by eating grain-destroying rats! Lifesaving antivenom medicine is made from snake venom itself!",

          keyTakeaway: "💉 Only 4 Indian snakes are venomous; non-venomous snakes are vital allies to agriculture, and venom produces antivenom."

        }
      ],
      learningRoadmap: [
        'Understand seismic ground vibration hearing in reptiles.',
        'Identify India’s 4 venomous snakes: Cobra, Krait, Russell’s Viper, Saw-scaled Viper.',
        'Learn how lifesaving antivenom is manufactured and administered in hospitals.'
      ],
      pipThinkFastChallenge: {
        question: "Why are non-venomous rat snakes considered the best natural friends of Indian farmers?",

        options: [
          { text: 'They eat millions of crop-destroying rats in grain fields without using harmful chemical pesticides', isCorrect: true },
          { text: 'They help farmers plow the soil', isCorrect: false }
        ],
        explanation: "Rat snakes provide essential ecological balance by preventing rodents from consuming the harvest!"

      }
    },
    fieldJournal: {
      journalId: "journal-senses-02",

      journalTitle: "Explorer Log: Reptilian Acoustics & Venom Pharmacology",

      fieldBrief: "Analyze snake sensory anatomy, fang mechanics, and medical antivenom production.",

      specimenFacts: [
        { icon: '🐍', title: 'The Big 4', detail: 'Only Cobra, Krait, Russell’s Viper, and Saw-scaled Viper possess venom harmful to humans in India.' },
        { icon: '💉', title: 'Hollow Fangs', detail: 'Snake fangs act like microscopic hypodermic needles that inject venom deep into tissues.' },
        { icon: '🧪', title: 'Antivenom Serum', detail: 'Produced by injecting tiny safe doses into horses or sheep to harvest protective antibodies.' }
      ],
      handsOnExperiment: {
        title: "The Table-Tap Jawbone Vibration Simulation",

        materialsNeeded: ['A solid wooden table', 'Your hands', 'A partner'],
        procedure: "Cover both ears tightly with your palms. Rest your lower chin and jawbone firmly on the wooden table. Have your partner tap the other end of the table with a pencil.",

        expectedObservation: "The tapping sounds loud and clear through your jawbone, exactly demonstrating how snakes hear footsteps!"

      },
      journalBadgeQuestion: "The medical serum used to treat dangerous snakebites in hospitals is called ____________."

    }
  },
  {
    chapterId: "senses-ch3",

    chapterNumber: 3,
    chapterTitle: "From Tasting to Digestion (Enzymes & Dr. Beaumont)",

    theme: "Super Senses & Living World",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 3",

    icon: "👅",

    accentColor: "from-rose-400 to-amber-500",

    chapterIntro: {
      title: "From Tasting to Digestion (Enzymes & Dr. Beaumont)",

      hookScene: "You chew a plain piece of unsweetened roti or boiled rice for 30 seconds without swallowing.",

      bigGuidingQuestion: "Why does plain, tasteless bread begin to taste sweet in your mouth after chewing for 30 seconds?",

      goldenLaw: "👅 Saliva contains amylase enzymes that chemically convert tasteless starches into sweet glucose sugars.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Salivary Amylase Enzyme Chemistry",

          imageAsset: "soil_apple_day1.jpg",

          pipDialogue: "Digestion starts in your mouth! Your saliva glands produce an enzyme called Amylase. Amylase acts like molecular scissors, cutting long, tasteless complex starch chains in roti and rice into tiny, sweet sugar molecules (maltose) right on your tongue!",

          keyTakeaway: "🍞 Salivary amylase breaks complex starches into sweet simple sugars during chewing."

        },
        {
          stepNumber: 2,
          conceptTitle: "Dr. William Beaumont’s Stomach Window (1822)",

          imageAsset: "boiling_tea_kettle_steam.jpg",

          pipDialogue: "In 1822, Dr. William Beaumont studied Alexis St. Martin, a patient whose stomach healed with an open window after a gunshot. Dr. Beaumont discovered that stomach acid (pH 1.5) and digestive juices chemically break down food at 37°C, and digestion slows down drastically when a person is stressed or sad!",

          keyTakeaway: "🌡️ The stomach uses 37°C body heat and hydrochloric acid to digest food; emotional stress slows digestion."

        }
      ],
      learningRoadmap: [
        'Map the 5 primary taste categories: Sweet, Salty, Sour, Bitter, and Umami.',
        'Observe salivary amylase enzyme action in carbohydrate breakdown.',
        'Understand proper chewing habits and digestive physiology.'
      ],
      pipThinkFastChallenge: {
        question: "What happens to digestive stomach secretions when a person eats meals while stressed, angry, or rushing?",

        options: [
          { text: 'Digestive secretions decrease and food remains undigested much longer in the stomach', isCorrect: true },
          { text: 'Food digests 50 times faster when stressed', isCorrect: false }
        ],
        explanation: "Dr. Beaumont proved that emotional stress directly shuts down gastric juices, causing indigestion!"

      }
    },
    fieldJournal: {
      journalId: "journal-senses-03",

      journalTitle: "Explorer Log: Digestive Enzymes & Gastric Chemistry",

      fieldBrief: "Track carbohydrate enzyme digestion and analyze taste papillae receptor distribution.",

      specimenFacts: [
        { icon: '👅', title: '10,000 Papillae', detail: 'Human tongue taste buds are replaced and regenerated every 10 to 14 days.' },
        { icon: '🍞', title: '30-Chew Rule', detail: 'Chewing 30 times mixes saliva thoroughly, completing early starch digestion before swallowing.' },
        { icon: '🌡️', title: 'Stomach Acid', detail: 'Hydrochloric acid in the stomach has a pH of 1.5 to 2.0 to dissolve proteins and kill bacteria.' }
      ],
      handsOnExperiment: {
        title: "The 30-Second Bread Sweetness Timer Test",

        materialsNeeded: ['1 small bite of plain bread or roti', 'Stopwatch / timer'],
        procedure: "Place plain bread in your mouth. Chew continuously without swallowing for 30 seconds. Pay attention to how the taste changes at second 5, 15, and 30.",

        expectedObservation: "At 5 seconds, bread tastes bland; at 30 seconds, it tastes noticeably sweet as salivary amylase creates maltose sugar!"

      },
      journalBadgeQuestion: "The digestive enzyme in human saliva that turns starch into sugar is called ____________."

    }
  },
  {
    chapterId: "senses-ch4",

    chapterNumber: 4,
    chapterTitle: "Seeds and Seeds: Travel & Inventions (Velcro Biomimicry)",

    theme: "Super Senses & Living World",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 5",

    icon: "🌱",

    accentColor: "from-teal-400 to-emerald-600",

    chapterIntro: {
      title: "Seeds and Seeds: Travel & Inventions (Velcro Biomimicry)",

      hookScene: "After walking through an overgrown garden, you notice dozens of prickly round burdock burrs stuck stubbornly to your socks and shoes.",

      bigGuidingQuestion: "How did tiny sticky plant seeds inspire the invention of the world’s most popular fastener — Velcro?",

      goldenLaw: "🌱 Plants disperse seeds via wind, water, animals, and explosive pods; Biomimicry copies nature to engineer human technology.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Botanical Seed Dispersal Vectors",

          imageAsset: "synthetic_acrylic_yarn.jpg",

          pipDialogue: "Plants cannot walk, but their seeds travel thousands of kilometers! Dandelions use feathery aerodynamic wind parachutes, coconuts float across oceans on waterproof buoyant husks, and pea pods burst open like spring-loaded catapults to fling seeds away from shade!",

          keyTakeaway: "🌬️ Seed dispersal adaptations prevent overcrowding: Wind parachutes, water husks, animal hooks, and explosive pods."

        },
        {
          stepNumber: 2,
          conceptTitle: "George de Mestral & Velcro Biomimicry (1948)",

          imageAsset: "nylon_thread_spool.jpg",

          pipDialogue: "In 1948, Swiss engineer George de Mestral examined burdock burrs under a microscope. He discovered hundreds of tiny microscopic elastic hooks that grab onto fabric loops! He copied nature using nylon to invent Velcro (Velours + Crochet) — now used on sneakers, spacesuits, and backpacks!",

          keyTakeaway: "🪝 Biomimicry: George de Mestral copied burdock seed micro-hooks to engineer Velcro hook-and-loop fasteners."

        }
      ],
      learningRoadmap: [
        'Explore 4 seed dispersal mechanisms: Wind, Water, Animal Fur, and Explosive Pods.',
        'Understand Biomimicry: how engineers solve human problems by studying nature.',
        'Inspect Velcro hook-and-loop structures under high-power magnification.'
      ],
      pipThinkFastChallenge: {
        question: "How do heavy coconut seeds travel across oceans to grow on distant desert islands?",

        options: [
          { text: 'Their fibrous, air-filled waterproof husks float on saltwater currents for months without rotting', isCorrect: true },
          { text: 'They are delivered by submarines', isCorrect: false }
        ],
        explanation: "The buoyant fibrous husk of a coconut traps air pockets, allowing it to drift thousands of kilometers across oceans!"

      }
    },
    fieldJournal: {
      journalId: "journal-senses-04",

      journalTitle: "Explorer Log: Botanical Travel & Biomimicry Log",

      fieldBrief: "Log seed dispersal adaptations and analyze nature-inspired engineering inventions.",

      specimenFacts: [
        { icon: '🌬️', title: 'Dandelion Flight', detail: 'Feathery dandelion seed parachutes can glide over 5 miles on thermal updrafts.' },
        { icon: '🪝', title: 'Burdock Micro-Hooks', detail: 'Each burdock head contains ~400 curved elastic hooks that grip onto woven loops.' },
        { icon: '🚀', title: 'Explosive Balsam', detail: 'Balsam pods dry under solar heat and snap shut with explosive force to fling seeds 5 meters.' }
      ],
      handsOnExperiment: {
        title: "Microscopic Velcro Inspection Lab",

        materialsNeeded: ['A Velcro shoe strap or jacket patch', 'Magnifying glass or smartphone macro camera'],
        procedure: "Inspect the rough scratchy side of Velcro under bright light, then inspect the soft fuzzy side. Slowly press them together and pull apart.",

        expectedObservation: "You will see hundreds of stiff curved plastic hooks latching onto tangled flexible loops, perfectly copying burdock seeds!"

      },
      journalBadgeQuestion: "The engineering practice of designing human technology by copying smart natural systems is called ____________."

    }
  }
];

// ═════════════════════════════════════════════════════════════════════════════
// COURSE 3: WATER & AQUATIC EXPERIMENTS (Theme 2 & 4 / CBSE EVS)
// ═════════════════════════════════════════════════════════════════════════════
export const WATER_COURSE_CHAPTERS: CourseChapter[] = [
  {
    chapterId: "water-ch1",

    chapterNumber: 1,
    chapterTitle: "Earth's Water Cycle & States of Matter",
    theme: "Water & Aquatic Experiments",

    syllabusRef: "CBSE Class 5 EVS • Theme 2 & 4 (Water)",

    icon: "🌊",

    accentColor: "from-sky-400 to-blue-600",

    chapterIntro: {
      title: "Earth's Water Cycle & States of Matter",
      hookScene: "A wet puddle on the playground sidewalk on a hot afternoon disappears completely after 2 hours without anyone mopping it.",

      bigGuidingQuestion: "Where did the water in the sidewalk puddle go, and how does it come back as rain days later?",

      goldenLaw: "☀️ Solar thermal energy evaporates liquid water into vapor; atmospheric cooling condenses it into clouds that precipitate as rain.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Solar Evaporation & Molecular Energy",

          imageAsset: "boiling_tea_kettle_steam.jpg",

          pipDialogue: "When sunlight warms water molecules in oceans and puddles, they gain thermal kinetic energy! They speed up, break free from liquid bonds, and rise into the atmosphere as invisible water vapor gas!",

          keyTakeaway: "☀️ Solar thermal radiation drives evaporation, converting liquid water into rising vapor gas."

        },
        {
          stepNumber: 2,
          conceptTitle: "High-Altitude Condensation & Cloud Formation",

          imageAsset: "lightbulb_glowing_bright.jpg",

          pipDialogue: "As warm vapor climbs kilometers into the cold upper sky, it cools down and clumps onto tiny dust particles, creating billions of microscopic droplets that we see as fluffy clouds! When droplets grow too heavy to float, gravity pulls them down as rain!",

          keyTakeaway: "☁️ Cold high-altitude air condenses vapor into clouds; gravity pulls heavy droplets down as precipitation."

        }
      ],
      learningRoadmap: [
        'Master the 4 stages of the Water Cycle: Evaporation, Condensation, Precipitation, and Collection.',
        'Understand how solar heat continuously recycles Earth’s 4-billion-year-old water molecules.',
        'Discover groundwater recharge and freshwater aquifer filtration.'
      ],
      thinkFastChallenge: {
        question: "Why do tiny water droplets appear on the outside of a cold glass of ice water on a warm humid day?",

        options: [
          { text: 'Warm invisible water vapor in the surrounding room air touches the cold glass and condenses into liquid droplets', isCorrect: true },
          { text: 'Water leaks through the solid glass wall', isCorrect: false }
        ],
        explanation: "Invisible water vapor in the air cools down instantly upon touching the cold glass surface, condensing into liquid droplets!"

      }
    },
    fieldJournal: {
      journalId: "journal-water-01",

      journalTitle: "Explorer Log: Planetary Hydrology & Phase Transitions",

      fieldBrief: "Track water phase changes, evaporation rates, and atmospheric condensation.",

      specimenFacts: [
        { icon: '☀️', title: 'Solar Engine', detail: 'Over 1,000 cubic kilometers of water evaporate into the sky every single day.' },
        { icon: '☁️', title: 'Cloud Weight', detail: 'A single cumulus cloud weighs ~500,000 kilograms (as heavy as 100 elephants).' },
        { icon: '💧', title: 'Liquid Freshwater', detail: 'Only 1% of Earth’s water is accessible liquid freshwater for humans and animals.' }
      ],
      handsOnExperiment: {
        title: "The Zip-Lock Window Water Cycle Lab",

        materialsNeeded: ['1 clear zip-lock plastic bag', '1/4 cup water with blue food coloring', 'Tape', 'Sunny window'],
        procedure: "Pour blue water into the bag and seal tightly. Tape it to a sunny window. After 2 hours, watch water evaporate, condense into fog droplets on the plastic, and \"rain\" back down!",

        expectedObservation: "Water vapor condenses on the plastic ceiling and runs down the sides in mini rain rivulets, proving the water cycle in a closed system!"

      },
      journalBadgeQuestion: "The physical transformation of liquid water into invisible gas driven by solar heat is called ____________."

    }
  },
  {
    chapterId: "water-ch2",

    chapterNumber: 2,
    chapterTitle: "Every Drop Counts (Jaisalmer 9 Lakes & Bawri Stepwells)",

    theme: "Water & Aquatic Experiments",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 6",

    icon: "🏰",

    accentColor: "from-amber-400 to-orange-500",

    chapterIntro: {
      title: "Every Drop Counts (Jaisalmer 9 Lakes & Bawri Stepwells)",

      hookScene: "In the scorching Thar Desert of Rajasthan where rain falls only 10 days per year, ancient cities flourished for 650 years with abundant sweet water.",

      bigGuidingQuestion: "How did King Ghadsi engineer a 9-lake rainwater harvesting system 650 years ago without electricity or modern pumps?",

      goldenLaw: "🏰 Ancient Stepwells (Bawris) and interconnected lakes harvest monsoon rainfall so desert communities have water all year.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Gravity-Fed 9-Tank Cascade Architecture",

          imageAsset: "golconda_persian_wheel.jpg",

          pipDialogue: "In 1367 CE, King Ghadsi of Jaisalmer built 9 interconnected lakes at descending elevations. When Lake 1 filled with monsoon rain, water automatically overflowed through carved stone canals into Lake 2, and so on, filling all 9 lakes across miles without wasting a single drop!",

          keyTakeaway: "🏞️ Ghadisar Lake used gravity-fed stone aqueducts to cascade excess monsoon rain across 9 connected reservoirs."

        },
        {
          stepNumber: 2,
          conceptTitle: "Subterranean Bawri Stepwell Thermal Physics",

          imageAsset: "golconda_fort_bastions.jpg",

          pipDialogue: "Surface desert lakes lose water quickly to sun evaporation! Stepwells (Bawris) are deep underground multi-story stone chambers with tiered stairs. The deep subterranean chambers keep harvested rainwater shaded, cool, and shielded from evaporation all summer!",

          keyTakeaway: "🏛️ Deep underground stepwells (Bawris) store shaded rainwater, preventing hot desert sun evaporation."

        }
      ],
      learningRoadmap: [
        'Explore Ghadisar Lake’s 9 interconnected gravity channels.',
        'Understand how subterranean stepwells (Bawris) prevent evaporation loss.',
        'Learn community rainwater harvesting techniques for modern urban homes.'
      ],
      pipThinkFastChallenge: {
        question: "Why did ancient Indian stepwells feature wide stone stairs leading all the way down to the water?",

        options: [
          { text: 'To allow community members to walk down to collect water easily across changing seasonal water levels', isCorrect: true },
          { text: 'For running daily swimming races', isCorrect: false }
        ],
        explanation: "Tiered steps provided safe, easy access to water as the water level changed across dry and wet seasons!"

      }
    },
    fieldJournal: {
      journalId: "journal-water-02",

      journalTitle: "Explorer Log: Desert Hydraulics & Bawri Stepwells",

      fieldBrief: "Analyze ancient rainwater conservation architecture and modern rooftop harvesting systems.",

      specimenFacts: [
        { icon: '🏰', title: '650 Years Old', detail: 'Ghadisar Lake in Jaisalmer was engineered in 1367 CE by King Ghadsi.' },
        { icon: '🏛️', title: 'Bawri Cooling', detail: 'Subterranean stepwells stay 10°C to 15°C cooler than desert surface air.' },
        { icon: '🌧️', title: 'Rooftop Catchment', detail: '100 sq meters of rooftop can harvest over 50,000 liters of monsoon water annually.' }
      ],
      handsOnExperiment: {
        title: "The Interconnected Gravity-Tank Cascade",

        materialsNeeded: ['2 plastic cups with small holes near the rim', 'A tray', 'A cup of water'],
        procedure: "Stack one cup slightly higher than the second. Pour water into Cup 1. Watch how water automatically overflows through the hole to fill Cup 2 — just like Ghadisar’s 9 lakes!",

        expectedObservation: "Water automatically cascades from the higher cup to the lower cup without pumps, demonstrating gravity-fed water harvesting!"

      },
      journalBadgeQuestion: "Deep underground stone stepwells built to conserve rainwater in arid regions are called ____________."

    }
  },
  {
    chapterId: "water-ch3",

    chapterNumber: 3,
    chapterTitle: "Experiments with Water (Density & Dead Sea Buoyancy)",

    theme: "Water & Aquatic Experiments",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 7",

    icon: "🧪",

    accentColor: "from-teal-400 to-cyan-600",

    chapterIntro: {
      title: "Experiments with Water (Density & Dead Sea Buoyancy)",

      hookScene: "A heavy 50,000-ton steel ocean cargo ship floats easily on water, but a tiny 1-gram iron nail drops straight to the bottom.",

      bigGuidingQuestion: "Why does a giant steel ship float on ocean waves, while a tiny steel sewing needle sinks like a rock?",

      goldenLaw: "🧂 Liquid Density Law: Objects float when their density is lower than the surrounding liquid; dissolved salt increases buoyant lift.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "The Physics of Displaced Volume & Density",

          imageAsset: "polyester_raincoat_waterproof.jpg",

          pipDialogue: "Density is how much mass is packed into a space. A solid iron nail is dense and sinks. But a ship is shaped like a giant bowl with massive pockets of empty air, making its average density lower than water so it floats easily!",

          keyTakeaway: "🚢 Hollow ship hulls trap air pockets, reducing overall vessel density below water."

        },
        {
          stepNumber: 2,
          conceptTitle: "Salt Buoyancy in the Dead Sea (300 g/L)",

          imageAsset: "bakelite_handle_clean.jpg",

          pipDialogue: "When you dissolve salt in water, salt molecules squeeze between water molecules, making the liquid much denser! In the Dead Sea, every liter contains 300 grams of salt! The water is so dense that human bodies float effortlessly on the surface without swimming!",

          keyTakeaway: "🌊 Dead Sea water contains 300g salt/L, creating an upward buoyant force that prevents humans from sinking."

        }
      ],
      learningRoadmap: [
        'Understand Archimedes’ principle: Buoyant force = weight of displaced fluid.',
        'Observe how dissolving salt changes fluid density.',
        'Test floating vs. sinking across metals, plastics, wood, and oils.'
      ],
      pipThinkFastChallenge: {
        question: "Why does a fresh egg sink in pure tap water, but rises and floats when you stir 5 spoons of table salt into the glass?",

        options: [
          { text: 'Dissolved salt increases water density above the egg’s density, creating a strong upward buoyant force', isCorrect: true },
          { text: 'The salt turns the egg into a helium balloon', isCorrect: false }
        ],
        explanation: "Adding salt packs more mass into the water volume, increasing buoyant lift until the egg floats!"

      }
    },
    fieldJournal: {
      journalId: "journal-water-03",

      journalTitle: "Explorer Log: Fluid Physics & Dead Sea Salinity",

      fieldBrief: "Investigate density thresholds, surface tension, and buoyancy forces.",

      specimenFacts: [
        { icon: '🧂', title: '300 g/L Salinity', detail: 'The Dead Sea is ~9 times saltier than standard ocean water.' },
        { icon: '🚢', title: 'Air Pockets', detail: 'Hollow ship hulls reduce overall vessel density well below 1.0 g/cm³.' },
        { icon: '💧', title: 'Surface Film', detail: 'Water strider insects walk on water using molecular surface tension.' }
      ],
      handsOnExperiment: {
        title: "Floating Egg Salinity Experiment",

        materialsNeeded: ['1 fresh egg', '1 tall glass of water', 'Table salt & a spoon'],
        procedure: "Place the egg in fresh water (it sinks). Stir in salt one tablespoon at a time until the egg gently rises and floats at the top!",

        expectedObservation: "At 1-2 spoons of salt the egg remains on the bottom; at 4-5 spoons the egg pops up and floats on the surface!"

      },
      journalBadgeQuestion: "An object will float when its density is ____________ than the surrounding liquid."

    }
  },
  {
    chapterId: "water-ch4",

    chapterNumber: 4,
    chapterTitle: "A Treat for Mosquitoes (Microscope Ecology & Ronald Ross)",

    theme: "Water & Aquatic Experiments",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 8",

    icon: "🦟",

    accentColor: "from-emerald-400 to-teal-600",

    chapterIntro: {
      title: "A Treat for Mosquitoes (Microscope Ecology & Ronald Ross)",

      hookScene: "A flowerpot tray with leftover rainwater sits outside for 5 days. Soon, dozens of tiny wiggling creatures swim under the water surface.",

      bigGuidingQuestion: "How do mosquito larvae live under water if they need atmospheric air to breathe, and how can we stop them without poisons?",

      goldenLaw: "🛡️ Eco-Oil Film Barrier floats on water, cutting off larvae oxygen siphons to prevent mosquito breeding safely.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Larval Snorkel Breathing Siphons",

          imageAsset: "plastic_100yrs.jpg",

          pipDialogue: "Mosquito larvae do not have fish gills! Instead, they hang upside down with a microscopic snorkel tube called a breathing siphon poking through the water surface into the air to breathe oxygen!",

          keyTakeaway: "🦟 Mosquito larvae hang upside down and breathe atmospheric oxygen through microscopic surface siphons."

        },
        {
          stepNumber: 2,
          conceptTitle: "Eco-Oil Surface Barrier Science & Ronald Ross",

          imageAsset: "copper_wire_macro.jpg",

          pipDialogue: "When you pour a few drops of oil on stagnant water, oil spreads into a micro-thin layer. This oil film blocks the siphon tubes, suffocating the larvae safely! In 1897 in India, Dr. Ronald Ross discovered that female Anopheles mosquitoes spread malaria, winning the Nobel Prize in Medicine!",

          keyTakeaway: "🔬 Ronald Ross discovered malaria transmission in India; a thin oil film blocks larval breathing siphons without chemical poisons."

        }
      ],
      learningRoadmap: [
        'Study the mosquito lifecycle: Egg ➔ Larva (Wiggler) ➔ Pupa (Tumbler) ➔ Adult Mosquito.',
        'Explore Ronald Ross’s historic Nobel Prize discovery of the malaria parasite.',
        'Learn community prevention: removing stagnant water and introducing Gambusia fish.'
      ],
      pipThinkFastChallenge: {
        question: "Why do mosquito larvae breed in quiet stagnant puddles, but NEVER in fast-flowing rivers or streams?",

        options: [
          { text: 'Fast-moving water currents break their surface breathing siphon and wash eggs away', isCorrect: true },
          { text: 'Mosquitoes get dizzy when water moves fast', isCorrect: false }
        ],
        explanation: "Larvae need completely still water surfaces to anchor their delicate breathing siphon tubes!"

      }
    },
    fieldJournal: {
      journalId: "journal-water-04",

      journalTitle: "Explorer Log: Microscopic Water Ecology & Vector Control",

      fieldBrief: "Track insect metamorphosis, vector transmission pathways, and eco-friendly prevention methods.",

      specimenFacts: [
        { icon: '🔬', title: 'Ronald Ross 1897', detail: 'Proved malaria transmission inside a hospital laboratory in Secunderabad, India.' },
        { icon: '🐟', title: 'Gambusia Fish', detail: 'A single Gambusia guppy fish eats up to 100 mosquito larvae per day.' },
        { icon: '🛡️', title: 'Oil Barrier', detail: '1 teaspoon of eco-oil creates a surface tension barrier across an entire rain barrel.' }
      ],
      handsOnExperiment: {
        title: "The Surface Oil Barrier Demonstration",

        materialsNeeded: ['A bowl of water', '1 drop of cooking oil', 'A toothpick'],
        procedure: "Dip a toothpick in cooking oil and touch the water surface. Watch the oil instantly snap across the surface, forming an impenetrable barrier layer!",

        expectedObservation: "The oil drop spreads into a micro-thin floating film that covers the entire surface, demonstrating how it seals off larval air tubes!"

      },
      journalBadgeQuestion: "The scientist who discovered that female Anopheles mosquitoes transmit malaria in India was Dr. ____________."

    }
  }
];

// ═════════════════════════════════════════════════════════════════════════════
// COURSE 4: SHELTER, MOUNTAINS & EARTH (Theme 3 & 5 / CBSE EVS)
// ═════════════════════════════════════════════════════════════════════════════
export const SHELTER_COURSE_CHAPTERS: CourseChapter[] = [
  {
    chapterId: "shelter-ch1",

    chapterNumber: 1,
    chapterTitle: "A Shelter So High! (Ladakh & Changthang Pashmina)",

    theme: "Shelter, Mountains & Earth",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 13",

    icon: "🏔️",

    accentColor: "from-sky-400 to-indigo-600",

    chapterIntro: {
      title: "A Shelter So High! (Ladakh & Changthang Pashmina)",

      hookScene: "At 5,000 meters altitude on the freezing, wind-swept plains of Changthang in Ladakh, winter blizzards hit -40°C.",

      bigGuidingQuestion: "How does a nomadic tribe survive the extreme cold with only yak-hair tents and mountain goats?",

      goldenLaw: "🏔️ High-altitude Pashmina fibers (~12 microns) trap microscopic air pockets, providing 6x thermal insulation.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Pashmina Micro-Insulation Physics",

          imageAsset: "pashmina_microscope_macro.jpg",

          pipDialogue: "Pashmina goats live at extreme cold altitudes. To stay alive, their bodies grow an undercoat of microscopic wool fibers only 12 to 15 microns thin! Because the fibers are so fine, they trap thousands of tiny insulating air pockets that lock in body heat without adding heavy weight!",

          keyTakeaway: "🐐 Pashmina goat wool is 6x finer than human hair, trapping micro-air pockets for extreme warmth."

        },
        {
          stepNumber: 2,
          conceptTitle: "Yak-Hair Rebo Tent Architecture",

          imageAsset: "sheep_wool_fleece.jpg",

          pipDialogue: "The nomadic Changpa people weave strips of coarse yak hair to construct conical tents called Rebo. Yak hair fibers expand and swell during snowstorms to block freezing drafts, while a top smoke flap lets campfire smoke escape!",

          keyTakeaway: "⛺ Nomadic Rebo tents woven from yak hair swell in snow to block cold winds and insulate families."

        }
      ],
      learningRoadmap: [
        'Explore how terrain and altitude dictate nomadic shelter architecture.',
        'Understand thermal trapped-air insulation in Pashmina wool.',
        'Discover traditional Kashmiri houseboat woodcarving (Khatamband).'
      ],
      pipThinkFastChallenge: {
        question: "Why can Pashmina shawls NOT be woven on modern high-speed factory machines?",

        options: [
          { text: 'The goat hairs are so extraordinarily fine and delicate that high-speed machines would snap them', isCorrect: true },
          { text: 'Factory machines are afraid of goats', isCorrect: false }
        ],
        explanation: "Each 12-micron Pashmina fiber is so delicate that skilled artisans must hand-weave them on traditional wooden looms for 250 hours!"

      }
    },
    fieldJournal: {
      journalId: "journal-shelter-01",

      journalTitle: "Explorer Log: Alpine Cold Desert & Thermal Survival",

      fieldBrief: "Analyze high-altitude nomad architecture and microscopic fiber heat retention.",

      specimenFacts: [
        { icon: '🐐', title: '6x Finer', detail: 'Pashmina fibers measure ~12 microns, 6 times finer than human hair (~75 microns).' },
        { icon: '⛺', title: 'Rebo Strength', detail: 'Yak-hair woven tents withstand subzero Himalayan gale-force winds.' },
        { icon: '🛶', title: 'Khatamband Wood', detail: 'Intricate jigsaw puzzle woodcarving inside Kashmiri Shikara houseboats that fits without nails.' }
      ],
      handsOnExperiment: {
        title: "Trapped Air Insulation Test",

        materialsNeeded: ['2 cups of warm water', '1 tight cotton towel', '1 fluffy woolen mitten or fleece'],
        procedure: "Wrap one warm cup in tight flat cotton and the other in fluffy fleece. After 10 minutes, test which stays hotter to experience how trapped air pockets insulate heat!",

        expectedObservation: "The cup wrapped in fluffy fleece stays much warmer because air pockets trapped in the fibers block heat conduction!"

      },
      journalBadgeQuestion: "One hand-woven Pashmina shawl is as warm as ______ standard winter sweaters."

    }
  },
  {
    chapterId: "shelter-ch2",

    chapterNumber: 2,
    chapterTitle: "Up You Go! (Mountaineering & Mt. Everest Expeditions)",

    theme: "Shelter, Mountains & Earth",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 9",

    icon: "🧗",

    accentColor: "from-amber-400 to-rose-600",

    chapterIntro: {
      title: "Up You Go! (Mountaineering & Mt. Everest Expeditions)",

      hookScene: "At 8,000 meters above sea level on Mt. Everest, air contains only one-third of the oxygen at sea level, and gale-force winds reach 150 km/h.",

      bigGuidingQuestion: "How do mountaineers like Bachendri Pal climb into the Death Zone where the human body cannot survive without special equipment?",

      goldenLaw: "🧗 Low atmospheric pressure at high altitude reduces oxygen intake; climbers rely on iron nutrition, steel crampons, and supplemental oxygen.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Atmospheric Pressure & Oxygen Science",

          imageAsset: "everest_summit_mountaineer.jpg",

          pipDialogue: "As elevation increases, gravity pulls fewer air molecules together, so atmospheric air pressure drops! At high altitudes, every breath gives your lungs less oxygen. Climbers take Iron and Vitamin C to boost oxygen-carrying red blood cells, and use oxygen tanks past 8,000m!",

          keyTakeaway: "🏔️ Atmospheric pressure drops with altitude; iron and vitamin C increase oxygen-carrying hemoglobin."

        },
        {
          stepNumber: 2,
          conceptTitle: "Mountaineering Tool Physics (Crampons & Pitons)",

          imageAsset: "steel_cable_holding.jpg",

          pipDialogue: "Glaciers are slick hard ice! Climbers strap spiky steel Crampons to their boots for traction, hammer steel Pitons into rock faces, and use lightweight nylon safety ropes that can support thousands of kilograms!",

          keyTakeaway: "⚙️ Steel crampons concentrate body weight on sharp points to bite into glacier ice without slipping."

        }
      ],
      learningRoadmap: [
        'Understand atmospheric pressure drop and oxygen scarcity at high altitudes.',
        'Study Bachendri Pal’s historic 1984 Mt. Everest expedition.',
        'Examine mountaineering tools: Crampons, Pitons, Carabiners, and Oxygen Regulators.'
      ],
      pipThinkFastChallenge: {
        question: "Why do expedition leaders give climbers hot jaggery (gur), chana (chickpeas), and Vitamin C tablets every morning?",

        options: [
          { text: 'To give quick energy and increase iron/hemoglobin to carry thin oxygen in their blood', isCorrect: true },
          { text: 'To turn climbers into stone statues', isCorrect: false }
        ],
        explanation: "Iron builds hemoglobin in red blood cells, which binds tightly to oxygen in thin mountain air!"

      }
    },
    fieldJournal: {
      journalId: "journal-shelter-02",

      journalTitle: "Explorer Log: High-Altitude Mountaineering Physiology",

      fieldBrief: "Record mountaineering equipment mechanics and human respiratory adaptations.",

      specimenFacts: [
        { icon: '🏔️', title: '8,848 Meters', detail: 'Mount Everest (Sagarmatha) is Earth’s highest peak above sea level.' },
        { icon: '🩸', title: 'Hemoglobin Adaptation', detail: 'Highlanders produce more red blood cells to capture scarce oxygen molecules.' },
        { icon: '🧗', title: 'Steel Crampons', detail: 'Sharp bottom spikes concentrate body weight to bite deeply into hard glacier ice.' }
      ],
      handsOnExperiment: {
        title: "The Surface Grip & Ice Spike Test",

        materialsNeeded: ['An ice cube from the freezer', 'A flat wooden pencil eraser', 'A metal fork'],
        procedure: "Try pushing the ice cube across a plate with the smooth pencil eraser (it slips). Then press with the fork prongs (crampon simulation). Feel how sharp points grip ice!",

        expectedObservation: "The flat eraser slides effortlessly on the wet ice; the fork prongs dig in and anchor firmly, proving crampon mechanics!"

      },
      journalBadgeQuestion: "The first Indian woman to reach the summit of Mt. Everest in 1984 was ____________."

    }
  },
  {
    chapterId: "shelter-ch3",

    chapterNumber: 3,
    chapterTitle: "Walls Tell Stories (Golconda Fort Architecture)",

    theme: "Shelter, Mountains & Earth",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 10",

    icon: "🏰",

    accentColor: "from-orange-400 to-amber-600",

    chapterIntro: {
      title: "Walls Tell Stories (Golconda Fort Architecture)",

      hookScene: "Inside the massive stone walls of Golconda Fort in Hyderabad, an ancient king received real-time security alerts from 1 kilometer away without phones or electricity.",

      bigGuidingQuestion: "How did medieval engineers design stone arches and hydraulic wheels to lift tons of water and carry secret audio signals?",

      goldenLaw: "🏰 Parabolic acoustic arches reflect sound waves over 1 km; 87 curved bastions (burj) provide 360° defensive visibility.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Architectural Acoustic Resonance",

          imageAsset: "golconda_fateh_darwaza.jpg",

          pipDialogue: "The entrance dome at Fateh Darwaza acts as a parabolic sound amplifier! Soundwaves from a clap bounce off dense stone arches in directed reverberation channels, traveling uphill directly to the King’s palace at Bala Hissar 1 kilometer away!",

          keyTakeaway: "🔊 Parabolic stone arches at Fateh Darwaza amplify soundwaves to transmit warning claps over 1 km."

        },
        {
          stepNumber: 2,
          conceptTitle: "Persian Water Wheel (Rahat) Hydraulics",

          imageAsset: "golconda_persian_wheel.jpg",

          pipDialogue: "To lift thousands of liters of water to hilltop royal gardens, engineers used Persian Wheels! Bullocks walked in circles to turn interlocking wooden gears, rotating an endless chain of clay pots that scooped water from deep wells to the summit!",

          keyTakeaway: "⚙️ Persian wheels used interlocking 90° gears and clay pot chains to lift deep well water to mountaintop palaces."

        }
      ],
      learningRoadmap: [
        'Explore how medieval fort bastions (burj) provided 360° defensive sightlines.',
        'Understand parabolic acoustic arches and sound reflection in stone architecture.',
        'Discover Persian Wheel (Rahat) gear physics for lifting water against gravity.'
      ],
      pipThinkFastChallenge: {
        question: "Why were the outer fortress walls of Golconda built in round, curved shapes (bastions) rather than straight flat walls?",

        options: [
          { text: 'Curved bastions allowed guards to look around corners in all directions without blind spots', isCorrect: true },
          { text: 'Straight walls were illegal in ancient India', isCorrect: false }
        ],
        explanation: "Curved bastions (Burj) give defensive archers a complete 360-degree field of view across the perimeter!"

      }
    },
    fieldJournal: {
      journalId: "journal-shelter-03",

      journalTitle: "Explorer Log: Medieval Hydraulic & Acoustic Engineering",

      fieldBrief: "Analyze fort architecture, sound wave reflection channels, and Persian wheel mechanics.",

      specimenFacts: [
        { icon: '🏰', title: '87 Bastions', detail: 'Golconda Fort features 87 massive stone bastions for defensive sightlines.' },
        { icon: '🔊', title: 'Acoustic Gateway', detail: 'Fateh Darwaza arches act as mechanical acoustic waveguides.' },
        { icon: '⚙️', title: 'Persian Wheel', detail: 'Interlocking 90-degree gears convert horizontal animal movement into vertical water lifting.' }
      ],
      handsOnExperiment: {
        title: "Cone-Shaped Sound Amplifier Test",

        materialsNeeded: ['A sheet of thick paper rolled into a cone', 'A ticking clock or quiet whisper'],
        procedure: "Hold the small end of the cone to your ear and point the wide end toward a soft sound. Experience how parabolic shapes capture and focus soundwaves like Golconda’s arches!",

        expectedObservation: "Faint sounds become remarkably loud and clear as the cone focuses expanding soundwaves into your ear canal!"

      },
      journalBadgeQuestion: "The entrance gate of Golconda Fort that amplifies claps across 1 km is called ____________."

    }
  },
  {
    chapterId: "shelter-ch4",

    chapterNumber: 4,
    chapterTitle: "No Place for Us? (Displacement & Sustainable Villages)",

    theme: "Shelter, Mountains & Earth",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 18",

    icon: "🌾",

    accentColor: "from-emerald-500 to-teal-700",

    chapterIntro: {
      title: "No Place for Us? (Displacement & Sustainable Villages)",

      hookScene: "A rural river valley is scheduled to be flooded by a new 200-meter hydroelectric dam reservoir.",

      bigGuidingQuestion: "How can society balance generating clean renewable electricity with protecting human homes and river ecosystems?",

      goldenLaw: "🌾 Sustainable eco-villages generate decentralized clean energy using solar micro-grids, bio-gas, and local building materials.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Hydroelectric Potential Energy",

          imageAsset: "natural_wood_timber.jpg",

          pipDialogue: "Hydro dams trap river water behind massive walls. When gates open, water rushes through turbines, turning mechanical energy into electricity! But large dams also submerge fertile farmlands and force families to relocate.",

          keyTakeaway: "🌊 Hydro dams convert water potential energy into electricity, but submerge fertile river valleys."

        },
        {
          stepNumber: 2,
          conceptTitle: "Sustainable Decentralized Eco-Architecture",

          imageAsset: "lightbulb_glowing_bright.jpg",

          pipDialogue: "Modern ecological architects design sustainable village solutions: rooftop solar panels, rainwater harvesting tanks, and breathable mud-and-bamboo homes that generate power without destroying natural riverbeds!",

          keyTakeaway: "☀️ Decentralized solar panels and bio-climatic mud homes generate clean energy locally without flooding forests."

        }
      ],
      learningRoadmap: [
        'Understand how hydroelectric dams convert water potential energy into electricity.',
        'Explore the social and environmental trade-offs of mega-infrastructure projects.',
        'Discover local renewable solutions: Solar micro-grids, bio-gas, and eco-homes.'
      ],
      pipThinkFastChallenge: {
        question: "What is a major advantage of solar rooftop micro-grids over gigantic mega-dams?",

        options: [
          { text: 'Solar panels generate clean electricity directly where people live without flooding forests or displacing villages', isCorrect: true },
          { text: 'Solar panels make it rain lemonade', isCorrect: false }
        ],
        explanation: "Decentralized solar energy provides clean power without destroying natural ecosystems or displacing families!"

      }
    },
    fieldJournal: {
      journalId: "journal-shelter-04",

      journalTitle: "Explorer Log: Eco-Infrastructure & Renewable Energy",

      fieldBrief: "Document energy generation methods and sustainable village planning.",

      specimenFacts: [
        { icon: '🌊', title: 'Hydroelectric Power', detail: 'Water falling through dam penstocks spins turbines at over 300 RPM.' },
        { icon: '☀️', title: 'Solar Photovoltaic', detail: 'Solar silicon cells convert photons of sunlight directly into electricity.' },
        { icon: '🎋', title: 'Bamboo-Mud Walls', detail: 'Natural mud-straw plaster regulates indoor temperatures naturally in all seasons.' }
      ],
      handsOnExperiment: {
        title: "Mini Water Turbine Simulation",

        materialsNeeded: ['A plastic pinwheel or toy propeller', 'A stream of tap water'],
        procedure: "Hold the pinwheel blades under running tap water. Observe how the kinetic energy of moving water spins the wheel — the exact same physics used in hydroelectric dams!",

        expectedObservation: "The kinetic force of flowing water immediately rotates the turbine wheel at high speed, demonstrating hydropower generation!"

      },
      journalBadgeQuestion: "Generating electricity directly from sunlight using silicon solar cells is called ____________ energy."

    }
  },
  {
    chapterId: "shelter-ch5",

    chapterNumber: 5,
    chapterTitle: "When the Earth Shook! (Seismic Waves & Bhunga Architecture)",

    theme: "Shelter, Mountains & Earth",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 14",

    icon: "🏚️",

    accentColor: "from-rose-500 to-amber-600",

    chapterIntro: {
      title: "When the Earth Shook! (Seismic Waves & Bhunga Architecture)",

      hookScene: "On the morning of Republic Day 2001 in Bhuj, Gujarat, the ground violently shook in a 7.7 magnitude earthquake.",

      bigGuidingQuestion: "Why did ancient circular mud huts (Bhungas) survive the shaking while modern square concrete buildings collapsed?",

      goldenLaw: "🏚️ Circular Bhunga walls distribute lateral earthquake shockwaves evenly without sharp corners to crack.",

      conceptSteps: [
        {
          stepNumber: 1,
          conceptTitle: "Tectonic Plate Friction & Seismic Waves",

          imageAsset: "wood_450yrs.jpg",

          pipDialogue: "The crust of Earth is made of giant moving puzzle pieces called Tectonic Plates! When two plates grind against each other, friction locks them until they suddenly snap! The stored energy radiates outwards in violent ripples called Seismic Shockwaves!",

          keyTakeaway: "🌍 Tectonic plate friction releases stored elastic energy as violent seismic ground shockwaves."

        },
        {
          stepNumber: 2,
          conceptTitle: "The Physics of Circular Bhunga Architecture",

          imageAsset: "natural_wood_timber.jpg",

          pipDialogue: "Square buildings have sharp 90-degree corners where earthquake stresses concentrate and crack. Traditional Kutch Bhungas are built completely circular with flexible bamboo and clay plaster, allowing shockwaves to flow smoothly around the structure!",

          keyTakeaway: "🛖 Circular Bhunga homes distribute lateral shaking forces equally across all points, resisting collapse."

        }
      ],
      learningRoadmap: [
        'Understand tectonic plate boundaries and seismic wave propagation.',
        'Learn the Golden Rule of Earthquake Safety: Drop, Cover, and Hold On!',
        'Discover circular architecture physics used in traditional Bhungas and modern skyscrapers.'
      ],
      pipThinkFastChallenge: {
        question: "If an earthquake strikes while you are indoors in a classroom or home, what is the safest immediate action?",

        options: [
          { text: 'DROP to your knees, take COVER under a sturdy desk, and HOLD ON firmly until shaking stops', isCorrect: true },
          { text: 'Rush into an elevator and push all buttons', isCorrect: false }
        ],
        explanation: "Drop, Cover, and Hold On protects your head and spine from falling ceiling debris during tremors!"

      }
    },
    fieldJournal: {
      journalId: "journal-shelter-05",

      journalTitle: "Explorer Log: Seismology & Earthquake-Resistant Design",

      fieldBrief: "Analyze tectonic plate motion, emergency safety drills, and seismic structural mechanics.",

      specimenFacts: [
        { icon: '🌍', title: 'Tectonic Plates', detail: 'The Indian tectonic plate collides with the Eurasian plate at ~5 cm per year, pushing the Himalayas higher!' },
        { icon: '📉', title: 'Seismograph', detail: 'Seismometers record P (primary compression) and S (secondary shear) shockwaves.' },
        { icon: '🛖', title: 'Circular Bhunga', detail: 'Cylindrical walls distribute earthquake lateral forces equally across all points.' }
      ],
      handsOnExperiment: {
        title: "Square vs. Circle Structural Strength Test",

        materialsNeeded: ['4 strips of cardboard arranged as a square', '1 strip taped into a cylinder', 'A light book for weight'],
        procedure: "Push side-to-side on the cardboard square (it collapses easily). Then push on the cardboard cylinder. Feel how circular geometry resists side shaking without collapsing!",

        expectedObservation: "The square buckles instantly under lateral shear force; the cylinder distributes the force evenly around its perimeter and remains standing!"

      },
      journalBadgeQuestion: "The three lifesaving safety steps to take during an earthquake are: Drop, ____________, and Hold On."

    }
  }
];

export const ALL_COURSES_CATALOG = [
  {
    courseId: "things-we-make-materials",

    courseName: "Things We Make & Do: Materials",

    syllabusCode: "CBSE Class 5 EVS • Theme 6",

    icon: "🧪",

    chapters: MATERIALS_COURSE_CHAPTERS
  },
  {
    courseId: "super-senses-living-world",

    courseName: "Super Senses & Living World",

    syllabusCode: "CBSE Class 5 EVS • Theme 1",

    icon: "🐾",

    chapters: SUPER_SENSES_COURSE_CHAPTERS
  },
  {
    courseId: "water-aquatic-experiments",

    courseName: "Water & Aquatic Experiments",

    syllabusCode: "CBSE Class 5 EVS • Theme 2 & 4",

    icon: "🌊",

    chapters: WATER_COURSE_CHAPTERS
  },
  {
    courseId: "shelter-mountains-earth",

    courseName: "Shelter, Mountains & Earth",

    syllabusCode: "CBSE Class 5 EVS • Theme 3 & 5",

    icon: "🏔️",

    chapters: SHELTER_COURSE_CHAPTERS
  }
];
