import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  dietaryAllergies: string | null;
  professionalInterests: string | null;
  technicalSkills: string | null;
  vipLevel: string | null;
}

export interface EventConfig {
  guestCount: number;
  layoutType: 'grid' | 'banquet' | 'u-shape';
  style: 'luxury' | 'minimal' | 'rustic';
  spacing: number;
  eventType: string;
  budget: string;
  colorPalette: string[];
}

interface AuraState {
  // Authentication
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;

  // Event Layout / Vibe
  layoutTheme: 'minimal' | 'neon' | 'ethereal';
  setLayoutTheme: (theme: 'minimal' | 'neon' | 'ethereal') => void;
  
  // Event Configuration for AR
  eventConfig: EventConfig;
  setEventConfig: (config: Partial<EventConfig>) => void;

  // Real-time Schedule Sync
  latestNotification: string | null;
  setNotification: (msg: string) => void;
}

export const useAuraStore = create<AuraState>((set) => ({
  currentUser: null,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),

  layoutTheme: 'minimal',
  setLayoutTheme: (theme) => set({ layoutTheme: theme }),
  
  eventConfig: {
    guestCount: 50,
    layoutType: 'grid',
    style: 'minimal',
    spacing: 2.2,
    eventType: 'Wedding',
    budget: 'Moderate',
    colorPalette: ['#ffffff', '#f0f0f0'],
  },
  setEventConfig: (newConfig) => set((state) => ({ 
    eventConfig: { ...state.eventConfig, ...newConfig } 
  })),

  latestNotification: null,
  setNotification: (msg) => set({ latestNotification: msg }),
}));
