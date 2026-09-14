import DeviceFrame from "@/components/DeviceFrame";
import { getProjectImage } from "@/lib/projectImage";
import type { Project } from "@/data/site";

type ProjectMediaProps = {
  project: Project;
  /** Outer wrapper classes — background, border, rounding for the card. */
  className?: string;
  showStatusBadge?: boolean;
};

/**
 * Picks the right presentation per project: a live screenshot goes through
 * DeviceFrame's CSS laptop/phone mockup, while a pre-composited mock image
 * (which already draws its own laptop + phone) renders flat, at native
 * crop, so it isn't framed a second time.
 */
export default function ProjectMedia({ project, className, showStatusBadge }: ProjectMediaProps) {
  const { src, isLive } = getProjectImage(project);

  return (
    <div className={className ?? "relative"}>
      {isLive ? (
        <div className="px-6 pt-6 pb-10 md:px-8 md:pt-8 md:pb-12">
          <DeviceFrame src={src} alt={`${project.title} preview`} />
        </div>
      ) : (
        <div className="relative aspect-video overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element -- static asset, kept as a plain img so this branch stays consistent with the live-screenshot one */}
          <img
            src={src}
            alt={`${project.title} preview`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      {showStatusBadge && project.currentlyWorkingOn && (
        <span className="mono-label absolute right-4 top-4 z-10 rounded-full bg-mint px-2.5 py-1 text-[10px] text-bg">
          Currently building
        </span>
      )}
    </div>
  );
}
