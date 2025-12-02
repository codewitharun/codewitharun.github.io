import self from "../img/self.png";
import mock5 from "../img/mock5.png";

export let colors = ["rgb(0,255,164)", "rgb(166,104,255)"];
export let singlePage = false;

export const info = {
  firstName: "Arun",
  lastName: "Kumar",
  initials: "AK",
  position: "Software Engineer · Full-Stack & React Native Developer",
  selfPortrait: self,
  gradient: `-webkit-linear-gradient(135deg, ${colors})`,
  baseColor: colors[0],

  miniBio: [
    { emoji: "⚙️", text: "Engineer who builds, breaks, improves" },
  { emoji: "💻", text: "React Native • Web • Backend" },
  { emoji: "📍", text: "India 🇮🇳" },
  { emoji: "📧", text: "arun4dev@icloud.com" },
],

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

  bio: `Hey! I'm Arun — a software engineer who loves building scalable, user-focused applications. 
  I work across mobile and web, specializing in React Native, Node.js, WebRTC, real-time communication systems, 
  and performance-driven UI/UX. 
  Outside work, I experiment with tech, explore automation ideas, and learn things that make me dangerous in interviews 😄.`,

  skills: {
    proficientWith: [
      "React Native",
      "React",
      "TypeScript",
      "JavaScript",
      "Redux Toolkit",
      "WebRTC",
      "MongoDB",
      "Node.js",
      "Express",
      "Firebase",
      "Git",
      "CI/CD",
      "React Native Web",
      "Vision Camera",
      "Skia",
      "HTML5",
      "CSS3",
      "Figma",
    ],
    learning: [
      "Swift",
      "Kotlin",
      "Cloud Tech (AWS/GCP)",
      "Mobile Security",
      "Machine Learning Filters",
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
      title: "Coming Soon 🚀",
      live: "https://appaura.xyz",
      source: "https://github.com/codewitharun",
      image: mock5,
    },
  ],
};