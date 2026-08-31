/**
 * Comprehensive Declarative Lesson Configuration Data Schema
 * PolyQuest CBSE Class 5 Science • All 13 Missions Fully Populated
 */

import type { LessonMissionConfig } from '@/types/lessonEngine';

// Real Studio Macro Educational Photography
import raincoatWaterproofImg from '@/assets/images/raincoat/polyester_raincoat_waterproof.jpg';
import cottonBollSpecimenImg from '@/assets/images/specimens/raw_cotton_boll.jpg';
import cottonSwatchCleanImg from '@/assets/images/experiments/cotton_swatch_clean.jpg';
import cottonSwatchWrinkledImg from '@/assets/images/experiments/cotton_swatch_wrinkled.jpg';
import cottonBurningAshImg from '@/assets/images/experiments/cotton_burning_ash.jpg';
import polyesterSwatchCleanImg from '@/assets/images/experiments/polyester_swatch_clean.jpg';
import polyesterFabricRollImg from '@/assets/images/specimens/polyester_fabric_roll.jpg';
import polyesterMeltingBeadImg from '@/assets/images/experiments/polyester_melting_bead.jpg';
import nylonRopeHeavyImg from '@/assets/images/experiments/nylon_rope_heavy_weight.jpg';
import nylonThreadSpoolImg from '@/assets/images/specimens/nylon_thread_spool.jpg';
import sheepWoolFleeceImg from '@/assets/images/specimens/sheep_wool_fleece.jpg';
import silkwormSilkCocoonImg from '@/assets/images/specimens/silkworm_silk_cocoon.jpg';
import syntheticAcrylicYarnImg from '@/assets/images/specimens/synthetic_acrylic_yarn.jpg';
import naturalWoodTimberImg from '@/assets/images/specimens/natural_wood_timber.jpg';
import copperWireMacroImg from '@/assets/images/wire/copper_wire_macro.jpg';
import pvcInsulatedCableImg from '@/assets/images/wire/pvc_insulated_cable.jpg';
import steelKeyMacroImg from '@/assets/images/wire/steel_key_macro.jpg';
import lightbulbGlowingBrightImg from '@/assets/images/wire/lightbulb_glowing_bright.jpg';
import boilingTeaKettleSteamImg from '@/assets/images/experiments/boiling_tea_kettle_steam.jpg';
import bakelitePanHandleImg from '@/assets/images/experiments/bakelite_pan_handle.jpg';
import castIronScorchingHandleImg from '@/assets/images/experiments/cast_iron_scorching_handle.jpg';
import petWaterBottleMoldingImg from '@/assets/images/experiments/pet_water_bottle_molding.jpg';
import plasticDecay100YrsImg from '@/assets/images/decay/plastic_100yrs.jpg';
import woodDecay100YrsImg from '@/assets/images/decay/wood_100yrs.jpg';
import vulcanizedCarTireTreadImg from '@/assets/images/experiments/vulcanized_car_tire_tread.jpg';
import epoxyResinAdhesiveGlueImg from '@/assets/images/experiments/epoxy_resin_adhesive_glue.jpg';
import parachuteCanopyJumpImg from '@/assets/images/experiments/parachute_canopy_jump.jpg';

// Newly Generated SEM Micrographs & Specimens
import cottonMicrograph100xImg from '@/assets/images/microscope/cotton_micrograph_100x.jpg';
import nylonMicrograph100xImg from '@/assets/images/microscope/nylon_micrograph_100x.jpg';
import woolMicrograph100xImg from '@/assets/images/microscope/wool_micrograph_100x.jpg';
import silkMicrograph100xImg from '@/assets/images/microscope/silk_micrograph_100x.jpg';
import steelWireSpecimenImg from '@/assets/images/experiments/steel_wire_specimen.jpg';
import summerComfortEvaporationImg from '@/assets/images/experiments/summer_comfort_evaporation_test.jpg';

