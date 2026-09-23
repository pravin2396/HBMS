import React, { useState } from 'react';
import { SidebarContext } from './SidebarContextCore';

export const SidebarProvider = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsMobileOpen(false);
  };

  const openSidebar = () => {
    setIsMobileOpen(true);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const value = {
    isMobileOpen,
    isCollapsed,
    toggleSidebar,
    closeSidebar,
    openSidebar,
    toggleCollapse
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;
