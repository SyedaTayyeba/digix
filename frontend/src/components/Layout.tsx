import { Outlet } from 'react-router-dom';
import ScrollVideo from './ScrollVideo';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './ui/WhatsAppButton';

/**
 * Shared shell for every route. The FRS calls for the same header/footer
 * and a persistent WhatsApp CTA (FR-13) across the whole public site, so
 * this lives once here rather than being repeated per page. ScrollVideo
 * also lives here — once — so the exact same scroll-scrubbed video plays
 * behind every page, not just Home.
 */
export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col text-white">
      <ScrollVideo />
      {/* Darkens the video just enough that plain white text stays readable. */}
      <div className="fixed inset-0 z-[1] bg-black/50 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 pt-16 sm:pt-[72px]">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </div>
  );
}
