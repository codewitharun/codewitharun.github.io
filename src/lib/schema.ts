// src/lib/schema.ts
// JSON-LD structured data linking the Person (Arun Kumar) and
// Organization (Techtiten) entities, per the SEO plan: stable @id values
// so Google treats these as one connected entity graph rather than two
// unrelated names, and sameAs pointing at every verified profile so the
// association is corroborated off-site too.

import { brand, siteUrl, socials } from "@/data/site";

const personId = `${siteUrl}/#person`;
const orgId = `${siteUrl}/#organization`;

export const personSchema = {
  "@type": "Person",
  "@id": personId,
  name: brand.founder,
  alternateName: ["Tech Titan", "Techtiten"],
  jobTitle: "React Native Developer & Software Engineer",
  hasOccupation: [
    {
      "@type": "Occupation",
      name: "React Native Developer",
    },
    {
      "@type": "Occupation",
      name: "Software Engineer",
    },
  ],
  worksFor: { "@id": orgId },
  url: siteUrl,
  image: `${siteUrl}/images/self.png`,
  sameAs: socials.map((s) => s.href),
  address: {
    "@type": "PostalAddress",
    addressLocality: brand.city,
    addressCountry: brand.country,
  },
  homeLocation: {
    "@type": "Place",
    name: brand.location,
  },
  knowsAbout: [
    "React Native",
    "React Native Development",
    "TypeScript",
    "Firebase",
    "Mobile App Development",
    "Full-Stack Development",
    "Software Engineering",
  ],
};

export const organizationSchema = {
  "@type": "Organization",
  "@id": orgId,
  name: brand.name,
  alternateName: brand.alternateName,
  url: siteUrl,
  founder: { "@id": personId },
  location: {
    "@type": "Place",
    name: brand.location,
  },
  description:
    "Techtiten (Tech Titan) is the software studio of Arun Kumar, a React Native developer and software engineer in Jaipur, India — React Native apps, tools, and experiments, including EzySplit.",
};

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [personSchema, organizationSchema],
  };
}
