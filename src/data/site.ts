// src/data/site.ts
// Single source of truth for site copy and project data — mirrors the
// structure of the old CRA site's src/info/Info.js, carried over and
// rewritten under the Techtiten brand. Real content, not placeholders:
// this is the actual bio, skill list, and project history from
// arun.codes. Techtiten is the name Arun ships his hobby apps under: no
// clients, no freelance. Projects themselves live in src/content/projects.ts.

export const brand = {
  name: "Techtiten",
  // "Tech Titan" is the most common misspelling/mishearing of the brand
  // name - carried as an explicit alternate name (meta, schema.org
  // alternateName) so search shows up for either spelling.
  alternateName: "Tech Titan",
  tagline: "Not perfect. Building anyway.",
  longTagline:
    "A titan, deliberately misspelled — because shipping beats waiting for perfect.",
  founder: "Arun Kumar",
  role: "Founder & Lead Engineer",
  founderRoles: ["React Native Developer", "Software Engineer"],
  location: "Jaipur, India",
  city: "Jaipur",
  country: "India",
  email: "arun4dev@icloud.com",
  phone: "+91 86012 79944",
  resumeUrl: "/Resume.pdf",
};

// One shared list feeding both the <meta name="keywords"> tag and, where
// relevant, on-page copy - the actual mix of terms asked for: brand name
// (both spellings), personal name, role variants, and location. Real
// ranking signal comes from title/description/visible copy, not this tag
// (Google itself ignores meta keywords), but it costs nothing to set and
// several other engines/crawlers still read it - matching the old site's
// own convention of listing all of these explicitly.
export const seoKeywords = [
  "Techtiten",
  "Tech Titan",
  "Arun Kumar",
  "Arun Kumar Jaipur",
  "Arun Kumar React Native Developer",
  "React Native Developer",
  "Senior React Native Developer",
  "React Native Developer Jaipur",
  "React Native Developer India",
  "Software Engineer",
  "Software Engineer Jaipur",
  "Software Engineer India",
  "Developer Jaipur",
  "Developer India",
  "Mobile App Developer",
  "Full-Stack Developer",
  "TypeScript Developer",
  "Firebase Developer",
  "JavaScript Developer",
  "Node.js Developer",
  "iOS Developer",
  "Android Developer",
  "Jaipur",
  "India",
];

export const socials = [
  { label: "GitHub", href: "https://github.com/codewitharun" },
  { label: "LinkedIn", href: "https://linkedin.com/in/arunk4it" },
  { label: "Twitter", href: "https://x.com/arunk4it" },
  { label: "Instagram", href: "https://instagram.com/arunlabs" },
];

export const miniBio = [
  { emoji: "💻", text: "React Native • TypeScript • Full-Stack" },
  { emoji: "🏢", text: "Senior React Native Developer @ Durapid Technologies" },
  { emoji: "🌙", text: "Hobby apps on Google Play: FitPrep, EzySplit" },
  { emoji: "📍", text: "Jaipur, India" },
];

export const bio = `Techtiten is the name I put on my hobby projects: apps I build in the evenings and on weekends because I want to use them myself. "Titen" instead of "Titan" is on purpose. The whole idea is that unfinished and imperfect still ships, still gets used, and gets better in public.

By day I'm a Senior React Native Developer at Durapid Technologies. At work I built the Ageas Federal Life Insurance customer app from scratch and now lead its second phase. Outside work, Techtiten is where my own apps live: FitPrep, an AI meal-prep and gym tracker, and EzySplit, an expense-splitting app my friends and I use every week. Both are on Google Play.

I specialise in React Native, TypeScript, Firebase and native integrations, with hands-on experience in live streaming, real-time chat, payments, maps, push notifications, and getting apps through App Store and Play Store review.`;

export const skills = {
  proficientWith: [
    "React Native",
    "TypeScript",
    "JavaScript (ES6+)",
    "Redux / Redux Toolkit",
    "Firebase (Auth, Firestore, Realtime DB, Cloud Messaging)",
    "Node.js",
    "Payment Gateways (PhonePe, Stripe, Paystack)",
    "Google Maps & Location Tracking",
    "Push Notifications",
    "Real-time Chat",
    "App Store & Play Store Deployment",
    "Git & GitHub",
    "REST APIs",
    "Performance Optimization",
    "Modular & Scalable Architecture",
  ],
  learning: [
    "Real-time video & beauty filters",
    "Machine Learning Filters",
    "Swift & Kotlin (Native Development)",
    "Cloud Tech (AWS/GCP)",
    "System Design & Architecture",
  ],
};

export const hobbies = [
  { label: "Cooking", emoji: "🌶" },
  { label: "Reading", emoji: "📖" },
  { label: "Movies", emoji: "🎥" },
  { label: "Tech Experiments", emoji: "⚙️" },
];

// Every external link a project card can show, kept explicit rather than
// generic "live"/"source" fields — those were ambiguous in practice (a
// Play Store URL living in `source`, a marketing site living in `source`
// on another project) and left visitors unsure what a click would open.
// Each key here maps to exactly one icon and label in ProjectLinkButtons.
export type ProjectLinks = {
  /** Google Play Store listing */
  playStore?: string;
  /** Apple App Store listing */
  appStore?: string;
  /** Live marketing/product site — also used to pull a live screenshot */
  website?: string;
  /** Public source code repository */
  github?: string;
  /** Help & support page (shown on the case-study page only) */
  support?: string;
  /** Privacy policy (shown on the case-study page only) */
  privacy?: string;
};

export type Project = {
  slug: string;
  /** "hobby" = my own app under Techtiten; "work" = built at my job */
  kind: "hobby" | "work";
  title: string;
  description: string;
  links: ProjectLinks;
  /** square app icon (small cards) */
  icon?: string;
  /** an already-composed graphic (e.g. store feature graphic), shown flat */
  cover?: string;
  tech: string[];
  status: string;
  /** The one project currently being actively worked on — shown in the
   * home page's "Currently working on" section instead of a permanent
   * "flagship" label, since what's current changes over time. */
  currentlyWorkingOn?: boolean;
  /** Optional bullet list of standout capabilities, shown on the project's
   * case-study page (/portfolio/[slug]) under its own "Features" section.
   * Not shown on the homepage teaser or the /portfolio grid card — those
   * stay to `description` alone so they don't get crowded. */
  features?: string[];
  /** What the project is, for picking the right preview on its page:
   * "mobile" = phone app (iPhone frames), "web" = site (laptop + phone),
   * "both". Inferred from the links when not set. */
  platform?: ProjectPlatform;
  /** Screenshots start right at the app content (no status bar): leave
   * room at the top so the Dynamic Island doesn't cover it. */
  screenshotsInset?: boolean;
  /** Phone screenshots (portrait, in order) — shown in iPhone frames in
   * the hero and the "Screens" gallery of the case-study page. */
  screenshots?: string[];
  /** One-line pitch under the title on the case-study page. */
  tagline?: string;
  /** Search title for a live app, written for people looking for the app
   * (not for recruiters), e.g. "EzySplit: Split Bills & Settle with UPI". */
  seoTitle?: string;
  /** Search snippet for a live app (about 150 characters). */
  seoDescription?: string;
  /** schema.org applicationCategory, e.g. "FinanceApplication". */
  appCategory?: string;
  /** e.g. "Solo developer — design, app and backend". */
  role?: string;
  /** e.g. "2025 – now". */
  year?: string;
  /** Headline numbers, one per entry as "value | label", e.g. "500+ | Active users". */
  highlights?: string[];
};

export type ProjectPlatform = "mobile" | "web" | "both";

export const siteUrl = "https://techtiten.com";
