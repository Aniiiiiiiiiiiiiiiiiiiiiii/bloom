import { CheckCircle, RotateCcw, Trophy, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import type { Group, GroupId, TriviaQuestion } from "../../types";

interface Props {
  groupId: GroupId;
  group: Group;
  questions: TriviaQuestion[];
  colors: { primary: string; glow: string; text: string };
}

type FilterCategory =
  | "all"
  | "members"
  | "songs"
  | "awards"
  | "history"
  | "general";

const CATEGORY_FILTERS: { id: FilterCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "members", label: "Members" },
  { id: "songs", label: "Songs" },
  { id: "awards", label: "Awards" },
  { id: "history", label: "History" },
  { id: "general", label: "General" },
];

const DIFFICULTY_COLORS = {
  easy: "oklch(0.68 0.18 145)",
  medium: "oklch(0.72 0.18 55)",
  hard: "oklch(0.65 0.22 22)",
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildPool(
  all: TriviaQuestion[],
  category: FilterCategory,
): TriviaQuestion[] {
  const filtered =
    category === "all" ? all : all.filter((q) => q.category === category);
  return shuffle(filtered).slice(0, 10);
}

export default function TriviaGame({
  groupId,
  group,
  questions,
  colors,
}: Props) {
  const saveGameScore = useAppStore((s) => s.saveGameScore);
  const [category, setCategory] = useState<FilterCategory>("all");
  const [pool, setPool] = useState<TriviaQuestion[]>(() =>
    buildPool(questions, "all"),
  );
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const q = pool[current];

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered || !q) return;
      setSelected(idx);
      setAnswered(true);
      if (idx === q.correctAnswer) setScore((s) => s + 1);
    },
    [answered, q],
  );

  const handleNext = useCallback(() => {
    if (current + 1 >= pool.length) {
      const finalScore = selected === q?.correctAnswer ? score + 1 : score;
      saveGameScore("trivia", groupId, finalScore, pool.length);
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [current, pool.length, score, selected, q, groupId, saveGameScore]);

  const handleRestart = useCallback(() => {
    const newPool = buildPool(questions, category);
    setPool(newPool);
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswered(false);
  }, [questions, category]);

  const handleCategoryChange = useCallback(
    (cat: FilterCategory) => {
      setCategory(cat);
      setPool(buildPool(questions, cat));
      setCurrent(0);
      setSelected(null);
      setScore(0);
      setFinished(false);
      setAnswered(false);
    },
    [questions],
  );

  if (finished) {
    const pct = Math.round((score / pool.length) * 100);
    const grade =
      pct >= 90
        ? "Ultimate Fan! 🏆"
        : pct >= 70
          ? "Super Fan! 🌟"
          : pct >= 50
            ? "Growing Fan 💫"
            : "Keep Learning! 📚";
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-elevated p-8 text-center space-y-4"
        style={{
          boxShadow: `0 0 30px ${colors.glow}`,
          border: `1px solid ${colors.primary}33`,
        }}
        data-ocid="trivia.result.panel"
      >
        <Trophy
          className="w-14 h-14 mx-auto"
          style={{ color: colors.primary }}
        />
        <div className="space-y-1">
          <h3
            className="font-display font-black text-3xl"
            style={{ color: colors.primary }}
          >
            {score}/{pool.length}
          </h3>
          <p className="text-lg font-semibold text-foreground">{grade}</p>
          <p className="text-sm text-muted-foreground">{pct}% correct</p>
        </div>
        <button
          type="button"
          onClick={handleRestart}
          data-ocid="trivia.play-again.button"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-smooth hover:scale-105 active:scale-95"
          style={{ background: colors.primary, color: "oklch(0.1 0 0)" }}
        >
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
      </motion.div>
    );
  }

  if (!q) {
    return (
      <div
        className="text-center py-10 text-muted-foreground"
        data-ocid="trivia.empty_state"
      >
        <p>No questions in this category. Try &quot;All&quot;!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="trivia.section">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-display font-bold text-foreground">
          {group.name} Trivia
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          10 questions · Test your knowledge
        </p>
      </div>

      {/* Category filter pills */}
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">Category filter</legend>
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = category === cat.id;
          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              data-ocid={`trivia.filter.${cat.id}`}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: isActive ? colors.primary : "oklch(0.18 0 0)",
                color: isActive ? "oklch(0.1 0 0)" : "oklch(0.65 0 0)",
                border: `1px solid ${isActive ? colors.primary : "oklch(0.28 0 0)"}`,
                boxShadow: isActive ? `0 0 8px ${colors.glow}` : undefined,
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </fieldset>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Question {current + 1} of {pool.length}
        </span>
        <span style={{ color: colors.primary, fontWeight: 700 }}>
          Score: {score}
        </span>
      </div>
      <div
        style={{ height: 4, borderRadius: 2, background: "oklch(0.22 0 0)" }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: 2,
            background: colors.primary,
            width: `${((current + 1) / pool.length) * 100}%`,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.2 }}
          className="card-elevated p-6 space-y-5"
          style={{ border: `1px solid ${colors.primary}22` }}
        >
          {/* Difficulty + category badge */}
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 999,
                background: `${DIFFICULTY_COLORS[q.difficulty]}22`,
                color: DIFFICULTY_COLORS[q.difficulty],
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {q.difficulty}
            </span>
            <span style={{ fontSize: 10, color: "oklch(0.5 0 0)" }}>
              {q.category}
            </span>
          </div>

          <p className="font-display font-semibold text-base text-foreground leading-snug">
            {q.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctAnswer;
              const isSelected = i === selected;
              let bg = "oklch(0.18 0 0)";
              let border = "oklch(0.28 0 0)";
              let color = "oklch(0.72 0 0)";

              if (answered) {
                if (isCorrect) {
                  bg = "oklch(0.22 0.06 145)";
                  border = "oklch(0.55 0.18 145)";
                  color = "oklch(0.88 0 0)";
                } else if (isSelected) {
                  bg = "oklch(0.2 0.06 22)";
                  border = "oklch(0.55 0.2 22)";
                  color = "oklch(0.75 0 0)";
                }
              } else if (isSelected) {
                bg = `${colors.primary}20`;
                border = colors.primary;
                color = "oklch(0.9 0 0)";
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(i)}
                  data-ocid={`trivia.option.${i + 1}`}
                  disabled={answered}
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    textAlign: "left",
                    fontSize: 13,
                    color,
                    cursor: answered ? "default" : "pointer",
                    transition: "all 0.18s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontWeight:
                      isSelected || (answered && isCorrect) ? 600 : 400,
                  }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background:
                        answered && isCorrect
                          ? "oklch(0.55 0.18 145)"
                          : answered && isSelected && !isCorrect
                            ? "oklch(0.55 0.2 22)"
                            : "oklch(0.25 0 0)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 700,
                      flexShrink: 0,
                      color: "oklch(0.9 0 0)",
                    }}
                  >
                    {answered && isCorrect ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : answered && isSelected ? (
                      <XCircle className="w-3 h-3" />
                    ) : (
                      ["A", "B", "C", "D"][i]
                    )}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background:
                  selected === q.correctAnswer
                    ? "oklch(0.18 0.04 145)"
                    : "oklch(0.18 0.04 22)",
                border: `1px solid ${selected === q.correctAnswer ? "oklch(0.45 0.15 145)" : "oklch(0.45 0.18 22)"}`,
                fontSize: 12,
                color: "oklch(0.75 0 0)",
                lineHeight: 1.5,
              }}
              data-ocid="trivia.explanation"
            >
              <strong style={{ color: "oklch(0.9 0 0)" }}>
                {selected === q.correctAnswer ? "✓ Correct! " : "✗ Incorrect. "}
              </strong>
              {q.explanation}
            </motion.div>
          )}

          {answered && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                data-ocid="trivia.next.button"
                style={{
                  background: colors.primary,
                  color: "oklch(0.1 0 0)",
                  border: "none",
                  borderRadius: 999,
                  padding: "8px 20px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {current + 1 >= pool.length ? "See Results" : "Next Question →"}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
