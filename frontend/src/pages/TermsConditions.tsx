import PageHero from '../components/ui/PageHero';
import PageOverlay from '../components/ui/PageOverlay';

const cardClass =
  'surface-card p-6 sm:p-8';

export default function TermsConditions() {
  return (
    <div className="min-h-screen">
      <PageOverlay/>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
        highlightWords={['Terms']}
      />

      <section className="px-5 py-12 sm:px-6 sm:py-6 md:px-4 lg:py-2">
        <div className="mx-auto max-w-4xl space-y-5">

          <div className={cardClass}>
            <p className="text-sm leading-7 text-white sm:text-[15px]">
              These Terms & Conditions govern your use of the DigixDubai
              website and the information and services made available through
              it. By using this website, you agree to these terms.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Using this website
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              The content on this website is provided for general informational
              purposes. You agree to use the website lawfully and not to
              misuse, disrupt, or attempt to gain unauthorized access to any
              part of the website or its systems.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Consultations and enquiries
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              Submitting a contact form or booking a consultation does not by
              itself create a binding agreement between you and DigixDubai.
              Any services, fees, deliverables, timelines, and other commercial
              terms will be agreed separately where applicable.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Website content
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              We aim to keep the information on this website accurate and up
              to date, but we do not guarantee that all information is
              complete, current, or free from errors. Services, availability,
              descriptions, and other website content may change without notice.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Intellectual property
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              Unless otherwise stated or credited, the content on this website,
              including text, graphics, branding, design elements, and other
              materials, belongs to DigixDubai. You may not reproduce,
              distribute, modify, or commercially use this content without
              appropriate permission.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Third-party links and services
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              This website may contain links to third-party websites,
              platforms, or services. DigixDubai is not responsible for the
              content, availability, or privacy practices of third-party
              websites.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Limitation of liability
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              To the extent permitted by applicable law, DigixDubai will not
              be responsible for losses or damages arising from your use of, or
              inability to use, this website or reliance on information
              provided through it.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Changes to these terms
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              We may update these Terms & Conditions from time to time. Any
              updated version will apply from the time it is published on this
              website.
            </p>
          </div>

          <div className={cardClass}>
            <h2 className="mb-3 text-lg font-semibold text-white">
              Contact
            </h2>

            <p className="text-sm leading-7 text-white sm:text-[15px]">
              If you have questions about these Terms & Conditions, contact us
              at{' '}
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
              These terms should be reviewed and finalized against
              DigixDubai&apos;s actual business practices, contractual terms,
              and applicable UAE laws before publication.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
