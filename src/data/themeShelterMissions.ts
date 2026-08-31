export interface ShelterChapter {
  id: string;
  chapterNumber: number;
  cbseChapterRef: string;
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

export const SHELTER_CHAPTERS: ShelterChapter[] = [
  {
    id: 'shelter-ch1',
    chapterNumber: 1,
    cbseChapterRef: 'NCERT / CBSE EVS Chapter 13',
    title: 'A Shelter So High! (Ladakh & Changthang)',
    subtitle: 'Changpa Nomads, Yak-Hair Rebo Tents & Pashmina Science',
    icon: '🏔️',
    themeColor: 'from-sky-400 to-indigo-600',
    concepts: ['Cold desert', '5,000m Altitude', 'Pashmina goat hair', 'Rebo yak tent', 'Houseboat Khatamband'],
    scientificPrinciple:
      'At 5,000 meters altitude on the Changthang plateau, temperatures drop to -40°C. To survive the extreme cold, Pashmina goats grow a coat of ultra-fine hair, 6 times finer than human hair. One Pashmina shawl is as warm as 6 thick sweaters and takes 250 hours of skilled hand-weaving!',
    realWorldWonder:
      'Why do the nomadic Changpa people live in freezing mountains at 5,000 meters? Because the higher and colder it gets, the softer and finer their goats’ Pashmina wool grows!',
    sentenceForSpeechCoach:
      'Pashmina goat hair is six times finer than human hair and keeps you warm even at minus forty degrees.',
    speechAudioPrompt: 'Read the Pashmina thermal science fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'At 5,000 meters altitude on the freezing, wind-swept plains of Changthang in Ladakh, winter blizzards hit -40°C.',
        bigQuestion: 'How does a nomadic tribe survive the extreme cold with only yak-hair tents and mountain goats?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Pashmina Micro-Insulation Physics',
          pipTeaching: 'Pashmina goats live at extreme cold altitudes. To stay alive, their bodies grow an undercoat of microscopic wool fibers only 12 to 15 microns thin! Because the fibers are so fine, they trap thousands of tiny insulating air pockets that lock in body heat without adding heavy weight!'
        },
        {
          step: 2,
          concept: 'Yak-Hair Rebo Tent Architecture',
          pipTeaching: 'The nomadic Changpa people weave strips of coarse yak hair to construct conical tents called Rebo. Yak hair fibers expand and swell during snowstorms to block freezing drafts, while a top smoke flap lets campfire smoke escape!'
        }
      ],
      learningRoadmap: [
        'Explore how terrain and altitude dictate nomadic shelter architecture.',
        'Understand thermal trapped-air insulation in Pashmina wool.',
        'Discover traditional Kashmiri houseboat woodcarving (Khatamband).'
      ],
      pipThinkFastChallenge: {
        question: 'Why can Pashmina shawls NOT be woven on modern high-speed factory machines?',
        options: [
          { text: 'The goat hairs are so extraordinarily fine and delicate that high-speed machines would snap them', isCorrect: true },
          { text: 'Factory machines are afraid of goats', isCorrect: false }
        ],
        explanation: 'Each 12-micron Pashmina fiber is so delicate that skilled artisans must hand-weave them on traditional wooden looms for 250 hours!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Alpine Cold Desert & Thermal Survival',
      missionBrief: 'Analyze high-altitude nomad architecture and microscopic fiber heat retention.',
      factLog: [
        { icon: '🐐', title: '6x Finer', fact: 'Pashmina fibers measure ~12 microns, 6 times finer than human hair (~75 microns).' },
        { icon: '⛺', title: 'Rebo Strength', fact: 'Yak-hair woven tents withstand subzero Himalayan gale-force winds.' },
        { icon: '🛶', title: 'Khatamband Wood', fact: 'Intricate jigsaw puzzle woodcarving inside Kashmiri Shikara houseboats that fits without nails.' }
      ],
      handsOnExperiment: {
        title: 'Trapped Air Insulation Test',
        materials: ['2 cups of warm water', '1 tight cotton towel', '1 fluffy woolen mitten or fleece'],
        instructions: 'Wrap one warm cup in tight flat cotton and the other in fluffy fleece. After 10 minutes, test which stays hotter to experience how trapped air pockets insulate heat!'
      },
      journalBadgeQuestion: 'One hand-woven Pashmina shawl is as warm as ______ standard winter sweaters.'
    },
    discoveryBadge: {
      id: 'pashmina-shelter-badge',
      name: 'High-Altitude Thermal Senses',
      emoji: '🏔️🐐',
      properties: ['Ultra-Fine Micro-Fiber', '6x Heat Trapping Insulation', 'Yak-Hair Rebo Weave'],
      uses: ['Thermal extreme-cold wear', 'Nomadic alpine shelters', 'Hand-woven heritage'],
      scienceWord: 'High-Altitude Thermal Insulation',
    },
  },
  {
    id: 'shelter-ch2',
    chapterNumber: 2,
    cbseChapterRef: 'NCERT / CBSE EVS Chapter 9',
    title: 'Up You Go! (Mountaineering & Mt. Everest)',
    subtitle: 'Bachendri Pal, Pitons, Thin Air Pressure & Crampons',
    icon: '🧗',
    themeColor: 'from-amber-400 to-rose-600',
    concepts: ['Bachendri Pal 1984', 'Mt. Everest 8848m', 'Low Oxygen (Hypoxia)', 'Crampons & Pitons', 'Vitamin C & Iron'],
    scientificPrinciple:
      'As you climb higher up mountains, atmospheric air pressure drops and oxygen becomes thin. Mountaineers take Vitamin C and iron tablets to increase hemoglobin in their blood, and carry pressurized oxygen cylinders past 8,000m in the Death Zone.',
    realWorldWonder:
      'On May 23, 1984, Bachendri Pal became the first Indian woman to conquer Mt. Everest (8,848 meters). At the summit, the temperature was -30°C and winds raged at 150 km/h!',
    sentenceForSpeechCoach:
      'Bachendri Pal became the first Indian woman to summit Mount Everest in nineteen eighty four.',
    speechAudioPrompt: 'Read the Mt. Everest mountaineering history fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'At 8,000 meters above sea level on Mt. Everest, air contains only one-third of the oxygen at sea level, and gale-force winds reach 150 km/h.',
        bigQuestion: 'How do mountaineers like Bachendri Pal climb into the Death Zone where the human body cannot survive without special equipment?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Atmospheric Pressure & Oxygen Science',
          pipTeaching: 'As elevation increases, gravity pulls fewer air molecules together, so atmospheric air pressure drops! At high altitudes, every breath gives your lungs less oxygen. Climbers take Iron and Vitamin C to boost oxygen-carrying red blood cells, and use oxygen tanks past 8,000m!'
        },
        {
          step: 2,
          concept: 'Mountaineering Tool Physics',
          pipTeaching: 'Glaciers are slick hard ice! Climbers strap spiky steel Crampons to their boots for traction, hammer steel Pitons into rock faces, and use lightweight nylon safety ropes that can support thousands of kilograms!'
        }
      ],
      learningRoadmap: [
        'Understand atmospheric pressure drop and oxygen scarcity at high altitudes.',
        'Study Bachendri Pal’s historic 1984 Mt. Everest expedition.',
        'Examine mountaineering tools: Crampons, Pitons, Carabiners, and Oxygen Regulators.'
      ],
      pipThinkFastChallenge: {
        question: 'Why do expedition leaders give climbers hot jaggery (gur), chana (chickpeas), and Vitamin C tablets every morning?',
        options: [
          { text: 'To give quick energy and increase iron/hemoglobin to carry thin oxygen in their blood', isCorrect: true },
          { text: 'To turn climbers into stone statues', isCorrect: false }
        ],
        explanation: 'Iron builds hemoglobin in red blood cells, which binds tightly to oxygen in thin mountain air!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: High-Altitude Mountaineering Physiology',
      missionBrief: 'Record mountaineering equipment mechanics and human respiratory adaptations.',
      factLog: [
        { icon: '🏔️', title: '8,848 Meters', fact: 'Mount Everest (Sagarmatha) is Earth’s highest peak above sea level.' },
        { icon: '🩸', title: 'Hemoglobin Adaptation', fact: 'Highlanders produce more red blood cells to capture scarce oxygen molecules.' },
        { icon: '🧗', title: 'Steel Crampons', fact: 'Sharp bottom spikes concentrate body weight to bite deeply into hard glacier ice.' }
      ],
      handsOnExperiment: {
        title: 'The Surface Grip & Ice Spike Test',
        materials: ['An ice cube from the freezer', 'A flat wooden pencil eraser', 'A sharp metal fork'],
        instructions: 'Try pushing the ice cube across a plate with the smooth pencil eraser (it slips). Then press with the fork prongs (crampon simulation). Feel how sharp points grip ice!'
      },
      journalBadgeQuestion: 'The first Indian woman to reach the summit of Mt. Everest in 1984 was ____________.'
    },
    discoveryBadge: {
      id: 'mountaineering-badge',
      name: 'High-Altitude Mountaineering',
      emoji: '🧗🏔️',
      properties: ['Crampon Ice Traction', 'Atmospheric Oxygen Physics', 'Tensile Safety Anchor'],
      uses: ['Alpine exploration gear', 'Hypoxia medical monitoring', 'Extreme survival logistics'],
      scienceWord: 'High-Altitude Physiology',
    },
  },
  {
    id: 'shelter-ch3',
    chapterNumber: 3,
    cbseChapterRef: 'NCERT / CBSE EVS Chapter 10',
    title: 'Walls Tell Stories (Golconda Fort Architecture)',
    subtitle: 'Acoustic Arches, Bastions & Persian Water Wheels',
    icon: '🏰',
    themeColor: 'from-orange-400 to-amber-600',
    concepts: ['Golconda Fort Hyderabad', '87 Bastions (Burj)', 'Persian Water Wheel hydraulics', 'Fateh Darwaza Acoustics'],
    scientificPrinciple:
      'Golconda Fort used ingenious medieval engineering: 87 curved bastions (burj) gave soldiers 360-degree vision. Acoustic arches at Fateh Darwaza amplified sound so a clap at the gate warned the king 1 km away at the hilltop Bala Hissar!',
    realWorldWonder:
      'If you stand under the dome of Fateh Darwaza at the entrance of Golconda Fort and clap your hands, the sound travels through arched stone sound channels and can be heard clearly at the highest palace point 1 kilometer away!',
    sentenceForSpeechCoach:
      'Acoustic arches at Golconda Fort transmitted sound from the gate to the hilltop palace one kilometer away.',
    speechAudioPrompt: 'Read the Golconda architectural acoustics fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'Inside the massive stone walls of Golconda Fort in Hyderabad, an ancient king received real-time security alerts from 1 kilometer away without phones or electricity.',
        bigQuestion: 'How did medieval engineers design stone arches and hydraulic wheels to lift tons of water and carry secret audio signals?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Architectural Acoustic Resonance',
          pipTeaching: 'The entrance dome at Fateh Darwaza acts as a parabolic sound amplifier! Soundwaves from a clap bounce off dense stone arches in directed reverberation channels, traveling uphill directly to the King’s palace at Bala Hissar!'
        },
        {
          step: 2,
          concept: 'Persian Water Wheel (Rahat) Hydraulics',
          pipTeaching: 'To lift thousands of liters of water to hilltop royal gardens, engineers used Persian Wheels! Bullocks walked in circles to turn interlocking wooden gears, rotating an endless chain of clay pots that scooped water from deep wells to the summit!'
        }
      ],
      learningRoadmap: [
        'Explore how medieval fort bastions (burj) provided 360° defensive sightlines.',
        'Understand parabolic acoustic arches and sound reflection in stone architecture.',
        'Discover Persian Wheel (Rahat) gear physics for lifting water against gravity.'
      ],
      pipThinkFastChallenge: {
        question: 'Why were the outer fortress walls of Golconda built in round, curved shapes (bastions) rather than straight flat walls?',
        options: [
          { text: 'Curved bastions allowed guards to look around corners in all directions without blind spots', isCorrect: true },
          { text: 'Straight walls were illegal in ancient India', isCorrect: false }
        ],
        explanation: 'Curved bastions (Burj) give defensive archers a complete 360-degree field of view across the perimeter!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Medieval Hydraulic & Acoustic Engineering',
      missionBrief: 'Analyze fort architecture, sound wave reflection channels, and Persian wheel mechanics.',
      factLog: [
        { icon: '🏰', title: '87 Bastions', fact: 'Golconda Fort features 87 massive stone bastions for defensive sightlines.' },
        { icon: '🔊', title: 'Acoustic Gateway', fact: 'Fateh Darwaza arches act as mechanical acoustic waveguides.' },
        { icon: '⚙️', title: 'Persian Wheel', fact: 'Interlocking 90-degree gears convert horizontal animal movement into vertical water lifting.' }
      ],
      handsOnExperiment: {
        title: 'Cone-Shaped Sound Amplifier Test',
        materials: ['A sheet of thick paper rolled into a cone', 'A ticking clock or quiet whisper'],
        instructions: 'Hold the small end of the cone to your ear and point the wide end toward a soft sound. Experience how parabolic shapes capture and focus soundwaves like Golconda’s arches!'
      },
      journalBadgeQuestion: 'The entrance gate of Golconda Fort that amplifies claps across 1 km is called ____________.'
    },
    discoveryBadge: {
      id: 'fort-architecture-badge',
      name: 'Historical Engineering Acoustics',
      emoji: '🏰🔊',
      properties: ['Acoustic Waveguide Arch', '360° Bastion Geometry', 'Persian Wheel Hydraulics'],
      uses: ['Architectural concert hall acoustics', 'Hydraulic fluid lifting', 'Defensive structural design'],
      scienceWord: 'Acoustic Architecture',
    },
  },
  {
    id: 'shelter-ch4',
    chapterNumber: 4,
    cbseChapterRef: 'NCERT / CBSE EVS Chapter 18',
    title: 'No Place for Us? (Displacement & Sustainable Villages)',
    subtitle: 'Khedi Village, River Dams, Solar Micro-Grids & Ecology',
    icon: '🌾',
    themeColor: 'from-emerald-500 to-teal-700',
    concepts: ['Khedi Village displacement', 'Tehri Dam on River Ganga', 'Bamboo Mud Homes', 'Solar Micro-Grids'],
    scientificPrinciple:
      'Hydroelectric dams generate renewable electricity by harnessing gravitational potential energy of water, but large reservoirs submerge ancient forests and displace farming communities. Modern ecological engineers design decentralized solar micro-grids and eco-homes that preserve local ecosystems.',
    realWorldWonder:
      'When the massive Tehri Dam was built on the Bhagirathi River, entire historic towns and villages were submerged beneath 260 meters of water to generate clean hydroelectric power for distant cities!',
    sentenceForSpeechCoach:
      'Sustainable eco-villages use solar energy, natural building materials, and rainwater harvesting.',
    speechAudioPrompt: 'Read the sustainable ecology fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'A rural river valley is scheduled to be flooded by a new 200-meter hydroelectric dam reservoir.',
        bigQuestion: 'How can society balance generating clean renewable electricity with protecting human homes and river ecosystems?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Hydroelectric Potential Energy',
          pipTeaching: 'Hydro dams trap river water behind massive walls. When gates open, water rushes through turbines, turning mechanical energy into electricity! But large dams also submerge fertile farmlands and force families to relocate.'
        },
        {
          step: 2,
          concept: 'Sustainable Decentralized Eco-Architecture',
          pipTeaching: 'Modern ecological architects design sustainable village solutions: rooftop solar panels, rainwater harvesting tanks, and breathable mud-and-bamboo homes that generate power without destroying natural riverbeds!'
        }
      ],
      learningRoadmap: [
        'Understand how hydroelectric dams convert water potential energy into electricity.',
        'Explore the social and environmental trade-offs of mega-infrastructure projects.',
        'Discover local renewable solutions: Solar micro-grids, bio-gas, and eco-homes.'
      ],
      pipThinkFastChallenge: {
        question: 'What is a major advantage of solar rooftop micro-grids over gigantic mega-dams?',
        options: [
          { text: 'Solar panels generate clean electricity directly where people live without flooding forests or displacing villages', isCorrect: true },
          { text: 'Solar panels make it rain lemonade', isCorrect: false }
        ],
        explanation: 'Decentralized solar energy provides clean power without destroying natural ecosystems or displacing families!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Eco-Infrastructure & Renewable Energy',
      missionBrief: 'Document energy generation methods and sustainable village planning.',
      factLog: [
        { icon: '🌊', title: 'Hydroelectric Power', fact: 'Water falling through dam penstocks spins turbines at over 300 RPM.' },
        { icon: '☀️', title: 'Solar Photovoltaic', fact: 'Solar silicon cells convert photons of sunlight directly into electricity.' },
        { icon: '🎋', title: 'Bamboo-Mud Walls', fact: 'Natural mud-straw plaster regulates indoor temperatures naturally in all seasons.' }
      ],
      handsOnExperiment: {
        title: 'Mini Water Turbine Simulation',
        materials: ['A plastic pinwheel or toy propeller', 'A stream of tap water'],
        instructions: 'Hold the pinwheel blades under running tap water. Observe how the kinetic energy of moving water spins the wheel — the exact same physics used in hydroelectric dams!'
      },
      journalBadgeQuestion: 'Generating electricity directly from sunlight using silicon solar cells is called ____________ energy.'
    },
    discoveryBadge: {
      id: 'sustainable-eco-badge',
      name: 'Ecological Engineering',
      emoji: '🌾☀️',
      properties: ['Hydroelectric Potential Physics', 'Decentralized Solar Photovoltaics', 'Bio-Climatic Mud Architecture'],
      uses: ['Clean energy grid design', 'Eco-village community planning', 'River basin conservation'],
      scienceWord: 'Sustainable Ecology',
    },
  },
  {
    id: 'shelter-ch5',
    chapterNumber: 5,
    cbseChapterRef: 'NCERT / CBSE EVS Chapter 14',
    title: 'When the Earth Shook! (Seismic Waves & Earthquake Safety)',
    subtitle: 'Bhuj Gujarat 2001, Seismology & Earthquake-Resistant Bhunga Homes',
    icon: '🏚️',
    themeColor: 'from-rose-500 to-amber-600',
    concepts: ['Bhuj Earthquake 2001', 'Tectonic plate friction', 'Seismograph Richter Scale', 'Kutch Bhunga circular homes'],
    scientificPrinciple:
      'Earthquakes occur when tectonic plates grinding past each other suddenly snap and release stored elastic energy as seismic shockwaves. Traditional circular mud homes in Kutch (Bhungas) withstood the massive 2001 Gujarat earthquake because circular walls distribute seismic lateral forces evenly without stress points.',
    realWorldWonder:
      'During the devastating 7.7 magnitude Bhuj earthquake on January 26, 2001, many modern concrete square buildings collapsed, but traditional circular mud-and-thatch Bhunga huts in the desert remained standing unharmed!',
    sentenceForSpeechCoach:
      'Circular Bhunga homes in Kutch survive earthquakes because round walls distribute seismic shaking evenly.',
    speechAudioPrompt: 'Read the earthquake-resistant architecture fact aloud!',
    chapterIntro: {
      hookAndBigQuestion: {
        scene: 'On the morning of Republic Day 2001 in Bhuj, Gujarat, the ground violently shook in a 7.7 magnitude earthquake.',
        bigQuestion: 'Why did ancient circular mud huts (Bhungas) survive the shaking while modern square concrete buildings collapsed?'
      },
      coreKnowledge: [
        {
          step: 1,
          concept: 'Tectonic Plate Friction & Seismic Waves',
          pipTeaching: 'The crust of Earth is made of giant moving puzzle pieces called Tectonic Plates! When two plates grind against each other, friction locks them until they suddenly snap! The stored energy radiates outwards in violent ripples called Seismic Shockwaves!'
        },
        {
          step: 2,
          concept: 'The Physics of Circular Bhunga Architecture',
          pipTeaching: 'Square buildings have sharp 90-degree corners where earthquake stresses concentrate and crack. Traditional Kutch Bhungas are built completely circular with flexible bamboo and clay plaster, allowing shockwaves to flow smoothly around the structure!'
        }
      ],
      learningRoadmap: [
        'Understand tectonic plate boundaries and seismic wave propagation.',
        'Learn the Golden Rule of Earthquake Safety: Drop, Cover, and Hold On!',
        'Discover circular architecture physics used in traditional Bhungas and modern skyscrapers.'
      ],
      pipThinkFastChallenge: {
        question: 'If an earthquake strikes while you are indoors in a classroom or home, what is the safest immediate action?',
        options: [
          { text: 'DROP to your knees, take COVER under a sturdy desk, and HOLD ON firmly until shaking stops', isCorrect: true },
          { text: 'Rush into an elevator and push all buttons', isCorrect: false }
        ],
        explanation: 'Drop, Cover, and Hold On protects your head and spine from falling ceiling debris during tremors!'
      }
    },
    fieldJournal: {
      journalTitle: 'Explorer Log: Seismology & Earthquake-Resistant Design',
      missionBrief: 'Analyze tectonic plate motion, emergency safety drills, and seismic structural mechanics.',
      factLog: [
        { icon: '🌍', title: 'Tectonic Plates', fact: 'The Indian tectonic plate collides with the Eurasian plate at ~5 cm per year, pushing the Himalayas higher!' },
        { icon: '📉', title: 'Seismograph', fact: 'Seismometers record P (primary compression) and S (secondary shear) shockwaves.' },
        { icon: '🛖', title: 'Circular Bhunga', fact: 'Cylindrical walls distribute earthquake lateral forces equally across all points.' }
      ],
      handsOnExperiment: {
        title: 'Square vs. Circle Structural Strength Test',
        materials: ['4 strips of cardboard arranged as a square', '1 strip taped into a cylinder', 'A light book for weight'],
        instructions: 'Push side-to-side on the cardboard square (it collapses easily). Then push on the cardboard cylinder. Feel how circular geometry resists side shaking without collapsing!'
      },
      journalBadgeQuestion: 'The three lifesaving safety steps to take during an earthquake are: Drop, ____________, and Hold On.'
    },
    discoveryBadge: {
      id: 'seismic-architecture-badge',
      name: 'Seismic Structural Safety',
      emoji: '🏚️🛖',
      properties: ['Circular Lateral Stress Distribution', 'Tectonic Shockwave Physics', 'Emergency Drop-Cover-Hold Protocol'],
      uses: ['Earthquake-resistant civil engineering', 'Disaster emergency management', 'Vernacular indigenous architecture'],
      scienceWord: 'Seismic Resilience',
    },
  },
];
