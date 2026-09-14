import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  question: string;
  answer: string;
}

/**
 * FRS calls for "simple accordion interaction" on the FAQs page (P-12).
 * Single-open behavior keeps a long FAQ list scannable rather than having
 * every answer expanded at once.
 */
export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-white/10 rounded-2xl border border-white/15 bg-white/[0.06]">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-white sm:text-base"
            >
              {item.question}
              <ChevronDown
                size={18}
                className={`shrink-0 text-white/60 transition-transform duration-300 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </button>
            {open && (
              <p className="px-5 pb-4 text-sm leading-relaxed text-white/70">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
