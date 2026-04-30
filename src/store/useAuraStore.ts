import { create } from 'zustand';

interface AuraState {
  // Event Layout / Vibe
  layoutTheme: 'minimal' | 'neon' | 'ethereal';
  setLayoutTheme: (theme: 'minimal' | 'neon' | 'ethereal') => void;
  
  // Real-time Schedule Sync
  latestNotification: string | null;
  setNotification: (msg: string) => void;
}

export const useAuraStore = create<AuraState>((set) => ({
  layoutTheme: 'minimal',
  setLayoutTheme: (theme) => set({ layoutTheme: theme }),
  
  latestNotification: null,
  setNotification: (msg) => set({ latestNotification: msg }),
}));