export const lessonConfigs: Record<number, LessonMissionConfig> = {
  // Mission 1: The Raincoat Mystery
  1: {
    id: 'mission-01',
    number: 1,
    title: 'The Raincoat Mystery',
    subtitle: 'Why are modern raincoats made from synthetic polyester instead of cotton?',
    icon: '🧥',
    themeColor: 'sky',
    bgmTrack: 'rainy-storm',
    concepts: ['Hydrophobic', 'Waterproof', 'Cellulose', 'Polyester'],
    steps: [
      {
        id: 'm1-s1',
        type: 'water_absorption_lab',
        title: 'Water Droplet Spray Test',
        subtitle: 'Spray water mist on both swatches to observe absorption vs hydrophobic beading.',
        pipPrompt: 'Spray both swatches with water mist! Notice how water beads on polyester while soaking into cotton.',
        pipMood: 'curious',
        conceptBadge: 'Water Repellency',
        learningGoal: 'Discover that synthetic polymers form a non-porous hydrophobic barrier.',
        specimens: [
          {
            id: 'cotton-swatch',
            name: 'Natural Cotton Swatch',
            materialType: 'cotton',
            category: 'Natural',
            dryImage: cottonSwatchCleanImg,
            wetImage: cottonSwatchCleanImg,
            isHydrophobic: false,
            absorptionRateSec: 0.5,
            description: 'Woven organic plant cellulose fibers harvested from the cotton boll.',
            microscopicNote: 'Hollow, porous organic cellulose capillary tubes rapidly absorb liquid water.',
          },
          {
            id: 'polyester-swatch',
            name: 'Synthetic Polyester Swatch',
            materialType: 'polyester',
            category: 'Synthetic',
            dryImage: polyesterSwatchCleanImg,
            wetImage: raincoatWaterproofImg,
            isHydrophobic: true,
            absorptionRateSec: 999,
            description: 'Synthetic polymer fibers engineered from tightly woven polyester filaments.',
            microscopicNote: 'Smooth, non-porous petrochemical polymer chains create high surface tension that repels water droplets.',
          },
        ],
      },
      {
        id: 'm1-s2',
        type: 'microscopic_zoom_viewer',
        title: 'Microscope: Cotton vs Polyester',
        subtitle: 'Inspect the fiber matrix under 1x, 10x, and 100x optical magnification.',
        pipPrompt: 'Look through the electron microscope! Notice the hollow porous cotton tubes vs solid smooth polyester filaments.',
        pipMood: 'explaining',
        conceptBadge: 'SEM Micrograph',
        specimenName: 'Natural Cotton vs Synthetic Polymer',
        specimenCategory: 'Natural',
        tiers: [
          {
            magnification: '1x',
            label: 'Cotton Plant Boll Specimen (Wide Shot)',
            image: cottonBollSpecimenImg,
            scaleBarText: '20 mm',
            structuralFeatures: ['Fluffy seed pod cellulose', 'Spun staple fibers'],
            scientificExplanation: 'At macroscopic scale, natural cotton fibers form fluffy seed bolls on the Gossypium plant.',
          },
          {
            magnification: '10x',
            label: 'Woven Fabric Weave (Macro Shot)',
            image: cottonSwatchCleanImg,
            scaleBarText: '2 mm',
            structuralFeatures: ['Interlaced yarn strands', 'Microscopic air spaces between threads'],
            scientificExplanation: 'Under 10x magnification, woven cotton yarns contain microscopic gaps where water easily wicks through.',
          },
          {
            magnification: '100x',
            label: '100x SEM Micrograph: Hollow Pores',
            image: cottonMicrograph100xImg,
            scaleBarText: '100 µm',
            structuralFeatures: ['Twisted hollow lumen tubes', 'Porous cellulose microfibril walls'],
            scientificExplanation: 'At 100x SEM magnification, cotton fibers are hollow twisted ribbons that absorb water by capillary suction.',
          },
        ],
      },
      {
        id: 'm1-s3',
        type: 'mcq_assessment',
        title: 'Raincoat Engineering Question',
        subtitle: 'Apply your experimental observations to explain why raincoats are made from synthetic polyester.',
        pipPrompt: 'Why do gear designers choose synthetic polyester for raincoats instead of natural cotton?',
        pipMood: 'thinking',
        conceptBadge: 'Scientific Reasoning',
        question: 'Why do outdoor gear manufacturers choose synthetic polyester for raincoats instead of natural cotton?',
        options: [
          {
            id: 'opt-1',
            text: 'Polyester fibers are non-porous and hydrophobic, shedding rain without becoming heavy or waterlogged.',
            isCorrect: true,
            feedback: 'Spot on! Hydrophobic synthetic polymers keep the wearer completely dry.',
          },
          {
            id: 'opt-2',
            text: 'Cotton dissolves completely into a liquid when exposed to cold rainwater.',
            isCorrect: false,
            feedback: 'Cotton does not dissolve; it absorbs water and becomes heavy and soggy.',
          },
        ],
        explanation: 'Polyester fibers are smooth, hydrophobic polymers that do not absorb water, making raincoats lightweight and waterproof.',
      },
      {
        id: 'm1-s4',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Hydrophobic',
        subtitle: 'Read the scientific sentence aloud into your microphone.',
        pipPrompt: 'Read this scientific sentence clearly to earn your Science Stars!',
        pipMood: 'encouraging',
        targetSentence: 'Polyester is a hydrophobic synthetic material that repels water droplets on raincoats.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm1-s5',
        type: 'concept_summary',
        title: 'Mission 1 Completed! 🏆',
        subtitle: 'You discovered how material properties dictate real-world engineering uses.',
        pipPrompt: 'Fantastic scientific investigation! You have mastered the Raincoat Mystery!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '🧱', title: 'Material Property Law', description: 'Structure ➔ Property ➔ Use' },
          { icon: '💧', title: 'Hydrophobic Beading', description: 'Polyester sheds water with zero absorption.' },
        ],
      },
    ],
  },

  // Mission 2: The Sorting Desk
  2: {
    id: 'mission-02',
    number: 2,
    title: 'The Sorting Desk',
    subtitle: 'Classify everyday materials into Natural (plants/animals/ground) vs Synthetic (man-made polymers).',
    icon: '📦',
    themeColor: 'sage',
    bgmTrack: 'playful-lab',
    concepts: ['Natural', 'Synthetic', 'Classification', 'Biopolymers'],
    steps: [
      {
        id: 'm2-s1',
        type: 'sorting_tray',
        title: 'Classify Natural vs Synthetic Specimens',
        subtitle: 'Sort the mixed specimens into their correct classification tray.',
        pipPrompt: 'Help me sort these materials! Ask: does it come directly from nature, or was it synthesized in a chemical factory?',
        pipMood: 'curious',
        conceptBadge: 'Classification',
        trays: [
          { id: 'natural', title: '🌿 Natural Materials', icon: '🌿', themeColor: 'sage', allowedCategories: ['natural'], description: 'Harvested from plants, animals, minerals, or Earth.' },
          { id: 'synthetic', title: '🏭 Synthetic Materials', icon: '🏭', themeColor: 'sky', allowedCategories: ['synthetic'], description: 'Synthesized by chemical engineers from petroleum hydrocarbons.' },
        ],
        items: [
          { id: 'item-cotton', name: 'Cotton Plant Boll', icon: '🌱', category: 'natural', hint: 'Grows on Gossypium plant bushes.', originDetails: 'Plant cellulose' },
          { id: 'item-wool', name: 'Sheep Fleece Wool', icon: '🐑', category: 'natural', hint: 'Sheared from animal fur.', originDetails: 'Animal keratin protein' },
          { id: 'item-silk', name: 'Silkworm Cocoon', icon: '🐛', category: 'natural', hint: 'Spun by silkworm caterpillars.', originDetails: 'Animal fibroin protein' },
          { id: 'item-timber', name: 'Natural Wood Timber', icon: '🪵', category: 'natural', hint: 'Harvested from tree trunks.', originDetails: 'Plant lignin & cellulose' },
          { id: 'item-nylon', name: 'Nylon Polymer Thread', icon: '🧵', category: 'synthetic', hint: 'Synthesized in petrochemical labs.', originDetails: 'Polyamide polymer' },
          { id: 'item-plastic', name: 'PET Plastic Bottle', icon: '🧴', category: 'synthetic', hint: 'Molded from thermoplastic pellets.', originDetails: 'Polyethylene terephthalate' },
          { id: 'item-acrylic', name: 'Acrylic Winter Yarn', icon: '🧶', category: 'synthetic', hint: 'Artificial wool synthesized in factories.', originDetails: 'Polyacrylonitrile' },
          { id: 'item-polyester', name: 'Polyester Sports Shirt', icon: '👕', category: 'synthetic', hint: 'Synthetic polymer fibers made from petroleum.', originDetails: 'Ester polymer' },
        ],
      },
      {
        id: 'm2-s2',
        type: 'mcq_assessment',
        title: 'Definition Check: Synthetic Materials',
        subtitle: 'Verify your understanding of scientific classification.',
        pipPrompt: 'What is the core scientific definition of a synthetic material?',
        pipMood: 'thinking',
        conceptBadge: 'Concept Mastery',
        question: 'What defines a SYNTHETIC material in science?',
        options: [
          { id: 'opt-1', text: 'A material created by people in laboratories or factories using chemical reactions on raw substances.', isCorrect: true, feedback: 'Exactly! Synthetic materials are synthesized through chemical engineering.' },
          { id: 'opt-2', text: 'Any material that grows in green soil.', isCorrect: false, feedback: 'Plants growing in soil are natural.' },
        ],
        explanation: 'Synthetic materials are artificial compounds produced through chemical processes, usually derived from petroleum.',
      },
      {
        id: 'm2-s3',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Natural vs Synthetic',
        subtitle: 'Read the definition sentence clearly.',
        pipPrompt: 'Read this science sentence aloud with confidence!',
        pipMood: 'encouraging',
        targetSentence: 'Natural materials come from plants and animals, while synthetic materials are made in factories.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm2-s4',
        type: 'concept_summary',
        title: 'Mission 2 Completed! ⭐',
        subtitle: 'You are now an expert at classifying natural vs synthetic materials.',
        pipPrompt: 'Brilliant work! You know the exact origins of all everyday substances!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '🌿', title: 'Natural Origin', description: 'Cotton, Wool, Silk, Timber' },
          { icon: '🏭', title: 'Synthetic Origin', description: 'Nylon, Polyester, Plastic, Acrylic' },
        ],
      },
    ],
  },

  // Mission 3: The Super-Strong Thread (Cotton, Wool, Silk, Nylon, Braided Steel)
  3: {
    id: 'mission-03',
    number: 3,
    title: 'The Super-Strong Thread',
    subtitle: 'Test the tensile breaking strength of cotton vs wool vs silk vs synthetic nylon vs braided steel.',
    icon: '🪢',
    themeColor: 'amber',
    bgmTrack: 'high-energy-sprint',
    concepts: ['Tensile Strength', 'Nylon', 'Polyamide Chains', 'Steel Cable'],
    steps: [
      {
        id: 'm3-s1',
        type: 'tensile_strength_rig',
        title: 'Tensile Strength Testing Rig',
        subtitle: 'Add weights to test breaking points of natural fibers vs synthetic nylon vs braided steel wire.',
        pipPrompt: 'Load weights onto each thread! Notice how much weight synthetic nylon and steel cable can hold before snapping!',
        pipMood: 'curious',
        conceptBadge: 'Tensile Strength',
        weightIncrementGrams: 50,
        maxWeightGrams: 1500,
        scientificTakeaway: 'Nylon polymer chains and metallic steel bonds withstand immense pulling forces.',
        specimens: [
          {
            id: 'cotton-thread',
            name: 'Natural Cotton Thread',
            material: 'Cotton Plant Cellulose',
            icon: '🧵',
            breakingWeightGrams: 150,
            elasticDeformationMm: 4,
            snapSound: 'snap-light',
            description: 'Short twisted plant fibers with moderate breaking strength.',
            realWorldUse: 'Clothing, sewing thread, bandages.',
          },
          {
            id: 'wool-thread',
            name: 'Natural Wool Thread',
            material: 'Animal Keratin Protein',
            icon: '🧶',
            breakingWeightGrams: 200,
            elasticDeformationMm: 14,
            snapSound: 'snap-light',
            description: 'Crimped natural protein fibers with high stretch but lower breaking strength.',
            realWorldUse: 'Warm sweaters, carpets, blankets.',
          },
          {
            id: 'silk-thread',
            name: 'Natural Silk Filament',
            material: 'Silkworm Fibroin Protein',
            icon: '🐛',
            breakingWeightGrams: 300,
            elasticDeformationMm: 8,
            snapSound: 'snap-light',
            description: 'Strongest natural fiber spun by silkworms with smooth continuous filaments.',
            realWorldUse: 'Luxury fabrics, surgical sutures.',
          },
          {
            id: 'nylon-cord',
            name: 'Synthetic Nylon Cord',
            material: 'Polyamide Synthetic Polymer',
            icon: '🪢',
            breakingWeightGrams: 750,
            elasticDeformationMm: 28,
            snapSound: 'snap-heavy',
            description: 'Continuous synthetic polymer chains aligned under high tension.',
            realWorldUse: 'Parachute cords, rock climbing ropes, fishing lines.',
          },
          {
            id: 'steel-wire',
            name: 'Braided Stainless Steel Wire',
            material: 'Refined Metallic Iron Alloy',
            icon: '⚙️',
            breakingWeightGrams: 1200,
            elasticDeformationMm: 5,
            snapSound: 'snap-metallic',
            description: 'Multi-strand braided stainless steel wire rope with immense tensile resilience.',
            realWorldUse: 'Suspension bridge cables, aircraft controls, elevator hoists.',
          },
        ],
      },
      {
        id: 'm3-s2',
        type: 'microscopic_zoom_viewer',
        title: 'Microscope: Nylon Filaments vs Silk',
        subtitle: 'Compare synthetic nylon filaments vs silkworm silk at 1x, 10x, and 100x magnification.',
        pipPrompt: 'Inspect nylon polymer filaments under the electron microscope! Notice the perfectly smooth cylindrical diameter.',
        pipMood: 'explaining',
        conceptBadge: 'SEM Micrograph',
        specimenName: 'Synthetic Nylon vs Silkworm Silk',
        specimenCategory: 'Synthetic',
        tiers: [
          {
            magnification: '1x',
            label: 'Nylon Thread Spool (Wide Shot)',
            image: nylonThreadSpoolImg,
            scaleBarText: '50 mm',
            structuralFeatures: ['Continuous glossy synthetic cord', 'High industrial uniformity'],
            scientificExplanation: 'Nylon is extruded through spinneret nozzles into continuous polymer strands.',
          },
          {
            magnification: '10x',
            label: 'Braided Nylon Rope (Macro Shot)',
            image: nylonRopeHeavyImg,
            scaleBarText: '5 mm',
            structuralFeatures: ['Interwoven high-tensile core', 'Abrasion-resistant braided jacket'],
            scientificExplanation: 'Under 10x magnification, multiple nylon filaments are tightly braided to distribute heavy pulling loads.',
          },
          {
            magnification: '100x',
            label: '100x SEM: Solid Cylindrical Polymers',
            image: nylonMicrograph100xImg,
            scaleBarText: '100 µm',
            structuralFeatures: ['Zero microscopic pores', 'Continuous solid polyamide polymer chains'],
            scientificExplanation: 'At 100x SEM magnification, nylon filaments have no hollow gaps, giving them extreme tensile breaking strength.',
          },
        ],
      },
      {
        id: 'm3-s3',
        type: 'mcq_assessment',
        title: 'Tensile Strength Engineering Choice',
        subtitle: 'Why is nylon chosen for critical safety equipment?',
        pipPrompt: 'Why do mountaineers and paratroopers trust nylon for life-saving ropes?',
        pipMood: 'thinking',
        conceptBadge: 'Tensile Physics',
        question: 'Why is NYLON chosen over cotton for rock climbing ropes and parachutes?',
        options: [
          { id: 'opt-1', text: 'Nylon has extremely high tensile strength and elasticity, holding heavy body weight without snapping.', isCorrect: true, feedback: 'Correct! Nylon holds more than triple the load of equivalent natural fibers.' },
          { id: 'opt-2', text: 'Nylon is made of pure solid diamond.', isCorrect: false, feedback: 'Nylon is a synthetic polyamide polymer.' },
        ],
        explanation: 'Continuous synthetic polymer chains give nylon superior tensile strength and shock absorption.',
      },
      {
        id: 'm3-s4',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Nylon Tensile Strength',
        subtitle: 'Read the science sentence aloud.',
        pipPrompt: 'Speak clearly into the microphone to earn your stars!',
        pipMood: 'encouraging',
        targetSentence: 'Nylon is a super strong synthetic polymer used for mountaineering ropes and parachutes.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm3-s5',
        type: 'concept_summary',
        title: 'Mission 3 Completed! 🪢',
        subtitle: 'You proved that synthetic nylon and metallic steel provide superior tensile strength.',
        pipPrompt: 'Outstanding! You understand why materials are engineered for strength!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '🪢', title: 'Tensile Strength', description: 'The maximum pulling force a material can withstand before breaking.' },
          { icon: '🔬', title: 'Nylon & Steel Superpowers', description: 'Engineered for extreme loads and safety equipment.' },
        ],
      },
    ],
  },

  // Mission 4: The Fabric Feel & Summer Comfort Lab
  4: {
    id: 'mission-04',
    number: 4,
    title: 'Fabric Feel & Summer Comfort',
    subtitle: 'Discover why porous cotton keeps us cool in hot summers while synthetic polyester traps sweat.',
    icon: '👕',
    themeColor: 'coral',
    bgmTrack: 'chill-study',
    concepts: ['Evaporation', 'Breathability', 'Thermal Comfort', 'Pores'],
    steps: [
      {
        id: 'm4-s1',
        type: 'mcq_assessment',
        title: 'Summer Weather Fabric Challenge',
        subtitle: 'Inspect the laboratory breathability test comparing cotton vs polyester under 32°C heat.',
        pipPrompt: 'Look at the laboratory thermal breathability test! Why is 100% cotton cooler in hot weather?',
        pipMood: 'curious',
        conceptBadge: 'Thermal Comfort',
        illustrationImage: summerComfortEvaporationImg,
        question: 'In the hot 32°C laboratory test, why did the cotton mannequin stay cooler at 26.5°C while polyester reached 31.8°C?',
        options: [
          { id: 'opt-1', text: 'Cotton absorbs perspiration through microscopic pores and allows it to evaporate, taking body heat away.', isCorrect: true, feedback: 'Brilliant! Evaporation of absorbed sweat creates a powerful natural cooling effect.' },
          { id: 'opt-2', text: 'Polyester creates cold ice cubes inside the shirt.', isCorrect: false, feedback: 'Polyester traps body heat and sweat, feeling clammy.' },
        ],
        explanation: 'Porous cotton absorbs sweat and enables cooling evaporation, whereas non-porous polyester traps moisture against the skin.',
      },
      {
        id: 'm4-s2',
        type: 'microscopic_zoom_viewer',
        title: 'Microscope: Wool & Silk Fibers',
        subtitle: 'Inspect natural wool keratin scales vs smooth silkworm silk at 1x, 10x, and 100x magnification.',
        pipPrompt: 'Look at wool fibers under the microscope! Notice the overlapping scales that trap warm air in winter.',
        pipMood: 'explaining',
        conceptBadge: 'SEM Micrograph',
        specimenName: 'Natural Sheep Wool Fleece',
        specimenCategory: 'Natural',
        tiers: [
          {
            magnification: '1x',
            label: 'Wool Fleece Specimen (Wide Shot)',
            image: sheepWoolFleeceImg,
            scaleBarText: '25 mm',
            structuralFeatures: ['Fluffy crimped animal fleece', 'Natural elasticity'],
            scientificExplanation: 'Natural wool harvested from sheep has crimp and air pockets.',
          },
          {
            magnification: '10x',
            label: 'Knitted Wool Yarn (Macro Shot)',
            image: syntheticAcrylicYarnImg,
            scaleBarText: '2 mm',
            structuralFeatures: ['Interlaced curly hairs', 'Trapped dead air volume'],
            scientificExplanation: 'Under 10x zoom, curly wool fibers trap still air, acting as a thermal insulator.',
          },
          {
            magnification: '100x',
            label: '100x SEM: Keratin Cuticle Scales',
            image: woolMicrograph100xImg,
            scaleBarText: '200 µm',
            structuralFeatures: ['Overlapping keratin scales', 'Thermal insulating boundary'],
            scientificExplanation: 'At 100x SEM magnification, overlapping shingle-like scales trap heat, keeping us warm in winter.',
          },
        ],
      },
      {
        id: 'm4-s3',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Summer Cotton',
        subtitle: 'Read the science sentence aloud.',
        pipPrompt: 'Read this summer science fact clearly into the microphone!',
        pipMood: 'encouraging',
        targetSentence: 'Cotton clothes are breathable and keep us cool in summer through sweat evaporation.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm4-s4',
        type: 'concept_summary',
        title: 'Mission 4 Completed! ☀️',
        subtitle: 'You mastered how fiber porosity controls summer breathability and winter insulation.',
        pipPrompt: 'Great job! Now you know what to wear in summer and winter!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '☀️', title: 'Summer Comfort', description: 'Cotton absorbs sweat and evaporates heat.' },
          { icon: '❄️', title: 'Winter Insulation', description: 'Wool traps pockets of still warm air.' },
        ],
      },
    ],
  },

  // Mission 5: Fire Safety & Burn Test
  5: {
    id: 'mission-05',
    number: 5,
    title: 'Fire Safety & The Burn Test',
    subtitle: 'Observe how natural cotton burns to harmless powdery ash while synthetic polyester melts into a hot sticky bead.',
    icon: '🔥',
    themeColor: 'coral',
    bgmTrack: 'playful-lab',
    concepts: ['Combustion', 'Melting Point', 'Thermoplastics', 'Safety'],
    steps: [
      {
        id: 'm5-s1',
        type: 'mcq_assessment',
        title: 'The Laboratory Burn Test',
        subtitle: 'Inspect how cotton and polyester react differently to flame exposure in a fume hood.',
        pipPrompt: 'Look at the flame reaction! Why is it dangerous to wear synthetic clothes near kitchen stoves or fireworks?',
        pipMood: 'curious',
        conceptBadge: 'Thermal Reaction',
        illustrationImage: polyesterMeltingBeadImg,
        question: 'What happens when synthetic polyester touches a flame, compared to natural cotton?',
        options: [
          { id: 'opt-1', text: 'Polyester melts rapidly into a hot, sticky liquid bead that can cause severe skin burns, while cotton burns to powdery ash.', isCorrect: true, feedback: 'Spot on! Petrochemical synthetics melt at high heat, making them dangerous near open flames.' },
          { id: 'opt-2', text: 'Polyester turns into delicious cotton candy.', isCorrect: false, feedback: 'Synthetics produce toxic fumes and hot melting beads.' },
        ],
        explanation: 'Thermoplastic polymers melt into hot liquid beads under flame, which is why laboratory and kitchen safety rules require 100% natural cotton garments.',
      },
      {
        id: 'm5-s2',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Fire Safety',
        subtitle: 'Read the safety rule clearly.',
        pipPrompt: 'Read this important safety rule aloud!',
        pipMood: 'encouraging',
        targetSentence: 'Never wear synthetic clothes near open flames because they melt and stick to skin.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm5-s3',
        type: 'concept_summary',
        title: 'Mission 5 Completed! 🛡️',
        subtitle: 'You mastered thermal fire reactions and laboratory safety apparel rules.',
        pipPrompt: 'Excellent safety science investigation! Always remember your kitchen fire rules!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '🔥', title: 'Cotton Burn Reaction', description: 'Burns to soft, powdery gray ash with paper odor.' },
          { icon: '⚠️', title: 'Synthetic Melting Hazard', description: 'Melts into a hard, hot, sticky petrochemical bead.' },
        ],
      },
    ],
  },

  // Mission 6: The Wrinkle & Care Test
  6: {
    id: 'mission-06',
    number: 6,
    title: 'The Wrinkle & Care Test',
    subtitle: 'Discover why cotton wrinkles easily after washing while polyester maintains its shape.',
    icon: '🧺',
    themeColor: 'sky',
    bgmTrack: 'chill-study',
    concepts: ['Hydrogen Bonds', 'Elastic Recovery', 'Wrinkle Resistance'],
    steps: [
      {
        id: 'm6-s1',
        type: 'mcq_assessment',
        title: 'The Crease Recovery Challenge',
        subtitle: 'Observe what happens when cotton and polyester fabrics are scrunched in a fist.',
        pipPrompt: 'Look at the fabric care test! Why does 100% cotton need ironing while polyester stays wrinkle-free?',
        pipMood: 'curious',
        conceptBadge: 'Elastic Memory',
        illustrationImage: cottonSwatchWrinkledImg,
        question: 'Why do cotton shirts get heavily wrinkled after washing, while polyester shirts dry smooth and wrinkle-free?',
        options: [
          { id: 'opt-1', text: 'Water breaks and resets the hydrogen bonds in cotton cellulose in folded positions, while synthetic polymers have permanent elastic memory.', isCorrect: true, feedback: 'Brilliant! Hydrogen bonds in cellulose slip when wet, locking in wrinkles until heat-ironed.' },
          { id: 'opt-2', text: 'Cotton is made of microscopic origami paper.', isCorrect: false, feedback: 'Cotton contains organic cellulose biopolymers.' },
        ],
        explanation: 'Cellulose chains in cotton are held by flexible hydrogen bonds that deform when crumpled, whereas synthetic polyester chains have heat-set memory.',
      },
      {
        id: 'm6-s2',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Wrinkle Recovery',
        subtitle: 'Read the science sentence aloud.',
        pipPrompt: 'Read this science sentence clearly!',
        pipMood: 'encouraging',
        targetSentence: 'Polyester fabrics have excellent shape memory and resist wrinkling after washing.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm6-s3',
        type: 'concept_summary',
        title: 'Mission 6 Completed! ✨',
        subtitle: 'You discovered how molecular bonds explain why blended poly-cotton fabrics were invented.',
        pipPrompt: 'Great science work! Now you know why poly-cotton school uniforms are easy to iron!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '🧺', title: 'Cotton Hydrogen Bonds', description: 'Absorbs sweat well but requires ironing when creased.' },
          { icon: '👔', title: 'Poly-Cotton Blends', description: 'Combines cotton breathability with polyester wrinkle resistance.' },
        ],
      },
    ],
  },

  // Mission 7: The Plastic Molding Lab (PET Bottle Blow Molding)
  7: {
    id: 'mission-07',
    number: 7,
    title: 'The Plastic Molding Lab',
    subtitle: 'Explore how thermoplastic PET polymer pellets are heated, blown, and molded into lightweight bottles.',
    icon: '🍶',
    themeColor: 'amber',
    bgmTrack: 'playful-lab',
    concepts: ['Thermoplastics', 'PET Polymer', 'Blow Molding', 'Recycling'],
    steps: [
      {
        id: 'm7-s1',
        type: 'mcq_assessment',
        title: 'Thermoplastic Blow Molding Test',
        subtitle: 'Observe how a small PET preform is heated to 100°C and inflated with compressed air inside a metal mold.',
        pipPrompt: 'Look at the blow molding machine! Why are beverage bottles made from PET plastic instead of heavy glass?',
        pipMood: 'curious',
        conceptBadge: 'Thermoplastics',
        illustrationImage: petWaterBottleMoldingImg,
        question: 'What property makes PET (Polyethylene Terephthalate) the world standard for beverage bottles?',
        options: [
          { id: 'opt-1', text: 'It is a thermoplastic that can be repeatedly melted, molded, is 100% shatterproof, lightweight, and recyclable.', isCorrect: true, feedback: 'Correct! PET is tough, lightweight, non-reactive with food, and easily remelted.' },
          { id: 'opt-2', text: 'PET plastic is made by boiling volcanic lava.', isCorrect: false, feedback: 'PET is synthesized from petrochemical monomers.' },
        ],
        explanation: 'Thermoplastics like PET soften when heated and solidify when cooled, allowing rapid high-precision bottle molding and closed-loop recycling.',
      },
      {
        id: 'm7-s2',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Thermoplastics',
        subtitle: 'Read the science sentence aloud.',
        pipPrompt: 'Speak clearly into the microphone!',
        pipMood: 'encouraging',
        targetSentence: 'Thermoplastics can be melted and remolded into new shapes without chemical change.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm7-s3',
        type: 'concept_summary',
        title: 'Mission 7 Completed! 🍶',
        subtitle: 'You mastered thermoplastic blow-molding and bottle engineering.',
        pipPrompt: 'Fantastic! You understand the industrial polymer manufacturing pipeline!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '🍶', title: 'Thermoplastic Polymer', description: 'Softens on heating, hardens on cooling, 100% recyclable.' },
          { icon: '♻️', title: 'PET Plastic Circularity', description: 'Used bottles can be shredded and spun into fleece jackets.' },
        ],
      },
    ],
  },

  // Mission 8: Conductor & Insulator Circuit Lab
  8: {
    id: 'mission-08',
    number: 8,
    title: 'The Electric Wire Secret',
    subtitle: 'Discover why electrical cables combine conductive copper metal inside with insulating PVC plastic outside.',
    icon: '⚡',
    themeColor: 'sky',
    bgmTrack: 'high-energy-sprint',
    concepts: ['Electrical Conductor', 'PVC Insulator', 'Copper Lattice', 'Free Electrons'],
    steps: [
      {
        id: 'm8-s1',
        type: 'mcq_assessment',
        title: 'Circuit Electrical Conductivity Test',
        subtitle: 'Test what happens when different materials complete the electric circuit to light the bulb.',
        pipPrompt: 'Look at the cross-section of an electrical cable! Why are wires built with two completely different materials?',
        pipMood: 'curious',
        conceptBadge: 'Electrical Physics',
        illustrationImage: copperWireMacroImg,
        question: 'Why do electricians and engineers coat inner copper wires with an outer layer of flexible PVC plastic?',
        options: [
          { id: 'opt-1', text: 'Copper metal allows free electrons to flow easily (conductor), while outer PVC plastic blocks electrical current to prevent shocks (insulator).', isCorrect: true, feedback: 'Spot on! Conductors transmit energy while insulators provide electrical safety.' },
          { id: 'opt-2', text: 'The plastic is only added to make the wires smell nice.', isCorrect: false, feedback: 'PVC plastic provides essential high-resistance insulation.' },
        ],
        explanation: 'Engineers combine conductors (copper metal) and high-resistance polymer insulators (PVC plastic) to transmit electrical power safely.',
      },
      {
        id: 'm8-s2',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Conductor vs Insulator',
        subtitle: 'Read the electrical science sentence.',
        pipPrompt: 'Read this science sentence aloud with confidence!',
        pipMood: 'encouraging',
        targetSentence: 'Copper metal conducts electricity while plastic insulation protects us from electrical shocks.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm8-s3',
        type: 'concept_summary',
        title: 'Mission 8 Completed! ⚡',
        subtitle: 'You proved how conductors and insulators work together in modern technology.',
        pipPrompt: 'Electrifying work! You understand electrical circuits and safety engineering!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '⚡', title: 'Copper Conductor Core', description: 'Free electrons move across the metal lattice with minimal resistance.' },
          { icon: '🛡️', title: 'PVC Plastic Insulator', description: 'Tightly bound polymer chains block high voltage current.' },
        ],
      },
    ],
  },

  // Mission 9: Heat & Thermal Insulation Lab
  9: {
    id: 'mission-09',
    number: 9,
    title: 'The Cool Handle Mystery',
    subtitle: 'Why are boiling tea kettle handles made from thermosetting Bakelite plastic instead of metal?',
    icon: '🫖',
    themeColor: 'amber',
    bgmTrack: 'chill-study',
    concepts: ['Thermal Insulator', 'Thermosetting Plastic', 'Bakelite', 'Heat Conduction'],
    steps: [
      {
        id: 'm9-s1',
        type: 'mcq_assessment',
        title: 'Boiling Kettle Thermal Test',
        subtitle: 'Compare the thermal conductivity of a cast iron metal handle vs a Bakelite plastic handle.',
        pipPrompt: 'Look at the boiling kettle! Why does the metal body get scorching hot at 100°C while the Bakelite handle stays safe at 32°C?',
        pipMood: 'curious',
        conceptBadge: 'Thermal Physics',
        illustrationImage: boilingTeaKettleSteamImg,
        question: 'Why are cooking pan and kettle handles made from thermosetting Bakelite plastic?',
        options: [
          { id: 'opt-1', text: 'Bakelite is a poor thermal conductor (heat insulator) that does not melt or soften even at high cooking temperatures.', isCorrect: true, feedback: 'Brilliant! Cross-linked thermoset polymers never soften when heated.' },
          { id: 'opt-2', text: 'Metal handles are made of liquid ice.', isCorrect: false, feedback: 'Metal handles conduct heat rapidly, causing severe burns.' },
        ],
        explanation: 'Thermosetting plastics like Bakelite have permanent molecular cross-links that prevent heat conduction and do not melt at boiling temperatures.',
      },
      {
        id: 'm9-s2',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Bakelite Handles',
        subtitle: 'Read the thermal science sentence.',
        pipPrompt: 'Read this science sentence aloud into your microphone!',
        pipMood: 'encouraging',
        targetSentence: 'Bakelite is a thermosetting plastic that does not melt and keeps pan handles cool.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm9-s3',
        type: 'concept_summary',
        title: 'Mission 9 Completed! 🫖',
        subtitle: 'You discovered how thermoset polymers protect our hands from burns.',
        pipPrompt: 'Awesome thermal science investigation! You know all about heat insulation!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '🫖', title: 'Thermosetting Polymer', description: 'Forms permanent 3D cross-linked bonds that never melt.' },
          { icon: '🛡️', title: 'Thermal Insulation', description: 'Blocks heat transfer from boiling water to safe kitchen handles.' },
        ],
      },
    ],
  },

  // Mission 10: The 100-Year Decay Soil Test
  10: {
    id: 'mission-10',
    number: 10,
    title: 'The 100-Year Decay Test',
    subtitle: 'Simulate burying cotton, natural wood, and synthetic plastic in soil across centuries.',
    icon: '⏳',
    themeColor: 'sage',
    bgmTrack: 'cosmic-explorer',
    concepts: ['Biodegradability', 'Microbial Enzymes', 'Plastic Pollution', 'Ecosystems'],
    steps: [
      {
        id: 'm10-s1',
        type: 'mcq_assessment',
        title: 'Centuries Soil Decomposition Simulation',
        subtitle: 'Observe how soil bacteria and fungi break down natural organic matter while synthetic plastics remain unchanged.',
        pipPrompt: 'Look at the 100-year soil test! Why do natural materials decompose while plastic trash lasts 450+ years?',
        pipMood: 'curious',
        conceptBadge: 'Environmental Science',
        illustrationImage: plasticDecay100YrsImg,
        question: 'Why do natural materials (like wood and cotton) rot away in soil within weeks, while synthetic plastics remain for centuries?',
        options: [
          { id: 'opt-1', text: 'Soil microbes have specialized enzymes to digest natural cellulose bonds, but cannot break synthetic petrochemical polymer bonds.', isCorrect: true, feedback: 'Spot on! Nature has evolved enzymes for plant biopolymers, but not for artificial synthetic plastics.' },
          { id: 'opt-2', text: 'Plastic is radioactive and scares away soil bacteria.', isCorrect: false, feedback: 'Microbes simply lack the biochemical enzymes to digest synthetic polymers.' },
        ],
        explanation: 'Natural biopolymers are biodegradable because microorganisms have evolved digestive enzymes over millions of years, whereas synthetic polymers require conscious recycling.',
      },
      {
        id: 'm10-s2',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Biodegradability',
        subtitle: 'Read the environmental science sentence.',
        pipPrompt: 'Speak clearly into the microphone!',
        pipMood: 'encouraging',
        targetSentence: 'Natural materials are biodegradable while synthetic plastics persist in soil for hundreds of years.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm10-s3',
        type: 'concept_summary',
        title: 'Mission 10 Completed! 🌿',
        subtitle: 'You mastered the science of biodegradability and environmental responsibility.',
        pipPrompt: 'Outstanding environmental science! You understand the 4R waste reduction rule!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '🌿', title: 'Biodegradable Cycle', description: 'Natural cellulose and keratin return nutrients to the soil.' },
          { icon: '♻️', title: 'The 4R Solution', description: 'Reduce, Reuse, Recycle, and Refuse single-use plastics.' },
        ],
      },
    ],
  },

  // Mission 11: Vulcanized Rubber & High Friction Tire Lab
  11: {
    id: 'mission-11',
    number: 11,
    title: 'The Tire That Never Melts',
    subtitle: 'Explore how sulfur vulcanization transforms soft, sticky natural latex into tough race car rubber.',
    icon: '🛞',
    themeColor: 'coral',
    bgmTrack: 'high-energy-sprint',
    concepts: ['Vulcanization', 'Cross-linking', 'Friction', 'Sulfur Bridges'],
    steps: [
      {
        id: 'm11-s1',
        type: 'mcq_assessment',
        title: 'High-Speed Friction & Heat Test',
        subtitle: 'Observe how vulcanized rubber tires withstand 200 km/h friction heat without melting.',
        pipPrompt: 'Look at the race car tire tread! Why did Charles Goodyear add sulfur to natural tree rubber?',
        pipMood: 'curious',
        conceptBadge: 'Polymer Engineering',
        illustrationImage: vulcanizedCarTireTreadImg,
        question: 'What happens during vulcanization when sulfur is heated with raw rubber?',
        options: [
          { id: 'opt-1', text: 'Sulfur forms strong chemical cross-link bridges between polymer chains, making the rubber durable, heat-resistant, and elastic.', isCorrect: true, feedback: 'Correct! Sulfur cross-links prevent rubber from melting on hot roads or turning brittle in winter.' },
          { id: 'opt-2', text: 'The rubber turns into pure liquid water.', isCorrect: false, feedback: 'Vulcanization increases strength and elasticity.' },
        ],
        explanation: 'Sulfur cross-links tie polymer chains into a giant 3D molecular spring network, giving vehicle tires extreme traction and heat resistance.',
      },
      {
        id: 'm11-s2',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Vulcanized Rubber',
        subtitle: 'Read the science sentence aloud.',
        pipPrompt: 'Read this science sentence aloud!',
        pipMood: 'encouraging',
        targetSentence: 'Vulcanized rubber has sulfur cross links that make car tires tough and elastic.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm11-s3',
        type: 'concept_summary',
        title: 'Mission 11 Completed! 🛞',
        subtitle: 'You discovered how molecular sulfur cross-links revolutionize transportation safety.',
        pipPrompt: 'Supercharged science! You understand how polymer cross-linking works!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '🌳', title: 'Raw Tree Latex', description: 'Soft, sticky in summer, brittle in winter.' },
          { icon: '🛞', title: 'Vulcanized Rubber', description: 'Cross-linked sulfur network withstands heavy friction loads.' },
        ],
      },
    ],
  },

  // Mission 12: Super Epoxy & Thermoset Adhesive Lab
  12: {
    id: 'mission-12',
    number: 12,
    title: 'The Super-Glue Chemistry',
    subtitle: 'Discover how mixing two liquid epoxy parts triggers a rapid exothermic reaction forming permanent structural bonds.',
    icon: '🧴',
    themeColor: 'sky',
    bgmTrack: 'playful-lab',
    concepts: ['Two-Part Epoxy', 'Exothermic Curing', 'Chemical Bonding', 'Thermosets'],
    steps: [
      {
        id: 'm12-s1',
        type: 'mcq_assessment',
        title: 'Two-Part Epoxy Syringe Reaction',
        subtitle: 'Observe how liquid resin and hardener react together to form an unbreakable solid bond.',
        pipPrompt: 'Look at the two-part epoxy syringe! Why does mixing resin with hardener create a bond strong enough for airplanes?',
        pipMood: 'curious',
        conceptBadge: 'Chemical Reaction',
        illustrationImage: epoxyResinAdhesiveGlueImg,
        question: 'Why do engineers use two-part epoxy resin to bond airplane wings and carbon-fiber racing bikes?',
        options: [
          { id: 'opt-1', text: 'Resin and hardener chemically react to form an irreversible 3D thermoset molecular lattice with supreme shear strength.', isCorrect: true, feedback: 'Brilliant! Exothermic polymer cross-linking creates unbreakable aerospace joints.' },
          { id: 'opt-2', text: 'Epoxy is made of sticky bubblegum.', isCorrect: false, feedback: 'Epoxy is an advanced high-performance polymer adhesive.' },
        ],
        explanation: 'Unlike physical glues that just dry, two-part epoxy cures through chemical polymerization, forming a permanent rigid thermoset solid.',
      },
      {
        id: 'm12-s2',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Epoxy Polymers',
        subtitle: 'Read the chemistry sentence aloud.',
        pipPrompt: 'Speak clearly into the microphone!',
        pipMood: 'encouraging',
        targetSentence: 'Two part epoxy glues cure through a chemical reaction that creates unbreakable molecular bonds.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm12-s3',
        type: 'concept_summary',
        title: 'Mission 12 Completed! 🧪',
        subtitle: 'You mastered chemical curing and structural polymer adhesives.',
        pipPrompt: 'Fantastic work! You understand aerospace bonding chemistry!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '🧴', title: 'Two-Part Chemistry', description: 'Liquid Resin + Hardener Catalyst ➔ Rigid Structural Solid' },
          { icon: '✈️', title: 'Aerospace Durability', description: 'Resists extreme vibration, water, and heat.' },
        ],
      },
    ],
  },

  // Mission 13: High-Altitude Parachute Engineering & Science Citadel
  13: {
    id: 'mission-13',
    number: 13,
    title: 'The Parachute Challenge',
    subtitle: 'Synthesize everything you learned to engineer a high-altitude canopy jump and claim the Grand PolyQuest Trophy!',
    icon: '🪂',
    themeColor: 'amber',
    bgmTrack: 'carnival-celebration',
    concepts: ['Master Synthesis', 'Aerospace Nylon', 'Ripstop Weave', 'Grand Science Mastery'],
    steps: [
      {
        id: 'm13-s1',
        type: 'mcq_assessment',
        title: 'Grand Parachute Material Selection',
        subtitle: 'Select the ultimate material combination for a supersonic high-altitude parachute jump.',
        pipPrompt: 'The final challenge! Pip needs a parachute canopy that is ultra-lightweight, airtight, and strong enough to survive supersonic winds!',
        pipMood: 'thinking',
        conceptBadge: 'Master Engineering',
        illustrationImage: parachuteCanopyJumpImg,
        question: 'Which material combination is the only correct choice for a high-altitude parachute canopy and suspension lines?',
        options: [
          { id: 'opt-1', text: 'Ripstop synthetic nylon canopy with braided nylon suspension lines for maximum tensile strength, zero water weight, and tear resistance.', isCorrect: true, feedback: 'PERFECT! Synthetic nylon is lightweight, airtight, and has enormous tensile elasticity.' },
          { id: 'opt-2', text: 'Heavy cotton canvas canopy with cast iron chains.', isCorrect: false, feedback: 'Heavy cotton is too bulky, absorbs moisture, and would fail to open in time.' },
        ],
        explanation: 'High-altitude aerospace parachutes rely exclusively on synthetic nylon polymers for low weight, high elasticity, and extreme tensile strength.',
      },
      {
        id: 'm13-s2',
        type: 'read_aloud_coach',
        title: 'Final Grand Speech: Material Science Master',
        subtitle: 'Read the grand science decree aloud into your microphone!',
        pipPrompt: 'Read the final science decree to claim your Grand PolyQuest Citadel Trophy!',
        pipMood: 'celebrating',
        targetSentence: 'I am a junior materials scientist who understands how natural and synthetic polymers shape our world.',
        conceptBadge: 'Grand Master',
      },
      {
        id: 'm13-s3',
        type: 'concept_summary',
        title: '🏆 GRAND CITADEL MASTER SCIENTIST! 🏆',
        subtitle: 'You completed all 13 hands-on missions of CBSE Class 5 Science • Natural & Synthetic Materials!',
        pipPrompt: 'CONGRATULATIONS, YOUNG SCIENTIST! You have conquered all 13 laboratory missions with flying colors!',
        pipMood: 'celebrating',
        takeawayCards: [
          { icon: '👑', title: 'Grand PolyQuest Trophy', description: 'Mastery of Natural, Synthetic, Metallic, and Polymer Materials.' },
          { icon: '⭐', title: 'Science Stars Unlocked', description: 'All laboratory specimens and badges added to your Field Journal!' },
        ],
      },
    ],
  },
};
