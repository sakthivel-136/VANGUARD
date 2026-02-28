'use client';

import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react'; // Optional standard icon

interface NavbarWrapperProps {
  children: React.ReactNode;
}

export default function NavbarWrapper({ children }: NavbarWrapperProps) {
  const pathname = usePathname();

  // Safety check: Prevent rendering until pathname is available
  if (typeof window !== 'undefined' && pathname === undefined) {
    return (
      <div className="w-full h-20 flex items-center justify-center bg-white border-b border-slate-200">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Hide navbar on home page and login page
  if (pathname === '/' || pathname === '/login') return null;

  return <>{children}</>;
}