import { Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Pricing from './pages/Pricing';
import Testimonials from './pages/Testimonials';
import Team from './pages/Team';
import FAQs from './pages/FAQs';
import Contact from './pages/Contact';
import BookConsultation from './pages/BookConsultation';
import SearchResults from './pages/SearchResults';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <Layout>
            <ScrollToTop />
          </Layout>
        }
      >
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Company */}
        <Route path="/about" element={<About />} />
        <Route path="/team" element={<Team />} />

        {/* Services */}
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetails />} />

        {/* Pricing & Social Proof */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/testimonials" element={<Testimonials />} />

        {/* FAQs & Contact */}
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-consultation" element={<BookConsultation />} />

        {/* Search */}
        <Route path="/search" element={<SearchResults />} />

        {/* Legal */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
      </Route>
    </Routes>
  );
}
