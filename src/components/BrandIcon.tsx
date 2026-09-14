"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The icon-only mark (no wordmark) extracted from techtiten-logo.svg —
 * same paths, cropped to their own bounding box — used as a decorative,
 * gently animated accent rather than a second logo. Purely decorative:
 * alt="" and aria-hidden, since the header logo already carries the
 * accessible brand name.
 */
export default function BrandIcon({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.img
      src="/images/techtiten-icon.svg"
      alt=""
      aria-hidden="true"
      className={className}
      animate={
        reduceMotion
          ? undefined
          : {
              y: [0, -14, 0],
              rotate: [0, 3, -3, 0],
            }
      }
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
