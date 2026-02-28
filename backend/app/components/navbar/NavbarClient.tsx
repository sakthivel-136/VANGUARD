'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react'; // Optional: Using a standard loader icon

// Dynamically import the Navbar component to disable SSR.
// This is useful if the Navbar relies heavily on browser APIs like window, localStorage, or document.
// We use a loading fallback to ensure a smooth UI experience.
const Navbar = dynamic(
  () => import('./page'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-16 bg-white border-b border-slate-200 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    )
  }
);

export default function NavbarClient() {
  return <Navbar />;
}