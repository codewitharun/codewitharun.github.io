// src/content/projects.ts
// Every project on the site, in code. Edit here, commit, deploy.
//
// Projects used to live in Firestore and were edited from /admin, but a
// form can only fill the same fixed fields for every project. Here each one
// can carry its own copy and media, the images are versioned in
// public/projects/<slug>/, and pages build statically. The blog stays in
// /admin (Firestore), because posts change weekly and projects rarely.
//
// Two kinds:
//  - "hobby": my own apps under Techtiten, built in my spare time.
//  - "work": apps I worked on as part of my job. No freelance framing.
//
// Media:
//  - `screenshots`: plain app screens (no marketing headline), shown inside
//    the CSS iPhone frame. Portrait, ~720px wide webp.
//  - `cover`: an already-composed graphic (store feature graphic), shown
//    flat and never framed again.
//  - neither: a clean title tile is drawn instead.
//  - `icon`: square app icon for small cards (/apps, related projects).
import type { Project } from "@/data/site";

const fitprep: Project = {
  slug: "fitprep",
  kind: "hobby",
  title: "FitPrep",
  tagline: "High-protein meal prep, made a game.",
  description:
    "A high-protein meal prep app that turns eating on plan into a game. Tell it your goal and how you eat, and it plans a week of meals around your protein target, with real Indian food like dal, paneer and rajma (or other cuisines). Prep in one session using the prep-day checklist and a grocery list that counts down as you eat, then tick meals, water and workouts through the day to keep your streak alive, earn XP and level up.",
  status: "Live on Google Play",
  role: "Solo: design, app and backend",
  year: "2026 – now",
  platform: "mobile",
  currentlyWorkingOn: true,
  icon: "/projects/fitprep/icon.webp",
  cover: "/projects/fitprep/feature.webp",
  screenshotsInset: true,
  screenshots: [
    "/projects/fitprep/home.webp",
    "/projects/fitprep/plan.webp",
    "/projects/fitprep/insights.webp",
    "/projects/fitprep/grocery.webp",
    "/projects/fitprep/move.webp",
    "/projects/fitprep/streak.webp",
  ],
  links: {
    playStore: "https://play.google.com/store/apps/details?id=com.arun.fitprep",
  },
  tech: ["React Native", "Expo", "TypeScript", "Reanimated", "Fastify", "Firebase", "Google Gemini", "Vercel"],
  features: [
    "Daily dashboard with calories left, protein, water and XP at a glance",
    "Weekly high-protein meal plan, or an AI-built plan from 6 quick answers",
    "Swap any meal for another with similar macros",
    "AI meal photo scan that estimates calories and protein (photos are never stored)",
    "Grocery list with exact amounts for the week that counts down as you finish each meal",
    "Prep-day checklist and reminder, with meals and prep in one tabbed card",
    "Streaks, XP, levels and a celebration screen for perfect days",
    "Move tab: Push/Pull/Legs templates, set logging, rest timer and PR tracking",
    "Insights with plan score, 7/30/90-day trends, weight log and steps",
    "Meal reminders with the day's dish and Done / Snooze buttons, plus home-screen widgets",
    "Cloud backup, FitPrep Pro through Google Play, and an admin panel",
    "Dark and light themes, onboarding, in-app account deletion and support pages",
  ],
};

const ezysplit: Project = {
  slug: "ezysplit",
  kind: "hobby",
  title: "EzySplit",
  tagline: "Shared expenses, fair splits, zero awkward reminders.",
  description:
    "An expense splitting and personal finance app for friends, flatmates and trips. Create groups, add shared expenses with flexible splits, see who owes whom in real time, and settle up through a UPI link that opens Google Pay or PhonePe with the amount filled in. A separate personal tracker covers your own spending. Built for everyday use with my own friends, and live on Google Play.",
  status: "Live on Google Play",
  role: "Solo: design, app and backend",
  year: "2025 – now",
  platform: "mobile",
  icon: "/projects/ezysplit/icon.webp",
  cover: "/projects/ezysplit/feature.webp",
  screenshots: [
    "/projects/ezysplit/dashboard.webp",
    "/projects/ezysplit/group.webp",
    "/projects/ezysplit/edit-expense.webp",
    "/projects/ezysplit/invite.webp",
  ],
  links: {
    playStore: "https://play.google.com/store/apps/details?id=com.techtitens.ezysplit",
  },
  tech: ["React Native", "Expo", "TypeScript", "Firebase", "Firestore", "Cloud Messaging", "Node.js", "Express", "Vercel", "Gemini"],
  features: [
    "Groups for trips, flats and friends, with invite links and join requests",
    "Flexible splitting: equal, exact amounts or percentages, plus multi-item expenses",
    "Real-time balances that update the moment anyone adds an expense",
    "Settle up with a UPI link that opens Google Pay, PhonePe or any UPI app",
    "Personal expense tracking alongside shared groups",
    "Edit history and an “edited after settle-up” warning, so balances stay trustworthy",
    "Monthly insight card and quick stats on the home screen",
    "Branded PDF reports and Excel export",
    "Push notifications for new expenses and join requests",
    "Privacy policy, account deletion and support pages, with an admin panel",
  ],
};


