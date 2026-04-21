"use client";
import { Bug, User, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    icon: "Bug",
    bg: "#edeefc",
    message: "You fixed a bug.",
    time: "Just now",
  },
  {
    id: 2,
    icon: "User",
    bg: "#e6f1fd",
    message: "New user registered.",
    time: "59 minutes ago",
  },
  {
    id: 3,
    icon: "Bug",
    bg: "#edeefc",
    message: "You fixed a bug.",
    time: "12 hours ago",
  },
  {
    id: 4,
    icon: "Broadcast",
    bg: "#e6f1fd",
    message: "Andi Lane subscribed to you.",
    time: "Today, 11:59 AM",
  },
];

const activities = [
  {
    action: "Changed the style.",
    time: "Just now",
    initials: "AA",
    bg: "#edeefc",
  },
  {
    action: "Released a new version.",
    time: "59 minutes ago",
    initials: "AF",
    bg: "#e6f1fd",
  },
  {
    action: "Submitted a bug.",
    time: "12 hours ago",
    initials: "AM",
    bg: "#edeefc",
  },
  {
    action: "Modified a data in Page X.",
    time: "Today, 11:59 AM",
    initials: "A3",
    bg: "#e6f1fd",
  },
  {
    action: "Deleted a page in Project X.",
    time: "Feb 2, 2026",
    initials: "A4",
    bg: "#edeefc",
  },
];

const contacts = [
  { name: "Natali Craig", initials: "NC", bg: "#e6f1fd" },
  { name: "Drew Cano", initials: "DC", bg: "#edeefc" },
  { name: "Andi Lane", initials: "AL", bg: "#e6f1fd" },
  { name: "Koray Okumus", initials: "KO", bg: "#edeefc" },
  { name: "Kate Morrison", initials: "KM", bg: "#e6f1fd" },
  { name: "Melody Macy", initials: "MM", bg: "#edeefc" },
];

const iconMap: Record<string, React.ElementType> = {
  Bug,
  User,
  Broadcast: Radio,
};

export function RightBar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 z-30 shrink-0",
        "bg-white dark:bg-[rgb(32,32,32)]",
        "border-l border-black/[0.06] dark:border-white/[0.06]",
        "transition-[width] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden",
        collapsed ? "w-14" : "w-[280px]",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center shrink-0 h-[68px] px-4",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <span className='text-[13.5px] font-medium text-black dark:text-white'>
            Notification
          </span>
        )}
      </div>

      {collapsed ? (
        /* Collapsed: icon dots */
        <div className='flex flex-col items-center gap-3 pt-2 px-2'>
          {notifications.map((n) => {
            const Icon = iconMap[n.icon] || Bug;
            return (
              <div
                key={n.id}
                className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0'
                style={{ background: n.bg }}
              >
                <Icon size={15} className='text-black/60' />
              </div>
            );
          })}
        </div>
      ) : (
        <div className='flex-1 overflow-y-auto scrollbar-thin'>
          {/* ── Section: Notifications ── */}
          <Section label='Notifications'>
            {notifications.map((n) => {
              const Icon = iconMap[n.icon] || Bug;
              return (
                <div
                  key={n.id}
                  className='flex items-start gap-3 px-4 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors'
                >
                  {/* Icon bubble */}
                  <div
                    className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5'
                    style={{ background: n.bg }}
                  >
                    <Icon
                      size={15}
                      className='text-black/60 dark:text-black/60'
                    />
                  </div>
                  {/* Text */}
                  <div className='flex-1 min-w-0'>
                    <p className='text-[13px] text-black dark:text-white leading-5'>
                      {n.message}
                    </p>
                    <p className='text-[11.5px] text-black/40 dark:text-white/40 mt-0.5'>
                      {n.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </Section>

          {/* ── Section: Activities ── */}
          <Section label='Activities'>
            {activities.map((a, i) => (
              <div
                key={i}
                className='flex items-start gap-3 px-4 py-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors'
              >
                {/* Avatar */}
                <div
                  className='w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-semibold text-black/50 dark:text-black/60 border border-black/[0.06]'
                  style={{ background: a.bg }}
                >
                  {a.initials}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-[13px] text-black dark:text-white leading-5'>
                    {a.action}
                  </p>
                  <p className='text-[11.5px] text-black/40 dark:text-white/40 mt-0.5'>
                    {a.time}
                  </p>
                </div>
              </div>
            ))}
          </Section>

          {/* ── Section: Contacts ── */}
          <Section label='Contacts'>
            {contacts.map((c, i) => (
              <div
                key={i}
                className='flex items-center gap-3 px-4 py-2.5 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer transition-colors'
              >
                <div
                  className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold text-black/50 border border-black/[0.06]'
                  style={{ background: c.bg }}
                >
                  {c.initials}
                </div>
                <span className='text-[13px] text-black dark:text-white'>
                  {c.name}
                </span>
              </div>
            ))}
          </Section>
        </div>
      )}
    </aside>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className='px-4 py-2 mt-1'>
        <span className='text-[11px] font-semibold uppercase tracking-widest text-black/30 dark:text-white/30'>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
