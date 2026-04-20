import { d as createLucideIcon, r as reactExports, e as getGroup, j as jsxRuntimeExports, m as motion, X, S as Star } from "./index-Biqxei8G.js";
import { a as lesserafimMembers, d as cortisMembers, e as btsMembers, f as illitMembers, A as AnimatePresence } from "./lesserafim-data-CY6J4rJk.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }]
];
const Calendar = createLucideIcon("calendar", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
  [
    "path",
    {
      d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
      key: "1tzkfa"
    }
  ],
  ["path", { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05", key: "14pb5j" }],
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]
];
const Earth = createLucideIcon("earth", __iconNode);
const membersByGroup = {
  illit: illitMembers,
  bts: btsMembers,
  cortis: cortisMembers,
  lesserafim: lesserafimMembers
};
const roleColors = {
  "Main Vocalist": "oklch(0.72 0.18 350)",
  "Lead Vocalist": "oklch(0.68 0.15 350)",
  Vocalist: "oklch(0.65 0.12 350)",
  "Main Dancer": "oklch(0.6 0.2 300)",
  "Lead Dancer": "oklch(0.58 0.18 300)",
  "Main Rapper": "oklch(0.55 0.2 240)",
  "Lead Rapper": "oklch(0.52 0.18 240)",
  Rapper: "oklch(0.5 0.15 240)",
  Leader: "oklch(0.7 0.2 55)",
  Visual: "oklch(0.65 0.16 25)",
  Center: "oklch(0.72 0.18 20)",
  Maknae: "oklch(0.6 0.15 160)"
};
function getRoleColor(role) {
  return roleColors[role] ?? "oklch(0.55 0.1 280)";
}
function formatBirthday(birthday) {
  const d = new Date(birthday);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function getAge(birthday) {
  const today = /* @__PURE__ */ new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || m === 0 && today.getDate() < birth.getDate()) age--;
  return age;
}
function getNextBirthday(birthday) {
  const today = /* @__PURE__ */ new Date();
  const birth = new Date(birthday);
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  const diffMs = next.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1e3 * 60 * 60 * 24));
  if (diffDays === 0) return "🎂 Today!";
  if (diffDays === 1) return "🎉 Tomorrow!";
  if (diffDays <= 30) return `${diffDays} days away`;
  return formatBirthday(birthday);
}
function MemberModal({ member, groupColor, onClose }) {
  const initial = member.name[0].toUpperCase();
  const age = getAge(member.birthday);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "oklch(0 0 0 / 0.75)" },
      onClick: onClose,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { scale: 0.85, opacity: 0, y: 32 },
          animate: { scale: 1, opacity: 1, y: 0 },
          exit: { scale: 0.88, opacity: 0, y: 20 },
          transition: { type: "spring", damping: 22, stiffness: 300 },
          className: "relative w-full max-w-lg rounded-2xl border overflow-hidden",
          style: {
            background: "oklch(0.14 0 0 / 0.96)",
            borderColor: `${groupColor}50`,
            boxShadow: `0 0 60px ${groupColor}30`,
            backdropFilter: "blur(20px)"
          },
          onClick: (e) => e.stopPropagation(),
          "data-ocid": "members.dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "h-28 flex items-end px-6 pb-4 relative",
                style: {
                  background: `linear-gradient(135deg, ${groupColor}40, ${groupColor}10)`
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "absolute top-4 right-4 cursor-pointer rounded-full p-1.5 transition-smooth border-0 outline-none",
                      style: { background: "oklch(0.2 0 0 / 0.6)" },
                      onClick: onClose,
                      onKeyDown: (e) => e.key === "Enter" && onClose(),
                      "data-ocid": "members.close_button",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-foreground/70" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 shadow-lg",
                        style: {
                          background: `${groupColor}25`,
                          borderColor: `${groupColor}60`,
                          color: groupColor
                        },
                        children: initial
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground leading-tight", children: member.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", style: { color: groupColor }, children: member.position })
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-5 max-h-[60vh] overflow-y-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: member.role.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-xs px-2.5 py-1 rounded-full font-medium",
                  style: {
                    background: `${getRoleColor(r)}20`,
                    color: getRoleColor(r),
                    border: `1px solid ${getRoleColor(r)}40`
                  },
                  children: r
                },
                r
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Calendar,
                    {
                      className: "w-4 h-4 shrink-0",
                      style: { color: groupColor }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground/80 font-medium", children: formatBirthday(member.birthday) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                      age,
                      " years old"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Earth,
                    {
                      className: "w-4 h-4 shrink-0",
                      style: { color: groupColor }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground/80 font-medium", children: member.nationality }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Nationality" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2", children: "About" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground/80 leading-relaxed", children: member.bio })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3", style: { color: groupColor } }),
                  "Fun Facts"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: member.funFacts.map((fact, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "li",
                  {
                    className: "flex items-start gap-2.5 text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                          style: { background: `${groupColor}25`, color: groupColor },
                          children: i + 1
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground/75", children: fact })
                    ]
                  },
                  fact.slice(0, 30)
                )) })
              ] })
            ] })
          ]
        }
      )
    }
  );
}
function MembersSection({ groupId }) {
  const [selectedMember, setSelectedMember] = reactExports.useState(null);
  const [hoveredMember, setHoveredMember] = reactExports.useState(null);
  const members = membersByGroup[groupId];
  const group = getGroup(groupId);
  const groupColor = (group == null ? void 0 : group.colors.primary) ?? "oklch(0.65 0.15 300)";
  const gridRef = reactExports.useRef(null);
  const cols = members.length <= 5 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "members.section", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Meet the Members" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
        members.length,
        " members · Click a card to see full profile"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref: gridRef,
        className: `grid ${cols} gap-4`,
        "data-ocid": "members.list",
        children: members.map((member, index) => {
          const initial = member.name[0].toUpperCase();
          const isHovered = hoveredMember === member.id;
          const nextBday = getNextBirthday(member.birthday);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 24 },
              animate: { opacity: 1, y: 0 },
              transition: {
                duration: 0.45,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1]
              },
              className: "relative group cursor-pointer rounded-2xl border overflow-hidden",
              style: {
                background: "oklch(0.15 0 0 / 0.9)",
                borderColor: isHovered ? `${groupColor}60` : "oklch(0.28 0 0 / 0.5)",
                boxShadow: isHovered ? `0 0 30px ${groupColor}30, 0 8px 32px oklch(0 0 0 / 0.4)` : "0 4px 16px oklch(0 0 0 / 0.3)",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                transform: isHovered ? "scale(1.04) translateY(-4px)" : "scale(1) translateY(0)"
              },
              onMouseEnter: () => setHoveredMember(member.id),
              onMouseLeave: () => setHoveredMember(null),
              onClick: () => setSelectedMember(member),
              "data-ocid": `members.item.${index + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-1.5 w-full",
                    style: {
                      background: `linear-gradient(90deg, ${groupColor}, ${groupColor}60)`
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-display border-2 transition-smooth",
                      style: {
                        background: isHovered ? `${groupColor}30` : `${groupColor}15`,
                        borderColor: isHovered ? `${groupColor}80` : `${groupColor}40`,
                        color: groupColor
                      },
                      children: initial
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm leading-tight", children: member.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "inline-block text-[10px] px-2 py-0.5 rounded-full font-medium",
                        style: {
                          background: `${getRoleColor(member.role[0])}20`,
                          color: getRoleColor(member.role[0]),
                          border: `1px solid ${getRoleColor(member.role[0])}35`
                        },
                        children: member.role[0]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3 inline mr-1 opacity-60" }),
                    nextBday
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isHovered && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    exit: { opacity: 0 },
                    transition: { duration: 0.18 },
                    className: "absolute inset-0 rounded-2xl p-3 flex flex-col justify-end",
                    style: {
                      background: `linear-gradient(180deg, ${groupColor}08 0%, oklch(0.1 0 0 / 0.92) 35%)`
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[10px] font-semibold uppercase tracking-wider mb-2",
                          style: { color: groupColor },
                          children: "Fun Facts"
                        }
                      ),
                      member.funFacts.slice(0, 3).map((fact) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "p",
                        {
                          className: "text-[10px] text-foreground/80 leading-snug flex items-start gap-1.5",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: { color: groupColor },
                                className: "shrink-0",
                                children: "✦"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-2", children: fact })
                          ]
                        },
                        fact.slice(0, 30)
                      )),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-[10px] mt-2 font-medium",
                          style: { color: groupColor },
                          children: "Click for full profile →"
                        }
                      )
                    ] })
                  }
                ) })
              ]
            },
            member.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedMember && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MemberModal,
      {
        member: selectedMember,
        groupColor,
        onClose: () => setSelectedMember(null)
      }
    ) })
  ] });
}
export {
  MembersSection as default
};
