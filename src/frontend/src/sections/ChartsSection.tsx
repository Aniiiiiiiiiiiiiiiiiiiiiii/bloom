import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { btsSongs } from "../data/bts-data";
import { cortisSongs } from "../data/cortis-data";
import { groups } from "../data/groups";
import { illitSongs } from "../data/illit-data";
import { lesserafimSongs } from "../data/lesserafim-data";
import type { GroupId, Song } from "../types";

// ── helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function rankChange(
  rank: number | null,
): { label: string; color: string } | null {
  if (rank === null) return null;
  if (rank <= 3) return { label: "NEW", color: "#4ade80" };
  if (rank <= 8) return { label: `▲${10 - rank}`, color: "#4ade80" };
  if (rank <= 15) return { label: `▼${rank - 8}`, color: "#f87171" };
  return { label: `▼${rank - 10}`, color: "#f87171" };
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PLATFORM_COLORS = [
  "oklch(0.7 0.18 150)",
  "oklch(0.62 0.22 25)",
  "oklch(0.65 0.2 280)",
  "oklch(0.65 0.18 200)",
];

const SONG_LINE_COLORS = [
  "oklch(0.78 0.18 350)",
  "oklch(0.72 0.18 200)",
  "oklch(0.75 0.18 280)",
  "oklch(0.78 0.18 55)",
  "oklch(0.72 0.15 150)",
];

const songsMap: Record<GroupId, Song[]> = {
  illit: illitSongs,
  bts: btsSongs,
  cortis: cortisSongs,
  lesserafim: lesserafimSongs,
};

// ── sub-types ─────────────────────────────────────────────────────────────────

type ChartTab = "top-songs" | "trends" | "platforms";
type Platform = "spotify" | "youtube" | "itunes";

// ── custom tooltip ─────────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "oklch(0.14 0 0 / 0.92)",
        border: "1px solid oklch(0.28 0 0)",
        borderRadius: "8px",
        backdropFilter: "blur(12px)",
        padding: "10px 14px",
        fontSize: "12px",
      }}
    >
      {label && (
        <p
          style={{ color: "oklch(0.7 0 0)", marginBottom: 6, fontWeight: 600 }}
        >
          {label}
        </p>
      )}
      {payload.map((p) => (
        <div
          key={p.name}
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: p.color,
            }}
          />
          <span style={{ color: "oklch(0.85 0 0)" }}>
            {p.name}:{" "}
            <strong style={{ color: "#fff" }}>{fmtNum(p.value)}</strong>
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Top Songs Bar Chart ────────────────────────────────────────────────────────

interface TopSongsProps {
  songs: Song[];
  primaryColor: string;
}

function TopSongsChart({ songs, primaryColor }: TopSongsProps) {
  const [platform, setPlatform] = useState<Platform>("spotify");

  const sorted = useMemo(() => {
    const s = [...songs];
    if (platform === "spotify") s.sort((a, b) => b.streams - a.streams);
    else if (platform === "youtube")
      s.sort((a, b) => b.youtubeViews - a.youtubeViews);
    else
      s.sort((a, b) => {
        const ra = a.itunesRank ?? 9999;
        const rb = b.itunesRank ?? 9999;
        return ra - rb;
      });
    return s.slice(0, 10);
  }, [songs, platform]);

  const topSong = sorted[0];
  const metricLabel =
    platform === "spotify"
      ? "streams"
      : platform === "youtube"
        ? "views"
        : "chart rank";
  const topValue =
    platform === "spotify"
      ? topSong.streams
      : platform === "youtube"
        ? topSong.youtubeViews
        : null;

  const barData = sorted.map((s) => ({
    name: s.title,
    value:
      platform === "spotify"
        ? s.streams
        : platform === "youtube"
          ? s.youtubeViews
          : s.itunesRank !== null
            ? Math.max(0, 100 - s.itunesRank * 3)
            : 0,
    rank: platform === "itunes" ? s.itunesRank : null,
  }));

  const PLATFORM_TABS: { id: Platform; label: string }[] = [
    { id: "spotify", label: "Spotify" },
    { id: "youtube", label: "YouTube" },
    { id: "itunes", label: "iTunes" },
  ];

  return (
    <div>
      {/* platform tabs */}
      <div
        className="flex gap-2 mb-5 flex-wrap"
        data-ocid="charts.top_songs_platform.tab"
      >
        {PLATFORM_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setPlatform(t.id)}
            data-ocid={`charts.platform_tab.${t.id}`}
            style={{
              background: platform === t.id ? primaryColor : "oklch(0.18 0 0)",
              color: platform === t.id ? "oklch(0.1 0 0)" : "oklch(0.65 0 0)",
              border: `1px solid ${platform === t.id ? primaryColor : "oklch(0.28 0 0)"}`,
              borderRadius: "999px",
              padding: "4px 16px",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* stat summary */}
      <p className="text-xs mb-4" style={{ color: "oklch(0.62 0 0)" }}>
        🔥{" "}
        <span style={{ color: primaryColor, fontWeight: 700 }}>
          &lsquo;{topSong.title}&rsquo;
        </span>{" "}
        leads with{" "}
        <strong style={{ color: "oklch(0.9 0 0)" }}>
          {topValue !== null
            ? fmtNum(topValue)
            : `#${topSong.itunesRank ?? "?"}`}
        </strong>{" "}
        {metricLabel}
      </p>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={barData}
          layout="vertical"
          margin={{ top: 4, right: 60, left: 8, bottom: 4 }}
        >
          <XAxis
            type="number"
            tick={{ fill: "oklch(0.5 0 0)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => fmtNum(v)}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: "oklch(0.72 0 0)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={110}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "oklch(0.2 0 0 / 0.4)" }}
          />
          <Bar
            dataKey="value"
            fill={primaryColor}
            radius={[0, 4, 4, 0]}
            animationDuration={800}
            label={{
              position: "right",
              formatter: (v: number) => fmtNum(v),
              fill: "oklch(0.6 0 0)",
              fontSize: 11,
            }}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* rank badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {sorted.slice(0, 5).map((s) => {
          const change = rankChange(s.itunesRank);
          return (
            <div
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: "6px",
                background: "oklch(0.18 0 0)",
                border: "1px solid oklch(0.25 0 0)",
                fontSize: "11px",
              }}
            >
              <span style={{ color: "oklch(0.75 0 0)" }}>{s.title}</span>
              {change && (
                <span
                  style={{
                    color: change.color,
                    fontWeight: 700,
                    fontSize: "10px",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    background: `${change.color}22`,
                  }}
                >
                  {change.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Streaming Trends Line Chart ───────────────────────────────────────────────

interface TrendsProps {
  songs: Song[];
  primaryColor: string;
}

function TrendsChart({ songs, primaryColor }: TrendsProps) {
  const top5 = useMemo(
    () => [...songs].sort((a, b) => b.streams - a.streams).slice(0, 5),
    [songs],
  );

  const lineData = DAYS.map((day, i) => {
    const obj: Record<string, string | number> = { day };
    for (const s of top5) {
      obj[s.title] = s.weeklyTrend[i] ?? 0;
    }
    return obj;
  });

  return (
    <div>
      <p className="text-xs mb-4" style={{ color: "oklch(0.62 0 0)" }}>
        📈 Weekly streaming trend for top 5 songs — last 7 days
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={lineData}
          margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
        >
          <XAxis
            dataKey="day"
            tick={{ fill: "oklch(0.55 0 0)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "oklch(0.5 0 0)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}M`}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "oklch(0.35 0 0)" }}
          />
          {top5.map((s, i) => (
            <Line
              key={s.id}
              type="monotone"
              dataKey={s.title}
              stroke={SONG_LINE_COLORS[i]}
              strokeWidth={2.5}
              dot={{ fill: SONG_LINE_COLORS[i], r: 3 }}
              activeDot={{ r: 5 }}
              animationDuration={800}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* custom legend */}
      <div className="flex flex-wrap gap-3 mt-5">
        {top5.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div
              style={{
                width: 20,
                height: 3,
                borderRadius: 2,
                background: SONG_LINE_COLORS[i],
              }}
            />
            <span style={{ fontSize: 11, color: "oklch(0.68 0 0)" }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs mt-4" style={{ color: "oklch(0.62 0 0)" }}>
        🔥{" "}
        <span style={{ color: primaryColor, fontWeight: 700 }}>
          &lsquo;{top5[0].title}&rsquo;
        </span>{" "}
        dominates every day this week with a peak of{" "}
        <strong style={{ color: "oklch(0.9 0 0)" }}>
          {Math.max(...top5[0].weeklyTrend)}M
        </strong>{" "}
        daily streams
      </p>
    </div>
  );
}

// ── Platform Breakdown Donut Chart ─────────────────────────────────────────────

interface PlatformProps {
  songs: Song[];
  primaryColor: string;
  groupId: GroupId;
}

function PlatformBreakdown({ songs, primaryColor }: PlatformProps) {
  const totals = useMemo(() => {
    const spotify = songs.reduce((acc, s) => acc + s.streams, 0);
    const youtube = songs.reduce((acc, s) => acc + s.youtubeViews, 0);
    const itunes = Math.round(spotify * 0.08);
    const apple = Math.round(spotify * 0.12);
    const total = spotify + youtube + itunes + apple;
    return [
      {
        name: "Spotify",
        value: spotify,
        pct: Math.round((spotify / total) * 100),
      },
      {
        name: "YouTube",
        value: youtube,
        pct: Math.round((youtube / total) * 100),
      },
      {
        name: "Apple Music",
        value: apple,
        pct: Math.round((apple / total) * 100),
      },
      {
        name: "iTunes",
        value: itunes,
        pct: Math.round((itunes / total) * 100),
      },
    ];
  }, [songs]);

  const total = totals.reduce((a, d) => a + d.value, 0);
  const topPlatform = totals[0];

  const renderLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    name,
    pct,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    name: string;
    pct: number;
  }) => {
    const RADIAN = Math.PI / 180;
    const r = outerRadius + 28;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="oklch(0.7 0 0)"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={11}
        fontWeight={600}
      >
        {name} {pct}%
      </text>
    );
  };

  return (
    <div>
      <p className="text-xs mb-4" style={{ color: "oklch(0.62 0 0)" }}>
        🎵 Stream distribution across major platforms
      </p>

      <div className="flex flex-col md:flex-row items-center gap-8">
        <div
          className="relative"
          style={{ width: 260, height: 260, flexShrink: 0 }}
        >
          <ResponsiveContainer width={260} height={260}>
            <PieChart>
              <Pie
                data={totals}
                cx={125}
                cy={125}
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                animationDuration={900}
                label={renderLabel}
                labelLine={false}
              >
                {totals.map((d, i) => (
                  <Cell key={d.name} fill={PLATFORM_COLORS[i]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* center label */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ top: 0 }}
          >
            <span style={{ fontSize: 10, color: "oklch(0.55 0 0)" }}>
              Total Streams
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: primaryColor,
                lineHeight: 1.1,
              }}
            >
              {fmtNum(total)}
            </span>
          </div>
        </div>

        {/* stats breakdown */}
        <div className="flex-1 w-full space-y-3">
          {totals.map((d, i) => (
            <div key={d.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: "3px",
                      background: PLATFORM_COLORS[i],
                    }}
                  />
                  <span style={{ color: "oklch(0.75 0 0)" }}>{d.name}</span>
                </span>
                <span style={{ color: "oklch(0.8 0 0)", fontWeight: 600 }}>
                  {fmtNum(d.value)} ({d.pct}%)
                </span>
              </div>
              <div
                style={{
                  height: 5,
                  borderRadius: 3,
                  background: "oklch(0.22 0 0)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.pct}%` }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.12,
                    ease: "easeOut",
                  }}
                  style={{
                    height: "100%",
                    borderRadius: 3,
                    background: PLATFORM_COLORS[i],
                  }}
                />
              </div>
            </div>
          ))}

          <p className="text-xs pt-2" style={{ color: "oklch(0.62 0 0)" }}>
            🔥{" "}
            <span style={{ color: primaryColor, fontWeight: 700 }}>
              {topPlatform.name}
            </span>{" "}
            leads with{" "}
            <strong style={{ color: "oklch(0.9 0 0)" }}>
              {topPlatform.pct}%
            </strong>{" "}
            of total streams
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main ChartsSection ─────────────────────────────────────────────────────────

interface Props {
  groupId: GroupId;
}

const CHART_TABS: { id: ChartTab; label: string; emoji: string }[] = [
  { id: "top-songs", label: "Top Songs", emoji: "🎵" },
  { id: "trends", label: "Streaming Trends", emoji: "📈" },
  { id: "platforms", label: "Platform Breakdown", emoji: "🌐" },
];

export default function ChartsSection({ groupId }: Props) {
  const [activeTab, setActiveTab] = useState<ChartTab>("top-songs");

  const group = groups.find((g) => g.id === groupId);
  const songs = songsMap[groupId] ?? [];

  if (!group) return null;

  const primary = group.colors.primary;
  const glow = group.colors.glow;

  return (
    <div className="space-y-6" data-ocid="charts.section">
      {/* Tab navigation */}
      <div
        className="flex gap-1 p-1 rounded-xl"
        style={{
          background: "oklch(0.14 0 0)",
          border: "1px solid oklch(0.22 0 0)",
        }}
        data-ocid="charts.tab_nav"
      >
        {CHART_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              data-ocid={`charts.tab.${tab.id}`}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.22s ease",
                background: isActive ? primary : "transparent",
                color: isActive ? "oklch(0.1 0 0)" : "oklch(0.58 0 0)",
                border: "none",
                boxShadow: isActive ? `0 0 16px ${glow}` : "none",
              }}
            >
              <span style={{ marginRight: 5 }}>{tab.emoji}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Chart card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="card-elevated p-6"
          style={{
            boxShadow: `0 0 30px ${glow}`,
            border: `1px solid ${primary}33`,
          }}
        >
          {/* Chart header */}
          <div className="mb-5">
            <h2
              className="font-display font-bold text-xl leading-tight"
              style={{ color: primary }}
            >
              {activeTab === "top-songs" && `${group.name} — Top Songs`}
              {activeTab === "trends" && `${group.name} — Streaming Trends`}
              {activeTab === "platforms" &&
                `${group.name} — Platform Breakdown`}
            </h2>
            <p className="text-xs mt-1" style={{ color: "oklch(0.5 0 0)" }}>
              {activeTab === "top-songs" &&
                "Sorted by streams across major platforms. Click a platform filter to switch."}
              {activeTab === "trends" &&
                "Daily streaming data for the top 5 songs over the past 7 days."}
              {activeTab === "platforms" &&
                "Total stream count distribution across Spotify, YouTube, Apple Music & iTunes."}
            </p>
          </div>

          {/* Chart body */}
          {activeTab === "top-songs" && (
            <TopSongsChart songs={songs} primaryColor={primary} />
          )}
          {activeTab === "trends" && (
            <TrendsChart songs={songs} primaryColor={primary} />
          )}
          {activeTab === "platforms" && (
            <PlatformBreakdown
              songs={songs}
              primaryColor={primary}
              groupId={groupId}
            />
          )}

          {/* Footer */}
          <div
            className="mt-6 pt-4 flex justify-end text-xs"
            style={{
              borderTop: "1px solid oklch(0.22 0 0)",
              color: "oklch(0.42 0 0)",
            }}
          >
            Last updated: April 20, 2026
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
