import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  lastPage,
  total,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-white/10 px-1 py-3 text-sm text-white/60">
      <span>{total} total</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-md border border-white/15 p-1.5 disabled:opacity-30 hover:bg-white/10"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        <span>
          Page {currentPage} of {lastPage}
        </span>
        <button
          type="button"
          disabled={currentPage >= lastPage}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-md border border-white/15 p-1.5 disabled:opacity-30 hover:bg-white/10"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
