import { Link } from 'react-router-dom';
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
} from 'lucide-react';
import logo from '../assets/logo.png';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Contact', to: '/contact' },
];

const RESOURCES = [
  { label: 'FAQs', to: '/faqs' },
  { label: 'Book a Strategy Call', to: '/book-consultation' },
  { label: 'Contact', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-conditions' },
];

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ddigixdubai/?hl=en',
    icon: Instagram,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/digixdubai/',
    icon: Linkedin,
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@digix.dubai',
    icon: null,
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61593457215218',
    icon: Facebook,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@DigixDubai',
    icon: Youtube,
  },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-brand/15 bg-gradient-to-b from-ink-900/60 to-ink-950/95 px-5 py-14 sm:px-8 md:px-12">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">

        {/* Agency */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <img
              src={logo}
              alt="DigixDubai"
              className="h-10 w-10 object-contain"
            />

            <span className="text-lg font-extrabold tracking-tight">
              digix<span className="text-brand-300">dubai</span>
            </span>
          </div>

          <p className="max-w-xs text-sm text-white">
            Think Digital, Think Digix. A Dubai-based digital agency focused
            on paid advertising, web development and lead generation.
          </p>

          {/* Social Media */}
          <div className="mt-5 flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  title={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand/20 bg-brand/10 text-brand-200 transition hover:-translate-y-0.5 hover:bg-brand/25 hover:text-white"
                >
                  {Icon ? (
                    <Icon size={18} strokeWidth={1.7} />
                  ) : (
                    <span className="text-sm font-bold">♪</span>
                  )}
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-white">
            Quick Links
          </h4>

          <ul className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-white transition hover:text-brand-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-white">
            Services
          </h4>

          <p className="text-sm leading-6 text-white">
            Explore our digital services and discover solutions tailored to
            your business goals.
          </p>

          <Link
            to="/services"
            className="mt-3 inline-block text-sm font-semibold text-brand-300 transition hover:text-white"
          >
            View all services →
          </Link>
        </div>

        {/* Resources */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-white">
            Resources
          </h4>

          <ul className="space-y-2">
            {RESOURCES.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-white transition hover:text-brand-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 text-sm font-bold text-white">
            Contact
          </h4>

          <ul className="space-y-3 text-sm text-white">

            <li className="flex items-start gap-2">
              <MapPin
                size={17}
                strokeWidth={1.7}
                className="mt-0.5 shrink-0 text-brand-300"
              />
              <span>Dubai, UAE</span>
            </li>

            <li className="flex items-center gap-2">
              <Phone
                size={17}
                strokeWidth={1.7}
                className="shrink-0 text-brand-300"
              />

              <a
                href="tel:+971521045088"
                className="transition hover:text-brand-300"
              >
                +971 52 104 5088
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Mail
                size={17}
                strokeWidth={1.7}
                className="shrink-0 text-brand-300"
              />

              <a
                href="mailto:ddigixdubai@gmail.com"
                className="break-all transition hover:text-brand-300"
              >
                ddigixdubai@gmail.com
              </a>
            </li>

            <li className="flex items-start gap-2">
              <MapPin
                size={17}
                strokeWidth={1.7}
                className="mt-0.5 shrink-0 text-brand-300"
              />
              <span>Working across UAE &amp; GCC</span>
            </li>

            <li>
              <a
                href="https://wa.me/971521045088?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-brand-300"
              >
                <MessageCircle
                  size={17}
                  strokeWidth={1.7}
                  className="text-brand-300"
                />
                <span>Chat on WhatsApp</span>
              </a>
            </li>

          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-brand/15 pt-5 text-xs text-white sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} DigixDubai. All rights reserved.
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            to="/privacy-policy"
            className="transition hover:text-brand-300"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms-conditions"
            className="transition hover:text-brand-300"
          >
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}