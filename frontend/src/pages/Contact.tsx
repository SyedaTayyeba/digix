import type { FormEvent } from 'react';
import { useState } from 'react';

import PageHero from '../components/ui/PageHero';
import GlassCard from '../components/ui/GlassCard';
import { api } from '../lib/api';

type LeadResponse = {
  message?: string;
  data?: {
    id?: number;
  };
};

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

      const leadId = response.data?.id;

      if (leadId) {
        localStorage.setItem(
          'digix_lead_id',
          String(leadId)
        );
      }

      // Conversion tracking should never block lead submission.
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

    // Track WhatsApp engagement for an existing lead.
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

    // Track conversion event independently.
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
    <div>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="We usually reply within one business day."
      />

      <section className="grid gap-8 px-5 py-14 sm:px-8 md:grid-cols-2 md:px-12">
        <GlassCard>
          <h2 className="text-lg font-medium">
            Contact details
          </h2>

          <ul className="mt-4 space-y-3 text-sm text-white/80">
            <li>Dubai, UAE</li>
            <li>+971 52 104 5088</li>
            <li>ddigixdubai@gmail.com</li>
            <li>Sun–Thu, 9am–6pm (GST)</li>
          </ul>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="tel:+971521045088"
              className="rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs backdrop-blur-md hover:bg-brand/20"
            >
              Call us
            </a>

            <a
              href="mailto:ddigixdubai@gmail.com"
              className="rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs backdrop-blur-md hover:bg-brand/20"
            >
              Email us
            </a>

            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="rounded-full bg-brand px-4 py-2 text-xs font-medium text-black hover:bg-brand/85"
            >
              WhatsApp
            </button>
          </div>

          <div
            className="mt-6 h-48 w-full rounded-xl border border-white/15 bg-white/[0.04]"
            aria-label="Map placeholder"
          />
        </GlassCard>

        <GlassCard>
          <h2 className="text-lg font-medium">
            Send a message
          </h2>

          {submitted ? (
            <div className="mt-4">
              <p className="text-sm text-white/85">
                Thanks — your message has been sent.
                We'll get back to you within one
                business day.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm text-brand hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-4 space-y-4"
            >
              {error && (
                <p className="text-sm text-red-300">
                  {error}
                </p>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block text-xs text-white/60"
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
                  className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-xs text-white/60"
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
                  className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block text-xs text-white/60"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  disabled={submitting}
                  className="w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand/50 disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-black hover:bg-brand/85 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? 'Sending...'
                  : 'Send Message'}
              </button>
            </form>
          )}
        </GlassCard>
      </section>
    </div>
  );
}
