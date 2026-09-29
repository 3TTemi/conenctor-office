import type { DebriefPayload, CharacterConfig } from '../connector/types';

/**
 * Realistic fixture debrief data for demo purposes.
 * This simulates what the past 24 hours looked like across connected apps.
 */

const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

export const fixtureDebriefs: DebriefPayload[] = [
  // Gmail - Personal Account
  {
    app: 'gmail',
    account: 'personal',
    accountLabel: 'Personal (alex.personal@gmail.com)',
    since: yesterday,
    unreadCount: 7,
    summary: 'Busy inbox day with some important personal updates',
    bullets: [
      {
        text: 'Amazon shipment arriving tomorrow - your new mechanical keyboard',
        priority: 'normal',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'Mom sent photos from the family reunion last weekend',
        priority: 'normal',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'Netflix subscription renewal notice - $15.99 charged',
        priority: 'low',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'Dentist appointment reminder for Friday at 2pm',
        priority: 'high',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  
  // Gmail - School Account
  {
    app: 'gmail',
    account: 'school',
    accountLabel: 'School (alex.student@university.edu)',
    since: yesterday,
    unreadCount: 12,
    summary: 'Multiple course announcements and a grade posted',
    bullets: [
      {
        text: 'CS 410 - Assignment 3 grades posted: You got 92/100!',
        priority: 'high',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        link: 'https://canvas.university.edu/courses/cs410',
      },
      {
        text: 'Study group confirmed for Thursday 6pm at library',
        priority: 'normal',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'Professor Chen posted new lecture slides for Week 8',
        priority: 'normal',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'Campus career fair next Tuesday - 15 tech companies attending',
        priority: 'high',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  
  // Gmail - Professional Account
  {
    app: 'gmail',
    account: 'professional',
    accountLabel: 'Work (alex@techstartup.io)',
    since: yesterday,
    unreadCount: 23,
    summary: 'Active day with client communications and team updates',
    bullets: [
      {
        text: 'Client Acme Corp approved the Q4 proposal - project kicks off Monday',
        priority: 'high',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'Sarah shared design mockups for the dashboard redesign',
        priority: 'normal',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        link: 'https://figma.com/file/dashboard-v2',
      },
      {
        text: 'Weekly standup notes from engineering team posted',
        priority: 'normal',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'HR: Updated PTO policy document - please review by EOW',
        priority: 'low',
        timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'DevOps alert: Staging server maintenance tonight 11pm-1am',
        priority: 'high',
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  
  // Google Calendar
  {
    app: 'calendar',
    account: 'primary',
    accountLabel: 'All Calendars',
    since: yesterday,
    summary: '4 meetings today, 2 completed, 2 upcoming',
    bullets: [
      {
        text: '✅ 9:00 AM - Morning standup (completed, 15 min)',
        priority: 'normal',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: '✅ 11:30 AM - 1:1 with manager Sarah (completed)',
        priority: 'normal',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: '📅 3:00 PM - Client demo with Acme Corp (in 2 hours)',
        priority: 'high',
        timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        link: 'https://meet.google.com/abc-defg-hij',
      },
      {
        text: '📅 5:30 PM - Team happy hour at The Brew House',
        priority: 'normal',
        timestamp: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: '⚠️ Tomorrow: Project deadline - Dashboard v2 handoff',
        priority: 'high',
        timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  
  // Notion - Personal Workspace
  {
    app: 'notion',
    account: 'personal',
    accountLabel: 'Personal Workspace',
    since: yesterday,
    summary: 'Notes updated and new reading list entries',
    bullets: [
      {
        text: 'Added 3 new books to "Want to Read" database',
        priority: 'normal',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'Journal entry: Reflections on productivity systems',
        priority: 'low',
        timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'Recipe saved: Thai Green Curry from that blog',
        priority: 'low',
        timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  
  // Notion - DTI Workspace
  {
    app: 'notion',
    account: 'dti',
    accountLabel: 'DTI Team Workspace',
    since: yesterday,
    summary: '5 comments, 2 page updates, sprint planning active',
    bullets: [
      {
        text: '@Maya commented on your "API Integration" spec: "Looks great, minor tweak on auth flow"',
        priority: 'high',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        link: 'https://notion.so/dti/api-integration-spec',
      },
      {
        text: 'Sprint 14 planning board updated - you\'re assigned 3 tickets',
        priority: 'normal',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: '@Jordan resolved the blocker on "User Dashboard" page',
        priority: 'normal',
        timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'Team retrospective notes posted from Monday\'s session',
        priority: 'low',
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  
  // Notion - URMC Workspace
  {
    app: 'notion',
    account: 'urmc',
    accountLabel: 'URMC Research Workspace',
    since: yesterday,
    summary: 'Research notes and literature review updates',
    bullets: [
      {
        text: 'Dr. Patel added comments on your literature review draft',
        priority: 'high',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        link: 'https://notion.so/urmc/lit-review-draft',
      },
      {
        text: 'Lab meeting notes uploaded: New protocol for data collection',
        priority: 'normal',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: 'Shared resource: NIH grant template for Fall submissions',
        priority: 'normal',
        timestamp: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  
  // Google Drive
  {
    app: 'drive',
    account: 'primary',
    accountLabel: 'My Drive',
    since: yesterday,
    summary: '8 files modified, 3 shared with you',
    bullets: [
      {
        text: '📄 "Q4 Budget Proposal.xlsx" - Sarah made 12 edits',
        priority: 'normal',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        link: 'https://docs.google.com/spreadsheets/budget-q4',
      },
      {
        text: '📁 New folder shared: "Client Assets - Acme Corp"',
        priority: 'high',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: '📝 "Meeting Notes Oct 28.doc" - you last edited 2 hours ago',
        priority: 'low',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: '📊 "Dashboard Mockup v3.fig" exported to Drive from Figma',
        priority: 'normal',
        timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: '⚠️ Storage: Using 12.4 GB of 15 GB (82%)',
        priority: 'normal',
      },
    ],
  },
  
  // GitHub
  {
    app: 'github',
    account: 'primary',
    accountLabel: '@alexdev',
    since: yesterday,
    summary: '3 PRs, 2 reviews requested, 5 notifications',
    bullets: [
      {
        text: '🔀 PR #142 merged: "Add dark mode support" in frontend-app',
        priority: 'normal',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        link: 'https://github.com/company/frontend-app/pull/142',
      },
      {
        text: '👀 Review requested: PR #89 "Refactor auth middleware" in api-server',
        priority: 'high',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        link: 'https://github.com/company/api-server/pull/89',
      },
      {
        text: '💬 @maya-dev commented on your PR: "Nice optimization!"',
        priority: 'normal',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: '⭐ Your repo "dotfiles" got 3 new stars today',
        priority: 'low',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
      {
        text: '🤖 Dependabot: 2 security updates available for dashboard-v2',
        priority: 'high',
        timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        link: 'https://github.com/company/dashboard-v2/security',
      },
    ],
  },
];

/**
 * Character configurations for the office.
 * Each character represents one app and has a distinct blocky skin.
 */
export const characterConfigs: CharacterConfig[] = [
  {
    id: 'gmail',
    name: 'Mail Clerks',
    app: 'gmail',
    position: { x: -6, z: -3 },
    colors: {
      primary: '#EA4335',    // Gmail red
      secondary: '#FFFFFF',  // White
      accent: '#FBBC05',     // Gmail yellow
    },
    accounts: ['personal', 'school', 'professional'],
  },
  {
    id: 'calendar',
    name: 'Cal',
    app: 'calendar',
    position: { x: 6, z: -3 },
    colors: {
      primary: '#4285F4',    // Google blue
      secondary: '#FFFFFF',
      accent: '#34A853',     // Google green
    },
    accounts: ['primary'],
  },
  {
    id: 'notion',
    name: 'Nori',
    app: 'notion',
    position: { x: -6, z: 5 },
    colors: {
      primary: '#000000',    // Notion black
      secondary: '#FFFFFF',
      accent: '#E16259',     // Notion accent
    },
    accounts: ['personal', 'dti', 'urmc'],
  },
  {
    id: 'drive',
    name: 'Dax',
    app: 'drive',
    position: { x: 6, z: 5 },
    colors: {
      primary: '#0F9D58',    // Drive green
      secondary: '#4285F4',  // Drive blue
      accent: '#F4B400',     // Drive yellow
    },
    accounts: ['primary'],
  },
  {
    id: 'github',
    name: 'Octo',
    app: 'github',
    position: { x: 0, z: 8 },
    colors: {
      primary: '#24292E',    // GitHub dark
      secondary: '#FFFFFF',
      accent: '#6F42C1',     // GitHub purple
    },
    accounts: ['primary'],
  },
];
