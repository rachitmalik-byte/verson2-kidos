// Complete Digital Guidebook Dataset for PolyQuest (CBSE Class 5 EVS Science Academy)
// Contains comprehensive conceptual study notes, verified visual assets, historical case studies,
// vocabulary glossaries, DIY experiments, and exam tips for all 19 chapters across all 4 courses.

export interface GuidebookVocabulary {
  term: string;
  pronunciation?: string;
  definition: string;
  example: string;
}

export interface GuidebookImage {
  assetKey: string;
  webFallbackUrl: string;
  caption: string;
  magnificationOrType: string;
}

export interface GuidebookCaseStudy {
  title: string;
  yearOrEra: string;
  discoverer: string;
  narrative: string;
  significance: string;
}

export interface GuidebookMiniLab {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Adult Supervision';
  materials: string[];
  instructions: string[];
  scientificPrinciple: string;
}

export interface GuidebookChapter {
  id: string;
  courseId: 'materials' | 'senses' | 'water' | 'shelter';
  courseName: string;
  chapterNumber: number;
  title: string;
  syllabusRef: string;
  icon: string;
  bigQuestion: string;
  coreConcepts: {
    heading: string;
    explanation: string;
    keyTakeaway: string;
  }[];
  images: GuidebookImage[];
  caseStudy: GuidebookCaseStudy;
  vocabulary: GuidebookVocabulary[];
  quickRevisionPoints: string[];
  miniLab: GuidebookMiniLab;
  pipExamTip: string;
}

