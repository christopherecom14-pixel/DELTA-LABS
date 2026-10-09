"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureAttribution } from "@/lib/analytics";

/** Records UTM / click-id parameters on any landing page so applications can be attributed to campaigns. */
export function AttributionCapture() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname.startsWith("/admin")) captureAttribution();
  }, [pathname]);
  return null;
}
