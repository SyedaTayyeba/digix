// Shared types for the admin panel.

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
}

export type Status =
  | 'draft'
  | 'published'
  | 'archived';

export interface BaseResource {
  id: number;
  created_at?: string;
  updated_at?: string;
}

/* =========================
   SERVICES
========================= */

export interface ServiceResource extends BaseResource {
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  features?: string[];
  process_steps?: string[];
  custom_attributes?: Record<string, string>;
  seo_title?: string;
  seo_description?: string;
  status: Status;
  sort_order: number;
}

/* =========================
   TESTIMONIALS
========================= */

export interface TestimonialResource
  extends BaseResource {
  client_name: string;
  company?: string;
  position?: string;
  content: string;
  rating: number;
  avatar_url?: string;
  status: Status;
}

/* =========================
   PRICING
========================= */

export interface PricingPackageResource
  extends BaseResource {
  name: string;
  price: string;
  currency: string;
  billing_period:
    | 'month'
    | 'project'
    | 'year';
  description?: string;
  features?: string[];
  cta_text?: string;
  is_popular: boolean;
  sort_order: number;
  status: Status;
}

/* =========================
   LEADS / CRM
========================= */

export type LeadStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'meeting_booked'
  | 'proposal_sent'
  | 'won'
  | 'lost';

export interface LeadActivity {
  id: number;
  lead_id?: number;
  type: string;
  description: string;
  user_id?: number | null;
  created_at: string;
  updated_at?: string;
  user_name?: string;
}

export interface LeadStageHistoryEntry {
  id?: number;
  from_stage?: string | null;
  to_stage: LeadStage | string;
  changed_by?: number | null;
  created_at?: string;
  changed_at?: string;
}

export interface LeadResource
  extends BaseResource {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  stage: LeadStage | string;
  message?: string;
  form_data?: Record<string, unknown>;
  estimated_value?: number | string;
  whatsapp_clicked_at?: string | null;
  activities?: LeadActivity[];
  stage_histories?: LeadStageHistoryEntry[];
  stageHistory?: LeadStageHistoryEntry[];
}

/* =========================
   APPOINTMENTS
========================= */

export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'rescheduled'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface AppointmentResource
  extends BaseResource {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  appointment_date: string;
  appointment_time: string;
  time_preference?: string;
  meeting_type: string;
  message?: string;
  admin_notes?: string;
  meeting_link?: string;
  status: AppointmentStatus | string;
}

/* =========================
   AVAILABILITY
========================= */

export interface AvailabilitySlot
  extends BaseResource {
  day_of_week: number;
  start_time: string;
  end_time: string;
  slot_duration: number;
  buffer_time: number;
  is_available: boolean;
}

/* =========================
   FAQ
========================= */

export interface FaqCategoryResource
  extends BaseResource {
  name: string;
  slug?: string;
}

export interface FaqResource
  extends BaseResource {
  question: string;
  answer: string;
  category_id?: number | null;
  category_name?: string;
  sort_order: number;
  status: Status;
}

/* =========================
   NEWSLETTER
========================= */

export type NewsletterStatus =
  | 'subscribed'
  | 'unsubscribed';

export interface NewsletterSubscriberResource
  extends BaseResource {
  email: string;
  status: NewsletterStatus;
  subscribed_at?: string | null;
  unsubscribed_at?: string | null;
}

/* =========================
   TEAM
========================= */

export interface TeamMemberResource
  extends BaseResource {
  name: string;
  position: string;
  bio?: string;
  image_url?: string;
  social_links?: {
    platform: string;
    url: string;
  }[];
  sort_order: number;
  status: Status;
}

/* =========================
   HOMEPAGE
========================= */

export interface HomepageSettings {
  hero: {
    eyebrow?: string;
    heading?: string;
    subheading?: string;
    cta_text?: string;
  };

  about: {
    heading?: string;
    body?: string;
  };

  services_section: {
    heading?: string;
    subheading?: string;
  };

  testimonials_section: {
    heading?: string;
  };

  cta_section: {
    heading?: string;
    body?: string;
    button_text?: string;
  };

  statistics: {
    label: string;
    value: string;
  }[];
}

/* =========================
   GLOBAL SETTINGS
========================= */

export interface GlobalSettings {
  company_name?: string;
  tagline?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  social_links?: {
    platform: string;
    url: string;
  }[];
  website_url?: string;
}

/* =========================
   SEO
========================= */

export type SeoEntityType =
  | 'service'
  | 'page';

export interface SeoEntryResource
  extends BaseResource {
  entity_type: SeoEntityType;
  entity_id?: number | null;
  path?: string;
  meta_title?: string;
  meta_description?: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  canonical_url?: string;
  schema_json?: string;
  robots?: string;
}

/* =========================
   NOTIFICATIONS
========================= */

export interface NotificationResource
  extends BaseResource {
  title: string;
  body: string;
  read_at: string | null;
  type: string;
}

/* =========================
   ANALYTICS
========================= */

export interface AnalyticsSummary {
  total_events: number;

  by_name: {
    name: string;
    count: number;
  }[];

  by_source: {
    source: string;
    count: number;
  }[];

  over_time: {
    date: string;
    count: number;
  }[];
}

/* =========================
   ACTIVITY LOGS
========================= */

export interface ActivityLogResource
  extends BaseResource {
  module: string;
  action: string;
  user_name?: string;
  ip_address?: string;
  user_agent?: string;
  old_values?: Record<string, unknown> | null;
  new_values?: Record<string, unknown> | null;
}

/* =========================
   DASHBOARD
========================= */

export interface DashboardStats {
  total_leads: number;
  new_leads: number;
  qualified_leads: number;
  won_leads: number;
  lost_leads: number;

  total_appointments: number;
  pending_appointments: number;

  published_services: number;

  testimonials_count: number;
  team_members_count: number;

  leads_by_stage: {
    stage: string;
    count: number;
  }[];

  leads_by_source: {
    source: string;
    count: number;
  }[];

  leads_over_time: {
    date: string;
    count: number;
  }[];

  conversions: {
    name: string;
    count: number;
  }[];

  recent_activity: ActivityLogResource[];

  recent_leads: LeadResource[];

  recent_appointments: AppointmentResource[];
}
