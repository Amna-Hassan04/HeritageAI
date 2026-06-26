import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UploadPage from './pages/UploadPage';
import SitesPage from './pages/SitesPage';
import SitePage from './pages/SitePage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PricingPage from './pages/Pricing';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import SubmitArticlePage from './pages/SubmitArticlePage';
import WriteArticle from './pages/WriteArticle';
import StayUpdated from './pages/StayUpdated';
import ARButton from './components/ARButton';
import ARPage from './pages/ARPage';

import TourPlannerPage from './pages/TourPlannerPage';

// Lazy loading our high-performance WebAR Canvas
const ArRestorationPage = lazy(() => import('./pages/ArRestorationPage'));

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash || 'home';
  });
  const { loading } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.slice(1);
      setCurrentPage(hash || 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (window.location.hash.slice(1) !== currentPage) {
      window.history.pushState(null, '', `#${currentPage}`);
    }
  }, [currentPage]);

  // Scroll to top whenever currentPage changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
      </div>
    );
  }

  const renderPage = () => {
    if (currentPage === 'home') return <HomePage setCurrentPage={setCurrentPage} />;
    if (currentPage === 'login') return <LoginPage setCurrentPage={setCurrentPage} />;
    if (currentPage === 'signup') return <SignupPage setCurrentPage={setCurrentPage} />;
    if (currentPage === 'upload') return <UploadPage setCurrentPage={setCurrentPage} />;
    if (currentPage === 'sites') return <SitesPage setCurrentPage={setCurrentPage} />;
    if (currentPage === 'planner') return <TourPlannerPage setCurrentPage={setCurrentPage} />;
    if (currentPage === 'profile') return <ProfilePage setCurrentPage={setCurrentPage} />;
    if (currentPage === 'about') return <AboutPage setCurrentPage={setCurrentPage} />;
    if(currentPage==='blog') return <BlogPage setCurrentPage={setCurrentPage}/>
    if(currentPage==='contact') return <ContactPage setCurrentPage={setCurrentPage} />
    if(currentPage==='terms') return < TermsOfServicePage  setCurrentPage={setCurrentPage} />
    if(currentPage==='privacy') return < PrivacyPolicyPage  setCurrentPage={setCurrentPage} />
      if(currentPage==='pricing') return < PricingPage  setCurrentPage={setCurrentPage} />
      if(currentPage==='submit-article') return < SubmitArticlePage  setCurrentPage={setCurrentPage} />
      if(currentPage==='write-article') return < WriteArticle  setCurrentPage={setCurrentPage} />
        if(currentPage==='stay-updated') return < StayUpdated  setCurrentPage={setCurrentPage} />
        if (currentPage === 'ar') return <ARPage />;
        if(currentPage==='learn-ar') return <ArRestorationPage setCurrentPage={setCurrentPage} />;



    // 🚀 Register our brand new custom 'learn-ar' path state handler
   

    if (currentPage.startsWith('site-')) {
      const siteId = currentPage.replace('site-', '');
      return <SitePage siteId={siteId} setCurrentPage={setCurrentPage} />;
    }
    return <HomePage setCurrentPage={setCurrentPage} />;
  };

return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {renderPage()}
      {currentPage !== 'ar' && <Footer setCurrentPage={setCurrentPage} />}
      {/* {currentPage !== 'ar' && <ARButton onOpen={() => setCurrentPage('ar')} />} */}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;