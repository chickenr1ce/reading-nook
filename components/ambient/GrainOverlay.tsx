/**
 * A subtle noise/grain texture overlay.
 * Fixed position, pointer-events-none — never on scrolling containers.
 * Server component — no JS needed.
 */
export function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 z-[60] pointer-events-none opacity-[0.015]"
      aria-hidden="true"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
