// ─── Real Fast Dictionary & Science Vocabulary Service ───
// Instant 0ms offline database + 800ms non-blocking API fallback + localStorage caching

import { findVocabWord } from '@/data/vocabulary';

export interface DictionaryResult {
  word: string;
  definition: string;
  example?: string;
  category: string; // e.g. 'Adverb', 'Noun', 'Verb', 'Adjective', 'Science Term'
  pronunciation?: string;
  source: 'science-curriculum' | 'instant-dictionary' | 'dictionary-api' | 'cached';
}

const CACHE_KEY = 'polyquest-dictionary-cache-v2';

// ── Built-in High-Speed English & Science Dictionary (0ms Latency) ──
const BUILT_IN_DICTIONARY: Record<string, { def: string; pos: string; ex: string; phon: string }> = {
  instantly: {
    def: 'At once; without any delay; immediately.',
    pos: 'Adverb',
    ex: 'Water drops rolled off the waterproof polyester coat instantly.',
    phon: '/ˈɪnstəntli/',
  },
  instant: {
    def: 'Happening or done immediately; a very short period of time.',
    pos: 'Adjective',
    ex: 'The scientist saw an instant reaction when heat was applied.',
    phon: '/ˈɪnstənt/',
  },
  spray: {
    def: 'To scatter or force out liquid in a fine stream of tiny droplets.',
    pos: 'Verb',
    ex: 'Pip sprayed water droplets on the cloth to test if it absorbed rain.',
    phon: '/spreɪ/',
  },
  heavy: {
    def: 'Of great weight; difficult to lift or carry; intense in force.',
    pos: 'Adjective',
    ex: 'Heavy rain soaked through the untreated cotton fabric.',
    phon: '/ˈhɛvi/',
  },
  lightweight: {
    def: 'Weighing less than average; very light and easy to carry.',
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
  bead: {
    def: 'A small round drop of liquid that forms on a water-repellent surface.',
    pos: 'Noun',
    ex: 'Rainwater forms tiny round beads on the surface of synthetic polyester.',
    phon: '/biːd/',
  },
  beads: {
    def: 'Small round droplets of liquid or melted material.',
    pos: 'Noun (Plural)',
    ex: 'Water beads rolled off the smooth raincoat.',
    phon: '/biːdz/',
  },
  soak: {
    def: 'To make something thoroughly wet by immersing or absorbing liquid.',
    pos: 'Verb',
    ex: 'The natural cotton soaked up all the water drops.',
    phon: '/soʊk/',
  },
  soaked: {
    def: 'Extremely wet; saturated with water or other liquid.',
    pos: 'Adjective',
    ex: 'The cotton cloth became completely soaked in the rain test.',
    phon: '/soʊkt/',
  },
  waterproof: {
    def: 'Impervious to water; preventing water from soaking through.',
    pos: 'Adjective',
    ex: 'Synthetic materials make reliable waterproof raincoats.',
    phon: '/ˈwɔːtərpruːf/',
  },
  absorb: {
    def: 'To take in or soak up energy, liquid, or moisture through pores or fibres.',
    pos: 'Verb',
    ex: 'Cotton fibres absorb perspiration to cool the skin.',
    phon: '/əbˈzɔːrb/',
  },
  breathable: {
    def: 'Permitting air and moisture vapor to pass through freely.',
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
    def: 'Able to withstand wear, pressure, damage, or time without breaking.',
    pos: 'Adjective',
    ex: 'Nylon climbing ropes are extremely durable and tough.',
    phon: '/ˈdjʊərəbl/',
  },
  tensile: {
    def: 'Relating to tension or the pulling force a material can withstand.',
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
  elasticity: {
    def: 'The ability of a deformed material to snap back to its original shape.',
    pos: 'Noun',
    ex: 'Synthetic rubber tyres maintain elasticity under heavy road friction.',
    phon: '/ˌiːlæˈstɪsɪti/',
  },
  insulator: {
    def: 'A substance or material that blocks or stops heat and electricity from passing.',
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
    def: 'A hot, glowing stream of burning gas generated by fire.',
    pos: 'Noun',
    ex: 'Never wear synthetic polyester clothes near an open flame.',
    phon: '/fleɪm/',
  },
  melt: {
    def: 'To change from a solid to a liquid state when heated.',
    pos: 'Verb',
    ex: 'Polyester fibres melt into hot plastic beads when exposed to flames.',
    phon: '/mɛlt/',
  },
  perspiration: {
    def: 'Sweat excreted through the skin pores to cool the body down by evaporation.',
    pos: 'Noun',
    ex: 'Natural cotton absorbs perspiration and allows air to circulate.',
    phon: '/ˌpɜːrspəˈreɪʃn/',
  },
  biodegradable: {
    def: 'Capable of being broken down naturally by bacteria into harmless soil matter.',
    pos: 'Adjective',
    ex: 'Cotton and wood are 100% biodegradable materials.',
    phon: '/ˌbaɪoʊdɪˈɡreɪdəbl/',
  },
  microplastics: {
    def: 'Microscopic broken pieces of synthetic plastic that pollute oceans and soil.',
    pos: 'Noun (Plural)',
    ex: 'Non-biodegradable plastics break down into dangerous microplastics.',
    phon: '/ˈmaɪkroʊˌplæstɪks/',
  },
  petroleum: {
    def: 'Naturally occurring crude oil pumped from underground, used for fuels and plastics.',
    pos: 'Noun',
    ex: 'Synthetic polymers like nylon and polyester are derived from petroleum.',
    phon: '/pəˈtroʊliəm/',
  },
  adhesive: {
    def: 'A sticky substance, such as glue, paste, or mastic, used to bond surfaces together.',
    pos: 'Noun',
    ex: 'Synthetic adhesives create waterproof seals to fix broken pipes.',
    phon: '/ədˈhiːsɪv/',
  },
  latex: {
    def: 'A milky white plant sap gathered from rubber trees to produce natural rubber.',
    pos: 'Noun',
    ex: 'Workers tap rubber tree bark to collect raw latex.',
    phon: '/ˈleɪtɛks/',
  },
  mould: {
    def: 'To shape a soft or melted material into a specific form using a hollow container.',
    pos: 'Verb',
    ex: 'Hot melted plastic is moulded into bottles, chairs, and toys.',
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

// ── Smart Linguistic Analyzer for Unknown Words (Instant Fallback) ──
function analyzeWord(clean: string): { pos: string; def: string; ex: string } {
  const lower = clean.toLowerCase();
  const cap = clean.charAt(0).toUpperCase() + clean.slice(1);

  if (lower.endsWith('ly')) {
    return {
      pos: 'Adverb',
      def: `In a ${lower.slice(0, -2)} manner or way.`,
      ex: `The experiment was completed ${lower}.`,
    };
  }
  if (lower.endsWith('able') || lower.endsWith('ible')) {
    return {
      pos: 'Adjective',
      def: `Capable of being ${lower.replace(/able$|ible$/, '')}ed.`,
      ex: `This material is ${lower} under standard conditions.`,
    };
  }
  if (lower.endsWith('ing')) {
    return {
      pos: 'Verb (Action)',
      def: `The action or process of ${lower.replace(/ing$/, '')}.`,
      ex: `We are currently ${lower} the material properties.`,
    };
  }
  if (lower.endsWith('ed')) {
    return {
      pos: 'Verb (Past / State)',
      def: `Having undergone the action of ${lower.replace(/ed$/, '')}.`,
      ex: `The specimen was ${lower} in the lab.`,
    };
  }
  if (lower.endsWith('tion') || lower.endsWith('sion') || lower.endsWith('ment')) {
    return {
      pos: 'Noun (Process / Concept)',
      def: `The state, process, or concept of ${lower.replace(/tion$|sion$|ment$/, '')}.`,
      ex: `Scientists observed the ${lower} in action.`,
    };
  }

  return {
    pos: 'Word',
    def: `A specific term used to describe a scientific concept or object in your activity.`,
    ex: `Explore how "${clean}" applies to materials science.`,
  };
}

export async function lookupWord(rawQuery: string): Promise<DictionaryResult> {
  const clean = rawQuery.trim().replace(/^[^\w]+|[^\w]+$/g, '');
  if (!clean) {
    return {
      word: rawQuery,
      definition: 'No definition available for this term.',
      category: 'Word',
      source: 'cached',
    };
  }

  const lower = clean.toLowerCase();

  // 1. Check curated science curriculum vocabulary first (0ms latency)
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

  // 2. Check built-in high-speed offline dictionary (0ms latency)
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

  // 3. Check localStorage dictionary cache (0ms latency)
  const cache = getCache();
  if (cache[lower]) {
    return cache[lower];
  }

  // 4. Query Free Dictionary API with strict 800ms timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 800);

    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lower)}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

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
          example: def?.example || item.meanings?.[0]?.definitions?.find((d: any) => d.example)?.example || '',
          category: partOfSpeech,
          pronunciation: phonetic,
          source: 'dictionary-api',
        };

        // Cache the result
        cache[lower] = result;
        saveCache(cache);

        return result;
      }
    }
  } catch (err) {
    // Timed out or network error — fall through to instant analyzer
  }

  // 5. Instant linguistic analyzer fallback (0ms)
  const analysis = analyzeWord(clean);
  const result: DictionaryResult = {
    word: clean.charAt(0).toUpperCase() + clean.slice(1),
    definition: analysis.def,
    example: analysis.ex,
    category: analysis.pos,
    source: 'cached',
  };

  cache[lower] = result;
  saveCache(cache);

  return result;
}
