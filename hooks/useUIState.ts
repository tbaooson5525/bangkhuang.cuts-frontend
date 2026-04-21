"use client";

import { useState, useCallback } from "react";

function readStorage(key: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(key) === "true";
}

export function useUIState() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() =>
    readStorage("sidebarCollapsed"),
  );
  const [rightBarCollapsed, setRightBarCollapsed] = useState(() =>
    readStorage("rightBarCollapsed"),
  );

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebarCollapsed", String(next));
      return next;
    });
  }, []);

  const toggleRightBar = useCallback(() => {
    setRightBarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("rightBarCollapsed", String(next));
      return next;
    });
  }, []);

  return { sidebarCollapsed, rightBarCollapsed, toggleSidebar, toggleRightBar };
}
