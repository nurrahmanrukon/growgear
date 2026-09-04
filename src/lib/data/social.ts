/** Shared pools for social-proof content (reviewer names, purchase-notification copy). */
export const PERSON_NAMES = [
  "রাফিদ হাসান",
  "তানজিলা ইসলাম",
  "ইমরান হোসেন",
  "নুসরাত জাহান",
  "আরিফুল ইসলাম",
  "সুমাইয়া আক্তার",
  "মাহমুদুল হাসান",
  "তাহমিনা সুলতানা",
  "শাহরিয়ার কবির",
  "ফারজানা ইয়াসমিন",
  "রুবেল আহমেদ",
  "মিথিলা রহমান",
  "সাদমান সাকিব",
  "লামিয়া হক",
  "ওয়াসিফ চৌধুরী",
];

export const BD_LOCATIONS = [
  "ঢাকা",
  "চট্টগ্রাম",
  "সিলেট",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "রংপুর",
  "ময়মনসিংহ",
  "বগুড়া",
  "কুমিল্লা",
  "নারায়ণগঞ্জ",
  "গাজীপুর",
];

export function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}
