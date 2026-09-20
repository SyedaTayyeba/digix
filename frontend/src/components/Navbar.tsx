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
    <header className="fixed top-0 z-50 w-full border-b border-brand/15 bg-ink-950/75 backdrop-blur-xl">
      {/* thin brand line along the very top edge */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-brand via-azure to-iris" />

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
          <span className="text-lg font-extrabold tracking-tight text-white">
            digix<span className="text-brand-300">dubai</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? 'bg-brand/15 text-brand-200'
                    : 'text-white hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            aria-label="Search"
            onClick={() =>
              setSearchOpen((value) => !value)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-white/10 hover:text-brand-200"
          >
            <Search size={18} />
          </button>

          <Link
            to="/book-consultation"
            className="btn-primary !rounded-full !px-5 !py-2.5 !text-sm"
          >
            Book a Strategy Call
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            aria-label="Search"
            onClick={() =>
              setSearchOpen((value) => !value)
            }
            className="flex h-10 w-10 items-center justify-center rounded-full text-white"
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
            className="flex h-10 w-10 items-center justify-center rounded-full text-white"
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
          className="border-t border-brand/15 px-5 py-3 sm:px-8 md:px-12"
        >
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) =>
              setQuery(e.target.value)
            }
            placeholder="Search services, FAQs…"
            className="field"
          />
        </form>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-brand/15 bg-ink-950/95 px-5 py-4 sm:px-8 md:hidden">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `rounded-xl px-3 py-3 text-sm font-medium ${
                  isActive
                    ? 'bg-brand/15 text-brand-200'
                    : 'text-white'
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
            className="btn-primary mt-2 !rounded-xl"
          >
            Book a Strategy Call
          </Link>
        </nav>
      )}
    </header>
  );
}
