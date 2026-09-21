export function LockedNav({ links }: { links: { label: string; href: string }[] }) {
  return (
    <header className="sticky top-0 z-40" style={{ background: "#131921" }}>
      <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3 text-white">
        <span className="font-display text-lg font-bold sm:text-xl">
          Grow<span style={{ color: "#febd69" }}>Gear</span>
        </span>
        {links.length > 0 && (
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            {links.map((l) => (
              // Plain <a> (not next/link): a hard navigation forces the shared
              // (shop) layout to re-evaluate lock state for the destination page.
              // A client-side <Link> transition would keep this locked chrome.
              <a key={l.href} href={l.href} className="text-white/80 hover:text-white hover:underline">
                {l.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
