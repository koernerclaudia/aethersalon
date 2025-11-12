export type Partner = {
  id: string | number;
  name: string;
  description: string;
  website?: string;
  imageUrl?: string | undefined;
};

export const samplePartners: Partner[] = [
  {
    id: 1,
    name: 'Kupferwerkstatt Müller',
    description:
      'Handgefertigte Kupfer- und Messingarbeiten im viktorianischen Stil. Spezialisiert auf Brillen, Zahnräder und dekorative Elemente.',
    website: 'https://example.com',
    imageUrl: undefined,
  },
  {
    id: 2,
    name: 'Mechanica Curiosa',
    description:
      'Kuriositätenhändler mit einer Auswahl seltener Fundstücke, Uhren und mechanischer Spielereien.',
    website: 'https://example.org',
    imageUrl: undefined,
  },
  {
    id: 3,
    name: 'Atelier Viktoria',
    description:
      'Designatelier für viktorianische Mode und Accessoires — Korsetts, Hüte und maßgeschneiderte Stücke.',
    website: 'https://example.net',
    imageUrl: undefined,
  },
  {
    id: 4,
    name: 'Dampf & Feder Verlag',
    description:
      'Verlag spezialisiert auf phantastische Literatur und illustrierte Werke im Steampunk-Genre.',
    website: 'https://example.edu',
    imageUrl: undefined,
  },
];
