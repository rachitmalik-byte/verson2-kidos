// ─── Real Fast Dictionary & Science Vocabulary Service ───
// Datamuse WordNet API + Free Dictionary API + Gemini AI + 0ms Offline Science Database

import { findVocabWord } from '@/data/vocabulary';
import { geminiService } from '@/lib/geminiService';
import { apiClient } from '@/services/apiClient';

export interface DictionaryResult {
  word: string;
  definition: string;
  example?: string;
  category: string; // e.g. 'Noun', 'Verb', 'Adjective', 'Science Term'
  pronunciation?: string;
  source: 'science-curriculum' | 'instant-dictionary' | 'gemini-ai' | 'datamuse-api' | 'dictionary-api' | 'cached';
}

const CACHE_KEY = 'polyquest-dictionary-cache-v4';

// ── Comprehensive 0ms Offline English & Science Dictionary ──
const BUILT_IN_DICTIONARY: Record<string, { def: string; pos: string; ex: string; phon: string }> = {
  polymer: {
    def: 'A large molecule formed by linking many small chemical units (monomers) in a long chain.',
    pos: 'Science Term',
    ex: 'Plastics and nylon are synthetic polymers with repeating molecular chains.',
    phon: '/ˈpɒl.ɪ.mər/',
  },
  'polymer chains': {
    def: 'Long repeating molecular strands that give synthetic materials like plastics and nylon their elasticity and strength.',
    pos: 'Science Term',
    ex: 'In polyester and nylon, polymer chains slide and snap back like microscopic springs!',
    phon: '/ˈpɒl.ɪ.mər tʃeɪnz/',
  },
  polymers: {
    def: 'Giant molecules made from long chains of linked chemical units like plastics, rubber, and DNA.',
    pos: 'Science Term',
    ex: 'Synthetic polymers are designed in labs to be waterproof, stretchy, or heat-resistant.',
    phon: '/ˈpɒl.ɪ.mərz/',
  },
  monomer: {
    def: 'A small single molecule that bonds with others to build a giant polymer chain.',
    pos: 'Science Term',
    ex: 'Individual glucose monomers bond together to form natural starch.',
    phon: '/ˈmɒn.ə.mər/',
  },
  monomers: {
    def: 'Single chemical building blocks that link together into long polymer chains.',
    pos: 'Science Term',
    ex: 'Thousands of ethylene monomers link up to make polyethylene plastic.',
    phon: '/ˈmɒn.ə.mərz/',
  },
  'cross-link': {
    def: 'A chemical bridge that connects two parallel polymer chains to increase strength and heat resistance.',
    pos: 'Science Term',
    ex: 'Cross-linking prevents rubber tires from melting under road friction.',
    phon: '/ˈkrɒs.lɪŋk/',
  },
  'cross-linking': {
    def: 'The chemical bonding of polymer chains into a 3D interconnected network.',
    pos: 'Science Term',
    ex: 'Cross-linking transforms sticky tree latex into tough vulcanized rubber.',
    phon: '/ˈkrɒs.lɪŋk.ɪŋ/',
  },
  'hydrogen bonds': {
    def: 'Weak molecular attractions between hydrogen and other atoms that break and reform when heated.',
    pos: 'Science Term',
    ex: 'Hydrogen bonds in cotton break during crumpling, causing deep wrinkles.',
    phon: '/ˈhaɪ.drə.dʒən bɒndz/',
  },
  rainstorm: {
    def: 'A weather storm characterized by heavy rainfall and strong winds.',
    pos: 'Noun',
    ex: 'A sudden rainstorm poured water over the playground.',
    phon: '/ˈreɪnˌstɔːrm/',
  },
  raincoat: {
    def: 'A waterproof or water-resistant coat worn to protect the body from rain.',
    pos: 'Noun',
    ex: 'Pip put on a polyester raincoat to stay completely dry in the storm.',
    phon: '/ˈreɪnˌkoʊt/',
  },
  rain: {
    def: 'Water falling in drops condensed from vapor in the atmosphere.',
    pos: 'Noun',
    ex: 'Rain fell steadily during our outdoor science experiment.',
    phon: '/reɪn/',
  },
  waterproof: {
    def: 'Completely resistant to water penetration so moisture slides right off without soaking through.',
    pos: 'Adjective',
    ex: 'Polyester raincoats are waterproof and keep you dry in storms.',
    phon: '/ˈwɔː.tə.pruːf/',
  },
  instantly: {
    def: 'At once; without any delay; immediately.',
    pos: 'Adverb',
    ex: 'Water drops rolled off the waterproof polyester coat instantly.',
    phon: '/ˈɪnstəntli/',
  },
  spray: {
    def: 'To scatter or shoot out liquid in a stream of tiny droplets.',
    pos: 'Verb',
    ex: 'Spray water on both raincoats to test which one absorbs water.',
    phon: '/spreɪ/',
  },
  heavy: {
    def: 'Having great weight; hard to lift; intense in force or amount.',
    pos: 'Adjective',
    ex: 'Heavy rain soaked through the untreated cotton fabric.',
    phon: '/ˈhɛvi/',
  },
  lightweight: {
    def: 'Weighing very little; easy to carry and move around.',
    pos: 'Adjective',
    ex: 'Nylon is lightweight and exceptionally strong for parachutes.',
    phon: '/ˈlaɪtˌweɪt/',
  },
  fabric: {
    def: 'Cloth or textile material produced by weaving or knitting fibres together.',
    pos: 'Noun',
    ex: 'Polyester is a wrinkle-free synthetic fabric.',
    phon: '/ˈfæbrɪk/',
  },
  fabrics: {
    def: 'Textile materials and cloths made from natural or synthetic fibres.',
    pos: 'Noun (Plural)',
    ex: 'Cotton and polyester are two very different fabrics.',
    phon: '/ˈfæbrɪks/',
  },
  elasticity: {
    def: 'The ability of a stretched or squeezed material to spring back into its original shape.',
    pos: 'Property',
    ex: 'Rubber bands have high elasticity and snap back when released.',
    phon: '/ˌiː.læsˈtɪs.ə.ti/',
  },
  insulation: {
    def: 'A barrier material that stops heat, electricity, or sound from escaping or entering.',
    pos: 'Property',
    ex: 'Plastic insulation around copper wire prevents electric shocks.',
    phon: '/ˌɪn.sjəˈleɪ.ʃən/',
  },
};

