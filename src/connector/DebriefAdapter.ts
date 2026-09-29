import type { AppType, DebriefPayload, IDebriefAdapter } from './types';
import { fixtureDebriefs } from '../data/fixtures';

/**
 * Fixture-based debrief adapter.
 * Uses local fixture data for demo purposes.
 * 
 * To swap in live data, implement a new adapter that:
 * 1. Fetches from your API endpoint, or
 * 2. Reads from a dropped JSON file
 */
export class FixtureDebriefAdapter implements IDebriefAdapter {
  private debriefs: DebriefPayload[] = fixtureDebriefs;

  async getDebriefs(app: AppType): Promise<DebriefPayload[]> {
    return this.debriefs.filter(d => d.app === app);
  }

  async getDebriefForAccount(app: AppType, account: string): Promise<DebriefPayload | null> {
    return this.debriefs.find(d => d.app === app && d.account === account) || null;
  }

  async refresh(): Promise<void> {
    // In fixture mode, this is a no-op
    // A live adapter would re-fetch from the API here
  }
}

/**
 * Live debrief adapter skeleton.
 * This is a stub for future implementation with real API data.
 * 
 * Usage:
 * 1. POST debriefs to /api/debrief endpoint, or
 * 2. Drop a JSON file at /data/live-debriefs.json
 */
export class LiveDebriefAdapter implements IDebriefAdapter {
  private debriefs: DebriefPayload[] = [];
  private apiEndpoint: string;

  constructor(apiEndpoint: string = '/api/debrief') {
    this.apiEndpoint = apiEndpoint;
  }

  async getDebriefs(app: AppType): Promise<DebriefPayload[]> {
    return this.debriefs.filter(d => d.app === app);
  }

  async getDebriefForAccount(app: AppType, account: string): Promise<DebriefPayload | null> {
    return this.debriefs.find(d => d.app === app && d.account === account) || null;
  }

  async refresh(): Promise<void> {
    try {
      // Try fetching from API endpoint
      const response = await fetch(this.apiEndpoint);
      if (response.ok) {
        const data = await response.json();
        this.debriefs = data.debriefs || data;
        return;
      }
    } catch {
      // API not available, try local JSON file
    }

    try {
      // Fallback: try local JSON file
      const response = await fetch('/data/live-debriefs.json');
      if (response.ok) {
        const data = await response.json();
        this.debriefs = data.debriefs || data;
        return;
      }
    } catch {
      // No live data available, stay empty
    }

    console.warn('LiveDebriefAdapter: No live data available, using empty debriefs');
  }
}

/**
 * Factory to create the appropriate adapter.
 * Set VITE_USE_LIVE_DATA=true to use live data.
 */
export function createDebriefAdapter(): IDebriefAdapter {
  // @ts-expect-error - Vite env vars
  if (import.meta.env?.VITE_USE_LIVE_DATA === 'true') {
    const adapter = new LiveDebriefAdapter();
    adapter.refresh();
    return adapter;
  }
  return new FixtureDebriefAdapter();
}
