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
 * Live debrief adapter.
 * Loads data from a JSON file dropped by an external host (e.g., Grok Bot).
 * 
 * Usage:
 * 1. Drop a JSON file at public/data/live-debriefs.json, or
 * 2. POST debriefs to /api/debrief endpoint
 */
export class LiveDebriefAdapter implements IDebriefAdapter {
  private debriefs: DebriefPayload[] = [];
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.refreshPromise = this.refresh();
  }

  private async ensureLoaded(): Promise<void> {
    if (this.refreshPromise) {
      await this.refreshPromise;
    }
  }

  async getDebriefs(app: AppType): Promise<DebriefPayload[]> {
    await this.ensureLoaded();
    return this.debriefs.filter(d => d.app === app);
  }

  async getDebriefForAccount(app: AppType, account: string): Promise<DebriefPayload | null> {
    await this.ensureLoaded();
    return this.debriefs.find(d => d.app === app && d.account === account) || null;
  }

  async refresh(): Promise<void> {
    // Try local JSON file first (primary use case for Grok Bot drop-in)
    try {
      const response = await fetch('/data/live-debriefs.json');
      if (response.ok) {
        const data = await response.json();
        this.debriefs = data.debriefs || data;
        console.log(`LiveDebriefAdapter: Loaded ${this.debriefs.length} debriefs from JSON file`);
        return;
      }
    } catch {
      // JSON file not available, try API
    }

    // Fallback: try API endpoint
    try {
      const response = await fetch('/api/debrief');
      if (response.ok) {
        const data = await response.json();
        this.debriefs = data.debriefs || data;
        console.log(`LiveDebriefAdapter: Loaded ${this.debriefs.length} debriefs from API`);
        return;
      }
    } catch {
      // API not available
    }

    console.warn('LiveDebriefAdapter: No live data available, debriefs will be empty');
  }
}

/**
 * Factory to create the appropriate adapter.
 * Set VITE_USE_LIVE_DATA=true to use live data.
 */
export function createDebriefAdapter(): IDebriefAdapter {
  // @ts-expect-error - Vite env vars
  if (import.meta.env?.VITE_USE_LIVE_DATA === 'true') {
    console.log('Using LiveDebriefAdapter (VITE_USE_LIVE_DATA=true)');
    return new LiveDebriefAdapter();
  }
  return new FixtureDebriefAdapter();
}
