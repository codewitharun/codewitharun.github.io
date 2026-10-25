import IPhoneFrame from "@/components/IPhoneFrame";
import { getShowcase } from "@/lib/projectImage";
import type { Project } from "@/data/site";

type ProjectMediaProps = {
  project: Project;
  /** Outer wrapper classes: background, border, rounding for the card. */
  className?: string;
  showStatusBadge?: boolean;
  /** case-study hero: bigger phones, eager images */
  hero?: boolean;
};

/**
 * Picks the right presentation per project (see getShowcase):
 *  - plain app screens -> 1-3 iPhones, the first one in front
 *  - a composed graphic -> drawn flat, never framed a second time
 *  - nothing -> a title tile (work apps without public images)
 */
export default function ProjectMedia({ project, className, showStatusBadge, hero }: ProjectMediaProps) {
  const show = getShowcase(project);
  const alt = `${project.title} preview`;

  return (
    <div className={className ?? "relative"}>
      {show.kind === "phones" && (
        <div className={`phone-stage ${hero ? "phone-stage--hero" : ""}`}>
          <div className={`phone-fan phone-fan--${show.shots.length}`}>
            {show.shots.map((src, i) => (
              <IPhoneFrame
                key={src + i}
                src={src}
                alt={i === 0 ? alt : ""}
                className={`phone-fan__item phone-fan__item--${i}`}
                eager={hero}
                inset={project.screenshotsInset}
              />
            ))}
          </div>
        </div>
      )}
      {show.kind === "cover" && (
        <div className="relative aspect-[1024/500] overflow-hidden rounded-[inherit]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static graphic in public/projects */}
          <img src={show.src} alt={alt} className="h-full w-full object-cover" loading={hero ? "eager" : "lazy"} />
        </div>
      )}
      {show.kind === "tile" && (
        <div className={`project-tile ${hero ? "project-tile--hero" : ""}`} aria-hidden>
          <span className="project-tile__mark">{project.title.charAt(0)}</span>
          <span className="project-tile__meta">{project.tech.slice(0, 3).join(" · ")}</span>
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
