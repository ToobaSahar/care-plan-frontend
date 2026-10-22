import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tooltip } from '../ui';
import { cn } from '../../lib/cn';

/** Full sidebar and icon strip widths, shared by every screen. */
const WIDTH = {
  expanded: 'w-[248px]',
  collapsed: 'w-[72px]',
} as const;

export interface RailToggleProps {
  /** Which way the sidebar moves when pressed. */
  direction: 'collapse' | 'expand';
  onClick: () => void;
  /** Whether the sidebar this controls is currently open. */
  expanded: boolean;
  /** Id of the sidebar this controls. */
  controls?: string;
  /** Overrides the default "Collapse sidebar" / "Expand sidebar". */
  label?: string;
}

/**
 * The handle on the sidebar's edge.
 *
 * A 24px round handle straddling the hairline between the sidebar and the
 * work, low on the edge where it is out of the way of the navigation. Inset
 * content stops 12px short of the edge, so the handle never covers a row.
 * Its hit area reaches 40px, for a finger on a tablet. It is styled as the
 * secondary button at handle scale: white, oat edge, Deep Sea mark, and
 * committing to teal on hover.
 */
export const RailToggle: React.FC<RailToggleProps> = ({
  direction,
  onClick,
  expanded,
  controls,
  label,
}) => {
  const name = label ?? (direction === 'collapse' ? 'Collapse sidebar' : 'Expand sidebar');
  const Icon = direction === 'collapse' ? ChevronLeft : ChevronRight;

  return (
    <Tooltip label={name}>
      <button
        type="button"
        onClick={onClick}
        aria-label={name}
        aria-expanded={expanded}
        aria-controls={controls}
        className={cn(
          'absolute -right-3 bottom-36 z-30 flex h-6 w-6 items-center justify-center rounded-full',
          'border border-oat-300 bg-white text-teal-700 shadow-xs',
          'transition-colors duration-fast ease-out hover:border-teal-600 hover:bg-teal-50 active:bg-teal-100',
          "before:absolute before:-inset-2 before:content-['']",
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </Tooltip>
  );
};

export interface RailFrameProps {
  /** Full sidebar, or the icon strip. */
  expanded: boolean;
  onToggle: () => void;
  /** Id of what the edge toggle controls: this sidebar, or a drawer. */
  controls?: string;
  /** Whether what the toggle controls is open. Defaults to `expanded`. */
  toggleExpanded?: boolean;
  /** Visibility per breakpoint, e.g. `hidden lg:block`. */
  className?: string;
  children: React.ReactNode;
}

/**
 * The docked sidebar's frame, for every screen that has one.
 *
 * It pins the sidebar to the viewport, owns the hairline edge and the handle
 * on it, and animates its width. The sidebar inside is already at its final
 * width and the frame clips it, so collapsing slides one hairline across
 * rather than reflowing the labels frame by frame. The handle sits outside
 * the clip, so it can straddle the edge.
 */
export const RailFrame: React.FC<RailFrameProps> = ({
  expanded,
  onToggle,
  controls,
  toggleExpanded,
  className,
  children,
}) => {
  const width = expanded ? WIDTH.expanded : WIDTH.collapsed;

  return (
    <div
      className={cn(
        'sticky top-0 h-viewport flex-none self-start border-r border-oat-200 bg-oat-100',
        'transition-[width] duration-slow ease-out',
        width,
        className,
      )}
    >
      <div className="h-full overflow-hidden">
        <div className={cn('h-full', width)}>{children}</div>
      </div>

      <RailToggle
        direction={expanded ? 'collapse' : 'expand'}
        onClick={onToggle}
        expanded={toggleExpanded ?? expanded}
        controls={controls}
      />
    </div>
  );
};
