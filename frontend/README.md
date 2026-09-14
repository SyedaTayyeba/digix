# DigixDubai public site

React + TypeScript + Vite + Tailwind + React Router build of the 17-page
public site described in `DigixDubai_FRS_Site_Rough_Sketch.docx`. Started
from the earlier NovaAI landing-page project — the dark/glass visual
system and the scroll-scrubbed hero video were kept and extended into a
full routed multi-page site rather than rebuilt from scratch.

## Setup

```bash
npm install
npm run dev
```

## What's here vs. what's next

This is the **public frontend only**, per the requested starting point.
Content currently comes from `src/data/content.ts` (mock services, case
studies, blog posts, FAQs, testimonials, team, pricing) instead of a real
API, so every page renders real-looking content without a backend yet.

Mapped against the FRS:

| FRS Page ID | Route | File |
|---|---|---|
| P-01 Home | `/` | `src/pages/Home.tsx` |
| P-02 About | `/about` | `src/pages/About.tsx` |
| P-03 Services | `/services` | `src/pages/Services.tsx` |
| P-04 Service Details | `/services/:slug` | `src/pages/ServiceDetails.tsx` |
| P-05 Case Studies | `/case-studies` | `src/pages/CaseStudies.tsx` |
| P-06 Case Study Details | `/case-studies/:slug` | `src/pages/CaseStudyDetails.tsx` |
| P-07 Pricing | `/pricing` | `src/pages/Pricing.tsx` |
| P-08 Testimonials | `/testimonials` | `src/pages/Testimonials.tsx` |
| P-09 Team | `/team` | `src/pages/Team.tsx` |
| P-10 Blog | `/blog` | `src/pages/Blog.tsx` |
| P-11 Blog Details | `/blog/:slug` | `src/pages/BlogDetails.tsx` |
| P-12 FAQs | `/faqs` | `src/pages/FAQs.tsx` |
| P-13 Contact | `/contact` | `src/pages/Contact.tsx` |
| P-14 Book a Consultation | `/book-consultation` | `src/pages/BookConsultation.tsx` |
| P-15 Search Results | `/search` | `src/pages/SearchResults.tsx` |
| P-16 Privacy Policy | `/privacy-policy` | `src/pages/PrivacyPolicy.tsx` |
| P-17 Terms & Conditions | `/terms-conditions` | `src/pages/TermsConditions.tsx` |

Shared shell: `src/components/Navbar.tsx` and `Footer.tsx` follow the
FRS's "Navigation" and "Footer" tables exactly (nav order, primary CTA,
footer sections). `src/components/Layout.tsx` wraps every route with
both plus the persistent WhatsApp button (FR-13).

## Assumptions made (flag these before building further)

- **Brand name**: the FRS document is titled "DigixDubai" but never
  states a brand name inside the requirements themselves, so the nav,
  footer, and copy use "DigixDubai" as a placeholder. Swap it in
  `Navbar.tsx`, `Footer.tsx`, and `index.html` if that's wrong.
- **Design system**: brand color is `#2fbcba` (see `tailwind.config.js`,
  token `brand`), used on every button, link, active nav state, badge
  accent, and focus ring. Background is the original NovaAI scroll-
  scrubbed video (`components/ScrollVideo.tsx`) — now mounted once in
  `Layout.tsx` so it plays behind every page, not just Home.
- **Content**: all service names, case studies, pricing, team bios, blog
  posts, and FAQ copy are placeholders — the FRS specifies structure, not
  wording.

## Explicitly out of scope for this pass (per your "public pages first" choice)

- The Laravel backend, admin panel (A-01–A-18), and CRM/lead pipeline
  (FR-10–FR-12) — the contact form, booking flow, and search all work
  client-side against the mock data now; each has a `// TODO` marking
  where an Axios call to a real endpoint would go.
- Bilingual EN/AR (FR-29) — the nav has an EN/AR toggle placeholder, but
  no translation content or RTL layout yet.
- reCAPTCHA/Turnstile spam protection (FR-31), SEO metadata management
  (FR-24) beyond the one JSON-LD example on case studies, and analytics/
  conversion tracking (FR-26).
