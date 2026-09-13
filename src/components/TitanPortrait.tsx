"use client";

// The hero visual, v2: instead of the abstract titan shape standing in
// alone, it becomes an ambient backdrop — pushed back, blurred, and
// dimmed into a glow — with an actual photo of Arun floating in front of
// it. Keeps the brand motif (the distorted "titen" shape) alive as
// atmosphere while making the hero personal rather than purely abstract.
// Everything here is decorative, so the whole thing is aria-hidden; the
// real content (name, tagline, links) lives in the text column beside it.

import { motion } from "framer-motion";
import Image from "next/image";
import TitanShape from "./three/TitanShape";

export default function TitanPortrait() {
  return (
    <div className="relative h-full w-full" aria-hidden="true">
      {/* Backdrop: the original titan shape, scaled up and softened so it
          reads as ambient light/texture rather than the main subject. */}
      <div className="absolute inset-0 scale-125 opacity-80 blur-[1px]">
        <TitanShape />
      </div>

      {/* A slow-pulsing gradient glow directly behind the photo, in the
          brand's mint-to-violet pair, for depth and a bit of life even
          before the photo itself starts floating. */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-mint/40 to-violet/40 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The photo — a gentle, continuous float independent of scroll
          position, so the hero feels quietly alive rather than static. */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center md:items-center"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative h-[94%] w-full max-w-[85%]">
          <Image
            src="/images/arunn-bgremoved.png"
            alt="Arun Kumar"
            fill
            // sizes="(max-width: 768px) 70vw, 420px"
            priority
            className="object-contain object-bottom drop-shadow-[0_25px_60px_rgba(166,104,255,0.4)]"
          />
        </div>
      </motion.div>
    </div>
  );
}
