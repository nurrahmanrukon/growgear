/**
 * Script-agnostic fuzzy matching for blog search. A query can be typed in
 * Bangla, English, or Banglish (Romanized Bangla, e.g. "bajet" for বাজেট),
 * and may contain minor spelling mistakes — all three should still surface
 * relevant posts/topics.
 *
 * Strategy: transliterate Bangla text to a rough Roman phonetic form, then
 * compare that against the query (also transliterated — a no-op for text
 * that's already Latin, since the map below only rewrites Bangla code
 * points). Latin-vs-Latin and the transliterated-Bangla-vs-Latin cases both
 * end up as plain Roman-string comparison, so one fuzzy/substring pass over
 * the phonetic form handles cross-script matching, and a literal pass over
 * the original text still gives exact Bangla queries their best (highest
 * confidence) score.
 */

const INDEPENDENT_VOWELS: Record<string, string> = {
  "অ": "a", "আ": "aa", "ই": "i", "ঈ": "i", "উ": "u", "ঊ": "u",
  "ঋ": "ri", "এ": "e", "ঐ": "oi", "ও": "o", "ঔ": "ou",
};

const MATRA: Record<string, string> = {
  "া": "a", "ি": "i", "ী": "i", "ু": "u", "ূ": "u",
  "ৃ": "ri", "ে": "e", "ৈ": "oi", "ো": "o", "ৌ": "ou",
};

const CONSONANTS: Record<string, string> = {
  "ক": "k", "খ": "kh", "গ": "g", "ঘ": "gh", "ঙ": "ng",
  "চ": "ch", "ছ": "chh", "জ": "j", "ঝ": "jh", "ঞ": "n",
  "ট": "t", "ঠ": "th", "ড": "d", "ঢ": "dh", "ণ": "n",
  "ত": "t", "থ": "th", "দ": "d", "ধ": "dh", "ন": "n",
  "প": "p", "ফ": "ph", "ব": "b", "ভ": "bh", "ম": "m",
  "য": "j", "র": "r", "ল": "l", "শ": "sh", "ষ": "sh",
  "স": "s", "হ": "h", "ড়": "r", "ঢ়": "rh", "য়": "y", "ৎ": "t",
  // Precomposed single-code-point forms of the same nukta letters above
  // (ড়/ঢ়/য়), in case input text was encoded that way instead of as
  // base-consonant + combining nukta.
  "ড়": "r", "ঢ়": "rh", "য়": "y",
};

const DIGITS: Record<string, string> = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
};

/** Bangla (or already-Latin) text -> rough Roman phonetic string. */
export function toPhonetic(input: string): string {
  // NFC first: a "nukta" consonant (ড়/ঢ়/য়) can arrive as a precomposed code
  // point or as base-consonant + combining nukta (U+09BC) — normalizing makes
  // the lookup below consistent regardless of which form the input used.
  const chars = Array.from(input.toLowerCase().normalize("NFC"));
  let out = "";
  let i = 0;
  while (i < chars.length) {
    let c = chars[i];
    let consumed = 1;
    // A base consonant immediately followed by a combining nukta is really
    // one letter (ড + ় = ড়) — fold them into a single lookup key.
    if (CONSONANTS[c] && chars[i + 1] === "়" && CONSONANTS[c + "়"]) {
      c = c + "়";
      consumed = 2;
    }
    if (CONSONANTS[c]) {
      const next = chars[i + consumed];
      if (next === "্") {
        out += CONSONANTS[c];
        i += consumed + 1;
      } else if (next && MATRA[next]) {
        out += CONSONANTS[c] + MATRA[next];
        i += consumed + 1;
      } else {
        out += CONSONANTS[c] + "a";
        i += consumed;
      }
      continue;
    }
    if (INDEPENDENT_VOWELS[c]) {
      out += INDEPENDENT_VOWELS[c];
      i += 1;
      continue;
    }
    if (DIGITS[c]) {
      out += DIGITS[c];
      i += 1;
      continue;
    }
    if (c === "ং") {
      out += "ng";
      i += 1;
      continue;
    }
    if (c === "ঃ" || c === "ঁ" || c === "্" || c === "়") {
      i += 1;
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;
  for (let i = 1; i <= m; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = temp;
    }
  }
  return dp[n];
}

/** Collapses common Banglish spelling variants onto one form before fuzzy comparison
 *  (e.g. ফ is typed both "ph" and the more common, sound-accurate "f") — applied to
 *  the phonetic rendering only, never to the raw literal-match text. */
function normalizeRoman(s: string): string {
  return s
    .replace(/ph/g, "f")
    .replace(/chh/g, "ch")
    .replace(/bh/g, "v")
    .replace(/c(?!h)/g, "k")
    .replace(/sh/g, "s")
    .replace(/aa/g, "a");
}

function tokenize(s: string): string[] {
  return s.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

/** Fuzzy edit-distance threshold scaled to token length. Deliberately conservative:
 *  two unrelated short-to-medium Bangla words can easily sit within an edit distance
 *  of 2 of each other (e.g. "kajera" vs "bajeta" — "of work" vs "budget" — differ by
 *  only 2 letters), so the threshold stays tight until the word is long enough that a
 *  few letters of drift is a small fraction of it (English-loanword spellings like
 *  "productivity" vs. its Bangla phonetic rendering legitimately diverge that much). */
function fuzzyThreshold(len: number): number {
  if (len <= 3) return 0;
  if (len <= 6) return 1;
  if (len <= 9) return 2;
  return 3;
}

/**
 * Relevance score for one field of text against a query: 100 for an exact
 * (literal) substring hit, ~75 for a phonetic substring hit (handles
 * Banglish/English queries against Bangla text), and a lower score for a
 * fuzzy token match (handles typos in either script). 0 means no match.
 */
export function fieldScore(fieldText: string, query: string): number {
  const field = fieldText.toLowerCase();
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  if (field.includes(q)) return 100;

  const fieldPhonetic = normalizeRoman(toPhonetic(field));
  const queryPhonetic = normalizeRoman(toPhonetic(q));
  let score = 0;

  if (queryPhonetic.length >= 2 && fieldPhonetic.includes(queryPhonetic)) {
    score = Math.max(score, 75);
  }

  const fieldTokens = tokenize(fieldPhonetic);
  const queryTokens = tokenize(queryPhonetic);
  let fuzzyHits = 0;
  for (const qt of queryTokens) {
    if (qt.length < 2) continue;
    const threshold = fuzzyThreshold(qt.length);
    for (const ft of fieldTokens) {
      if (Math.abs(ft.length - qt.length) > threshold + 1) continue;
      if (levenshtein(qt, ft) <= threshold) {
        fuzzyHits++;
        break;
      }
    }
  }
  if (fuzzyHits > 0) score = Math.max(score, 35 + fuzzyHits * 15);

  return score;
}

/** Best score across several weighted fields (e.g. title counts more than excerpt). */
export function bestFieldScore(fields: { text: string; weight: number }[], query: string): number {
  let best = 0;
  for (const f of fields) {
    const s = fieldScore(f.text, query) * f.weight;
    if (s > best) best = s;
  }
  return best;
}
