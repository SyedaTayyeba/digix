import { Link } from 'react-router-dom';
import {
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Linkedin,
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

export default function Footer() {
  return (
    <footer className="border-t border-white/15 px-5 py-12 sm:px-8 md:px-12">
      <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">

        {/* Agency */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="mb-3 flex items-center gap-2">
            <img
              src={logo}
              alt="DigixDubai"
              className="h-10 w-10 object-contain"
            />

            <span className="text-base font-medium tracking-tight">
              digixdubai
            </span>
          </div>

          <p className="max-w-xs text-sm text-white/60">
            Think Digital, Think Digix. A Dubai-based digital agency focused
            on paid advertising, web development and lead generation.
          </p>

          <div className="mt-4 flex gap-4">
            <a
              href="https://www.instagram.com/ddigixdubai/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-white/60 transition hover:text-brand"
            >
              <Instagram size={18} strokeWidth={1.7} />
            </a>

            <a
              href="https://www.linkedin.com/company/digixdubai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/60 transition hover:text-brand"
            >
              <Linkedin size={18} strokeWidth={1.7} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-white">
            Quick Links
          </h4>

          <ul className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-white/60 transition hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-white">
            Services
          </h4>

          <p className="text-sm leading-6 text-white/50">
            Explore our digital services and discover solutions tailored to
            your business goals.
          </p>

          <Link
            to="/services"
            className="mt-3 inline-block text-sm text-brand transition hover:underline"
          >
            View all services →
          </Link>
        </div>

        {/* Resources */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-white">
            Resources
          </h4>

          <ul className="space-y-2">
            {RESOURCES.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-white/60 transition hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-3 text-sm font-medium text-white">
            Contact
          </h4>

          <ul className="space-y-3 text-sm text-white/60">

            <li className="flex items-start gap-2">
              <MapPin
                size={17}
                strokeWidth={1.7}
                className="mt-0.5 shrink-0"
              />
              <span>Dubai, UAE</span>
            </li>

            <li className="flex items-center gap-2">
              <Phone
                size={17}
                strokeWidth={1.7}
                className="shrink-0"
              />

              <a
                href="tel:+971521045088"
                className="transition hover:text-brand"
              >
                +971 52 104 5088
              </a>
            </li>

            <li className="flex items-center gap-2">
              <Mail
                size={17}
                strokeWidth={1.7}
                className="shrink-0"
              />

              <a
                href="mailto:ddigixdubai@gmail.com"
                className="break-all transition hover:text-brand"
              >
                ddigixdubai@gmail.com
              </a>
            </li>

            <li className="flex items-start gap-2">
              <MapPin
                size={17}
                strokeWidth={1.7}
                className="mt-0.5 shrink-0"
              />
              <span>Working across UAE &amp; GCC</span>
            </li>

            <li>
              <a
                href="https://wa.me/971521045088?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-brand"
              >
                <MessageCircle
                  size={17}
                  strokeWidth={1.7}
                />
                <span>Chat on WhatsApp</span>
              </a>
            </li>

          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-5 flex flex-col gap-3 border-t border-white/15 pt-3 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} DigixDubai. All rights reserved.
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            to="/privacy-policy"
            className="transition hover:text-brand"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms-conditions"
            className="transition hover:text-brand"
          >
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </footer>
  );
}
