import { Brain, Gamepad2, Music2, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { btsMembers, btsSongs, btsTriviaQuestions } from "../data/bts-data";
import {
  cortisMembers,
  cortisSongs,
  cortisTriviaQuestions,
} from "../data/cortis-data";
import { getGroup } from "../data/groups";
import {
  illitMembers,
  illitSongs,
  illitTriviaQuestions,
} from "../data/illit-data";
import {
  lesserafimMembers,
  lesserafimSongs,
  lesserafimTriviaQuestions,
} from "../data/lesserafim-data";
import type { GroupId, Member, Song, TriviaQuestion } from "../types";
import MemberGuess from "./games/MemberGuess";
import SongGuesser from "./games/SongGuesser";
import TriviaGame from "./games/TriviaGame";

interface Props {
  groupId: GroupId;
}

type GameTab = "song" | "trivia" | "member";

const groupData: Record<
  GroupId,
  { members: Member[]; songs: Song[]; trivia: TriviaQuestion[] }
> = {
  illit: {
    members: illitMembers,
    songs: illitSongs,
    trivia: illitTriviaQuestions,
  },
  bts: { members: btsMembers, songs: btsSongs, trivia: btsTriviaQuestions },
  cortis: {
    members: cortisMembers,
    songs: cortisSongs,
    trivia: cortisTriviaQuestions,
  },
  lesserafim: {
    members: lesserafimMembers,
    songs: lesserafimSongs,
    trivia: lesserafimTriviaQuestions,
  },
};

const groupColors: Record<
  GroupId,
  { primary: string; glow: string; text: string }
> = {
  illit: {
    primary: "oklch(0.7 0.15 350)",
    glow: "rgba(224,102,204,0.35)",
    text: "#f0b8e8",
  },
  bts: {
    primary: "oklch(0.55 0.18 280)",
    glow: "rgba(120,80,220,0.35)",
    text: "#c9b8f8",
  },
  cortis: {
    primary: "oklch(0.6 0.18 200)",
    glow: "rgba(40,180,200,0.35)",
    text: "#7ee8f8",
  },
  lesserafim: {
    primary: "oklch(0.65 0.16 25)",
    glow: "rgba(220,130,40,0.35)",
    text: "#f8d878",
  },
};

const GAME_TABS: { id: GameTab; label: string; icon: typeof Gamepad2 }[] = [
  { id: "song", label: "Song Guesser", icon: Music2 },
  { id: "trivia", label: "Trivia", icon: Brain },
  { id: "member", label: "Member Guess", icon: User },
];

export default function GamesSection({ groupId }: Props) {
  const [activeTab, setActiveTab] = useState<GameTab>("song");
  const group = getGroup(groupId);
  const data = groupData[groupId];
  const colors = groupColors[groupId];

  if (!group) return null;

  return (
    <div className="space-y-6" data-ocid="games.section">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-xl"
          style={{
            background: `${colors.primary}22`,
            border: `1px solid ${colors.primary}44`,
          }}
        >
          <Gamepad2 className="w-5 h-5" style={{ color: colors.text }} />
        </div>
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">
            {group.name} Games
          </h2>
          <p className="text-xs text-muted-foreground">
            Test your knowledge &amp; have fun
          </p>
        </div>
      </div>

      {/* Tab nav */}
      <div
        className="flex gap-2 p-1 rounded-2xl"
        style={{
          background: "oklch(0.15 0 0 / 0.6)",
          border: "1px solid oklch(0.25 0 0 / 0.5)",
        }}
        data-ocid="games.tab"
        role="tablist"
      >
        {GAME_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              data-ocid={`games.${tab.id}.tab`}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={
                isActive
                  ? {
                      background: `linear-gradient(135deg, ${colors.primary}33, ${colors.primary}18)`,
                      color: colors.text,
                      boxShadow: `0 0 12px ${colors.glow}`,
                      border: `1px solid ${colors.primary}55`,
                    }
                  : {
                      color: "oklch(0.6 0 0)",
                      background: "transparent",
                      border: "1px solid transparent",
                    }
              }
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Game content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {activeTab === "song" && (
            <SongGuesser
              groupId={groupId}
              group={group}
              songs={data.songs}
              colors={colors}
            />
          )}
          {activeTab === "trivia" && (
            <TriviaGame
              groupId={groupId}
              group={group}
              questions={data.trivia}
              colors={colors}
            />
          )}
          {activeTab === "member" && (
            <MemberGuess
              groupId={groupId}
              group={group}
              members={data.members}
              colors={colors}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
