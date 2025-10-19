"use client";

import Script from "next/script";
import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface GoogleAnalyticsProps {
  measurementId: string;
}

// Extend Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

// Separate component for page view tracking with useSearchParams
function PageViewTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId) return;

    // Track page views on route change
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    
    // Check if gtag is available
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", measurementId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, measurementId]);

  return null;
}

export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <PageViewTracker measurementId={measurementId} />
      </Suspense>
    </>
  );
}
