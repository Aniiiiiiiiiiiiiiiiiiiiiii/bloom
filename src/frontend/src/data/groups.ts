import type { Group } from "../types";

export const groups: Group[] = [
  {
    id: "illit",
    name: "ILLIT",
    colors: {
      primary: "oklch(0.7 0.15 350)",
      secondary: "oklch(0.78 0.12 345)",
      gradient: "from-[oklch(0.7_0.15_350)] to-[oklch(0.65_0.18_350)]",
      glow: "rgba(224, 102, 204, 0.4)",
      text: "#f0b8e8",
    },
    glowClass: "shadow-glow-pink",
    description:
      "The next-gen girl group from HYBE's new label ADOR. ILLIT debuted in 2024 with a fresh, bubbly concept blending cute charm with powerful performance.",
    memberCount: 5,
    debutYear: 2024,
    fandomName: "Llit",
    agency: "ADOR (HYBE)",
  },
  {
    id: "bts",
    name: "BTS",
    colors: {
      primary: "oklch(0.55 0.18 280)",
      secondary: "oklch(0.48 0.16 270)",
      gradient: "from-[oklch(0.55_0.18_280)] to-[oklch(0.48_0.16_270)]",
      glow: "rgba(120, 80, 220, 0.4)",
      text: "#c9b8f8",
    },
    glowClass: "shadow-glow-purple",
    description:
      "Global superstars and record-breakers who changed the landscape of pop music. BTS has built an unmatched worldwide ARMY spanning every continent.",
    memberCount: 7,
    debutYear: 2013,
    fandomName: "ARMY",
    agency: "HYBE (Big Hit Entertainment)",
  },
  {
    id: "cortis",
    name: "Cortis",
    colors: {
      primary: "oklch(0.6 0.18 200)",
      secondary: "oklch(0.68 0.16 190)",
      gradient: "from-[oklch(0.6_0.18_200)] to-[oklch(0.68_0.16_190)]",
      glow: "rgba(40, 180, 200, 0.4)",
      text: "#7ee8f8",
    },
    glowClass: "shadow-glow-teal",
    description:
      "The futuristic concept group pushing boundaries with cyberpunk aesthetics and genre-blending sounds. Cortis redefined K-pop with their tech-noir identity.",
    memberCount: 6,
    debutYear: 2022,
    fandomName: "Cortex",
    agency: "NOVA Entertainment",
  },
  {
    id: "lesserafim",
    name: "LE SSERAFIM",
    colors: {
      primary: "oklch(0.65 0.16 25)",
      secondary: "oklch(0.58 0.18 8)",
      gradient: "from-[oklch(0.65_0.16_25)] to-[oklch(0.58_0.18_8)]",
      glow: "rgba(220, 130, 40, 0.4)",
      text: "#f8d878",
    },
    glowClass: "shadow-glow-gold",
    description:
      "HYBE's powerhouse girl group known for their unapologetic attitude, fierce performances, and the mantra 'I'M FEARLESS'. Legends in the making.",
    memberCount: 5,
    debutYear: 2022,
    fandomName: "FEARNOT",
    agency: "Source Music (HYBE)",
  },
];

export const getGroup = (id: string) => groups.find((g) => g.id === id);
