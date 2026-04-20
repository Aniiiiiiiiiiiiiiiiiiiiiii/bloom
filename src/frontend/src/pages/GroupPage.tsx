import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronLeft,
  Gamepad2,
  Lightbulb,
  Users,
} from "lucide-react";
import { Suspense, lazy } from "react";
import { groups } from "../data/groups";
import { useAppStore } from "../store/useAppStore";
import type { GroupId, SectionId } from "../types";

const ChartsSection = lazy(() => import("../sections/ChartsSection"));
const MembersSection = lazy(() => import("../sections/MembersSection"));
const GamesSection = lazy(() => import("../sections/GamesSection"));
const FactsSection = lazy(() => import("../sections/FactsSection"));

const SECTIONS: { id: SectionId; label: string; icon: typeof BarChart3 }[] = [
  { id: "charts", label: "Charts", icon: BarChart3 },
  { id: "members", label: "Members", icon: Users },
  { id: "games", label: "Games", icon: Gamepad2 },
  { id: "facts", label: "Facts", icon: Lightbulb },
];

const groupGradientStyle: Record<GroupId, React.CSSProperties> = {
  illit: {
    background:
      "linear-gradient(135deg, oklch(0.22 0.04 350), oklch(0.15 0.02 350))",
    borderBottom: "1px solid oklch(0.7 0.15 350 / 0.3)",
  },
  bts: {
    background:
      "linear-gradient(135deg, oklch(0.18 0.05 280), oklch(0.12 0.03 280))",
    borderBottom: "1px solid oklch(0.55 0.18 280 / 0.3)",
  },
  cortis: {
    background:
      "linear-gradient(135deg, oklch(0.18 0.05 200), oklch(0.12 0.03 200))",
    borderBottom: "1px solid oklch(0.6 0.18 200 / 0.3)",
  },
  lesserafim: {
    background:
      "linear-gradient(135deg, oklch(0.2 0.05 25), oklch(0.14 0.03 25))",
    borderBottom: "1px solid oklch(0.65 0.16 25 / 0.3)",
  },
};

function SectionSkeleton() {
  return (
    <div className="p-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default function GroupPage() {
  const { groupId, section } = useParams({ strict: false });
  const navigate = useNavigate();
  const { setActiveGroup, setActiveSection } = useAppStore();

  const resolvedGroupId = (groupId ?? "bts") as GroupId;
  const resolvedSection = (section ?? "charts") as SectionId;

  const group = groups.find((g) => g.id === resolvedGroupId);

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground text-lg">Group not found.</p>
        <Link
          to="/"
          className="text-primary hover:underline"
          data-ocid="group.back_home_link"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const handleSectionChange = (s: SectionId) => {
    setActiveGroup(resolvedGroupId);
    setActiveSection(s);
    void navigate({
      to: "/group/$groupId/$section",
      params: { groupId: resolvedGroupId, section: s },
    });
  };

  const sectionTabStyle = (id: SectionId) => {
    const isActive = resolvedSection === id;
    return {
      base: "flex items-center gap-2 px-5 py-3 text-sm font-display font-semibold tracking-wide transition-smooth border-b-2 whitespace-nowrap",
      active: isActive
        ? "border-b-2"
        : "border-transparent text-muted-foreground hover:text-foreground",
    };
  };

  const accentColor = group.colors.primary;

  return (
    <div className="min-h-screen">
      {/* Group hero banner */}
      <div
        style={groupGradientStyle[resolvedGroupId]}
        className="relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at 70% 50%, ${group.colors.glow}, transparent 60%)`,
          }}
        />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 relative">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-smooth mb-4"
            data-ocid="group.back_home_link"
          >
            <ChevronLeft className="w-3 h-3" /> All Groups
          </Link>
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div>
              <h1
                className="font-display font-black text-5xl md:text-7xl tracking-tight leading-none"
                style={{
                  color: accentColor,
                  textShadow: `0 0 40px ${group.colors.glow}`,
                }}
              >
                {group.name}
              </h1>
              <p className="mt-3 text-muted-foreground max-w-xl text-sm leading-relaxed">
                {group.description}
              </p>
            </div>
            <div className="flex gap-6 md:ml-auto text-center flex-shrink-0">
              <div>
                <div
                  className="font-display font-bold text-2xl"
                  style={{ color: accentColor }}
                >
                  {group.memberCount}
                </div>
                <div className="text-xs text-muted-foreground">Members</div>
              </div>
              <div>
                <div
                  className="font-display font-bold text-2xl"
                  style={{ color: accentColor }}
                >
                  {group.debutYear}
                </div>
                <div className="text-xs text-muted-foreground">Debut</div>
              </div>
              <div>
                <div
                  className="font-display font-bold text-xl"
                  style={{ color: accentColor }}
                >
                  {group.fandomName}
                </div>
                <div className="text-xs text-muted-foreground">Fandom</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section sub-nav */}
      <div
        className="sticky top-16 z-40 bg-card/90 backdrop-blur-md border-b border-border/20"
        data-ocid="group.section_tabs"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {SECTIONS.map(({ id, label, icon: Icon }) => {
              const isActive = resolvedSection === id;
              const { base, active } = sectionTabStyle(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSectionChange(id)}
                  data-ocid={`group.section_tab.${id}`}
                  className={[base, active].join(" ")}
                  style={
                    isActive
                      ? { borderBottomColor: accentColor, color: accentColor }
                      : {}
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Suspense fallback={<SectionSkeleton />}>
          {resolvedSection === "charts" && (
            <ChartsSection groupId={resolvedGroupId} />
          )}
          {resolvedSection === "members" && (
            <MembersSection groupId={resolvedGroupId} />
          )}
          {resolvedSection === "games" && (
            <GamesSection groupId={resolvedGroupId} />
          )}
          {resolvedSection === "facts" && (
            <FactsSection groupId={resolvedGroupId} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
