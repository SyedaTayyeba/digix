import type { LucideIcon } from 'lucide-react';

import {
  LayoutDashboard,
  Home,
  Briefcase,
  Quote,
  Tag,
  HelpCircle,
  Users,
  UserSquare2,
  CalendarClock,
  CalendarCheck,
  Mail,
  Settings,
  Search,
  Bell,
  BarChart3,
  ScrollText,
} from 'lucide-react';

export interface AdminNavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  /** Optional permission key — hidden if the user lacks it. */
  permission?: string;
}

export interface AdminNavSection {
  title: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavSection[] = [
  {
    title: '',
    items: [
      {
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: 'Content',
    items: [
      {
        label: 'Homepage',
        path: '/admin/homepage',
        icon: Home,
        permission: 'homepage.manage',
      },
      {
        label: 'Services',
        path: '/admin/services',
        icon: Briefcase,
        permission: 'services.manage',
      },
      {
        label: 'Testimonials',
        path: '/admin/testimonials',
        icon: Quote,
        permission: 'testimonials.manage',
      },
      {
        label: 'Pricing',
        path: '/admin/pricing',
        icon: Tag,
        permission: 'pricing.manage',
      },
      {
        label: 'FAQs',
        path: '/admin/faqs',
        icon: HelpCircle,
        permission: 'faqs.manage',
      },
      {
        label: 'Team',
        path: '/admin/team',
        icon: UserSquare2,
        permission: 'team.manage',
      },
    ],
  },

  {
    title: 'CRM',
    items: [
      {
        label: 'Leads',
        path: '/admin/leads',
        icon: Users,
        permission: 'leads.manage',
      },
      {
        label: 'Appointments',
        path: '/admin/appointments',
        icon: CalendarCheck,
        permission: 'appointments.manage',
      },
      {
        label: 'Availability',
        path: '/admin/availability',
        icon: CalendarClock,
        permission: 'appointments.manage',
      },
      {
        label: 'Newsletter',
        path: '/admin/newsletter',
        icon: Mail,
        permission: 'newsletter.manage',
      },
    ],
  },

  {
    title: 'System',
    items: [
      {
        label: 'Settings',
        path: '/admin/settings',
        icon: Settings,
        permission: 'settings.manage',
      },
      {
        label: 'SEO',
        path: '/admin/seo',
        icon: Search,
        permission: 'seo.manage',
      },
      {
        label: 'Notifications',
        path: '/admin/notifications',
        icon: Bell,
        permission: 'notifications.view',
      },
      {
        label: 'Analytics',
        path: '/admin/analytics',
        icon: BarChart3,
        permission: 'analytics.view',
      },
      {
        label: 'Activity Logs',
        path: '/admin/activity-logs',
        icon: ScrollText,
        permission: 'audit-logs.view',
      },
    ],
  },
];