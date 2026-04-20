import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GroupId, SectionId } from "../types";

interface GameScore {
  score: number;
  total: number;
  date: string;
}

interface AppState {
  activeGroup: GroupId;
  activeSection: SectionId;
  savedFacts: string[];
  gameScores: Record<string, GameScore[]>;

  setActiveGroup: (group: GroupId) => void;
  setActiveSection: (section: SectionId) => void;
  toggleSavedFact: (factId: string) => void;
  saveGameScore: (
    gameType: string,
    groupId: GroupId,
    score: number,
    total: number,
  ) => void;
  isFactSaved: (factId: string) => boolean;
  getGroupScores: (gameType: string, groupId: GroupId) => GameScore[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      activeGroup: "bts",
      activeSection: "charts",
      savedFacts: [],
      gameScores: {},

      setActiveGroup: (group) => set({ activeGroup: group }),
      setActiveSection: (section) => set({ activeSection: section }),

      toggleSavedFact: (factId) =>
        set((state) => ({
          savedFacts: state.savedFacts.includes(factId)
            ? state.savedFacts.filter((id) => id !== factId)
            : [...state.savedFacts, factId],
        })),

      saveGameScore: (gameType, groupId, score, total) => {
        const key = `${gameType}-${groupId}`;
        const newEntry: GameScore = {
          score,
          total,
          date: new Date().toISOString(),
        };
        set((state) => ({
          gameScores: {
            ...state.gameScores,
            [key]: [...(state.gameScores[key] ?? []).slice(-9), newEntry],
          },
        }));
      },

      isFactSaved: (factId) => get().savedFacts.includes(factId),

      getGroupScores: (gameType, groupId) => {
        const key = `${gameType}-${groupId}`;
        return get().gameScores[key] ?? [];
      },
    }),
    {
      name: "bloom-app-store",
      partialize: (state) => ({
        savedFacts: state.savedFacts,
        gameScores: state.gameScores,
      }),
    },
  ),
);
