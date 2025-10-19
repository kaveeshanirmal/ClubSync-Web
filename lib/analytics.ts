// Google Analytics utility functions for tracking custom events

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

// Check if Google Analytics is loaded
const isGALoaded = (): boolean => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};

/**
 * Track a custom event in Google Analytics
 * @param eventName - Name of the event (e.g., 'button_click', 'form_submit')
 * @param eventParams - Additional parameters for the event
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (!isGALoaded()) {
    console.warn("Google Analytics is not loaded");
    return;
  }

  window.gtag!("event", eventName, eventParams);
};

/**
 * Track a page view in Google Analytics
 * @param url - The page URL to track
 * @param title - Optional page title
 */
export const trackPageView = (url: string, title?: string) => {
  if (!isGALoaded()) {
    console.warn("Google Analytics is not loaded");
    return;
  }

  window.gtag!("event", "page_view", {
    page_path: url,
    page_title: title,
  });
};

/**
 * Track a club view event
 * @param clubId - The club ID
 * @param clubName - The club name
 */
export const trackClubView = (clubId: string, clubName: string) => {
  trackEvent("view_club", {
    club_id: clubId,
    club_name: clubName,
  });
};

/**
 * Track an event registration
 * @param eventId - The event ID
 * @param eventName - The event name
 */
export const trackEventRegistration = (eventId: string, eventName: string) => {
  trackEvent("register_event", {
    event_id: eventId,
    event_name: eventName,
  });
};

/**
 * Track a club join request
 * @param clubId - The club ID
 * @param clubName - The club name
 */
export const trackClubJoinRequest = (clubId: string, clubName: string) => {
  trackEvent("join_club_request", {
    club_id: clubId,
    club_name: clubName,
  });
};

/**
 * Track a search query
 * @param searchTerm - The search term used
 * @param searchCategory - Optional category (e.g., 'clubs', 'events')
 */
export const trackSearch = (searchTerm: string, searchCategory?: string) => {
  trackEvent("search", {
    search_term: searchTerm,
    search_category: searchCategory,
  });
};

/**
 * Track user login
 * @param method - Login method (e.g., 'google', 'email')
 */
export const trackLogin = (method: string) => {
  trackEvent("login", {
    method,
  });
};

/**
 * Track user signup
 * @param method - Signup method (e.g., 'google', 'email')
 */
export const trackSignup = (method: string) => {
  trackEvent("sign_up", {
    method,
  });
};

/**
 * Track a form submission
 * @param formName - Name of the form
 * @param formCategory - Optional category
 */
export const trackFormSubmit = (formName: string, formCategory?: string) => {
  trackEvent("form_submit", {
    form_name: formName,
    form_category: formCategory,
  });
};

/**
 * Track a download event
 * @param fileName - Name of the downloaded file
 * @param fileType - Type of file (e.g., 'pdf', 'image')
 */
export const trackDownload = (fileName: string, fileType?: string) => {
  trackEvent("file_download", {
    file_name: fileName,
    file_type: fileType,
  });
};

/**
 * Track certificate generation
 * @param eventId - The event ID
 * @param eventName - The event name
 */
export const trackCertificateGeneration = (
  eventId: string,
  eventName: string
) => {
  trackEvent("generate_certificate", {
    event_id: eventId,
    event_name: eventName,
  });
};

/**
 * Track a vote cast in an election
 * @param electionId - The election ID
 * @param positionId - The position ID
 */
export const trackVoteCast = (electionId: string, positionId: string) => {
  trackEvent("cast_vote", {
    election_id: electionId,
    position_id: positionId,
  });
};

/**
 * Track a social share
 * @param method - Share method (e.g., 'facebook', 'twitter', 'whatsapp')
 * @param contentType - Type of content shared (e.g., 'event', 'club')
 * @param contentId - ID of the shared content
 */
export const trackShare = (
  method: string,
  contentType: string,
  contentId: string
) => {
  trackEvent("share", {
    method,
    content_type: contentType,
    content_id: contentId,
  });
};

/**
 * Track an error or exception
 * @param description - Error description
 * @param fatal - Whether the error was fatal
 */
export const trackException = (description: string, fatal: boolean = false) => {
  trackEvent("exception", {
    description,
    fatal,
  });
};

/**
 * Track user engagement time
 * @param engagementTimeMs - Time in milliseconds
 */
export const trackEngagement = (engagementTimeMs: number) => {
  trackEvent("user_engagement", {
    engagement_time_msec: engagementTimeMs,
  });
};
