export interface Theme1Chapter {
  id: string;
  chapterNumber: number;
  curriculumCode?: string;
  title: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  concepts: string[];
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

export const THEME_1_CHAPTERS: Theme1Chapter[] = [
  {
    id: 'chapter-1',
    chapterNumber: 1,
    title: 'Super Senses in Animals',
    subtitle: 'Smell, Sight, Sound & Pheromone Superpowers',
    icon: '🐜',
    themeColor: 'from-amber-400 to-emerald-500',
    concepts: ['Pheromone trails', 'Telescopic vision', 'Echolocation', 'Silkworm antenna'],
    scientificPrinciple:
      'Animals possess specialized sensory organs adapted to their survival: ants leave scent chemicals (pheromones), eagles see 4x further than humans, and moths smell over miles.',
    realWorldWonder:
      'Why do ants always walk in a neat, straight line? If you place a pencil across their path, they pause, wave their antennae, and quickly find the scent trail again!',
    sentenceForSpeechCoach:
      'Ants leave invisible scent chemicals called pheromones so the entire colony can follow the path to food.',
    speechAudioPrompt: 'Read this scientific fact aloud into your microphone!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'A single drop of sugar syrup drops on the floor. Within minutes, dozens of worker ants march in an unbroken line to carry it away.',
        bigQuestion: 'How do tiny ants communicate navigation routes without spoken words or maps?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Pheromone Chemical Signals',
          pipTeaching: 'Ants produce microscopic chemical scent markers called pheromones from their abdominal glands. When an ant discovers food, it leaves a continuous scent line that other colony members detect using thousands of sensory hairs on their antennae!'
        },
        {
          step: 2,
          concept: '4x Telescopic Zoom in Eagles',
          pipTeaching: 'Eagles fly over 2,000 meters above the earth and spot small mice in the grass. Their retinas contain two foveae packed with 4x more cone photoreceptors than human eyes, providing optical zoom vision!'
        }
      ],
      learningRoadmap: [
        'Understand chemical pheromone trails in insect colonies.',
        'Explore telescopic foveal vision in birds of prey.',
        'Discover how silkworm moths detect airborne scent molecules from kilometers away.'
      ],
      pipThinkFastChallenge: {
        question: 'Why do male silkworm moths have large, feathery antennae?',
        options: [
          { text: 'To capture single airborne scent molecules released by female moths kilometers away', isCorrect: true },
          { text: 'To use them as feathers for flying faster', isCorrect: false }
        ],
        explanation: 'Feathery antennae dramatically increase surface area to catch sparse chemical scent molecules!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Animal Sensory Radar',
      missionBrief: 'Investigate bio-sensory adaptations across insects, birds, and nocturnal mammals.',
      factLog: [
        { icon: '🐜', title: 'Ant Sensilla', fact: 'Ant antennae have over 400 specialized odorant receptors.' },
        { icon: '🦅', title: 'Eagle Zoom', fact: 'An eagle can resolve fine details from 4x the distance of human vision.' },
        { icon: '🐕', title: 'Canine Scent', fact: 'Dogs smell 10,000 to 100,000 times more sensitively than humans.' }
      ],
      handsOnExperiment: {
        title: 'Scent Direction Blindfold Test',
        materials: ['Cotton ball soaked in vanilla/lemon essence', 'A blindfold', 'A friend or family member'],
        instructions: 'Blindfold a friend. Hold the scent 1 meter to their left, right, or behind them. Test how accurately human ears and noses detect scent direction compared to animals!'
      },
      journalBadgeQuestion: 'Chemical scent messages left by insects to guide their colony are called ____________.'
    },
    discoveryBadge: {
      id: 'super-senses-badge',
      name: 'Super Animal Senses',
      emoji: '🐜🦅',
      properties: ['Ant Pheromone Scent', 'Eagle 4x Zoom Vision', 'Moth Scent Radar'],
      uses: ['Wildlife tracking', 'Search and rescue dogs', 'Pheromone pest traps'],
      scienceWord: 'Pheromone Communication',
    },
  },
  {
    id: 'chapter-2',
    chapterNumber: 2,
    title: "A Snake Charmer's Story & Reptiles",
    subtitle: 'Ground Vibrations, Hollow Fangs & Antivenom',
    icon: '🐍',
    themeColor: 'from-emerald-400 to-teal-600',
    concepts: ['Ground vibrations', 'Hollow fangs', '4 Poisonous snakes', 'Antivenom medicine'],
    scientificPrinciple:
      'Snakes have no external ears; they detect sound vibrations through their lower jaw touching the ground. Only 4 snakes in India are venomous: Cobra, Common Krait, Russell’s Viper, and Saw-scaled Viper.',
    realWorldWonder:
      'Snake charmers make snakes sway to the music of the been (flute), but snakes cannot hear air sounds! They are simply following the visual movement of the flute pipe and feeling floor vibrations.',
    sentenceForSpeechCoach:
      'Snakes have no external ears and feel footsteps as ground vibrations through their lower jawbone.',
    speechAudioPrompt: 'Read the snake hearing science fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'A snake charmer plays a musical gourd flute (been) and a cobra sways side-to-side inside a wicker basket.',
        bigQuestion: 'If snakes have NO external ears and cannot hear music, why do they sway when the flute moves?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Quadrate Jawbone Acoustic Hearing',
          pipTeaching: 'Snakes have no eardrums or ear holes! Instead, their lower jaw rests directly on the earth. Soundwaves traveling through soil compress the jawbone, transmitting vibrations directly into their inner ear bones!'
        },
        {
          step: 2,
          concept: 'The 4 Venomous Indian Snakes & Antivenom',
          pipTeaching: 'Out of over 300 snake species in India, only 4 are venomous to humans: the Spectacled Cobra, Common Krait, Russell’s Viper, and Saw-scaled Viper. All other snakes are harmless friends to farmers by eating grain-eating rats!'
        }
      ],
      learningRoadmap: [
        'Learn how seismic soil vibrations transmit sound through reptile jawbones.',
        'Identify the 4 venomous snakes of India vs. harmless non-venomous species.',
        'Discover how lifesaving antivenom is manufactured from purified snake venom.'
      ],
      pipThinkFastChallenge: {
        question: 'Why are non-poisonous rat snakes considered the best friends of Indian farmers?',
        options: [
          { text: 'They eat crop-destroying rats and rodents in grain fields without using chemical poisons', isCorrect: true },
          { text: 'They plow the agricultural soil with their tails', isCorrect: false }
        ],
        explanation: 'Snakes provide natural biological pest control by eating millions of field rats every year!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Reptilian Acoustics & Venom Lab',
      missionBrief: 'Document snake sensory biology, fang anatomy, and medical antivenom production.',
      factLog: [
        { icon: '🐍', title: 'The Big 4', fact: 'Only 4 Indian snake species are venomous: Cobra, Krait, Russell’s Viper, Saw-scaled Viper.' },
        { icon: '💉', title: 'Hollow Fangs', fact: 'Snake fangs act like microscopic hypodermic needles to inject venom.' },
        { icon: '🧪', title: 'Antivenom Serum', fact: 'Antivenom medicine is prepared from the venom of the snake itself.' }
      ],
      handsOnExperiment: {
        title: 'Table-Tap Jaw Vibration Simulation',
        materials: ['A wooden table', 'Your chin/jaw'],
        instructions: 'Cover both your ears tightly with your hands. Rest your lower jaw firmly on a wooden table. Have a family member gently tap the far end of the table. Notice how clearly you hear the tapping through your jawbone!'
      },
      journalBadgeQuestion: 'Lifesaving medicine used to treat snakebites is called ____________.'
    },
    discoveryBadge: {
      id: 'snake-senses-badge',
      name: 'Reptile Vibration Senses',
      emoji: '🐍🎶',
      properties: ['Jawbone Seismic Acoustic', 'Thermal Pit Detection', 'Hollow Venom Fangs'],
      uses: ['Seismograph earth monitoring', 'Antivenom emergency medicine', 'Agricultural rodent control'],
      scienceWord: 'Seismic Acoustic Sensing',
    },
  },
  {
    id: 'chapter-3',
    chapterNumber: 3,
    title: 'From Tasting to Digestion',
    subtitle: 'Taste Bud Mapping, Salivary Enzymes & Dr. Beaumont',
    icon: '👅',
    themeColor: 'from-rose-400 to-amber-500',
    concepts: ['Taste bud map', 'Salivary amylase enzyme', 'Stomach acid pH 1.5', 'Dr. Beaumont experiment'],
    scientificPrinciple:
      'The tongue detects 5 primary tastes (Sweet, Salty, Sour, Bitter, Umami). Saliva contains amylase enzymes that break complex starches into sweet glucose sugars within 30 seconds of chewing.',
    realWorldWonder:
      'Why does plain chapati or boiled rice begin to taste sweet after you chew it 30 times in your mouth? Your saliva enzymes are turning starch into sugar before you even swallow!',
    sentenceForSpeechCoach:
      'Saliva contains digestive enzymes that turn complex starch into sweet maltose sugar as you chew.',
    speechAudioPrompt: 'Read the digestive enzyme science fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'You chew a plain, unsweetened piece of roti or boiled rice for 30 seconds without swallowing.',
        bigQuestion: 'Why does plain bread magically start tasting sweet in your mouth after chewing it for 30 seconds?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Salivary Amylase Enzyme Chemistry',
          pipTeaching: 'Your saliva is not just water — it contains a digestive chemical called Amylase enzyme! Amylase cuts long, tasteless starch molecular chains into tiny sweet sugar molecules (maltose) right inside your mouth!'
        },
        {
          step: 2,
          concept: 'Dr. William Beaumont’s Stomach Window',
          pipTeaching: 'In 1822, Dr. William Beaumont studied a patient named Alexis St. Martin who had a healed opening into his stomach. Dr. Beaumont proved that digestion is a chemical process involving digestive juices and body heat (37°C)!'
        }
      ],
      learningRoadmap: [
        'Map taste receptor densities across the human tongue.',
        'Observe salivary amylase turning carbohydrates into sugars.',
        'Understand digestive juices and proper chewing for gut health.'
      ],
      pipThinkFastChallenge: {
        question: 'What did Dr. Beaumont discover about stomach digestion when an individual is stressed or sad?',
        options: [
          { text: 'Digestion slows down and food remains undigested much longer', isCorrect: true },
          { text: 'Food digests 100 times faster when crying', isCorrect: false }
        ],
        explanation: 'Dr. Beaumont proved that emotional stress directly decreases digestive stomach secretions!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Digestive Enzyme & Taste Lab',
      missionBrief: 'Map taste papillae, investigate carbohydrate digestion, and record digestive health facts.',
      factLog: [
        { icon: '👅', title: '10,000 Taste Buds', fact: 'Human tongues replace taste bud cells every 10 to 14 days.' },
        { icon: '🍞', title: 'Amylase Power', fact: 'Chewing 30 times mixes saliva thoroughly to begin digestion in the mouth.' },
        { icon: '🌡️', title: 'Stomach Heat', fact: 'The human stomach maintains ~37°C with hydrochloric acid at pH 1.5 to 2.0.' }
      ],
      handsOnExperiment: {
        title: 'The 30-Second Bread Sweetness Test',
        materials: ['A small piece of plain roti or bread', 'A timer'],
        instructions: 'Place plain bread in your mouth. Chew continuously for 30 seconds without swallowing. Notice how the taste transforms from bland starch into sweet sugar!'
      },
      journalBadgeQuestion: 'The digestive enzyme in saliva that converts starch into sugar is called ____________.'
    },
    discoveryBadge: {
      id: 'digestion-senses-badge',
      name: 'Digestive Chemistry Senses',
      emoji: '👅🍎',
      properties: ['Papillae Taste Mapping', 'Salivary Amylase Enzyme', 'Stomach Acid Breakdown'],
      uses: ['Nutritional science', 'Enzyme therapeutics', 'Digestive health diagnostics'],
      scienceWord: 'Enzymatic Digestion',
    },
  },
  {
    id: 'chapter-4',
    chapterNumber: 4,
    title: 'Seeds and Seeds: Travel & Inventions',
    subtitle: 'George de Mestral, Velcro Micro-Hooks & Dispersal',
    icon: '🌱',
    themeColor: 'from-teal-400 to-emerald-600',
    concepts: ['Velcro bio-mimicry', 'Wind parachutes', 'Water floating husks', 'Animal hook dispersal'],
    scientificPrinciple:
      'Seeds travel far from parent plants to avoid overcrowding: Dandelions use wind parachutes, Coconuts float on ocean currents, and Burdock seeds latch onto animal fur with microscopic elastic hooks (which inspired the invention of Velcro in 1948 by George de Mestral).',
    realWorldWonder:
      'In 1948, Swiss engineer George de Mestral returned from a walk with his dog and noticed tiny burrs sticking stubbornly to his jacket. He examined them under a microscope, saw hundreds of tiny hooks, and invented Velcro!',
    sentenceForSpeechCoach:
      'George de Mestral examined burdock seeds under a microscope and invented Velcro by copying nature.',
    speechAudioPrompt: 'Read the Velcro bio-mimicry science fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'You walk through an overgrown meadow and return with dozens of prickly round burrs stuck firmly to your socks and shoes.',
        bigQuestion: 'How did tiny plant burdock seeds invent the world’s most popular fastener — Velcro?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Seed Dispersal Mechanisms',
          pipTeaching: 'Plants cannot walk, but their seeds travel thousands of miles! Dandelion seeds fly on feathery wind parachutes, coconuts float across oceans on waterproof fibrous husks, and pea pods burst open like spring-loaded catapults!'
        },
        {
          step: 2,
          concept: 'George de Mestral & Velcro Biomimicry',
          pipTeaching: 'In 1948, George de Mestral put a burdock seed under a microscope. He discovered hundreds of tiny microscopic elastic hooks that grab onto fabric loops! He copied this design with nylon to create Velcro (Velours + Crochet)!'
        }
      ],
      learningRoadmap: [
        'Explore 4 major seed dispersal adaptations: Wind, Water, Animal Fur, and Explosive Pods.',
        'Understand Biomimicry: how engineers solve human problems by copying nature.',
        'Examine Velcro hook-and-loop fasteners under 250x microscopic magnification.'
      ],
      pipThinkFastChallenge: {
        question: 'How do heavy coconut seeds travel across oceans from one tropical island to another?',
        options: [
          { text: 'They have fibrous, air-filled waterproof husks that float on ocean currents for months', isCorrect: true },
          { text: 'They are carried by submarines', isCorrect: false }
        ],
        explanation: 'The fibrous buoyant husk of a coconut traps air pockets, allowing it to float across entire oceans!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Botanical Travel & Biomimicry Lab',
      missionBrief: 'Log seed dispersal adaptations and analyze nature-inspired engineering inventions.',
      factLog: [
        { icon: '🌬️', title: 'Wind Parachutes', fact: 'Dandelion seeds can travel over 5 miles on gentle thermal wind currents.' },
        { icon: '🪝', title: 'Burdock Hooks', fact: 'Each burdock seed head contains ~400 microscopic curved elastic hooks.' },
        { icon: '🚀', title: 'Explosive Pods', fact: 'Balsam and pea pods dry in the sun and snap open, flinging seeds up to 5 meters away.' }
      ],
      handsOnExperiment: {
        title: 'Microscopic Velcro Inspection',
        materials: ['A piece of Velcro from a sneaker or bag', 'A magnifying glass or smartphone camera zoom'],
        instructions: 'Look closely at the rough side of the Velcro. Notice the hundreds of tiny stiff hooks, and look at the soft side to see the tangled loops they catch on!'
      },
      journalBadgeQuestion: 'The engineering practice of copying nature’s smart designs to solve human problems is called ____________.'
    },
    discoveryBadge: {
      id: 'velcro-seed-badge',
      name: 'Biomimicry Seed Dispersal',
      emoji: '🌱🌬️',
      properties: ['Microscopic Elastic Hooks', 'Aerodynamic Wind Parachutes', 'Fibrous Hydrophobic Husks'],
      uses: ['Velcro fastener engineering', 'Parachute aviation design', 'Agricultural seed preservation'],
      scienceWord: 'Biomimicry Engineering',
    },
  },
];
