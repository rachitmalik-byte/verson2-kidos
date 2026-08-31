/**
 * Comprehensive Declarative Lesson Configuration Data Schema
 * PolyQuest CBSE Class 5 Science • Natural & Synthetic Materials
 */

import type { LessonMissionConfig } from '@/types/lessonEngine';

// Real Studio Photography & Micrographs
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
            label: 'Cotton Plant Boll Specimen',
            image: cottonBollSpecimenImg,
            scaleBarText: '20 mm',
            structuralFeatures: ['Fluffy seed pod cellulose', 'Spun staple fibers'],
            scientificExplanation: 'At macroscopic scale, natural cotton fibers form fluffy seed bolls.',
          },
          {
            magnification: '10x',
            label: 'Woven Fabric Weave',
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
            description: 'Strongest natural fiber spun by silkworms.',
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
            description: 'Multi-strand braided stainless steel wire rope.',
            realWorldUse: 'Suspension bridge cables, aircraft controls, elevator hoists.',
          },
        ],
      },
      {
        id: 'm3-s2',
        type: 'mcq_assessment',
        title: 'Tensile Strength Engineering Choice',
        subtitle: 'Why is nylon chosen for critical safety equipment?',
        pipPrompt: 'Why do mountaineers and paratroopers trust nylon for life-saving ropes?',
        pipMood: 'thinking',
        conceptBadge: 'Tensile Physics',
        question: 'Why is NYLON chosen over cotton for rock climbing ropes and parachutes?',
        options: [
          { id: 'opt-1', text: 'Nylon has extremely high tensile strength and elasticity, holding heavy body weight without snapping.', isCorrect: true, feedback: 'Correct! Nylon can hold more than triple the load of equivalent natural fibers.' },
          { id: 'opt-2', text: 'Nylon is made of pure solid diamond.', isCorrect: false, feedback: 'Nylon is a synthetic polyamide polymer.' },
        ],
        explanation: 'Continuous synthetic polymer chains give nylon superior tensile strength and shock absorption.',
      },
      {
        id: 'm3-s3',
        type: 'read_aloud_coach',
        title: 'Speech Coach: Nylon Tensile Strength',
        subtitle: 'Read the science sentence aloud.',
        pipPrompt: 'Speak clearly into the microphone to earn your stars!',
        pipMood: 'encouraging',
        targetSentence: 'Nylon is a super strong synthetic polymer used for mountaineering ropes and parachutes.',
        conceptBadge: 'Speech Coach',
      },
      {
        id: 'm3-s4',
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
        title: 'Microscope: Wool & Cotton Fibers',
        subtitle: 'Inspect natural wool keratin scales at 1x, 10x, and 100x magnification.',
        pipPrompt: 'Look at wool fibers under the microscope! Notice the overlapping scales that trap warm air in winter.',
        pipMood: 'explaining',
        conceptBadge: 'SEM Micrograph',
        specimenName: 'Natural Sheep Wool Fleece',
        specimenCategory: 'Natural',
        tiers: [
          {
            magnification: '1x',
            label: 'Wool Fleece Specimen',
            image: sheepWoolFleeceImg,
            scaleBarText: '25 mm',
            structuralFeatures: ['Fluffy crimped animal fleece', 'Natural elasticity'],
            scientificExplanation: 'Natural wool harvested from sheep has crimp and air pockets.',
          },
          {
            magnification: '10x',
            label: 'Knitted Wool Yarn',
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
};
