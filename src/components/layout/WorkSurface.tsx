import React from 'react';
import { cn } from '../../lib/cn';

export interface WorkSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

/**
 * The warm plane the work sits on, lifted off the shell's teal ground.
 *
 * Every page's content area uses this, so the corner radius, ground colour and
 * elevation are decided once. Two pages previously set these by hand and had
 * already drifted apart — one rounded both top corners, the other only the
 * right — which is exactly the failure this component exists to prevent.
 */
export const WorkSurface = React.forwardRef<HTMLElement, WorkSurfaceProps>(
  function WorkSurface({ className, children, ...rest }, ref) {
    return (
      <main
        ref={ref}
        className={cn('rounded-t-2xl bg-oat-50 shadow-xl', className)}
        {...rest}
      >
        {children}
      </main>
    );
  },
);