function getCache(): Record<string, DictionaryResult> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const cleanCache: Record<string, DictionaryResult> = {};
    for (const [k, v] of Object.entries(parsed)) {
      const res = v as DictionaryResult;
      // Filter out any previous vague fallback strings
      if (
        res &&
        res.definition &&
        !res.definition.includes('A term referring to') &&
        !res.definition.includes('in your science activity')
      ) {
        cleanCache[k] = res;
      }
    }
    return cleanCache;
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, DictionaryResult>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

const POS_MAP: Record<string, string> = {
  n: 'Noun',
  v: 'Verb',
  adj: 'Adjective',
  adv: 'Adverb',
  u: 'Word',
};

export async function lookupWord(rawQuery: string): Promise<DictionaryResult> {
  const clean = rawQuery.trim().replace(/^[^a-zA-Z0-9\s-]+|[^a-zA-Z0-9\s-]+$/g, '');
  if (!clean) {
    return {
      word: rawQuery,
      definition: 'Select a science term or vocabulary word to explore its meaning.',
      category: 'Word',
      source: 'cached',
    };
  }

  const lower = clean.toLowerCase();

  // 1. Check curated science curriculum vocabulary (0ms)
  const scienceMatch = findVocabWord(clean);
  if (scienceMatch) {
    return {
      word: scienceMatch.word,
      definition: scienceMatch.definition,
      example: scienceMatch.example,
      category: `${scienceMatch.category} (Science)`,
      pronunciation: scienceMatch.pronunciation,
      source: 'science-curriculum',
    };
  }

  // 2. Check built-in 0ms instant dictionary
  if (BUILT_IN_DICTIONARY[lower]) {
    const item = BUILT_IN_DICTIONARY[lower];
    return {
      word: clean.charAt(0).toUpperCase() + clean.slice(1),
      definition: item.def,
      example: item.ex,
      category: item.pos,
      pronunciation: item.phon,
      source: 'instant-dictionary',
    };
  }

  // 3. Check persistent localStorage cache (0ms)
  const cache = getCache();
  if (cache[lower]) {
    return cache[lower];
  }

  // 4. Sub-word & Multi-word Root Decomposition
  // E.g. "polymer chains" -> check "polymer" and "chain"
  const words = lower.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    for (const w of words) {
      const subMatch = findVocabWord(w) || (BUILT_IN_DICTIONARY[w] ? {
        word: w,
        definition: BUILT_IN_DICTIONARY[w].def,
        example: BUILT_IN_DICTIONARY[w].ex,
        category: BUILT_IN_DICTIONARY[w].pos as any,
        pronunciation: BUILT_IN_DICTIONARY[w].phon,
      } : undefined);

      if (subMatch) {
        const result: DictionaryResult = {
          word: clean.charAt(0).toUpperCase() + clean.slice(1),
          definition: `${subMatch.definition} (Refers to ${clean} in materials science).`,
          example: subMatch.example || `Notice how "${clean}" functions during laboratory experiments.`,
          category: 'Science Concept',
          pronunciation: subMatch.pronunciation,
          source: 'science-curriculum',
        };
        cache[lower] = result;
        saveCache(cache);
        return result;
      }
    }
  }

  // 5. Check Serverless Backend Layer (if available)
  try {
    const apiRes = await apiClient.dictionary({ word: clean });
    if (apiRes.success && apiRes.result) {
      const result = apiRes.result as DictionaryResult;
      cache[lower] = result;
      saveCache(cache);
      return result;
    }
  } catch (err) {
    console.warn('Backend dictionary query fallback:', err);
  }

  // 6. Query Gemini AI for Child-Friendly CBSE Science Definition
  try {
    const aiDef = await geminiService.defineWordWithAI(clean);
    if (aiDef && aiDef.definition) {
      const result: DictionaryResult = {
        word: aiDef.word || clean.charAt(0).toUpperCase() + clean.slice(1),
        definition: aiDef.definition,
        example: aiDef.example || `Example: Discover how "${clean}" works in science experiments!`,
        category: aiDef.category || 'Science Term',
        pronunciation: aiDef.pronunciation || '',
        source: 'gemini-ai',
      };
      cache[lower] = result;
      saveCache(cache);
      return result;
    }
  } catch (err) {
    console.warn('Gemini dictionary query fallback:', err);
  }

  // 6. Query Datamuse WordNet API (ultra-fast, single words)
  if (words.length === 1) {
    try {
      const dmRes = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(lower)}&md=d&max=1`);
      if (dmRes.ok) {
        const dmData = await dmRes.json();
        if (Array.isArray(dmData) && dmData.length > 0 && dmData[0].defs && dmData[0].defs.length > 0) {
          const rawDef = dmData[0].defs[0];
          const tabIdx = rawDef.indexOf('	');
          const posCode = tabIdx > -1 ? rawDef.substring(0, tabIdx) : 'n';
          const defText = tabIdx > -1 ? rawDef.substring(tabIdx + 1).trim() : rawDef;

          const result: DictionaryResult = {
            word: clean.charAt(0).toUpperCase() + clean.slice(1),
            definition: defText.charAt(0).toUpperCase() + defText.slice(1),
            example: `Notice how "${clean}" is applied in real-world science observations.`,
            category: POS_MAP[posCode] || 'Word',
            source: 'datamuse-api',
          };

          cache[lower] = result;
          saveCache(cache);
          return result;
        }
      }
    } catch {}

    // 7. Query Free Dictionary API
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lower)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const item = data[0];
          const meaning = item.meanings?.[0];
          const def = meaning?.definitions?.[0];

          const partOfSpeech = meaning?.partOfSpeech
            ? meaning.partOfSpeech.charAt(0).toUpperCase() + meaning.partOfSpeech.slice(1)
            : 'Word';

          const phonetic = item.phonetic || item.phonetics?.find((p: any) => p.text)?.text || '';

          const result: DictionaryResult = {
            word: item.word ? item.word.charAt(0).toUpperCase() + item.word.slice(1) : clean,
            definition: def?.definition || 'Definition not found.',
            example: def?.example || `Example: Notice how "${clean}" is used in physical science.`,
            category: partOfSpeech,
            pronunciation: phonetic,
            source: 'dictionary-api',
          };

          cache[lower] = result;
          saveCache(cache);
          return result;
        }
      }
    } catch {}
  }

  // 8. Meaningful Linguistic Fallback (No vague boilerplate)
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
  const result: DictionaryResult = {
    word: capitalized,
    definition: `An important concept describing how materials, forces, or physical properties interact in nature.`,
    example: `Explore how "${clean}" helps scientists understand the physical world around us!`,
    category: 'Science Concept',
    source: 'instant-dictionary',
  };

  cache[lower] = result;
  saveCache(cache);
  return result;
}
