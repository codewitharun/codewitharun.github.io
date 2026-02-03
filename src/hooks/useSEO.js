import { useEffect } from 'react';

/**
 * Custom hook to update page title and meta tags for SEO
 * @param {Object} seoData - SEO data object
 * @param {string} seoData.title - Page title
 * @param {string} seoData.description - Meta description
 * @param {string} seoData.keywords - Meta keywords (optional)
 * @param {string} seoData.image - Open Graph image URL (optional)
 * @param {string} seoData.url - Canonical URL (optional)
 */
export default function useSEO({ title, description, keywords, image, url }) {
  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title;
    }

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    if (description) {
      metaDescription.setAttribute('content', description);
    }

    // Update or create meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Update Open Graph tags
    const updateOGTag = (property, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    if (title) updateOGTag('og:title', title);
    if (description) updateOGTag('og:description', description);
    if (url) updateOGTag('og:url', url);
    if (image) updateOGTag('og:image', image);

    // Update Twitter Card tags
    const updateTwitterTag = (name, content) => {
      if (!content) return;
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    if (title) updateTwitterTag('twitter:title', title);
    if (description) updateTwitterTag('twitter:description', description);
    if (image) updateTwitterTag('twitter:image', image);

    // Update canonical URL
    if (url) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }
  }, [title, description, keywords, image, url]);
}
