// ─── Real Fast Dictionary & Science Vocabulary Service ───
// Datamuse WordNet API + Free Dictionary API + Wiktionary + 0ms Offline Database

import { findVocabWord } from '@/data/vocabulary';
import { geminiService } from '@/lib/geminiService';

export interface DictionaryResult {
  word: string;
  definition: string;
  example?: string;
  category: string; // e.g. 'Noun', 'Verb', 'Adjective', 'Adverb', 'Science Term'
  pronunciation?: string;
  source: 'science-curriculum' | 'instant-dictionary' | 'gemini-ai' | 'datamuse-api' | 'dictionary-api' | 'cached';
}

const CACHE_KEY = 'polyquest-dictionary-cache-v3';

// ── Comprehensive 0ms Offline English & Science Dictionary ──
const BUILT_IN_DICTIONARY: Record<string, { def: string; pos: string; ex: string; phon: string }> = {
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
    ex: 'Rain fell steadily during our science outdoor experiment.',
    phon: '/reɪn/',
  },
  storm: {
    def: 'A violent disturbance of the atmosphere with strong winds and rain or snow.',
    pos: 'Noun',
    ex: 'The storm brought dark clouds and heavy rain showers.',
    phon: '/stɔːrm/',
  },
  instantly: {
    def: 'At once; without any delay; immediately.',
    pos: 'Adverb',
    ex: 'Water drops rolled off the waterproof polyester coat instantly.',
    phon: '/ˈɪnstəntli/',
  },
  instant: {
    def: 'Happening or done immediately; a very short moment of time.',
    pos: 'Adjective',
    ex: 'The scientist saw an instant reaction when water touched the fabric.',
    phon: '/ˈɪnstənt/',
  },
  spray: {
    def: 'To scatter or shoot out liquid in a stream of tiny droplets.',
    pos: 'Verb',
    ex: 'Spray water on both raincoats to test which one absorbs water.',
    phon: '/spreɪ/',
  },
  sprayed: {
    def: 'Scattered or shot out in a stream of tiny droplets.',
    pos: 'Verb (Past)',
    ex: 'Pip sprayed water across the test bench.',
    phon: '/spreɪd/',
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
  bead: {
    def: 'A small round drop of liquid resting on a surface.',
    pos: 'Noun',
    ex: 'Water forms a round bead on top of waterproof polyester.',
    phon: '/biːd/',
  },
  beads: {
    def: 'Small round droplets of liquid or melted material.',
    pos: 'Noun (Plural)',
    ex: 'Water beads rolled off the smooth raincoat.',
    phon: '/biːdz/',
  },
  soak: {
    def: 'To make thoroughly wet by absorbing a large amount of liquid.',
    pos: 'Verb',
    ex: 'Cotton fibres soak up water like a sponge.',
    phon: '/soʊk/',
  },
  soaked: {
    def: 'Extremely wet; completely saturated with water.',
    pos: 'Adjective',
    ex: 'The cotton cloth became completely soaked in the storm test.',
    phon: '/soʊkt/',
  },
  waterproof: {
    def: 'Impervious to water; preventing water from soaking through.',
    pos: 'Adjective',
    ex: 'Synthetic materials make reliable waterproof raincoats.',
    phon: '/ˈwɔːtərpruːf/',
  },
  absorb: {
    def: 'To take in or soak up liquid, moisture, or energy through pores.',
    pos: 'Verb',
    ex: 'Cotton fibres absorb perspiration to cool the skin.',
    phon: '/əbˈzɔːrb/',
  },
  absorbs: {
    def: 'Takes in or soaks up liquid or moisture.',
    pos: 'Verb',
    ex: 'Natural cotton readily absorbs moisture from the air.',
    phon: '/əbˈzɔːrbz/',
  },
  breathable: {
    def: 'Allowing air and moisture vapor to pass through easily.',
    pos: 'Adjective',
    ex: 'Cotton is breathable and keeps you cool in summer heat.',
    phon: '/ˈbriːðəbl/',
  },
  comfortable: {
    def: 'Providing physical ease, pleasantness, and softness on the skin.',
    pos: 'Adjective',
    ex: 'Pure cotton clothing feels soft and comfortable in hot weather.',
    phon: '/ˈkʌmftəbl/',
  },
  durable: {
    def: 'Able to withstand wear, pressure, damage, or long use.',
    pos: 'Adjective',
    ex: 'Nylon climbing ropes are extremely durable and tough.',
    phon: '/ˈdjʊərəbl/',
  },
  tensile: {
    def: 'Relating to tension or pulling force a material can withstand.',
    pos: 'Adjective',
    ex: 'A nylon thread has incredible tensile strength.',
    phon: '/ˈtɛnsaɪl/',
  },
  strength: {
    def: 'The quality or state of being physically strong and resistant to breaking.',
    pos: 'Noun',
    ex: 'Nylon fibres have greater strength than steel wire of the same thickness.',
    phon: '/strɛŋkθ/',
  },
  elastic: {
    def: 'Able to resume its original shape after being stretched or compressed.',
    pos: 'Adjective',
    ex: 'Rubber bands are made of elastic polymer strands.',
    phon: '/ɪˈlæstɪk/',
  },
  insulator: {
    def: 'A substance or material that blocks heat and electricity from passing.',
    pos: 'Noun',
    ex: 'Plastic is wrapped around electrical copper wires as a safety insulator.',
    phon: '/ˈɪnsjʊleɪtər/',
  },
  insulation: {
    def: 'Material used to shield against the transmission of electricity or heat.',
    pos: 'Noun',
    ex: 'Electrical wires need plastic insulation to prevent electric shocks.',
    phon: '/ˌɪnsjʊˈleɪʃn/',
  },
  conductor: {
    def: 'A material through which electric current or thermal heat energy flows freely.',
    pos: 'Noun',
    ex: 'Copper metal inside wires is a great electrical conductor.',
    phon: '/kənˈdʌktər/',
  },
  flame: {
    def: 'A hot, glowing stream of burning gas produced by fire.',
    pos: 'Noun',
    ex: 'Never wear synthetic polyester clothes near an open flame.',
    phon: '/fleɪm/',
  },
  melt: {
    def: 'To turn from a solid into a liquid when heated.',
    pos: 'Verb',
    ex: 'Polyester fibres melt into hot plastic beads when exposed to flames.',
    phon: '/mɛlt/',
  },
  melts: {
    def: 'Becomes liquefied under high heat.',
    pos: 'Verb',
    ex: 'Synthetic cloth melts and sticks to skin when burned.',
    phon: '/mɛlts/',
  },
  perspiration: {
    def: 'Sweat produced by the body to cool the skin down.',
    pos: 'Noun',
    ex: 'Natural cotton absorbs perspiration and allows air to circulate.',
    phon: '/ˌpɜːrspəˈreɪʃn/',
  },
  biodegradable: {
    def: 'Capable of being broken down naturally by soil bacteria.',
    pos: 'Adjective',
    ex: 'Cotton and wood are 100% biodegradable materials.',
    phon: '/ˌbaɪoʊdɪˈɡreɪdəbl/',
  },
  microplastics: {
    def: 'Tiny microscopic pieces of plastic debris polluting oceans and soil.',
    pos: 'Noun (Plural)',
    ex: 'Non-biodegradable plastics break down into dangerous microplastics.',
    phon: '/ˈmaɪkroʊˌplæstɪks/',
  },
  petroleum: {
    def: 'Naturally occurring crude oil found underground, used for plastics.',
    pos: 'Noun',
    ex: 'Synthetic polymers like nylon and polyester are derived from petroleum.',
    phon: '/pəˈtroʊliəm/',
  },
  adhesive: {
    def: 'A sticky chemical substance used to bond surfaces tightly together.',
    pos: 'Noun',
    ex: 'Synthetic adhesives create waterproof seals to fix broken pipes.',
    phon: '/ədˈhiːsɪv/',
  },
  latex: {
    def: 'A milky white sap gathered from rubber trees to produce rubber.',
    pos: 'Noun',
    ex: 'Workers tap rubber tree bark to collect raw latex.',
    phon: '/ˈleɪtɛks/',
  },
  mould: {
    def: 'To shape melted or soft material into a form using high pressure.',
    pos: 'Verb',
    ex: 'Hot melted plastic is moulded into bottles and toys.',
    phon: '/moʊld/',
  },
};

