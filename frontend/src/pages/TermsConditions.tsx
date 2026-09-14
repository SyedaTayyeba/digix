import PageHero from '../components/ui/PageHero';

export default function TermsConditions() {
  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="Terms & Conditions"
      />

      <div className="max-w-2xl space-y-5 px-5 py-14 text-sm leading-relaxed text-white/75 sm:px-8 md:px-12">
        <p>
          These Terms & Conditions govern your use of the
          DigixDubai website and the information and
          services made available through it. By using this
          website, you agree to these terms.
        </p>

        <h2 className="text-base font-medium text-white">
          Using this website
        </h2>

        <p>
          The content on this website is provided for
          general informational purposes. You agree to use
          the website lawfully and not to misuse, disrupt,
          or attempt to gain unauthorized access to any
          part of the website or its systems.
        </p>

        <h2 className="text-base font-medium text-white">
          Consultations and enquiries
        </h2>

        <p>
          Submitting a contact form or booking a
          consultation does not by itself create a binding
          agreement between you and DigixDubai. Any
          services, fees, deliverables, timelines, and other
          commercial terms will be agreed separately where
          applicable.
        </p>

        <h2 className="text-base font-medium text-white">
          Website content
        </h2>

        <p>
          We aim to keep the information on this website
          accurate and up to date, but we do not guarantee
          that all information is complete, current, or
          free from errors. Services, availability,
          descriptions, and other website content may change
          without notice.
        </p>

        <h2 className="text-base font-medium text-white">
          Intellectual property
        </h2>

        <p>
          Unless otherwise stated or credited, the content
          on this website, including text, graphics,
          branding, design elements, and other materials,
          belongs to DigixDubai. You may not reproduce,
          distribute, modify, or commercially use this
          content without appropriate permission.
        </p>

        <h2 className="text-base font-medium text-white">
          Third-party links and services
        </h2>

        <p>
          This website may contain links to third-party
          websites, platforms, or services. DigixDubai is
          not responsible for the content, availability, or
          privacy practices of third-party websites.
        </p>

        <h2 className="text-base font-medium text-white">
          Limitation of liability
        </h2>

        <p>
          To the extent permitted by applicable law,
          DigixDubai will not be responsible for losses or
          damages arising from your use of, or inability to
          use, this website or reliance on information
          provided through it.
        </p>

        <h2 className="text-base font-medium text-white">
          Changes to these terms
        </h2>

        <p>
          We may update these Terms & Conditions from time
          to time. Any updated version will apply from the
          time it is published on this website.
        </p>

        <h2 className="text-base font-medium text-white">
          Contact
        </h2>

        <p>
          If you have questions about these Terms &
          Conditions, contact us at{' '}
          <a
            href="mailto:ddigixdubai@gmail.com"
            className="text-brand hover:underline"
          >
            ddigixdubai@gmail.com
          </a>
          .
        </p>

        <p className="pt-3 text-xs text-white/45">
          These terms should be reviewed and finalized
          against DigixDubai's actual business practices,
          contractual terms, and applicable UAE laws before
          publication.
        </p>
      </div>
    </div>
  );
}
