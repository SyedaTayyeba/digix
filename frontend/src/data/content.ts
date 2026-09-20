// DigixDubai public content types
//
// Dynamic content is provided by the Laravel REST API.
// This file only contains TypeScript interfaces and minimal
// fallback content required by the frontend.

export interface Service {
  id?: number;
  slug: string;
  title: string;
  summary: string;
  features: string[];
  process: string[];
  custom_attributes?: Record<string, unknown>;
  published_at?: string | null;
}

export interface Testimonial {
  id?: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
}

export interface PricingPackage {
  id?: number;
  name: string;
  interval: 'month' | 'project';
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  published_at?: string | null;
}

export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  bio: string;
  image?: string | null;
  social_links?: Record<string, string>;
  published_at?: string | null;
}

export interface Faq {
  id?: number;
  question: string;
  answer: string;
  category: string;
  sort_order?: number;
  published_at?: string | null;
}

export interface SearchResult {
  type: 'Service' | 'FAQ';
  title: string;
  description: string;
  href: string;
}

/*
|--------------------------------------------------------------------------
| Homepage
|--------------------------------------------------------------------------
|
| Homepage content is managed through the Laravel settings module.
| The frontend should request:
|
| GET /api/homepage
|
*/

export interface HomepageContent {
  hero?: Record<string, unknown>;
  about?: Record<string, unknown>;
  services?: Record<string, unknown>;
  case_studies?: Record<string, unknown>;
  testimonials?: Record<string, unknown>;
  cta?: Record<string, unknown>;
  stats?: Record<string, unknown>;
}

/*
|--------------------------------------------------------------------------
| Services
|--------------------------------------------------------------------------
|
| GET /api/services
| GET /api/services/{slug}
|
| Services are now expected to come from Laravel.
*/

export const services: Service[] = [];


/*
|--------------------------------------------------------------------------
| Testimonials
|--------------------------------------------------------------------------
|
| GET /api/admin/testimonials
|
| No fictional testimonials are used as fallback content.
*/

export const testimonials: Testimonial[] = [];


/*
|--------------------------------------------------------------------------
| Pricing
|--------------------------------------------------------------------------
|
| Pricing is scope-dependent.
| Exact pricing should come from Laravel.
*/

export const pricingPackages: PricingPackage[] = [];


/*
|--------------------------------------------------------------------------
| Team
|--------------------------------------------------------------------------
|
| GET /api/admin/team
|
| No fictional team profiles are used.
*/

export const team: TeamMember[] = [];


/*
|--------------------------------------------------------------------------
| FAQs
|--------------------------------------------------------------------------
|
| FAQ content should come from the Laravel FAQ module.
|
| The array remains available as a temporary fallback so the page
| does not break if the API is temporarily unavailable.
|
*/

export const faqs: Faq[] = [
  {
    category: 'Getting Started',
    question: 'What happens on the first call?',
    answer:
      'The first conversation is focused on your current marketing, goals and where money may be leaking. The aim is to understand the account and business before recommending what should change.',
  },
  {
    category: 'Getting Started',
    question: 'What size of business do you work with?',
    answer:
      'DigixDubai works with businesses across Dubai, the UAE and GCC. For paid media, the current positioning is focused on businesses spending AED 5,000 per month or more in media.',
  },
  {
    category: 'Services',
    question: 'Which services do you provide?',
    answer:
      'The core services are Google Ads, Social Advertising, Web Development, Shopify Development and Lead Generation.',
  },
  {
    category: 'Services',
    question: 'Do you only manage advertising?',
    answer:
      'No. DigixDubai also builds websites, Shopify stores and lead-generation systems. The services can be used individually or combined where the customer journey requires it.',
  },
  {
    category: 'Paid Advertising',
    question: 'How do you measure advertising performance?',
    answer:
      'The focus is on business outcomes rather than reporting impressions alone. Depending on the campaign, this can include spend, enquiries, qualified leads, booked clients and revenue attributed to advertising.',
  },
  {
    category: 'Paid Advertising',
    question: 'Do you work with Google Ads and Meta Ads?',
    answer:
      'Yes. Google Ads is used to capture existing search demand, while Meta and Instagram advertising can be used to create demand, test creative and scale campaigns against a defined business objective.',
  },
  {
    category: 'Working Together',
    question: 'Do you work on monthly retainers or fixed projects?',
    answer:
      'Both. Paid advertising and lead generation can be structured as monthly retainers, while website and Shopify work can be handled as fixed-scope projects. In some cases, a project can lead into an ongoing marketing engagement.',
  },
  {
    category: 'Working Together',
    question: 'Do you work with businesses outside Dubai?',
    answer:
      'Yes. DigixDubai works with businesses across the UAE and GCC, with reporting and calls structured around the client relationship.',
  },
  {
    category: 'Company',
    question: 'Is DigixDubai based in Dubai?',
    answer:
      'Yes. DigixDubai is based in Dubai and works with businesses across the UAE and GCC.',
  },
  {
    category: 'Company',
    question: 'Who manages the account?',
    answer:
      'The current positioning is built around senior hands-on account management, with experience in the UAE market. Specific account ownership should be confirmed during the consultation.',
  },
  {
    category: 'Pricing',
    question: 'How much does digital marketing cost?',
    answer:
      'Cost depends on the scope, service mix and media budget. DigixDubai recommends defining the scope and price clearly before starting rather than using a one-size-fits-all package.',
  },
  {
    category: 'Pricing',
    question: 'Is there a minimum commitment?',
    answer:
      'For paid media, an initial three-month term is recommended because campaigns need enough time for tracking, testing and optimization. The exact engagement term should be confirmed before signing.',
  },
];


/*
|--------------------------------------------------------------------------
| Deprecated local lookup helpers
|--------------------------------------------------------------------------
|
| These are kept temporarily so existing imports do not immediately break.
| Once the pages are converted to API calls, they can be removed.
*/

export const getServiceBySlug = (slug: string) =>
  services.find((service) => service.slug === slug);


/*
|--------------------------------------------------------------------------
| Temporary client-side search
|--------------------------------------------------------------------------
|
| Case Studies and Blog are intentionally excluded.
|
| This will be replaced by the Laravel search endpoint once the
| Search API is finalized.
*/

export function searchSite(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();

  if (!q) {
    return [];
  }

  const results: SearchResult[] = [];

  services
    .filter((service) => {
      const searchableText = [
        service.title,
        service.summary,
        ...service.features,
        ...service.process,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(q);
    })
    .forEach((service) => {
      results.push({
        type: 'Service',
        title: service.title,
        description: service.summary,
        href: `/services/${service.slug}`,
      });
    });

  faqs
    .filter((faq) => {
      const searchableText = [
        faq.question,
        faq.answer,
        faq.category,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(q);
    })
    .forEach((faq) => {
      results.push({
        type: 'FAQ',
        title: faq.question,
        description: faq.answer,
        href: '/faqs',
      });
    });

  return results;
}
