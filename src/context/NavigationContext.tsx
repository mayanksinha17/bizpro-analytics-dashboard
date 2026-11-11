import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface NavigationContextType {
  currentPath: string;
  navigate: (to: string) => void;
  scrollToSection: (sectionId: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

function normalizePath(path: string): string {
  // Normalize '/app/' or '/app' to '/app', otherwise default to '/'
  const clean = path.split("?")[0].split("#")[0];
  if (clean === "/app" || clean.startsWith("/app/")) {
    return "/app";
  }
  return "/";
}

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return normalizePath(window.location.pathname);
    }
    return "/";
  });

  const navigate = useCallback((to: string) => {
    if (typeof window === "undefined") return;

    if (to.startsWith("#")) {
      // Internal anchor scroll
      scrollToSection(to.slice(1));
      return;
    }

    const targetNormalized = normalizePath(to);
    if (window.location.pathname !== to) {
      window.history.pushState({}, "", to);
    }
    setCurrentPath(targetNormalized);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    if (typeof window === "undefined") return;

    // If currently on /app and trying to scroll to a section on landing page
    if (normalizePath(window.location.pathname) !== "/") {
      window.history.pushState({}, "", `/#${sectionId}`);
      setCurrentPath("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (window.location.hash !== `#${sectionId}`) {
        window.history.replaceState({}, "", `#${sectionId}`);
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = normalizePath(window.location.pathname);
      setCurrentPath(nextPath);
      if (window.location.hash) {
        const id = window.location.hash.slice(1);
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <NavigationContext.Provider value={{ currentPath, navigate, scrollToSection }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}

