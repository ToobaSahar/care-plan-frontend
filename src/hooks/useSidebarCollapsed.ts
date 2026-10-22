import { useSyncExternalStore } from 'react';

/* ──────────────────────────────────────────────────────────────────────────
   Whether the sidebar is collapsed to its icon strip — one preference for
   every screen that has a sidebar.

   Held in one module-level store rather than per-component state, so the
   assessment and the workspace screens always agree, a choice made on one is
   already in place on the next, and another tab picks it up through the
   storage event. Kept in memory as well as in localStorage, so collapsing
   still works for the visit when storage is blocked.
   ────────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = 'careframe.sidebar.collapsed';

function readStored(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

let collapsed = readStored();
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function onStorage(e: StorageEvent): void {
  if (e.key !== STORAGE_KEY) return;
  collapsed = e.newValue === 'true';
  emit();
}

function subscribe(listener: () => void): () => void {
  if (listeners.size === 0) window.addEventListener('storage', onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('storage', onStorage);
  };
}

const getSnapshot = () => collapsed;
const getServerSnapshot = () => false;

export function setSidebarCollapsed(next: boolean): void {
  if (next === collapsed) return;
  collapsed = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // Storage blocked or full: the choice holds for this visit, just not the next.
  }
  emit();
}

export function useSidebarCollapsed(): [boolean, (next: boolean) => void] {
  return [useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot), setSidebarCollapsed];
}
