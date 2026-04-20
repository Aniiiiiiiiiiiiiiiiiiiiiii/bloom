import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Music2, Sparkles, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { groups } from "../data/groups";
import { useAppStore } from "../store/useAppStore";
import type { GroupId } from "../types";

interface LayoutProps {
  children: ReactNode;
}

const groupNavConfig: {
  id: GroupId;
  label: string;
  colorClass: string;
  borderClass: string;
  textClass: string;
}[] = [
  {
    id: "illit",
    label: "ILLIT",
    colorClass: "hover:bg-[oklch(0.7_0.15_350/0.15)]",
    borderClass: "border-[oklch(0.7_0.15_350)]",
    textClass: "text-[oklch(0.85_0.12_350)]",
  },
  {
    id: "bts",
    label: "BTS",
    colorClass: "hover:bg-[oklch(0.55_0.18_280/0.15)]",
    borderClass: "border-[oklch(0.55_0.18_280)]",
    textClass: "text-[oklch(0.75_0.15_280)]",
  },
  {
    id: "cortis",
    label: "Cortis",
    colorClass: "hover:bg-[oklch(0.6_0.18_200/0.15)]",
    borderClass: "border-[oklch(0.6_0.18_200)]",
    textClass: "text-[oklch(0.75_0.15_200)]",
  },
  {
    id: "lesserafim",
    label: "LE SSERAFIM",
    colorClass: "hover:bg-[oklch(0.65_0.16_25/0.15)]",
    borderClass: "border-[oklch(0.65_0.16_25)]",
    textClass: "text-[oklch(0.82_0.13_30)]",
  },
];

export default function Layout({ children }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { activeGroup, setActiveGroup } = useAppStore();
  const navigate = useNavigate();

  const handleGroupClick = (groupId: GroupId) => {
    setActiveGroup(groupId);
    setMenuOpen(false);
    void navigate({
      to: "/group/$groupId/$section",
      params: { groupId, section: "charts" },
    });
  };

  const activeGroupData = groups.find((g) => g.id === activeGroup);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/30"
        style={{
          boxShadow: activeGroupData
            ? `0 1px 24px ${activeGroupData.colors.glow}`
            : undefined,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group flex-shrink-0"
            data-ocid="nav.link"
          >
            <div className="relative">
              <Music2 className="w-6 h-6 text-primary transition-smooth group-hover:scale-110" />
              <Sparkles className="w-3 h-3 text-primary absolute -top-1 -right-1 animate-pulse-glow" />
            </div>
            <span className="font-display font-bold text-xl tracking-widest text-foreground">
              BLOOM
              <span className="text-primary text-sm align-super">+</span>
            </span>
          </Link>

          {/* Desktop group nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            data-ocid="nav.group_tabs"
          >
            {groupNavConfig.map((g) => {
              const isActive = activeGroup === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => handleGroupClick(g.id)}
                  data-ocid={`nav.group_tab.${g.id}`}
                  type="button"
                  className={[
                    "px-4 py-2 rounded-md text-sm font-display font-semibold tracking-wide transition-smooth border",
                    isActive
                      ? `${g.borderClass} ${g.textClass} bg-card/60`
                      : `border-transparent text-muted-foreground ${g.colorClass}`,
                  ].join(" ")}
                >
                  {g.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-smooth"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.hamburger_toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="md:hidden border-t border-border/20 bg-card/95 backdrop-blur-md px-4 py-3 flex flex-col gap-2"
            data-ocid="nav.mobile_menu"
          >
            {groupNavConfig.map((g) => {
              const isActive = activeGroup === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleGroupClick(g.id)}
                  data-ocid={`nav.mobile_group_tab.${g.id}`}
                  className={[
                    "w-full text-left px-4 py-3 rounded-lg text-sm font-display font-semibold tracking-wide transition-smooth border",
                    isActive
                      ? `${g.borderClass} ${g.textClass} bg-card/60`
                      : `border-transparent text-muted-foreground ${g.colorClass}`,
                  ].join(" ")}
                >
                  {g.label}
                </button>
              );
            })}
            <Link
              to="/"
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-display font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-smooth border border-transparent"
              onClick={() => setMenuOpen(false)}
              data-ocid="nav.mobile_home_link"
            >
              🏠 Home
            </Link>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-card/60 border-t border-border/20 py-6 px-4 text-center text-muted-foreground text-xs backdrop-blur-sm">
        <p className="font-body">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline transition-smooth"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
