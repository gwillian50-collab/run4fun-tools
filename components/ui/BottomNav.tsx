"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function IconVdot({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#71717a";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="12" width="4" height="9" rx="1" fill={c} />
      <rect x="10" y="7" width="4" height="14" rx="1" fill={c} />
      <rect x="17" y="3" width="4" height="18" rx="1" fill={c} />
    </svg>
  );
}

function IconRace({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#71717a";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 3h8l-1.5 7H9.5L8 3Z" fill={c} />
      <path d="M9.5 10c0 2.485 1.12 4 2.5 4s2.5-1.515 2.5-4" stroke={c} strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M10 14l-3 4h10l-3-4" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <line x1="12" y1="18" x2="12" y2="21" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconTools({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#71717a";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShare({ active }: { active: boolean }) {
  const c = active ? "#ffffff" : "#71717a";
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3v12M8.5 6.5 12 3l3.5 3.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const tabs = [
  { href: "/vdot",  label: "VDOT",  Icon: IconVdot  },
  { href: "/prova", label: "Prova", Icon: IconRace  },
  { href: "/tools", label: "Tools", Icon: IconTools },
  { href: "/share", label: "Share", Icon: IconShare },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-black/95 backdrop-blur border-t border-zinc-800/60">
      <div className="max-w-2xl mx-auto flex">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 min-h-[56px] transition-colors ${
                active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon active={active} />
              <span className={`text-[11px] font-medium ${active ? "text-white" : "text-zinc-500"}`}>
                {label}
              </span>
              <span className={`w-1 h-1 rounded-full transition-all ${active ? "bg-white" : "bg-transparent"}`} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
