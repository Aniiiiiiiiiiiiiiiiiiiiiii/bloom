import { Eye, RotateCcw, Trophy } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import type { Group, GroupId, Member } from "../../types";

interface Props {
  groupId: GroupId;
  group: Group;
  members: Member[];
  colors: { primary: string; glow: string; text: string };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type HintDef = { label: string; getValue: (m: Member) => string };

const HINT_DEFS: HintDef[] = [
  { label: "Role", getValue: (m) => m.position },
  { label: "Birth Year", getValue: (m) => `Born in ${m.birthYear}` },
  { label: "First Letter", getValue: (m) => `Name starts with "${m.name[0]}"` },
  { label: "Nationality", getValue: (m) => m.nationality },
  {
    label: "Fun Fact",
    getValue: (m) => m.funFacts[0] ?? "Known for amazing stage presence",
  },
  { label: "Full Name", getValue: (m) => `It's ${m.name}!` },
];

const SESSION_LENGTH = 5;
const MEMBER_OPTION_KEYS = [
  "mo1",
  "mo2",
  "mo3",
  "mo4",
  "mo5",
  "mo6",
  "mo7",
] as const;

interface Round {
  member: Member;
  options: Member[];
}

function buildSession(members: Member[]): Round[] {
  return shuffle(members)
    .slice(0, SESSION_LENGTH)
    .map((member) => ({ member, options: shuffle(members) }));
}

export default function MemberGuess({
  groupId,
  group,
  members,
  colors,
}: Props) {
  const saveGameScore = useAppStore((s) => s.saveGameScore);
  const [session, setSession] = useState<Round[]>(() => buildSession(members));
  const [current, setCurrent] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const round = session[current];

  const handleSelect = useCallback(
    (memberId: string) => {
      if (answered || !round) return;
      const correct = memberId === round.member.id;
      setSelected(memberId);
      setAnswered(true);
      if (correct) setSessionScore((s) => s + 1);
    },
    [answered, round],
  );

  const handleRevealHint = useCallback(() => {
    setHintsRevealed((h) => Math.min(h + 1, HINT_DEFS.length));
  }, []);

  const handleNext = useCallback(() => {
    if (current + 1 >= session.length) {
      saveGameScore("member-guess", groupId, sessionScore, SESSION_LENGTH);
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
      setHintsRevealed(1);
    }
  }, [current, session.length, sessionScore, groupId, saveGameScore]);

  const handleRestart = useCallback(() => {
    setSession(buildSession(members));
    setCurrent(0);
    setSelected(null);
    setSessionScore(0);
    setFinished(false);
    setAnswered(false);
    setHintsRevealed(1);
  }, [members]);

  if (finished) {
    const pct = Math.round((sessionScore / SESSION_LENGTH) * 100);
    const grade =
      pct >= 80
        ? "True Member Expert! 👑"
        : pct >= 60
          ? "Super Fan! 💜"
          : pct >= 40
            ? "Getting There! 🌱"
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
        data-ocid="member-guess.result.panel"
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
            {sessionScore}/{SESSION_LENGTH}
          </h3>
          <p className="text-lg font-semibold text-foreground">{grade}</p>
          <p className="text-sm text-muted-foreground">{pct}% correct</p>
        </div>
        <button
          type="button"
          onClick={handleRestart}
          data-ocid="member-guess.play-again.button"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-smooth hover:scale-105 active:scale-95"
          style={{ background: colors.primary, color: "oklch(0.1 0 0)" }}
        >
          <RotateCcw className="w-4 h-4" /> Play Again
        </button>
      </motion.div>
    );
  }

  if (!round) return null;

  const hints = HINT_DEFS.slice(0, hintsRevealed).map((def) => ({
    label: def.label,
    value: def.getValue(round.member),
  }));

