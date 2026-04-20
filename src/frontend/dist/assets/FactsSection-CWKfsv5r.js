import { d as createLucideIcon, j as jsxRuntimeExports, f as Slot, h as cn, k as cva, r as reactExports, e as getGroup, m as motion, u as useAppStore } from "./index-Biqxei8G.js";
import { A as AnimatePresence, m as lesserafimFunFacts, n as cortisFunFacts, o as btsFunFacts, p as illitFunFacts, q as lesserafimDiscography, r as cortisDiscography, s as btsDiscography, t as illitDiscography } from "./lesserafim-data-CY6J4rJk.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M6 12c0-1.7.7-3.2 1.8-4.2", key: "oqkarx" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M18 12c0 1.7-.7 3.2-1.8 4.2", key: "1eah9h" }]
];
const Disc3 = createLucideIcon("disc-3", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
      key: "c3ymky"
    }
  ]
];
const Heart = createLucideIcon("heart", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M21 15V6", key: "h1cx4g" }],
  ["path", { d: "M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z", key: "8saifv" }],
  ["path", { d: "M12 12H3", key: "18klou" }],
  ["path", { d: "M16 6H3", key: "1wxfjs" }],
  ["path", { d: "M12 18H3", key: "11ftsu" }]
];
const ListMusic = createLucideIcon("list-music", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m18 14 4 4-4 4", key: "10pe0f" }],
  ["path", { d: "m18 2 4 4-4 4", key: "pucp1d" }],
  ["path", { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22", key: "1ailkh" }],
  ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2", key: "km57vx" }],
  ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45", key: "os18l9" }]
];
const Shuffle = createLucideIcon("shuffle", __iconNode);
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
const factsByGroup = {
  illit: illitFunFacts,
  bts: btsFunFacts,
  cortis: cortisFunFacts,
  lesserafim: lesserafimFunFacts
};
const discographyByGroup = {
  illit: illitDiscography,
  bts: btsDiscography,
  cortis: cortisDiscography,
  lesserafim: lesserafimDiscography
};
const FACT_CATEGORIES = [
  { label: "All", value: "all" },
  { label: "Achievement", value: "achievement" },
  { label: "Member", value: "member" },
  { label: "Music", value: "music" },
  { label: "History", value: "history" },
  { label: "Fun", value: "fun" }
];
const DISC_FILTERS = [
  { label: "All", value: "all" },
  { label: "Albums", value: "album" },
  { label: "Mini-Albums", value: "mini-album" },
  { label: "Singles", value: "single" },
  { label: "EPs", value: "ep" }
];
const categoryEmojis = {
  all: "✦",
  achievement: "🏆",
  member: "⭐",
  music: "🎵",
  history: "📖",
  fun: "✨"
};
const categoryColors = {
  all: "oklch(0.7 0.1 280)",
  achievement: "oklch(0.72 0.18 55)",
  member: "oklch(0.72 0.18 350)",
  music: "oklch(0.65 0.18 200)",
  history: "oklch(0.6 0.15 260)",
  fun: "oklch(0.68 0.16 130)"
};
function formatReleaseDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
function getTypeBadgeStyle(_type, groupColor) {
  return {
    background: `${groupColor}20`,
    color: groupColor,
    border: `1px solid ${groupColor}35`
  };
}
function FactsTab({
  groupId,
  groupColor
}) {
  const facts = factsByGroup[groupId];
  const [activeCategory, setActiveCategory] = reactExports.useState("all");
  const [highlightedId, setHighlightedId] = reactExports.useState(null);
  const { toggleSavedFact, isFactSaved } = useAppStore();
  const factRefs = reactExports.useRef({});
  const filtered = activeCategory === "all" ? facts : facts.filter((f) => f.category === activeCategory);
  const randomFact = reactExports.useCallback(() => {
    const available = filtered.length > 0 ? filtered : facts;
    const pick = available[Math.floor(Math.random() * available.length)];
    if (!pick) return;
    setHighlightedId(pick.id);
    const el = factRefs.current[pick.id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => setHighlightedId(null), 2200);
  }, [filtered, facts]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-xl font-bold text-foreground", children: [
          facts.length,
          " Fun Facts"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Save your favourites with the heart icon" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "gap-2 shrink-0",
          style: { borderColor: `${groupColor}50`, color: groupColor },
          onClick: randomFact,
          "data-ocid": "facts.random_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shuffle, { className: "w-4 h-4" }),
            "Random Fact"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", "data-ocid": "facts.filter.tab", children: FACT_CATEGORIES.map((cat) => {
      const isActive = activeCategory === cat.value;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "text-xs px-3 py-1.5 rounded-full font-medium transition-smooth border",
          style: isActive ? {
            background: `${groupColor}25`,
            color: groupColor,
            borderColor: `${groupColor}60`
          } : {
            background: "oklch(0.18 0 0 / 0.6)",
            color: "oklch(0.7 0 0)",
            borderColor: "oklch(0.3 0 0 / 0.4)"
          },
          onClick: () => setActiveCategory(cat.value),
          "data-ocid": `facts.category.${cat.value}`,
          children: [
            categoryEmojis[cat.value],
            " ",
            cat.label
          ]
        },
        cat.value
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "columns-1 sm:columns-2 gap-4 space-y-0", children: filtered.map((fact, index) => {
      const isSaved = isFactSaved(fact.id);
      const isHighlighted = highlightedId === fact.id;
      const catColor = categoryColors[fact.category] ?? groupColor;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          ref: (el) => {
            factRefs.current[fact.id] = el;
          },
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.35,
            delay: Math.min(index * 0.04, 0.4)
          },
          className: "break-inside-avoid mb-4 rounded-xl border p-4 relative group",
          style: {
            background: isHighlighted ? `${groupColor}18` : isSaved ? "oklch(0.17 0 0 / 0.9)" : "oklch(0.155 0 0 / 0.9)",
            borderColor: isHighlighted ? `${groupColor}70` : isSaved ? "oklch(0.17 0 0 / 0.5)" : "oklch(0.28 0 0 / 0.5)",
            boxShadow: isHighlighted ? `0 0 24px ${groupColor}25` : isSaved ? "0 0 12px oklch(0.72 0.18 55 / 0.15)" : "none",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            animation: isHighlighted ? "pulse-glow 0.6s ease-in-out infinite alternate" : void 0
          },
          "data-ocid": `facts.item.${index + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0 mt-0.5", children: fact.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/85 leading-relaxed", children: fact.text }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-wrap gap-2 mt-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: "text-[10px] px-2 py-0.5 rounded-full font-medium capitalize",
                    style: {
                      background: `${catColor}20`,
                      color: catColor,
                      border: `1px solid ${catColor}35`
                    },
                    children: [
                      categoryEmojis[fact.category],
                      " ",
                      fact.category
                    ]
                  }
                ),
                fact.memberName && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    style: {
                      background: `${groupColor}15`,
                      color: groupColor,
                      border: `1px solid ${groupColor}30`
                    },
                    children: fact.memberName
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "shrink-0 p-1.5 rounded-full transition-smooth",
                style: {
                  background: isSaved ? "oklch(0.72 0.18 55 / 0.2)" : "oklch(0.22 0 0 / 0.6)",
                  color: isSaved ? "oklch(0.72 0.18 55)" : "oklch(0.55 0 0)"
                },
                onClick: () => toggleSavedFact(fact.id),
                onKeyDown: (e) => e.key === "Enter" && toggleSavedFact(fact.id),
                "aria-label": isSaved ? "Remove from saved" : "Save fact",
                "data-ocid": `facts.save_button.${index + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Heart,
                  {
                    className: `w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`
                  }
                )
              }
            )
          ] })
        },
        fact.id
      );
    }) }),
    filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 text-muted-foreground",
        "data-ocid": "facts.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-3", children: "🔍" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No facts in this category yet" })
        ]
      }
    )
  ] });
}
function TimelineEntry({
  entry,
  index,
  groupColor,
  isRight
}) {
  const ref = reactExports.useRef(null);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const typeLabel = entry.type === "mini-album" ? "Mini-Album" : entry.type.charAt(0).toUpperCase() + entry.type.slice(1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      className: `relative flex gap-4 md:gap-0 ${isRight ? "md:flex-row-reverse" : "md:flex-row"}`,
      "data-ocid": `discography.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex flex-col items-center absolute left-1/2 -translate-x-1/2 top-0 bottom-0 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { scale: 0 },
            animate: visible ? { scale: 1 } : { scale: 0 },
            transition: { duration: 0.4, delay: 0.1 },
            className: "w-4 h-4 rounded-full border-2 mt-1 shrink-0",
            style: {
              background: groupColor,
              borderColor: `${groupColor}80`,
              boxShadow: `0 0 12px ${groupColor}50`
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block w-1/2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: isRight ? 40 : -40 },
            animate: visible ? { opacity: 1, x: 0 } : { opacity: 0, x: isRight ? 40 : -40 },
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
            className: `w-full md:w-[calc(50%-2rem)] rounded-xl border p-4 ${isRight ? "md:mr-8" : "md:ml-8"}`,
            style: {
              background: "oklch(0.155 0 0 / 0.9)",
              borderColor: "oklch(0.28 0 0 / 0.5)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "md:hidden w-3 h-3 rounded-full inline-block mr-2 align-middle",
                  style: { background: groupColor }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 mb-2.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground", children: formatReleaseDate(entry.releaseDate) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] px-2 py-0.5 rounded-full font-medium capitalize",
                    style: getTypeBadgeStyle(entry.type, groupColor),
                    children: typeLabel
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-12 h-12 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold font-display",
                    style: {
                      background: `${entry.coverColor}30`,
                      color: entry.coverColor,
                      border: `1px solid ${entry.coverColor}40`
                    },
                    children: entry.title.slice(0, 2).toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-display font-bold text-foreground text-sm leading-tight", children: entry.title }),
                  entry.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2", children: entry.description })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5", children: "Tracks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
                  entry.tracks.slice(0, 5).map((track) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[10px] px-1.5 py-0.5 rounded border text-muted-foreground",
                      style: {
                        borderColor: "oklch(0.3 0 0 / 0.5)",
                        background: "oklch(0.2 0 0 / 0.4)"
                      },
                      children: track
                    },
                    track
                  )),
                  entry.tracks.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground px-1", children: [
                    "+",
                    entry.tracks.length - 5,
                    " more"
                  ] })
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
}
function DiscographyTab({
  groupId,
  groupColor
}) {
  const allEntries = discographyByGroup[groupId];
  const [filter, setFilter] = reactExports.useState("all");
  const filtered = filter === "all" ? allEntries : allEntries.filter((e) => e.type === filter);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-xl font-bold text-foreground", children: "Discography Timeline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
          allEntries.length,
          " releases"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "flex flex-wrap gap-2",
          "data-ocid": "discography.filter.tab",
          children: DISC_FILTERS.map((f) => {
            const isActive = filter === f.value;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "text-xs px-3 py-1.5 rounded-full font-medium transition-smooth border",
                style: isActive ? {
                  background: `${groupColor}25`,
                  color: groupColor,
                  borderColor: `${groupColor}60`
                } : {
                  background: "oklch(0.18 0 0 / 0.6)",
                  color: "oklch(0.7 0 0)",
                  borderColor: "oklch(0.3 0 0 / 0.4)"
                },
                onClick: () => setFilter(f.value),
                "data-ocid": `discography.filter.${f.value}`,
                children: f.label
              },
              f.value
            );
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "hidden md:block absolute left-1/2 -translate-x-px top-2 bottom-2 w-0.5 rounded-full",
          style: {
            background: `linear-gradient(to bottom, ${groupColor}60, ${groupColor}20)`
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6 md:space-y-10", children: filtered.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TimelineEntry,
        {
          entry,
          index,
          groupColor,
          isRight: index % 2 === 0
        },
        entry.id
      )) })
    ] }),
    filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "text-center py-16 text-muted-foreground",
        "data-ocid": "discography.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl mb-3", children: "💿" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "No releases in this category" })
        ]
      }
    )
  ] });
}
function FactsSection({ groupId }) {
  const [activeTab, setActiveTab] = reactExports.useState("facts");
  const group = getGroup(groupId);
  const groupColor = (group == null ? void 0 : group.colors.primary) ?? "oklch(0.65 0.15 300)";
  const tabs = [
    { id: "facts", label: "Fun Facts", icon: ListMusic },
    { id: "discography", label: "Discography", icon: Disc3 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "facts.section", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "inline-flex rounded-xl p-1 gap-1",
        style: {
          background: "oklch(0.18 0 0 / 0.8)",
          border: "1px solid oklch(0.28 0 0 / 0.5)"
        },
        "data-ocid": "facts.tab",
        children: tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth",
              style: isActive ? {
                background: `${groupColor}25`,
                color: groupColor,
                boxShadow: `0 0 16px ${groupColor}20`
              } : { color: "oklch(0.6 0 0)", background: "transparent" },
              onClick: () => setActiveTab(id),
              "data-ocid": `facts.${id}_tab`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" }),
                label
              ]
            },
            id
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.25 },
        children: activeTab === "facts" ? /* @__PURE__ */ jsxRuntimeExports.jsx(FactsTab, { groupId, groupColor }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DiscographyTab, { groupId, groupColor })
      },
      `${groupId}-${activeTab}`
    ) })
  ] });
}
export {
  FactsSection as default
};