const studymark: Project = {
  slug: "studymark",
  kind: "hobby",
  title: "Studymark",
  tagline: "Plan your study day, focus, and keep each other honest.",
  description:
    "A study app for students and friend squads. Plan the day with a week and month planner, start a focus session that hides the social tabs and holds notifications (and on Android blocks the apps you pick), then share proof with your squad, who grade it. Streaks, a squad leaderboard, chat and a community feed keep everyone going. Built with Supabase.",
  status: "In development",
  role: "Solo: design, app and backend",
  year: "2026 – now",
  platform: "mobile",
  icon: "/projects/studymark/icon.webp",
  screenshotsInset: true,
  screenshots: [
    "/projects/studymark/today.webp",
    "/projects/studymark/focus.webp",
    "/projects/studymark/squad.webp",
    "/projects/studymark/plan.webp",
  ],
  links: {},
  tech: ["React Native", "Expo", "TypeScript", "Supabase", "Postgres", "Kotlin"],
  features: [
    "Planner with week, month and list views, a day timeline and auto-plan",
    "Focus sessions that hide Squad and Feed and hold chat notifications until you're done",
    "Android app blocker: apps you pick send you back to Studymark while you focus",
    "Study reminders for sessions, classes, due tasks, exams and revision",
    "Squads: share your day, get graded by friends, streaks and a leaderboard",
    "Squad chat, friends, profiles, report and block",
    "Community feed",
  ],
};

const ageas: Project = {
  slug: "ageas-federal-life-insurance",
  kind: "work",
  title: "Ageas Federal Life Insurance",
  tagline: "The insurer's customer app for policies, payments and claims.",
  description:
    "The customer app for Ageas Federal Life Insurance, built at my job. I built it from scratch and now lead its second phase: policy management, premium payments, fund tracking, claims, and secure access to policy documents. One React Native codebase runs the iOS and Android apps and, through React Native Web, the responsive customer portal at mypolicy.ageasfederal.com.",
  status: "Live on App Store & Google Play",
  role: "Built at work",
  platform: "both",
  // the live customer portal (React Native Web, same codebase as the apps);
  // everything past login is private policy data, so only the login screen
  cover: "/projects/ageas/web-login.webp",
  screenshots: ["/projects/ageas/app-home.webp"],
  links: {
    website: "https://mypolicy.ageasfederal.com",
    appStore: "https://apps.apple.com/in/app/ageas-federal-life-insurance/id6756178483",
    playStore: "https://play.google.com/store/apps/details?id=com.ageasfederal.customer",
  },
  tech: ["React Native", "React Native Web", "TypeScript", "Firebase", "Payments"],
};

const sodality: Project = {
  slug: "sodality",
  kind: "work",
  title: "Sodality",
  tagline: "One codebase, many branded apps for membership organisations.",
  description:
    "A white-label mobile app platform for nonprofits and membership organisations, built at my job: a branded app per organisation, engagement tools, and an architecture that ships many apps from one codebase.",
  status: "Live on App Store & Google Play",
  role: "Built at work",
  platform: "mobile",
  links: { website: "https://sodality.app/" },
  tech: ["React Native", "TypeScript", "White-label", "Firebase"],
};

// Real app name and links kept private on purpose.
const liveStreaming: Project = {
  slug: "live-streaming-app",
  kind: "work",
  title: "Glowcast",
  tagline: "Live streaming and video calls with real-time beauty filters.",
  description:
    "A live streaming and video calling app I worked on, with real-time beauty filters, gifting with in-app currency, and Google Play billing. “Glowcast” is a placeholder name: the real app stays private.",
  status: "Name kept private",
  role: "Worked on",
  platform: "mobile",
  links: {},
  tech: ["React Native", "Vision Camera", "Skia", "Live Streaming", "Video Calls", "Play Billing"],
};

const penn: Project = {
  slug: "penn-ai",
  kind: "work",
  title: "Penn AI",
  tagline: "Record meetings and chats, get a transcript sorted by speaker.",
  description:
    "An iOS and Android app for Penn AI, built at my earlier job. It recorded meetings and conversations, transcribed them, split the transcript by voice (Speaker 1, 2, 3…) and kept every recording organised day by day. The company has since moved to a different product, so the app is no longer listed.",
  status: "No longer listed",
  role: "Built at work",
  platform: "mobile",
  links: {},
  tech: ["React Native", "Audio Recording", "Speech-to-Text", "Speaker Labels", "iOS", "Android"],
};

const sociable: Project = {
  slug: "sociable",
  kind: "work",
  title: "Sociable",
  tagline: "A social feed with real-time chat.",
  description: "A social app with a feed, likes, comments and shares, real-time chat over Firebase, and Node.js services.",
  status: "Completed",
  role: "Worked on",
  platform: "mobile",
  links: {},
  tech: ["React Native", "Firebase", "Node.js", "Real-time Chat"],
};

const shippity: Project = {
  slug: "shippity",
  kind: "work",
  title: "Shippity",
  tagline: "Food delivery with live order tracking.",
  description: "A food delivery app with real-time order tracking, payments, and an ordering flow end to end.",
  status: "Completed",
  role: "Worked on",
  platform: "mobile",
  links: {},
  tech: ["React Native", "Google Maps", "Payments", "Real-time Tracking"],
};

/** Display order: hobby apps first, then work. */
export const projects: Project[] = [
  fitprep,
  ezysplit,
  studymark,
  ageas,
  sodality,
  penn,
  liveStreaming,
  sociable,
  shippity,
];

export const hobbyProjects = projects.filter((p) => p.kind === "hobby");
export const workProjects = projects.filter((p) => p.kind === "work");

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
