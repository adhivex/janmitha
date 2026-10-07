import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/content";
import { Eyebrow, btn } from "./ui";

export function Collaborations({ services }: { services: Service[] }) {
  return (
    <section id="collaborate" aria-labelledby="collab-heading" className="py-14 md:py-24">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <Eyebrow>03 / WORK WITH ME</Eyebrow>
        <h2 id="collab-heading" className="mt-5 font-display text-[46px] leading-[1] font-medium md:text-[64px]">
          Ways we can
          <br />
          <em className="gold-shimmer">collaborate</em>
        </h2>

        <ol className="mt-10 grid md:mt-14 md:grid-cols-2 md:gap-x-12">
          {services.map((service, i) => (
            <li key={service.id} className="border-t border-gold-line">
              <a
                href="#contact"
                className="group flex items-start gap-4 py-6 pr-1 pl-1 transition-[padding] duration-500 ease-editorial hover:pl-3 md:py-8"
              >
                <span className="pt-1.5 font-display text-[16px] text-gold" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">
                  <span className="block font-display text-[28px] leading-[1.1] font-medium text-text">
                    {service.title}
                  </span>
                  <span className="mt-2 block text-[14px] leading-[1.6] text-text-muted">{service.description}</span>
                </span>
                <span
                  className={`${btn.iconCircle} h-11 w-11 border-gold-line-strong text-gold group-hover:border-gold group-hover:bg-gold group-hover:text-ink-text`}
                >
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
