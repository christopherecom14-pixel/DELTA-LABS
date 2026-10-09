"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// The base snippet tracks the first PageView; client-side navigations need their own.
export function MetaPixelPageViews() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
