import PageHero from '../components/ui/PageHero';

export default function PrivacyPolicy() {
  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
      />

      <div className="max-w-2xl space-y-5 px-5 py-14 text-sm leading-relaxed text-white/75 sm:px-8 md:px-12">
        <p>
          DigixDubai respects your privacy. This Privacy
          Policy explains what information we may collect
          when you use this website, why we collect it, and
          how we use it.
        </p>

        <h2 className="text-base font-medium text-white">
          Information we collect
        </h2>

        <p>
          We may collect information that you voluntarily
          provide through contact forms, consultation
          bookings, newsletter subscriptions, WhatsApp
          enquiries, or other forms of communication.
          This may include your name, email address, phone
          number, company details, and information you
          provide about your project or enquiry.
        </p>

        <h2 className="text-base font-medium text-white">
          How we use your information
        </h2>

        <p>
          We use the information you provide to respond to
          enquiries, arrange consultations, provide
          requested services, communicate about your
          enquiry, and improve our website and services.
        </p>

        <h2 className="text-base font-medium text-white">
          Marketing communications
        </h2>

        <p>
          If you subscribe to our newsletter or otherwise
          opt in to receive marketing communications, we
          may use your contact details to send relevant
          updates. You can unsubscribe from these
          communications at any time.
        </p>

        <h2 className="text-base font-medium text-white">
          Analytics and tracking
        </h2>

        <p>
          We may use analytics and conversion-tracking
          technologies to understand how visitors use our
          website and to measure the effectiveness of our
          marketing activities. Where required, these
          technologies will be used in accordance with
          applicable privacy and consent requirements.
        </p>

        <h2 className="text-base font-medium text-white">
          Sharing of information
        </h2>

        <p>
          We do not sell your personal information. We may
          share information with service providers that
          help us operate the website, communicate with
          enquiries, process bookings, or provide our
          services, where necessary for those purposes.
        </p>

        <h2 className="text-base font-medium text-white">
          Data security
        </h2>

        <p>
          We take reasonable technical and organizational
          measures to protect the information we collect
          against unauthorized access, alteration, loss, or
          misuse.
        </p>

        <h2 className="text-base font-medium text-white">
          Your rights
        </h2>

        <p>
          Depending on applicable law, you may have rights
          to request access to, correction of, or deletion
          of your personal information. You may also
          withdraw consent where processing is based on
          consent.
        </p>

        <h2 className="text-base font-medium text-white">
          Contact
        </h2>

        <p>
          For privacy-related questions or requests,
          contact us at{' '}
          <a
            href="mailto:ddigixdubai@gmail.com"
            className="text-brand hover:underline"
          >
            ddigixdubai@gmail.com
          </a>
          .
        </p>

        <p className="pt-3 text-xs text-white/45">
          This policy should be reviewed and finalized
          against DigixDubai's actual business practices
          and applicable UAE privacy requirements before
          publication.
        </p>
      </div>
    </div>
  );
}
