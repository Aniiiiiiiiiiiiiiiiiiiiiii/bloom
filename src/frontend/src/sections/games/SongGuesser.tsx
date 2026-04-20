import { CheckCircle, Music, Play, RotateCcw, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import type { Group, GroupId, Song } from "../../types";

interface Props {
  groupId: GroupId;
  group: Group;
  songs: Song[];
  colors: { primary: string; glow: string; text: string };
}

const HINT_DURATIONS = ["1s", "3s", "6s", "12s", "25s", "Full"];
const MAX_ATTEMPTS = 6;
const WAVE_COUNT = 28;
const ATTEMPT_KEYS = ["a1", "a2", "a3", "a4", "a5", "a6"] as const;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickOptions(correct: Song, pool: Song[]): Song[] {
  const others = shuffle(pool.filter((s) => s.id !== correct.id)).slice(0, 3);
  return shuffle([correct, ...others]);
}

function genBars(): { height: number; key: string }[] {
  return Array.from({ length: WAVE_COUNT }, (_, i) => ({
    height: 20 + Math.sin(i * 0.7) * 14 + Math.random() * 16,
    key: `bar-${i}`,
  }));
}

interface GameState {
  song: Song;
  options: Song[];
  attempt: number;
  guesses: (boolean | null)[];
  status: "playing" | "won" | "lost";
  selectedIdx: number | null;
  bars: { height: number; key: string }[];
}

function startGame(songs: Song[]): GameState {
  const song = songs[Math.floor(Math.random() * songs.length)];
  return {
    song,
    options: pickOptions(song, songs),
    attempt: 0,
    guesses: Array(MAX_ATTEMPTS).fill(null),
    status: "playing",
    selectedIdx: null,
    bars: genBars(),
  };
}

export default function SongGuesser({ groupId, group, songs, colors }: Props) {
  const saveGameScore = useAppStore((s) => s.saveGameScore);
  const [game, setGame] = useState<GameState>(() => startGame(songs));
  const [isShaking, setIsShaking] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleGuess = useCallback(
    (idx: number) => {
      if (game.status !== "playing" || game.selectedIdx !== null) return;
      const correct = game.options[idx].id === game.song.id;
      const newGuesses = [...game.guesses];
      newGuesses[game.attempt] = correct;

      setGame((g) => ({ ...g, selectedIdx: idx }));
      setShowFeedback(true);

      setTimeout(() => {
        if (correct) {
          saveGameScore(
            "song-guesser",
            groupId,
            MAX_ATTEMPTS - game.attempt,
            MAX_ATTEMPTS,
          );
          setGame((g) => ({ ...g, guesses: newGuesses, status: "won" }));
        } else {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 600);
          const nextAttempt = game.attempt + 1;
          const newStatus: GameState["status"] =
            nextAttempt >= MAX_ATTEMPTS ? "lost" : "playing";
          if (newStatus === "lost")
            saveGameScore("song-guesser", groupId, 0, MAX_ATTEMPTS);
          setGame((g) => ({
            ...g,
            guesses: newGuesses,
            attempt: nextAttempt,
            status: newStatus,
            selectedIdx: null,
          }));
        }
        setShowFeedback(false);
      }, 1000);
    },
    [game, groupId, saveGameScore],
  );

  const handleReset = () => setGame(startGame(songs));
  const activeHint = HINT_DURATIONS[Math.min(game.attempt, MAX_ATTEMPTS - 1)];
  const isDone = game.status !== "playing";

  return (
    <div className="space-y-5" data-ocid="song-guesser.panel">
      <div className="text-center">
        <h3 className="text-lg font-display font-bold text-foreground">
          Guess the {group.name} song!
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Pick the correct song from the hint below
        </p>
      </div>

      {/* Attempt dots */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-muted-foreground">
          Attempt {Math.min(game.attempt + 1, MAX_ATTEMPTS)} of {MAX_ATTEMPTS}
        </span>
        <div className="flex gap-1.5">
          {ATTEMPT_KEYS.map((key, i) => {
            const g = game.guesses[i];
            return (
              <div
                key={key}
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  background:
                    g === true
                      ? colors.primary
                      : g === false
                        ? "oklch(0.65 0.19 22)"
                        : i === game.attempt && game.status === "playing"
                          ? `${colors.primary}66`
                          : "oklch(0.25 0 0)",
                  boxShadow: g === true ? `0 0 6px ${colors.glow}` : undefined,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Fake audio player */}
      <motion.div
        animate={isShaking ? { x: [-6, 6, -5, 5, -3, 3, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="rounded-2xl p-5 space-y-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.15 0 0 / 0.9), oklch(0.12 0 0 / 0.9))",
          border: `1px solid ${colors.primary}33`,
          boxShadow: `0 0 20px ${colors.glow}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: `${colors.primary}22`,
              border: `1px solid ${colors.primary}55`,
            }}
          >
            <Play className="w-4 h-4 ml-0.5" style={{ color: colors.text }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">
              {isDone ? game.song.title : "???"}
            </p>
            <p className="text-xs font-medium" style={{ color: colors.text }}>
              Hint: {activeHint}
              {isDone ? " — Full" : ""}
            </p>
          </div>
          <Music
            className="w-4 h-4 flex-shrink-0"
            style={{ color: colors.text, opacity: 0.5 }}
          />
        </div>

        {/* Waveform */}
        <div className="flex items-end gap-[3px] h-12 w-full">
          {game.bars.map((bar, i) => {
            const progress = isDone ? 1 : game.attempt / MAX_ATTEMPTS;
            const isActive = i / WAVE_COUNT < progress;
            return (
              <motion.div
                key={bar.key}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.015, duration: 0.3 }}
                className="flex-1 rounded-full"
                style={{
                  height: `${bar.height}px`,
                  background: isActive ? colors.primary : "oklch(0.28 0 0)",
                  opacity: isActive ? 0.9 : 0.5,
                  transformOrigin: "bottom",
                }}
              />
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: colors.primary }}
            initial={{ width: "0%" }}
            animate={{
              width: isDone
                ? "100%"
                : `${(game.attempt / MAX_ATTEMPTS) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Options or Result */}
      <AnimatePresence mode="wait">
        {!isDone ? (
          <motion.div
            key="options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {game.options.map((opt, idx) => {
              const isSelected = game.selectedIdx === idx;
              const isCorrect = opt.id === game.song.id;
              const bg =
                showFeedback && isSelected
                  ? isCorrect
                    ? "oklch(0.25 0.1 145)"
                    : "oklch(0.25 0.1 22)"
                  : "oklch(0.18 0 0)";
              const border =
                showFeedback && isSelected
                  ? isCorrect
                    ? "oklch(0.55 0.18 145)"
                    : "oklch(0.65 0.19 22)"
                  : "oklch(0.28 0 0)";
              const textColor =
                showFeedback && isSelected
                  ? isCorrect
                    ? "oklch(0.75 0.18 145)"
                    : "oklch(0.75 0.19 22)"
                  : "oklch(0.88 0 0)";

              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => handleGuess(idx)}
                  disabled={game.selectedIdx !== null}
                  data-ocid={`song-guesser.option.${idx + 1}`}
                  className="p-3 rounded-xl text-sm font-medium text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-default disabled:hover:scale-100"
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    color: textColor,
                  }}
                >
                  <span className="text-xs opacity-60 block mb-0.5">
                    Option {idx + 1}
                  </span>
                  <span className="truncate block">{opt.title}</span>
                </button>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="rounded-2xl p-5 text-center space-y-4"
            style={{
              background:
                game.status === "won"
                  ? `linear-gradient(135deg, ${colors.primary}18, ${colors.primary}08)`
                  : "linear-gradient(135deg, oklch(0.2 0.05 22 / 0.4), oklch(0.15 0.03 22 / 0.2))",
              border: `1px solid ${game.status === "won" ? `${colors.primary}44` : "oklch(0.65 0.19 22 / 0.4)"}`,
            }}
          >
            {game.status === "won" ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                  className="text-4xl"
                >
                  🎉
                </motion.div>
                <div>
                  <p
                    className="font-display font-bold text-lg"
                    style={{ color: colors.text }}
                  >
                    Correct!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Got it in {game.attempt + 1} attempt
                    {game.attempt !== 0 ? "s" : ""}!
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl">💔</div>
                <p className="font-display font-bold text-lg text-foreground">
                  The answer was…
                </p>
              </>
            )}

            <div
              className="rounded-xl p-4 text-left space-y-1"
              style={{
                background: "oklch(0.15 0 0 / 0.6)",
                border: "1px solid oklch(0.25 0 0 / 0.4)",
              }}
            >
              <p className="font-display font-bold text-base text-foreground">
                {game.song.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {game.song.album} · {game.song.releaseYear}
              </p>
              <p className="text-xs" style={{ color: colors.text }}>
                {(game.song.streams / 1_000_000).toFixed(0)}M streams
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              data-ocid="song-guesser.play-again.button"
              className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}cc)`,
                color: "oklch(0.1 0 0)",
                boxShadow: `0 4px 16px ${colors.glow}`,
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wrong guess pills */}
      {!isDone && game.guesses.some((g) => g === false) && (
        <div className="flex flex-wrap gap-2">
          {game.guesses.map((g, i) => {
            const k = ATTEMPT_KEYS[i];
            if (g === false)
              return (
                <div
                  key={k}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    background: "oklch(0.25 0.06 22 / 0.4)",
                    color: "oklch(0.75 0.19 22)",
                  }}
                >
                  <XCircle className="w-3 h-3" />
                  Wrong #{i + 1}
                </div>
              );
            if (g === true)
              return (
                <div
                  key={k}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    background: "oklch(0.25 0.08 145 / 0.4)",
                    color: "oklch(0.7 0.18 145)",
                  }}
                >
                  <CheckCircle className="w-3 h-3" />
                  Correct!
                </div>
              );
            return null;
          })}
        </div>
      )}
    </div>
  );
}
