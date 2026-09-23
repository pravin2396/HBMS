import React from 'react';
import { useLocation } from 'react-router-dom';
import { Hotel, Shield, Award } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  if (isAuthPage) return null;

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-6 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Brand Copyright */}
        <div className="flex items-center gap-2">
          <Hotel className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-slate-300">Paradise Hotel Management</span>
          <span>•</span>
          <span>© {new Date().getFullYear()} All Rights Reserved.</span>
        </div>

        {/* Badges / Guarantees */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Shield className="w-3.5 h-3.5 text-amber-500" /> 256-Bit SSL Encrypted
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Award className="w-3.5 h-3.5 text-amber-500" /> 5-Star Luxury Certified
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
