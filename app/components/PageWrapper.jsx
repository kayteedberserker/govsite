// components/PageWrapper.jsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PageWrapper({ children }) {
  const pathname = usePathname();
  
  // Check if the user is on the login or admin routes
  const isBackendRoute = pathname.startsWith('/admin') || pathname.startsWith('/login');

  return (
    <>
      {/* Only show Navbar if it's NOT a backend route */}
      {!isBackendRoute && <Navbar />}
      
      {/* Main content area expands to push footer to the bottom */}
      <main className={`flex-grow ${!isBackendRoute ? 'pt-20' : ''}`}>
        {children}
      </main>
      
      {/* Only show Footer if it's NOT a backend route */}
      {!isBackendRoute && <Footer />}
    </>
  );
}