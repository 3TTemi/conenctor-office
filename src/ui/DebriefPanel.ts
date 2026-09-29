import type { Character } from '../game/Character';

/**
 * UI controller for the debrief panel.
 * Shows debrief information when player talks to a character.
 */
export class DebriefPanel {
  private panel: HTMLElement;
  private titleEl: HTMLElement;
  private accountEl: HTMLElement;
  private sinceEl: HTMLElement;
  private bulletsEl: HTMLElement;
  private closeBtn: HTMLElement;
  
  private isOpen: boolean = false;
  private currentCharacter: Character | null = null;
  private currentAccountIndex: number = 0;

  constructor() {
    this.panel = document.getElementById('debrief-panel')!;
    this.titleEl = document.getElementById('debrief-title')!;
    this.accountEl = document.getElementById('debrief-account')!;
    this.sinceEl = document.getElementById('debrief-since')!;
    this.bulletsEl = document.getElementById('debrief-bullets')!;
    this.closeBtn = document.getElementById('close-debrief')!;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.closeBtn.addEventListener('click', () => this.close());
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
      // Tab through accounts if character has multiple
      if (e.key === 'Tab' && this.isOpen && this.currentCharacter) {
        e.preventDefault();
        this.nextAccount();
      }
    });
  }

  open(character: Character): void {
    this.currentCharacter = character;
    this.currentAccountIndex = 0;
    this.isOpen = true;
    
    this.render();
    this.panel.classList.add('show');
  }

  close(): void {
    this.isOpen = false;
    this.currentCharacter = null;
    this.panel.classList.remove('show');
  }

  private nextAccount(): void {
    if (!this.currentCharacter) return;
    
    const debriefs = this.currentCharacter.debriefs;
    if (debriefs.length > 1) {
      this.currentAccountIndex = (this.currentAccountIndex + 1) % debriefs.length;
      this.render();
    }
  }

  private render(): void {
    if (!this.currentCharacter) return;

    const debriefs = this.currentCharacter.debriefs;
    
    if (debriefs.length === 0) {
      this.titleEl.textContent = this.currentCharacter.getAppName();
      this.accountEl.textContent = '';
      this.sinceEl.textContent = '📅 No recent activity';
      this.bulletsEl.innerHTML = '<li>Nothing to report in the past 24 hours.</li>';
      return;
    }

    const debrief = debriefs[this.currentAccountIndex];
    
    // Title
    this.titleEl.textContent = this.currentCharacter.getAppName();
    
    // Account info (with tab hint if multiple)
    let accountText = debrief.accountLabel || debrief.account;
    if (debriefs.length > 1) {
      accountText += ` (${this.currentAccountIndex + 1}/${debriefs.length} - Tab to switch)`;
    }
    this.accountEl.textContent = accountText;
    
    // Time range
    const sinceDate = new Date(debrief.since);
    const timeAgo = this.formatTimeAgo(sinceDate);
    let sinceText = `📅 Past 24 hours (since ${timeAgo})`;
    if (debrief.unreadCount) {
      sinceText += ` • ${debrief.unreadCount} items`;
    }
    this.sinceEl.textContent = sinceText;
    
    // Summary if available
    if (debrief.summary) {
      this.sinceEl.textContent += `\n💡 ${debrief.summary}`;
    }
    
    // Bullets
    this.bulletsEl.innerHTML = '';
    
    // Sort by priority then timestamp
    const sortedBullets = [...debrief.bullets].sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      const aPriority = priorityOrder[a.priority || 'normal'];
      const bPriority = priorityOrder[b.priority || 'normal'];
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      if (a.timestamp && b.timestamp) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return 0;
    });

    sortedBullets.forEach(bullet => {
      const li = document.createElement('li');
      
      // Priority indicator
      let priorityIcon = '';
      if (bullet.priority === 'high') {
        priorityIcon = '🔴 ';
        li.style.borderLeftColor = '#FF4444';
      } else if (bullet.priority === 'low') {
        priorityIcon = '⚪ ';
        li.style.borderLeftColor = '#888888';
      }
      
      // Text content
      let content = priorityIcon + bullet.text;
      
      // Timestamp if available
      if (bullet.timestamp) {
        const bulletTime = new Date(bullet.timestamp);
        const relativeTime = this.formatRelativeTime(bulletTime);
        content += ` <span style="color: #888; font-size: 12px;">(${relativeTime})</span>`;
      }
      
      // Link if available
      if (bullet.link) {
        content += ` <a href="${bullet.link}" target="_blank">[→]</a>`;
      }
      
      li.innerHTML = content;
      this.bulletsEl.appendChild(li);
    });
  }

  private formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'less than an hour ago';
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return 'yesterday';
  }

  private formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 0) {
      // Future event
      const futureMins = Math.abs(diffMins);
      if (futureMins < 60) return `in ${futureMins}m`;
      return `in ${Math.floor(futureMins / 60)}h`;
    }
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return 'yesterday';
  }

  isShowing(): boolean {
    return this.isOpen;
  }
}
