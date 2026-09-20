import type { FormEvent } from 'react';
import { useState } from 'react';
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { accentAt } from '../lib/accents';
import { api } from '../lib/api';
import PageOverlay from '../components/ui/PageOverlay';

type LeadResponse = {
  message?: string;
  data?: {
    id?: number;
  };
};

const cardClass =
  'surface-card surface-card-hover';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError('');
    setSubmitted(false);

    const form = new FormData(e.currentTarget);

    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const message = String(form.get('message') || '').trim();

    if (!name || !email || !message) {
      setError(
        'Please fill in your name, email, and message.'
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post<LeadResponse>(
        '/leads',
        {
          name,
          email,
          message,
          source: 'contact_form',
          form_data: {
            message,
          },
        }
      );

      const leadId = response.data?.data?.id;

      if (leadId) {
        localStorage.setItem(
          'digix_lead_id',
          String(leadId)
        );
      }

      try {
        await api.post('/conversion-events', {
          event_name: 'lead_submitted',
          source: 'contact_form',
          page_url: window.location.href,
          metadata: {
            lead_id: leadId ?? null,
          },
        });
      } catch (conversionError) {
        console.error(
          'Failed to track lead conversion:',
          conversionError
        );
      }

      setSubmitted(true);
      e.currentTarget.reset();
    } catch (err) {
      console.error(
        'Failed to submit contact form:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleWhatsAppClick() {
    const leadId = localStorage.getItem(
      'digix_lead_id'
    );

    if (leadId) {
      try {
        await api.post(
          `/leads/${leadId}/whatsapp`
        );
      } catch (err) {
        console.error(
          'Failed to track WhatsApp engagement:',
          err
        );
      }
    }

    try {
      await api.post('/conversion-events', {
        event_name: 'whatsapp_click',
        source: 'whatsapp',
        page_url: window.location.href,
        metadata: {
          lead_id: leadId
            ? Number(leadId)
            : null,
        },
      });
    } catch (conversionError) {
      console.error(
        'Failed to track WhatsApp conversion:',
        conversionError
      );
    }

    window.open(
      'https://wa.me/971521045088?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20services.',
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <div className="overflow-hidden bg-transparent text-white">
      <PageOverlay />
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        highlightWords={['touch']}
        description="We usually reply within one business day."
      />

      <section className="relative px-5 py-16 sm:px-6 md:px-4 lg:py-2">

        <div className="relative mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
          {/* Contact information */}
          <GlassCard className={`${cardClass} relative overflow-hidden p-7 sm:p-8`}>
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/20 blur-3xl" />

            <div className="relative">
              <p className="eyebrow text-brand-300">
                Contact details
              </p>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                Let's start a conversation.
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white">
                Have a project in mind or just want to explore an idea?
                Reach out through whichever channel works best for you.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accentAt(0).chip}`}>
                    <MapPin size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Location
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-white">
                      Dubai, UAE
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accentAt(1).chip}`}>
                    <Phone size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Phone
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-white">
                      +971 52 104 5088
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${accentAt(2).chip}`}>
                    <Mail size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white">
                      Email
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-white">
                      ddigixdubai@gmail.com
                    </p>
                  </div>
                </div>

                <div className="border-t border-brand/15 pt-4">
                  <p className="text-xs text-white">
                    Sun–Thu, 9am–6pm (GST)
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="tel:+971521045088"
                  className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:border-brand/50 hover:bg-brand/15"
                >
                  <Phone size={13} />
                  Call us
                </a>

                <a
                  href="mailto:ddigixdubai@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:border-brand/50 hover:bg-brand/15"
                >
                  <Mail size={13} />
                  Email us
                </a>

                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs"
                >
                  <MessageCircle size={13} />
                  WhatsApp
                </button>
              </div>

              <div className="mt-8 flex h-48 items-center justify-center rounded-2xl border border-brand/15 bg-ink-900/60">
                <div className="text-center">
                  <MapPin
                    size={24}
                    className="mx-auto text-brand/60"
                  />
                  <p className="mt-2 text-xs text-white">
                    Dubai, UAE
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Contact form */}
          <GlassCard className={`${cardClass} relative overflow-hidden p-7 sm:p-8`}>
            <div className="absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-brand/20 blur-3xl" />

            <div className="relative">
              <p className="eyebrow text-brand-300">
                Send a message
              </p>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                Tell us what you're building.
              </h2>

              <p className="mt-3 text-sm leading-6 text-white">
                Share a few details and we'll get back to you within one
                business day.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl border border-brand/20 bg-brand/10 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-ink-950">
                    <CheckIcon />
                  </div>

                  <h3 className="mt-5 text-lg font-extrabold text-white">
                    Message received.
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white">
                    Thanks — your message has been sent. We'll get back
                    to you within one business day.
                  </p>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-300 hover:underline"
                  >
                    Send another message
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-5"
                >
                  {error && (
                    <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3">
                      <p className="text-sm text-red-300">
                        {error}
                      </p>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-white"
                    >
                      Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      disabled={submitting}
                      placeholder="Your name"
                      className="field"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-white"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      disabled={submitting}
                      placeholder="you@example.com"
                      className="field"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-white"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      disabled={submitting}
                      placeholder="Tell us a little about your project..."
                      className="w-full resize-none rounded-xl border border-brand/15 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-[#b5d0d3]/80 focus:border-brand/40 focus:bg-white/[0.06] focus:ring-1 focus:ring-brand/20 disabled:opacity-60"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                    {!submitting && <ArrowUpRight size={15} />}
                  </button>
                </form>
              )}
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
