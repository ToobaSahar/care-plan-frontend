import React from 'react';
import { PanelLeftOpen } from 'lucide-react';
import { Button } from '../ui';
import { cn } from '../../lib/cn';

export interface SectionBarProps {
  title: string;
  /** 1-indexed section in view. */
  index: number;
  total: number;
  /** Whose record this is, once it has been recorded. */
  personName?: string;
  onOpenSections: () => void;
  /** Whether the section list it opens is currently open. */
  sectionsOpen: boolean;
  /** Id of the section list it opens. */
  sectionsId: string;
  className?: string;
}

/**
 * Where the assessor is, pinned to the top of a phone screen.
 *
 * On a phone the person header scrolls away with the page, so this bar
 * carries both answers an assessor needs at a glance — which section, and
 * whose record — and opens the full section list from its panel icon. It
 * holds the section heading at this width, in place of the one above the
 * sheet, so the title is not printed twice in a 56px band.
 */
export const SectionBar: React.FC<SectionBarProps> = ({
  title,
  index,
  total,
  personName,
  onOpenSections,
  sectionsOpen,
  sectionsId,
  className,
}) => (
  <div
    className={cn(
      'sticky top-0 z-20 flex items-center gap-3 border-b border-oat-200 bg-white px-4 py-2',
      className,
    )}
  >
    <Button
      variant="secondary"
      icon={<PanelLeftOpen />}
      aria-label="Open section list"
      aria-expanded={sectionsOpen}
      aria-controls={sectionsId}
      onClick={onOpenSections}
    />

    <div className="min-w-0 flex-1">
      <h2 className="truncate text-md font-semibold text-teal-800">{title}</h2>
      <p className="truncate text-xs tabular-nums text-oat-500">
        {personName && <span className="text-oat-700">{personName} · </span>}
        Section {index} of {total}
      </p>
    </div>
  </div>
);
