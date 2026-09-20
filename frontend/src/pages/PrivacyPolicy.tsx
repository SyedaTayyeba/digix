import PageHero from '../components/ui/PageHero';
import PageOverlay from '../components/ui/PageOverlay';

const cardClass =
  'surface-card p-6 sm:p-8';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen">
      <PageOverlay />
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        highlightWords={['Privacy']}
      />

      <section className="px-5 py-12 sm:px-8 sm:py-16 md:px-12 lg:py-20">
        <div className="mx-auto max-w-4xl space-y-5">
          <div className={cardClass}>
            <p className="text-sm leading-7 text-white sm:text-[15px]">
              DigixDubai respects your privacy. This Privacy Policy explains
              what information we may collect when you use this website, why
              we collect it, and how we use it.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Information we collect
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              We may collect information that you voluntarily provide through
              contact forms, consultation bookings, newsletter subscriptions,
              WhatsApp enquiries, or other forms of communication. This may
              include your name, email address, phone number, company details,
              and information you provide about your project or enquiry.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              How we use your information
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              We use the information you provide to respond to enquiries,
              arrange consultations, provide requested services, communicate
              about your enquiry, and improve our website and services.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Marketing communications
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              If you subscribe to our newsletter or otherwise opt in to receive
              marketing communications, we may use your contact details to send
              relevant updates. You can unsubscribe from these communications
              at any time.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Analytics and tracking
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              We may use analytics and conversion-tracking technologies to
              understand how visitors use our website and to measure the
              effectiveness of our marketing activities. Where required, these
              technologies will be used in accordance with applicable privacy
              and consent requirements.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Sharing of information
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              We do not sell your personal information. We may share information
              with service providers that help us operate the website,
              communicate with enquiries, process bookings, or provide our
              services, where necessary for those purposes.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Data security
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              We take reasonable technical and organizational measures to
              protect the information we collect against unauthorized access,
              alteration, loss, or misuse.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Your rights
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              Depending on applicable law, you may have rights to request
              access to, correction of, or deletion of your personal
              information. You may also withdraw consent where processing is
              based on consent.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Contact
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              For privacy-related questions or requests, contact us at{' '}
              <a
                href="mailto:ddigixdubai@gmail.com"
                className="text-brand-300 transition-colors hover:underline"
              >
                ddigixdubai@gmail.com
              </a>
              .
            </p>
          </div>

          <div className="rounded-2xl border border-brand/15 bg-brand/5 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-xs leading-6 text-white">
              This policy should be reviewed and finalized against
              DigixDubai&apos;s actual business practices and applicable UAE
              privacy requirements before publication.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
