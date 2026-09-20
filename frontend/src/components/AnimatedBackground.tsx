/**
 * Fixed, full-viewport background shared by every public page.
 *
 * Pure CSS (see `.aurora` in index.css): layered teal / iris / coral / azure
 * glows on a deep teal-ink base, with two slow-drifting light pools and a
 * faint dot grid. It replaces the old scroll-scrubbed video + 50% black
 * overlay, which flattened every colour and was heavy on mobile.
 */
export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="aurora absolute inset-0" />
      <div className="aurora-grid absolute inset-0" />
    </div>
  );
}
