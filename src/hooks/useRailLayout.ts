import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from './useMediaQuery';
import { useSidebarCollapsed } from './useSidebarCollapsed';

/**
 * The width from which each screen's full sidebar can sit beside its work.
 *
 * Workspace screens dock from Tailwind `lg`, as they always have. The
 * assessment needs `xl`: only from there do the full rail, a two-column field
 * sheet and the evidence column all fit side by side.
 */
export const RAIL_DOCK = {
  workspace: '(min-width: 1024px)',
  assessment: '(min-width: 1280px)',
} as const;

export interface RailLayout {
  /** The viewport is wide enough for the full sidebar to sit beside the work. */
  canDock: boolean;
  /** The docked sidebar shows titles. Always false below the docking width. */
  expanded: boolean;
  /** The full sidebar is open over the content (narrow screens only). */
  drawerOpen: boolean;
  /** Collapse or expand in place when docked; open or close the drawer otherwise. */
  toggle: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

/**
 * Where the sidebar lives at the current width.
 *
 * When it can dock, it is full or collapsed to the icon strip by the one
 * product-wide preference, so it looks the same from screen to screen. Below
 * the docking width the strip is the only docked form; expanding it opens a
 * drawer, which is transient, so it never changes the preference.
 */
export function useRailLayout(dockQuery: string): RailLayout {
  const canDock = useMediaQuery(dockQuery);
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Widening past the docking point hands over to the docked sidebar; a
  // drawer left open would sit on top of it.
  useEffect(() => {
    if (canDock) setDrawerOpen(false);
  }, [canDock]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const toggle = useCallback(() => {
    if (canDock) setCollapsed(!collapsed);
    else setDrawerOpen((open) => !open);
  }, [canDock, collapsed, setCollapsed]);

  return {
    canDock,
    expanded: canDock && !collapsed,
    drawerOpen,
    toggle,
    openDrawer,
    closeDrawer,
  };
}
