import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { NotificationModal } from './components/NotificationModal';
import { Toast } from './components/Toast';

// Views
import { HomeView } from './views/HomeView';
import { CheckInView } from './views/CheckInView';
import { QuizView } from './views/QuizView';
import { TicketsView } from './views/TicketsView';
import { WeeklyRewardsView } from './views/WeeklyRewardsView';
import { RulesView } from './views/RulesView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';
import { AboutView } from './views/AboutView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { TermsView } from './views/TermsView';
import { ContactView } from './views/ContactView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'checkin':
        return <CheckInView />;
      case 'quiz':
        return <QuizView />;
      case 'tickets':
        return <TicketsView />;
      case 'rewards':
        return <WeeklyRewardsView />;
      case 'rules':
        return <RulesView />;
      case 'profile':
        return <ProfileView />;
      case 'admin':
        return <AdminView />;
      case 'about':
        return <AboutView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      case 'terms':
        return <TermsView />;
      case 'contact':
        return <ContactView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#05050C] text-slate-100 selection:bg-purple-500 selection:text-white relative overflow-x-hidden">
      {/* Immersive ambient background glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[30rem] h-[30rem] bg-cyan-900/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-80 h-80 bg-indigo-950/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Prominent Community Notice Banner */}
      <DisclaimerBanner />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Toasts */}
      <AuthModal />
      <NotificationModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
