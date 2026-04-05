"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { logEvent, setAnalyticsUserId } from "@/lib/firebase/analytics-utils";
import { useUserContext } from "@/components/app/UserContext";

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { uid } = useUserContext();

  // Track User Identity
  useEffect(() => {
    if (uid) {
      setAnalyticsUserId(uid);
    }
  }, [uid]);

  // Track Page Views on every route change
  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    logEvent("page_view", {
      page_path: url,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname, searchParams]);

  return null;
}

/**
 * FirebaseAnalytics component to automatically handle page tracking in Next.js 14 App Router.
 * Wrap in Suspense because useSearchParams() requires it in client components.
 */
export default function FirebaseAnalytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTracker />
    </Suspense>
  );
}
