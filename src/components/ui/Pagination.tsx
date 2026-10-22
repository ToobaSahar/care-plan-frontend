import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/cn';

export interface PaginationProps {
  /** 1-indexed. */
  page: number;
  pageCount: number;
  /** Total rows across all pages, for the range summary. */
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  /** Dims the control and blocks input while a page is in flight. */
  busy?: boolean;
  /** Noun for the summary line: "1–12 of 41 service users". */
  itemLabel?: string;
  className?: string;
}

type Slot = number | 'gap-left' | 'gap-right';

/**
 * Builds the page list: always the first and last page, the current page and
 * one either side, and an ellipsis wherever the sequence jumps. Keeps the
 * control a fixed width however many pages exist.
 */
function buildSlots(page: number, pageCount: number): Slot[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const slots: Slot[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);

  if (start > 2) slots.push('gap-left');
  for (let i = start; i <= end; i++) slots.push(i);
  if (end < pageCount - 1) slots.push('gap-right');

  slots.push(pageCount);
  return slots;
}

/**
 * Pagination for server-paged lists.
 *
 * Built from the same Button primitive as every other control, so it carries
 * the product's focus ring, disabled treatment and hit areas rather than
 * inventing its own.
 */
export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
  busy = false,
  itemLabel = 'results',
  className,
}) => {
  const slots = useMemo(() => buildSlots(page, pageCount), [page, pageCount]);

  if (total === 0) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        'flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-oat-200 pt-4',
        busy && 'pointer-events-none opacity-60',
        className,
      )}
    >
      <p className="text-xs text-oat-600" aria-live="polite">
        Showing <span className="font-medium text-oat-800">{first}–{last}</span> of{' '}
        <span className="font-medium text-oat-800">{total}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          icon={<ChevronLeft />}
          disabled={page <= 1 || busy}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          // It sits on the oat ground, where the ghost hover would not show;
          // match the page numbers beside it.
          className="hover:!bg-oat-200"
        >
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <ul className="flex items-center gap-1">
          {slots.map((slot) =>
            typeof slot === 'number' ? (
              <li key={slot}>
                <button
                  type="button"
                  aria-label={`Page ${slot}`}
                  aria-current={slot === page ? 'page' : undefined}
                  disabled={busy}
                  onClick={() => onPageChange(slot)}
                  className={cn(
                    'min-w-[2rem] rounded px-2 py-1.5 text-xs font-medium tabular-nums',
                    'transition-colors duration-fast ease-out',
                    slot === page
                      ? 'bg-teal-600 text-white'
                      : 'text-oat-700 hover:bg-oat-200',
                  )}
                >
                  {slot}
                </button>
              </li>
            ) : (
              <li
                key={slot}
                aria-hidden="true"
                className="px-1 text-xs text-oat-400 select-none"
              >
                &hellip;
              </li>
            ),
          )}
        </ul>

        <Button
          variant="ghost"
          size="sm"
          iconRight={<ChevronRight />}
          disabled={page >= pageCount || busy}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          className="hover:!bg-oat-200"
        >
          <span className="hidden sm:inline">Next</span>
        </Button>
      </div>
    </nav>
  );
};
