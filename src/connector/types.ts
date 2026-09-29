/**
 * Connector Office - Debrief Payload Interface
 * 
 * This file defines the TypeScript types for the debrief data that characters
 * display. The current implementation uses fixture data, but a future pass can
 * swap this for live data from Grok Bot connectors.
 * 
 * To integrate live data:
 * 1. POST to /api/debrief with the DebriefPayload shape, or
 * 2. Drop a JSON file matching DebriefPayload[] into public/data/live-debriefs.json
 * 
 * The DebriefAdapter will automatically pick up the data.
 */

/** Supported app types in the office */
export type AppType = 'gmail' | 'calendar' | 'notion' | 'drive' | 'github';

/** A single bullet point in a debrief */
export interface DebriefBullet {
  /** The main text content */
  text: string;
  /** Optional link for more details */
  link?: string;
  /** Optional timestamp (ISO string) */
  timestamp?: string;
  /** Priority: high items appear first */
  priority?: 'high' | 'normal' | 'low';
}

/**
 * The main debrief payload shape.
 * Each character can have multiple debriefs (one per account).
 */
export interface DebriefPayload {
  /** Which app this debrief is for */
  app: AppType;
  
  /** Account identifier (e.g., "personal", "school", "work", or email) */
  account: string;
  
  /** Human-readable account label for display */
  accountLabel?: string;
  
  /** ISO timestamp - debriefs cover activity since this time */
  since: string;
  
  /** The debrief bullet points */
  bullets: DebriefBullet[];
  
  /** Overall summary (optional) */
  summary?: string;
  
  /** Number of unread/unprocessed items (optional) */
  unreadCount?: number;
}

/**
 * Character configuration for the office
 */
export interface CharacterConfig {
  /** Unique character ID */
  id: string;
  
  /** Display name shown in UI */
  name: string;
  
  /** Which app this character represents */
  app: AppType;
  
  /** Position in the office (grid coordinates) */
  position: { x: number; z: number };
  
  /** Color scheme for the blocky skin */
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  
  /** Accounts this character covers */
  accounts: string[];
}

/**
 * Full response when fetching all debriefs
 */
export interface DebriefResponse {
  /** When this data was fetched/generated */
  fetchedAt: string;
  
  /** Array of all debriefs */
  debriefs: DebriefPayload[];
}

/**
 * Interface for debrief data adapters
 */
export interface IDebriefAdapter {
  /** Get all debriefs for a specific app */
  getDebriefs(app: AppType): Promise<DebriefPayload[]>;
  
  /** Get debriefs for a specific app and account */
  getDebriefForAccount(app: AppType, account: string): Promise<DebriefPayload | null>;
  
  /** Refresh data (for live adapters) */
  refresh(): Promise<void>;
}
