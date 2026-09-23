import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { AuthProvider } from './context/AuthContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { SidebarProvider } from './context/SidebarContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AnalyticsProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </AnalyticsProvider>
    </AuthProvider>
  </StrictMode>,
);
