import { MessageCircle } from 'lucide-react';

/**
 * FR-13: "A visible WhatsApp CTA opens a chat with an appropriate
 * pre-filled message." Kept as a fixed corner button so it's reachable
 * from every page, not just Contact.
 */
export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/971521045088?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="btn-primary fixed bottom-5 right-5 z-40 h-12 w-12 rounded-full p-0"
    >
      <MessageCircle size={22} />
    </a>
  );
}
