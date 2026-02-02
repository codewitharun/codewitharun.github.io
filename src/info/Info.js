import self from "../img/self.png";
import mock5 from "../img/mock5.png";

export const colors = ["rgb(0,255,164)", "rgb(166,104,255)"];
export const singlePage = false;

export const info = {
  firstName: "Arun",
  lastName: "Kumar",
  initials: "AK",
  position: "Senior React Native Developer",
  location: "Jaipur, India",
  selfPortrait: self,
  gradient: `-webkit-linear-gradient(135deg, ${colors})`,
  baseColor: colors[0],

  miniBio: [
    { emoji: "💻", text: "React Native • TypeScript • Full-Stack" },
    { emoji: "🏢", text: "Full-Stack Consultant @ Federal Bank / Ageas Federal" },
    { emoji: "📍", text: "Jaipur, India 🇮🇳" },
    { emoji: "📧", text: "arun4dev@icloud.com" },
  ],

  contact: {
    email: "arun4dev@icloud.com",
    phone: "+91 86012 79944",
    resume: "/Resume.pdf",
  },

  socials: [
    {
      link: "https://github.com/codewitharun",
      icon: "fa fa-github",
      label: "GitHub",
    },
    {
      link: "https://linkedin.com/in/arunk4it",
      icon: "fa fa-linkedin",
      label: "LinkedIn",
    },
    {
      link: "https://instagram.com/_arun.js",
      icon: "fa fa-instagram",
      label: "Instagram",
    },
    {
      link: "https://x.com/arunk4it",
      icon: "fa fa-twitter",
      label: "twitter",
    },
  ],

  bio: `React Native Developer with ~4 years of hands-on experience building scalable, production-grade mobile applications for Android and iOS. Currently working as a Full-Stack Consultant at Federal Bank / Ageas Federal Life Insurance, where I created the Ageas Federal Life Insurance app from scratch and am now working on Phase 2.

I specialize in React Native, TypeScript, Firebase, Redux, and native integrations, with practical exposure to live streaming, real-time chat, payment gateways, maps, notifications, and App Store / Play Store deployments. I have worked on startup-scale and enterprise-level products, including white-label platforms and consumer-facing apps.

Known for independent problem-solving, I regularly research, debug, and implement complex features end-to-end. I've also taken informal team-lead responsibilities, mentoring junior developers, reviewing code, and ensuring delivery quality. My long-term focus is on building high-impact products, improving system design skills, and moving towards ownership-driven engineering roles.`,

  skills: {
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
  },

  hobbies: [
    { label: "Cooking", emoji: "🌶" },
    { label: "Reading", emoji: "📖" },
    { label: "Movies", emoji: "🎥" },
    { label: "Tech Experiments", emoji: "⚙️" },
  ],

  portfolio: [
    {
      title: "Ageas Federal Life Insurance",
      description: "Full-stack consultant role. Created the app from scratch, currently working on Phase 2. Features include policy management, premium payments, fund tracking, claims processing, and secure document access.",
      live: "https://apps.apple.com/in/app/ageas-federal-life-insurance/id6756178483",
      source: "https://play.google.com/store/apps/details?id=com.ageasfederal.customer",
      image: mock5,
      tech: ["React Native", "TypeScript", "Full-Stack", "Firebase", "Payment Integration"],
      status: "Live - App Store & Play Store",
    },
    {
      title: "Sodality",
      description: "White-label mobile app platform for nonprofits and membership organizations. Features branded mobile experience, user engagement tools, and scalable architecture.",
      live: "https://sodality.app/",
      source: "https://sodality.app/",
      image: mock5,
      tech: ["React Native", "TypeScript", "White-label Platform", "Firebase"],
      status: "Live - App Store & Play Store",
    },
    {
      title: "TaskFlow",
      description: "Productivity app focused on task management, hydration reminders, and daily routines. Features clean UI/UX, notification-based reminders, and performance-optimized screens.",
      live: "#https://github.com/codewitharun/Taskflow",
      source: "#https://github.com/codewitharun/Taskflow",
      image: mock5,
      tech: ["React Native", "TypeScript", "Push Notifications", "Local Storage"],
      status: "In Development",
    },
    {
      title: "Shippity - Food Delivery",
      description: "Food delivery app with real-time order tracking, secure payment integration, and user-friendly ordering flow.",
      live: "#",
      source: "#",
      image: mock5,
      tech: ["React Native", "Google Maps", "Payment Gateways", "Real-time Tracking"],
      status: "Completed",
    },
    {
      title: "Sociable",
      description: "Social media-style application with feed, likes, comments, shares, real-time chat using Firebase, and Node.js backend services.",
      live: "#",
      source: "#",
      image: mock5,
      tech: ["React Native", "Firebase", "Node.js", "Real-time Chat"],
      status: "Completed",
    },
    {
      title: "EzySplit",
      description:
        "Expense splitting and personal finance tracking app designed to simplify group expenses and settlements. Enables users to create groups, track shared expenses, calculate individual balances, and manage settlements seamlessly with a clean and intuitive UI. Built with performance and scalability in mind for real-world daily usage.",
      live: "https://play.google.com/store/apps/details?id=com.techtitens.ezysplit",
      source: "https://play.google.com/store/apps/details?id=com.techtitens.ezysplit",
      image: mock5,
      tech: [
        "React Native",
        "JavaScript",
        "Firebase",
        "REST APIs",
        "State Management",
        "Android"
      ],
      status: "Live on Play Store",
    },
    {
      title: "Beauty Filter Live Stream",
      description: "Personal project - React Native app with beauty filter live streaming capabilities using advanced ML filters and real-time video processing.",
      live: "#",
      source: "https://fliptoe.com",
      image: mock5,
      tech: ["React Native", "ML Filters", "Live Streaming", "Vision Camera", "Skia"],
      status: "In Development",
    },
  ],
};