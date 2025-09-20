'use client';

import ShiplyLogo from './ShiplyLogo';
import ProfileMenu from './ProfileMenu';

export default function Header() {

  return (
    <header className="bg-background border-b border-border shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <ShiplyLogo size="lg" className="text-blue-600" />
          </div>
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
