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
    <div className="space-y-3">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div
            key={item.question}
            className={`surface-card overflow-hidden transition-colors duration-300 ${
              open ? '!border-brand/45 !bg-brand/[0.07]' : ''
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-white sm:text-base"
            >
              {item.question}
              <ChevronDown
                size={18}
                className={`shrink-0 transition-transform duration-300 ${
                  open ? 'rotate-180 text-brand-300' : 'text-white'
                }`}
              />
            </button>
            {open && (
              <p className="px-5 pb-5 text-sm leading-7 text-white">{item.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
