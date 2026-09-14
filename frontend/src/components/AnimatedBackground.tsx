/**
 * A fixed, full-viewport gradient that slowly drifts — the "simple bg
 * animation" replacing the old scroll-scrubbed video hero. It's pure CSS
 * (see the `.animated-bg` keyframes in index.css), so it's cheap to run
 * and behaves the same on every page since it lives once in Layout
 * rather than being re-implemented per page.
 *
 * No pure black anywhere: the gradient moves between dark teal tones and
 * the brand color (#2fbcba) itself, so the background is on-brand even
 * while it's animating between its darkest and lightest points.
 */
export default function AnimatedBackground() {
  return <div className="animated-bg fixed inset-0 z-0" aria-hidden="true" />;
}
