// src/data/site.ts
// Single source of truth for site copy and project data — mirrors the
// structure of the old CRA site's src/info/Info.js, carried over and
// rewritten under the Techtiten brand. Real content, not placeholders:
// this is the actual bio, skill list, and project history from
// arun.codes, just repositioned as "Techtiten, the studio Arun builds
// under" rather than a personal-name-only portfolio.

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
  { emoji: "🤝", text: "Full-Stack Consultant @ Federal Bank / Ageas Federal" },
  { emoji: "📍", text: "Jaipur, India" },
];

export const bio = `Techtiten is the studio I build under — the name for everything I ship outside a day job: apps, tools, experiments, the occasional idea that only half-works at first. "Titen" instead of "Titan" is on purpose: the whole premise is that unfinished and imperfect still ships, still gets used, still gets better in public.

By day I'm a Senior React Native Developer at Durapid Technologies, and a Full-Stack Consultant for Federal Bank / Ageas Federal Life Insurance, where I built their customer app from scratch and now run its second phase. Outside that, Techtiten is where the personal projects live — EzySplit chief among them, a group-expense and personal-finance app built for real daily use, not a portfolio piece.

I specialize in React Native, TypeScript, Firebase, and native integrations, with hands-on experience in live streaming, real-time chat, payment gateways, maps, push notifications, and getting apps through App Store and Play Store review. I've worked across startup-scale and enterprise products, including white-label platforms and consumer-facing apps end to end.`;

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
    "Beauty Filter Live Streaming (Personal Project)",
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
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  links: ProjectLinks;
  image: string;
  tech: string[];
  status: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "ezysplit",
    title: "EzySplit",
    description:
      "Expense splitting and personal finance tracking app built to simplify group expenses and settlements. Create groups, track shared expenses, calculate balances, and settle up with a UPI deep link when the group's in India — built for real daily use, not a demo.",
    links: {
      playStore:
        "https://play.google.com/store/apps/details?id=com.techtitens.ezysplit",
    },
    image: "/projects/mock5.png",
    tech: [
      "React Native",
      "TypeScript",
      "Firebase",
      "REST APIs",
      "State Management",
      "Android",
    ],
    status: "Live on Play Store",
    featured: true,
  },
  {
    slug: "ageas-federal-life-insurance",
    title: "Ageas Federal Life Insurance",
    description:
      "Full-stack consultant role. Built the app from scratch, now leading Phase 2. Policy management, premium payments, fund tracking, claims processing, and secure document access.",
    links: {
      appStore:
        "https://apps.apple.com/in/app/ageas-federal-life-insurance/id6756178483",
      playStore:
        "https://play.google.com/store/apps/details?id=com.ageasfederal.customer",
      website: "https://mypolicy.ageasfederal.com",
    },
    image: "/projects/mock1.png",
    tech: [
      "React Native",
      "TypeScript",
      "Full-Stack",
      "Firebase",
      "Payment Integration",
    ],
    status: "Live — App Store & Play Store",
  },
  {
    slug: "sodality",
    title: "Sodality",
    description:
      "White-label mobile app platform for nonprofits and membership organizations — a branded mobile experience, engagement tools, and architecture built to scale across many client apps from one codebase.",
    links: {
      website: "https://sodality.app/",
    },
    image: "/projects/mock2.png",
    tech: ["React Native", "TypeScript", "White-label Platform", "Firebase"],
    status: "Live — App Store & Play Store",
  },
  {
    slug: "sociable",
    title: "Sociable",
    description:
      "Social media-style application with a feed, likes, comments, shares, real-time chat over Firebase, and Node.js backend services.",
    links: {},
    image: "/projects/mock3.png",
    tech: ["React Native", "Firebase", "Node.js", "Real-time Chat"],
    status: "Completed",
  },
  {
    slug: "shippity",
    title: "Shippity — Food Delivery",
    description:
      "Food delivery app with real-time order tracking, secure payment integration, and a user-friendly ordering flow end to end.",
    links: {},
    image: "/projects/mock4.png",
    tech: [
      "React Native",
      "Google Maps",
      "Payment Gateways",
      "Real-time Tracking",
    ],
    status: "Completed",
  },
  {
    slug: "taskflow",
    title: "TaskFlow",
    description:
      "Productivity app focused on task management, hydration reminders, and daily routines — clean UI, notification-based reminders, performance-optimized screens.",
    links: {
      github: "https://github.com/codewitharun/Taskflow",
    },
    image: "/projects/mock1.png",
    tech: ["React Native", "TypeScript", "Push Notifications", "Local Storage"],
    status: "In Development",
  },
  {
    slug: "fliptoe",
    title: "Fliptoe",
    description:
      "Personal project — a React Native beauty-filter live streaming app, with advanced ML filters and real-time video processing.",
    links: {
      website: "https://fliptoe.com",
      playStore: "https://play.google.com/store/apps/details?id=com.fliptoe",
    },
    image: "/projects/mock2.png",
    tech: [
      "React Native",
      "ML Filters",
      "Live Streaming",
      "Vision Camera",
      "Skia",
    ],
    status: "In Development",
  },
];

export const siteUrl = "https://techtiten.com";