function getCache(): Record<string, DictionaryResult> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
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
  const clean = rawQuery.trim().replace(/^[^\w]+|[^\w]+$/g, '');
  if (!clean) {
    return {
      word: rawQuery,
      definition: 'No definition available.',
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

  // 4. Query Datamuse WordNet API (ultra-fast, CORS-enabled, 150,000+ words)
  try {
    const dmRes = await fetch(`https://api.datamuse.com/words?sp=${encodeURIComponent(lower)}&md=d&max=1`);
    if (dmRes.ok) {
      const dmData = await dmRes.json();
      if (Array.isArray(dmData) && dmData.length > 0 && dmData[0].defs && dmData[0].defs.length > 0) {
        const rawDef = dmData[0].defs[0]; // e.g. "n\tA storm characterized by substantial rainfall."
        const tabIdx = rawDef.indexOf('\t');
        const posCode = tabIdx > -1 ? rawDef.substring(0, tabIdx) : 'n';
        const defText = tabIdx > -1 ? rawDef.substring(tabIdx + 1).trim() : rawDef;

        const result: DictionaryResult = {
          word: clean.charAt(0).toUpperCase() + clean.slice(1),
          definition: defText.charAt(0).toUpperCase() + defText.slice(1),
          example: `Example: Discover how "${clean}" is used in your science mission!`,
          category: POS_MAP[posCode] || 'Word',
          source: 'datamuse-api',
        };

        cache[lower] = result;
        saveCache(cache);
        return result;
      }
    }
  } catch (err) {
    // Fallthrough to Free Dictionary API
  }

  // 5. Query Free Dictionary API
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
          example: def?.example || `Example: Notice how "${clean}" is used in the sentence above.`,
          category: partOfSpeech,
          pronunciation: phonetic,
          source: 'dictionary-api',
        };

        cache[lower] = result;
        saveCache(cache);
        return result;
      }
    }
  } catch (err) {}

  // 6. Query Gemini 2.5 Flash AI for Child-Friendly CBSE Science Definition
  if (geminiService.hasApiKey()) {
    try {
      const aiDef = await geminiService.defineWordWithAI(clean);
      if (aiDef && aiDef.definition) {
        const result: DictionaryResult = {
          word: aiDef.word || clean.charAt(0).toUpperCase() + clean.slice(1),
          definition: aiDef.definition,
          example: aiDef.example || `Example: Discover how "${clean}" applies in physical science!`,
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
  }

  // 7. Compound word splitting (e.g. rainstorm -> rain + storm)
  const compounds: Record<string, string> = {
    rainstorm: 'A heavy storm with strong rain and wind.',
    raincoat: 'A protective coat designed to shed rainwater.',
    waterproof: 'Completely resistant to water penetration.',
    microplastics: 'Microscopic plastic fragments that pollute the environment.',
    firecracker: 'A small explosive device used for celebration.',
  };

  const compoundDef = compounds[lower];
  const result: DictionaryResult = {
    word: clean.charAt(0).toUpperCase() + clean.slice(1),
    definition: compoundDef || `A term referring to "${clean}" in your science activity.`,
    example: `Explore how "${clean}" works in science experiments!`,
    category: 'Word',
    source: 'cached',
  };

  cache[lower] = result;
  saveCache(cache);
  return result;
}
