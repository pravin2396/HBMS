import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { AuthProvider } from './context/AuthContext';
import { AnalyticsProvider } from './context/AnalyticsContext';
import { RoomProvider } from './context/RoomContext';
import { GuestProvider } from './context/GuestContext';
import { BookingProvider } from './context/BookingContext';
import { SidebarProvider } from './context/SidebarContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AnalyticsProvider>
        <RoomProvider>
          <GuestProvider>
            <BookingProvider>
              <SidebarProvider>
                <App />
              </SidebarProvider>
            </BookingProvider>
          </GuestProvider>
        </RoomProvider>
      </AnalyticsProvider>
    </AuthProvider>
  </StrictMode>,
);
