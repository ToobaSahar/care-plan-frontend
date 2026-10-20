import React from 'react';
import type { RiskLevel } from '../ui';
import { cn } from '../../lib/cn';

/**
 * The record's risk, as the edge of the page.
 *
 * A full-height bar sitting between the fields and their evidence, carrying
 * the highest risk anywhere in the record. It is the workspace's signature
 * device: severity becomes ambient and peripheral rather than something an
 * assessor has to go and read. The thesis says risk is a layer riding over
 * the record — this is that layer, given an edge.
 *
 * It is decoration-free by construction: it encodes exactly one value, it is
 * never the only carrier of that value (the header badge names it in words),
 * and it is hidden from assistive tech because the badge already says it.
 */
// Low stays close to the ground it sits on: a record with nothing flagged
// should not draw the eye. Severity is what earns contrast here.
const SPINE: Record<RiskLevel, string> = {
  low: 'bg-teal-600',
  medium: 'bg-orange-400',
  high: 'bg-orange-500',
  critical: 'bg-red-600',
};

export const RiskSpine: React.FC<{
  level: RiskLevel;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}> = ({ level, orientation = 'vertical', className }) => (
  <div
    aria-hidden="true"
    className={cn(
      'flex-none transition-colors duration-slow ease-out',
      orientation === 'vertical' ? 'w-1' : 'h-1 w-full',
      SPINE[level],
      className,
    )}
  />
);
