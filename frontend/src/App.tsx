import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

// Public
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Pricing from "./pages/Pricing";
import Testimonials from "./pages/Testimonials";
import Team from "./pages/Team";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import BookConsultation from "./pages/BookConsultation";
import SearchResults from "./pages/SearchResults";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

// Admin
import AdminProviders from "./admin/AdminProviders";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute";
import AdminLayout from "./admin/layouts/AdminLayout";
import AdminLogin from "./admin/pages/Login";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminHomepage from "./admin/pages/Homepage";
import AdminServices from "./admin/pages/Services";
import AdminTestimonials from "./admin/pages/Testimonials";
import AdminPricing from "./admin/pages/Pricing";
import AdminLeads from "./admin/pages/Leads";
import AdminAppointments from "./admin/pages/Appointments";
import AdminAvailability from "./admin/pages/Availability";
import AdminFaqs from "./admin/pages/Faqs";
import AdminFaqCategories from "./admin/pages/FaqCategories";
import AdminNewsletter from "./admin/pages/Newsletter";
import AdminTeam from "./admin/pages/Team";
import AdminSettings from "./admin/pages/Settings";
import AdminSeo from "./admin/pages/Seo";
import AdminNotifications from "./admin/pages/Notifications";
import AdminAnalytics from "./admin/pages/Analytics";
import AdminActivityLogs from "./admin/pages/ActivityLogs";
export default function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Public */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-consultation" element={<BookConsultation />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminProviders />}>
          <Route path="login" element={<AdminLogin />} />

          <Route element={<ProtectedAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="homepage" element={<AdminHomepage />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="faqs" element={<AdminFaqs />} />
              <Route path="faqs/categories" element={<AdminFaqCategories />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="availability" element={<AdminAvailability />} />
              <Route path="newsletter" element={<AdminNewsletter />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="seo" element={<AdminSeo />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="activity-logs" element={<AdminActivityLogs />} />
              
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}