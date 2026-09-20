/**
 * Rotating accent palette. Cards, stats and steps pick one by index so a
 * page has colour without every element shouting in the same teal.
 * Class names are written out in full so Tailwind can see them.
 */
export interface Accent {
  /** icon / number chip: tinted bg + border + light text */
  chip: string;
  /** coloured text (links, roles, prices) */
  text: string;
  /** soft glow blob in the card corner */
  glow: string;
  /** solid bar or dot */
  solid: string;
  /** stat / divider border */
  border: string;
  /** hover border colour for cards */
  hoverBorder: string;
}

export const ACCENTS: Accent[] = [
  {
    chip: 'border-brand/45 bg-brand/25 text-brand-200',
    text: 'text-brand-300',
    glow: 'bg-brand/25',
    solid: 'bg-brand',
    border: 'border-brand/50',
    hoverBorder: 'hover:!border-brand/60',
  },
  {
    chip: 'border-iris/45 bg-iris/25 text-iris-200',
    text: 'text-iris-300',
    glow: 'bg-iris/25',
    solid: 'bg-iris',
    border: 'border-iris/50',
    hoverBorder: 'hover:!border-iris/60',
  },
  {
    chip: 'border-coral/45 bg-coral/25 text-coral-200',
    text: 'text-coral-300',
    glow: 'bg-coral/25',
    solid: 'bg-coral',
    border: 'border-coral/50',
    hoverBorder: 'hover:!border-coral/60',
  },
  {
    chip: 'border-sun/45 bg-sun/25 text-sun-200',
    text: 'text-sun-300',
    glow: 'bg-sun/20',
    solid: 'bg-sun',
    border: 'border-sun/50',
    hoverBorder: 'hover:!border-sun/60',
  },
  {
    chip: 'border-azure/45 bg-azure/25 text-azure-200',
    text: 'text-azure-300',
    glow: 'bg-azure/25',
    solid: 'bg-azure',
    border: 'border-azure/50',
    hoverBorder: 'hover:!border-azure/60',
  },
];

export const accentAt = (index: number): Accent =>
  ACCENTS[((index % ACCENTS.length) + ACCENTS.length) % ACCENTS.length];
