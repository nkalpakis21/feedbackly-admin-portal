'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ShiplyLogo from './ShiplyLogo';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Feedback', href: '/feedback', icon: '💬' },
  { name: 'Analytics', href: '/analytics', icon: '📈' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col p-4">
      <div className="flex flex-col flex-grow pt-5 bg-card rounded-lg border border-border overflow-y-auto shadow-sm">
        <div className="flex items-center flex-shrink-0 px-4 pb-4 border-b border-border">
          <ShiplyLogo size="md" className="text-blue-600" />
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive
                      ? 'bg-accent text-accent-foreground border-l-4 border-blue-500'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  } group flex items-center px-3 py-2 text-sm font-medium transition-colors`}
                  style={isActive ? { borderLeftColor: '#3b82f6' } : {}}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}