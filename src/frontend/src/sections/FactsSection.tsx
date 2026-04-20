import { Button } from "@/components/ui/button";
import { Disc3, Heart, ListMusic, Shuffle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { btsDiscography, btsFunFacts } from "../data/bts-data";
import { cortisDiscography, cortisFunFacts } from "../data/cortis-data";
import { getGroup } from "../data/groups";
import { illitDiscography, illitFunFacts } from "../data/illit-data";
import {
  lesserafimDiscography,
  lesserafimFunFacts,
} from "../data/lesserafim-data";
import { useAppStore } from "../store/useAppStore";
import type { DiscographyEntry, FunFact, GroupId } from "../types";

interface Props {
  groupId: GroupId;
}

const factsByGroup: Record<GroupId, FunFact[]> = {
  illit: illitFunFacts,
  bts: btsFunFacts,
  cortis: cortisFunFacts,
  lesserafim: lesserafimFunFacts,
};

const discographyByGroup: Record<GroupId, DiscographyEntry[]> = {
  illit: illitDiscography,
  bts: btsDiscography,
  cortis: cortisDiscography,
  lesserafim: lesserafimDiscography,
};

type FactCategory = "all" | FunFact["category"];
type DiscFilter = "all" | DiscographyEntry["type"];

const FACT_CATEGORIES: { label: string; value: FactCategory }[] = [
  { label: "All", value: "all" },
  { label: "Achievement", value: "achievement" },
  { label: "Member", value: "member" },
  { label: "Music", value: "music" },
  { label: "History", value: "history" },
  { label: "Fun", value: "fun" },
];

const DISC_FILTERS: { label: string; value: DiscFilter }[] = [
  { label: "All", value: "all" },
  { label: "Albums", value: "album" },
  { label: "Mini-Albums", value: "mini-album" },
  { label: "Singles", value: "single" },
  { label: "EPs", value: "ep" },
];

const categoryEmojis: Record<FactCategory, string> = {
  all: "✦",
  achievement: "🏆",
  member: "⭐",
  music: "🎵",
  history: "📖",
  fun: "✨",
};

const categoryColors: Record<FactCategory, string> = {
  all: "oklch(0.7 0.1 280)",
  achievement: "oklch(0.72 0.18 55)",
  member: "oklch(0.72 0.18 350)",
  music: "oklch(0.65 0.18 200)",
  history: "oklch(0.6 0.15 260)",
  fun: "oklch(0.68 0.16 130)",
};

function formatReleaseDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getTypeBadgeStyle(
  _type: DiscographyEntry["type"],
  groupColor: string,
) {
  return {
    background: `${groupColor}20`,
    color: groupColor,
    border: `1px solid ${groupColor}35`,
  };
}

// ---------- Facts Tab ----------
function FactsTab({
  groupId,
  groupColor,
}: { groupId: GroupId; groupColor: string }) {
  const facts = factsByGroup[groupId];
  const [activeCategory, setActiveCategory] = useState<FactCategory>("all");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const { toggleSavedFact, isFactSaved } = useAppStore();
  const factRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtered =
    activeCategory === "all"
      ? facts
      : facts.filter((f) => f.category === activeCategory);

  const randomFact = useCallback(() => {
    const available = filtered.length > 0 ? filtered : facts;
    const pick = available[Math.floor(Math.random() * available.length)];
    if (!pick) return;
    setHighlightedId(pick.id);
    const el = factRefs.current[pick.id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlightedId(null), 2200);
  }, [filtered, facts]);

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            {facts.length} Fun Facts
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Save your favourites with the heart icon
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 shrink-0"
          style={{ borderColor: `${groupColor}50`, color: groupColor }}
          onClick={randomFact}
          data-ocid="facts.random_button"
        >
          <Shuffle className="w-4 h-4" />
          Random Fact
        </Button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2" data-ocid="facts.filter.tab">
        {FACT_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              className="text-xs px-3 py-1.5 rounded-full font-medium transition-smooth border"
              style={
                isActive
                  ? {
                      background: `${groupColor}25`,
                      color: groupColor,
                      borderColor: `${groupColor}60`,
                    }
                  : {
                      background: "oklch(0.18 0 0 / 0.6)",
                      color: "oklch(0.7 0 0)",
                      borderColor: "oklch(0.3 0 0 / 0.4)",
                    }
              }
              onClick={() => setActiveCategory(cat.value)}
              data-ocid={`facts.category.${cat.value}`}
            >
              {categoryEmojis[cat.value]} {cat.label}
            </button>
          );
        })}
      </div>

      {/* Facts grid — 2 column masonry */}
      <div className="columns-1 sm:columns-2 gap-4 space-y-0">
        {filtered.map((fact, index) => {
          const isSaved = isFactSaved(fact.id);
          const isHighlighted = highlightedId === fact.id;
          const catColor = categoryColors[fact.category] ?? groupColor;

          return (
            <motion.div
              key={fact.id}
              ref={(el) => {
                factRefs.current[fact.id] = el;
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: Math.min(index * 0.04, 0.4),
              }}
              className="break-inside-avoid mb-4 rounded-xl border p-4 relative group"
              style={{
                background: isHighlighted
                  ? `${groupColor}18`
                  : isSaved
                    ? "oklch(0.17 0 0 / 0.9)"
                    : "oklch(0.155 0 0 / 0.9)",
                borderColor: isHighlighted
                  ? `${groupColor}70`
                  : isSaved
                    ? "oklch(0.17 0 0 / 0.5)"
                    : "oklch(0.28 0 0 / 0.5)",
                boxShadow: isHighlighted
                  ? `0 0 24px ${groupColor}25`
                  : isSaved
                    ? "0 0 12px oklch(0.72 0.18 55 / 0.15)"
                    : "none",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                animation: isHighlighted
                  ? "pulse-glow 0.6s ease-in-out infinite alternate"
                  : undefined,
              }}
              data-ocid={`facts.item.${index + 1}`}
            >
              <div className="flex items-start gap-3">
                {/* Emoji */}
                <span className="text-xl shrink-0 mt-0.5">{fact.emoji}</span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/85 leading-relaxed">
                    {fact.text}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center flex-wrap gap-2 mt-2.5">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{
                        background: `${catColor}20`,
                        color: catColor,
                        border: `1px solid ${catColor}35`,
                      }}
                    >
                      {categoryEmojis[fact.category]} {fact.category}
                    </span>
                    {fact.memberName && (
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: `${groupColor}15`,
                          color: groupColor,
                          border: `1px solid ${groupColor}30`,
                        }}
                      >
                        {fact.memberName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Heart button */}
                <button
                  type="button"
                  className="shrink-0 p-1.5 rounded-full transition-smooth"
                  style={{
                    background: isSaved
                      ? "oklch(0.72 0.18 55 / 0.2)"
                      : "oklch(0.22 0 0 / 0.6)",
                    color: isSaved ? "oklch(0.72 0.18 55)" : "oklch(0.55 0 0)",
                  }}
                  onClick={() => toggleSavedFact(fact.id)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && toggleSavedFact(fact.id)
                  }
                  aria-label={isSaved ? "Remove from saved" : "Save fact"}
                  data-ocid={`facts.save_button.${index + 1}`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="facts.empty_state"
        >
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No facts in this category yet</p>
        </div>
      )}
    </div>
  );
}

