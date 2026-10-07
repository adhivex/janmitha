import type { Stat } from "@/lib/content";

export function StatsBar({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;

  return (
    <section aria-label="At a glance" className="relative z-20 -mt-7 px-5 md:-mt-10 md:px-8">
      <dl
        className="glass mx-auto grid max-w-[1200px] rounded-[26px] py-6 md:py-9"
        style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
      >
        {stats.map((stat, i) => (
          <div
            key={stat.id}
            className={`flex flex-col-reverse items-center gap-2 px-1 text-center ${i > 0 ? "border-l border-gold-line" : ""}`}
          >
            <dt className="text-[10px] leading-[1.4] font-normal tracking-[0.16em] text-text-muted md:text-[11px] md:tracking-[0.26em]">
              {stat.label}
            </dt>
            <dd className="gold-shimmer font-display text-[40px] leading-none font-semibold md:text-[52px]">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
