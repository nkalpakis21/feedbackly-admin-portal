import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import ShiplyWidget from '@/components/ShiplyWidget';
import { ShiplyProvider } from '@/contexts/ShiplyContext';
import { SHIPLY_CONFIG } from '@/lib/shiply-config';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ShiplyProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
          {/* Shiply Widget - Only shows when user is logged in */}
          <ShiplyWidget
            theme={SHIPLY_CONFIG.theme}
            position={SHIPLY_CONFIG.position}
            size={SHIPLY_CONFIG.size}
            autoShow={SHIPLY_CONFIG.autoShow}
            autoShowDelay={SHIPLY_CONFIG.autoShowDelay}
          />
        </div>
      </ShiplyProvider>
    </ProtectedRoute>
  );
}