// ---------- Discography Timeline ----------
interface TimelineEntryProps {
  entry: DiscographyEntry;
  index: number;
  groupColor: string;
  isRight: boolean;
}

function TimelineEntry({
  entry,
  index,
  groupColor,
  isRight,
}: TimelineEntryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const typeLabel =
    entry.type === "mini-album"
      ? "Mini-Album"
      : entry.type.charAt(0).toUpperCase() + entry.type.slice(1);

  return (
    <div
      ref={ref}
      className={`relative flex gap-4 md:gap-0 ${isRight ? "md:flex-row-reverse" : "md:flex-row"}`}
      data-ocid={`discography.item.${index + 1}`}
    >
      {/* Center dot + line (desktop) */}
      <div className="hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2 top-0 bottom-0 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={visible ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="w-4 h-4 rounded-full border-2 mt-1 shrink-0"
          style={{
            background: groupColor,
            borderColor: `${groupColor}80`,
            boxShadow: `0 0 12px ${groupColor}50`,
          }}
        />
      </div>

      {/* Left/Right spacer */}
      <div className="hidden md:block w-1/2" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, x: isRight ? 40 : -40 }}
        animate={
          visible ? { opacity: 1, x: 0 } : { opacity: 0, x: isRight ? 40 : -40 }
        }
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={`w-full md:w-[calc(50%-2rem)] rounded-xl border p-4 ${isRight ? "md:mr-8" : "md:ml-8"}`}
        style={{
          background: "oklch(0.155 0 0 / 0.9)",
          borderColor: "oklch(0.28 0 0 / 0.5)",
        }}
      >
        {/* Mobile dot */}
        <div
          className="md:hidden w-3 h-3 rounded-full inline-block mr-2 align-middle"
          style={{ background: groupColor }}
        />

        {/* Release date */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-mono text-muted-foreground">
            {formatReleaseDate(entry.releaseDate)}
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
            style={getTypeBadgeStyle(entry.type, groupColor)}
          >
            {typeLabel}
          </span>
        </div>

        {/* Album visual + title */}
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold font-display"
            style={{
              background: `${entry.coverColor}30`,
              color: entry.coverColor,
              border: `1px solid ${entry.coverColor}40`,
            }}
          >
            {entry.title.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-bold text-foreground text-sm leading-tight">
              {entry.title}
            </h4>
            {entry.description && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                {entry.description}
              </p>
            )}
          </div>
        </div>

        {/* Track list */}
        <div className="mt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Tracks
          </p>
          <div className="flex flex-wrap gap-1.5">
            {entry.tracks.slice(0, 5).map((track) => (
              <span
                key={track}
                className="text-[10px] px-1.5 py-0.5 rounded border text-muted-foreground"
                style={{
                  borderColor: "oklch(0.3 0 0 / 0.5)",
                  background: "oklch(0.2 0 0 / 0.4)",
                }}
              >
                {track}
              </span>
            ))}
            {entry.tracks.length > 5 && (
              <span className="text-[10px] text-muted-foreground px-1">
                +{entry.tracks.length - 5} more
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DiscographyTab({
  groupId,
  groupColor,
}: { groupId: GroupId; groupColor: string }) {
  const allEntries = discographyByGroup[groupId];
  const [filter, setFilter] = useState<DiscFilter>("all");

  const filtered =
    filter === "all" ? allEntries : allEntries.filter((e) => e.type === filter);

  return (
    <div className="space-y-5">
      {/* Header + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">
            Discography Timeline
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {allEntries.length} releases
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2"
          data-ocid="discography.filter.tab"
        >
          {DISC_FILTERS.map((f) => {
            const isActive = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-smooth border"
                style={
                  isActive
                    ? {
                        background: `${groupColor}25`,
                        color: groupColor,
                        borderColor: `${groupColor}60`,
                      }
                    : {
                        background: "oklch(0.18 0 0 / 0.6)",
                        color: "oklch(0.7 0 0)",
                        borderColor: "oklch(0.3 0 0 / 0.4)",
                      }
                }
                onClick={() => setFilter(f.value)}
                data-ocid={`discography.filter.${f.value}`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical center line (desktop only) */}
        <div
          className="hidden md:block absolute left-1/2 -translate-x-px top-2 bottom-2 w-0.5 rounded-full"
          style={{
            background: `linear-gradient(to bottom, ${groupColor}60, ${groupColor}20)`,
          }}
        />

        <div className="space-y-6 md:space-y-10">
          {filtered.map((entry, index) => (
            <TimelineEntry
              key={entry.id}
              entry={entry}
              index={index}
              groupColor={groupColor}
              isRight={index % 2 === 0}
            />
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="discography.empty_state"
        >
          <p className="text-4xl mb-3">💿</p>
          <p className="font-medium">No releases in this category</p>
        </div>
      )}
    </div>
  );
}

// ---------- Main FactsSection ----------
type Tab = "facts" | "discography";

export default function FactsSection({ groupId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("facts");
  const group = getGroup(groupId);
  const groupColor = group?.colors.primary ?? "oklch(0.65 0.15 300)";

  const tabs: { id: Tab; label: string; icon: typeof Disc3 }[] = [
    { id: "facts", label: "Fun Facts", icon: ListMusic },
    { id: "discography", label: "Discography", icon: Disc3 },
  ];

  return (
    <section data-ocid="facts.section" className="space-y-6">
      {/* Tab bar */}
      <div
        className="inline-flex rounded-xl p-1 gap-1"
        style={{
          background: "oklch(0.18 0 0 / 0.8)",
          border: "1px solid oklch(0.28 0 0 / 0.5)",
        }}
        data-ocid="facts.tab"
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth"
              style={
                isActive
                  ? {
                      background: `${groupColor}25`,
                      color: groupColor,
                      boxShadow: `0 0 16px ${groupColor}20`,
                    }
                  : { color: "oklch(0.6 0 0)", background: "transparent" }
              }
              onClick={() => setActiveTab(id)}
              data-ocid={`facts.${id}_tab`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${groupId}-${activeTab}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {activeTab === "facts" ? (
            <FactsTab groupId={groupId} groupColor={groupColor} />
          ) : (
            <DiscographyTab groupId={groupId} groupColor={groupColor} />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
