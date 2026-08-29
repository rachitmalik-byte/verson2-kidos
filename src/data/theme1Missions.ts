export interface Theme1Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  themeColor: string;
  concepts: string[];
  scientificPrinciple: string;
  realWorldWonder: string;
  sentenceForSpeechCoach: string;
  speechAudioPrompt: string;
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
      'Snakes have no external ears and feel footsteps through ground vibrations traveling into their jawbones.',
    speechAudioPrompt: 'Speak clearly into your microphone to verify snake hearing science!',
    discoveryBadge: {
      id: 'snake-senses-badge',
      name: 'Acoustic Ground Senses',
      emoji: '🐍👂',
      properties: ['Jawbone Vibration Sensor', 'Hollow Poison Fangs', 'Antivenom Serum'],
      uses: ['Seismic ground sensors', 'Medical antivenom', 'Eco-pest control'],
      scienceWord: 'Acoustic Ground Vibration',
    },
  },
  {
    id: 'chapter-3',
    chapterNumber: 3,
    title: 'From Tasting to Digesting',
    subtitle: 'Tongue Taste Zones, Saliva Enzymes & Dr. Beaumont',
    icon: '👅',
    themeColor: 'from-orange-400 to-rose-500',
    concepts: ['4 Taste zones', 'Saliva starch conversion', 'Gastric juices', 'ORS hydration'],
    scientificPrinciple:
      'The tongue has distinct taste buds for Sweet, Salty, Sour, and Bitter. Saliva contains the enzyme amylase which breaks complex starches into sweet glucose. In the stomach, acidic gastric juices digest proteins.',
    realWorldWonder:
      'If you chew a piece of plain bread or roti for 30 seconds without swallowing, it suddenly tastes sweet! Saliva enzymes turn plain starch into sweet sugar in your mouth!',
    sentenceForSpeechCoach:
      'Saliva contains enzymes that break down starch into sweet sugars before food reaches the stomach.',
    speechAudioPrompt: 'Read aloud the digestive enzyme science discovery!',
    discoveryBadge: {
      id: 'digestion-badge',
      name: 'Digestive Enzymes & Taste',
      emoji: '👅🧪',
      properties: ['4-Zone Taste Map', 'Salivary Amylase Enzyme', 'Gastric Acid Digestion'],
      uses: ['Oral Rehydration Solution (ORS)', 'Digestive health', 'Food science'],
      scienceWord: 'Enzymatic Digestion',
    },
  },
  {
    id: 'chapter-4',
    chapterNumber: 4,
    title: 'Seeds, Dispersal & Velcro Invention',
    subtitle: 'Wind, Water, Animal Hooks & George de Mestral',
    icon: '🌱',
    themeColor: 'from-lime-400 to-emerald-600',
    concepts: ['Wind parachutes', 'Water floating seeds', 'Burdock hooks', 'Velcro invention', 'Germination'],
    scientificPrinciple:
      'Plants disperse seeds using wind (dandelion parachutes), water (floating coconut husks), and animal fur (hooked burdock seeds). In 1948, Swiss engineer George de Mestral examined burdock seeds under a microscope and invented Velcro!',
    realWorldWonder:
      'Ever had prickly burrs stick to your socks after walking in the woods? In 1948, George de Mestral looked at them under a microscope, saw tiny hooks, and invented Velcro fasteners used on sneakers and astronaut suits!',
    sentenceForSpeechCoach:
      'George de Mestral observed hooked burdock seeds under a microscope and invented Velcro fasteners.',
    speechAudioPrompt: 'Read the bio-mimicry invention story into your microphone!',
    discoveryBadge: {
      id: 'velcro-seed-badge',
      name: 'Seed Dispersal & Velcro',
      emoji: '🌱👟',
      properties: ['Microscopic Seed Hooks', 'Wind Parachutes', 'Bio-mimicry Engineering'],
      uses: ['Velcro sneaker straps', 'Space suits', 'Ecosystem reforestation'],
      scienceWord: 'Bio-mimicry Seed Dispersal',
    },
  },
];
