import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ShiplyWidget from '@/components/ShiplyWidget';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
        {/* Shiply Widget - Simple component, SDK initialized at app level */}
        <ShiplyWidget />
      </div>
    </ProtectedRoute>
  );
}
