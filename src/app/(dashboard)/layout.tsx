import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import FeedbacklyWidget from '@/components/FeedbacklyWidget';
import FeedbacklyDevToggle from '@/components/FeedbacklyDevToggle';
import { FeedbacklyProvider } from '@/contexts/FeedbacklyContext';
import { FEEDBACKLY_CONFIG } from '@/lib/feedbackly-config';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <FeedbacklyProvider>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
          {/* Development Toggle - Only shows in development */}
          <FeedbacklyDevToggle />
          {/* Feedbackly Widget - Only shows when user is logged in */}
          <FeedbacklyWidget
            apiKey={FEEDBACKLY_CONFIG.apiKey}
            websiteId={FEEDBACKLY_CONFIG.websiteId}
            theme={FEEDBACKLY_CONFIG.theme}
            position={FEEDBACKLY_CONFIG.position}
            size={FEEDBACKLY_CONFIG.size}
            text={FEEDBACKLY_CONFIG.text}
            categories={FEEDBACKLY_CONFIG.categories}
            autoShow={FEEDBACKLY_CONFIG.autoShow}
            autoShowDelay={FEEDBACKLY_CONFIG.autoShowDelay}
          />
        </div>
      </FeedbacklyProvider>
    </ProtectedRoute>
  );
}
