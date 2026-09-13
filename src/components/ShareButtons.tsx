"use client";

import { useState } from "react";
import { FaLinkedin, FaInstagram, FaWhatsapp, FaRedditAlien, FaHackerNews } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Check, Link2 } from "lucide-react";

type ShareButtonsProps = {
  url: string; // absolute URL of the post
  title: string;
};

/**
 * LinkedIn and X both have a real "share this URL" web intent, so those
 * open a pre-filled share dialog in a new tab. Instagram has no such
 * intent at all — posts and stories only take images/video from their
 * own app — so that button just copies the link instead, for pasting into
 * a bio link or a Story's link sticker. See the admin's sharing
 * checklist for the fuller workflow this supports.
 */
export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (very old browser, non-HTTPS
      // context) — the link is still visible in the address bar to copy
      // manually, so this just silently no-ops rather than erroring.
    }
  }

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`;
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
  const hackerNewsUrl = `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(url)}&t=${encodeURIComponent(title)}`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <p className="mono-label text-[11px] text-ink-faint">Share:</p>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-mint hover:text-mint"
      >
        <FaLinkedin size={15} />
      </a>
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-mint hover:text-mint"
      >
        <FaXTwitter size={15} />
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-mint hover:text-mint"
      >
        <FaWhatsapp size={15} />
      </a>
      <a
        href={redditUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Reddit"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-mint hover:text-mint"
      >
        <FaRedditAlien size={15} />
      </a>
      <a
        href={hackerNewsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Submit to Hacker News"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-mint hover:text-mint"
      >
        <FaHackerNews size={15} />
      </a>
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link for Instagram"
        title="Instagram has no link-share button — copy the link to paste into your bio or a Story sticker"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-soft transition-colors hover:border-mint hover:text-mint"
      >
        <FaInstagram size={15} />
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:border-mint hover:text-mint"
      >
        {copied ? <Check size={13} /> : <Link2 size={13} />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
