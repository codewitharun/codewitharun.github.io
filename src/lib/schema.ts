// src/lib/schema.ts
// JSON-LD structured data linking the Person (Arun Kumar) and
// Organization (Techtiten) entities, per the SEO plan: stable @id values
// so Google treats these as one connected entity graph rather than two
// unrelated names, and sameAs pointing at every verified profile so the
// association is corroborated off-site too.

import { brand, siteUrl, socials } from "@/data/site";

export const personId = `${siteUrl}/#person`;
export const orgId = `${siteUrl}/#organization`;

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
  // Was pointing at self.png, a file that no longer exists (renamed to
  // self.jpeg when the /about page was built) — Google would have quietly
  // dropped this image from search results.
  image: `${siteUrl}/images/self.jpeg`,
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
  logo: `${siteUrl}/images/techtiten-logo.svg`,
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

// ProfilePage wrapper for /about — tells search engines this page IS the
// canonical profile page for the Person entity above, rather than just a
// page that mentions them. References personId/orgId by @id so this stays
// one connected graph instead of duplicating the entity.
export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/about/#profilepage`,
    url: `${siteUrl}/about`,
    mainEntity: { "@id": personId },
  };
}

// BlogPosting schema for individual posts — links each post back to the
// Person (as author) and Organization (as publisher) by @id, so Google
// can connect authorship across every post without re-declaring the
// person each time.
export function blogPostingJsonLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  createdAt: number;
  updatedAt: number;
  coverImage?: string | null;
}) {
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}/#blogposting`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: new Date(post.createdAt).toISOString(),
    dateModified: new Date(post.updatedAt || post.createdAt).toISOString(),
    author: { "@id": personId },
    publisher: { "@id": orgId },
  };
}