  return (
    <div className="space-y-4" data-ocid="member-guess.panel">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-display font-bold text-foreground">
          Guess the {group.name} member!
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Use clues to identify who it is
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Round {current + 1} of {session.length}
        </span>
        <span style={{ color: colors.primary, fontWeight: 700 }}>
          Score: {sessionScore}
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
            width: `${((current + 1) / session.length) * 100}%`,
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
          transition={{ duration: 0.22 }}
          className="card-elevated p-6 space-y-5"
          style={{ border: `1px solid ${colors.primary}22` }}
        >
          {/* Silhouette / initials card */}
          <div className="flex flex-col items-center gap-3 py-4">
            <motion.div
              animate={answered ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.4 }}
              style={{
                width: 90,
                height: 90,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.primary}44, ${colors.primary}11)`,
                border: `3px solid ${colors.primary}${answered ? "cc" : "55"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: answered ? `0 0 20px ${colors.glow}` : undefined,
                transition: "all 0.3s ease",
              }}
            >
              {answered ? (
                <span
                  className="font-display font-black text-xl"
                  style={{ color: colors.text }}
                >
                  {getInitials(round.member.name)}
                </span>
              ) : (
                <span
                  className="font-display font-black text-xl"
                  style={{ color: `${colors.primary}88` }}
                >
                  ?
                </span>
              )}
            </motion.div>
            <p className="font-display font-bold text-sm text-foreground">
              {answered ? round.member.name : "Who is this member?"}
            </p>
          </div>

          {/* Progressive hints */}
          <div className="space-y-2">
            <p
              className="text-xs font-semibold"
              style={{ color: colors.primary }}
            >
              Clues revealed ({hintsRevealed}/{HINT_DEFS.length}):
            </p>
            <div className="space-y-2">
              {hints.map((hint) => (
                <motion.div
                  key={hint.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "oklch(0.18 0 0)",
                    border: "1px solid oklch(0.26 0 0)",
                    fontSize: 12,
                    color: "oklch(0.78 0 0)",
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <span
                    style={{
                      color: colors.text,
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {hint.label}:
                  </span>
                  {hint.value}
                </motion.div>
              ))}
            </div>

            {!answered && hintsRevealed < HINT_DEFS.length && (
              <button
                type="button"
                onClick={handleRevealHint}
                data-ocid="member-guess.reveal-hint.button"
                className="flex items-center gap-1.5 transition-smooth hover:scale-105 active:scale-95"
                style={{
                  fontSize: 11,
                  color: colors.primary,
                  background: "transparent",
                  border: `1px solid ${colors.primary}44`,
                  borderRadius: 999,
                  padding: "4px 12px",
                  cursor: "pointer",
                }}
              >
                <Eye className="w-3 h-3" />
                Reveal next hint
              </button>
            )}
          </div>

          {/* Member options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {round.options.map((m, idx) => {
              const isCorrect = m.id === round.member.id;
              const isSelected = m.id === selected;
              let bg = "oklch(0.18 0 0)";
              let border = "oklch(0.26 0 0)";
              let color = "oklch(0.72 0 0)";

              if (answered) {
                if (isCorrect) {
                  bg = "oklch(0.22 0.06 145)";
                  border = "oklch(0.55 0.18 145)";
                  color = "oklch(0.88 0 0)";
                } else if (isSelected) {
                  bg = "oklch(0.2 0.06 22)";
                  border = "oklch(0.5 0.18 22)";
                  color = "oklch(0.65 0 0)";
                }
              }

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelect(m.id)}
                  data-ocid={`member-guess.option.${MEMBER_OPTION_KEYS[idx] ?? idx + 1}`}
                  disabled={answered}
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontSize: 13,
                    fontWeight:
                      isSelected || (answered && isCorrect) ? 700 : 400,
                    color,
                    cursor: answered ? "default" : "pointer",
                    transition: "all 0.18s ease",
                    textAlign: "center",
                  }}
                >
                  {m.name}
                </button>
              );
            })}
          </div>

          {/* Result feedback */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background:
                  selected === round.member.id
                    ? "oklch(0.18 0.04 145)"
                    : "oklch(0.18 0.04 22)",
                border: `1px solid ${selected === round.member.id ? "oklch(0.45 0.15 145)" : "oklch(0.45 0.18 22)"}`,
                fontSize: 12,
                color: "oklch(0.75 0 0)",
                lineHeight: 1.5,
              }}
              data-ocid="member-guess.feedback"
            >
              <strong style={{ color: "oklch(0.9 0 0)" }}>
                {selected === round.member.id
                  ? `✓ Correct! It's ${round.member.name}! `
                  : `✗ It was ${round.member.name}! `}
              </strong>
              {round.member.bio.slice(0, 100)}…
            </motion.div>
          )}

          {answered && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                data-ocid="member-guess.next.button"
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
                {current + 1 >= session.length
                  ? "See Results"
                  : "Next Member →"}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
