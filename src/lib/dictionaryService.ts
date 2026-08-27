// ─── Real Dictionary API & Science Vocabulary Service ───
import { vocabulary, findVocabWord, VocabEntry } from '@/data/vocabulary';

export interface DictionaryResult {
  word: string;
  definition: string;
  example?: string;
  category: string; // e.g. 'Science Term', 'Noun', 'Verb', 'Adjective', 'Adverb'
  pronunciation?: string;
  source: 'science-curriculum' | 'dictionary-api' | 'cached';
}

const CACHE_KEY = 'polyquest-dictionary-cache';

// Load cache from localStorage
function getCache(): Record<string, DictionaryResult> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Save to localStorage cache
function saveCache(cache: Record<string, DictionaryResult>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
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

  // 1. Check curated science curriculum vocabulary first
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

  // 2. Check localStorage dictionary cache
  const cache = getCache();
  if (cache[lower]) {
    return cache[lower];
  }

  // 3. Query Free Dictionary API (Google / Wiktionary open data)
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
          example: def?.example || (item.meanings?.[0]?.definitions?.find((d: any) => d.example)?.example) || '',
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
    console.warn('Dictionary API lookup failed, falling back:', err);
  }

  // 4. Fallback for offline or unmatched word
  const capitalized = clean.charAt(0).toUpperCase() + clean.slice(1);
  return {
    word: capitalized,
    definition: `A word or term used in your learning activity.`,
    example: `Notice how "${clean}" is used in the sentence context above.`,
    category: 'General Word',
    source: 'cached',
  };
}
