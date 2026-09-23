import React from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6 bg-slate-950 text-white text-center">
      <div className="max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-4">
          <Hotel className="w-8 h-8" />
        </div>
        <h1 className="font-serif-luxury text-5xl font-bold text-amber-400 mb-2">404</h1>
        <h2 className="text-xl font-semibold mb-2">Suite Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">
          The requested page or reservation route does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:brightness-105 transition-all shadow-lg shadow-amber-500/20"
        >
          <Home className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
