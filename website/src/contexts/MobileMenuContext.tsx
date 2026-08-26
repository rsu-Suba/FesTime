"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

interface MobileMenuContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggle: () => void;
  close: () => void;
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined);

export function MobileMenuProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  useEffect(() => {
    close();
  }, [pathname]);

  return (
    <MobileMenuContext.Provider value={{ isOpen, setIsOpen, toggle, close }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (context === undefined) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider");
  }
  return context;
}
