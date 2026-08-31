export interface WaterChapter {
  id: string;
  chapterNumber: number;
  curriculumCode?: string;
  title: string;
  subtitle: string;
  cbseChapterRef: string;
  icon: string;
  themeColor: string;
  concepts: string[];
  stagesCount: number;
  scientificPrinciple: string;
  realWorldWonder: string;
  sentenceForSpeechCoach: string;
  speechAudioPrompt: string;
  chapterIntro: {
    hookAndBigQuestion: {
      scene: string;
      bigQuestion: string;
    };
    coreKnowledge: {
      step: number;
      concept: string;
      pipTeaching: string;
    }[];
    learningRoadmap: string[];
    pipThinkFastChallenge: {
      question: string;
      options: { text: string; isCorrect: boolean }[];
      explanation: string;
    };
  };
  fieldJournal: {
    journalTitle: string;
    missionBrief: string;
    factLog: { icon: string; title: string; fact: string }[];
    handsOnExperiment: {
      title: string;
      materials: string[];
      instructions: string;
    };
    journalBadgeQuestion: string;
  };
  discoveryBadge: {
    id: string;
    name: string;
    emoji: string;
    properties: string[];
    uses: string[];
    scienceWord: string;
  };
}

export const WATER_CHAPTERS: WaterChapter[] = [
  {
    id: 'chapter-water-cycle',
    chapterNumber: 1,
    title: "Earth's Water Cycle Simulation",
    subtitle: 'Evaporation, Condensation, Precipitation & Solar Energy',
    cbseChapterRef: 'CBSE Class 5 EVS • Theme 2 & 4 (Water)',
    icon: '🌊',
    themeColor: 'sky',
    concepts: ['Evaporation', 'Condensation', 'Precipitation', 'Solar Heat', 'Water Vapor'],
    stagesCount: 4,
    scientificPrinciple:
      'Solar thermal radiation evaporates liquid water into water vapor gas. As vapor ascends into the cold upper troposphere, it condenses into cloud droplets that precipitate back to Earth as rain, snow, or hail.',
    realWorldWonder:
      'Did you know that the water molecules falling in today’s rain are the exact same water molecules that dinosaurs drank from 100 million years ago? Water is never destroyed on Earth — it is continuously recycled in the water cycle!',
    sentenceForSpeechCoach:
      'Solar heat evaporates ocean water into vapor, which condenses into clouds and falls as rain.',
    speechAudioPrompt: 'Read the water cycle science fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'A wet puddle on a sunny sidewalk disappears completely after 2 hours without anyone touching it.',
        bigQuestion: 'Where did the water in the sidewalk puddle go, and how does it come back as rain days later?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Solar Evaporation Physics',
          pipTeaching: 'When sunlight hits water, the liquid molecules gain kinetic thermal energy. They speed up, break free from liquid surface tension, and rise into the sky as invisible water vapor gas!'
        },
        {
          step: 2,
          concept: 'Atmospheric Condensation & Rain',
          pipTeaching: 'As warm vapor climbs into the cold high atmosphere, it cools down and clumps onto tiny dust particles, forming billions of cloud droplets! When droplets grow too heavy to float, gravity pulls them down as rain!'
        }
      ],
      learningRoadmap: [
        'Master the 4 stages of the Water Cycle: Evaporation, Condensation, Precipitation, and Collection.',
        'Understand how solar heat powers the endless recycling of Earth’s water.',
        'Discover groundwater recharge and aquifer filtration.'
      ],
      pipThinkFastChallenge: {
        question: 'Why do tiny water droplets appear on the outside of a cold glass of ice water on a warm day?',
        options: [
          { text: 'Warm water vapor in the surrounding room air touches the cold glass surface and condenses into liquid droplets', isCorrect: true },
          { text: 'Water leaks through the solid glass', isCorrect: false }
        ],
        explanation: 'Invisible water vapor in the room air cools rapidly upon touching the cold glass, condensing into liquid droplets!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Planetary Hydrology & States of Water',
      missionBrief: 'Track water phase changes, evaporation rates, and atmospheric condensation.',
      factLog: [
        { icon: '☀️', title: 'Solar Engine', fact: 'Over 1,000 cubic kilometers of water evaporate into the atmosphere every single day.' },
        { icon: '☁️', title: 'Cloud Mass', fact: 'A single fluffy cumulus cloud can weigh over 500,000 kg (as heavy as 100 elephants).' },
        { icon: '💧', title: 'Freshwater Rarity', fact: 'Only 1% of all water on Earth is easily accessible liquid freshwater.' }
      ],
      handsOnExperiment: {
        title: 'The Zip-Lock Window Water Cycle Lab',
        materials: ['A clear plastic zip-lock bag', '1/4 cup of water with 2 drops of blue food coloring', 'Tape to mount on a sunny window'],
        instructions: 'Pour colored water into the bag and seal tightly. Tape it to a sunny window. After 2 hours, watch water evaporate, condense into fog on the bag, and "rain" back down!'
      },
      journalBadgeQuestion: 'The process of liquid water turning into invisible gas from solar heat is called ____________.'
    },
    discoveryBadge: {
      id: 'water-cycle-badge',
      name: 'Hydrological Cycle Master',
      emoji: '🌊☀️',
      properties: ['Phase Change Kinetic Energy', 'Atmospheric Condensation Clumping', 'Gravitational Precipitation'],
      uses: ['Meteorological weather forecasting', 'Groundwater recharge modeling', 'Atmospheric freshwater harvesting'],
      scienceWord: 'Hydrological Cycle',
    },
  },
  {
    id: 'chapter-every-drop-counts',
    chapterNumber: 2,
    title: 'Every Drop Counts (Bawris & Stepwells)',
    subtitle: 'Ghadisar Lake, 9 Interconnected Tanks & Rainwater Harvesting',
    cbseChapterRef: 'NCERT Chapter 6 • Every Drop Counts',
    icon: '🏰',
    themeColor: 'amber',
    concepts: ['Rainwater Harvesting', 'Stepwells (Bawris)', 'Johads', 'Conservation'],
    stagesCount: 4,
    scientificPrinciple:
      'In desert regions with scarce rainfall, ancient Indian hydraulic architects constructed gravity-fed stepwells (Bawris) and interconnected lake networks (like Jaisalmer’s Ghadisar Lake) to harvest and store every drop of monsoon rainfall without wasteful runoff or rapid evaporation.',
    realWorldWonder:
      '650 years ago, King Ghadsi of Jaisalmer constructed 9 interconnected lakes. When Lake 1 was filled to the brim with monsoon rain, water automatically flowed through stone channels into Lake 2, and so on, filling all 9 lakes across miles without electricity!',
    sentenceForSpeechCoach:
      'Ancient stepwells called Bawris collected monsoon rainwater so desert towns had drinking water all year.',
    speechAudioPrompt: 'Read the Bawri rainwater harvesting fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'In the scorching Thar Desert of Rajasthan where rain falls only a few days per year, ancient cities thrived for centuries with crystal-clear drinking water.',
        bigQuestion: 'How did ancient architects design water collection systems 650 years ago that never let a single drop of rain go to waste?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Gravity-Fed 9-Tank Cascade Engineering',
          pipTeaching: 'King Ghadsi built 9 lakes at descending elevations connected by carved stone aqueducts. When the highest lake filled with monsoon rain, the excess naturally cascaded down to fill lower lakes, storing millions of liters of clean water!'
        },
        {
          step: 2,
          concept: 'Underground Bawri Stepwell Physics',
          pipTeaching: 'Surface lakes evaporate quickly under hot desert sun! Stepwells (Bawris) are deep underground multi-story stone chambers that keep harvested rainwater shaded, cool, and shielded from solar evaporation all summer!'
        }
      ],
      learningRoadmap: [
        'Explore Ghadisar Lake’s 9 interconnected gravity channels.',
        'Understand how deep subterranean stepwells (Bawris) prevent evaporation loss.',
        'Learn community rainwater harvesting techniques for modern urban homes.'
      ],
      pipThinkFastChallenge: {
        question: 'Why did ancient Indian stepwells feature wide stone stairs leading all the way down to the water?',
        options: [
          { text: 'To allow community members to walk down to collect water without using heavy rope pulleys', isCorrect: true },
          { text: 'For running daily swimming races', isCorrect: false }
        ],
        explanation: 'Tiered steps provided safe, easy access to water as the water level changed across dry and wet seasons!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Desert Hydraulics & Bawri Stepwells',
      missionBrief: 'Analyze ancient rainwater conservation architecture and modern rooftop harvesting systems.',
      factLog: [
        { icon: '🏰', title: '650 Years Old', fact: 'Ghadisar Lake in Jaisalmer was engineered in 1367 CE by King Ghadsi.' },
        { icon: '🏛️', title: 'Bawri Cooling', fact: 'Subterranean stepwells stay 10°C to 15°C cooler than desert surface air.' },
        { icon: '🌧️', title: 'Rooftop Catchment', fact: '100 sq meters of rooftop can harvest over 50,000 liters of monsoon water annually.' }
      ],
      handsOnExperiment: {
        title: 'The Interconnected Gravity-Tank Cascade',
        materials: ['2 small plastic cups with small holes near the rim', 'A tray', 'A cup of water'],
        instructions: 'Stack one cup slightly higher than the second. Pour water into Cup 1. Watch how water automatically overflows through the hole to fill Cup 2 — just like Ghadisar’s 9 lakes!'
      },
      journalBadgeQuestion: 'Deep underground stone stepwells built to conserve rainwater in arid regions are called ____________.'
    },
    discoveryBadge: {
      id: 'bawri-stepwell-badge',
      name: 'Ancient Hydraulic Architect',
      emoji: '🏰💧',
      properties: ['Gravity Incline Aqueducts', 'Subterranean Thermal Evaporation Shield', 'Catchment Basin Filtration'],
      uses: ['Civil rainwater conservation', 'Groundwater recharge wells', 'Ecological urban water planning'],
      scienceWord: 'Rainwater Harvesting',
    },
  },
  {
    id: 'chapter-experiments-with-water',
    chapterNumber: 3,
    title: 'Experiments with Water (Density & Buoyancy)',
    subtitle: 'Why does an iron nail sink while a giant ship floats? Dead Sea Salt Physics',
    cbseChapterRef: 'NCERT Chapter 7 • Experiments with Water',
    icon: '🧪',
    themeColor: 'teal',
    concepts: ['Buoyancy', 'Density', 'Dead Sea Salt', 'Surface Tension'],
    stagesCount: 4,
    scientificPrinciple:
      'An object floats if its overall density is lower than the liquid it displaces. Adding solute (like salt) increases liquid density, producing a greater upward buoyant force that causes previously sunken objects (like eggs or lemons) to rise and float.',
    realWorldWonder:
      'In the Dead Sea between Israel and Jordan, the water is so rich with 300 grams of dissolved minerals per liter that you cannot sink even if you try! You can comfortably lie on the water surface and read a newspaper without swimming!',
    sentenceForSpeechCoach:
      'Adding salt increases water density, creating an upward buoyant force that makes eggs float.',
    speechAudioPrompt: 'Read the liquid density and buoyancy law aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'A heavy 50,000-ton steel cargo ship floats smoothly on the ocean, but a tiny 1-gram iron nail drops straight to the ocean floor.',
        bigQuestion: 'Why does a giant steel ship float on water, while a tiny steel nail sinks like a rock?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'The Physics of Displaced Volume & Density',
          pipTeaching: 'Density is how much mass is packed into a space. A solid iron nail has high density and sinks. But a ship is shaped like a giant bowl with massive pockets of empty air, making its average density lower than water!'
        },
        {
          step: 2,
          concept: 'Salt Buoyancy in the Dead Sea',
          pipTeaching: 'When you dissolve salt in water, salt molecules squeeze into the spaces between water molecules, making the liquid much denser! In the Dead Sea, water is so dense that human bodies float effortlessly on the surface!'
        }
      ],
      learningRoadmap: [
        'Understand Archimedes’ principle: Buoyant force = weight of displaced fluid.',
        'Observe how dissolving salt changes fluid density.',
        'Test floating vs. sinking across metals, plastics, wood, and oils.'
      ],
      pipThinkFastChallenge: {
        question: 'Why does an unpeeled lime float in a bowl of water, but sinks as soon as you peel off its skin?',
        options: [
          { text: 'The porous peel contains thousands of tiny trapped air pockets that act like a life jacket', isCorrect: true },
          { text: 'The peel makes the lime heavier than water', isCorrect: false }
        ],
        explanation: 'Lime rind is packed with microscopic spongy air pockets that dramatically reduce overall density!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Fluid Physics & Dead Sea Salinity',
      missionBrief: 'Investigate density thresholds, surface tension, and buoyancy forces.',
      factLog: [
        { icon: '🧂', title: '300 g/L Salinity', fact: 'The Dead Sea is ~9 times saltier than standard ocean water.' },
        { icon: '🚢', title: 'Air Pockets', fact: 'Hollow ship hulls reduce overall vessel density well below 1.0 g/cm³.' },
        { icon: '💧', title: 'Surface Film', fact: 'Water strider insects walk on water using molecular surface tension.' }
      ],
      handsOnExperiment: {
        title: 'Floating Egg Salinity Experiment',
        materials: ['1 fresh egg', '1 tall glass of water', 'Table salt & a spoon'],
        instructions: 'Place the egg in fresh water (it sinks). Stir in salt one tablespoon at a time until the egg gently rises and floats at the top!'
      },
      journalBadgeQuestion: 'An object will float when its density is ____________ than the surrounding liquid.'
    },
    discoveryBadge: {
      id: 'density-buoyancy-badge',
      name: 'Buoyancy & Fluid Physicist',
      emoji: '🧪🌊',
      properties: ['Displaced Fluid Buoyant Force', 'Solute Concentration Density Shift', 'Hydrodynamic Hull Geometry'],
      uses: ['Naval submarine ballast control', 'Hydrometer fluid density testing', 'Ocean salinity environmental monitoring'],
      scienceWord: 'Fluid Density & Buoyancy',
    },
  },
  {
    id: 'chapter-mosquito-ecology',
    chapterNumber: 4,
    title: 'A Treat for Mosquitoes (Water Ecology)',
    subtitle: 'Ronald Ross, Microscope Discovery of Malaria & Stagnant Water Cleanliness',
    cbseChapterRef: 'NCERT Chapter 8 • A Treat for Mosquitoes',
    icon: '🦟',
    themeColor: 'emerald',
    concepts: ['Mosquito Larvae', 'Stagnant Water', 'Malaria Prevention', 'Ronald Ross Nobel Prize'],
    stagesCount: 4,
    scientificPrinciple:
      'Female Anopheles mosquitoes breed exclusively in stagnant (still) water, where larvae hang upside down from the water surface to breathe atmospheric oxygen through microscopic siphons. Applying a micro-thin film of oil on stagnant water seals the surface and blocks larval respiration without toxic chemicals.',
    realWorldWonder:
      'In 1897 in Secunderabad, India, Dr. Ronald Ross spent months looking through a microscope at thousands of mosquito stomachs until he proved that female Anopheles mosquitoes transmit malaria parasites — winning the Nobel Prize in Medicine!',
    sentenceForSpeechCoach:
      'Ronald Ross discovered in India that female Anopheles mosquitoes spread malaria.',
    speechAudioPrompt: 'Read the Ronald Ross malaria discovery fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'A small flowerpot tray with leftover rainwater sits outside for 5 days. Soon, hundreds of tiny wiggling creatures swim near the surface.',
        bigQuestion: 'How do mosquito larvae live under water if they need atmospheric air to breathe?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Larval Respiratory Siphons',
          pipTeaching: 'Mosquito larvae do not have fish gills! Instead, they hang upside down with a microscopic snorkel tube called a breathing siphon poking through the water surface into the air!'
        },
        {
          step: 2,
          concept: 'Eco-Oil Surface Barrier Science',
          pipTeaching: 'When you pour a few drops of oil on stagnant water, oil spreads out into a micro-thin layer floating on top. This oil film blocks the siphon tubes, suffocating the larvae safely without dangerous chemical insecticides!'
        }
      ],
      learningRoadmap: [
        'Study the mosquito lifecycle: Egg ➔ Larva (Wiggler) ➔ Pupa (Tumbler) ➔ Adult Mosquito.',
        'Explore Ronald Ross’s historic Nobel Prize discovery of the malaria parasite.',
        'Learn community prevention: removing stagnant water and introducing Gambusia fish.'
      ],
      pipThinkFastChallenge: {
        question: 'Why do mosquito larvae breed in quiet stagnant puddles, but NEVER in fast-flowing rivers or streams?',
        options: [
          { text: 'Fast-moving water currents break their surface breathing siphon and wash eggs away', isCorrect: true },
          { text: 'Mosquitoes get dizzy when water moves fast', isCorrect: false }
        ],
        explanation: 'Larvae need completely still water surfaces to anchor their delicate breathing siphon tubes!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Microscopic Water Ecology & Vector Control',
      missionBrief: 'Track insect metamorphosis, vector transmission pathways, and eco-friendly prevention methods.',
      factLog: [
        { icon: '🔬', title: 'Ronald Ross 1897', fact: 'Proved malaria transmission inside a hospital laboratory in Secunderabad, India.' },
        { icon: '🐟', title: 'Gambusia Fish', fact: 'A single Gambusia guppy fish eats up to 100 mosquito larvae per day.' },
        { icon: '🛡️', title: 'Oil Barrier', fact: '1 teaspoon of eco-oil creates a surface tension barrier across an entire rain barrel.' }
      ],
      handsOnExperiment: {
        title: 'The Surface Oil Barrier Demonstration',
        materials: ['A bowl of water', '1 drop of cooking oil', 'A toothpick'],
        instructions: 'Dip a toothpick in cooking oil and touch the water surface. Watch the oil instantly snap across the surface, forming an impenetrable barrier layer!'
      },
      journalBadgeQuestion: 'The scientist who discovered that female Anopheles mosquitoes transmit malaria in India was Dr. ____________.'
    },
    discoveryBadge: {
      id: 'mosquito-ecology-badge',
      name: 'Microscopic Vector Biologist',
      emoji: '🦟🔬',
      properties: ['Larval Siphon Respiration Mechanics', 'Vector Parasite Transmission Cycle', 'Surface Film Ecological Barrier'],
      uses: ['Public health vector eradication', 'Microscopic parasitology diagnostics', 'Biological mosquito control'],
      scienceWord: 'Vector Ecology',
    },
  },
];
