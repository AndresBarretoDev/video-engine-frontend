/**
 * OP Video Engine — Sidebar Store (UI State only)
 *
 * Manages sidebar open/collapsed state.
 * Note: shadcn SidebarProvider handles its own internal state.
 * This store supplements it for mobile sheet + desktop rail persistence.
 *
 * Spec: SPEC-LAYOUT-003
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarStore {
  isOpen: boolean;
  isCollapsed: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    set => ({
      isOpen: false,
      isCollapsed: false,
      toggle: () => set(state => ({ isOpen: !state.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setCollapsed: collapsed => set({ isCollapsed: collapsed })
    }),
    {
      name: 'op-sidebar-state',
      partialize: state => ({ isCollapsed: state.isCollapsed })
    }
  )
);
