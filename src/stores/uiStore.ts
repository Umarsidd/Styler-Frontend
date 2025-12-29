import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            theme: 'light',
            sidebarOpen: true,

            toggleTheme: () => {
                set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
            },

            toggleSidebar: () => {
                set((state) => ({ sidebarOpen: !state.sidebarOpen }));
            },

            setSidebarOpen: (open) => {
                set({ sidebarOpen: open });
            },
        }),
        {
            name: 'styler-ui',
        }
    )
);
