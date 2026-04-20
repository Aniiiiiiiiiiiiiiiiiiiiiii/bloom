import { Calendar, Globe2, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { btsMembers } from "../data/bts-data";
import { cortisMembers } from "../data/cortis-data";
import { getGroup } from "../data/groups";
import { illitMembers } from "../data/illit-data";
import { lesserafimMembers } from "../data/lesserafim-data";
import type { GroupId, Member } from "../types";

interface Props {
  groupId: GroupId;
}

const membersByGroup: Record<GroupId, Member[]> = {
  illit: illitMembers,
  bts: btsMembers,
  cortis: cortisMembers,
  lesserafim: lesserafimMembers,
};

const roleColors: Record<string, string> = {
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
  Maknae: "oklch(0.6 0.15 160)",
};

function getRoleColor(role: string): string {
  return roleColors[role] ?? "oklch(0.55 0.1 280)";
}

function formatBirthday(birthday: string): string {
  const d = new Date(birthday);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getAge(birthday: string): number {
  const today = new Date();
  const birth = new Date(birthday);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getNextBirthday(birthday: string): string {
  const today = new Date();
  const birth = new Date(birthday);
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  const diffMs = next.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "🎂 Today!";
  if (diffDays === 1) return "🎉 Tomorrow!";
  if (diffDays <= 30) return `${diffDays} days away`;
  return formatBirthday(birthday);
}

interface MemberModalProps {
  member: Member;
  groupColor: string;
  onClose: () => void;
}

function MemberModal({ member, groupColor, onClose }: MemberModalProps) {
  const initial = member.name[0].toUpperCase();
  const age = getAge(member.birthday);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.75)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 32 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 22, stiffness: 300 }}
        className="relative w-full max-w-lg rounded-2xl border overflow-hidden"
        style={{
          background: "oklch(0.14 0 0 / 0.96)",
          borderColor: `${groupColor}50`,
          boxShadow: `0 0 60px ${groupColor}30`,
          backdropFilter: "blur(20px)",
        }}
        onClick={(e) => e.stopPropagation()}
        data-ocid="members.dialog"
      >
        {/* Header gradient */}
        <div
          className="h-28 flex items-end px-6 pb-4 relative"
          style={{
            background: `linear-gradient(135deg, ${groupColor}40, ${groupColor}10)`,
          }}
        >
          <button
            type="button"
            className="absolute top-4 right-4 cursor-pointer rounded-full p-1.5 transition-smooth border-0 outline-none"
            style={{ background: "oklch(0.2 0 0 / 0.6)" }}
            onClick={onClose}
            onKeyDown={(e) => e.key === "Enter" && onClose()}
            data-ocid="members.close_button"
          >
            <X className="w-4 h-4 text-foreground/70" />
          </button>
          <div className="flex items-end gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 shadow-lg"
              style={{
                background: `${groupColor}25`,
                borderColor: `${groupColor}60`,
                color: groupColor,
              }}
            >
              {initial}
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground leading-tight">
                {member.name}
              </h2>
              <p className="text-sm" style={{ color: groupColor }}>
                {member.position}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Roles */}
          <div className="flex flex-wrap gap-2">
            {member.role.map((r) => (
              <span
                key={r}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: `${getRoleColor(r)}20`,
                  color: getRoleColor(r),
                  border: `1px solid ${getRoleColor(r)}40`,
                }}
              >
                {r}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar
                className="w-4 h-4 shrink-0"
                style={{ color: groupColor }}
              />
              <div>
                <div className="text-foreground/80 font-medium">
                  {formatBirthday(member.birthday)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {age} years old
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Globe2
                className="w-4 h-4 shrink-0"
                style={{ color: groupColor }}
              />
              <div>
                <div className="text-foreground/80 font-medium">
                  {member.nationality}
                </div>
                <div className="text-xs text-muted-foreground">Nationality</div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              About
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {member.bio}
            </p>
          </div>

          {/* Fun Facts */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Star className="w-3 h-3" style={{ color: groupColor }} />
              Fun Facts
            </h3>
            <ul className="space-y-2">
              {member.funFacts.map((fact, i) => (
                <li
                  key={fact.slice(0, 30)}
                  className="flex items-start gap-2.5 text-sm"
                >
                  <span
                    className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ background: `${groupColor}25`, color: groupColor }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-foreground/75">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MembersSection({ groupId }: Props) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const members = membersByGroup[groupId];
  const group = getGroup(groupId);
  const groupColor = group?.colors.primary ?? "oklch(0.65 0.15 300)";
  const gridRef = useRef<HTMLDivElement>(null);

  const cols =
    members.length <= 5
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <section data-ocid="members.section" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Meet the Members
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {members.length} members · Click a card to see full profile
          </p>
        </div>
      </div>

      <div
        ref={gridRef}
        className={`grid ${cols} gap-4`}
        data-ocid="members.list"
      >
        {members.map((member, index) => {
          const initial = member.name[0].toUpperCase();
          const isHovered = hoveredMember === member.id;
          const nextBday = getNextBirthday(member.birthday);

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative group cursor-pointer rounded-2xl border overflow-hidden"
              style={{
                background: "oklch(0.15 0 0 / 0.9)",
                borderColor: isHovered
                  ? `${groupColor}60`
                  : "oklch(0.28 0 0 / 0.5)",
                boxShadow: isHovered
                  ? `0 0 30px ${groupColor}30, 0 8px 32px oklch(0 0 0 / 0.4)`
                  : "0 4px 16px oklch(0 0 0 / 0.3)",
                transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                transform: isHovered
                  ? "scale(1.04) translateY(-4px)"
                  : "scale(1) translateY(0)",
              }}
              onMouseEnter={() => setHoveredMember(member.id)}
              onMouseLeave={() => setHoveredMember(null)}
              onClick={() => setSelectedMember(member)}
              data-ocid={`members.item.${index + 1}`}
            >
              {/* Card gradient top */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: `linear-gradient(90deg, ${groupColor}, ${groupColor}60)`,
                }}
              />

              <div className="p-4 space-y-3">
                {/* Avatar circle */}
                <div className="flex justify-center pt-1">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold font-display border-2 transition-smooth"
                    style={{
                      background: isHovered
                        ? `${groupColor}30`
                        : `${groupColor}15`,
                      borderColor: isHovered
                        ? `${groupColor}80`
                        : `${groupColor}40`,
                      color: groupColor,
                    }}
                  >
                    {initial}
                  </div>
                </div>

                {/* Name + primary role */}
                <div className="text-center space-y-1.5">
                  <p className="font-display font-bold text-foreground text-sm leading-tight">
                    {member.name}
                  </p>
                  <span
                    className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${getRoleColor(member.role[0])}20`,
                      color: getRoleColor(member.role[0]),
                      border: `1px solid ${getRoleColor(member.role[0])}35`,
                    }}
                  >
                    {member.role[0]}
                  </span>
                </div>

                {/* Birthday */}
                <div className="text-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 inline mr-1 opacity-60" />
                  {nextBday}
                </div>
              </div>

              {/* Hover overlay: fun facts */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 rounded-2xl p-3 flex flex-col justify-end"
                    style={{
                      background: `linear-gradient(180deg, ${groupColor}08 0%, oklch(0.1 0 0 / 0.92) 35%)`,
                    }}
                  >
                    <div className="space-y-1">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-wider mb-2"
                        style={{ color: groupColor }}
                      >
                        Fun Facts
                      </p>
                      {member.funFacts.slice(0, 3).map((fact) => (
                        <p
                          key={fact.slice(0, 30)}
                          className="text-[10px] text-foreground/80 leading-snug flex items-start gap-1.5"
                        >
                          <span
                            style={{ color: groupColor }}
                            className="shrink-0"
                          >
                            ✦
                          </span>
                          <span className="line-clamp-2">{fact}</span>
                        </p>
                      ))}
                      <p
                        className="text-[10px] mt-2 font-medium"
                        style={{ color: groupColor }}
                      >
                        Click for full profile →
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Member Modal */}
      <AnimatePresence>
        {selectedMember && (
          <MemberModal
            member={selectedMember}
            groupColor={groupColor}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
