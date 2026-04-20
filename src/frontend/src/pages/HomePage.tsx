import { Badge } from "@/components/ui/badge";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Gamepad2,
  Lightbulb,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { groups } from "../data/groups";
import { useAppStore } from "../store/useAppStore";
import type { GroupId } from "../types";

const groupStats: Record<
  GroupId,
  { songs: number; facts: number; trivia: number }
> = {
  illit: { songs: 20, facts: 22, trivia: 30 },
  bts: { songs: 20, facts: 22, trivia: 30 },
  cortis: { songs: 20, facts: 22, trivia: 30 },
  lesserafim: { songs: 20, facts: 22, trivia: 30 },
};

const groupHighlights: Record<GroupId, string[]> = {
  illit: ["412M streams on 'Magnetic'", "Debuted 2024", "HYBE's newest stars"],
  bts: [
    "1.75B streams on 'Dynamite'",
    "#1 Billboard Hot 100",
    "ARMY worldwide",
  ],
  cortis: [
    "380M streams on 'Glitch Protocol'",
    "Cyberpunk concept",
    "Rising global stars",
  ],
  lesserafim: [
    "820M streams on 'FEARLESS'",
    "Coachella 2024",
    "Fearless & unstoppable",
  ],
};

const features = [
  {
    icon: BarChart3,
    label: "Streaming Charts",
    desc: "Live-style stats, rankings & weekly trends",
  },
  {
    icon: Users,
    label: "Member Profiles",
    desc: "Deep bios, birthdays & fun facts for each member",
  },
  {
    icon: Gamepad2,
    label: "K-pop Games",
    desc: "Trivia, lyric guessing & more interactive fun",
  },
  {
    icon: Lightbulb,
    label: "Fan Facts",
    desc: "20+ curated facts per group, save your favorites",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { setActiveGroup } = useAppStore();

  const handleGroupClick = (groupId: GroupId) => {
    setActiveGroup(groupId);
    void navigate({
      to: "/group/$groupId/$section",
      params: { groupId, section: "charts" },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-card/30 py-20 md:py-32 px-4">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, oklch(0.55 0.18 280 / 0.4), transparent 50%), radial-gradient(ellipse at 70% 60%, oklch(0.7 0.15 350 / 0.3), transparent 50%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 text-xs tracking-widest font-display uppercase px-4 py-1"
            >
              <Star className="w-3 h-3 mr-1 text-primary" /> K-pop Fan Universe
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black text-6xl md:text-9xl tracking-tighter mb-6 text-foreground"
            style={{ textShadow: "0 0 60px oklch(0.55 0.18 280 / 0.3)" }}
          >
            BLOOM
            <span className="text-primary text-3xl md:text-5xl align-super">
              +
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-10 font-body leading-relaxed"
          >
            Your premium K-pop fan hub. Charts, trivia, member spotlights and
            games — all in one place for ILLIT, BTS, Cortis, and LE SSERAFIM.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => handleGroupClick(g.id as GroupId)}
                data-ocid={`home.hero_group_button.${g.id}`}
                className="px-5 py-2 rounded-full text-sm font-display font-semibold border transition-smooth hover:scale-105"
                style={{
                  borderColor: g.colors.primary,
                  color: g.colors.text,
                  background: `${g.colors.glow.replace("0.4", "0.12")}`,
                }}
              >
                {g.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Group cards grid */}
      <section className="py-16 px-4" data-ocid="home.groups_section">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-2xl mb-8 text-foreground"
          >
            Choose Your Group
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {groups.map((group, i) => {
              const gId = group.id as GroupId;
              const highlights = groupHighlights[gId];
              const stats = groupStats[gId];
              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  data-ocid={`home.group_card.${i + 1}`}
                >
                  <button
                    type="button"
                    onClick={() => handleGroupClick(gId)}
                    className="w-full text-left rounded-xl overflow-hidden border border-border/20 transition-smooth hover:scale-[1.02] hover:shadow-lg group"
                    style={{
                      background: `linear-gradient(135deg, ${group.colors.glow.replace("0.4", "0.08")}, oklch(0.15 0 0))`,
                      boxShadow: `0 0 0 1px ${group.colors.primary}30`,
                    }}
                    data-ocid={`home.group_card_button.${i + 1}`}
                  >
                    {/* Card header */}
                    <div
                      className="relative p-6 pb-4 overflow-hidden"
                      style={{
                        borderBottom: `1px solid ${group.colors.primary}25`,
                      }}
                    >
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: `radial-gradient(ellipse at 80% 20%, ${group.colors.glow}, transparent 60%)`,
                        }}
                      />
                      <div className="relative flex items-start justify-between">
                        <div>
                          <h3
                            className="font-display font-black text-4xl tracking-tight"
                            style={{
                              color: group.colors.text,
                              textShadow: `0 0 20px ${group.colors.glow}`,
                            }}
                          >
                            {group.name}
                          </h3>
                          <p className="text-muted-foreground text-xs mt-2 max-w-sm leading-relaxed">
                            {group.description.slice(0, 90)}...
                          </p>
                        </div>
                        <ArrowRight
                          className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-smooth mt-1 flex-shrink-0"
                          style={{ color: group.colors.text }}
                        />
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="p-4 pt-3">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {highlights.map((h) => (
                          <span
                            key={h}
                            className="text-xs px-2 py-1 rounded-full font-display"
                            style={{
                              background: `${group.colors.glow.replace("0.4", "0.15")}`,
                              color: group.colors.text,
                            }}
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Members", val: group.memberCount },
                          { label: "Since", val: group.debutYear },
                          { label: "Songs", val: stats.songs },
                          { label: "Trivia", val: stats.trivia },
                        ].map(({ label, val }) => (
                          <div key={label} className="text-center">
                            <div
                              className="font-display font-bold text-lg"
                              style={{ color: group.colors.text }}
                            >
                              {val}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features section */}
      <section
        className="bg-muted/20 py-16 px-4"
        data-ocid="home.features_section"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display font-bold text-2xl mb-8 text-foreground"
          >
            What's Inside
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-elevated p-5 text-center"
                data-ocid={`home.feature_card.${i + 1}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="font-display font-semibold text-sm text-foreground mb-1">
                  {label}
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">
                  {desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
