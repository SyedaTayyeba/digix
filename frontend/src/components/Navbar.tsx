import { useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Menu,
  X,
} from 'lucide-react';

import logo from '../assets/logo.png';

// Main public navigation.
// Case Studies and Blog are temporarily hidden until content is available.
const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const navigate = useNavigate();

  function submitSearch(e: FormEvent) {
    e.preventDefault();

    if (!query.trim()) return;

    navigate(
      `/search?q=${encodeURIComponent(query.trim())}`
    );

    setSearchOpen(false);
    setMenuOpen(false);
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/15 bg-[#0a0a0a]/70 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-5 py-1 sm:px-8 md:px-12">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center"
          aria-label="DigixDubai Home"
        >
          <img
            src={logo}
            alt="DigixDubai Logo"
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />
          <span>
            digixdubai
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition-colors duration-300 hover:text-brand ${
                  isActive
                    ? 'text-brand'
                    : 'text-white/75'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            aria-label="Search"
            onClick={() =>
              setSearchOpen((value) => !value)
            }
            className="text-white/80 transition-colors duration-300 hover:text-brand"
          >
            <Search size={18} />
          </button>

          <Link
            to="/book-consultation"
            className="rounded-md border border-brand/40 bg-brand/15 px-4 py-2 text-xs backdrop-blur-md transition-colors duration-300 hover:bg-brand/25 sm:px-5 sm:text-sm"
          >
            Book a Strategy Call
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-label="Search"
            onClick={() =>
              setSearchOpen((value) => !value)
            }
            className="text-white/80"
          >
            <Search size={18} />
          </button>

          <button
            type="button"
            aria-label={
              menuOpen
                ? 'Close menu'
                : 'Open menu'
            }
            onClick={() =>
              setMenuOpen((value) => !value)
            }
            className="text-white"
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      {searchOpen && (
        <form
          onSubmit={submitSearch}
          className="border-t border-white/15 px-5 py-3 sm:px-8 md:px-12"
        >
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search services, FAQs…"
            className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-brand/50"
          />
        </form>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-white/15 px-5 py-4 sm:px-8 md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `rounded-md px-2 py-2.5 text-sm ${
                  isActive
                    ? 'bg-brand/10 text-brand'
                    : 'text-white/80'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <Link
            to="/book-consultation"
            onClick={() =>
              setMenuOpen(false)
            }
            className="mt-2 rounded-md bg-brand px-4 py-2.5 text-center text-sm font-medium text-black"
          >
            Book a Strategy Call
          </Link>
        </nav>
      )}
    </header>
  );
}