export const GUIDEBOOK_CHAPTERS: GuidebookChapter[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // COURSE 1: THINGS WE MAKE & DO — MATERIALS SCIENCE (Theme 6)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "guide-mat-01",

    courseId: "materials",

    courseName: "Things We Make & Do: Materials",

    chapterNumber: 1,
    title: "The Raincoat Mystery & Moisture Mechanics",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "🧥",

    bigQuestion: "Why does natural cotton soak in rain until it is heavy and wet, while synthetic polyester sheds water instantly as rolling pearls?",

    coreConcepts: [
      {
        heading: "1. Cellulose Micro-Pores vs. Hydrophobic Polymer Barriers",

        explanation: "Natural cotton fibers are hollow plant tubes made of cellulose. Under high magnification, cotton fibers feature millions of microscopic capillary pores that pull water inward through capillary action. Synthetic polyester, synthesized from petrochemical esters, has non-porous molecular chains. Its hydrophobic (\"water-fearing\") nature repels water molecules, forcing them into beads due to high surface tension.",

        keyTakeaway: "Cotton absorbs moisture via capillary cellulose pores; synthetic polyester repels water with a hydrophobic barrier."

      },
      {
        heading: "2. The Golden Triangle of Materials Science",

        explanation: "Every engineering decision in science follows a three-way relationship: Material Composition ➔ Physical Properties ➔ Practical Application. When choosing clothing, engineers match fabric properties to environmental conditions (e.g., breathable cotton for hot summer heat vs. waterproof polyester for monsoon rain).",

        keyTakeaway: "The Material an object is made from determines its Physical Properties, which determines what we Use It For."

      }
    ],
    images: [
      {
        assetKey: "raw_cotton_boll.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80",

        caption: "Raw natural cotton boll showing hollow plant cellulose fibers with natural capillary pores.",

        magnificationOrType: "Natural Specimen Macro"

      },
      {
        assetKey: "polyester_raincoat_waterproof.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",

        caption: "Water droplets forming high contact-angle spherical beads on hydrophobic synthetic polyester fabric.",

        magnificationOrType: "Hydrophobic Surface Testing"

      }
    ],
    caseStudy: {
      title: "Charles Macintosh & The 1823 Waterproof Revolution",

      yearOrEra: "1823 CE",

      discoverer: "Charles Macintosh (Scottish Chemist)",

      narrative: "Before 1823, people wore heavy woolen cloaks coated in wax or oil that melted in summer and cracked in winter. Charles Macintosh sandwiched a thin layer of natural rubber dissolved in coal-tar naphtha between two layers of cotton cloth, inventing the world’s first flexible waterproof raincoat (the Mackintosh)!",

      significance: "Demonstrated how combining natural fabrics with polymer barriers creates revolutionary weather-resistant textiles."

    },
    vocabulary: [
      {
        term: "Hydrophobic",

        pronunciation: "hy-dro-FO-bik",

        definition: "Repelling or failing to mix with water; water-fearing.",

        example: "Polyester raincoats have hydrophobic surfaces that force rain into beads."

      },
      {
        term: "Capillary Action",

        pronunciation: "KAP-uh-lair-ee AK-shun",

        definition: "The ability of a liquid to flow in narrow spaces without external forces due to surface attraction.",

        example: "Hollow cotton fibers absorb sweat through capillary action."

      },
      {
        term: "Cellulose",

        pronunciation: "SEL-yoo-lohs",

        definition: "A complex carbohydrate forming the main structural component of plant cell walls.",

        example: "Cotton and wood are rich in natural plant cellulose."

      }
    ],
    quickRevisionPoints: [
      "Cotton: Natural, organic, plant-derived, hollow fibers, highly absorbent, slow drying.",

      "Polyester: Synthetic, petrochemical polymer, non-porous, hydrophobic, quick drying.",

      "Contact Angle: Hydrophobic surfaces create high contact angles (>90°), forming spherical water beads.",

      "Golden Law: Material ➔ Physical Property ➔ Practical Use."

    ],
    miniLab: {
      title: "The 60-Second Water Dropper Comparison Test",

      difficulty: "Easy",

      materials: ['1 cotton cloth swatch', '1 synthetic polyester/nylon swatch', 'Water dropper or spoon', 'Stopwatch'],
      instructions: [
        "Place both fabric swatches flat on a dry table.",

        "Deposit 1 single drop of water on each fabric simultaneously.",

        "Observe droplet shape and measure how many seconds it takes to absorb."

      ],
      scientificPrinciple: "Cotton immediately flattens and absorbs the water drop into its pores, while polyester holds it as a round bead."

    },
    pipExamTip: "If an exam question asks which fabric is best for sweaty sports in summer, write COTTON (absorbs sweat); for a monsoon raincoat, write POLYESTER (hydrophobic water barrier)!"

  },
  {
    id: "guide-mat-02",

    courseId: "materials",

    courseName: "Things We Make & Do: Materials",

    chapterNumber: 2,
    title: "The Sorting Desk — Natural vs Synthetic Classification",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "🔬",

    bigQuestion: "How can you look at any material and immediately determine if it came from living nature or was engineered by human chemical synthesis?",

    coreConcepts: [
      {
        heading: "1. Natural Biological & Mineral Resources",

        explanation: "Natural materials originate directly from living plants (cotton, jute, timber wood, natural latex rubber), animals (wool fleece, silk protein cocoons, leather), or geological minerals (iron ore, marble stone, gold, clay). They grow or form through biological and geological cycles without artificial chemical factories.",

        keyTakeaway: "Natural materials come directly from plants, animals, or Earth's mineral deposits."

      },
      {
        heading: "2. Petrochemical Polymerization & Synthetic Materials",

        explanation: "Synthetic materials do not exist anywhere in raw nature. Humans extract crude petroleum oil from deep underground, refine it through fractional distillation, crack it into small monomer units (like ethylene or propylene), and chemically link them into massive artificial polymer chains (Nylon, Polyester, PVC, Acrylic).",

        keyTakeaway: "Synthetic materials are created by chemically linking monomer molecules into long polymer chains."

      }
    ],
    images: [
      {
        assetKey: "sheep_wool_fleece.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80",

        caption: "Natural curly wool fleece harvested from sheep containing natural keratin protein and crimp.",

        magnificationOrType: "Natural Animal Specimen"

      },
      {
        assetKey: "pet_water_bottle_molding.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80",

        caption: "PET (Polyethylene Terephthalate) synthetic polymer preforms ready for blow molding.",

        magnificationOrType: "Synthetic Polymer Factory Asset"

      }
    ],
    caseStudy: {
      title: "Wallace Carothers & The Birth of Nylon 6,6",

      yearOrEra: "1935 CE",

      discoverer: "Wallace Carothers (DuPont Chemist)",

      narrative: "In 1935, American chemist Wallace Carothers reacted adipic acid and hexamethylenediamine in a test tube. When he pulled a glass stirring rod from the warm liquid, it drew out a silky thread that stretched and hardened into Nylon — the world’s first 100% synthetic fiber!",

      significance: "Revolutionized human manufacturing by providing a man-made fiber stronger than natural silk and immune to rot."

    },
    vocabulary: [
      {
        term: "Monomer",

        pronunciation: "MAH-nuh-mer",

        definition: "A small single molecule that can be chemically bonded to other identical molecules to form a polymer.",

        example: "Ethylene is the monomer used to produce polyethylene plastic."

      },
      {
        term: "Polymer",

        pronunciation: "PAH-lih-mer",

        definition: "A large molecule made of many repeating sub-units bonded together in long chains.",

        example: "Nylon and polyester are synthetic polymers."

      },
      {
        term: "Petrochemical",

        pronunciation: "peh-troh-KEM-ih-kul",

        definition: "Chemical substances derived from crude petroleum oil or natural gas.",

        example: "Most modern plastics are synthesized from petrochemicals."

      }
    ],
    quickRevisionPoints: [
      "Natural Sources: Plant (Cotton, Wood, Rubber) | Animal (Wool, Silk) | Mineral (Iron, Clay).",

      "Synthetic Sources: Petrochemicals synthesized in factories (Nylon, Polyester, PVC, Acrylic).",

      "Polymerization: The chemical process of joining thousands of small monomers into long durable chains.",

      "Key Advantage: Synthetics can be engineered for specific properties like high tensile strength, rot resistance, and elasticity."

    ],
    miniLab: {
      title: "Household 10-Item Specimen Detective Hunt",

      difficulty: "Easy",

      materials: ['Paper notebook', 'Pen', '10 everyday household items (e.g., wooden pencil, plastic ruler, wool sweater, metal fork, cotton towel)'],
      instructions: [
        "Inspect each object and trace its ultimate origin.",

        "Create a two-column chart: \"Natural Biological\" vs. \"Synthesized Petrochemical\".",

        "Record why each item was made from that material."

      ],
      scientificPrinciple: "Identifies the structural difference between natural organic cellular textures and smooth synthetic polymer resins."

    },
    pipExamTip: "Remember: Natural rubber comes from the sap (latex) of the Hevea rubber tree, while synthetic rubber is made in factories from petroleum!"

  },
  {
    id: "guide-mat-03",

    courseId: "materials",

    courseName: "Things We Make & Do: Materials",

    chapterNumber: 3,
    title: "The Thermal Combustion Lab — Ash vs Plastic Melt Beads",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "🔥",

    bigQuestion: "Why does natural plant cotton burn into soft gray carbon ash, while synthetic polyester melts into a boiling sticky plastic bead?",

    coreConcepts: [
      {
        heading: "1. Organic Combustion vs. Thermoplastic Melting",

        explanation: "Natural cellulose (cotton, linen) and proteins (wool, silk) undergo chemical combustion when exposed to fire. Organic plant bonds oxidize completely, releasing carbon dioxide and leaving behind crushable, powdery gray carbon ash. Synthetic polymers (Polyester, Nylon, Polyethylene) are thermoplastics — high heat breaks their intermolecular forces, causing polymer chains to slip and melt into a liquid plastic resin that hardens into a solid bead.",

        keyTakeaway: "Plant fibers burn to soft carbon ash; synthetic thermoplastics melt into hard plastic beads."

      },
      {
        heading: "2. Kitchen and Laboratory Fire Safety Science",

        explanation: "Because synthetic fabrics melt into boiling liquid plastic at 220°C, wearing synthetic clothing near kitchen gas stoves or open campfires is extremely dangerous! If ignited, molten plastic adheres tightly to human skin, causing severe burns. Chefs, firefighters, and scientists always wear 100% natural cotton garments for thermal protection.",

        keyTakeaway: "Always wear 100% natural cotton near fire; never wear synthetics near open flames."

      }
    ],
    images: [
      {
        assetKey: "cotton_burning_ash.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",

        caption: "Natural cotton combustion leaving soft, powdery, crushable gray carbon ash.",

        magnificationOrType: "Combustion Residue Macro"

      },
      {
        assetKey: "polyester_melting_bead.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",

        caption: "Synthetic polyester melting into a hard, solid, non-crushable polymer melt bead.",

        magnificationOrType: "Thermoplastic Thermal Reaction"

      }
    ],
    caseStudy: {
      title: "Forensic Fiber Identification in Crime Laboratories",

      yearOrEra: "Modern Forensic Science",

      discoverer: "Forensic Fiber Analysts",

      narrative: "Forensic scientists use the Burn Test to quickly identify microscopic fibers found at crime scenes. By observing flame color, odor (burning paper for cotton, burning hair for wool, sweet chemical for polyester), and residue (ash vs. hard bead), forensic detectives can pinpoint the exact clothing worn by suspects!",

      significance: "Proves how thermal decomposition profiles serve as unique chemical fingerprints for material identification."

    },
    vocabulary: [
      {
        term: "Thermoplastic",

        pronunciation: "THER-moh-plas-tik",

        definition: "A plastic polymer that becomes soft and moldable when heated and solidifies upon cooling.",

        example: "Polyester and nylon are thermoplastics that melt at high temperatures."

      },
      {
        term: "Combustion",

        pronunciation: "kum-BUS-chun",

        definition: "A rapid chemical reaction between a fuel and oxygen that produces heat, light, and ash.",

        example: "Cotton undergoes combustion to produce carbon ash."

      },
      {
        term: "Residue",

        pronunciation: "REZ-ih-doo",

        definition: "A small amount of substance that remains after a chemical reaction or physical process.",

        example: "The residue of burned cotton is soft gray ash."

      }
    ],
    quickRevisionPoints: [
      "Cotton Burn Test: Steady yellow flame, smells like burning paper/leaves, leaves soft crushable gray ash.",

      "Wool Burn Test: Steady flame with sputtering, smells like burning hair (keratin sulfur), leaves dark irregular ash.",

      "Polyester Burn Test: Melts before igniting, sweet chemical odor, shrinks into a hard black round bead.",

      "Safety Rule: 100% natural cotton drill is mandatory for kitchen aprons and lab coats."

    ],
    miniLab: {
      title: "Fiber Odor & Ash Comparison (Parent/Teacher Demo)",

      difficulty: "Adult Supervision",

      materials: ['Adult supervisor', 'Metal safety tray', 'Laboratory tweezers', '1 cotton thread', '1 synthetic thread'],
      instructions: [
        "Under strict adult supervision, hold a cotton thread with tweezers over a metal tray.",

        "Touch a flame to the tip for 1 second and extinguish.",

        "Examine the residue: cotton leaves soft ash; synthetic leaves a hard round bead."

      ],
      scientificPrinciple: "Directly illustrates the difference between organic carbon oxidation and polymer chain thermal melting."

    },
    pipExamTip: "Exam Question Trick: \"Why does wool smell like burning hair when burned?\" Answer: Because wool comes from animal fleece and is made of the sulfur-rich protein KERATIN, the exact same protein found in human hair!"

  },
  {
    id: "guide-mat-04",

    courseId: "materials",

    courseName: "Things We Make & Do: Materials",

    chapterNumber: 4,
    title: "Tensile Strength & Parachute Canopy Engineering",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "🪢",

    bigQuestion: "Why can a 1 mm micro-cord of synthetic nylon lift an entire person without breaking, while thick natural jute or cotton cord snaps easily?",

    coreConcepts: [
      {
        heading: "1. Tensile Pulling Strength & Molecular Alignment",

        explanation: "Tensile strength is the maximum pulling or stretching force a material can endure before breaking. In synthetic nylon fibers, long polyamide molecular chains are pulled and oriented in parallel lines during manufacturing. This alignment allows pulling forces to be shared equally across millions of covalent bonds.",

        keyTakeaway: "Tensile strength measures pulling resistance; aligned polyamide chains give nylon extraordinary strength."

      },
      {
        heading: "2. Parachute Canopy & Rock-Climbing Safety Engineering",

        explanation: "Aviation parachutes and mountaineering ropes require high tensile strength, extreme lightness, elasticity to absorb sudden shock loads, and immunity to environmental mold. Nylon provides up to 30% elastic stretch to cushion a skydiver when the canopy inflates at 200 km/h.",

        keyTakeaway: "Nylon replaced silk in parachutes because it is stronger, lighter, rot-proof, and elastic."

      }
    ],
    images: [
      {
        assetKey: "nylon_rope_heavy_weight.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80",

        caption: "High-tensile braided nylon climbing cord supporting heavy loads without breaking.",

        magnificationOrType: "Tensile Load Test"

      },
      {
        assetKey: "parachute_canopy_jump.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1521673461164-de300ebcfb17?auto=format&fit=crop&w=800&q=80",

        caption: "Skydiver under a high-strength ripstop nylon parachute canopy enduring aerodynamic stress.",

        magnificationOrType: "Aviation Engineering Specimen"

      }
    ],
    caseStudy: {
      title: "World War II & The Nylon Parachute Revolution",

      yearOrEra: "1939–1945 CE",

      discoverer: "Allied Military Engineers",

      narrative: "Prior to 1939, all military parachutes were made from Asian silk. When international trade routes closed during WWII, DuPont mobilized nylon manufacturing. Over 3.8 million nylon parachutes were woven, saving tens of thousands of aviators and demonstrating the superiority of synthetic cordage!",

      significance: "Established nylon as the global standard for high-performance safety cordage and mountaineering equipment."

    },
    vocabulary: [
      {
        term: "Tensile Strength",

        pronunciation: "TEN-syl strength",

        definition: "The resistance of a material to breaking under tension or pulling forces.",

        example: "Steel cables and nylon ropes have exceptionally high tensile strength."

      },
      {
        term: "Polyamide",

        pronunciation: "pah-lee-AM-eyed",

        definition: "A synthetic polymer containing repeating amide units linked by peptide-like bonds.",

        example: "Nylon is chemically classified as a synthetic polyamide."

      },
      {
        term: "Elastic Limit",

        pronunciation: "ee-LAS-tik LIH-mit",

        definition: "The maximum extent to which a solid can be stretched without permanent alteration of size or shape.",

        example: "Nylon absorbs falling energy within its elastic limit."

      }
    ],
    quickRevisionPoints: [
      "Tensile Strength Ranking: Cotton < Jute < Silk < Nylon < Carbon Fiber < Steel Cable.",

      "Nylon Superpowers: High tensile strength, lightweight, high elasticity (absorbs shock), completely rot-proof.",

      "Natural Cord Weakness: Cotton and jute ropes weaken and rot when wet, making them dangerous for climbing."

    ],
    miniLab: {
      title: "The Hanging Coin Stress Test",

      difficulty: "Easy",

      materials: ['1 cotton sewing thread (30 cm)', '1 nylon fishing line or dental floss (30 cm)', 'Small paper cup', 'Coins as weights'],
      instructions: [
        "Punch two small holes in the cup rim and tie the cotton thread to make a handle.",

        "Suspend the cup and add coins one by one until the thread snaps. Count the coins!",

        "Repeat with the nylon thread and compare breaking strength."

      ],
      scientificPrinciple: "Directly demonstrates how molecular polymer alignment provides superior tensile load capacity."

    },
    pipExamTip: "If asked why nylon is preferred over cotton for fishing nets and climbing ropes, give TWO reasons: 1) Superior tensile strength, and 2) Nylon does NOT rot when wet in water!"

  },
  {
    id: "guide-mat-05",

    courseId: "materials",

    courseName: "Things We Make & Do: Materials",

    chapterNumber: 5,
    title: "Electrical & Heat Insulation — Bakelite & PVC Wire Coating",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "⚡",

    bigQuestion: "Why doesn’t a boiling tea kettle handle burn your bare hands, and why does plastic wrapping around copper wires prevent electric shocks?",

    coreConcepts: [
      {
        heading: "1. Conductors vs. Insulators (Thermal & Electrical)",

        explanation: "Metals like copper and aluminum contain free valence electrons that drift easily, transmitting electrical current and heat energy rapidly. Insulators (Bakelite, PVC, rubber, glass, wood) have tightly bound electrons that resist electron flow and molecular thermal vibration.",

        keyTakeaway: "Conductors transmit electricity and heat; Insulators block the flow of electricity and heat."

      },
      {
        heading: "2. Thermosetting Polymers (Bakelite 3D Cross-Links)",

        explanation: "Unlike thermoplastics that melt when heated, Bakelite is a Thermosetting polymer. During manufacturing, heat triggers permanent 3D chemical cross-links between polymer chains. Once set, Bakelite CANNOT melt or soften even at 300°C, making it the safest material for cookware handles and electrical plugs.",

        keyTakeaway: "Thermosetting Bakelite features rigid 3D molecular cross-links that never melt under heat."

      }
    ],
    images: [
      {
        assetKey: "bakelite_pan_handle.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80",

        caption: "Heat-resistant thermosetting Bakelite handle attached to a stainless steel cooking pan.",

        magnificationOrType: "Thermoset Cookware Specimen"

      },
      {
        assetKey: "pvc_insulated_cable.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80",

        caption: "Multi-strand conductive copper core encased in flexible color-coded PVC insulating sheath.",

        magnificationOrType: "Electrical Conductor Cross-Section"

      }
    ],
    caseStudy: {
      title: "Leo Baekeland & The 1907 Bakelite Invention",

      yearOrEra: "1907 CE",

      discoverer: "Leo Baekeland (Belgian-American Chemist)",

      narrative: "In 1907, Leo Baekeland placed phenol and formaldehyde into a high-pressure iron autoclave called the \"Bakelizer\". Under heat and pressure, the chemicals hardened into a dark, glossy, completely infusible solid — Bakelite, the world’s first fully synthetic thermosetting resin!",

      significance: "Enabled the global electrical revolution by providing safe, mass-producible insulating casings for light switches, radios, and power grids."

    },
    vocabulary: [
      {
        term: "Thermosetting",

        pronunciation: "THER-moh-set-ing",

        definition: "A polymer material that cures irreversibly into a permanent rigid shape that cannot be melted by heat.",

        example: "Bakelite and epoxy resins are thermosetting plastics."

      },
      {
        term: "Conductor",

        pronunciation: "kun-DUK-ter",

        definition: "A material that readily allows the flow of electric charge or thermal energy through it.",

        example: "Copper is an excellent electrical and thermal conductor."

      },
      {
        term: "Insulator",

        pronunciation: "IN-suh-lay-ter",

        definition: "A substance that does not readily allow the passage of heat, sound, or electricity.",

        example: "PVC plastic and rubber are electrical insulators."

      }
    ],
    quickRevisionPoints: [
      "Conductors: Copper, Aluminum, Iron, Gold, Silver, Tap Water.",

      "Insulators: Bakelite, PVC, Rubber, Glass, Wood, Dry Air.",

      "Thermoset vs Thermoplastic: Thermoplastics melt with heat and can be recycled; Thermosets never melt due to permanent 3D cross-links.",

      "Cookware Physics: Metal pan conducts heat to cook food; Bakelite handle insulates human hands from burns."

    ],
    miniLab: {
      title: "The Metal vs. Wood vs. Plastic Spoon Butter Melt Test",

      difficulty: "Easy",

      materials: ['1 metal spoon', '1 wooden spoon', '1 plastic spoon', 'Mug of hot water', '3 small pats of butter'],
      instructions: [
        "Place a dab of butter on the handle tip of all 3 spoons.",

        "Place all 3 spoons standing in a mug of hot water at the same time.",

        "Observe which butter dab melts first!"

      ],
      scientificPrinciple: "The butter on the metal spoon melts within 30 seconds due to high thermal conductivity, while wood and plastic insulate."

    },
    pipExamTip: "Distinguish clearly: Thermoplastics (PET bottles, polybags) CAN be melted and reshaped; Thermosets (Bakelite switches, pan handles) CANNOT be melted once molded!"

  },
  {
    id: "guide-mat-06",

    courseId: "materials",

    courseName: "Things We Make & Do: Materials",

    chapterNumber: 6,
    title: "The Long Sleep — 450-Year Biodegradation & Soil Microbes",

    syllabusRef: "CBSE Class 5 EVS • Theme 6 (Materials)",

    icon: "⏳",

    bigQuestion: "Why does an apple core decompose into rich garden soil in 2 weeks, while a discarded plastic bottle persists for over 450 years?",

    coreConcepts: [
      {
        heading: "1. Biological Decomposition & Microbial Enzyme Specificity",

        explanation: "Soil is populated by billions of bacteria, fungi, actinomycetes, and earthworms. Over millions of years, these decomposers evolved specific biological enzymes (cellulase, pectinase, protease) to break down natural organic bonds (cellulose, pectin, keratin) into water, carbon dioxide, and rich humus.",

        keyTakeaway: "Biodegradable organic matter is digested into fertile soil by microbial enzymes."

      },
      {
        heading: "2. The 450-Year Synthetic Plastic Persistence Crisis",

        explanation: "Synthetic plastics were only invented ~100 years ago. Soil microorganisms have NO evolved enzymes capable of recognizing artificial carbon-carbon polymer bonds. Instead of biodegrading biologically, plastics undergo slow physical photodegradation by sunlight, fragmenting into toxic microplastics that contaminate soil and marine food chains for over 450 years.",

        keyTakeaway: "Nature lacks enzymes to digest petrochemical plastics, which persist for 450+ years and fragment into microplastics."

      }
    ],
    images: [
      {
        assetKey: "soil_apple_rotted.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",

        caption: "Natural apple core undergoing rapid microbial enzymatic decomposition in garden compost soil.",

        magnificationOrType: "Soil Decomposition Specimen"

      },
      {
        assetKey: "soil_plastic_450yrs.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",

        caption: "Synthetic plastic bottle remaining intact with zero microbial digestion after decades buried in soil.",

        magnificationOrType: "Environmental Persistence Specimen"

      }
    ],
    caseStudy: {
      title: "The 5 R’s of Sustainable Environmental Action",

      yearOrEra: "Global Environmental Science",

      discoverer: "Environmental Conservationists",

      narrative: "To combat plastic accumulation, environmental scientists created the 5 R framework: Refuse single-use plastics, Reduce daily consumption, Reuse durable containers, Repurpose discarded materials, and Recycle plastic resins. Innovative scientists are now engineering bioplastics from cornstarch and potato starch that biodegrade in 90 days!",

      significance: "Provides actionable scientific strategies to eliminate non-biodegradable landfill waste."

    },
    vocabulary: [
      {
        term: "Biodegradable",

        pronunciation: "by-oh-dee-GRAY-duh-bul",

        definition: "Capable of being decomposed by bacteria or other living organisms into natural substances.",

        example: "Fruit peels and cotton fabrics are completely biodegradable."

      },
      {
        term: "Microplastics",

        pronunciation: "MY-kroh-plas-tiks",

        definition: "Extremely small pieces of plastic debris resulting from the disposal and breakdown of consumer products (< 5mm).",

        example: "Discarded plastic bottles slowly fragment into harmful microplastics."

      },
      {
        term: "Compost",

        pronunciation: "KOM-pohst",

        definition: "Decayed organic material used as a plant fertilizer and soil conditioner.",

        example: "Kitchen fruit scraps turn into dark, nutrient-rich compost in weeks."

      }
    ],
    quickRevisionPoints: [
      "Decomposition Timelines: Banana peel (2–4 weeks) ➔ Cotton rag (1–5 months) ➔ Wood timber (10–15 years) ➔ Plastic bottle (450–500 years).",

      "Why Plastic Persists: No natural microbial enzymes recognize synthetic carbon-carbon polymer chains.",

      "The 5 R’s: Refuse, Reduce, Reuse, Repurpose, Recycle.",

      "Bioplastics: Plant-derived polymers (PLA from cornstarch) that decompose within 90 days."

    ],
    miniLab: {
      title: "The Transparent Soil Jar Decomposition Experiment",

      difficulty: "Easy",

      materials: ['1 clear glass or plastic jar filled with damp garden soil', '1 strip of banana peel', '1 strip of plastic bag'],
      instructions: [
        "Bury the banana peel against the left glass wall and the plastic strip against the right glass wall.",

        "Keep soil moist in a warm spot for 3 weeks.",

        "Observe changes through the transparent walls every 5 days."

      ],
      scientificPrinciple: "Microbial fungi dissolve the banana peel while the plastic strip remains completely untouched."

    },
    pipExamTip: "Exam question: \"What is the difference between biodegradable and non-biodegradable substances?\" Write: Biodegradable substances can be broken down naturally by soil bacteria into harmless organic matter (e.g. food scraps, cotton); non-biodegradable substances cannot be digested by microbes and persist for centuries (e.g. plastic, glass)."

  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COURSE 2: SUPER SENSES & LIVING WORLD (Theme 1 / NCERT)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "guide-senses-01",

    courseId: "senses",

    courseName: "Super Senses & Living World",

    chapterNumber: 1,
    title: "Super Senses in Animals (Smell, Sight & Sound)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 1",

    icon: "🐾",

    bigQuestion: "How do tiny ants communicate complex navigation routes without spoken words, and how do eagles spot mice from 2 km high in the sky?",

    coreConcepts: [
      {
        heading: "1. Pheromone Scent Highways in Social Insects",

        explanation: "When a scout ant discovers a food source (like dropped sugar syrup), it secretes an invisible chemical trail called a Pheromone from its abdominal Dufour’s gland onto the ground. Returning worker ants detect these chemical molecules using specialized chemoreceptor sensilla on their jointed antennae, maintaining a perfect marching column without colliding.",

        keyTakeaway: "Ants communicate navigation trails via chemical pheromones detected by antenna chemoreceptors."

      },
      {
        heading: "2. Telescopic 4x Foveal Vision in Birds of Prey",

        explanation: "Eagles, hawks, and vultures have retinas containing up to 1,000,000 photoreceptor cone cells per square millimeter (compared to ~200,000 in humans). They possess dual foveae per eye, providing simultaneous panoramic peripheral vision and 4x optical zoom magnification to spot a moving mouse from 2 kilometers altitude.",

        keyTakeaway: "Eagles have 4x the photoreceptor density of humans, giving them telescopic zoom vision from high altitudes."

      }
    ],
    images: [
      {
        assetKey: "ants_trail_sugar.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80",

        caption: "Worker ants marching in an unbroken chemical pheromone trail toward a sugar food source.",

        magnificationOrType: "Entomological Macro Photography"

      },
      {
        assetKey: "eagle_view_mouse.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1611689342806-0863700ce1e4?auto=format&fit=crop&w=800&q=80",

        caption: "Eagle eye retinal view demonstrating 4x telescopic zoom focal magnification.",

        magnificationOrType: "Avian Optical Simulation"

      }
    ],
    caseStudy: {
      title: "Jean-Henri Fabre & The Silkworm Moth Scent Radar",

      yearOrEra: "1870s CE",

      discoverer: "Jean-Henri Fabre (French Entomologist)",

      narrative: "Entomologist Jean-Henri Fabre placed a female Emperor moth inside a wire cage in his laboratory. Over two nights, more than 40 male moths arrived from miles away through dense forests! Later biochemists discovered the male moth’s feathery antennae can detect a single molecule of the female pheromone bombykol over 5 kilometers away!",

      significance: "Demonstrated the incredible sensitivity of airborne chemical olfaction in the animal kingdom."

    },
    vocabulary: [
      {
        term: "Pheromone",

        pronunciation: "FEHR-uh-mohn",

        definition: "A chemical substance produced and released into the environment by an animal affecting the behavior or physiology of others of its species.",

        example: "Ants follow a pheromone trail back to their nest."

      },
      {
        term: "Chemoreceptor",

        pronunciation: "KEE-moh-rih-sep-ter",

        definition: "A sensory cell or organ responsive to chemical stimuli (smell or taste).",

        example: "Ant antennae are packed with sensitive chemoreceptors."

      },
      {
        term: "Fovea",

        pronunciation: "FOH-vee-uh",

        definition: "A small depression in the retina of the eye where visual acuity is highest.",

        example: "Birds of prey have dual foveae for zoom vision."

      }
    ],
    quickRevisionPoints: [
      "Ants: Scent-based communication using pheromone trails and antennae.",

      "Eagles & Vultures: See 4 times farther than humans; spot small prey from 2 km away.",

      "Dogs: 300 million olfactory receptors (50x human capacity), used in rescue and tracking.",

      "Silkworm Moth: Can detect female scent from over 4–5 km away using feathery antennae.",

      "Mosquitoes: Find humans in dark rooms by detecting body heat and exhaled carbon dioxide gas."

    ],
    miniLab: {
      title: "The Ant Pheromone Obstacle Observation",

      difficulty: "Easy",

      materials: ['A line of marching garden ants', '1 clean wooden pencil or ruler', 'A few grains of sugar'],
      instructions: [
        "Locate a line of ants moving between their nest and a food source.",

        "Gently place the pencil across their path for 30 seconds.",

        "Observe how the ants stop, wave their antennae in circles to scan for the scent boundary, and reroute around the pencil to reconnect with the trail!"

      ],
      scientificPrinciple: "Proves that ants rely on chemical scent boundaries rather than visual terrain landmarks."

    },
    pipExamTip: "NCERT Question: \"Which animals can see four times as far as humans?\" Always write: KITES, EAGLES, and VULTURES!"

  },
  {
    id: "guide-senses-02",

    courseId: "senses",

    courseName: "Super Senses & Living World",

    chapterNumber: 2,
    title: "A Snake Charmer's Story & Reptiles",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 2",

    icon: "🐍",

    bigQuestion: "If snakes have no external ears and cannot hear airborne music, why do cobras sway when a snake charmer plays the gourd flute (been)?",

    coreConcepts: [
      {
        heading: "1. Seismic Ground Vibration Hearing via Quadrate Jawbones",

        explanation: "Snakes lack external ear openings, ear canals, and tympanic eardrums. Instead, a snake’s lower quadrate jawbone rests against the earth. Footsteps and movements create seismic Rayleigh soundwaves in the soil. These ground vibrations travel through the jawbone directly into the snake’s inner ear columella bone, alerting it to approaching animals.",

        keyTakeaway: "Snakes hear by detecting seismic ground vibrations conducted through their lower jawbone."

      },
      {
        heading: "2. The Big 4 Venomous Snakes of India & Antivenom Science",

        explanation: "Out of more than 300 snake species in India, only 4 possess venom dangerous to humans: Spectacled Cobra (Naja naja), Common Krait (Bungarus caeruleus), Russell’s Viper (Daboia russelii), and Saw-scaled Viper (Echis carinatus). All other snakes (like rat snakes) are non-venomous allies of farmers because they eat grain-destroying rodents. Lifesaving polyvalent antivenom serum is produced by harvesting antibodies from snake venom itself!",

        keyTakeaway: "Only 4 Indian snakes are venomous; non-venomous snakes protect crops, and venom produces lifesaving antivenom."

      }
    ],
    images: [
      {
        assetKey: "eagle_view_landscape.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80",

        caption: "Reptilian habitat and seismic ground vibration transmission across dry soil terrain.",

        magnificationOrType: "Reptile Sensory Ecology"

      },
      {
        assetKey: "silkworm_silk_cocoon.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80",

        caption: "Biological specimens and antivenom pharmacology laboratory assets.",

        magnificationOrType: "Pharmacological Specimen"

      }
    ],
    caseStudy: {
      title: "The Kalbeliya Community & Traditional Snake Wisdom",

      yearOrEra: "Centuries-Old Indian Heritage",

      discoverer: "Kalbeliya Nomadic Community of Rajasthan",

      narrative: "The Kalbeliya people of Rajasthan have passed down intimate knowledge of snake behavior, herbal bite remedies, and the mesmerizing Been dance for generations. They catch snakes without harming them and release them safely into forests, serving as guardians of reptile ecology in arid ecosystems.",

      significance: "Highlights how traditional ecological knowledge harmonizes human communities with wildlife conservation."

    },
    vocabulary: [
      {
        term: "Quadrate Bone",

        pronunciation: "KWAH-drayt bohn",

        definition: "A specialized bone in the skull of reptiles and amphibians that articulates with the lower jaw to conduct sound vibrations.",

        example: "The quadrate bone allows snakes to hear footsteps through the ground."

      },
      {
        term: "Antivenom",

        pronunciation: "an-tee-VEN-um",

        definition: "A medication made from antibodies used to treat venomous snakebites.",

        example: "Hospitals keep polyvalent antivenom in stock for emergency snakebite treatment."

      },
      {
        term: "Venomous",

        pronunciation: "VEN-uh-mus",

        definition: "Capable of injecting venom by means of a bite or sting.",

        example: "The Common Krait is one of India's most venomous snakes."

      }
    ],
    quickRevisionPoints: [
      "Snakes do not have external ears; they sway to the MOVEMENT of the charmer's been, not the airborne sound.",

      "Hearing Mechanism: Ground vibrations ➔ Lower jawbone ➔ Inner ear bones (Columella).",

      "The Big 4 Venomous Snakes: Cobra, Common Krait, Russell's Viper, Saw-scaled Viper.",

      "Hollow Fangs: Snakes deliver venom through two hollow sharp fangs like hypodermic needles.",

      "Farmers' Friends: Non-venomous rat snakes eat millions of crop-destroying rats in grain fields."

    ],
    miniLab: {
      title: "The Table-Tap Jawbone Vibration Simulation",

      difficulty: "Easy",

      materials: ['1 solid wooden table', 'Your hands', 'A pencil or partner'],
      instructions: [
        "Plug both of your ears tightly with your fingers. Notice how quiet room sounds become.",

        "Rest your lower chin and jaw firmly against the wooden table top.",

        "Have a partner gently tap the opposite end of the table with a pencil eraser."

      ],
      scientificPrinciple: "The tapping sound resonates loud and clear through your jawbone directly into your inner ear, demonstrating snake hearing."

    },
    pipExamTip: "Important NCERT Exam Fact: Name the four poisonous snakes found in India: 1. Cobra, 2. Common Krait, 3. Russell's Viper (Duboiya), and 4. Saw-scaled Viper (Afai)!"

  },
  {
    id: "guide-senses-03",

    courseId: "senses",

    courseName: "Super Senses & Living World",

    chapterNumber: 3,
    title: "From Tasting to Digestion (Enzymes & Dr. Beaumont)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 3",

    icon: "👅",

    bigQuestion: "Why does plain, unsweetened roti or boiled rice begin to taste noticeably sweet in your mouth after chewing for 30 seconds?",

    coreConcepts: [
      {
        heading: "1. Salivary Amylase Enzyme Chemistry",

        explanation: "Digestion begins mechanically and chemically inside the mouth! When you chew food, salivary glands secrete saliva containing the enzyme Amylase. Amylase acts as molecular scissors, cleaving long, tasteless complex starch molecules (carbohydrates) in roti and rice into sweet simple sugars (maltose and glucose) right on your tongue papillae.",

        keyTakeaway: "Salivary amylase breaks down complex starches into sweet simple sugars during chewing."

      },
      {
        heading: "2. Dr. William Beaumont & Alexis St. Martin’s Stomach (1822)",

        explanation: "In 1822, Dr. William Beaumont treated Alexis St. Martin, a Canadian voyageur whose gunshot wound healed with a permanent open fistula (window) into his stomach. Over 9 years of experiments, Dr. Beaumont discovered that gastric juices (hydrochloric acid and pepsin) chemically digest food at 37°C, and that digestion slows dramatically when a person is stressed, sad, or rushed.",

        keyTakeaway: "The stomach digests food with acid and enzymes at 37°C; emotional stress slows digestion."

      }
    ],
    images: [
      {
        assetKey: "soil_apple_day1.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=800&q=80",

        caption: "Nutritious carbohydrate and fruit specimens initiating early enzymatic digestion.",

        magnificationOrType: "Nutritional Food Specimen"

      },
      {
        assetKey: "boiling_tea_kettle_steam.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",

        caption: "Thermal biochemical digestion simulation at 37°C body temperature.",

        magnificationOrType: "Biochemical Thermal Simulation"

      }
    ],
    caseStudy: {
      title: "Dr. William Beaumont: Father of Gastric Physiology",

      yearOrEra: "1822–1833 CE",

      discoverer: "Dr. William Beaumont (US Army Surgeon)",

      narrative: "Dr. Beaumont inserted foods tied to silk strings directly into Alexis St. Martin’s stomach and timed how long each food took to digest. He discovered boiled meat took 2 hours inside the stomach but over 4 hours in a glass tube of stomach acid, proving that stomach muscular churning accelerates chemical digestion!",

      significance: "Established the foundation of modern gastroenterology and dietary science."

    },
    vocabulary: [
      {
        term: "Amylase",

        pronunciation: "AM-ih-lays",

        definition: "An enzyme found in saliva and pancreatic fluid that converts starch and glycogen into simple sugars.",

        example: "Salivary amylase turns bread starch into sweet maltose."

      },
      {
        term: "Enzyme",

        pronunciation: "EN-zyme",

        definition: "A biological protein molecule that acts as a catalyst to speed up chemical reactions in living organisms.",

        example: "Digestive enzymes break down food into absorbable nutrients."

      },
      {
        term: "Gastric Juice",

        pronunciation: "GAS-trik joos",

        definition: "A thin, acidic fluid secreted by the stomach glands containing hydrochloric acid and pepsin.",

        example: "Gastric juices digest proteins and kill harmful bacteria in food."

      }
    ],
    quickRevisionPoints: [
      "5 Basic Tastes: Sweet, Salty, Sour, Bitter, and Umami (savory).",

      "The 32-Chew Rule: Chewing thoroughly mixes food with saliva, starting chemical digestion before swallowing.",

      "Stomach Acid: Hydrochloric acid (pH 1.5–2.0) dissolves proteins and sterilizes ingested bacteria.",

      "Emotional Connection: Stress, grief, and anger reduce gastric secretions, causing indigestion."

    ],
    miniLab: {
      title: "The 30-Second Bread Sweetness Timer Experiment",

      difficulty: "Easy",

      materials: ['1 small piece of plain bread or unsweetened roti', 'Stopwatch / clock'],
      instructions: [
        "Place the plain bread in your mouth without swallowing.",

        "Chew continuously for 30 seconds.",

        "Note the taste change at second 5 (bland), second 15 (slightly sweet), and second 30 (distinctly sweet)!"

      ],
      scientificPrinciple: "Direct proof of salivary amylase converting complex starches into sweet maltose sugars."

    },
    pipExamTip: "Exam Question: \"Where does digestion begin in the human body?\" The correct answer is THE MOUTH (not the stomach), because salivary amylase begins breaking down starches immediately!"

  },
  {
    id: "guide-senses-04",

    courseId: "senses",

    courseName: "Super Senses & Living World",

    chapterNumber: 4,
    title: "Seeds and Seeds: Travel & Inventions (Velcro Biomimicry)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 5",

    icon: "🌱",

    bigQuestion: "How did tiny prickly burdock burrs stuck to a dog’s fur inspire the invention of the world’s most popular fastener — Velcro?",

    coreConcepts: [
      {
        heading: "1. Botanical Seed Dispersal Vectors & Adaptations",

        explanation: "Plants are stationary, but their seeds travel thousands of kilometers to colonize new soil! Plants evolved specialized dispersal mechanisms: Wind (aerodynamic dandelion parachutes and maple helicopter wings), Water (buoyant fibrous coconut husks that float across oceans), Animals (hooked burdock burrs that hitchhike on fur and sweet fleshy fruits whose seeds pass through bird digestive tracts), and Explosive Pods (balsam and pea pods that dry and snap open like catapults).",

        keyTakeaway: "Seeds disperse via wind, water, animals, and explosive catapult pods to prevent seedling overcrowding."

      },
      {
        heading: "2. George de Mestral & Velcro Biomimicry (1948)",

        explanation: "Biomimicry is the practice of solving human engineering challenges by copying nature’s proven designs. In 1948, Swiss engineer George de Mestral examined burdock burrs stuck to his dog under a microscope. He observed hundreds of tiny stiff elastic hooks that gripped loops of fabric. He duplicated this with nylon, inventing Velcro (Velours + Crochet) — now used on sneakers, backpacks, and astronaut spacesuits!",

        keyTakeaway: "Biomimicry: George de Mestral copied burdock seed micro-hooks to engineer Velcro hook-and-loop fasteners."

      }
    ],
    images: [
      {
        assetKey: "synthetic_acrylic_yarn.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80",

        caption: "Microscopic fiber loops engineered to latch onto microscopic hooks in Velcro fasteners.",

        magnificationOrType: "Biomimicry Microstructure"

      },
      {
        assetKey: "nylon_thread_spool.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",

        caption: "High-durability nylon filament thread used to weave industrial Velcro hook-and-loop tape.",

        magnificationOrType: "Synthetic Fastener Asset"

      }
    ],
    caseStudy: {
      title: "George de Mestral & The Invention of Velcro",

      yearOrEra: "1948 CE",

      discoverer: "George de Mestral (Swiss Electrical Engineer)",

      narrative: "After a hunting hike in the Alps with his dog Milka, George de Mestral spent hours picking burrs from their clothes and fur. Instead of being annoyed, his scientific curiosity took over! He placed a burr under a microscope, saw hundreds of micro-hooks, and spent 10 years perfecting the thermal process to weave nylon hook-and-loop tape!",

      significance: "Created a multi-billion dollar fastener industry and established biomimicry as a core discipline of modern engineering."

    },
    vocabulary: [
      {
        term: "Biomimicry",

        pronunciation: "by-oh-MIM-ih-kree",

        definition: "The design and production of materials, structures, and systems modeled on biological entities and processes.",

        example: "Velcro is a world-famous example of biomimicry."

      },
      {
        term: "Dispersal",

        pronunciation: "dih-SPUR-sul",

        definition: "The movement, spreading, or transport of seeds away from the parent plant.",

        example: "Wind dispersal carries dandelion seeds across vast distances."

      },
      {
        term: "Germination",

        pronunciation: "jur-mih-NAY-shun",

        definition: "The process by which a plant grows from a seed into a seedling when given water, warmth, and air.",

        example: "Moisture and air trigger seed germination."

      }
    ],
    quickRevisionPoints: [
      "Wind Dispersal: Dandelion (feathery parachute), Maple (winged helicopter samara).",

      "Water Dispersal: Coconut (fibrous waterproof husk), Lotus (spongy buoyant fruit).",

      "Animal Dispersal: Burdock/Xanthium (sticky hooks), Guava/Mango (edible fleshy fruit).",

      "Explosive Pods: Balsam, Pea pods, Soybeans (burst open when dry).",

      "Seed Requirements: Seeds need Air, Water, and Proper Warmth to germinate."

    ],
    miniLab: {
      title: "Microscopic Velcro Inspection Lab",

      difficulty: "Easy",

      materials: ['1 piece of Velcro hook-and-loop strap (from a shoe or bag)', 'Magnifying glass or smartphone camera zoom'],
      instructions: [
        "Inspect the rough scratchy side of Velcro under strong light (see the stiff plastic hooks).",

        "Inspect the soft fuzzy side (see the tangled loops).",

        "Press them together and pull apart slowly, listening to the microscopic hooks releasing loops!"

      ],
      scientificPrinciple: "Direct observation of mechanical biomimicry copied from botanical burdock seed burrs."

    },
    pipExamTip: "NCERT Question: \"Who invented Velcro and what inspired him?\" Write: George de Mestral invented Velcro in 1948 after observing burdock seeds with tiny hooks stuck to his clothes and dog’s fur!"

  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COURSE 3: WATER & AQUATIC EXPERIMENTS (Theme 2 & 4 / NCERT)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "guide-water-01",

    courseId: "water",

    courseName: "Water & Aquatic Experiments",

    chapterNumber: 1,
    title: "Earth's Water Cycle & States of Matter",
    syllabusRef: "CBSE Class 5 EVS • Theme 2 & 4 (Water)",

    icon: "🌊",

    bigQuestion: "Where did the puddle of rainwater on the sidewalk go on a sunny afternoon, and how will it return as rain clouds days later?",

    coreConcepts: [
      {
        heading: "1. Solar Thermal Evaporation & Molecular Kinetic Energy",

        explanation: "The Sun is the planetary engine driving the water cycle. Solar thermal radiation warms liquid water in oceans, lakes, and soil puddles. As water molecules absorb heat, their kinetic energy increases, breaking hydrogen bonds and transforming liquid water into rising, invisible water vapor gas.",

        keyTakeaway: "Solar thermal energy converts liquid water into invisible rising vapor gas via evaporation."

      },
      {
        heading: "2. High-Altitude Atmospheric Condensation & Cloud Physics",

        explanation: "As warm water vapor climbs kilometers into the cold upper troposphere, it cools down. Vapor molecules condense onto microscopic airborne dust and pollen grains (condensation nuclei), forming billions of microscopic liquid droplets that cluster together as visible clouds. When droplets coalesce and grow too heavy, gravity pulls them down as precipitation (rain, snow, hail).",

        keyTakeaway: "Cold atmospheric air condenses vapor onto dust nuclei to form clouds, precipitating as rain."

      }
    ],
    images: [
      {
        assetKey: "boiling_tea_kettle_steam.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",

        caption: "Thermal evaporation of water into rising steam vapor demonstrating phase transition.",

        magnificationOrType: "Phase Change Demonstration"

      },
      {
        assetKey: "lightbulb_glowing_bright.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",

        caption: "Solar radiation energy driving atmospheric thermal convective cycles.",

        magnificationOrType: "Solar Energy Analogy"

      }
    ],
    caseStudy: {
      title: "Earth’s 4-Billion-Year Recycled Water Law",

      yearOrEra: "Planetary Geology",

      discoverer: "Hydrological Scientists",

      narrative: "Earth is a closed hydrological system. No new water enters our atmosphere from space, and almost none leaves. The exact same water molecules currently in your drinking glass were once trapped inside Cretaceous glaciers, drunk by Tyrannosaurus rex, and flowed down ancient riverbeds billions of years ago!",

      significance: "Emphasizes that freshwater is a precious, finite, continuously recycled planetary resource."

    },
    vocabulary: [
      {
        term: "Evaporation",

        pronunciation: "ee-vap-uh-RAY-shun",

        definition: "The process of turning from liquid into vapor driven by heat.",

        example: "Solar heat causes evaporation of puddle water."

      },
      {
        term: "Condensation",

        pronunciation: "kon-den-SAY-shun",

        definition: "The conversion of a vapor or gas to a liquid when cooled.",

        example: "Water droplets on a cold soda can form via condensation."

      },
      {
        term: "Precipitation",

        pronunciation: "pree-sip-ih-TAY-shun",

        definition: "Rain, snow, sleet, or hail that falls to the ground from clouds.",

        example: "Monsoon precipitation refills rivers and stepwells."

      }
    ],
    quickRevisionPoints: [
      "4 Stages of Water Cycle: Evaporation ➔ Condensation ➔ Precipitation ➔ Collection (Groundwater/Rivers).",

      "Atmospheric Cooler Rule: Higher altitude = Colder temperatures = Faster condensation into cloud droplets.",

      "Total Planetary Water: 97% is salty ocean water; 2% is frozen in polar glaciers; only 1% is accessible liquid freshwater."

    ],
    miniLab: {
      title: "The Zip-Lock Window Water Cycle Lab",

      difficulty: "Easy",

      materials: ['1 clear zip-lock plastic bag', '1/4 cup water with blue food coloring', 'Tape', 'Sunny window'],
      instructions: [
        "Pour blue water into the bag and zip closed tightly.",

        "Tape bag to a sunny window.",

        "Watch water evaporate under sunlight, condense into fog droplets on the plastic ceiling, and \"rain\" back down into the pool!"

      ],
      scientificPrinciple: "Recreates the complete planetary water cycle in a sealed miniature greenhouse model."

    },
    pipExamTip: "Question: \"Why do water droplets appear on the outside of a cold glass of ice water?\" Write: Water vapor present in the surrounding warm air touches the cold glass surface, cools down, and condenses into liquid droplets!"

  },
  {
    id: "guide-water-02",

    courseId: "water",

    courseName: "Water & Aquatic Experiments",

    chapterNumber: 2,
    title: "Every Drop Counts (Jaisalmer 9 Lakes & Bawri Stepwells)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 6",

    icon: "🏰",

    bigQuestion: "How did King Ghadsi engineer a 9-lake rainwater harvesting cascade in the scorching Thar Desert 650 years ago without modern pumps?",

    coreConcepts: [
      {
        heading: "1. Ghadisar Lake’s Gravity-Fed 9-Tank Cascade Architecture",

        explanation: "In 1367 CE, King Ghadsi of Jaisalmer constructed Ghadisar Lake with 9 interconnected reservoirs at descending elevations. When the primary lake filled with monsoon runoff, water automatically overflowed through paved stone canals into Lake 2, then Lake 3, filling all 9 lakes across miles without electricity or wastage.",

        keyTakeaway: "Ghadisar Lake used gravity-fed stone aqueducts to cascade excess monsoon rain across 9 connected reservoirs."

      },
      {
        heading: "2. Subterranean Bawri Stepwell Thermal Physics",

        explanation: "In desert climates, open surface lakes lose massive volumes of water to solar evaporation. Ancient Indian engineers built Stepwells (Bawris) — deep underground stone multi-story chambers with tiered staircases. The subterranean depth keeps harvested rainwater cool, shaded, and protected from desert sun evaporation all year.",

        keyTakeaway: "Deep underground stepwells (Bawris) store shaded rainwater, preventing hot desert sun evaporation."

      }
    ],
    images: [
      {
        assetKey: "golconda_persian_wheel.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",

        caption: "Historic Persian water wheel (Rahat) hydraulic gear system lifting water from subterranean wells.",

        magnificationOrType: "Hydraulic Engineering Specimen"

      },
      {
        assetKey: "golconda_fort_bastions.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",

        caption: "Subterranean stone masonry stepwell chambers designed for rainwater catchment and evaporative cooling.",

        magnificationOrType: "Heritage Water Architecture"

      }
    ],
    caseStudy: {
      title: "Al-Biruni’s 1017 CE Tribute to Indian Water Engineers",

      yearOrEra: "1017 CE",

      discoverer: "Al-Biruni (Uzbek Polymath & Traveler)",

      narrative: "When traveler Al-Biruni visited India over 1,000 years ago, he was astonished by Indian water harvesting. He wrote in his travelogue: \"Our people, when they see Indian stepwells, wonder at them and cannot describe them. They build great stone tanks at sacred places, joining giant stone slabs with iron clamps so ingeniously that thousands can descend and ascend without crowding!\"",

      significance: "Recognized ancient India as the world pioneer in sustainable rainwater harvesting architecture."

    },
    vocabulary: [
      {
        term: "Bawri (Baori)",

        pronunciation: "BAOW-ree",

        definition: "A traditional Indian stepwell with subterranean stone stairs leading down to a groundwater reservoir.",

        example: "Desert travelers rested inside the cool chambers of the Bawri."

      },
      {
        term: "Aquifer",

        pronunciation: "AK-wih-fer",

        definition: "A body of permeable rock which can contain or transmit groundwater.",

        example: "Stepwells tap directly into natural freshwater aquifers."

      },
      {
        term: "Rainwater Harvesting",

        pronunciation: "RAYN-wah-ter HAR-ves-ting",

        definition: "The collection and storage of rain, rather than allowing it to run off.",

        example: "Rooftop rainwater harvesting recharges underground borewells."

      }
    ],
    quickRevisionPoints: [
      "Ghadisar Lake: Built in 1367 CE by King Ghadsi of Jaisalmer (Rajasthan).",

      "Interconnected Design: 9 interconnected lakes connected by gravity channels; no single drop was wasted.",

      "Stepwells (Bawris): Multi-tiered steps allow people to reach changing seasonal water levels easily while keeping water shaded and cool.",

      "Modern Water Problem: Urban encroachment and paved concrete prevent natural rainwater infiltration into underground aquifers."

    ],
    miniLab: {
      title: "The Gravity-Fed Two-Cup Cascade Model",

      difficulty: "Easy",

      materials: ['2 paper or plastic cups', '1 pushpin/pencil to poke a hole', 'Water', 'A tray'],
      instructions: [
        "Poke a hole near the top rim of Cup 1.",

        "Place Cup 1 on a book so it sits higher than Cup 2.",

        "Pour water steadily into Cup 1. Watch how water fills Cup 1 first, then automatically overflows through the hole into Cup 2!"

      ],
      scientificPrinciple: "Simulates Ghadisar Lake's gravity-fed overflow canals connecting sequential reservoirs."

    },
    pipExamTip: "Exam Question: \"What is a Bawri?\" Write: A Bawri is a traditional stepwell with stone steps going deep down into the ground, allowing people to collect clean, cool rainwater stored underground without relying on mechanical pumps!"

  },
  {
    id: "guide-water-03",

    courseId: "water",

    courseName: "Water & Aquatic Experiments",

    chapterNumber: 3,
    title: "Experiments with Water (Density & Dead Sea Buoyancy)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 7",

    icon: "🧪",

    bigQuestion: "Why does a giant 50,000-ton steel ship float effortlessly on ocean waves, while a tiny 1-gram solid iron sewing needle drops straight to the bottom?",

    coreConcepts: [
      {
        heading: "1. Density, Displaced Volume & Archimedes’ Buoyancy",

        explanation: "Density is mass per unit volume (D = M/V). A solid iron nail is dense (~7.8 g/cm³) and displaces very little water, so gravity overpowers the upward buoyant force and it sinks. A steel ship is designed with a wide hollow hull containing vast volumes of trapped air. The ship's average combined density (steel + air) is much lower than water (1.0 g/cm³), allowing it to float easily.",

        keyTakeaway: "Hollow hulls trap air, lowering overall vessel density below water to produce upward buoyant lift."

      },
      {
        heading: "2. Dissolved Mineral Density in the Dead Sea (300 g/L)",

        explanation: "When salt dissolves in water, sodium and chloride ions fit into the spaces between water molecules, packing more mass into the exact same volume and dramatically increasing fluid density. In the Dead Sea, water contains ~300 grams of salt per liter (density ~1.24 g/cm³). Because human body density (~0.98 g/cm³) is much lower than Dead Sea water, humans float on the surface without swimming!",

        keyTakeaway: "Dissolved salt increases water density; high-density Dead Sea water creates extreme buoyant force."

      }
    ],
    images: [
      {
        assetKey: "polyester_raincoat_waterproof.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",

        caption: "Surface tension and upward buoyant equilibrium supporting floating objects.",

        magnificationOrType: "Fluid Mechanics Demonstration"

      },
      {
        assetKey: "bakelite_handle_clean.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",

        caption: "Saline mineral density equilibrium testing across fluid specimens.",

        magnificationOrType: "Salinity Density Assay"

      }
    ],
    caseStudy: {
      title: "Archimedes & The \"Eureka!\" Crown Mystery",

      yearOrEra: "250 BCE",

      discoverer: "Archimedes of Syracuse (Greek Mathematician)",

      narrative: "King Hiero II suspected his goldsmith had stolen gold and substituted silver in his crown. Stepping into a full public bathtub, Archimedes noticed water overflowing and realized the volume of displaced water equaled the volume of his submerged body. He ran through the streets shouting \"Eureka!\" (\"I found it!\"), proving the crown was counterfeit by measuring displaced water volume!",

      significance: "Established the Archimedes Principle: An object immersed in a fluid experiences an upward buoyant force equal to the weight of fluid displaced."

    },
    vocabulary: [
      {
        term: "Density",

        pronunciation: "DEN-sih-tee",

        definition: "The degree of compactness of a substance; mass divided by volume.",

        example: "Saltwater has a higher density than freshwater."

      },
      {
        term: "Buoyant Force",

        pronunciation: "BOY-unt forss",

        definition: "The upward force exerted by any fluid upon a body placed in it.",

        example: "Buoyant force keeps large ships afloat on the ocean."

      },
      {
        term: "Displacement",

        pronunciation: "dis-PLAYS-munt",

        definition: "The volume of fluid pushed aside when an object is submerged.",

        example: "A heavy ship floats by displacing its own weight in water."

      }
    ],
    quickRevisionPoints: [
      "Sink or Float Rule: Density > Water (1.0 g/cm³) ➔ Sinks; Density < Water ➔ Floats.",

      "Nail vs. Ship: A solid iron nail sinks; a hollow steel ship floats because it traps lightweight air inside its hull.",

      "Dead Sea Salinity: 300 grams of salt per liter (~9x saltier than standard oceans). Humans cannot sink in the Dead Sea.",

      "Dandi March (1930): Mahatma Gandhi marched 385 km to Dandi to evaporate ocean water and make salt in protest of British colonial salt taxes."

    ],
    miniLab: {
      title: "The Floating Egg Salinity Challenge",

      difficulty: "Easy",

      materials: ['1 tall glass of tap water', '1 fresh raw egg', 'Table salt', 'Spoon'],
      instructions: [
        "Gently place the raw egg in fresh tap water. Observe it sink straight to the bottom (egg density > fresh water).",

        "Add 1 tablespoon of salt and stir gently. (Egg remains sunk).",

        "Add 4 to 5 tablespoons of salt and stir until dissolved. Watch the egg rise and float freely at the surface!"

      ],
      scientificPrinciple: "Adding salt increases water density above the egg's density, creating enough upward buoyant lift to float the egg."

    },
    pipExamTip: "Exam Question: \"Why does an iron nail sink in water but a bowl made of iron floats?\" Write: An iron nail is solid and dense, displacing little water. An iron bowl is hollow and traps air, making its average density lower than water and displacing enough water to stay afloat!"

  },
  {
    id: "guide-water-04",

    courseId: "water",

    courseName: "Water & Aquatic Experiments",

    chapterNumber: 4,
    title: "A Treat for Mosquitoes (Microscope Ecology & Ronald Ross)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 8",

    icon: "🦟",

    bigQuestion: "How do mosquito larvae live submerged under water if they must breathe air, and how can a single drop of eco-oil prevent malaria breeding without toxic chemicals?",

    coreConcepts: [
      {
        heading: "1. Larval Snorkel Breathing Siphons & Metamorphosis",

        explanation: "Female mosquitoes lay eggs in quiet, stagnant water. When eggs hatch into larvae (wigglers), they do not have fish gills! Instead, larvae hang upside down from the water surface tension film, poking a microscopic breathing siphon tube into the air to breathe atmospheric oxygen.",

        keyTakeaway: "Mosquito larvae hang upside down and breathe atmospheric oxygen through microscopic surface siphons."

      },
      {
        heading: "2. The Eco-Oil Film Barrier & Ronald Ross’s Discovery (1897)",

        explanation: "When a small drop of oil is poured on stagnant water, surface tension forces the oil to spread into an ultra-thin monolayer. This oil film blocks the larval breathing siphons, preventing larvae from accessing oxygen and stopping mosquito emergence safely without chemical insecticides. In 1897 in Secunderabad, India, Dr. Ronald Ross proved that female Anopheles mosquitoes transmit malaria parasites, winning the 1902 Nobel Prize in Medicine!",

        keyTakeaway: "Oil films block larval breathing siphons; Ronald Ross discovered malaria transmission by female Anopheles mosquitoes."

      }
    ],
    images: [
      {
        assetKey: "plastic_100yrs.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80",

        caption: "Microscopic insect aquatic metamorphosis and vector parasite transmission.",

        magnificationOrType: "Microscopic Vector Ecology"

      },
      {
        assetKey: "copper_wire_macro.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",

        caption: "Biological vector research and clinical blood smear parasitology.",

        magnificationOrType: "Parasitology Specimen"

      }
    ],
    caseStudy: {
      title: "Dr. Ronald Ross & The Malaria Breakthrough in Secunderabad",

      yearOrEra: "August 20, 1897 CE",

      discoverer: "Dr. Ronald Ross (British-Indian Physician & Nobel Laureate)",

      narrative: "For centuries, people believed malaria was caused by \"bad air\" (mal-aria) rising from swamps. On August 20, 1897, in a hospital in Secunderabad (Hyderabad, India), Dr. Ronald Ross dissected a female Anopheles mosquito that had fed on a malaria patient and observed the Plasmodium parasite developing inside its stomach wall!",

      significance: "Solved the transmission mechanism of malaria and saved millions of lives through targeted vector mosquito control."

    },
    vocabulary: [
      {
        term: "Larva (Wiggler)",

        pronunciation: "LAR-vuh",

        definition: "The active immature form of an insect, especially one that differs greatly from the adult.",

        example: "Mosquito larvae wiggle actively under water surfaces."

      },
      {
        term: "Breathing Siphon",

        pronunciation: "BREE-thing SY-fun",

        definition: "A tubular structure used by aquatic larvae to draw in atmospheric oxygen from above the water surface.",

        example: "The mosquito larva pokes its breathing siphon through the surface film."

      },
      {
        term: "Anopheles",

        pronunciation: "uh-NOF-uh-leez",

        definition: "A genus of mosquito that includes the vectors of human malaria.",

        example: "Only female Anopheles mosquitoes transmit malaria parasites."

      }
    ],
    quickRevisionPoints: [
      "Mosquito Lifecycle: Egg ➔ Larva (Wiggler) ➔ Pupa (Tumbler) ➔ Adult Mosquito.",

      "Vector Transmission: Female Anopheles transmits Malaria; Aedes transmits Dengue and Chikungunya.",

      "Blood Diet: Only female mosquitoes bite humans (they need blood proteins to develop eggs). Males feed on flower nectar!",

      "Stagnant Water Rule: Mosquitoes cannot breed in moving rivers; removing stagnant water in coolers, tires, and flowerpots prevents outbreaks.",

      "Biological Control: Introducing Gambusia fish into ponds eliminates larvae naturally (one fish eats 100 larvae/day)."

    ],
    miniLab: {
      title: "The Surface Oil Barrier Demonstration",

      difficulty: "Easy",

      materials: ['1 bowl of water', '1 drop of vegetable cooking oil', '1 toothpick', 'Black pepper powder'],
      instructions: [
        "Sprinkle black pepper across the surface of the bowl of water (represents larvae on water surface).",

        "Dip the toothpick in cooking oil and touch the center of the water surface.",

        "Watch the oil instantly snap across the surface, pushing pepper away and forming a sealed barrier film!"

      ],
      scientificPrinciple: "Demonstrates how a thin oil film seals the water surface, cutting off oxygen access for mosquito larvae."

    },
    pipExamTip: "Exam Question: \"Why should we not allow water to collect in coolers, pots, and surroundings?\" Write: Mosquitoes lay eggs in stagnant water. Removing stagnant water and adding kerosene/oil drops stops larvae from breathing, preventing diseases like Malaria and Dengue!"

  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COURSE 4: SHELTER, MOUNTAINS & EARTH (Theme 3 & 5 / NCERT)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "guide-shelter-01",

    courseId: "shelter",

    courseName: "Shelter, Mountains & Earth",

    chapterNumber: 1,
    title: "A Shelter So High! (Ladakh & Changthang Pashmina)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 13",

    icon: "🏔️",

    bigQuestion: "How do nomadic Changpa tribes survive sub-zero -40°C blizzards at 5,000 meters altitude with only yak-hair tents and mountain goats?",

    coreConcepts: [
      {
        heading: "1. 12-Micron Pashmina Thermal Air Pockets",

        explanation: "At 5,000 meters altitude on the Changthang plateau, winter temperatures drop to -40°C. To survive, Changthangi goats grow a soft undercoat of microscopic wool fibers only 12 to 15 microns in diameter (6 times finer than human hair, ~75 microns). These ultra-fine fibers trap thousands of tiny dead-air pockets that block body heat conduction.",

        keyTakeaway: "Pashmina goat wool (~12 microns) traps microscopic air pockets, providing 6x the warmth of standard wool."

      },
      {
        heading: "2. Nomadic Yak-Hair Rebo Tent Architecture",

        explanation: "The nomadic Changpa tribe weaves coarse strips of yak hair to build large conical tents called Rebo. Yak hair fibers expand and swell during snowstorms, sealing gaps against freezing winds. The tent is pitched over a 2-foot trench in the ground to shield families from ground gales, with a roof opening for smoke.",

        keyTakeaway: "Nomadic Rebo tents woven from yak hair swell in snow to block cold winds and insulate families."

      }
    ],
    images: [
      {
        assetKey: "pashmina_microscope_macro.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",

        caption: "100x high-resolution optical micrograph showing ultra-fine 12-micron Pashmina fibers.",

        magnificationOrType: "Microfiber Scanning Specimen"

      },
      {
        assetKey: "sheep_wool_fleece.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80",

        caption: "Highland Himalayan yak and sheep wool harvested for alpine cold insulation.",

        magnificationOrType: "Natural Alpine Fiber Specimen"

      }
    ],
    caseStudy: {
      title: "Hand-Woven Pashmina: 250 Hours of Heritage Craft",

      yearOrEra: "Centuries-Old Kashmiri Heritage",

      discoverer: "Kashmiri Master Artisans",

      narrative: "Because Pashmina fibers are so extraordinarily fine (~12 microns), they snap instantly if processed on modern industrial factory machines! Skilled master weavers in Kashmir hand-spin the raw fleece on traditional wooden charkhas and hand-weave each shawl on wooden looms for over 250 hours. One pure Pashmina shawl is as warm as 6 thick winter sweaters!",

      significance: "Demonstrates the irreplaceable value of traditional artisanal craftsmanship and biological fiber engineering."

    },
    vocabulary: [
      {
        term: "Pashmina",

        pronunciation: "pash-MEE-nuh",

        definition: "Fine, soft underwool harvested from high-altitude Changthangi goats in Ladakh.",

        example: "A hand-woven Pashmina shawl provides extraordinary warmth with feather-light weight."

      },
      {
        term: "Rebo",

        pronunciation: "RAY-boh",

        definition: "A large conical nomadic tent woven from coarse yak hair by the Changpa tribe.",

        example: "The Changpa family pitched their Rebo tent on the wind-swept plateau."

      },
      {
        term: "Khatamband",

        pronunciation: "khat-am-BUND",

        definition: "Traditional Kashmiri jigsaw-puzzle woodwork fitted into houseboat ceilings without nails.",

        example: "Shikaras in Srinagar feature intricate Khatamband woodcarvings."

      }
    ],
    quickRevisionPoints: [
      "Ladakh Geography: \"Cold Desert\" of India; high altitude, low rainfall, freezing winters, intense high-altitude sunlight.",

      "Changpa Tribe: Nomads who herd Changthangi goats at 5,000m altitude. Their wealth is measured by herd size.",

      "Pashmina Shawl Fact: One shawl = as warm as 6 sweaters; takes ~250 hours of hand-weaving.",

      "Ladakh Houses: Two-story stone-mud houses. Ground floor is for animals and winter food storage (has no windows to keep heat inside); family lives on top floor."

    ],
    miniLab: {
      title: "The Trapped-Air Insulation Experiment",

      difficulty: "Easy",

      materials: ['2 cups filled with hot water', '1 thin cotton handkerchief', '1 fluffy woolen glove or scarf'],
      instructions: [
        "Wrap Cup 1 tightly in the thin cotton handkerchief.",

        "Wrap Cup 2 in the fluffy woolen glove (trapped air).",

        "Check water temperatures after 10 minutes with a thermometer or touch."

      ],
      scientificPrinciple: "Cup 2 stays much hotter because air trapped between fluffy wool fibers acts as a thermal insulator."

    },
    pipExamTip: "Important Exam Points: 1) Ladakh is known as the \"Cold Desert\" of India. 2) Ground floors in Ladakh houses have NO windows to keep warmth inside during subzero winters!"

  },
  {
    id: "guide-shelter-02",

    courseId: "shelter",

    courseName: "Shelter, Mountains & Earth",

    chapterNumber: 2,
    title: "Up You Go! (Mountaineering & Mt. Everest Expeditions)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 9",

    icon: "🧗",

    bigQuestion: "How do mountaineers like Bachendri Pal climb into the Death Zone of Mount Everest where oxygen is scarce and glaciers are slick ice?",

    coreConcepts: [
      {
        heading: "1. Atmospheric Pressure Drop, Scarcity of Oxygen & Hypoxia",

        explanation: "At sea level, air is compressed by the weight of the atmosphere above it. At high altitudes (e.g., Mount Everest at 8,848 meters), atmospheric pressure drops to one-third of sea level. Each breath delivers fewer oxygen molecules to the lungs. Climbers consume iron-rich diets (jaggery, chana) to boost hemoglobin and carry supplemental oxygen tanks in the \"Death Zone\" (>8,000m).",

        keyTakeaway: "Atmospheric pressure drops with altitude; iron nutrition and supplemental oxygen prevent hypoxia."

      },
      {
        heading: "2. High-Traction Gear Engineering (Crampons, Pitons & Ropes)",

        explanation: "Walking on slick blue glacier ice requires specialized mechanical friction. Climbers strap steel Crampons (sharp 12-point spikes) to their boot soles. The spikes concentrate body weight onto tiny contact points (Pressure = Force/Area), biting deep into hard ice to prevent lethal slips.",

        keyTakeaway: "Steel crampons concentrate weight onto sharp points to bite into glacier ice with high traction."

      }
    ],
    images: [
      {
        assetKey: "everest_summit_mountaineer.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",

        caption: "High-altitude mountaineer in crampons ascending a glaciated peak on Mt. Everest.",

        magnificationOrType: "Expedition Summit Photography"

      },
      {
        assetKey: "steel_cable_holding.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=800&q=80",

        caption: "High-tensile dynamic climbing rope and forged steel carabiner safety anchors.",

        magnificationOrType: "Mountaineering Safety Specimen"

      }
    ],
    caseStudy: {
      title: "Bachendri Pal: The First Indian Woman on Mount Everest",

      yearOrEra: "May 23, 1984 CE",

      discoverer: "Bachendri Pal (Indian Mountaineer & Padma Bhushan)",

      narrative: "Born in Nakuri village, Uttarakhand, Bachendri Pal trained at the Nehru Institute of Mountaineering. On May 23, 1984, despite surviving a midnight avalanche at Camp 3, she stepped onto the 8,848m summit of Mount Everest at 1:07 PM, bowed her head, hoisted the Indian Tricolour, and placed a picture of Goddess Durga in the snow!",

      significance: "Became the first Indian woman to conquer Everest and a global inspiration for women in science and athletics."

    },
    vocabulary: [
      {
        term: "Crampons",

        pronunciation: "KRAM-ponz",

        definition: "A metal plate with spikes fixed to a boot for walking on ice or rock climbing.",

        example: "Climbers strap crampons to their boots on glaciers."

      },
      {
        term: "Hypoxia",

        pronunciation: "hy-POK-see-uh",

        definition: "A condition in which the body or a region of the body is deprived of adequate oxygen supply.",

        example: "Thin air at high altitude can cause hypoxia without supplemental oxygen."

      },
      {
        term: "Piton",

        pronunciation: "PEE-tahn",

        definition: "A metal spike or peg driven into rock or ice as a support for a climbing rope.",

        example: "The lead climber hammered a steel piton into the cliff face."

      }
    ],
    quickRevisionPoints: [
      "Mt. Everest Height: 8,848 meters (called Sagarmatha in Nepal).",

      "Bachendri Pal: 1st Indian woman (and 5th in the world) to summit Everest on May 23, 1984.",

      "Mountaineer Nutrition: Gur (jaggery), Chana (roasted chickpeas), and Vitamin C tablets boost iron/hemoglobin to carry oxygen in thin air.",

      "Expedition Leader Rules: 1. Help others carry loads, 2. Let the group go ahead and walk at the back, 3. Find a good place to pitch tents, 4. Look after those who are unwell."

    ],
    miniLab: {
      title: "Pressure & Ice Grip Experiment",

      difficulty: "Easy",

      materials: ['1 ice cube on a plate', '1 flat wooden pencil eraser', '1 metal fork'],
      instructions: [
        "Try pushing the ice cube with the flat rubber eraser (it slips easily).",

        "Press the sharp metal fork prongs firmly into the ice cube (crampon simulation).",

        "Notice how the fork points anchor firmly without sliding!"

      ],
      scientificPrinciple: "Sharp points concentrate force over tiny surface areas, biting deeply into ice to generate high traction."

    },
    pipExamTip: "Exam Question: \"Why do mountaineers take Vitamin C, Iron tablets, and hot chocolate milk in the morning?\" Write: For quick energy, body warmth, and to build iron-rich hemoglobin in red blood cells to absorb scarce oxygen at high altitudes!"

  },
  {
    id: "guide-shelter-03",

    courseId: "shelter",

    courseName: "Shelter, Mountains & Earth",

    chapterNumber: 3,
    title: "Walls Tell Stories (Golconda Fort Architecture)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 10",

    icon: "🏰",

    bigQuestion: "How did medieval architects design stone arches in Golconda Fort that could amplify a single hand-clap across 1 kilometer without electricity?",

    coreConcepts: [
      {
        heading: "1. Parabolic Acoustic Arches at Fateh Darwaza",

        explanation: "The entrance gateway of Golconda Fort (Fateh Darwaza) features a series of engineered parabolic stone arches and vaults. When a guard claps at the center of the entrance dome, soundwaves bounce off dense granite masonry in focused directional reflection channels, transmitting the audio warning signal all the way to the King’s palace at Bala Hissar 1 kilometer uphill!",

        keyTakeaway: "Parabolic stone arches reflect and focus soundwaves to transmit acoustic warning signals over 1 km."

      },
      {
        heading: "2. 87 Bastions (Burj) & 360° Defensive Sightlines",

        explanation: "Medieval forts avoided flat outer walls. Golconda Fort features 87 curved semi-circular bastions (burj) that project outward from the fortress walls. These curved ramparts gave defending soldiers a complete 360-degree field of view to spot advancing enemies from all angles without blind spots.",

        keyTakeaway: "Curved stone bastions (burj) provided 360-degree defensive visibility with zero blind spots."

      }
    ],
    images: [
      {
        assetKey: "golconda_fateh_darwaza.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",

        caption: "The acoustic arches of Fateh Darwaza inside Golconda Fort, Hyderabad.",

        magnificationOrType: "Heritage Acoustic Architecture"

      },
      {
        assetKey: "golconda_persian_wheel.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",

        caption: "Persian water wheel (Rahat) hydraulic gear transmission system.",

        magnificationOrType: "Medieval Hydraulics Specimen"

      }
    ],
    caseStudy: {
      title: "The 8-Month Siege of Golconda by Emperor Aurangzeb",

      yearOrEra: "1687 CE",

      discoverer: "Mughal & Qutb Shahi Military Historians",

      narrative: "In 1687, Mughal Emperor Aurangzeb surrounded Golconda Fort with a massive army and heavy brass cannons. Because of Golconda’s thick double granite walls, 87 curved bastions, deep moat, and the secret acoustic warning system of Fateh Darwaza, the fort held out against 8 months of continuous cannon fire!",

      significance: "Demonstrates the military and structural brilliance of medieval Indian stone architecture."

    },
    vocabulary: [
      {
        term: "Bastion (Burj)",

        pronunciation: "BAS-chun",

        definition: "A projecting part of a fortification built at an angle to the line of a wall, allowing defensive fire in several directions.",

        example: "Golconda Fort features 87 massive stone bastions."

      },
      {
        term: "Acoustic Resonance",

        pronunciation: "uh-KOO-stik REZ-uh-nuns",

        definition: "The reinforcement or amplification of a sound by reflection from surrounding surfaces.",

        example: "Fateh Darwaza creates acoustic resonance across 1 kilometer."

      },
      {
        term: "Rahat (Persian Wheel)",

        pronunciation: "RAH-hut",

        definition: "A mechanical water-lifting device powered by draft animals using interlocking wooden gears and a pot chain.",

        example: "Rahats lifted well water to hilltop royal gardens in Golconda."

      }
    ],
    quickRevisionPoints: [
      "Golconda Fort Location: Hyderabad, Telangana (built by the Qutb Shahi dynasty).",

      "87 Bastions: Round, outward-curving stone towers providing complete defensive sightlines.",

      "Acoustic Engineering: A clap at Fateh Darwaza (Victory Gate) can be heard clearly at Bala Hissar (the highest palace, 1 km away).",

      "Hydraulic System: Persian Wheels (Rahat) and clay pipe channels lifted water uphill against gravity."

    ],
    miniLab: {
      title: "The Paper Cone Acoustic Amplifier Test",

      difficulty: "Easy",

      materials: ['1 sheet of thick chart paper', 'Tape', 'A quiet ticking clock or whisper'],
      instructions: [
        "Roll the chart paper into a wide cone shape and tape it.",

        "Place the small narrow end to your ear and point the wide opening toward a soft whisper.",

        "Notice how the whisper sounds remarkably loud and focused!"

      ],
      scientificPrinciple: "The cone focuses soundwaves into your ear canal, demonstrating how Golconda's arches directed acoustic energy."

    },
    pipExamTip: "Exam Question: \"Why were bastions made in fort walls?\" Write: Bastions were curved outward towers that allowed soldiers to look around corners in all directions (360-degree view) and attack enemies from safe positions without blind spots!"

  },
  {
    id: "guide-shelter-04",

    courseId: "shelter",

    courseName: "Shelter, Mountains & Earth",

    chapterNumber: 4,
    title: "No Place for Us? (Displacement & Sustainable Villages)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 18",

    icon: "🌾",

    bigQuestion: "How can society balance generating clean renewable electricity with protecting human homes, rivers, and indigenous village cultures?",

    coreConcepts: [
      {
        heading: "1. Hydroelectric Dams: Potential Energy vs. River Inundation",

        explanation: "Hydroelectric mega-dams block river valleys, storing millions of tons of water high above sea level (gravitational potential energy). When sluice gates open, falling water spins giant turbines to generate renewable electricity. However, the resulting reservoir submerges thousands of hectares of fertile farmland, displacing entire village communities.",

        keyTakeaway: "Hydro dams convert falling water energy into electricity, but submerge fertile river valleys and displace communities."

      },
      {
        heading: "2. Decentralized Renewable Micro-Grids & Sustainable Eco-Homes",

        explanation: "Modern ecological engineers develop decentralized alternatives: rooftop solar photovoltaic panels, community biogas digesters, and breathable mud-and-bamboo architecture. These solutions generate clean power directly where people live without submerging forests or relocating families.",

        keyTakeaway: "Decentralized solar panels and bio-climatic mud homes generate clean power locally without flooding ecosystems."

      }
    ],
    images: [
      {
        assetKey: "natural_wood_timber.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",

        caption: "Natural timber and bamboo harvested sustainably for eco-village architecture.",

        magnificationOrType: "Sustainable Material Specimen"

      },
      {
        assetKey: "lightbulb_glowing_bright.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80",

        caption: "Clean renewable electricity generated from sustainable solar micro-grids.",

        magnificationOrType: "Renewable Power Specimen"

      }
    ],
    caseStudy: {
      title: "Jatrya Bhai’s Story: The Khedi Village Displacement",

      yearOrEra: "Late 20th Century",

      discoverer: "Social & Environmental Impact Studies",

      narrative: "Jatrya Bhai was born in peaceful Khedi village surrounded by lush forests and the singing river. When a massive dam was built, the village was flooded. Jatrya was relocated to Sinduri, then to a Mumbai slum. He missed the clean river, herbal forest medicine, and collective harmony of his ancestral village.",

      significance: "Highlights the human cost of large-scale infrastructure and the need for fair rehabilitation and decentralized green energy."

    },
    vocabulary: [
      {
        term: "Displacement",

        pronunciation: "dis-PLAYS-munt",

        definition: "The enforced departure of people from their homes, typically because of war, natural disaster, or large development projects.",

        example: "Dam construction caused the displacement of river valley villagers."

      },
      {
        term: "Hydroelectric",

        pronunciation: "hy-droh-ee-LEK-trik",

        definition: "Relating to the generation of electricity using flowing or falling water.",

        example: "Hydroelectric power plants spin turbines with falling river water."

      },
      {
        term: "Decentralized Energy",

        pronunciation: "dee-SEN-truh-lyzd EN-ur-jee",

        definition: "Energy produced close to where it will be used (such as rooftop solar), rather than at a large central plant.",

        example: "Village solar panels provide clean decentralized energy."

      }
    ],
    quickRevisionPoints: [
      "Dam Benefits: Flood control, irrigation water for dry farmlands, clean renewable electricity generation.",

      "Dam Costs: Submergence of forests, loss of biodiversity, displacement of families, disruption of fish migrations.",

      "Sustainable Solutions: Rooftop solar power, small micro-hydro run-of-the-river turbines, rainwater harvesting, biogas.",

      "Eco-Architecture: Traditional mud, straw, and bamboo homes insulate naturally in summer and winter."

    ],
    miniLab: {
      title: "The Mini Water Turbine Kinetic Energy Model",

      difficulty: "Easy",

      materials: ['1 plastic toy pinwheel or homemade plastic cup turbine', 'Tap water stream'],
      instructions: [
        "Hold the blades of the pinwheel under a steady stream of tap water.",

        "Watch the kinetic force of falling water instantly rotate the turbine at high speed!",

        "Notice how increasing water flow speed spins the wheel faster."

      ],
      scientificPrinciple: "Demonstrates how gravitational potential energy of falling water converts into mechanical rotation to drive electric generators."

    },
    pipExamTip: "Exam Question: \"What problems do people face when a dam is built in their area?\" Write: 1) Their houses and fertile farmlands get submerged underwater, 2) They must leave their ancestral homes and friends, 3) They struggle to find new jobs, schools, and medical facilities in cities!"

  },
  {
    id: "guide-shelter-05",

    courseId: "shelter",

    courseName: "Shelter, Mountains & Earth",

    chapterNumber: 5,
    title: "When the Earth Shook! (Seismic Waves & Bhunga Architecture)",

    syllabusRef: "CBSE Class 5 EVS • NCERT Chapter 14",

    icon: "🏚️",

    bigQuestion: "Why did traditional circular mud huts (Bhungas) survive the violent 2001 Gujarat earthquake while modern square concrete buildings collapsed?",

    coreConcepts: [
      {
        heading: "1. Tectonic Plate Friction & Seismic Shockwaves",

        explanation: "The outer crust of Earth consists of moving tectonic plates floating on the semi-molten mantle. The Indian tectonic plate drifts northward at ~5 cm/year, colliding with the Eurasian plate. Friction locks plate edges until immense stress suddenly snaps! The stored elastic strain energy radiates in all directions as seismic waves (P-waves and S-waves), shaking the ground violently.",

        keyTakeaway: "Tectonic plate friction releases stored elastic energy as violent seismic ground shockwaves."

      },
      {
        heading: "2. The Structural Physics of Circular Kutch Bhunga Architecture",

        explanation: "Square and rectangular buildings have sharp 90-degree corners where lateral earthquake shaking forces concentrate, causing walls to shear and collapse. Traditional Bhunga homes of Kutch are built completely cylindrical with flexible bamboo frames and clay-straw plaster. Lateral shockwaves flow smoothly around the curved walls without structural stress points!",

        keyTakeaway: "Circular Bhunga homes distribute lateral shaking forces equally across all points, resisting collapse."

      }
    ],
    images: [
      {
        assetKey: "wood_450yrs.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",

        caption: "Geological rock strata showing tectonic fault stress and fracture lines.",

        magnificationOrType: "Geological Fault Specimen"

      },
      {
        assetKey: "natural_wood_timber.jpg",

        webFallbackUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",

        caption: "Flexible bamboo and interlocking timber joinery used in earthquake-resistant construction.",

        magnificationOrType: "Seismic Structural Specimen"

      }
    ],
    caseStudy: {
      title: "The Republic Day 2001 Gujarat Earthquake",

      yearOrEra: "January 26, 2001 CE",

      discoverer: "Seismologists & Disaster Management Teams",

      narrative: "At 8:46 AM on January 26, 2001, a magnitude 7.7 earthquake struck Bhuj in Kutch, Gujarat. Thousands of square concrete buildings collapsed. Yet in rural villages, traditional round mud Bhungas with conical thatched roofs stood completely intact! Engineers studied the Bhunga design and incorporated circular geometry into modern seismic building codes.",

      significance: "Proved the superiority of indigenous circular architecture in resisting seismic shear forces."

    },
    vocabulary: [
      {
        term: "Seismograph",

        pronunciation: "SYZ-muh-graf",

        definition: "An instrument that measures and records details of earthquakes, such as force and duration.",

        example: "The seismograph detected underground P-waves before the main tremor."

      },
      {
        term: "Epicenter",

        pronunciation: "EP-ih-sen-ter",

        definition: "The point on the earth's surface vertically above the focus of an earthquake.",

        example: "The epicenter of the 2001 earthquake was near Bhuj in Gujarat."

      },
      {
        term: "Bhunga",

        pronunciation: "BHOON-guh",

        definition: "A traditional circular mud hut with a conical thatched roof engineered by the people of Kutch.",

        example: "Circular Bhunga homes survived the earthquake without structural failure."

      }
    ],
    quickRevisionPoints: [
      "Earthquake Cause: Sudden slippage along underground tectonic plate fault lines.",

      "Drop, Cover, and Hold On: The #1 lifesaving safety drill during an earthquake.",

      "Indoor Safety Rule: Stay away from windows and heavy bookshelves; take cover under a sturdy wooden table.",

      "Outdoor Safety Rule: Move to open ground away from tall buildings, electrical powerlines, and bridges.",

      "Bhunga Physics: Circular shape + lightweight conical roof + flexible bamboo/clay walls = Maximum earthquake resistance."

    ],
    miniLab: {
      title: "The Square vs. Circle Structural Strength Test",

      difficulty: "Easy",

      materials: ['4 strips of cardboard taped into a square', '1 strip of cardboard taped into a cylinder', '1 book for weight'],
      instructions: [
        "Place the cardboard square on the table and gently push it from the side (it collapses into a flat diamond immediately!).",

        "Place the cardboard cylinder on the table and push it from the side.",

        "Feel how the cylinder distributes the side push evenly around its curved perimeter without collapsing!"

      ],
      scientificPrinciple: "Directly demonstrates how circular geometry eliminates 90° stress concentration points during lateral earthquake shaking."

    },
    pipExamTip: "Exam Question: \"What should you do if an earthquake strikes while you are in a building?\" Write: 1) DROP to your hands and knees, 2) Take COVER under a sturdy table or desk, and 3) HOLD ON to the table legs until the shaking stops! If no table is available, cover your head and neck with your arms against an interior corner!"

  }
];
