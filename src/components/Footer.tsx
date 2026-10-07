export function Footer() {
  return (
    <footer className="px-5 pt-4 pb-10 text-center md:pb-12">
      <p className="text-[10px] leading-[1.8] tracking-[0.3em] text-text-fainter md:text-[11px]">
        © JANMITHA · BEAUTY. INTELLIGENCE. IMPACT.
      </p>
      <p className="mt-3 text-[13px] text-text-fainter">
        Designed &amp; Developed by{" "}
        <a
          href="https://orangekite.si/"
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-11 items-center font-semibold text-[#FF6B35] underline-offset-4 hover:underline"
        >
          OrangeKite
        </a>
      </p>
    </footer>
  );
}
