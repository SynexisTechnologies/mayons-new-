import type { ReactNode } from "react";

interface Props {
  badge?: string;
  badgeIcon?: ReactNode;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}

export default function SectionHeader({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = "center",
  dark = false,
  className = "",
}: Props) {
  const isCenter = align === "center";
  return (
    <div className={`flex flex-col ${isCenter ? "items-center text-center" : "items-start"} mb-12 ${className}`}>
      {badge && (
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.15em] uppercase mb-4 ${
          dark
            ? "bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37]"
            : "bg-[#d4af37]/15 text-[#1e3a5f]"
        }`}>
          {badgeIcon && <span className="text-[#d4af37]">{badgeIcon}</span>}
          {badge}
        </div>
      )}
      <h2 className={`text-3xl md:text-4xl font-extrabold mb-3 ${dark ? "text-white" : "text-[#1e3a5f]"}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-sm leading-relaxed ${isCenter ? "max-w-xl mx-auto" : "max-w-lg"} ${dark ? "text-white/50" : "text-slate-400"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
