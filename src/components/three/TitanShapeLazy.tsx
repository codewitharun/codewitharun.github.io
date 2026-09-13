"use client";

// The actual TitanShape scene pulls in three.js + @react-three/fiber +
// @react-three/drei — a ~900KB chunk that was previously part of the
// homepage's initial script payload (it showed up as a render-blocking
// request and a big chunk of "unused"/"legacy" JS in Lighthouse audits,
// since most of it isn't needed until well after first paint). Loading it
// through next/dynamic with ssr:false code-splits it into its own chunk
// that's fetched after the initial bundle, instead of shipping upfront —
// the decorative WebGL blob is not the LCP element (the heading text is),
// so there's nothing lost by having it pop in slightly after the rest of
// the hero. The fallback below reserves the same box (gradient + border,
// no motion) so there's no layout shift while the real scene loads.
import dynamic from "next/dynamic";

const TitanShape = dynamic(() => import("./TitanShape"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(166,104,255,0.35),rgba(0,255,164,0.12)_45%,transparent_70%)]"
    />
  ),
});

export default TitanShape;
