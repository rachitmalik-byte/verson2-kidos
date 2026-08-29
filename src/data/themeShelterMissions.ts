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
      'On May 23, 1984, Bachendri Pal became the first Indian woman to reach the 8,848-meter summit of Sagarmatha (Mount Everest)! She planted the Indian tricolor flag after fighting fierce blizzards!',
    sentenceForSpeechCoach:
      'Mountaineers use steel crampons on icy glaciers and carry oxygen tanks because air is thin at high altitudes.',
    speechAudioPrompt: 'Speak into your microphone to record the mountaineering discovery!',
    discoveryBadge: {
      id: 'mountaineer-badge',
      name: 'Everest Alpine Explorer',
      emoji: '🧗🏔️',
      properties: ['High-Altitude Acclimatization', 'Atmospheric Pressure Drop', 'Ice Traction Crampons'],
      uses: ['Himalayan expeditions', 'High-altitude rescue', 'Glacier exploration'],
      scienceWord: 'Atmospheric Pressure & Acclimatization',
    },
  },
  {
    id: 'shelter-ch3',
    chapterNumber: 3,
    cbseChapterRef: 'NCERT / CBSE EVS Chapter 11',
    title: 'Sunita in Space (Zero-Gravity Habitats)',
    subtitle: 'Sunita Williams, ISS Living, Floating Water & Orbit',
    icon: '🚀',
    themeColor: 'from-indigo-500 to-purple-700',
    concepts: ['Zero Gravity (Microgravity)', 'Floating Water Blobs', 'Tethered Sleeping Bag', 'Earth from Orbit'],
    scientificPrinciple:
      'In space orbit aboard the International Space Station, gravity seems absent because the spacecraft is in continuous freefall around Earth. Water does not flow down into a glass; it forms floating spheres due to surface tension!',
    realWorldWonder:
      'Astronaut Sunita Williams spent over 6 months in space! When washing hands, astronauts catch floating water bubbles with paper towels, and their hair always stands straight up in zero gravity!',
    sentenceForSpeechCoach:
      'In zero gravity aboard the space station, water forms floating round balls and astronauts must strap in to sleep.',
    speechAudioPrompt: 'Read the microgravity physics discovery into your microphone!',
    discoveryBadge: {
      id: 'space-habitat-badge',
      name: 'Zero-Gravity Space Station',
      emoji: '🚀🌍',
      properties: ['Microgravity Fluid Spheres', 'Tethered Orbital Sleep', 'Atmospheric Orbital View'],
      uses: ['Space station design', 'Satellite engineering', 'Space exploration medicine'],
      scienceWord: 'Microgravity & Surface Tension',
    },
  },
  {
    id: 'shelter-ch4',
    chapterNumber: 4,
    cbseChapterRef: 'NCERT / CBSE EVS Chapter 10',
    title: 'Walls Tell Stories (Golconda Fort Engineering)',
    subtitle: 'Bastions, Elephant Gates, Echo Domes & Stepwell Pulleys',
    icon: '🏰',
    themeColor: 'from-amber-500 to-yellow-700',
    concepts: ['Stone Bastions (Burj)', 'Iron Spiked Gates', 'Acoustic Echo Whispers', 'Persian Water Wheel (Rahat)'],
    scientificPrinciple:
      'Medieval Indian architects used curved stone bastions (burj) protruding outwards to give guards a 360° panoramic view of approaching attackers. Deep stepwells (baolis) used tooth-wheel gear pulleys (Rahat) powered by bullocks to lift water 100 feet upwards to rooftop gardens!',
    realWorldWonder:
      'If you whisper at the Fateh Darwaza gate of Golconda Fort in Hyderabad, the sound acoustic echoes and can be heard clearly at the King’s palace at the very top of the hill over 1 kilometer away!',
    sentenceForSpeechCoach:
      'Golconda Fort used curved stone bastions for defense and gear-driven water wheels to lift water to rooftop gardens.',
    speechAudioPrompt: 'Read the ancient architectural engineering fact aloud!',
    discoveryBadge: {
      id: 'fort-engineering-badge',
      name: 'Ancient Fort & Water Engineering',
      emoji: '🏰💧',
      properties: ['Acoustic Echo Chamber', '360° Defensive Bastions', 'Gear-Driven Water Bucket Lift'],
      uses: ['Heritage architecture', 'Gravity-fed hydraulic systems', 'Acoustic design'],
      scienceWord: 'Acoustic & Hydraulic Engineering',
    },
  },
  {
    id: 'shelter-ch5',
    chapterNumber: 5,
    cbseChapterRef: 'NCERT / CBSE EVS Chapter 12',
    title: 'What If It Finishes...? (Petroleum & Clean Energy)',
    subtitle: 'Black Gold Oil Refineries, Fossil Fuels & Solar Future',
    icon: '🛢️',
    themeColor: 'from-slate-700 to-amber-600',
    concepts: ['Crude oil (Petroleum)', 'Fractional Distillation', 'LPG, Petrol, Diesel & Bitumen', 'Solar & Wind Clean Energy'],
    scientificPrinciple:
      'Petroleum formed millions of years ago from decomposed microscopic sea plants and animals buried under layers of sand and rock under intense heat and pressure. In an oil refinery, crude oil is boiled and separated into LPG gas, Petrol, Kerosene, Diesel, and Bitumen (used for tarring roads).',
    realWorldWonder:
      'Did you know that petroleum is called "Black Gold"? It is not made in factories; it takes millions of years for Earth to make it! That is why we must switch off car engines at red lights and use clean solar panels!',
    sentenceForSpeechCoach:
      'Petroleum formed millions of years ago deep inside Earth and is refined into petrol, diesel, and cooking gas.',
    speechAudioPrompt: 'Read the fossil fuel and energy conservation fact into your mic!',
    discoveryBadge: {
      id: 'petroleum-energy-badge',
      name: 'Earth Energy & Petroleum Refiner',
      emoji: '🛢️☀️',
      properties: ['Fossil Fuel Formation', 'Fractional Boiling Separation', 'Renewable Solar Transition'],
      uses: ['Automotive transport', 'Cooking LPG', 'Clean solar power grids'],
      scienceWord: 'Fractional Distillation & Energy Conservation',
    },
  },
];
