import { logEvent as firebaseLogEvent, setUserId as firebaseSetUserId, setUserProperties as firebaseSetUserProperties } from "firebase/analytics";
import { analytics } from "./client";

/**
 * Safely log a custom event to Firebase Analytics.
 * Only runs on the client side if analytics is initialized.
 */
export function logEvent(eventName: string, eventParams?: { [key: string]: any }) {
  if (typeof window !== "undefined" && analytics) {
    firebaseLogEvent(analytics, eventName, eventParams);
  }
}

/**
 * Set the user ID for analytics tracking.
 */
export function setAnalyticsUserId(userId: string) {
  if (typeof window !== "undefined" && analytics) {
    firebaseSetUserId(analytics, userId);
  }
}

/**
 * Set custom user properties for analytics segmentation.
 */
export function setAnalyticsUserProperties(properties: { [key: string]: any }) {
  if (typeof window !== "undefined" && analytics) {
    firebaseSetUserProperties(analytics, properties);
  }
}

// Predefined Event Names for Consistency
export const EVENTS = {
  PAGE_VIEW: "page_view_custom",
  AI_QUERY: "ai_assistant_query",
  CASE_VIEW: "case_summary_view",
  PREMIUM_UPGRADE_CLICK: "premium_upgrade_click",
  FLASHCARD_GENERATE: "flashcard_generation",
  FEATURE_TOGGLE: "admin_feature_toggle",
  TAB_CHANGE: "case_detail_tab_change",
  AUDIO_PLAY: "case_audio_play",
};
