import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
    theme: 'light' | 'dark';
    sidebarOpen: boolean;
    isLoginModalOpen: boolean;
    toggleTheme: () => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    openLoginModal: () => void;
    closeLoginModal: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            theme: 'light',
            sidebarOpen: true,
            isLoginModalOpen: false,

            toggleTheme: () => {
                set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
            },

            toggleSidebar: () => {
                set((state) => ({ sidebarOpen: !state.sidebarOpen }));
            },

            setSidebarOpen: (open) => {
                set({ sidebarOpen: open });
            },

            openLoginModal: () => set({ isLoginModalOpen: true }),
            closeLoginModal: () => set({ isLoginModalOpen: false }),
        }),
        {
            name: 'styler-ui',
        }
    )
);
