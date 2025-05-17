import { create } from 'zustand';
import type { Theme, TabName } from '../types';

type LoginState = {
  state: 'none' | 'username' | 'password';
  username?: string;
};

/**
 * Application State Store
 * 
 * This module defines the global state management for the application using Zustand.
 * It handles theme settings, tab navigation, command history, and UI state.
 */

// Define state interface
interface AppState {
  // Theme management
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Tab navigation
  currentTab: TabName;
  setCurrentTab: (tab: TabName) => void;

  // Command history (for terminal-like experience)
  commandHistory: string[];
  addCommand: (command: string) => void;
  historyIndex: number;
  setHistoryIndex: (index: number) => void;

  // UI state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  // Command mode state (for vim-like navigation)
  isCommandMode: boolean;
  toggleCommandMode: () => void;

  // Terminal initialization state
  isInitialized: boolean;
  setInitialized: (isInitialized: boolean) => void;

  // Login state machine
  currentLoginState: LoginState;
  setLoginState: (state: LoginState) => void;
}

// Create the store
export const useAppStore = create<AppState>((set) => ({
  // Default theme based on user preference
  theme: (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') as Theme,
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  // Default tab
  currentTab: 'about',
  setCurrentTab: (tab) => set({ currentTab: tab }),

  // Command history
  commandHistory: [],
  addCommand: (command) => set((state) => ({
    commandHistory: [...state.commandHistory, command],
    historyIndex: state.commandHistory.length + 1
  })),
  historyIndex: -1,
  setHistoryIndex: (index) => set({ historyIndex: index }),

  // Sidebar state
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Command mode (for vim-like navigation)
  isCommandMode: false,
  toggleCommandMode: () => set((state) => ({ isCommandMode: !state.isCommandMode })),

  // Terminal initialization state
  isInitialized: false,
  setInitialized: (isInitialized) => set({ isInitialized }),

  // Login state machine
  currentLoginState: { state: 'none' },
  setLoginState: (loginState) => set({ currentLoginState: loginState }),
}));
