import React from 'react';
import { cn } from '../../lib/cn';

export interface WorkSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

/**
 * The warm oat ground the work sits on, beside the teal rail.
 *
 * Every page's content area uses this, so the ground colour is decided once.
 * The rail is the product's one full-height field of colour; everything to
 * its right is daylight — oat ground, white sheets, hairline rules — because
 * the use scene is a tablet on a kitchen table, not a control room.
 */
export const WorkSurface = React.forwardRef<HTMLElement, WorkSurfaceProps>(
  function WorkSurface({ className, children, ...rest }, ref) {
    return (
      <main ref={ref} className={cn('bg-oat-100', className)} {...rest}>
        {children}
      </main>
    );
  },
);
